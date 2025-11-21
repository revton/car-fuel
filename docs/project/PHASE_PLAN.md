# Plano por Fases — revton/car-fuel

Atualizado: Fase 0 em `main` (release #64), Fase 3 em `main` (release #95) e Fase 4 em `main` (release #109). Fase 5 (Backend MVP) planejada, ainda sem release. Política atual: ramo único `main`.

## Fase 0 — Higienização (infra, duplicatas, encoding)
- #41 Chore: gh script — corrigir aspas na busca (Find-IssueByTitle) [priority:P3, type:chore, area:repo, status:done] — PRs: #58 (merged)
- #42 Chore: gh script — Ensure-Label idempotente com --force [priority:P3, type:chore, area:repo, status:done] — PRs: #59 (merged)
- #19 Infra: Correção de acentuação/encoding em arquivos [priority:P3, type:chore, area:repo, status:done] — PRs: #60 (merged)
- Release `develop` → `main`: PR #64 (merged)

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
- Pilha publicada via ghstack (base `main` a partir de agora) e merges sequenciais.
- Release final: PR #95 (`main`).

## Governança de Branch (atual)
- Ramo único: `main`.
- PRs diretamente contra `main` (Stack PR/ghstack válidos com base em `main`).
- Fechamento automático de issues: usar `Closes #<id>` nas PRs para `main`.

## Observações
- Stack Graph (Mermaid) removido; priorizar ghstack para pilhas e o body das PRs.
- Para auto-fechamento de issues, usar `Closes #<id>` em PRs para a branch padrão (`main`).

## Próximas Fases
- Fase 4 — Gestão (Projects/Processo) [type:process, area:mgmt, priority:P2, status:done] — release #109  
  - Entregues: `docs/PROJECTS.md`, `docs/PROCESSO.md`, `.github/pull_request_template.md`, Fase 4 no PHASE_PLAN.
- Fase 5 — Backend MVP (Car Fuel API) [type:feat, area:api/backend, priority:P1, status:todo]  
  - Planejamento e contrato:
    - #129 ADR — stack técnica backend (linguagem, framework e persistência).
    - #130 ADR — modelo de dados para veículos/abastecimentos.
    - #131 OpenAPI — contrato inicial da Car Fuel API (MVP).
  - Implementação do backend:
    - #132 Serviço backend — esqueleto do projeto e endpoint `/health`.
    - #133 Endpoints MVP — veículos (ex.: criar e listar veículos).
    - #134 Endpoints MVP — abastecimentos (ex.: registrar abastecimento e listar histórico).
  - CI e checks:
    - #135 CI — build e testes do backend como checks visíveis/obrigatórios em PRs para `main`.
  - Organização e documentação:
    - Backlog da Fase 5 rastreado no Project v2 **Car Fuel**.
    - Implementações planejadas como pilha de PRs via ghstack (base `main`), com `Closes #<id>` nas PRs.
    - Guia de estudo a ser atualizado em `docs/guides/FASE5-BACKEND-MVP.md` conforme as entregas forem sendo implementadas e mergeadas.

