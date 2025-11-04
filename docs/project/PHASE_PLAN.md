# Plano por Fases — revton/car-fuel

Atualizado após merge da Fase 0 em `main` (release #64).

## Fase 0 — Higienização (infra, duplicatas, encoding)
- #41 Chore: gh script — corrigir aspas na busca (Find-IssueByTitle) [priority:P3, type:chore, area:repo, status:done] — PRs: #58 (merged)
- #42 Chore: gh script — Ensure-Label idempotente com --force [priority:P3, type:chore, area:repo, status:done] — PRs: #59 (merged)
- #19 Infra: Correção de acentuação/encoding em arquivos [priority:P3, type:chore, area:repo, status:done] — PRs: #60 (merged)
- Release develop → main: PR #64 (merged)

Checklist (concluído)
- PR 1: `chore/41-gh-script-fix-quote` → `develop` (merged)
- PR 2: `chore/42-gh-script-label-idempotent` → `develop` (merged)
- PR 3: `chore/19-encoding-fix` → `develop` (merged)
- Release: `develop` → `main` (merged) — fecha automaticamente #41, #42, #19

## Fase 1 — CI e Stack PR (concluída)
- Stack Graph (Mermaid) e Stack PR Body (seção "Pilha" na PR) ativos em `.github/workflows/stack-graph.yml` e `.github/workflows/stack-pr-body.yml`.
- Badge no `README.md` e link em `docs/README.md` para o diagrama: `docs/stack-plan/STACK-PR-PLAN.md`.

## Fase 2 — Documentação
- #43 Docs: README — instruções para executar scripts de issues [type:docs, area:docs, priority:P3, status:todo]

Ordem (proposta)
1) Atualizar `docs/README.md` com exemplos de uso dos scripts (`create_issues_from_csv.ps1` e `gh_create_issues_from_csv_v3.ps1`) e observações.

## Observações
- O diagrama Mermaid (Stack Graph) mostra somente PRs abertas; após a Fase 0, ele poderá aparecer como "No open PRs".
- Para auto‑fechamento de issues, usar `Closes #<id>` em PRs para a branch padrão (`main`).

