from __future__ import annotations

from fastapi import APIRouter

from app.config import get_settings
from app.models.api import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(ok=True, service=settings.app_name, env=settings.env)
