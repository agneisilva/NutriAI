#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

export APP_ENV="dev"
export AWS_REGION="us-east-1"
export DDB_TABLE_NAME="nutriai_anamnese_sessions_dev"
export AUTH_ENABLED="false"
export GEMINI_MODEL="gemini-2.5-flash-lite"
export GEMINI_TIMEOUT_SECONDS="8"
export GEMINI_MAX_OUTPUT_TOKENS="120"

cd "$ROOT_DIR"
python -m uvicorn src.app.main:app --host 0.0.0.0 --port 8000 --reload
