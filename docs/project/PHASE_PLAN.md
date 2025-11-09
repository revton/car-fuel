# Plano por Fases — revton/car-fuel

Atualizado: Fase 0 em `main` (release #64) e Fase 3 finalizada em `main` (release #95). Política atual: ramo único `main`.

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

## Fase 2 — Documentação (concluída)
- #43 Docs: README — instruções para executar scripts de issues [type:docs, area:docs, priority:P3, status:done] — PR: #65 (merged)

Ordem (proposta)
1) (Concluída) Atualizar `docs/README.md` com exemplos de uso dos scripts (`gh_create_issues_from_csv_v3.ps1` e alternativa v2) e observações.

## Fase 3 — Scripts e Automação (concluída)
- #66 Scripts: consolidar uso do gh v3 e adicionar wrapper [type:chore, area:repo, priority:P3, status:done] — PR: #67 (merged), release #68
- #69 Scripts: validar CSV e exemplo (v3) [type:chore, area:repo, priority:P3, status:done] — via ghstack (#92/#93), release #95
- #70 Docs: guia rápido e troubleshooting dos scripts [type:docs, area:docs, priority:P3, status:done] — via ghstack (#92/#93), release #95
- #71 CI: executar dry-run do script v3 em CSV de exemplo [type:ci, area:repo, priority:P3, status:done] — via ghstack (#92/#93), release #95

Checklist (concluído)
- Pilha publicada via ghstack (base main a partir de agora) e merges sequenciais
- Release final: PR #95 (main)

## Governança de Branch (atual)
- Ramo único: `main`
- PRs diretamente contra `main` (Stack PR/ghstack válidos com base em `main`)
- Fechamento automático de issues: usar “Closes #<id>” nas PRs para `main`

## Observações
- O diagrama Mermaid (Stack Graph) mostra somente PRs abertas; após a Fase 0, ele poderá aparecer como "No open PRs".
- Para auto‑fechamento de issues, usar `Closes #<id>` em PRs para a branch padrão (`main`).

## Próximas Fases
- Fase 4 — Gestão (Projects/Processo) [type:process, area:mgmt, priority:P2, status:in-progress]
  - Projects v2 (guia): ver `docs/PROJECTS.md`
  - Processo/Política: ver `docs/PROCESSO.md` e `docs/DIRETRIZES.md`
  - Template de PR com checklist (ver `.github/pull_request_template.md`)
  - Automação de movimento no Project (opcional via Actions)
- Fase 5 — Outros [type:misc, area:repo, priority:P3, status:todo]
  - Itens diversos de melhoria contínua
