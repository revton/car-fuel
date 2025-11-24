# Plano por Fases – revton/car-fuel

Atualizado: Fase 0 em `main` (release #64), Fase 3 em `main` (release #95), Fase 4 em `main` (release #109) e Fase 5 (Backend MVP) concluída e landada em `main`. Política atual: ramo único `main`.

---

## Fase 0 – Higienização (infra, duplicatas, encoding)
- #41 Chore: gh script – corrigir aspas na busca (Find-IssueByTitle) [priority:P3, type:chore, area:repo, status:done] – PRs: #58 (merged)
- #42 Chore: gh script – Ensure-Label idempotente com --force [priority:P3, type:chore, area:repo, status:done] – PRs: #59 (merged)
- #19 Infra: Correção de acentuação/encoding em arquivos [priority:P3, type:chore, area:repo, status:done] – PRs: #60 (merged)
- Release `develop` → `main`: PR #64 (merged)

Checklist (concluído)
- PR 1: `chore/41-gh-script-fix-quote` → `develop` (merged)
- PR 2: `chore/42-gh-script-label-idempotent` → `develop` (merged)
- PR 3: `chore/19-encoding-fix` → `develop` (merged)
- Release: `develop` → `main` (merged) – fecha automaticamente #41, #42, #19

---

## Fase 1 – CI e Stack PR (concluída)
- Stack PR Body ativo em `.github/workflows/stack-pr-body.yml`.
- Stack Graph/arquivo Mermaid removidos para evitar conflitos na hora do land.

---

## Fase 2 – Documentação (concluída)
- #43 Docs: README – instruções para executar scripts de issues [type:docs, area:docs, priority:P3, status:done] – PR: #65 (merged)

Ordem (concluída)
1) Atualizar `docs/README.md` com exemplos de uso dos scripts (`gh_create_issues_from_csv_v3.ps1` e alternativa v2) e observações.

---

## Fase 3 – Scripts e Automação (concluída)
- #66 Scripts: consolidar uso do gh v3 e adicionar wrapper [type:chore, area:repo, priority:P3, status:done] – PR: #67 (merged), release #68
- #69 Scripts: validar CSV e exemplo (v3) [type:chore, area:repo, priority:P3, status:done] – via ghstack (#92/#93), release #95
- #70 Docs: guia rápido e troubleshooting dos scripts [type:docs, area:docs, priority:P3, status:done] – via ghstack (#92/#93), release #95
- #71 CI: executar dry-run do script v3 em CSV de exemplo [type:ci, area:repo, priority:P3, status:done] – via ghstack (#92/#93), release #95

Checklist (concluído)
- Pilha publicada via ghstack (base `main`) e merges sequenciais.
- Release final: PR #95 (`main`).

---

## Fase 4 – Gestão (Projects/Processo) – concluída
- #?? Docs/Processo/Projects consolidados [type:process, area:mgmt, priority:P2, status:done] – release #109  
  - Entregues: `docs/PROJECTS.md`, `docs/PROCESSO.md`, `.github/pull_request_template.md`, registro da Fase 4 neste plano.

---

## Fase 5 – Backend MVP (Car Fuel API) – concluída

### Planejamento e contrato
- #129 ADR – stack técnica backend (Kotlin + Spring Boot + Gradle + JPA/PostgreSQL).
- #130 ADR – modelo de dados para veículos, tanques e abastecimentos.
- #131 OpenAPI – contrato inicial da Car Fuel API (MVP) em `api/openapi/car-fuel-v1.yaml`, seguindo `docs/API_STYLE.md` e `docs/ERRORS.md`.

### Implementação do backend
- #132 Serviço backend – esqueleto do projeto e endpoint `/v1/health`.
- #133 Endpoints MVP – veículos:
  - `POST /v1/vehicles`, `GET /v1/vehicles`, `GET /v1/vehicles/{vehicle_id}`.
  - Camadas: DTOs, entities, repositories, services, controllers e testes (integração + unitários).
- #134 Endpoints MVP – abastecimentos/tanques:
  - `POST/GET /v1/fuelings`, `GET /v1/fuelings/{fueling_id}`.
  - `POST/GET /v1/tanks`, `GET /v1/tanks/{tank_id}`.
  - Validações de payload (422 `invalid_fill_payload`) e erros alinhados a `docs/ERRORS.md` (`tank_not_found`, `fill_not_found`, etc.).

### CI e checks
- #135 CI – build e testes do backend como checks visíveis/obrigatórios em PRs para `main`:
  - Workflow `backend-build` (job/check `backend-build` – `./gradlew clean bootJar`).
  - Workflow `backend-test` (job/check `backend-test` – `./gradlew test`).

### Organização e documentação
- Backlog da Fase 5 rastreado no Project v2 **Car Fuel**.
- Implementações feitas como pilha de PRs via ghstack (base `main`), com `Closes #<id>` nas PRs.
- Guias de estudo:
  - `docs/guides/FASE5-BACKEND-MVP.md`
  - `docs/guides/FASE5-PASSO4-BACKEND.md`
  - `docs/guides/FASE5-PASSO5-VEHICLES.md`
  - `docs/guides/FASE5-PASSO6-FUELINGS.md`

---

## Governança de Branch (atual)
- Ramo único: `main`.
- PRs diretamente contra `main` (Stack PR/ghstack válidos com base em `main`).
- Fechamento automático de issues: usar `Closes #<id>` nas PRs para a branch padrão (`main`).

## Observações
- Stack Graph (Mermaid) removido; priorizar ghstack para pilhas e o body das PRs.
- Para auto-fechamento de issues, usar `Closes #<id>` em PRs para a branch padrão (`main`).

---

## Próximas Fases (roadmap)

- **Fase 6 – Frontend MVP (Car Fuel Web)** [type:feat, area:frontend/web, priority:P1, status:todo]  
  - Objetivo macro:
    - Entregar uma interface web mínima para consumir a Car Fuel API (Fase 5), com foco em cadastro de veículos, tanques e registro de abastecimentos.
  - Planejamento / Design:
    - #156 ADR da stack frontend (framework JS/TS, bundler, deploy estático).
    - #157 ADR de integração frontend–backend (CORS, ambientes, autenticação futura).
    - Revisar impactos em `docs/NFR.md`, `docs/SECURITY.md` e `docs/PRIVACY.md` para o frontend.
  - Implementação inicial (exemplos):
    - Página inicial com resumo de health/status da API.
    - Fluxos:
      - #158 Listar/criar veículos (esqueleto + telas iniciais).
      - #159 Listar/criar tanques por veículo e registrar/listar abastecimentos.
  - Testes e CI:
    - Testes de unidade/componentes conforme stack escolhida.
    - #160 Workflows de build/test frontend em `.github/workflows/`, alinhados a `docs/TESTING.md`.
  - Organização e documentação:
    - Backlog da Fase 6 rastreado no Project v2 **Car Fuel** (coluna Backlog → In Progress → Review → Done).
    - Guia de estudo dedicado: `docs/guides/FASE6-FRONTEND-MVP.md`.

