# Guia Operacional — Fase 9 (Autenticação AuthN/AuthZ)

> Passo a passo em ghstack para introduzir autenticação obrigatória em todos os canais.

## Pré-requisitos

- `main` sincronizado: `git checkout main && git pull`.
- `uvx --python 3.11 ghstack --version`.
- Ferramentas de migração (Flyway/Liquibase) prontas.
- Conhecimento das políticas em `docs/SECURITY.md`, `docs/PRIVACY.md`, `docs/NFR.md`.

## Pilha ghstack da Fase 9

Após cada commit execute `uvx --python 3.11 ghstack submit -B main`. Cada branch nasce da anterior para manter a pilha consistente.

### Passo 1 — Issue #181 (ADR da arquitetura de autenticação)

- **Branch**: `feat/phase9-181-auth-adr`
- **Base**: `main`
- **Escopo**: documentar provedores, fluxo de login, tokens (JWT + refresh), rotação de chaves e impacto em ambientes.
- **Commit**: `docs(auth): ADR arquitetura AuthN/AuthZ (Closes #181)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase9-181-auth-adr main
  git add docs/adr/0012-auth-architecture.md
  git commit -m "docs(auth): ADR arquitetura AuthN/AuthZ (Closes #181)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 2 — Issue #182 (Atualizar API style + catálogo de erros)

- **Branch**: `feat/phase9-182-auth-contract-docs`
- **Base**: `feat/phase9-181-auth-adr`
- **Escopo**: definir endpoints `/v1/auth/login`, `/v1/auth/refresh`, `/v1/users`, status 401/403 e envelopes em `docs/API_STYLE.md` e `docs/ERRORS.md`.
- **Commit**: `docs(api): contrato de autenticação e erros (Closes #182)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase9-182-auth-contract-docs feat/phase9-181-auth-adr
  git add docs/API_STYLE.md docs/ERRORS.md
  git commit -m "docs(api): contrato de autenticação e erros (Closes #182)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 3 — Issue #183 (Backend: entidades, serviços e guardas)

- **Branch**: `feat/phase9-183-backend-auth`
- **Base**: `feat/phase9-182-auth-contract-docs`
- **Escopo**: criar entidades `User/Role`, repositórios, serviço de credenciais (BCrypt/Argon2), controllers `auth` e proteger endpoints existentes com anotação (`@PreAuthorize`).
- **Commit**: `feat(auth): backend user/login + guardas (Closes #183)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase9-183-backend-auth feat/phase9-182-auth-contract-docs
  git add src main/resources docs/SECURITY.md
  git commit -m "feat(auth): backend user/login + guardas (Closes #183)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 4 — Issue #184 (OpenAPI + clientes web/mobile)

- **Branch**: `feat/phase9-184-openapi-clients`
- **Base**: `feat/phase9-183-backend-auth`
- **Escopo**: atualizar `api/openapi/car-fuel-v1.yaml`, ajustar `packages/shared` (ou `frontend/src/shared`) e `mobile/` com hooks de login/logout, armazenamento seguro de tokens e interceptors.
- **Commit**: `feat(auth): contrato e SDKs web/mobile (Closes #184)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase9-184-openapi-clients feat/phase9-183-backend-auth
  git add api/openapi/car-fuel-v1.yaml packages/shared frontend mobile
  git commit -m "feat(auth): contrato e SDKs web/mobile (Closes #184)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 5 — Issue #185 (Migrações + feature flag `AUTH_ENABLED`)

- **Branch**: `feat/phase9-185-auth-migrations`
- **Base**: `feat/phase9-184-openapi-clients`
- **Escopo**: adicionar scripts Flyway/Liquibase para tabela de usuários, seeds e toggle via env `AUTH_ENABLED` + docs de rollout.
- **Commit**: `chore(auth): migrações e feature flag (Closes #185)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase9-185-auth-migrations feat/phase9-184-openapi-clients
  git add src/main/resources/db docs/ENVIRONMENTS.md scripts/
  git commit -m "chore(auth): migrações e feature flag (Closes #185)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 6 — Issue #186 (Testes de integração e segurança)

- **Branch**: `test/phase9-186-auth-integration`
- **Base**: `feat/phase9-185-auth-migrations`
- **Escopo**: criar testes (Spring MockMvc/Testcontainers) cobrindo login feliz/triste, expiração, roles, brute-force e atualização de docs `docs/TESTING.md`.
- **Commit**: `test(auth): fluxos login e autorização (Closes #186)`
- **Comandos**
  ```powershell
  git checkout -b test/phase9-186-auth-integration feat/phase9-185-auth-migrations
  git add src/test docs/TESTING.md
  git commit -m "test(auth): fluxos login e autorização (Closes #186)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 7 — Issue #187 (Testes de contrato/monitoramento)

- **Branch**: `test/phase9-187-auth-contract`
- **Base**: `test/phase9-186-auth-integration`
- **Escopo**: adicionar suíte de contrato (Karate/Rest-Assured) validando headers `Authorization`, erros `401/403`, scripts de monitoramento e pipelines.
- **Commit**: `test(auth): contratos e monitoramento (Closes #187)`
- **Comandos**
  ```powershell
  git checkout -b test/phase9-187-auth-contract test/phase9-186-auth-integration
  git add tests/contracts scripts/monitoring .github/workflows/*
  git commit -m "test(auth): contratos e monitoramento (Closes #187)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Land e pós-merge

1. Validar os checks (`backend-test`, `auth-contract`, `frontend-test`, `mobile-test`) antes do land.
2. Usar workflow `ghstack land` apontando para o PR do topo (#187).
3. Atualizar `docs/SECURITY.md`, `docs/PRIVACY.md` e `docs/project/PHASE_PLAN.md` com links finais/observações.
4. Mover issues #181–#187 para Done e coordenar rollout com feature flag `AUTH_ENABLED`.
