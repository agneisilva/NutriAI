from __future__ import annotations

import json
import logging
from typing import Any

import boto3
import httpx

from app.config import get_settings

logger = logging.getLogger(__name__)


class GeminiClient:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._secret_cache: str | None = None
        self._sm_client = boto3.client("secretsmanager", region_name=self.settings.aws_region)

    def _read_api_key(self) -> str | None:
        if self.settings.gemini_api_key:
            return self.settings.gemini_api_key

        if self._secret_cache:
            return self._secret_cache

        arn = self.settings.gemini_api_key_secret_arn
        if not arn:
            return None

        response = self._sm_client.get_secret_value(SecretId=arn)
        raw = response.get("SecretString", "")
        if raw.strip().startswith("{"):
            data = json.loads(raw)
            value = data.get("api_key") or data.get("GEMINI_API_KEY")
        else:
            value = raw.strip()

        self._secret_cache = value
        return value

    def normalize_answer(self, field: str, user_answer: str) -> dict[str, Any] | None:
        api_key = self._read_api_key()
        if not api_key:
            logger.warning("Gemini API key unavailable, using deterministic fallback")
            return None

        prompt = {
            "task": "Normalize nutrition anamnese answer",
            "field": field,
            "user_answer": user_answer,
            "rules": [
                "Return strict JSON only",
                "Keys required: value, is_valid, reason, followup_question",
                "No markdown"
            ],
            "examples": {
                "weight_kg": {"value": 82.0, "is_valid": True, "reason": "ok", "followup_question": ""},
                "invalid": {"value": None, "is_valid": False, "reason": "invalid_format", "followup_question": "Pode repetir no formato esperado?"}
            }
        }

        payload = {
            "contents": [{
                "parts": [{"text": json.dumps(prompt, ensure_ascii=False)}]
            }],
            "generationConfig": {
                "temperature": 0,
                "maxOutputTokens": self.settings.gemini_max_output_tokens,
                "responseMimeType": "application/json",
            },
        }

        endpoint = (
            f"https://generativelanguage.googleapis.com/v1beta/models/{self.settings.gemini_model}:generateContent"
            f"?key={api_key}"
        )

        attempts = 2
        for attempt in range(1, attempts + 1):
            try:
                with httpx.Client(timeout=self.settings.gemini_timeout_seconds) as client:
                    resp = client.post(endpoint, json=payload)
                if resp.status_code >= 500 and attempt < attempts:
                    continue
                resp.raise_for_status()

                body = resp.json()
                candidates = body.get("candidates", [])
                text = ""
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        text = parts[0].get("text", "")

                if not text:
                    return None

                parsed = json.loads(text)
                if not isinstance(parsed, dict):
                    return None
                return {
                    "value": parsed.get("value"),
                    "is_valid": bool(parsed.get("is_valid")),
                    "reason": str(parsed.get("reason", "")),
                    "followup_question": str(parsed.get("followup_question", "")),
                }
            except (httpx.TimeoutException, httpx.HTTPError, json.JSONDecodeError, KeyError, ValueError) as exc:
                logger.warning("Gemini normalization failed attempt=%s reason=%s", attempt, type(exc).__name__)
                if attempt >= attempts:
                    return None

        return None
