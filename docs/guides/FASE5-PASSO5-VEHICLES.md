# Guia de Estudo — Passo 5 (Endpoints de Veículos)

Status: Draft  
Data: 2025-11-22

## O que foi feito
- Endpoints de veículos conforme OpenAPI:
  - `POST /v1/vehicles`: cria com `name`, `plate` opcional, `odometer_unit` (default KM), gera `id`/`created_at`.
  - `GET /v1/vehicles`: lista paginada (`page`, `per_page`), filtro `plate` (contains case-insensitive).
  - `GET /v1/vehicles/{vehicle_id}`: busca por id, 404 `vehicle_not_found`.
- Regras de erro (docs/ERRORS.md): 400 `invalid_query_params`, 404 `vehicle_not_found`, 409 `conflict` (placa duplicada).
- Camadas e mapeamentos:
  - DTOs/paginação: `VehicleRequest`, `VehicleResponse`, `VehiclesPage`, `PaginationMeta` em `VehicleDtos.kt`.
  - Entidade JPA: `VehicleEntity` (`@Entity`, tabela `vehicles`, placa unique).
  - Repositório: `VehicleRepository` (Spring Data JPA) e queries por placa.
  - Mappers de extensão: `VehicleMappers.kt` (request→entity, entity→response).
  - Serviço: `VehicleService` aplica regras (placa única, filtro, paginação) e converte para DTOs.
  - Controller: `VehicleController` expõe apenas DTOs.
- Organização de pacotes:
  - `controller/` (`VehicleController`), `service/`, `repository/`, `entity/`, `dto/`, `mapper/` (pasta por camada, módulos de domínio como veículos ficam dentro dessas camadas).
  - Erros: `ProblemDetails` + `GlobalExceptionHandler` em `src/main/kotlin/com/carfuel/shared/`.
- Persistência/config:
  - `build.gradle`: adicionados `spring-boot-starter-data-jpa`, driver `postgresql`, H2 para teste, plugin `kotlin-jpa`.
  - `src/main/resources/application.properties`: datasource PostgreSQL via env vars (`POSTGRES_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`), `ddl-auto=update`.
  - `src/test/resources/application-test.properties`: H2 em modo PostgreSQL para testes.

## Testes
- Integração (`src/test/kotlin/com/carfuel/vehicle/VehicleControllerTest.kt`): criação e get, conflito por placa, filtro, paginação inválida, 404.
- Unitários:
  - DTO: validação de `VehicleRequest` (`VehicleRequestValidationTest`).
  - Mapper: `VehicleMappersTest` para `toEntity` (trim/default) e `toResponse`.
  - Service: `VehicleServiceTest` com Mockito (conflito de placa, paginação inválida, busca por id, criação feliz).
  - Repository: `VehicleRepositoryTest` (@DataJpaTest) cobrindo `findByPlateContainingIgnoreCase`/`existsByPlateIgnoreCase`.
- Rodar: `./gradlew test` (ou `gradlew.bat test`); usa perfil `test` com H2.

## Lint
- Kotlin lint (Detekt via alias): `./gradlew ktlint` (ou `gradlew.bat ktlint`).
- Pre-commit: `uvx pre-commit run ktlint --all-files` (ou `uvx pre-commit run --all-files`).
- CI: `.github/workflows/kotlin-lint.yml` roda `./gradlew ktlint`.

## Referências
- Contrato: `api/openapi/car-fuel-v1.yaml`.
- UIs e contrato servidos pela aplicação (rodando local ou via Docker):
  - Swagger UI: `http://localhost:8080/docs`
  - ReDoc: `http://localhost:8080/redoc.html` (bundle local, sem dependência de CDN)
  - YAML bruto: `http://localhost:8080/openapi/car-fuel-v1.yaml`
- Estilo/erros: `docs/API_STYLE.md`, `docs/ERRORS.md`.
- Stack: `docs/adr/0005-backend-stack.md` (Kotlin + Spring Boot + Gradle + JPA/PostgreSQL).
- Passo 4 (health/esqueleto): `docs/guides/FASE5-PASSO4-BACKEND.md`.
