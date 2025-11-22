# Guia de Estudo — Passo 4 (Esqueleto Backend e `/health`)

Status: Draft  
Data: 2025-11-22

## O que foi feito (passo a passo)
1) Stack e tooling
- Stack do ADR 0005: **Kotlin (JDK 17) + Spring Boot 3.2.5 + Gradle wrapper 8.7**.
- Criamos `settings.gradle` (nome do projeto), `build.gradle` (plugins e dependências), `gradlew`/`gradlew.bat` e `gradle/wrapper/*` (wrapper travado em Gradle 8.7).
- Toolchain JDK 17 no Gradle para evitar divergência local/CI.

2) Projeto Spring Boot em Kotlin
- Aplicação principal: `src/main/kotlin/com/carfuel/CarFuelApplication.kt`.
- Endpoint `/v1/health`: `src/main/kotlin/com/carfuel/health/HealthController.kt` retornando `{"status":"ok","timestamp":"<iso8601>"}`.

3) Testes
- Teste de integração com MockMvc: `src/test/kotlin/com/carfuel/health/HealthControllerTest.kt` valida HTTP 200, `status=ok` e presença de `timestamp`.

4) Execução local e lint
- Testes: `./gradlew test` (ou `gradlew.bat test`).
- Subir app: `./gradlew bootRun` (ou `gradlew.bat bootRun`); health em `http://localhost:8080/v1/health`.
- Linter OpenAPI: `npx --yes @stoplight/spectral-cli@6 lint api/openapi/car-fuel-v1.yaml` (usa `.spectral.yaml`).
- Pre-commit: `uvx pre-commit install`; rodar manual `uvx pre-commit run spectral-openapi-lint --all-files`; escapar com `SKIP=spectral-openapi-lint git commit ...`.

## Arquivos tocados e por quê
- `settings.gradle`: declara o nome do root project para o Gradle.
- `build.gradle`: plugins Kotlin/Spring Boot/dependency-management; dependências web/actuator/validation/test/kotlin-reflect; define JDK 17; `kotlinOptions` com `-Xjsr305=strict` e `jvmTarget=17`; `useJUnitPlatform()` para JUnit 5.
- `gradlew`, `gradlew.bat`, `gradle/wrapper/gradle-wrapper.properties`, `gradle/wrapper/gradle-wrapper.jar`: garantem o uso do Gradle 8.7 sem instalação manual.
- `src/main/kotlin/com/carfuel/CarFuelApplication.kt`: ponto de entrada Spring Boot.
- `src/main/kotlin/com/carfuel/health/HealthController.kt`: controller REST para `/v1/health`.
- `src/test/kotlin/com/carfuel/health/HealthControllerTest.kt`: teste de integração do endpoint.
- Docs: `docs/adr/0005-backend-stack.md` (stack Kotlin detalhada), `docs/DEVELOPER_SETUP.md`, `docs/DIRETRIZES.md`, `docs/guides/FASE5-BACKEND-MVP.md` (registro do passo 4).

## Próximos passos (plano)
- Issue #133: implementar endpoints de veículos conforme OpenAPI.
- Issue #134: implementar endpoints de abastecimentos.
- Issue #135: configurar CI para build/test do backend.
