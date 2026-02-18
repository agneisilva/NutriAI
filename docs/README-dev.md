# NutriAI - Guia do Desenvolvedor

Documentação técnica para setup local, desenvolvimento e troubleshooting do projeto NutriAI.

---

## 📋 Pré-requisitos

### Obrigatório
- **Node.js** 18+ e npm
- **Python** 3.11+
- **AWS CLI** v2 configurado
- **Terraform** 1.7.5+
- **Git**

### Opcional (mobile)
- **Android Studio** (emulador Android)
- **Xcode** (macOS, para iOS)
- **Expo Go** app no celular físico

---

## 🚀 Setup Local

### 1. Clone do Repositório
```bash
git clone https://github.com/agneisilva/NutriAI.git
cd NutriAI
```

### 2. Backend (Python)

#### Criar ambiente virtual
```bash
# Windows PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Linux/macOS
python3 -m venv .venv
source .venv/bin/activate
```

#### Instalar dependências
```bash
cd backend
pip install -r requirements.txt
```

#### Configurar variáveis de ambiente (local)
Crie `backend/.env` (ou use variáveis de ambiente):
```bash
# Opcional: para testar com Gemini real
export GEMINI_API_KEY="sua-chave-aqui"

# Configurações locais
export APP_ENV="local"
export AWS_REGION="us-east-1"
export DDB_TABLE_NAME="nutriai_anamnese_sessions_dev"
export AUTH_ENABLED="false"
export GEMINI_MODEL="gemini-2.5-flash-lite"
export GEMINI_TIMEOUT_SECONDS="8"
export GEMINI_MAX_OUTPUT_TOKENS="120"
```

### 3. App Mobile (React Native + Expo)

#### Instalar dependências
```bash
cd app
npm install
```

#### Configurar API URL
Crie `app/.env` (baseado em `.env.example`):
```bash
API_URL=https://7tewq45bpd.execute-api.us-east-1.amazonaws.com
APP_NAME=NutriAI
```

**Para desenvolvimento local com backend rodando localmente:**
```bash
# Substitua pelo IP da sua máquina na rede local (não use localhost)
API_URL=http://192.168.1.X:8000
```

### 4. Infraestrutura (Terraform)

#### Inicializar backend remoto (primeira vez)
```bash
cd infra/bootstrap
terraform init
terraform apply -auto-approve
```

#### Configurar ambiente dev
```bash
cd ../envs/dev
terraform init

# Configurar GEMINI_API_KEY
export TF_VAR_gemini_api_key="sua-chave-aqui"

# Verificar plano
terraform plan
```

---

## ▶️ Rodar o Projeto

### Backend Local

#### Opção 1: Script de conveniência (recomendado)
```bash
cd backend
chmod +x scripts/run_local.sh  # apenas primeira vez
./scripts/run_local.sh
```

Abre em: http://localhost:8000

#### Opção 2: Diretamente com Uvicorn
```bash
cd backend
# Com venv ativo
uvicorn src.app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Endpoints disponíveis:
- `GET http://localhost:8000/health`
- `POST http://localhost:8000/v1/anamnese/start`
- `POST http://localhost:8000/v1/anamnese/answer`

### App Mobile

#### Iniciar Expo Dev Server
```bash
cd app
npm start
```

#### Opções de execução:
- **Expo Go (celular físico)**: Escaneia QR code no terminal
- **Emulador Android**: Pressiona `a` no terminal ou `npm run android`
- **Simulador iOS** (macOS): Pressiona `i` no terminal ou `npm run ios`
- **Web** (experimental): Pressiona `w` no terminal ou `npm run web`

#### Hot reload automático
Qualquer alteração em `app/src/**` recarrega automaticamente no device.

### Infraestrutura (Deploy AWS)

#### Build do Lambda
```bash
cd backend
chmod +x scripts/build_zip.sh  # apenas primeira vez
./scripts/build_zip.sh
# Gera: backend/dist/lambda.zip
```

#### Deploy manual
```bash
cd infra/envs/dev
terraform apply -auto-approve

# Ver outputs
terraform output -json
```

#### Deploy automático (CI/CD)
Basta fazer push na branch `main`:
```bash
git add .
git commit -m "feat: minha feature"
git push origin main
```

GitHub Actions executa:
1. Build do Lambda zip
2. Terraform plan + apply
3. Publica na AWS automaticamente

---

## 🧪 Testes

### Backend

#### Teste end-to-end da API (dev)
```bash
cd backend
chmod +x scripts/test_api.sh  # apenas primeira vez
./scripts/test_api.sh https://7tewq45bpd.execute-api.us-east-1.amazonaws.com
```

**Requer:** `curl` e `jq` instalados.

Executa:
1. `/health`
2. `/v1/anamnese/start`
3. Jornada completa de 7 perguntas
4. Valida resultado final (IMC + summary)

