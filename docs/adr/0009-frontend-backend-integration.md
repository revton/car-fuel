# ADR 0009 – Integração frontend-backend Car Fuel

Status: Proposed  
Data: 2025-11-24

## Contexto
- A Fase 5 definiu e implementou a **Car Fuel API** em Kotlin/Spring Boot, versionada em `api/openapi/car-fuel-v1.yaml` e alinhada a `docs/API_STYLE.md` e `docs/ERRORS.md`.
- A Fase 6 introduz o **frontend web** (React + TypeScript + Vite, ver ADR 0008) que deve consumir essa API em diferentes ambientes (local, dev, produção), respeitando diretrizes de:
  - `docs/ENVIRONMENTS.md` (URLs, variáveis, CORS),
  - `docs/SECURITY.md` (authN/authZ futura, transporte seguro, headers),
  - `docs/PRIVACY.md` (minimização de dados, telemetria),
  - `docs/OBSERVABILITY.md` (logging, métricas, traces),
  - `docs/TESTING.md` (pirâmide de testes e contratos).
- Há intenção de, no futuro, disponibilizar também um **app mobile**. Idealmente, o cliente HTTP e os modelos usados pelo frontend web devem ser reaproveitáveis no mobile, reduzindo duplicação de lógica de integração.
- É necessário padronizar:
  - Como o frontend descobre a URL base da API por ambiente.
  - Como CORS é configurado para permitir o uso do OpenAPI em ferramentas locais (Swagger UI, Redoc, extensões de IDE) e pelo frontend web.
  - Como o contrato OpenAPI será usado para garantir alinhamento (tipos e erros).
  - Como organizar um cliente HTTP/SDK em TypeScript para ser reutilizado na Web e em um futuro app mobile.

## Decisão

### 1. Descoberta de URL base por ambiente
- O backend continua responsável por expor a API HTTP no caminho `/v1/...` conforme `docs/API_STYLE.md`.
- O frontend web não “adivinha” URLs; ele recebe a base da API via configuração:
  - **Local (desenvolvimento):**
    - Backend: `http://localhost:8080`
    - Frontend: `VITE_API_BASE_URL=http://localhost:8080` em `.env.local` (não versionado).
  - **Ambientes remotos (dev/prod):**
    - URLs e domínios mapeados em `docs/ENVIRONMENTS.md` (ex.: `https://api.dev.carfuel.local`, `https://api.carfuel.example`).
    - Para cada ambiente, a pipeline de deploy injeta `VITE_API_BASE_URL` (ou equivalente) no build do frontend.
- Dentro do código compartilhado, a URL é passada via objeto de configuração, não lida diretamente de `import.meta.env`:
  - Web: adaptador de ambiente lê `import.meta.env.VITE_API_BASE_URL` e monta `CarFuelApiConfig`.
  - Mobile: adaptador próprio monta `CarFuelApiConfig` a partir de variáveis do app.

### 2. Cliente HTTP/SDK compartilhado (TypeScript)
- Será criado um **cliente HTTP tipado** em `frontend/src/shared/api`:
  - `CarFuelApiConfig` descreve base URL e dependência de `fetch`:
    - `baseUrl: string`
    - `fetchImpl?: typeof fetch` (permitindo injeção de implementação no mobile/testes).
  - `CarFuelApiClient` expõe métodos de alto nível, alinhados ao OpenAPI, por exemplo:
    - `listVehicles`, `createVehicle`, `getVehicle`,
    - `listTanks`, `createTank`,
    - `listFuelings`, `createFueling`,
    - `getHealth`, etc.
- Esse cliente:
  - Vive em `frontend/src/shared/api` e **não importa React**.
  - Usa tipos de request/response alinhados ao contrato em `frontend/src/shared/api/types.ts`.
  - Converte erros HTTP em objetos de erro de domínio (ex.: `InvalidQueryParamsError`, `TankNotFoundError`) usando o envelope de erro padronizado descrito em `docs/ERRORS.md`.
  - Pode ser importado tanto pelo frontend web quanto por um futuro app mobile em React Native/Expo.

### 3. CORS e headers
- O backend expõe CORS seguindo `docs/SECURITY.md` e `docs/ENVIRONMENTS.md`:
  - Em desenvolvimento local:
    - `http://localhost:5173` (Vite) é permitido como origem para chamadas ao `http://localhost:8080`.
  - Em dev/prod:
    - Domínios do frontend são explicitamente permitidos (ex.: `https://web.dev.carfuel.local`, `https://web.carfuel.example`).
- Cabeçalhos importantes:
  - `Content-Type: application/json` em todas as requisições com corpo JSON.
  - `Accept: application/json` em todas as requisições que consomem a API.
  - Futuro: cabeçalhos de autenticação (`Authorization: Bearer <token>`) serão tratados em ADR específico de auth.
