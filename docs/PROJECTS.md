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