#### Testes unitários (TODO)
```bash
cd backend
# TODO: Implementar pytest
pytest tests/ -v
```

### App Mobile

#### TypeScript Check
```bash
cd app
npm run typecheck
```

Valida tipos sem emitir JS.

#### Testes unitários (TODO)
```bash
cd app
# TODO: Implementar Jest + React Native Testing Library
npm test
```

### Infraestrutura

#### Validar Terraform
```bash
cd infra/envs/dev
terraform fmt -check      # Formação
terraform validate        # Sintaxe
terraform plan           # Preview de mudanças
```

---

## 🎨 Lint & Format

### Backend (Python)

#### Lint com Ruff (TODO)
```bash
cd backend
# TODO: Adicionar ruff ao requirements-dev.txt
ruff check src/
```

#### Format com Black (TODO)
```bash
cd backend
# TODO: Adicionar black ao requirements-dev.txt
black src/
```

### App Mobile (TypeScript)

#### ESLint
```bash
cd app
npm run lint

# Autofix
npm run lint -- --fix
```

#### Prettier (TODO)
```bash
cd app
# TODO: Adicionar prettier
npm run format
```

### Terraform

#### Format
```bash
cd infra/envs/dev
terraform fmt -recursive
```

---

## 🔧 Variáveis de Ambiente

### Backend (`backend/.env` ou export)

| Variável | Obrigatória | Default | Descrição |
|----------|-------------|---------|-----------|
| `APP_ENV` | Não | `dev` | Ambiente (dev/staging/prod) |
| `AWS_REGION` | Não | `us-east-1` | Região AWS |
| `DDB_TABLE_NAME` | Sim | - | Nome da tabela DynamoDB |
| `AUTH_ENABLED` | Não | `false` | Ativa autenticação JWT |
| `GEMINI_API_KEY` | Não* | - | Chave API do Google Gemini |
| `GEMINI_API_KEY_SECRET_ARN` | Não* | - | ARN do Secret Manager (prod) |
| `GEMINI_MODEL` | Não | `gemini-2.5-flash-lite` | Modelo LLM |
| `GEMINI_TIMEOUT_SECONDS` | Não | `8` | Timeout chamadas Gemini |
| `GEMINI_MAX_OUTPUT_TOKENS` | Não | `120` | Limite de tokens output |

\* Se não fornecida, usa fallback determinístico (sem IA).

### App Mobile (`app/.env`)

| Variável | Obrigatória | Default | Descrição |
|----------|-------------|---------|-----------|
| `API_URL` | Sim | `https://7tewq45bpd...` | URL base da API backend |
| `APP_NAME` | Não | `TurboTemplate` | Nome do app (branding) |

**Nota:** Após alterar `.env`, **reinicie o Expo** (`Ctrl+C` + `npm start`).

### Terraform (`infra/envs/dev/terraform.tfvars`)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `aws_region` | Não (default: us-east-1) | Região AWS |
| `project_prefix` | Não (default: nutriai) | Prefixo de recursos |
| `environment` | Não (default: dev) | Nome do ambiente |
| `auth_enabled` | Não (default: false) | Feature flag de auth |
| `gemini_model` | Não | Modelo Gemini |
| `gemini_api_key` | Sim | Chave API (via `TF_VAR_gemini_api_key`) |

---

## 🐛 Troubleshooting

### Problema: "API_URL não configurada" no app

**Sintoma:** App mostra erro ao iniciar anamnese.

**Solução:**
1. Verifique se `app/.env` existe e tem `API_URL` válida
2. Reinicie o Expo: `Ctrl+C` → `npm start`
3. Se usar backend local, use IP da máquina (não `localhost`)
   ```bash
   # Windows: ipconfig
   # Linux/macOS: ip a ou ifconfig
   API_URL=http://192.168.1.10:8000
   ```

---

### Problema: Backend local não conecta ao DynamoDB

**Sintoma:** Erro `ResourceNotFoundException` ao rodar local.

**Soluções:**
1. Crie tabela local com DynamoDB Local:
   ```bash
   # TODO: Implementar docker-compose com DynamoDB Local
   docker-compose up -d dynamodb-local
   ```

2. Ou use tabela dev da AWS:
   ```bash
   export DDB_TABLE_NAME="nutriai_anamnese_sessions_dev"
   # Certifique-se de ter AWS CLI configurado
   aws sts get-caller-identity
   ```

---

### Problema: "Port 8081 already in use" no Expo

**Sintoma:** Metro bundler não inicia.

**Solução:**
Expo já detecta e oferece porta alternativa (8082). Aceite pressionando `Y`.

Ou mate processos na porta 8081:
```powershell
# Windows
netstat -ano | findstr :8081
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:8081 | xargs kill -9
```

---

### Problema: Lambda timeout ao fazer deploy

**Sintoma:** `terraform apply` falha com timeout.

