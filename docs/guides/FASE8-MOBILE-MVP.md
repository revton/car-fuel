# Guia Operacional — Fase 8 (Mobile MVP React Native/Expo)

> Roteiro detalhado da pilha ghstack para entregar o app mobile reutilizando a camada `shared`.

## Pré-requisitos

- `main` atualizado (`git checkout main && git pull`).
- `uvx --python 3.11 ghstack --version`.
- Node 20+, Expo CLI (`npx expo --version`), Android/iOS toolchains opcionais.
- Workspace npm preparado para suportar `packages/shared`.

## Pilha ghstack da Fase 8

Execute os passos em sequência. Cada branch nasce da anterior para manter a pilha ghstack em uma mesma fase. Após cada commit, publique/atualize com `uvx --python 3.11 ghstack submit -B main`.

### Passo 1 — Issue #174 (ADR stack mobile e reuso)

- **Branch**: `feat/phase8-174-mobile-adr`
- **Base**: `main`
- **Escopo**: ADR com decisões de stack (Expo, roteamento, storage seguro, monorepo com `packages/shared`).
- **Commit**: `docs(mobile): ADR stack React Native/Expo (Closes #174)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase8-174-mobile-adr main
  git add docs/adr/0011-mobile-stack.md
  git commit -m "docs(mobile): ADR stack React Native/Expo (Closes #174)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 2 — Issue #175 (Plano de integração mobile ↔ backend)

- **Branch**: `feat/phase8-175-mobile-backend-plan`
- **Base**: `feat/phase8-174-mobile-adr`
- **Escopo**: atualizar `docs/ENVIRONMENTS.md`/`docs/PRIVACY.md` com variáveis, certificados, telemetria mobile e mapa de CORS.
- **Commit**: `docs(mobile): integrações e ambientes (Closes #175)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase8-175-mobile-backend-plan feat/phase8-174-mobile-adr
  git add docs/ENVIRONMENTS.md docs/PRIVACY.md docs/SECURITY.md
  git commit -m "docs(mobile): integrações e ambientes (Closes #175)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 3 — Issue #176 (Estruturar app Expo)

- **Branch**: `feat/phase8-176-mobile-setup`
- **Base**: `feat/phase8-175-mobile-backend-plan`
- **Escopo**: criar diretório `mobile/` via `npx create-expo-app`, configurar TypeScript, scripts `dev/build`, `.env.example` e integração com `packages/shared`.
- **Commit**: `feat(mobile): bootstrap Expo app (Closes #176)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase8-176-mobile-setup feat/phase8-175-mobile-backend-plan
  npx create-expo-app@latest mobile --template expo-template-blank-typescript
  git add mobile package.json pnpm-workspace.yaml
  git commit -m "feat(mobile): bootstrap Expo app (Closes #176)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 4 — Issue #177 (Extrair camada `packages/shared`)

- **Branch**: `feat/phase8-177-shared-workspace`
- **Base**: `feat/phase8-176-mobile-setup`
- **Escopo**: mover `frontend/src/shared` para `packages/shared`, configurar build (tsup/tsc), publicar localmente e ajustar `frontend/` e `mobile/`.
- **Commit**: `feat(shared): workspace comum web/mobile (Closes #177)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase8-177-shared-workspace feat/phase8-176-mobile-setup
  git add packages/shared frontend mobile package.json pnpm-workspace.yaml
  git commit -m "feat(shared): workspace comum web/mobile (Closes #177)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 5 — Issue #178 (Telas do Mobile MVP)

- **Branch**: `feat/phase8-178-mobile-flows`
- **Base**: `feat/phase8-177-shared-workspace`
- **Escopo**: implementar telas splash/health, veículos e abastecimentos consumindo `packages/shared`, além de navegação (React Navigation) e hooks de estado.
- **Commit**: `feat(mobile): telas health/veículos/abastecimentos (Closes #178)`
- **Comandos**
  ```powershell
  git checkout -b feat/phase8-178-mobile-flows feat/phase8-177-shared-workspace
  git add mobile packages/shared
  git commit -m "feat(mobile): telas health/veículos/abastecimentos (Closes #178)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 6 — Issue #179 (Testes mobile)

- **Branch**: `test/phase8-179-mobile-tests`
- **Base**: `feat/phase8-178-mobile-flows`
- **Escopo**: configurar Jest + Testing Library, mocks de fetch/Expo SecureStore, `expo-doctor` script e instruções em `docs/TESTING.md`.
- **Commit**: `test(mobile): suíte Jest e validações (Closes #179)`
- **Comandos**
  ```powershell
  git checkout -b test/phase8-179-mobile-tests feat/phase8-178-mobile-flows
  git add mobile docs/TESTING.md package.json
  git commit -m "test(mobile): suíte Jest e validações (Closes #179)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Passo 7 — Issue #180 (Workflow CI mobile)

- **Branch**: `ci/phase8-180-mobile-workflow`
- **Base**: `test/phase8-179-mobile-tests`
- **Escopo**: criar `.github/workflows/mobile-test.yml`, lint e testes, opção Detox/EAS para PRs etiquetadas.
- **Commit**: `ci(mobile): workflow lint/test (Closes #180)`
- **Comandos**
  ```powershell
  git checkout -b ci/phase8-180-mobile-workflow test/phase8-179-mobile-tests
  git add .github/workflows/mobile-test.yml mobile package.json
  git commit -m "ci(mobile): workflow lint/test (Closes #180)"
  uvx --python 3.11 ghstack submit -B main
  ```

### Land da pilha

1. Revisar a ordem dos PRs no ghstack e garantir que o topo é #180.
2. Rodar `ghstack land` (workflow manual) após aprovações e checks (`mobile-test`) verdes.
3. Atualizar `docs/guides/FASE8-MOBILE-MVP.md` com links das PRs e screenshots.
4. Mover Issues #174–#180 para Done no Project v2.
