# 0001 — MVP Anamnese (v3)

## Objetivo
Refatorar o requisito de anamnese para entregar uma conversa fluida, robusta para plano alimentar de qualidade, aproveitando a LLM já implementada no backend.

## Contexto atual (base do projeto)
- App atual usa chat com texto livre predominante.
- Backend atual tem fluxo fixo por etapas e já usa LLM (Gemini) para normalizar respostas por campo, com fallback determinístico.
- Contratos atuais: `POST /v1/anamnese/start` e `POST /v1/anamnese/answer`.

## Diretrizes de produto (revisão PM)
- Conversa com **1 pergunta por vez** e linguagem humana, curta e objetiva.
- **Digitação só quando fizer sentido**.
- Opções rápidas devem ser padrão (chips/cards selecionáveis).
- Campo de texto deve abrir **acima do teclado** quando a etapa exigir texto.
- Perguntas devem ser adaptativas (evitar perguntas irrelevantes).
- Experiência deve parecer assistente premium: rápida, clara, sem fricção.

## Modelo de interação (obrigatório)

### Tipos de resposta por etapa
- `single_choice`: 1 opção (chips/cards).
- `multi_choice`: múltiplas opções.
- `number`: número com unidade (kg/cm/anos).
- `scale`: escala 1–5.
- `text`: texto curto guiado.

### Regras de uso de texto
Texto livre só em:
- opção `Outro`;
- alergias/intolerâncias não cobertas;
- restrições religiosas/culturais específicas;
- objetivo personalizado;
- observação clínica opcional.

### Regras de teclado e composer
- Quando a etapa for `text` ou `number`, exibir composer fixo acima do teclado.
- Quando a etapa for escolha (`single_choice`/`multi_choice`), ocultar teclado por padrão.
- Submit por botão e por tecla Enter (quando aplicável).

## Estrutura da anamnese (robusta e adaptativa)

Total alvo: 8 blocos, com perguntas condicionais.

### Bloco 1 — Boas-vindas e consentimento
- Mensagem curta de expectativa (6–10 min).
- Opções: `✅ Sim, começar` | `⏱️ Agora não`.

### Bloco 2 — Objetivo
- Objetivo principal: `🎯 Emagrecer` | `💪 Ganhar massa` | `⚖️ Manter` | `⚡ Performance/energia` | `🧠 Saúde metabólica` | `✍️ Outro`.
- Prazo: `4` | `8` | `12` semanas | `Sem pressa`.
- Prioridade: `Resultado rápido` | `Sustentável` | `Performance`.
- Se `Outro`: abrir texto curto.

### Bloco 3 — Dados corporais
- Sexo considerado: `Masculino` | `Feminino` | `Prefiro não dizer`.
- Idade (anos), peso (kg), altura (cm).
- Mudança recente de peso: `Subiu` | `Desceu` | `Estável`.
- Se subiu/desceu: coletar quantidade + período.

### Bloco 4 — Rotina e treino
- Rotina diária: `🪑 Sedentária` | `🚶 Mista` | `🏃 Ativa`.
- Treina? `Sim` | `Não`.
- Se `Sim`: modalidade, frequência, duração, intensidade (1–5), objetivo do treino.
- Se `Não`: confirmar plano sem treino ou com início leve.

### Bloco 5 — Restrições e segurança alimentar
- Padrão alimentar: `🥗 Vegetariano` | `🌱 Vegano` | `🥛 Sem lactose` | `🌾 Sem glúten` | `🕌 Kosher/Halal` | `✍️ Outro`.
- Alergias/intolerâncias: opções + `Outro`.
- Alimentos que não consome (texto opcional curto).

### Bloco 6 — Preferências e aderência
- Estilo: `Tradicional` | `Low carb` | `Equilibrado` | `Flexível` | `Não sei`.
- Refeições por dia: `2`, `3`, `4`, `5+`, `Não sei`.
- Cozinha: `Quase nunca` | `Às vezes` | `Quase sempre`.
- Orçamento: `Baixo` | `Médio` | `Sem restrição`.
- Contexto: `🏠 Em casa` | `🥡 Delivery` | `🍽️ Come fora` | `🧊 Marmita`.

### Bloco 7 — Saúde e sinais
- Condições relevantes (multi): diabetes/pré, hipotireoidismo, hipertensão, refluxo, intestino irritável, colesterol alto, nenhuma.
- Medicamento contínuo: sim/não; se sim, texto opcional curto.
- Sono, fome/compulsão, energia (escala 1–5).
- Água/dia: `<1L` | `1–2L` | `2–3L` | `3L+`.

### Bloco 8 — Recap e confirmação
- Resumo em cartões por seção com ação `Editar`.
- Confirmação final: `✅ Pode montar meu plano` | `✏️ Quero ajustar`.

## Uso da LLM (requisito funcional)

### Onde a LLM deve atuar
- Normalização de respostas abertas para valores de domínio.
- Extração de entidades em respostas livres (ex.: alergias, objetivo textual).
- Geração de pergunta de reprompt curta quando resposta estiver ambígua.

### Onde não deve atuar sozinha
- Validação final de ranges numéricos (idade, peso, altura): manter validação determinística.
- Regras críticas de fluxo: manter fallback determinístico para continuidade da conversa.

### Política de fallback
- Em timeout/erro da LLM: usar normalização determinística e seguir o fluxo sem travar.

## Compatibilidade com implementação atual (obrigatório)
- Não quebrar os endpoints existentes de start/answer.
- Evoluções de contrato devem ser aditivas (novos campos opcionais).
- Manter mapeamento para perfil final atual (`goal`, `age`, `sex`, `weight_kg`, `height_cm`, `activity_level`, `restrictions`) enquanto o schema ampliado é introduzido.
- Qualquer breaking change exige atualização da spec correspondente antes da implementação.

## Payload-alvo para plano alimentar de qualidade
O resultado consolidado deve cobrir:
- `profile`: sexo, idade, altura_cm, peso_kg, variação de peso.
- `goals`: objetivo principal, secundário, prioridade, prazo.
- `routine`: rotina diária, sono, horários, refeições por dia.
- `training`: status treino, modalidade, frequência, duração, intensidade, objetivo.
- `restrictions`: padrão alimentar, alergias/intolerâncias, alimentos excluídos.
- `preferences`: cozinha, orçamento, contexto alimentar.
- `health`: condições, medicações, sono/fome/energia, água.
- `notes`: observações abertas relevantes.

## Critérios de aceite
- Conversa sempre em 1 pergunta por vez.
- Opções selecionáveis como padrão de resposta.
- Campo de texto aparece acima do teclado apenas quando necessário.
- Perguntas abertas usam LLM para normalizar/reperguntar com fallback seguro.
- Fluxo adaptativo pula perguntas irrelevantes.
- Ícones presentes em opções de maior impacto (objetivo/contexto/restrições).
- Resumo final editável por seção.
- Dados finais suficientes para gerar plano alimentar consistente.
- Compatibilidade com API atual preservada.

## Fora de escopo
- Diagnóstico médico ou prescrição clínica.
- Interpretação de exames laboratoriais.
- Geração completa do plano alimentar (documentada em spec separada).

Um prompt perfeito pro Copilot Agent Mode implementar isso com mínimo de alterações no resto do app.

Se me disser rapidamente onde está hoje a anamnese (ex.: app/src/... ou frontend/...), eu te digo exatamente quais arquivos criar/alterar primeiro.