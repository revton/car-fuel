# Guia de Estudo – Fase 6 (Frontend MVP)

> Roteiro guiado para acompanhar passo a passo a implementação da Fase 6 (Car Fuel Web).

## Contexto

- Fase: **6 – Frontend MVP da Car Fuel**.
- Backend MVP (Fase 5) concluído e exposto via `api/openapi/car-fuel-v1.yaml`.
- Issues principais da fase (até o momento):
  - `#156` – stack técnica frontend (ADR).
  - `#157` – integração frontend-backend (ADR).
  - `#158` – esqueleto do frontend.
  - `#159` – fluxos veículos/tanques/abastecimentos.
  - `#160` – CI (lint, test, build) frontend.
  - `#163` – design de UX e layout do frontend.
- Base de planejamento:
  - `docs/project/PHASE_PLAN.md`
  - `docs/PROJECTS.md` (Project v2: Car Fuel)
  - ADRs em `docs/adr/`
  - Contrato API: `api/openapi/car-fuel-v1.yaml`
- Existe intenção futura de ter também **app mobile**. A stack e a organização do frontend devem facilitar o reuso de modelos, validações, clientes de API e design system entre web e mobile.

## Objetivo do guia

Registrar, de forma didática, como o frontend MVP será construído:
- Quais decisões técnicas foram tomadas (stack, empacotamento, deploy).
- Como os fluxos principais foram mapeados a partir do OpenAPI.
- Como os testes e a CI do frontend foram configurados.
- Como o ghstack foi usado (se aplicável) para organizar a pilha de PRs.
- Como as decisões já antecipam o reuso em um app mobile futuro.

## Preenchimento esperado

Ao implementar a Fase 6, atualizar este arquivo com:

- Links para os ADRs da stack frontend e integrações.
- Links para as PRs principais (em ordem).
- Descrição dos fluxos do MVP (telas, chamadas à API, estados).
- Comandos para rodar o frontend localmente e executar testes.
- Observações sobre NFRs, segurança, observabilidade e reuso mobile aplicados ao frontend.

---

## Passo a passo proposto para a Fase 6

Execute cada comando no terminal dentro do diretório do repositório (`car-fuel`), na branch `main` atualizada.

### Passo 0 – Preparar ambiente frontend

1. Conferir se está em `main` e atualizado:
   - `git checkout main`
   - `git pull`
2. Verificar ferramentas:
   - `node --version` (Node 20+).
   - `pnpm --version` / `npm --version` / `yarn --version` (conforme stack definida).
   - `uvx ghstack --version` (se for usar ghstack também para o frontend).
3. Se algo falhar, revisar `docs/DEVELOPER_SETUP.md`.

### Passo 1 – ADR da stack frontend (Issue #156)

Objetivo: registrar em um ADR a stack do frontend (framework, bundler, empacotamento, estratégia de deploy) já considerando reuso em mobile.

1. Criar branch:
   - `git checkout -b adr/156-frontend-stack`
2. Criar ADR a partir do template:
   - Copiar `docs/adr/0000-template.md` para  
     `docs/adr/0008-frontend-stack.md`.
   - Descrever:
     - Contexto (integração com backend Fase 5, uso de OpenAPI, intenção de reuso em app mobile).
     - Alternativas consideradas (React, Vue, Svelte, etc.).
     - Decisão (framework, bundler, gerenciador de pacotes).
     - Consequências (build, deploy, testes, impacto no reuso para mobile).
3. Commit:
   - `git add docs/adr/0008-frontend-stack.md`
   - `git commit -m "docs(adr): stack técnica frontend (Closes #156)"`
4. Se usar ghstack:
   - `uvx --python 3.11 ghstack submit -B main`

### Passo 2 – ADR de integração frontend-backend (Issue #157)

Objetivo: definir como o frontend conversa com o backend (URLs por ambiente, CORS, autenticação futura, observabilidade), pensando em compartilhamento de cliente HTTP com o app mobile.

1. Criar branch sobre a ponta da pilha:
   - `git checkout -b adr/157-frontend-backend-integration`
