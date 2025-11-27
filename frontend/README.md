# Car Fuel Web – Frontend (Fase 6)

Este diretório contém o **frontend web** do Car Fuel, implementado em **React + TypeScript + Vite**, conforme o ADR `docs/adr/0008-frontend-stack.md`.

Ele consome a Car Fuel API definida na Fase 5 (`api/openapi/car-fuel-v1.yaml`) e, nesta etapa, expõe uma página inicial que consulta o endpoint `/v1/health`.

## Stack

- React + TypeScript
- Vite (dev server e build)
- Vitest + Testing Library (testes)
- Docker + Nginx (build estático via serviço `frontend-web`)

## Uso rápido

### Dev server local (Vite)

```bash
cd frontend
npm install        # primeira vez
npm run dev        # http://localhost:5173
```

Por padrão, o frontend fala com a API em `http://localhost:8080` via `VITE_API_BASE_URL` (ver `src/shared/config/apiConfig.ts`).

### Testes

```bash
cd frontend
npm test
```

Testes usam Vitest + Testing Library (config em `vitest.config.ts` e `src/test/setupTests.ts`).

### Build

```bash
cd frontend
npm run build      # gera dist/ para deploy estático
```

### Docker (perfil dev)

Com backend e banco definidos no `docker-compose.yml` da raiz, é possível subir todo o stack (db + API + frontend) via:

```bash
docker compose --profile dev up --build -d
```

- API backend: `http://localhost:8080`
- Frontend (build em Nginx): `http://localhost:8081`

O serviço `frontend-web` usa o `frontend/Dockerfile` (build multi-stage) e a mesma base de URL da API (`http://localhost:8080`).

## Estrutura relevante

- `src/pages/HomePage.tsx` – página inicial, consome `/v1/health` e exibe status da API.
- `src/shared/config/apiConfig.ts` – resolve `VITE_API_BASE_URL` e expõe `apiConfig.baseUrl`.
- `src/shared/api/health.ts` – função `fetchHealth()` para o endpoint `/v1/health`.
- `src/pages/HomePage.test.tsx` – teste básico da HomePage (Vitest + Testing Library).
- `vite.config.ts` – configuração do Vite (dev/build).
- `vitest.config.ts` – configuração do Vitest (ambiente de testes).

## Documentação relacionada

- Fase 6 – visão geral do frontend: `docs/guides/FASE6-FRONTEND-MVP.md`
- Passo 4 – esqueleto, health e Docker do frontend: `docs/guides/FASE6-PASSO4-FRONTEND.md`
- Notas de UX/layout: `docs/guides/FASE6-UX-NOTES.md`
- Setup de desenvolvimento (backend + frontend + Docker): `docs/DEVELOPER_SETUP.md`

## TODO (próximas iterações)

- Implementar telas de veículos/tanques/abastecimentos conforme `api/openapi/car-fuel-v1.yaml` (Issue `#159`).
- Integrar endpoints de listagem/criação com a camada `src/shared` (clientes HTTP/mapeadores).
- Adicionar testes de componentes e de integração para os fluxos principais.
