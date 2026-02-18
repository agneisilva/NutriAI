# NutriAI — Arquitetura de Alto Nível (MVP)

## Objetivo
Entregar um MVP para coleta de anamnese nutricional, processamento inicial e retorno de orientação estruturada, com base preparada para evoluir com IA (texto e imagem).

## Módulos

### 1) App (mobile)
- Responsável por UX principal do usuário.
- Coleta dados de anamnese, envia para backend e exibe resultado.
- Não concentra regra de negócio crítica; atua como camada de apresentação + orquestração de chamadas.

### 2) Web (futuro próximo)
- Portal para nutricionista/operação (consulta de sessões, revisão e ajustes).
- Reusa os mesmos contratos de API do backend.
- Pode incluir autenticação e trilha de auditoria administrativa.

### 3) Backend
- API e casos de uso do domínio (anamnese, sessões, recomendações).
- Persistência e integração com serviços externos.
- Camada de domínio isolada de frameworks para facilitar testes e evolução.

## Integrações futuras

### LLM
- Geração e refinamento de recomendações a partir dos dados estruturados da anamnese.
- Estratégia sugerida: adapter dedicado para provedor de LLM (evitar acoplamento direto ao SDK no domínio).
- Incluir versionamento de prompt e logs de entrada/saída para rastreabilidade.

### Imagens
- Upload e análise de imagens de refeições/exames (quando aplicável).
- Pipeline sugerido: armazenamento + processamento assíncrono + enriquecimento do perfil da sessão.
- Tratar imagens como fonte complementar, não única, no MVP evolutivo.

## Fluxo de dados (MVP)
1. Usuário preenche anamnese no app.
2. App envia payload validado para API.
3. Backend aplica validações de domínio e persiste sessão.
4. Backend processa regras iniciais e gera resultado estruturado.
5. App consulta/recebe resultado e apresenta ao usuário.
6. (Futuro) Backend aciona LLM/imagem para enriquecimento incremental.

## Boas práticas de programação

### DDD (pragmático para MVP)
- Separar claramente: `domain`, `application` (casos de uso), `infrastructure` (banco, SDKs, APIs).
- Entidades e Value Objects carregam regras essenciais de negócio.
- Use Cases orquestram fluxo sem lógica de infraestrutura.
- Linguagem ubíqua nos nomes (session, anamnese, recommendation).

### 12-Factor App (aplicação ao contexto)
- Configuração via ambiente (sem segredos no código).
- Dependências explícitas e versionadas.
- Paridade entre ambientes (dev/stage/prod).
- Logs como stream de eventos.
- Processos stateless sempre que possível.
- Build/release/run separados no pipeline.

### Patterns recomendados
- **Ports and Adapters (Hexagonal):** domínio no centro, integrações nas bordas.
- **Repository:** abstrair persistência de sessões/anamnese.
- **Use Case / Application Service:** um caso de uso por ação de negócio.
- **DTO + Mapper:** contratos de entrada/saída desacoplados do domínio.
- **Strategy:** trocar provedor de LLM sem alterar regras centrais.
- **Circuit Breaker/Retry com backoff:** chamadas externas resilientes.

## AWS Well-Architected (aplicação no MVP)
- **Excelência Operacional:** infraestrutura versionada em Terraform, CI/CD simples e runbooks para incidentes.
- **Segurança:** menor privilégio em IAM, segredos fora do código, criptografia em trânsito e em repouso.
- **Confiabilidade:** serviços stateless, retries com backoff, idempotência em operações críticas e observabilidade.
- **Eficiência de Performance:** API enxuta, processamento assíncrono para tarefas pesadas (LLM/imagem) e cache quando necessário.
- **Otimização de Custos:** escala sob demanda, escolha de serviços gerenciados e revisão periódica de recursos ociosos.
- **Sustentabilidade:** arquiteturas elásticas, redução de processamento desnecessário e monitoramento de uso para evitar desperdício.

## Decisões de qualidade
- Priorizar simplicidade no MVP, mantendo fronteiras para escalar sem reescrita.
- Garantir cobertura de testes nos casos de uso críticos.
- Evitar breaking changes em contratos sem atualizar specs em `docs/specs`.
