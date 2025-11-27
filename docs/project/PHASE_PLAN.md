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

- **Fase 6 — Frontend MVP (Car Fuel Web)** [type:feat, area:frontend/web, priority:P1, status:todo]  
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
- **Fase 7 — Devcontainers e Hot Deploy** [type:chore, area:devproductivity, priority:P1, status:todo]  
  - Objetivo macro:
    - Prover um ambiente reproduzível (VS Code Dev Container) acoplado ao `docker compose` com hot deploy para backend e frontend, reduzindo atrito de setup e integrando com scripts existentes.
  - Planejamento / Design:
    - #168 ADR do ambiente de desenvolvimento em contêineres (stack de base, imagens, ports, requisitos), alinhando-se a `docs/DEVELOPER_SETUP.md` e `docs/DIRETRIZES.md`.
    - #169 Ajustes em `docs/ENVIRONMENTS.md` e `docs/PROCESSO.md` para registrar o fluxo de desenvolvimento em container e como aciona perfis Compose.
  - Implementação:
    - #170 Criar `.devcontainer/devcontainer.json`, `docker/dev/Dockerfile` e perfil Compose dedicado (`compose.devcontainer.yml`) plugado em `docker compose --profile dev`.
    - #171 Configurar scripts de hot deploy para backend (`gradlew bootRun --continuous` com Spring DevTools) e frontend (Vite `--host 0.0.0.0`) dentro do container, com wrappers em `scripts/dev/*`.
    - #172 Atualizar `scripts/` para suportar attach/detach do Dev Container e sincronizar volumes (sem conflitar com fases web/mobile).
  - Testes e CI:
    - #173 Script de smoke test (`scripts/dev/devcontainer-smoke.ps1`) validando pre-commit e hot deploy dentro do container.
    - Avaliar workflow opcional `devcontainer-validate` em `.github/workflows/` usando `devcontainer CLI` (não bloqueia demais fases).
  - Organização e documentação:
    - Atualizar `docs/DEVELOPER_SETUP.md` com passo a passo do Dev Container e `docs/PROJECTS.md` com o épico da Fase 7.
    - Registrar guia `docs/guides/FASE7-DEVCONTAINER.md` com troubleshooting/hot reload.
- **Fase 8 — Mobile MVP (React Native/Expo)** [type:feat, area:mobile, priority:P1, status:todo]  
  - Objetivo macro:
    - Entregar um app móvel (Expo + React Native) reutilizando a camada `shared` recém-criada para chamadas de API e modelos, cobrindo health, veículos e abastecimentos básicos.
  - Planejamento / Design:
    - #174 ADR da stack mobile (Expo, roteamento, armazenamento seguro) e estratégia de compartilhamento de código (`shared/` workspace npm), alinhada a `docs/API_STYLE.md`.
    - #175 Plano de integração mobile ↔ backend (variáveis de ambiente, CORS, certificados) refletido em `docs/ENVIRONMENTS.md` e `docs/PRIVACY.md`.
  - Implementação inicial:
    - #176 Estruturar `mobile/` com Expo (TypeScript), configurando pipelines de build local (`expo start`) e release (`eas build` opcional).
    - #177 Extrair a camada `shared` para um pacote em `packages/shared` consumido por `frontend/` e `mobile/` (sem quebrar fluxos atuais).
    - #178 Implementar telas: splash/health, lista/cadastro de veículos, lista/registro de abastecimentos com componentes compartilhados.
  - Testes e CI:
    - #179 Configurar Jest + Testing Library para mobile e smoke test via `expo-doctor`.
    - #180 Workflow `mobile-test` em `.github/workflows/` (linter + testes) seguindo `docs/TESTING.md`; opcionalmente `mobile-e2e` com Detox/Expo para PRs etiquetadas.
  - Organização e documentação:
    - Atualizar `docs/PROJECTS.md` com o épico da Fase 8 e criar `docs/guides/FASE8-MOBILE-MVP.md` (passo a passo, decisões e integrações).
    - Expandir `docs/DEVELOPER_SETUP.md` com instruções de dependências mobile (Android/iOS) e troubleshooting.
