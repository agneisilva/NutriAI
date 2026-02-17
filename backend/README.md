# Backend NutriAI (FastAPI + Lambda)

Backend serverless para anamnese nutricional com fluxo fixo, DynamoDB e integração opcional com Gemini para normalização de respostas.

## Endpoints

- `GET /health`
- `POST /v1/anamnese/start`
- `POST /v1/anamnese/answer`

## Rodar local

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
chmod +x scripts/run_local.sh
./scripts/run_local.sh
```

Health:

```bash
curl -s http://localhost:8000/health | jq .
```

## Exemplo curl manual

```bash
curl -s -X POST http://localhost:8000/v1/anamnese/start -H 'Content-Type: application/json' -d '{"language":"pt-BR"}' | jq .
```

Depois envie respostas com `session_id`:

```bash
curl -s -X POST http://localhost:8000/v1/anamnese/answer \
  -H 'Content-Type: application/json' \
  -d '{"session_id":"<uuid>","answer":"perder peso"}' | jq .
```

## Teste ponta a ponta (API deployada)

```bash
chmod +x scripts/test_api.sh
./scripts/test_api.sh https://SEU_API_ID.execute-api.us-east-1.amazonaws.com
```

## Observações de auth

- `AUTH_ENABLED=false` por padrão (anônimo para testes).
- Se `AUTH_ENABLED=true`, exige `Authorization: Bearer <jwt>` (validação real JWKS está como TODO).

## Observações LLM

- Modelo default: `gemini-2.5-flash-lite`.
- LLM só normaliza resposta por campo; fluxo de perguntas é fixo no backend.
- Em timeout/erro do LLM, fallback determinístico é aplicado.