2. Criar ADR, por exemplo:
   - `docs/adr/0009-frontend-backend-integration.md`
   - Descrever:
     - URLs por ambiente (`docs/ENVIRONMENTS.md`).
     - Políticas de CORS, headers e timeouts.
     - Uso do contrato OpenAPI (geração de cliente opcional, validação).
     - Organização de um cliente HTTP/SDK em TypeScript que possa ser reaproveitado por uma futura app mobile.
3. Commit:
   - `git add docs/adr/0009-frontend-backend-integration.md`
   - `git commit -m "docs(adr): integração frontend-backend (Closes #157)"`
4. Atualizar pilha (`uvx --python 3.11 ghstack`) se aplicável.

### Passo 3 – Design de UX e layout (Issue #163)

Objetivo: mapear fluxos de usuário, desenhar layouts básicos e alinhar expectativas de UX **antes** da implementação, já pensando em mobile-first/responsivo.

1. Mapear fluxos principais usando o contrato e as fases anteriores:
   - Cadastrar veículo → cadastrar tanque → registrar abastecimento.
   - Consultar histórico de abastecimentos por veículo/tanque.
2. Produzir wireframes de baixa fidelidade (ferramenta simples ou papel) para:
   - Lista/detalhe de veículos.
   - Lista/detalhe de tanques.
   - Tela de registro/listagem de abastecimentos.
   - Página inicial com visão geral/health.
3. Definir guidelines mínimas de UI:
   - Tipografia, espaçamentos, paleta de cores, feedback de erro/sucesso.
   - Verificar alinhamento com `docs/NFR.md` (usabilidade) e `docs/PRIVACY.md` (evitar exposição desnecessária de dados).
4. Pensar o layout de forma **responsiva** e previsível:
   - Evitar dependência forte de interações só de desktop.
   - Usar componentes e padrões de navegação que possam inspirar uma futura versão mobile (React Native/Expo ou similar).
5. Registrar as decisões em um documento dedicado:
   - Arquivo: `docs/guides/FASE6-UX-NOTES.md` (ver seção abaixo).
   - Linkar esse arquivo na Issue `#163` e nas issues de implementação de telas.
6. Exemplo de branch e commit para este passo:
   - Criar branch na ponta da pilha do ghstack:  
     `git checkout -b docs/163-frontend-ux-layout`
   - Após atualizar `FASE6-FRONTEND-MVP.md` e `FASE6-UX-NOTES.md`:  
     `git add docs/guides/FASE6-FRONTEND-MVP.md docs/guides/FASE6-UX-NOTES.md`  
     `git commit -m "docs(ux): Fase 6 frontend – fluxos e layout (Closes #163)"`

### Passo 4 – Criar esqueleto do frontend (Issue #158)

Objetivo: criar estrutura do projeto frontend sob `frontend/` (ou diretório equivalente).

1. Criar branch:
   - `git checkout -b feat/158-frontend-skeleton`
2. Gerar projeto conforme stack definida no ADR (ex.: React + Vite + TypeScript).
3. Padronizar:
   - Pastas (ex.:  
     `frontend/src/pages`, `frontend/src/components`, `frontend/src/api`,  
     `frontend/src/hooks`, `frontend/src/styles`, `frontend/src/shared`).
   - Scripts no `package.json` (ex.: `dev`, `build`, `test`, `lint`).
   - Em `frontend/src/shared`, concentrar modelos, validações e clientes de API em TypeScript **sem dependência de React**, para facilitar reuso em um app mobile.
4. Opcional: página inicial `/` com uma mensagem simples usando o health da API.
5. Adicionar testes básicos (por exemplo, um teste de componente ou de página).
6. Commit:
   - `git add frontend`
   - `git commit -m "feat(frontend): esqueleto Car Fuel Web (Closes #158)"`

### Passo 5 – Fluxos de veículos/tanques/abastecimentos (Issue #159)

Objetivo: implementar as telas/fluxos mínimos conectados à API (Fase 5).

1. Criar branch:
   - `git checkout -b feat/159-frontend-vehicles-tanks-fuelings`
2. Implementar telas:
   - Listar e criar veículos.
   - Listar e criar tanques por veículo.
   - Registrar e listar abastecimentos.
