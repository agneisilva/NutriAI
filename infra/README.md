# Infraestrutura (Terraform)

Este diretório provisiona backend serverless na AWS (dev): Lambda + API Gateway HTTP API + DynamoDB + Logs + Secrets.

## 1) Bootstrap (estado remoto Terraform)

```bash
cd infra/bootstrap
terraform init
terraform apply -auto-approve
terraform output
```

Guarde os outputs:
- `tfstate_bucket_name`
- `terraform_lock_table_name`

## 2) Configurar backend remoto do env dev

Edite `infra/envs/dev/backend.tf` e preencha:
- bucket
- key (`nutriai/dev/terraform.tfstate`)
- region (`us-east-1`)
- dynamodb_table

## 3) Deploy dev manual

Antes, gere zip da Lambda:

```bash
cd backend
chmod +x scripts/build_zip.sh
./scripts/build_zip.sh
```

Agora terraform dev:

```bash
cd ../infra/envs/dev
terraform init
export TF_VAR_gemini_api_key="SUA_CHAVE_GEMINI"
terraform apply -auto-approve
terraform output
```

Outputs importantes:
- `api_base_url`
- `dynamodb_table_name`
- `lambda_function_name`
- `secret_arn`

## Custos e arquitetura

- Sem VPC/NAT.
- API Gateway HTTP API + Lambda + DynamoDB on-demand.
- CORS `*` somente em dev (em produção, restringir origem).
