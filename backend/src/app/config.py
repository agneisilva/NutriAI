from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class Settings:
    app_name: str
    env: str
    aws_region: str
    dynamodb_table_name: str
    auth_enabled: bool
    gemini_model: str
    gemini_timeout_seconds: float
    gemini_max_output_tokens: int
    gemini_api_key_secret_arn: str | None
    gemini_api_key: str | None


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("APP_NAME", "nutriai-anamnese"),
        env=os.getenv("APP_ENV", "dev"),
        aws_region=os.getenv("AWS_REGION", "us-east-1"),
        dynamodb_table_name=os.getenv("DDB_TABLE_NAME", "nutriai_anamnese_sessions_dev"),
        auth_enabled=os.getenv("AUTH_ENABLED", "false").strip().lower() == "true",
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite"),
        gemini_timeout_seconds=float(os.getenv("GEMINI_TIMEOUT_SECONDS", "8")),
        gemini_max_output_tokens=int(os.getenv("GEMINI_MAX_OUTPUT_TOKENS", "120")),
        gemini_api_key_secret_arn=os.getenv("GEMINI_API_KEY_SECRET_ARN"),
        gemini_api_key=os.getenv("GEMINI_API_KEY"),
    )