**Soluções:**
1. Verifique se `backend/dist/lambda.zip` existe:
   ```bash
   cd backend
   ./scripts/build_zip.sh
   ```

2. Verifique tamanho do zip (não pode exceder 50MB):
   ```bash
   ls -lh backend/dist/lambda.zip
   ```

3. Se timeout persiste, aumente timeout do Lambda:
   ```hcl
   # infra/envs/dev/main.tf
   timeout = 30  # era 25
   ```

---

### Problema: "Invalid credentials" no AWS CLI

**Sintoma:** Comandos AWS/Terraform falham com auth error.

**Solução:**
1. Configure credenciais:
   ```bash
   aws configure
   # AWS Access Key ID: ...
   # AWS Secret Access Key: ...
   # Default region: us-east-1
   ```

2. Ou use variáveis de ambiente:
   ```bash
   export AWS_ACCESS_KEY_ID="..."
   export AWS_SECRET_ACCESS_KEY="..."
   export AWS_REGION="us-east-1"
   ```

3. Verifique identidade:
   ```bash
   aws sts get-caller-identity
   ```

---

### Problema: Gemini API retorna erro 403/400

**Sintoma:** Anamnese falha ao normalizar resposta.

**Soluções:**
1. Verifique chave API:
   ```bash
   echo $GEMINI_API_KEY
   # Deve retornar chave válida
   ```

2. Teste chave diretamente:
   ```bash
   curl -H "Content-Type: application/json" \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=$GEMINI_API_KEY" \
     -d '{"contents":[{"parts":[{"text":"test"}]}]}'
   ```

3. Sistema usa **fallback determinístico** se LLM falhar. Para debugging, veja logs:
   ```bash
   # CloudWatch Logs (Lambda)
   aws logs tail /aws/lambda/nutriai-dev-anamnese --follow

   # Local (Uvicorn)
   # Logs aparecem no terminal do run_local.sh
   ```

---

### Problema: TypeScript errors no app após `npm install`

**Sintoma:** VSCode mostra erros de tipo, mas código compila.

**Solução:**
1. Limpe cache do TypeScript:
   ```bash
   cd app
   rm -rf node_modules .expo
   npm install
   ```

2. Reinicie TS Server no VSCode:
   `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

3. Verifique versão Node:
   ```bash
   node -v  # Deve ser 18+
   ```

---

### Problema: Build Terraform falha com "state lock"

**Sintoma:** `terraform apply` trava dizendo "Acquiring state lock".

**Solução:**
1. Se lock travou (deploy anterior interrompido), force unlock:
   ```bash
   cd infra/envs/dev
   terraform force-unlock <LOCK_ID>
   # LOCK_ID aparece na mensagem de erro
   ```

2. Ou pelo DynamoDB diretamente:
   ```bash
   aws dynamodb delete-item \
     --table-name nutriai-terraform-locks \
     --key '{"LockID":{"S":"nutriai/dev/terraform.tfstate"}}'
   ```

---

### Problema: App não encontra módulos nativos (Android)

**Sintoma:** Crash ao abrir app: "Unable to resolve module...".

**Solução:**
1. Limpe build cache:
   ```bash
   cd app
   npx expo start -c
   ```

2. Ou limpe tudo:
   ```bash
   cd app
   rm -rf node_modules .expo android/app/build ios/Pods
   npm install
   ```

3. Reconstrua native modules:
   ```bash
   npx expo prebuild --clean
   npm run android
   ```

---

## 📊 Comandos de Diagnóstico

### Ver sessões DynamoDB
```bash
aws dynamodb scan \
  --table-name nutriai_anamnese_sessions_dev \
  --max-items 10 \
  --output table
```

### Ver logs Lambda (últimos 5 min)
```bash
aws logs tail /aws/lambda/nutriai-dev-anamnese \
  --since 5m \
  --follow
```

### Testar endpoint direto (curl)
```bash
# Health
curl https://7tewq45bpd.execute-api.us-east-1.amazonaws.com/health

# Start anamnese
curl -X POST https://7tewq45bpd.execute-api.us-east-1.amazonaws.com/v1/anamnese/start \
  -H "Content-Type: application/json" \
  -d '{"language":"pt-BR"}'
```

### Ver outputs Terraform
```bash
cd infra/envs/dev
terraform output -json | jq
```

---

## 📚 Recursos Adicionais

- [README principal](../README.md) - Overview do projeto
- [Backend README](../backend/README.md) - Detalhes da API
- [Infra README](../infra/README.md) - Terraform e AWS
- [App docs](../app/docs/) - Setup mobile específico
- [Ideias & Arquitetura](../ideias/) - Documentos de design

---

## 🆘 Suporte

- **Issues:** https://github.com/agneisilva/NutriAI/issues
- **Wiki:** https://github.com/agneisilva/NutriAI/wiki (TODO)
- **Email:** (adicionar se necessário)

---

**Última atualização:** 2026-02-17
