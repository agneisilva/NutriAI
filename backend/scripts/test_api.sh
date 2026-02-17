#!/usr/bin/env bash
set -euo pipefail

API_BASE_URL="${1:-${API_BASE_URL:-}}"

if [[ -z "$API_BASE_URL" ]]; then
  echo "Uso: ./backend/scripts/test_api.sh <api_base_url>"
  echo "Exemplo: ./backend/scripts/test_api.sh https://abc123.execute-api.us-east-1.amazonaws.com"
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl não encontrado. Instale curl e tente novamente."
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq não encontrado."
  echo "Windows (choco): choco install jq"
  echo "Ou use Git Bash + jq instalado manualmente."
  exit 1
fi

echo "[1/4] Testando /health"
HEALTH=$(curl -sS "$API_BASE_URL/health")
echo "$HEALTH" | jq .

echo "[2/4] Iniciando sessão"
START=$(curl -sS -X POST "$API_BASE_URL/v1/anamnese/start" \
  -H 'Content-Type: application/json' \
  -d '{"language":"pt-BR"}')

echo "$START" | jq .
SESSION_ID=$(echo "$START" | jq -r '.session_id')

if [[ -z "$SESSION_ID" || "$SESSION_ID" == "null" ]]; then
  echo "Falha ao obter session_id"
  exit 1
fi

send_answer() {
  local answer="$1"
  curl -sS -X POST "$API_BASE_URL/v1/anamnese/answer" \
    -H 'Content-Type: application/json' \
    -d "{\"session_id\":\"$SESSION_ID\",\"answer\":\"$answer\"}"
}

echo "[3/4] Jornada completa"
RESP=$(send_answer "perder peso")
echo "$RESP" | jq .
RESP=$(send_answer "34")
echo "$RESP" | jq .
RESP=$(send_answer "masculino")
echo "$RESP" | jq .
RESP=$(send_answer "82")
echo "$RESP" | jq .
RESP=$(send_answer "175")
echo "$RESP" | jq .
RESP=$(send_answer "moderada")
echo "$RESP" | jq .
RESP=$(send_answer "sem carne de porco")
echo "$RESP" | jq .

echo "[4/4] Validando resultado final"
DONE=$(echo "$RESP" | jq -r '.done')
BMI=$(echo "$RESP" | jq -r '.bmi')
SUMMARY=$(echo "$RESP" | jq -r '.summary')

if [[ "$DONE" != "true" ]]; then
  echo "Fluxo não finalizou como esperado"
  exit 1
fi

echo "✅ Teste concluído"
echo "BMI: $BMI"
echo "Summary: $SUMMARY"
