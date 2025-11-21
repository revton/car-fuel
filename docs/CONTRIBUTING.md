# Contribuindo — Car Fuel

Este documento explica como contribuir com o projeto Car Fuel. Ele complementa `docs/DIRETRIZES.md`, `docs/STACK-PR-GHSTACK.md`, `docs/PROJECTS.md` e demais guias.

## Branches
- Branch padrão única: `main`.
- Crie branches de trabalho a partir de `main`, usando nomes descritivos, por exemplo:
  - `feat/<resumo>`
  - `fix/<resumo>`
  - `docs/<resumo>`
  - `chore/<resumo>`
- Sempre associe a branch a uma Issue (e card no Project v2) quando possível.

## Commits (Conventional Commits)
- Use mensagens no padrão Conventional Commits:
  - `feat: descrição curta`
  - `fix: descrição curta`
  - `docs: descrição curta`
  - `ci: descrição curta`
  - `chore: descrição curta`
- Evite commits muito grandes; prefira mudanças pequenas e compreensíveis.

## Stack PR (ghstack)
- Para mudanças encadeadas, use ghstack conforme `docs/STACK-PR-GHSTACK.md`:
  - Base: `main`.
  - Publicar/atualizar pilha: `uvx --python 3.11 ghstack submit -B main` / `uvx --python 3.11 ghstack`.
  - Landing automatizado opcional via workflow `ghstack-land`.

## Checklist de contribuição
- [ ] Existe uma Issue descrevendo o problema/feature (ou está claro no corpo da PR).
- [ ] Branch criada a partir de `main` com nome descritivo.
- [ ] Commits seguem Conventional Commits.
- [ ] Testes relevantes foram adicionados/atualizados (ver `docs/TESTING.md`).
- [ ] Documentação foi ajustada quando necessário (`docs/README.md`, guias específicos, etc.).
- [ ] A PR referencia as Issues com `Closes #<id>` quando aplicável.

## Code review
- Repositório de único mantenedor:
  - Pode não haver revisão por terceiros, mas recomenda‑se revisar a própria PR antes do merge.
  - Sempre aguardar checks verdes antes de mesclar.
- Com 2+ contribuidores:
  - Exigir pelo menos 1 aprovação antes do merge.
  - Usar o template de PR (`.github/pull_request_template.md`) para manter o checklist.

## DoD (Definition of Done)
Um item é considerado "Done" quando:
- O código está implementado e passa nos testes relevantes.
- A documentação afetada foi atualizada.
- A Issue/Project foi atualizada (status, campos do Project v2, links para PR).
- Não há TODOs críticos não tratados no código.

## Releases
- Releases são feitas via merges em `main`, frequentemente referenciadas em `docs/project/PHASE_PLAN.md`.
- Para grupos maiores de mudanças, usar PRs de release dedicadas (ex.: "release: fase X").
- Sempre que possível, usar `Closes #<id>` nas PRs relacionadas para garantir rastreabilidade entre código e Issues.