3. Utilizar o contrato `api/openapi/car-fuel-v1.yaml` como referência:
   - Validar URLs, payloads, códigos de resposta.
   - Reaproveitar tipos/clients definidos no ADR de integração (`0009`).
4. Adicionar testes:
   - Unitários de componentes.
   - Testes de integração de páginas/fluxos (quando fizer sentido).
5. Garantir que a lógica de domínio continue concentrada em módulos compartilháveis (`frontend/src/shared`), para ser portável ao mobile.
6. Commit:
   - `git add frontend`
   - `git commit -m "feat(frontend): fluxos básicos veículos/tanques/abastecimentos (Closes #159)"`

### Passo 6 – Lint, testes e CI do frontend (Issue #160)

Objetivo: garantir qualidade mínima e checks em PRs.

1. Criar/ajustar scripts no `package.json`:
   - `lint`, `test`, `build`.
2. Adicionar workflows em `.github/workflows/`:
   - `frontend-lint` (ex.: `pnpm lint` ou `npm run lint`).
   - `frontend-test` (ex.: `pnpm test` ou `npm test -- --watch=false`).
   - `frontend-build` (ex.: `pnpm build` ou `npm run build`).
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
   - Registrar decisões importantes de UX/NFRs, impactos em reuso mobile e pontos de atenção para fases futuras (auth, caching, etc.).

---

## Esboço do módulo compartilhado (`frontend/src/shared`)

Objetivo: definir uma camada de código reutilizável entre o frontend web e um futuro app mobile, isolando domínio e integração HTTP de qualquer dependência do React/DOM.

Estrutura sugerida:

- `frontend/src/shared/domain/`
  - Modelos de domínio: `Vehicle`, `Tank`, `Fueling`, `OdometerUnit`, `FuelType`, etc.
  - Funções puras de domínio: criação segura (`createVehicle`), helpers de paginação, regras de negócio de abastecimento, etc.
- `frontend/src/shared/api/`
  - `types.ts`: tipos alinhados ao OpenAPI (DTOs de request/response).
  - `client.ts`: cliente HTTP único (ex.: `CarFuelApiClient`) com métodos tipados (`listVehicles`, `createTank`, `listFuelings`, ...).
  - `errors.ts`: erros específicos de integração (ex.: `InvalidQueryParamsError`, `TankNotFoundError`), mapeados a partir do envelope de erro padrão da API.
- `frontend/src/shared/mappers/`
  - Funções de mapeamento entre DTOs da API e modelos de domínio (`vehicleDtoToDomain`, `fuelingDomainToCreateRequest`, etc.).
  - Mantém a UI (web ou mobile) independente de detalhes de contrato da API.
- `frontend/src/shared/validation/`
  - Regras reutilizáveis de validação: placa, capacidade de tanque, datas de abastecimento, limites de paginação, etc.
- `frontend/src/shared/config/`
  - Tipos e helpers para configuração (ex.: `CarFuelApiConfig`), sem depender diretamente de `import.meta.env`.
  - No web, o adaptador de ambiente lê `VITE_API_BASE_URL` e monta o `CarFuelApiConfig`; no mobile, outro adaptador faz o mesmo a partir de variáveis do app.

### Exemplo de esqueleto de tipos (não implementado ainda)

> Estes trechos são apenas referenciais para implementação futura durante a Fase 6.

```ts
// frontend/src/shared/domain/vehicle.ts
export interface Vehicle {
  id: string;
  name: string;
  plate: string;
  odometerUnit: 'km' | 'mi';
}

// frontend/src/shared/api/client.ts
export interface CarFuelApiConfig {
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

export class CarFuelApiClient {
  constructor(private readonly config: CarFuelApiConfig) {}

  async listVehicles(params: { page: number; perPage: number }) {
    // implementação futura: chamada HTTP + parse da resposta
  }
}
```

Quando o app mobile for criado, ele poderá importar diretamente estes módulos (por exemplo, via monorepo ou pacote compartilhado) e reutilizar os mesmos tipos, validações e cliente de API, reduzindo duplicidade entre Web e mobile.

