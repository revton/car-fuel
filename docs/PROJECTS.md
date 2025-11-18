# GitHub Projects v2 — Guia de Uso (Fase 4)

Este guia sugere uma configuração simples e eficaz para acompanhar trabalho no GitHub Projects v2.

## Estrutura sugerida
- Colunas: Backlog → In Progress → Review → Done
- Campos (opcional): Priority (P1/P2/P3), Area (repo/docs/ci/etc), Type (feat/fix/docs/ci/chore)
- Filtros salvos: “A Fazer” (Backlog+P1/P2), “Em Review”, “Concluídas (30d)”

## Boas práticas
- Uma issue por objetivo coeso; descrever critérios de aceite.
- Vínculo com PR: usar “Closes #<id>” na PR que vai para `main`.
- Labels alinhadas (type, area, priority, status) para relatórios rápidos.

## Automação básica
- Mover para “Review” quando a PR for aberta.
- Mover para “Done” quando a PR for mergeada.
- Preencher Priority/Area a partir das labels (se desejar, via GitHub Actions).

## Como começar
1. Crie um Project v2 e as colunas sugeridas.
2. Adicione as issues existentes e defina prioridades.
3. Habilite automações de movimento por eventos de PR.

## Playbook da Fase 5 (Projects v2)

> Objetivo: manter o backlog da Fase 5 sincronizado entre `docs/project/ISSUES.csv`, Issues públicas e o Project v2 “Car Fuel — Gestão”.

1. **Backlog view** – Crie uma vista com filtros `Status: Backlog` + `Priority in (P1, P2)` e campos visíveis `Priority`, `Area`, `Type`, `Iteration`. Salve como “Fase 5 — Backlog”.
2. **Registrar notas** – Use “Add item” → “+ Create new issue” para rascunhar ideia, preencha título + resumo curto e marque as labels (type/area/priority). Descreva critérios de aceite no corpo ou vincule ao trecho correspondente em `docs/project/ISSUES.csv`.
3. **Sincronizar CSV** – Após revisar/ordenar o backlog, execute o script `gh_create_issues_from_csv_v3.ps1` (ou o sincronizador da tarefa “Chore: sync CSV ↔ issues...”) para alinhar colunas `Key` no CSV; isso mantém a rastreabilidade usada no PHASE_PLAN.
4. **Fluxo de colunas** – Assim que o desenvolvimento começar, mova o card para `In Progress`; abra a PR referenciando a issue com “Closes #<id>” e deixe a automação levar para `Review`/`Done`.
5. **Revisão semanal** – Na review semanal, confirme se todos os cards no Backlog têm campos preenchidos, critério de aceite claro e link para documentação. Ajuste prioridades antes de promover itens para `In Progress`.

### Notas registradas no Project

As oportunidades identificadas na auditoria atual foram adicionadas ao Project (coluna **Backlog**) e persistidas em `docs/project/ISSUES.csv` para facilitar criação futura das issues:
- **Chore: script v3 seta campos do Project ao criar issue** — automatizar o preenchimento de Priority/Area/Type.
- **Chore: sync CSV ↔ issues para atualizar Key/status** — script de reconciliação entre CSV e Issues.
- **Docs: guia operacional do Project (Fase 5)** — playbook detalhado e checklist semanal.
- **Docs: troubleshooting dos scripts gh_create_issues** — sessão de erros comuns em `docs/README.md`.
