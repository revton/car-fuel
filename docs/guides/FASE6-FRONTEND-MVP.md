# Guia de Estudo - Fase 6 (Frontend MVP)

> Rascunho guiado para acompanhar passo a passo a implementação da Fase 6 (Car Fuel Web).

## Contexto

- Fase: 6 – Frontend MVP da Car Fuel.
- Backend MVP (Fase 5) concluído e exposto via `api/openapi/car-fuel-v1.yaml`.
- Issues esperadas (exemplo): #14x (stack frontend), #15x (páginas/fluxos), #16x (CI frontend).
- Base de planejamento:
  - `docs/project/PHASE_PLAN.md`
  - `docs/PROJECTS.md` (Project v2: Car Fuel)
  - ADRs em `docs/adr/`
  - Contrato API: `api/openapi/car-fuel-v1.yaml`

## Objetivo do guia

Documentar, de forma didática, como o frontend MVP será construído:
- Quais decisões técnicas foram tomadas (stack, empacotamento, deploy).
- Como os fluxos principais foram mapeados a partir do OpenAPI.
- Como os testes e a CI do frontend serão configurados.
- Como o ghstack será usado (se aplicável) para organizar a pilha de PRs.

## Preenchimento esperado

Ao implementar a Fase 6, atualizar este arquivo com:

- Links para os ADRs da stack frontend e integrações.
- Links para as PRs principais (em ordem).
- Descrição dos fluxos do MVP (ex.: telas, chamadas à API, estados).
- Comandos para rodar o frontend localmente e executar testes.
- Observações sobre NFRs, segurança e observabilidade aplicadas ao frontend.

---

## Passo a passo proposto para a Fase 6

Use estes passos como checklist. Execute cada comando no terminal dentro do diretório do repositório (`car-fuel`), na branch `main` atualizada.

### Passo 0 – Preparar ambiente frontend

1. Conferir se está em `main` e atualizado:
   - `git checkout main`
   - `git pull`
2. Verificar ferramentas:
   - `node --version` (Node 20+).
   - `pnpm --version` / `npm --version` / `yarn --version` (conforme stack a ser definida).
   - `uvx ghstack --version` (se for usar ghstack também para o frontend).
3. Se algo falhar, revisar `docs/DEVELOPER_SETUP.md`.

### Passo 1 – ADR da stack frontend

Objetivo: registrar em um ADR a stack do frontend (framework, bundler, empacotamento, estratégia de deploy).

1. Criar branch:
   - `git checkout -b adr/156-frontend-stack`
2. Criar ADR a partir do template:
   - Copiar `docs/adr/0000-template.md` para algo como  
     `docs/adr/0008-frontend-stack.md`.
   - Descrever:
     - Contexto (integração com backend Fase 5, uso de OpenAPI).
     - Alternativas consideradas (React, Vue, Svelte, etc.).
     - Decisão (framework, bundler, gerenciador de pacotes).
     - Consequências (build, deploy, testes).
3. Commit:
   - `git add docs/adr/0008-frontend-stack.md`
   - `git commit -m "docs(adr): stack técnica frontend (Closes #156)"`
4. Se usar ghstack:
   - `uvx --python 3.11 ghstack submit -B main`

### Passo 2 – ADR de integração frontend–backend

Objetivo: definir como o frontend conversa com o backend (URLs por ambiente, CORS, autenticação futura, observabilidade).

1. Criar branch sobre a ponta da pilha:
   - `git checkout -b adr/157-frontend-backend-integration`
2. Criar ADR, por exemplo:
   - `docs/adr/0009-frontend-backend-integration.md`
   - Descrever:
     - URLs por ambiente (`docs/ENVIRONMENTS.md`).
     - Políticas de CORS, headers e timeouts.
     - Uso do contrato OpenAPI (geração de cliente opcional, validação).
3. Commit:
   - `git add docs/adr/0009-frontend-backend-integration.md`
   - `git commit -m "docs(adr): integração frontend-backend (Closes #157)"`
4. Atualizar pilha (`uvx --python 3.11 ghstack`) se aplicável.

### Passo 3 – Design de UX e layout

