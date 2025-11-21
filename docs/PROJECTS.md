# GitHub Projects v2 — Guia de Uso (Fase 4)

Este guia sugere uma configuração simples e eficaz para acompanhar trabalho no GitHub Projects v2.

## Estrutura sugerida
- Colunas: Backlog → In Progress → Review → Done

### Campos sugeridos
- Status: inferido pela coluna (Backlog, In Progress, Review, Done).
- Tipo (Type): feat, fix, docs, ci, chore.
- Prioridade (Priority): P1 (crítico), P2 (importante), P3 (melhoria).
- Módulo (Area): repo, docs, ci, api, domain, webapp, etc.
- Contrato OpenAPI? (OpenAPI?): Sim/Não — marcar quando a tarefa envolve contrato de API.
- ADR? (ADR?): Sim/Não — marcar se exige criação/atualização de um ADR.

### Views e filtros
- "Backlog Prioritário": Status = Backlog AND Priority ∈ {P1, P2}.
- "Em Review": Status = Review.
- "Contrato/API": OpenAPI? = Sim.
- "ADR pendente": ADR? = Sim AND Status ≠ Done.
- "Concluídas (30d)": Status = Done, filtrando por data de conclusão.

## Boas práticas
- Uma issue por objetivo coeso; descrever critérios de aceite.
- Vínculo com PR: usar “Closes #<id>” na PR que vai para `main`.
- Labels alinhadas (type, area, priority, status) para relatórios rápidos.
- Mantenha os campos OpenAPI?/ADR? atualizados quando relevante; isso facilita planejamento arquitetural.

## Automação básica
- Mover para “Review” quando a PR for aberta.
- Mover para “Done” quando a PR for mergeada.
- Preencher Priority/Area/Type a partir das labels (se desejar, via GitHub Actions).

## Fluxo backlog → merge
1. Crie/ajuste o Project v2 com as colunas e campos sugeridos.
2. Adicione as issues existentes (Backlog) e defina Prioridade, Tipo, Módulo e flags OpenAPI?/ADR? quando aplicável.
3. Ao iniciar uma tarefa: mova o card para In Progress, crie a branch (ou pilha com ghstack) e abra a PR com `Closes #<id>`.
4. Ao abrir PR: automação move para Review.
5. Ao mergear em `main`: automação move para Done; a Issue é fechada via `Closes #<id>`.
6. Revisão periódica: use as views "Backlog Prioritário", "Contrato/API" e "ADR pendente" para decidir o que entra na próxima iteração.

## Observações finais
- Este documento é o “contrato” do Project v2 usado pelo repositório.
- Sempre que alterar campos/colunas importantes no Project, atualize este arquivo para manter o alinhamento.
