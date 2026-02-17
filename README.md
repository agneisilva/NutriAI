# NutriAI - Backend + Infra (for dummies)

Este repositório está preparado para subir **apenas backend serverless** na AWS (dev), com:

- API Gateway HTTP API
- AWS Lambda (Python/FastAPI)
- DynamoDB (sessões com TTL de 7 dias)
- CloudWatch Logs
- Secrets Manager (GEMINI_API_KEY)
- CI/CD no GitHub Actions com OIDC

Região padrão: **us-east-1**.

## Pré-requisitos

- Git
- AWS CLI configurado (`aws configure`)
- Terraform `1.7.5+`
- Python 3.11
- `jq` (para script de teste)

## Estrutura

- `.github/workflows/cicd.yml`
- `backend/` (API FastAPI para Lambda)
- `infra/` (Terraform bootstrap + env dev + módulos)

## Passo a passo (zero até deploy)

### 1) Clonar

```bash
git clone <URL_DO_REPO>
cd NutriAI
```

### 2) Configurar secret no GitHub

No repositório GitHub:
- `Settings -> Secrets and variables -> Actions`
- Criar **Secret**: `GEMINI_API_KEY`
- Criar **Variable**: `ROLE_TO_ASSUME` (ARN da role OIDC que o GitHub vai assumir)

### 3) Bootstrap Terraform (estado remoto)

```bash
cd infra/bootstrap
terraform init
terraform apply -auto-approve
terraform output
```

Anote:
- `tfstate_bucket_name`
- `terraform_lock_table_name`

### 4) Configurar backend remoto do Terraform dev

Edite `infra/envs/dev/backend.tf` com os valores do passo anterior.

### 5) Deploy dev via GitHub Actions (recomendado)

Faça push para `main`:

```bash
git add .
git commit -m "backend+infra dev"
git push origin main
```

O workflow:
- faz plan em PR/push
- faz build da Lambda + apply no push da `main`

### 6) Deploy dev manual (opcional)

```bash
cd backend
chmod +x scripts/build_zip.sh
./scripts/build_zip.sh

cd ../infra/envs/dev
terraform init
export TF_VAR_gemini_api_key="SUA_CHAVE_GEMINI"
terraform apply -auto-approve
terraform output
```

Pegue `api_base_url` do output.

### 7) Testar API antes do app mobile

```bash
chmod +x backend/scripts/test_api.sh
./backend/scripts/test_api.sh <api_base_url>
```

Esse script testa:
1. `/health`
2. `/v1/anamnese/start`
3. fluxo completo de respostas
4. valida final com `bmi` e `summary`

## Leitura complementar

- Infra detalhada: `infra/README.md`
- Backend e curls: `backend/README.md`
