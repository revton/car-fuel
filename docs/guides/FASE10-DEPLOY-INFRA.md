# Guia Operacional — Fase 10 (Deploy/Infra Produção)

> Sequência de passos em ghstack para preparar a infraestrutura de produção alinhada aos NFRs.

## Pré-requisitos

- `main` atualizado (backend, frontend, mobile prontos para produção).
- Credenciais cloud (ex.: AWS/GCP/Azure) e ferramentas IaC (Terraform/CDK) instaladas.
- `uvx --python 3.11 ghstack --version`.
- Conhecimento atual de `docs/NFR.md`, `docs/ENVIRONMENTS.md`, `docs/OBSERVABILITY.md`, `docs/PROCESSO.md`.

## Pilha ghstack da Fase 10

Branches são encadeadas; após cada commit execute `uvx --python 3.11 ghstack submit -B main`.

### Passo 1 — Issue #188 (ADR plataforma e ambientes)

- **Branch**: `feat/phase10-188-platform-adr`
- **Base**: `main`
- **Escopo**: documentar escolha da cloud-alvo, serviços gerenciados, topologia (staging/prod) e requisitos de rede.
- **Commit**: `docs(infra): ADR plataforma e ambientes (Closes #188)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase10-188-platform-adr main
  git add docs/adr/0013-platform.md docs/ENVIRONMENTS.md docs/NFR.md
  git commit -m "docs(infra): ADR plataforma e ambientes (Closes #188)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 2 — Issue #189 (Plano de segurança operacional e governança)

- **Branch**: `feat/phase10-189-operational-security`
- **Base**: `feat/phase10-188-platform-adr`
- **Escopo**: atualizar `docs/SECURITY.md`, `docs/PROCESSO.md` e `docs/PROJECTS.md` com políticas de segredos, backup, observabilidade, incidentes e approvals.
- **Commit**: `docs(infra): governança e segurança operacional (Closes #189)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase10-189-operational-security feat/phase10-188-platform-adr
  git add docs/SECURITY.md docs/PROCESSO.md docs/PROJECTS.md
  git commit -m "docs(infra): governança e segurança operacional (Closes #189)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 3 — Issue #190 (Infraestrutura como código + scripts)

- **Branch**: `feat/phase10-190-iac-bootstrap`
- **Base**: `feat/phase10-189-operational-security`
- **Escopo**: adicionar `infra/terraform` (ou equivalente) com módulos de rede, banco, buckets, pipelines, além de scripts `scripts/deploy/bootstrap-*.ps1`.
- **Commit**: `feat(infra): IaC base e bootstrap (Closes #190)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase10-190-iac-bootstrap feat/phase10-189-operational-security
  git add infra scripts/deploy docs/DEVELOPER_SETUP.md
  git commit -m "feat(infra): IaC base e bootstrap (Closes #190)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 4 — Issue #191 (Workflows de deploy)

- **Branch**: `ci/phase10-191-deploy-workflows`
- **Base**: `feat/phase10-190-iac-bootstrap`
- **Escopo**: criar `.github/workflows/deploy-staging.yml` e `deploy-prod.yml`, empacotando imagens, publicando em registry e chamando scripts IaC (com approvals manuais).
- **Commit**: `ci(infra): pipelines deploy staging/prod (Closes #191)`
- **Comandos**
  ```powershell
  git checkout -b ci/phase10-191-deploy-workflows feat/phase10-190-iac-bootstrap
  git add .github/workflows/deploy-staging.yml .github/workflows/deploy-prod.yml scripts/deploy
  git commit -m "ci(infra): pipelines deploy staging/prod (Closes #191)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 5 — Issue #192 (Observabilidade completa)

- **Branch**: `feat/phase10-192-observability`
- **Base**: `ci/phase10-191-deploy-workflows`
- **Escopo**: instrumentar API/frontend/mobile (metrics, logs JSON, tracing), criar dashboards e alertas (Grafana/Alertmanager) e documentar em `docs/OBSERVABILITY.md`.
- **Commit**: `feat(observability): métricas, logs e alertas (Closes #192)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase10-192-observability ci/phase10-191-deploy-workflows
  git add src frontend mobile docs/OBSERVABILITY.md infra/monitoring
  git commit -m "feat(observability): métricas, logs e alertas (Closes #192)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 6 — Issue #193 (Smoke e testes de carga)

- **Branch**: `test/phase10-193-deploy-validation`
- **Base**: `feat/phase10-192-observability`
- **Escopo**: adicionar scripts `scripts/deploy/verify.ps1`, testes k6/Gatling, relatórios automatizados pós-deploy e documentação no runbook.
- **Commit**: `test(infra): smoke e load tests de deploy (Closes #193)`
- **Comandos**
  ```powershell
  git checkout -b test/phase10-193-deploy-validation feat/phase10-192-observability
  git add scripts/deploy tests/performance docs/runbooks/deploy.md
  git commit -m "test(infra): smoke e load tests de deploy (Closes #193)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 7 — Issue #194 (Policy as Code e compliance)

- **Branch**: `ci/phase10-194-compliance`
- **Base**: `test/phase10-193-deploy-validation`
- **Escopo**: configurar tfsec/OPA/Conftest, regras de compliance e integração com workflows; atualizar `docs/PROCESSO.md` e `docs/SECURITY.md` sobre gates automáticos.
- **Commit**: `ci(infra): policy-as-code e compliance (Closes #194)`
- **Comandos**
  ```powershell
  git checkout -b ci/phase10-194-compliance test/phase10-193-deploy-validation
  git add .github/workflows/compliance.yml infra/policies docs/PROCESSO.md docs/SECURITY.md
  git commit -m "ci(infra): policy-as-code e compliance (Closes #194)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Land e pós-merge

1. Validar os workflows (`deploy-staging`, `deploy-prod`, `compliance`, `performance`) antes do land.
2. Rodar `ghstack land` (workflow) indicando o PR topo (#194); garantir `Allow force pushes` temporário.
3. Atualizar `docs/project/PHASE_PLAN.md`, `docs/guides/FASE10-DEPLOY-INFRA.md` com links e runbooks finais.
4. Registrar ambientes provisionados, usuários responsáveis e apontar runbooks em `docs/runbooks/`.
