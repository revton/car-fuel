# Plano por Fases — revton/car-fuel

Atualizado: Fase 0 em `main` (release #64), Fase 3 em `main` (release #95) e Fase 4 em `main` (release #109). Política atual: ramo único `main`.

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
- Stack PR Body ativo em `.github/workflows/stack-pr-body.yml`.
- Stack Graph/arquivo Mermaid foram descontinuados para evitar conflitos de land.

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
- Stack Graph (Mermaid) removido; priorizar ghstack para pilhas e o body das PRs.
- Para auto‑fechamento de issues, usar `Closes #<id>` em PRs para a branch padrão (`main`).

## Próximas Fases
- Fase 4 — Gestão (Projects/Processo) [type:process, area:mgmt, priority:P2, status:done] — release #109
  - Entregues: `docs/PROJECTS.md`, `docs/PROCESSO.md`, `.github/pull_request_template.md`, Fase 4 no PHASE_PLAN.
- Fase 5 — Outros [type:misc, area:repo, priority:P3, status:in_progress]
  - Backlog priorizado registrado em `docs/project/ISSUES.csv` e no Project “Car Fuel — Gestão” (coluna Backlog). Cada item já está etiquetado com `type/area/priority/status` para seguir o fluxo Backlog → In Progress → Review → Done.
  - Ordem atual das entregas (Fase 5):
    1. **Chore: script v3 seta campos do Project ao criar issue** — permitir mapear labels → campos personalizados do Project durante a criação das issues (P1, área repo, status:todo).
    2. **Chore: sync CSV ↔ issues para atualizar Key/status** — script de reconciliação para manter `docs/project/ISSUES.csv` alinhado ao estado real das issues (P2, área repo, status:todo).
    3. **Docs: guia operacional do Project (Fase 5)** — playbook detalhado e checklist semanal para o Project, expandindo `docs/PROJECTS.md` (P2, área docs, status:todo).
    4. **Docs: troubleshooting dos scripts gh_create_issues** — adicionar seção dedicada em `docs/README.md` com erros frequentes e correções (P3, área docs, status:todo).
  - Após cada entrega, atualizar este plano indicando release e referência de PR/issue fechada.
