# Guia de Estudo — Fase 5 (Backend MVP)

> Rascunho guiado para acompanhar passo a passo a implementação da Fase 5.

## Contexto

- Fase: 5 — Backend MVP da Car Fuel API.
- Issues relacionadas (inicial): #129, #130, #131, #132, #133, #134, #135.
- Base de planejamento:
  - `docs/project/PHASE_PLAN.md`
  - `docs/PROJECTS.md` (Project v2: Car Fuel)
  - ADRs em `docs/adr/`

## Objetivo do guia

Documentar, de forma didática, como o backend MVP foi construído:
- Quais decisões técnicas foram tomadas (stack, modelo de dados, contratos).
- Como a API foi desenhada (OpenAPI) e implementada.
- Como os testes e a CI foram configurados.
- Como o ghstack foi usado para organizar a pilha de PRs.

## Preenchimento esperado (quando a implementação acontecer)

Ao implementar a Fase 5, atualizar este arquivo com:

- Links para os ADRs criados/atualizados.
- Links para as PRs principais da pilha (em ordem).
- Descrição dos endpoints do MVP (exemplos de requisição/resposta).
- Comandos para rodar o serviço localmente e executar testes.
- Observações sobre NFRs, segurança e observabilidade aplicadas.

---

## Passo a passo para implementar a Fase 5 com ghstack

Use estes passos como checklist. Execute cada comando no terminal dentro do diretório do repositório (`car-fuel`), na branch `main` atualizada.

### Passo 0 — Preparar ambiente

1. Conferir se está em `main` e atualizado:
   - `git checkout main`
   - `git pull`
2. Verificar ferramentas:
   - `git --version`
   - `gh --version`
   - `uvx ghstack --version`

Se algo falhar, revisar `docs/DEVELOPER_SETUP.md`.

### Passo 1 — Issue #129: ADR stack técnica backend

Objetivo: registrar em um ADR a linguagem, framework e forma de persistência do backend.

1. Criar branch:
   - `git checkout -b adr/129-backend-stack`
2. Criar ADR usando o template:
   - Copiar `docs/adr/0000-template.md` para um novo arquivo, por exemplo  
     `docs/adr/0005-backend-stack.md`.
   - Preencher:
     - Contexto do backend Car Fuel.
     - Alternativas consideradas (ex.: linguagens/frameworks).
     - Decisão (stack escolhida).
     - Consequências.
3. Garantir que o ADR referencie a issue **#129** (no texto).
4. Commit:
   - `git add docs/adr/0005-backend-stack.md`
   - `git commit -m "docs(adr): stack técnica backend (Closes #129)"`
5. Publicar a primeira PR da pilha com ghstack:
   - `uvx --python 3.11 ghstack submit -B main`
6. No GitHub:
   - Abrir a PR criada pelo ghstack.
   - Conferir se a seção `Issues` (gerada pelo workflow `stack-pr-body`) contém `Closes #129` e se o título foi limpo (sem o sufixo).
   - Mover a issue #129 para **In Progress** / **Review** no Project **Car Fuel**.

### Passo 2 — Issue #130: ADR modelo de dados (veículos/abastecimentos)

Objetivo: descrever o modelo conceitual de veículos, abastecimentos e entidades relacionadas.

1. Partindo da mesma base (após o passo 1):
   - `git checkout -b adr/130-domain-model`
2. Criar novo ADR, por exemplo:
   - `docs/adr/0006-domain-model-vehicles-fuelings.md`
   - Descrever:
     - Entidades (veículo, abastecimento, etc.).
     - Campos principais e relacionamentos.
     - Regras importantes (ex.: como calcular consumo médio).
3. Referenciar a issue **#130** no texto.
4. Commit:
   - `git add docs/adr/0006-domain-model-vehicles-fuelings.md`
   - `git commit -m "docs(adr): modelo de dados veículos/abastecimentos (Closes #130)"`
5. Atualizar a pilha com ghstack:
   - `uvx --python 3.11 ghstack`
6. No GitHub:
   - Verificar que agora existem **duas PRs** na pilha (129 embaixo, 130 em cima).
   - Conferir se a seção `Issues` da PR da issue #130 inclui `Closes #130` e se o título foi limpo.

### Passo 3 — Issue #131: OpenAPI do MVP

Objetivo: definir um contrato OpenAPI inicial (por exemplo `/health`, `/vehicles`, `/fuelings`).

1. Criar branch a partir da ponta da pilha:
   - `git checkout -b docs/131-openapi-mvp`
2. Adicionar arquivo de contrato (exemplos possíveis):
   - `docs/openapi/car-fuel-v1.yaml` **ou** `api/openapi/car-fuel-v1.yaml`.
3. Seguir as diretrizes:
   - `docs/API_STYLE.md`
   - `docs/ERRORS.md` (envelope de erro, códigos internos).
