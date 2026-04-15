import logging
from firebase_admin import auth
from fastapi import HTTPException, status

logger = logging.getLogger(__name__)

def verify_firebase_token(id_token: str) -> dict:
    """
    Verifies a Firebase ID token using the Firebase Admin SDK.
    Returns the decoded token dictionary if valid.
    Raises HTTPException if invalid.
    """
    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except auth.ExpiredIdTokenError:
        logger.warning("Firebase token expired.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Firebase token expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except auth.InvalidIdTokenError as e:
        logger.warning(f"Invalid Firebase token: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception as e:
        logger.error(f"Error verifying firebase token: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate Firebase credentials: {type(e).__name__}: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
