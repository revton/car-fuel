# Guia de Estudo - Fase 6 / Passo 4 (Esqueleto Frontend e página inicial)

Status: Draft  
Data: 2025-11-24

## O que foi feito (passo a passo)

1) Criação do projeto `frontend/`
- Foi criado o diretório `frontend/` usando o template React + TypeScript do Vite:
  - `npm create vite@latest frontend -- --template react-ts`
- O projeto segue a decisão do ADR `0008-frontend-stack` (React + TypeScript + Vite) e será o ponto de entrada do **Frontend Car Fuel Web**.

2) Ajustes de tooling, scripts e testes
- Em `frontend/package.json` foram definidos/ajustados os scripts:
  - `dev` → `vite`
  - `build` → `tsc -b && vite build`
  - `lint` → `eslint .`
  - `test` → `vitest`
- Foram adicionadas dependências de teste:
  - `vitest`
  - `@testing-library/react`
  - `@testing-library/jest-dom`
  - `@testing-library/user-event`
- Configurações de build/teste:
  - `frontend/vite.config.ts` mantém apenas a configuração do Vite (build/dev server).
  - `frontend/vitest.config.ts` foi criado para o Vitest, com:
    - `environment: 'jsdom'`
    - `setupFiles: './src/test/setupTests.ts'`
    - `globals: true` (habilita `describe`, `it`, `expect`, etc.).
  - `frontend/src/test/setupTests.ts` importa `@testing-library/jest-dom/vitest` para estender os matchers.
  - `frontend/tsconfig.app.json` exclui arquivos `*.test.ts(x)` e `*.spec.ts(x)` do `tsc -b`, garantindo que testes não quebrem o build de produção.

3) Camada compartilhada mínima (`frontend/src/shared`)
- Configuração da API:
  - `frontend/src/shared/config/apiConfig.ts` expõe `CarFuelApiConfig` e `apiConfig`, lendo `VITE_API_BASE_URL` (com fallback para `http://localhost:8080`).
  - Isso segue a estratégia do ADR `0009-frontend-backend-integration`, permitindo configurar a base da API por ambiente e viabilizando reuso em um futuro app mobile.
- Cliente de health:
  - `frontend/src/shared/api/health.ts` define:
    - o tipo `HealthResponse`,
    - a função `fetchHealth()` que faz `GET /v1/health` usando `apiConfig.baseUrl`,
    - tratamento simples de erro quando o status HTTP não é 2xx.

4) Página inicial `/` consumindo o `/v1/health`
- Foi criada a página `frontend/src/pages/HomePage.tsx` com a responsabilidade de exibir uma visão mínima do sistema e o status da API:
  - Usa `useState` com um tipo discriminado (`idle`, `loading`, `success`, `error`) para representar o estado do health.
  - Chama `fetchHealth()` no `useEffect` inicial e atualiza o estado conforme o resultado.
  - Exibe:
    - mensagem de carregamento (“Verificando status da API...”),
    - mensagem de erro (`role="alert"`) quando a chamada falha,
    - seção com `API status: <status>` e, se presente, o `timestamp` retornado pelo backend.
- O componente `frontend/src/App.tsx` foi simplificado para apenas renderizar a `HomePage`:
  - removeu o contador padrão de exemplo do Vite,
  - passou a servir como entrypoint do SPA Car Fuel Web.

5) Testes básicos da `HomePage`
- Foi criado o teste `frontend/src/pages/HomePage.test.tsx` que:
  - mocka o módulo `../shared/api/health` com Vitest (`vi.mock`),
  - define o retorno de `fetchHealth()` como `{ status: 'ok', timestamp: '...' }`,
  - renderiza `<HomePage />`,
  - verifica que:
    - o texto de carregamento é exibido inicialmente,
    - após a resolução da promise, a página exibe “API status: ok”.
- Esse teste garante que a integração básica da página com `fetchHealth()` funciona e que o componente reage corretamente à resolução assíncrona do health check.

6) Suporte a Docker para o frontend
- Foi criado `frontend/Dockerfile` com build multi-stage:
  - Stage de build em Node 20:
    - `RUN npm ci || npm install`
    - `RUN npm run build`
  - Stage final em Nginx servindo `dist/` em `/usr/share/nginx/html` (porta 80 no container).
- O `docker-compose.yml` passou a incluir o serviço `frontend-web` no profile `dev`:
  - Conectado ao mesmo profile `dev` usado por `app` (backend) e `db-dev` (Postgres).
  - Mapeado para `http://localhost:3000` no host (`ports: "3000:80"`).
- Fluxo com Docker em desenvolvimento:
  - Subir tudo (db + API + frontend):
    - `docker compose --profile dev up --build -d`
  - Resultado esperado:
    - Banco: `db-dev` (Postgres 16).
    - API backend: `http://localhost:8080` (health em `/v1/health`).
    - Frontend: `http://localhost:3000` exibindo status da API.
  - Para detalhes adicionais, `docs/DEVELOPER_SETUP.md` descreve esse fluxo na seção “Frontend via Docker (dev)”. 

## Arquivos tocados e por que

- `frontend/package.json`  
  - Adiciona dependências de teste (Vitest + Testing Library) e script `test`.
- `frontend/vite.config.ts` / `frontend/vitest.config.ts`  
  - Mantêm separadas as configurações de Vite (build/dev) e Vitest (testes, jsdom, setup, globals).
- `frontend/tsconfig.app.json`  
  - Garante que arquivos de teste não participem do build de produção (`tsc -b`).
- `frontend/src/shared/config/apiConfig.ts`  
  - Centraliza a configuração de `baseUrl` da API, respeitando `VITE_API_BASE_URL` e permitindo reuso em Web e mobile.
- `frontend/src/shared/api/health.ts`  
  - Implementa chamada ao endpoint `/v1/health` e tipa a resposta.
- `frontend/src/pages/HomePage.tsx`  
  - Implementa a página inicial do frontend, consumindo a API de health e exibindo o estado da aplicação.
- `frontend/src/App.tsx`  
  - Encapsula a `HomePage` como root component, removendo o boilerplate padrão de Vite.
- `frontend/src/test/setupTests.ts`  
  - Configura Jest DOM para testes de componentes React.
- `frontend/src/pages/HomePage.test.tsx`  
  - Testa comportamento básico da `HomePage` com a API de health mockada.
- `frontend/Dockerfile` e `docker-compose.yml`  
  - Permitem subir o frontend via Docker (`frontend-web`) integrado ao backend e ao banco no profile `dev`.
- `docs/guides/FASE6-FRONTEND-MVP.md`  
  - Documenta o Passo 4, incluindo instruções de branch/commit, estrutura de pastas e expectativa de testes básicos.
- `docs/DEVELOPER_SETUP.md`  
  - Explica como subir o frontend tanto via Vite (`npm run dev`) quanto via Docker (`docker compose --profile dev up --build -d`).

## Próximos passos (plano)

- Fase 6 / Passo 5 (Issue #159):
  - Implementar telas de veículos, tanques e abastecimentos conforme `api/openapi/car-fuel-v1.yaml`.
  - Reutilizar o padrão estabelecido em `frontend/src/shared` (config, api, mappers, validações).
  - Adicionar testes de componentes e de integração de páginas para esses fluxos.
- Atualizar:
  - `docs/guides/FASE6-FRONTEND-MVP.md` com links para PRs e detalhes adicionais do Passo 5.
  - `docs/DEVELOPER_SETUP.md` se forem introduzidos novos comandos ou serviços (por exemplo, CI de frontend ou novas rotas).  
