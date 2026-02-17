from __future__ import annotations

import time
import uuid
from datetime import UTC, datetime
from decimal import Decimal
from typing import Any

import boto3

from app.config import get_settings


_settings = get_settings()
_dynamodb = boto3.resource("dynamodb", region_name=_settings.aws_region)
_table = _dynamodb.Table(_settings.dynamodb_table_name)


def _now_iso() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def _pk(session_id: str) -> str:
    return f"SESSION#{session_id}"


def _to_ddb(value: Any) -> Any:
    if isinstance(value, float):
        return Decimal(str(value))
    if isinstance(value, dict):
        return {k: _to_ddb(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_to_ddb(v) for v in value]
    return value


def _from_ddb(value: Any) -> Any:
    if isinstance(value, Decimal):
        if value % 1 == 0:
            return int(value)
        return float(value)
    if isinstance(value, dict):
        return {k: _from_ddb(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_from_ddb(v) for v in value]
    return value


def create_session(language: str = "pt-BR") -> dict[str, Any]:
    session_id = str(uuid.uuid4())
    now = _now_iso()
    ttl = int(time.time()) + (7 * 24 * 60 * 60)

    item = {
        "PK": _pk(session_id),
        "session_id": session_id,
        "step": 1,
        "data": {},
        "language": language,
        "created_at": now,
        "updated_at": now,
        "ttl": ttl,
        "status": "ACTIVE",
    }
    _table.put_item(Item=_to_ddb(item))
    return item


def get_session(session_id: str) -> dict[str, Any] | None:
    result = _table.get_item(Key={"PK": _pk(session_id)})
    item = result.get("Item")
    if not item:
        return None
    return _from_ddb(item)


def update_session(session_id: str, patch: dict[str, Any]) -> dict[str, Any]:
    current = get_session(session_id)
    if not current:
        raise KeyError("session_not_found")

    merged = {**current, **patch}
    merged["updated_at"] = _now_iso()
    _table.put_item(Item=_to_ddb(merged))
    return merged


def mark_done(session_id: str, patch: dict[str, Any] | None = None) -> dict[str, Any]:
    payload = patch or {}
    payload["status"] = "DONE"
    return update_session(session_id, payload)
