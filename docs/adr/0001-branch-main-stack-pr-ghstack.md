# ADR 0001 — Branch única `main` e Stack PR com ghstack

Status: Accepted
Data: 2025-11-17

## Contexto
- O repositório precisa de um fluxo simples de branches e PRs, permitindo trabalhar com mudanças encadeadas (Stack PR) sem criar múltiplas branches long-lived.
- Queremos rastrear claramente dependências entre PRs e facilitar releases agrupadas.

## Decisão
- Usar `main` como única branch longa‑vivida (branch padrão).
- Quando necessário empilhar mudanças, usar `ghstack` com base em `main`, conforme `docs/STACK-PR-GHSTACK.md`.
- Integrar o fluxo com:
  - Seção "Pilha" no corpo das PRs (`stack-pr-body.yml`).
  - Workflow de land opcional (`ghstack-land.yml`) usando PAT dedicado.

## Consequências
- Fluxo de branches simplificado: PRs sempre partem de `main`.
- Stack PRs ficam rastreáveis via ghstack e seções automáticas nas PRs.
- Requer cuidado com branch protection de `main` (especialmente ao usar `ghstack land`).

## Alternativas consideradas
- Fluxo GitFlow com `develop` + `main`:
  - Mais complexo para o tamanho atual do projeto.
  - Maior coordenação para releases.
- Não usar Stack PR (apenas PRs independentes):
  - Funciona, mas dificulta revisão de mudanças grandes que se beneficiam de empilhamento.

## Relacionados
- `docs/STACK-PR-GHSTACK.md`
- `AGENTS.md`
- `docs/project/PHASE_PLAN.md`

