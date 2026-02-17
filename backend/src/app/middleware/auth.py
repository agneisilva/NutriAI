from __future__ import annotations

from typing import Any

from fastapi import Header, HTTPException

from app.config import get_settings


def get_auth_context(authorization: str | None = Header(default=None)) -> dict[str, Any]:
    settings = get_settings()
    if not settings.auth_enabled:
        return {"auth_enabled": False, "anonymous": True}

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")

    parts = authorization.strip().split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer" or not parts[1].strip():
        raise HTTPException(status_code=401, detail="Invalid bearer token format")

    token = parts[1].strip()
    token_parts = token.split(".")
    if len(token_parts) != 3:
        raise HTTPException(status_code=401, detail="Invalid JWT format")

    # TODO: Validate signature and claims with JWKS for real auth.
    return {
        "auth_enabled": True,
        "token_present": True,
        "user_sub": None,
        "tenant_id": None,
    }
