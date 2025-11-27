# Guia Operacional — Fase 7 (Devcontainers e Hot Deploy)

> Roteiro com a pilha de PRs (ghstack) da Fase 7, incluindo branches, bases, commits e comando `ghstack submit`.

## Pré-requisitos

- `main` atualizado: `git checkout main && git pull`.
- `uvx --python 3.11 ghstack --version` funcionando (token configurado).
- Docker Desktop + Dev Containers extension instalados (VS Code).
- Scripts `scripts/` executáveis no PowerShell.

## Pilha ghstack da Fase 7

Cada passo gera uma branch baseada na anterior para manter a cadeia na mesma fase. Após cada commit, execute `uvx --python 3.11 ghstack submit -B main` para atualizar a pilha.

### Passo 1 — Issue #168 (ADR do ambiente Devcontainer)

- **Branch**: `feat/phase7-168-devcontainer-adr`
- **Base**: `main`
- **Escopo**: criar ADR descrevendo imagem base, recursos necessários, perfis Compose e impactos em `docs/DEVELOPER_SETUP.md`.
- **Commit**: `docs(devcontainer): ADR do ambiente containerizado (Closes #168)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase7-168-devcontainer-adr main
  # editar docs/adr/0010-devcontainer.md (a partir do template)
  git add docs/adr/0010-devcontainer.md docs/DEVELOPER_SETUP.md
  git commit -m "docs(devcontainer): ADR do ambiente containerizado (Closes #168)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 2 — Issue #169 (Atualizar docs de ambientes/processo)

- **Branch**: `feat/phase7-169-env-docs`
- **Base**: `feat/phase7-168-devcontainer-adr`
- **Escopo**: registrar no `docs/ENVIRONMENTS.md` e `docs/PROCESSO.md` como o devcontainer/hot deploy se encaixa no fluxo e nas proteções.
- **Commit**: `docs(env): fluxo Devcontainer e processo (Closes #169)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase7-169-env-docs feat/phase7-168-devcontainer-adr
  git add docs/ENVIRONMENTS.md docs/PROCESSO.md
  git commit -m "docs(env): fluxo Devcontainer e processo (Closes #169)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 3 — Issue #170 (Criar Devcontainer + Compose)

- **Branch**: `feat/phase7-170-devcontainer-setup`
- **Base**: `feat/phase7-169-env-docs`
- **Escopo**: adicionar `.devcontainer/devcontainer.json`, `docker/dev/Dockerfile`, `compose.devcontainer.yml` e integrar com `docker compose --profile dev`.
- **Commit**: `chore(devcontainer): estrutura base e compose (Closes #170)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase7-170-devcontainer-setup feat/phase7-169-env-docs
  git add .devcontainer docker/dev compose.devcontainer.yml docker-compose.yml
  git commit -m "chore(devcontainer): estrutura base e compose (Closes #170)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 4 — Issue #171 (Scripts de hot deploy backend/frontend)

- **Branch**: `feat/phase7-171-hot-deploy-scripts`
- **Base**: `feat/phase7-170-devcontainer-setup`
- **Escopo**: configurar processos `gradlew bootRun --continuous` e `npm run dev -- --host 0.0.0.0` dentro do container, expor scripts em `scripts/dev/*` e documentar as portas sincronizadas.
- **Commit**: `feat(devcontainer): hot deploy backend/frontend (Closes #171)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase7-171-hot-deploy-scripts feat/phase7-170-devcontainer-setup
  git add scripts/dev .devcontainer docker-compose.yml frontend package.json
  git commit -m "feat(devcontainer): hot deploy backend/frontend (Closes #171)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 5 — Issue #172 (Scripts auxiliares e experiência VS Code)

- **Branch**: `feat/phase7-172-devcontainer-workflow`
- **Base**: `feat/phase7-171-hot-deploy-scripts`
- **Escopo**: adicionar wrappers PowerShell `scripts/dev/*.ps1`, documentação de attach/detach, sincronização de volumes e exemplos para múltiplos agentes.
- **Commit**: `chore(devcontainer): scripts auxiliares e docs (Closes #172)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase7-172-devcontainer-workflow feat/phase7-171-hot-deploy-scripts
  git add scripts/dev docs/DEVELOPER_SETUP.md docs/guides/FASE7-DEVCONTAINER.md
  git commit -m "chore(devcontainer): scripts auxiliares e docs (Closes #172)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 6 — Issue #173 (Smoke test e validação)

- **Branch**: `feat/phase7-173-devcontainer-smoke`
- **Base**: `feat/phase7-172-devcontainer-workflow`
- **Escopo**: criar `scripts/dev/devcontainer-smoke.ps1`, opcional workflow `devcontainer-validate.yml` e instruções para execução automática.
- **Commit**: `test(devcontainer): smoke test e workflow (Closes #173)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase7-173-devcontainer-smoke feat/phase7-172-devcontainer-workflow
  git add scripts/dev/devcontainer-smoke.ps1 .github/workflows/devcontainer-validate.yml
  git commit -m "test(devcontainer): smoke test e workflow (Closes #173)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Land da pilha

1. Revisar/ajustar ordem das PRs no ghstack.
2. Após aprovação, usar o workflow `ghstack land` apontando para o PR do topo (ver `docs/STACK-PR-GHSTACK.md`).
3. Garantir que `Allow force pushes` esteja ativado temporariamente em `main` antes do land e revertido após.
4. Atualizar Project v2 (mover Issues #168–#173 para Done) e `docs/project/PHASE_PLAN.md` se necessário.
