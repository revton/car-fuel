# Guia de Estudo — Contrato OpenAPI (Car Fuel v1)

Status: Draft  
Data: 2025-11-22

## Escopo e formato
- Arquivo: `api/openapi/car-fuel-v1.yaml`, OpenAPI **3.0.3**, versionado junto ao código.
- Versão da API: caminhos com `/v1/...` (versionamento explícito no path).
- Tags: Health, Vehicles, Tanks, Fuelings.
- Servers: exemplo `https://api.car-fuel.local` e `http://localhost:8080` (dev).

## Endpoints principais
- `GET /v1/health`: responde `status`, `timestamp`, `version`, `environment`, `uptime_seconds` (schema `HealthResponse`).
- `Vehicles`: `GET /v1/vehicles` (pagina, filtra por `plate`), `POST /v1/vehicles`, `GET /v1/vehicles/{vehicle_id}`.
- `Tanks`: `GET /v1/tanks` (filtro `vehicle_id`), `POST /v1/tanks`, `GET /v1/tanks/{tank_id}`.
- `Fuelings`: `GET /v1/fuelings` (filtros `vehicle_id`, `tank_id`, `from`, `to`), `POST /v1/fuelings`, `GET /v1/fuelings/{fueling_id}`.

## Schemas e campos-chave
- `HealthResponse`: `status` (req), `timestamp` (req), `version`, `environment`, `uptime_seconds`.
- `Vehicle/VehicleInput`: `name` (req), `plate` opcional, `odometer_unit` (KM/MI), `created_at`, `archived_at`.
- `Tank/TankInput`: `vehicle_id` (req), `fuel_type` enum, `capacity_liters`, `is_primary`.
- `Fueling/FuelingInput`: `tank_id` (req), `filled_at` (req), `odometer`, `volume_liters`, `total_cost`, `full_tank`, `note`; `vehicle_id` é read-only derivado.
- `Pagination`: `page`, `per_page`, `total_items`, `total_pages`.
- `ProblemDetails`: envelope de erro (type/title/status/detail/instance/code/requestId/errors).

## Erros (docs/ERRORS.md)
- Códigos: `vehicle_not_found`, `tank_not_found`, `fill_not_found`, `invalid_fill_payload` (422), `invalid_query_params` (400), `conflict`, `internal_error`, etc.
- Respostas modeladas com `application/problem+json` e headers `X-Request-Id`.

## Convenções usadas
- Campos em `snake_case` nos payloads (ex.: `tank_id`, `volume_liters`).
- Datas em ISO 8601 (`date-time`).
- Paginação: query `page`, `per_page`; resposta `meta` com totals.
- Versionamento via path `/v1`.

## Lint e automação
- Regras: `.spectral.yaml` (estende `spectral:oas`).
- Lint local: `npx --yes @stoplight/spectral-cli@6 lint api/openapi/car-fuel-v1.yaml` ou via pre-commit (`uvx pre-commit run spectral-openapi-lint --all-files`).
- CI: workflow `.github/workflows/openapi-lint.yml` roda o mesmo comando.

## Referências
- Estilo: `docs/API_STYLE.md` (versionamento, headers, payloads, erros).
- Erros: `docs/ERRORS.md` (envelope e códigos internos).
- Stack: `docs/adr/0005-backend-stack.md` (Kotlin + Spring Boot).
- Passo 4 (backend): `docs/guides/FASE5-PASSO4-BACKEND.md` para execução e testes.
