# Guia de Estudo - Passo 6 (Endpoints de Abastecimentos)

Status: Draft  
Data: 2025-11-23

## O que foi feito
- Endpoints conforme OpenAPI:
  - `POST /v1/fuelings`: registra abastecimento; valida payload (422 `invalid_fill_payload`), retorna 404 `tank_not_found` se o tanque não existir.
  - `GET /v1/fuelings`: lista paginada (`page`, `per_page`) com filtros `tank_id`, `vehicle_id`, `from`, `to`.
  - `GET /v1/fuelings/{fueling_id}`: busca por id, retorna 404 `fill_not_found` se ausente.
- Camadas e mapeamentos:
  - Entities: `TankEntity` (id, vehicleId, fuelType, etc.), `FuelingEntity` (tank, filledAt, odometer, volume, totalCost, fullTank, note).
  - Repositórios: `TankRepository` (CRUD), `FuelingRepository` (query com filtros de tank/vehicle/data).
  - DTOs: `FuelingRequest`, `FuelingResponse`, `FuelingsPage` em `FuelingDtos.kt`; `TankRequest/Response/TanksPage` em `TankDtos.kt`.
  - Mappers: `FuelingMappers.kt` (`FuelingEntity -> FuelingResponse`), `TankMappers.kt` (request→entity, entity→response).
  - Serviços: `FuelingService` (validação, filtros, UUID parsing) e `TankService` (CRUD básico, filtro por veículo).
  - Controllers: `FuelingController` e `TankController`.
  - Erros: `InvalidPayloadException` tratado no `GlobalExceptionHandler` (422) e `ResourceNotFoundException` para tanques/abastecimentos (404).

## Testes
- Integração (`FuelingControllerTest`):
  - Criação feliz (201) com Location e payload retornado.
  - 404 para tank inexistente.
  - 422 para payload inválido (odometer/volume/total_cost negativos/zero).
  - Listagem filtrada por `tank_id`.
  - GET por id (200) e 404 para id inexistente.
- Integração (`TankControllerTest`): cria tank, lista e recupera por id.
- Unitários:
  - `FuelingServiceTest` (Mockito) cobre payload inválido, tanque inexistente, criação feliz, paginação inválida, get por id/404.
  - `FuelingMappersTest` valida mapeamento entity→response.
  - `TankServiceTest` (Mockito) cobre criação, paginação inválida e 404.
  - DTOs: `VehicleRequestValidationTest`, `TankRequestValidationTest` e `FuelingRequestValidationTest`.
  - Repositórios: `TankRepositoryTest` (persistência básica) e `FuelingRepositoryTest` (filtros por tank/vehicle/data).
- Rodar: `./gradlew test` (ou `gradlew.bat test`); perfil `test` usa H2 ou Testcontainers conforme config global.

## Lint
- Kotlin lint (Detekt via alias): `./gradlew ktlint` (ou `gradlew.bat ktlint`).
- Pre-commit: `uvx pre-commit run --all-files` (hooks `spectral-openapi-lint`, `ktlint`).
- CI: `.github/workflows/backend-test.yml` (testes) e `kotlin-lint.yml` (Detekt).

## Referências
- Contrato: `api/openapi/car-fuel-v1.yaml`.
- Estilo/erros: `docs/API_STYLE.md`, `docs/ERRORS.md`.
- Stack: `docs/adr/0005-backend-stack.md`.
- Passos anteriores: `docs/guides/FASE5-PASSO5-VEHICLES.md`.