- **Fase 9 — Autenticação (AuthN/AuthZ)** [type:feat, area:security, priority:P1, status:todo]  
  - Objetivo macro:
    - Introduzir login obrigatório para os serviços (API, web, mobile) com autenticação baseada em tokens (JWT ou session), autorização por recursos e alinhamento às políticas de segurança/privacidade.
  - Planejamento / Design:
    - #181 ADR de arquitetura de autenticação (provedor, fluxo de login, políticas de senha, refresh token), consultando `docs/SECURITY.md`, `docs/PRIVACY.md` e `docs/NFR.md`.
    - #182 Atualização de `docs/API_STYLE.md` e `docs/ERRORS.md` com novos endpoints (`/v1/auth/login`, `/v1/users`, `401/403` padronizados) e envelopes.
  - Implementação:
    - #183 Backend: entidades `User`/`Role`, repositórios, serviços de credencial (hash Argon2/BCrypt) e endpoints `register/login`, além do guard JWT e anotações de autorização nos controllers existentes.
    - #184 Atualizar `api/openapi/car-fuel-v1.yaml` com os esquemas de autenticação e propagar as mudanças para frontend/mobile (adicionando hooks de login/logout e armazenamento seguro de tokens).
    - #185 Scripts de migração/seed (Flyway ou Liquibase) para usuários iniciais e feature flag `AUTH_ENABLED` para evitar conflitos com demais fases em paralelo.
  - Testes e CI:
    - #186 Testes de integração cobrindo fluxos completos (registro → login → acesso autorizado/negado) + testes de segurança (senhas fracas, expiração, revogação).
    - #187 Ajouter suíte de testes de contrato (e.g., `karate`/`rest-assured`) validando headers e respostas `401/403`.
  - Organização e documentação:
    - Atualizar `docs/SECURITY.md`, `docs/PRIVACY.md` e `docs/ENVIRONMENTS.md` com rotas, políticas de tokens e requisitos de armazenamento.
    - Registrar guia `docs/guides/FASE9-AUTH.md` detalhando dependências e pontos sensíveis (segredos, rotação de keys).
- **Fase 10 — Deploy/Infra (Preparar Produção)** [type:infra, area:platform, priority:P1, status:todo]  
  - Objetivo macro:
    - Preparar a pilha para produção (infraestrutura, CI/CD, observabilidade e runbooks), atendendo às metas de `docs/NFR.md` e `docs/OBSERVABILITY.md`.
  - Planejamento / Design:
    - #188 ADR de plataforma (cloud alvo, serviços gerenciados, IaC) + definição de ambientes (staging/prod) mapeada em `docs/ENVIRONMENTS.md`.
    - #189 Plano de segurança operaciona (segredos, rotação, backup) e governança registrado em `docs/PROCESSO.md` e `docs/SECURITY.md`.
  - Implementação:
    - #190 Criar repositório IaC (`infra/terraform` ou similar) com VPC, banco gerenciado, storage e pipelines; scripts em `scripts/deploy/*` para bootstrap.
    - #191 Configurar workflows GitHub Actions (`deploy-staging.yml`, `deploy-prod.yml`) que buildam imagens, publicam em registry e acionam deploy (com approvals).
    - #192 Adicionar observabilidade: exporters, dashboards (Grafana), alertas e health checks, documentando no código e `docs/OBSERVABILITY.md`.
  - Testes e CI:
    - #193 Smoke tests pós-deploy (`scripts/deploy/verify.ps1`) e testes de carga (k6/Gatling) automatizados para validar SLOs.
    - #194 Checklists automáticos (Policy as Code / tfsec) garantindo compliance antes do deploy.
  - Organização e documentação:
    - Atualizar `docs/PROJECTS.md` com a Fase 10, `docs/PROCESSO.md` com o fluxo de release/rollback e abrir `docs/guides/FASE10-DEPLOY-INFRA.md`.
    - Adicionar runbooks (`docs/runbooks/*.md`) para incidentes, backup/restore e rotação de segredos.
