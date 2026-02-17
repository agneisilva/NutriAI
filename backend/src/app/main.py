from __future__ import annotations

import logging

from fastapi import Depends, FastAPI

from app.config import get_settings
from app.middleware.auth import get_auth_context
from app.routes import anamnese, health

logging.basicConfig(level=logging.INFO)

settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0")

app.include_router(health.router)
app.include_router(anamnese.router, dependencies=[Depends(get_auth_context)])