- O frontend **não** gerencia CORS diretamente; ele apenas faz requisições para a URL base configurada. CORS permanece uma responsabilidade do backend e da configuração de infraestrutura.

### 4. Uso do contrato OpenAPI
- `api/openapi/car-fuel-v1.yaml` permanece como **fonte de verdade** para endpoints, esquemas e códigos de erro.
- O cliente HTTP em `frontend/src/shared/api` será implementado manualmente, mas:
  - Tipos TypeScript de request/response devem ser alinhados ao OpenAPI.
  - Para pontos mais delicados (por exemplo, paginação, filtros de data), o OpenAPI é a referência obrigatória.
- Geração automática de clientes a partir do OpenAPI (OpenAPI Generator, etc.) é considerada opcional neste momento; se for adotada, será registrada em ADR futuro específico para o SDK.

### 5. Observabilidade e erros no frontend
- O frontend deve:
  - Mapear erros HTTP em erros de domínio bem definidos (ex.: `invalid_query_params`, `tank_not_found`), conforme `docs/ERRORS.md`.
  - Evitar logar dados sensíveis em clientes de telemetria, respeitando `docs/PRIVACY.md`.
  - Expor mensagens de erro amigáveis e consistentes na UI, alinhadas aos códigos internos da API.
- Quando for introduzida instrumentação de frontend (Web Vitals, tracking de erros), ela deve:
  - Utilizar identificadores de requisição (correlação com o backend, ver `docs/OBSERVABILITY.md`).
  - Evitar enviar payloads inteiros; priorizar metadados e códigos de erro.

## Consequências

Pontos positivos:
- Separação clara entre **configuração por ambiente** e **código de cliente HTTP**, facilitando testes e reuso.
- Client TypeScript compartilhado reduz duplicação de lógica de integração entre Web e futuro app mobile.
- Alinhamento explícito com `docs/ENVIRONMENTS.md`, `docs/SECURITY.md`, `docs/PRIVACY.md` e `docs/OBSERVABILITY.md`, reduzindo surpresas em produção.

Pontos negativos / trade-offs:
- Introduz uma camada adicional (SDK/cliente) que precisa ser mantida em sincronia com o OpenAPI.
- Exige disciplina para manter o código em `frontend/src/shared` independente de React e de APIs específicas de navegador.
- Possível necessidade futura de automatizar a geração de tipos a partir do OpenAPI para evitar divergência manual.

Impactos:
- `docs/DEVELOPER_SETUP.md` deve ser atualizado para explicar:
  - Como configurar `VITE_API_BASE_URL` localmente.
  - Como rodar o frontend apontando para diferentes ambientes da API.
- `docs/TESTING.md` deve incluir uma seção sobre testes do cliente HTTP (unitários e de integração) e testes end-to-end Web+API.
- `docs/ENVIRONMENTS.md` e `docs/SECURITY.md` precisam listar os domínios de frontend e regras de CORS correspondentes.
- Futuros ADRs de mobile devem considerar este cliente HTTP como camada de integração padrão.

## Alternativas consideradas

- **Frontends configurando URLs “hard-coded” por ambiente**
  - Prós: simples de implementar no curto prazo.
  - Contras: difícil de manter; duplicação de configuração entre Web/mobile; risco de inconsistências em CI/CD.

- **Cada app (Web/Mobile) mantendo seu próprio cliente HTTP**
  - Prós: máxima independência entre plataformas.
  - Contras: duplicação de lógica de integração, maior risco de divergência em relação ao OpenAPI e ao comportamento de erros.

- **Gerar automaticamente o cliente a partir do OpenAPI desde o início**
  - Prós: segurança de tipos diretamente derivada do contrato; menos risco de divergência.
  - Contras: aumenta a complexidade inicial da Fase 6; introduz ferramentas adicionais e curva de aprendizado.

## Relacionados

- Issues:
  - #157 docs(adr): integração frontend-backend Car Fuel
- PRs:
  - _(a ser definido pela PR que introduzir este ADR)_
- Outros ADRs:
  - `docs/adr/0001-branch-main-stack-pr-ghstack.md`
  - `docs/adr/0002-api-style-and-errors.md`
  - `docs/adr/0003-nfrs-and-observability.md`
  - `docs/adr/0004-security-privacy-environments.md`
  - `docs/adr/0005-backend-stack.md`
  - `docs/adr/0006-domain-model-vehicles-fuelings.md`
  - `docs/adr/0007-openapi-lint-pre-commit.md`
  - `docs/adr/0008-frontend-stack.md`

