import time
from unittest.mock import MagicMock, patch

import httpx
import pytest
from fastapi import HTTPException

from app.claims.schemas import ClaimStatusUpdate
from app.claims.service import update_claim_status
from app.models.claim import Claim
from app.utils import httpx_client
from app.utils.httpx_client import CircuitBreaker, request_with_retry_and_cb
from app.utils.logging_config import correlation_id_ctx


def test_status_endpoint_format(client):
    # Mock health checks to downstream services
    with patch("httpx.AsyncClient.get") as mock_get:
        # Mock responses for auth and item services
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_get.return_value = mock_response

        response = client.get("/status")
        assert response.status_code == 200
        data = response.json()
        assert "services" in data
        services = {s["name"]: s for s in data["services"]}
        assert "auth" in services
        assert "item" in services
        assert "engagement" in services
        assert services["auth"]["status"] in ("up", "down")

def test_metrics_endpoint(client):
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "request_total" in response.text

def test_circuit_breaker_transitions():
    cb = CircuitBreaker("test-cb")
    assert cb.state == "CLOSED"

    # Trigger 5 failures
    for _ in range(5):
        cb.record_failure()

    assert cb.state == "OPEN"

    # Try checking state right away (cooldown not elapsed)
    assert cb.check_state() == "OPEN"

    # Mock elapsed time
    with patch("time.time", return_value=time.time() + 61):
        assert cb.check_state() == "HALF_OPEN"
        # Record a success -> should go to CLOSED
        cb.record_success()
        assert cb.state == "CLOSED"

def test_circuit_breaker_half_open_failure():
    cb = CircuitBreaker("test-cb2")
    for _ in range(5):
        cb.record_failure()
    assert cb.state == "OPEN"

    # Move to half open
    with patch("time.time", return_value=time.time() + 61):
        assert cb.check_state() == "HALF_OPEN"
        # Record a failure -> should go back to OPEN immediately
        cb.record_failure()
        assert cb.state == "OPEN"

def test_correlation_id_propagation():
    # Set correlation ID context
    token = correlation_id_ctx.set("test-123-corr")

    with patch("httpx.Client.request") as mock_request:
        mock_res = MagicMock()
        mock_res.status_code = 200
        mock_request.return_value = mock_res

        # Make a call
        cb = CircuitBreaker("test-cb-corr")
        request_with_retry_and_cb(cb, "GET", "http://localhost/test")

        # Verify header propagation
        args, kwargs = mock_request.call_args
        assert "X-Correlation-ID" in kwargs["headers"]
        assert kwargs["headers"]["X-Correlation-ID"] == "test-123-corr"

    correlation_id_ctx.reset(token)

def test_get_admins_forwards_authorization_header():
    with patch("app.utils.httpx_client.request_with_retry_and_cb") as mock_request:
        mock_res = MagicMock()
        mock_res.json.return_value = [{"id": "admin-1"}]
        mock_request.return_value = mock_res

        admins = httpx_client.get_admins("jwt-token")

        assert admins == [{"id": "admin-1"}]
        args, kwargs = mock_request.call_args
        assert args[1] == "GET"
        assert kwargs["headers"]["Authorization"] == "Bearer jwt-token"

def test_non_retryable_4xx_raises_without_retry():
    cb = CircuitBreaker("test-cb-4xx")

    with patch("httpx.Client.request") as mock_request:
        response = httpx.Response(403, request=httpx.Request("GET", "http://localhost/test"))
        mock_request.return_value = response

        with pytest.raises(httpx.HTTPStatusError):
            request_with_retry_and_cb(cb, "GET", "http://localhost/test")

        assert mock_request.call_count == 1
        assert cb.state == "CLOSED"

def test_update_claim_status_blocks_when_item_service_down(db_session):
    claim = Claim(
        id="claim-item-down",
        item_id="item-down",
        user_id="claim-owner",
        status="pending",
        ownership_answer="Jawaban klaim",
    )
    db_session.add(claim)
    db_session.commit()

    with patch(
        "app.claims.service.httpx_client.get_item",
        side_effect=HTTPException(status_code=502, detail="item-service down"),
    ), pytest.raises(HTTPException) as exc_info:
        update_claim_status(
            db_session,
            claim.id,
            ClaimStatusUpdate(status="approved"),
            "admin-user",
            "admin",
            "jwt-token",
        )

    db_session.refresh(claim)
    assert exc_info.value.status_code == 503
    assert claim.status == "pending"

@patch("time.sleep", return_value=None) # Skip sleep during retries
def test_retry_on_5xx_status(mock_sleep):
    cb = CircuitBreaker("test-cb-retry")

    with patch("httpx.Client.request") as mock_request:
        # Mock 3 failures then 1 success
        fail_res = MagicMock()
        fail_res.status_code = 500
        fail_res.raise_for_status.side_effect = httpx.HTTPStatusError("500 Internal Server Error", request=MagicMock(), response=fail_res)

        success_res = MagicMock()
        success_res.status_code = 200

        mock_request.side_effect = [fail_res, fail_res, fail_res, success_res]

        res = request_with_retry_and_cb(cb, "GET", "http://localhost/test")
        assert res.status_code == 200
        assert mock_request.call_count == 4
