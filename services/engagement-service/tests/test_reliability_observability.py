import time
from unittest.mock import MagicMock, patch

import httpx

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