Objetivo: mapear fluxos de usuário, desenhar layouts básicos e alinhar expectativas de UX antes da implementação.

1. Mapear fluxos principais usando o contrato e as fases anteriores:
   - Cadastrar veículo → cadastrar tanque → registrar abastecimento.
   - Consultar histórico de abastecimentos por veículo/tanque.
2. Produzir wireframes de baixa fidelidade (pode ser ferramenta simples ou papel) para:
   - Lista/detalhe de veículos.
   - Lista/detalhe de tanques.
   - Tela de registro/listagem de abastecimentos.
   - Página inicial com visão geral/health.
3. Definir guidelines mínimas de UI:
   - Tipografia, espaçamentos, paleta de cores, feedback de erro/sucesso.
   - Verificar alinhamento com `docs/NFR.md` (usabilidade) e `docs/PRIVACY.md` (evitar exposição desnecessária de dados).
4. Registrar as decisões em um doc curto:
   - Ex.: seção neste guia ou arquivo `docs/guides/FASE6-UX-NOTES.md`.
   - Linkar esse doc nas issues de implementação de telas.

### Passo 4 – Criar esqueleto do frontend

Objetivo: criar estrutura do projeto frontend sob `frontend/` (ou diretório equivalente).

1. Criar branch:
   - `git checkout -b feat/158-frontend-skeleton`
2. Gerar projeto conforme stack definida (ex.: React + Vite, Next.js, etc.).
3. Padronizar:
   - Pastas (`frontend/src/pages`, `frontend/src/components`, `frontend/src/api`, ...).
   - Scripts no `package.json` (ex.: `dev`, `build`, `test`, `lint`).
4. Opcional: página inicial `/` com uma mensagem simples usando o health da API.
5. Adicionar testes básicos (ex.: um teste de componente).
6. Commit:
   - `git add frontend`
   - `git commit -m "feat(frontend): esqueleto Car Fuel Web (Closes #158)"`

### Passo 5 – Fluxos de veículos/tanques/abastecimentos

Objetivo: implementar as telas/fluxos mínimos conectados à API (Fase 5).

1. Criar branch:
   - `git checkout -b feat/159-frontend-vehicles-tanks-fuelings`
2. Implementar telas:
   - Listar e criar veículos.
   - Listar e criar tanques por veículo.
   - Registrar e listar abastecimentos.
3. Utilizar o contrato `api/openapi/car-fuel-v1.yaml` como referência:
   - Validar URLs, payloads, códigos de resposta.
4. Adicionar testes:
   - Unitários de componentes.
   - Testes de integração de páginas/fluxos (quando fizer sentido).
5. Commit:
   - `git add frontend`
   - `git commit -m "feat(frontend): fluxos básicos veículos/tanques/abastecimentos (Closes #159)"`

### Passo 6 – Lint, testes e CI do frontend

Objetivo: garantir qualidade mínima e checks em PRs.

1. Criar/ajustar scripts no `package.json`:
   - `lint`, `test`, `build`.
2. Adicionar workflows em `.github/workflows/`:
   - `frontend-lint` (ex.: `npm run lint`).
   - `frontend-test` (ex.: `npm test -- --watch=false`).
   - `frontend-build` (ex.: `npm run build`).
3. Opcional: integrar com pre-commit (hooks para lint/test rápidos).
4. Commit:
   - `git add .github/workflows/*.yml package.json frontend`
   - `git commit -m "ci(frontend): lint, test e build (Closes #160)"`

### Passo 7 – Review, land e guia de estudo

1. Para cada PR da pilha frontend:
   - Revisar diffs, garantir que os checks (`frontend-lint`, `frontend-test`, `frontend-build`) estejam verdes.
2. Land da pilha (ghstack ou Squash & Merge).
3. Após merges em `main`:
   - Conferir fechamento das issues da Fase 6 (via `Closes #<id>`).
   - Atualizar o Project v2 **Car Fuel** (Status = Done para as issues da Fase 6).
4. Atualizar este guia:
   - Linkar ADRs, PRs, scripts e workflows utilizados.
   - Registrar decisões importantes de UX/NFRs e pontos de atenção para fases futuras (auth, caching, etc.).
