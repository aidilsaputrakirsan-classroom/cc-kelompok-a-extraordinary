import httpx
from fastapi import HTTPException
from app.config import settings

TIMEOUT = 5.0

def get_item(item_id: str, jwt_token: str) -> dict | None:
    headers = {"Authorization": f"Bearer {jwt_token}"}
    url = f"{settings.ITEM_SERVICE_URL}/items/{item_id}"
    try:
        with httpx.Client(timeout=TIMEOUT) as client:
            response = client.get(url, headers=headers)
            if response.status_code == 404:
                return None
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menghubungi item-service: {exc}"
        )

def update_item_status(item_id: str, new_status: str, jwt_token: str) -> bool:
    headers = {"Authorization": f"Bearer {jwt_token}"}
    url = f"{settings.ITEM_SERVICE_URL}/items/{item_id}/status"
    payload = {"status": new_status}
    try:
        with httpx.Client(timeout=TIMEOUT) as client:
            response = client.put(url, json=payload, headers=headers)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail=response.json().get("detail", "Gagal memperbarui status item")
                )
            return True
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menghubungi item-service untuk pembaruan status: {exc}"
        )

def get_admins(jwt_token: str) -> list[dict]:
    headers = {"Authorization": f"Bearer {jwt_token}"}
    url = f"{settings.AUTH_SERVICE_URL}/auth/users/admins"
    try:
        with httpx.Client(timeout=TIMEOUT) as client:
            response = client.get(url, headers=headers)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menghubungi auth-service untuk daftar admin: {exc}"
        )
