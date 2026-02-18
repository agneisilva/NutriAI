# Convenções mínimas

## 1) Estilo de commits
- Use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Mensagem curta no imperativo, descrevendo a mudança principal.
- Exemplo: `feat(app): adicionar tela de revisão da anamnese`.

## 2) Naming
- Arquivos: `kebab-case` (`nutrition-plan.service.ts`, `lambda_handler.py`).
- Variáveis e funções: `camelCase` (TS/JS) e `snake_case` (Python).
- Componentes React: `PascalCase` (`PrimaryButton.tsx`).
- Rotas/API: nomes em minúsculo e com hífen, no plural quando coleção (`/sessions`, `/nutrition-plans/{id}`).

## 3) Estrutura de pastas sugerida
- `app/src/components`: componentes reutilizáveis de UI.
- `app/src/screens`: telas por fluxo de usuário.
- `app/src/services`: integração com API e regras de acesso externo.
- `app/src/state`: estado global e stores.
- `backend/src/app`: domínio e regras de negócio.
- `backend/src`: handlers e entrada da Lambda/API.
- `docs/specs`: especificações funcionais e técnicas.

## 4) Como escrever testes
- Priorize testes de comportamento (entrada/saída), não implementação interna.
- Nomeie testes com cenário + resultado esperado.
- Cubra caminho feliz, erro principal e caso de borda crítico.
- Ao corrigir bug, adicione teste que reproduz o bug.

## 5) Regra de compatibilidade
- Não quebrar compatibilidade (API, contratos, payloads, fluxos) sem atualizar a spec correspondente em `docs/specs`.
- Toda mudança breaking deve incluir: atualização de spec + plano de migração (quando aplicável).