4. Commit:
   - `git add <arquivo openapi>`
   - `git commit -m "docs(api): contrato OpenAPI MVP (Closes #131)"`
5. Atualizar a pilha:
   - `uvx --python 3.11 ghstack`
6. No GitHub:
   - Abrir a PR criada para a issue #131 e verificar se a seção `Issues` contém `Closes #131` e se o título foi limpo.

### Passo 4 — Issue #132: esqueleto backend e `/health`

Objetivo: criar o projeto backend e um endpoint simples `/health`.

1. Criar branch:
   - `git checkout -b feat/132-backend-health`
2. Criar estrutura do projeto (conforme a stack do ADR #129):
   - Pastas de código fonte, configuração de build, etc.
   - Implementar um endpoint `/health` que responda algo simples (ex.: `{"status":"ok"}`).
3. Opcional: adicionar testes básicos para o `/health`.
4. Commit:
   - `git add <arquivos do backend>`
   - `git commit -m "feat(api): esqueleto backend e /health (Closes #132)"`
5. Atualizar a pilha:
   - `uvx --python 3.11 ghstack`
6. No GitHub:
   - Abrir a PR criada para a issue #132 e verificar se a seção `Issues` contém `Closes #132` e se o título foi limpo.

### Passo 5 — Issue #133: endpoints veículos

Objetivo: implementar endpoints do MVP para veículos (ex.: criar e listar).

1. Criar branch:
   - `git checkout -b feat/133-vehicles`
2. Implementar endpoints conforme o OpenAPI:
   - Ex.: `POST /vehicles`, `GET /vehicles`.
3. Adicionar testes (unitários/integrados) alinhados ao contrato.
4. Commit:
   - `git add <arquivos modificados>`
   - `git commit -m "feat(api): endpoints veículos MVP (Closes #133)"`
5. Atualizar a pilha:
   - `uvx --python 3.11 ghstack`
6. No GitHub:
   - Abrir a PR criada para a issue #133 e verificar se a seção `Issues` contém `Closes #133` e se o título foi limpo.

### Passo 6 — Issue #134: endpoints abastecimentos

Objetivo: implementar endpoints para registrar abastecimentos e listar histórico.

1. Criar branch:
   - `git checkout -b feat/134-fuelings`
2. Implementar endpoints conforme o OpenAPI:
   - Ex.: `POST /fuelings`, `GET /fuelings`.
3. Adicionar testes cobrindo casos principais.
4. Commit:
   - `git add <arquivos modificados>`
   - `git commit -m "feat(api): endpoints abastecimentos MVP (Closes #134)"`
5. Atualizar a pilha:
   - `uvx --python 3.11 ghstack`
6. No GitHub:
   - Abrir a PR criada para a issue #134 e verificar se a seção `Issues` contém `Closes #134` e se o título foi limpo.

### Passo 7 — Issue #135: CI (build + testes backend como checks)

Objetivo: garantir que o backend seja compilado/testado em CI e expor esses jobs como checks.

1. Criar branch:
   - `git checkout -b ci/135-backend-build-test`
2. Adicionar/atualizar workflow(s) em `.github/workflows/`:
   - Build do backend.
   - Execução de testes.
3. Conferir que os nomes dos jobs/checks ficam claros para uso em Branch protection.
4. Commit:
   - `git add .github/workflows/*.yml`
   - `git commit -m "ci: build e testes backend (Closes #135)"`
5. Atualizar a pilha:
   - `uvx --python 3.11 ghstack`
6. No GitHub:
   - Abrir a PR criada para a issue #135 e verificar se a seção `Issues` contém `Closes #135` e se o título foi limpo.

### Passo 8 — Review, land e guia de estudo

1. Para cada PR da pilha:
   - Revisar diffs, garantir que os checks (`update`, `validate` e novos checks de CI) estejam verdes.
2. Land da pilha:
   - Opção A: Squash & Merge manual na ordem (da base para o topo).
   - Opção B: usar `ghstack land` (ver `docs/STACK-PR-GHSTACK.md` e workflow `ghstack-land.yml`).
3. Após as merges em `main`:
   - Conferir fechamento das issues #129–#135 via `Closes #<id>` na seção `Issues` do body e nas issues correspondentes.
   - Atualizar o Project **Car Fuel** (Status = Done).
4. Atualizar este guia:
   - Adicionar links para os ADRs, arquivo OpenAPI, PRs principais e qualquer observação de NFRs, segurança e observabilidade aplicada.


### Registro do passo 4 (implementado)
- Backend inicial em **Kotlin** (JDK 17) com Spring Boot 3.2.5 e Gradle wrapper 8.7.
- Endpoint `/v1/health` respondendo `{"status":"ok","timestamp":"<iso8601>"}`.
- Teste de integra��o com MockMvc validando status 200, `status=ok` e presen�a de `timestamp`.

