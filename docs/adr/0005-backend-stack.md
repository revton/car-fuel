# ADR 0005 — Stack técnica do backend Car Fuel

Status: Proposed
Data: 2025-11-21

## Contexto
- A Fase 5 do projeto prevê a construção de um backend (Car Fuel API) para registrar veículos, abastecimentos e expor métricas de consumo.
- Já existem diretrizes gerais de arquitetura, API e NFRs em:
  - `docs/DIRETRIZES.md`
  - `docs/API_STYLE.md`
  - `docs/ERRORS.md`
  - `docs/NFR.md`
  - `docs/OBSERVABILITY.md`
- O repositório já antecipa o uso de Gradle wrapper para um backend Kotlin/Java (`docs/DEVELOPER_SETUP.md`), e há familiaridade com o ecossistema JVM.
- É necessário escolher uma stack técnica consistente (linguagem, framework web, modelo de build e persistência) antes de escrever o contrato OpenAPI e a implementação.

## Decisão
- Linguagem e runtime: Kotlin (JVM) direcionado ao Java 17 (LTS) como linguagem principal do backend Car Fuel.
- Framework web: Spring Boot 3.x, com os starters web/validation/actuator.
- Build e tooling: Gradle wrapper (`gradlew` / `gradlew.bat`) como ferramenta padrão de build/testes; estrutura de pastas `src/main/kotlin` e `src/test/kotlin`.
- Lint/estático: utilizar Detekt via plugin Gradle para checar estilo e code smells em Kotlin; alinhar execução local (Gradle task) e em CI/pre-commit.
- Persistência: PostgreSQL como banco principal; JPA/Hibernate via `spring-boot-starter-data-jpa`; uso de H2 ou Testcontainers em testes, conforme necessidade.
- Configuração: parâmetros sensíveis via variáveis de ambiente/`application-*.properties` não versionados, alinhados com `docs/ENVIRONMENTS.md` e `docs/PRIVACY.md`.

## Detalhamento de build/tooling
- Plugins: `org.jetbrains.kotlin.jvm` + `kotlin-spring` para suporte a Kotlin no Spring (null-safety, classes “open” para proxies), `org.springframework.boot` 3.2.5 e `io.spring.dependency-management` para travar versões alinhadas ao BOM do Spring; `io.gitlab.arturbosch.detekt` para lint estático Kotlin (exposto como tarefa `ktlint` no Gradle para manter o nome abstrato).
- Toolchain: JDK 17 definido no Gradle para evitar divergências de versão na equipe/CI.
- Dependências: `spring-boot-starter-web` (REST), `spring-boot-starter-actuator` (endpoints técnicos/metrics prontos se necessário), `spring-boot-starter-validation` (Bean Validation para payloads), `kotlin-reflect` (necessário ao Spring em Kotlin), `spring-boot-starter-test` (JUnit 5, MockMvc, AssertJ, etc.).
- Wrapper: `gradle-wrapper.properties` + `gradle-wrapper.jar` garantem uso do Gradle 8.7 sem instalação manual.

## Consequências

Pontos positivos:
- Stack suportada e conhecida (Kotlin/Spring), com integrações prontas para métricas, health checks e logs estruturados.
- Gradle wrapper simplifica onboarding (apenas JDK 17 necessário) e Detekt dá feedback estático consistente.
- PostgreSQL é padrão de mercado, com boa performance para histórico de abastecimentos.

Pontos negativos / trade-offs:
- Curva de aprendizado para quem não conhece Kotlin; Spring Boot tem overhead maior que frameworks minimalistas.
- JPA/Hibernate adiciona complexidade e pode exigir ajustes finos em consultas específicas.
- Detekt adiciona tempo de build e pode demandar ajustes de regras/supressões.

Impactos:
- ADRs/docs futuros (modelo de dados, OpenAPI) assumem Kotlin + Spring Boot + PostgreSQL.
- CI deve instalar JDK 17 e executar `./gradlew test` (ou `gradlew.bat` em Windows), e task do Detekt quando adicionada.
- Segurança (authN/authZ, CORS, rate limiting) deverá ser mapeada para Spring Security conforme `docs/SECURITY.md`.

## Alternativas consideradas
- Java 17 + Spring Boot: prós (base conhecida), contras (menos concisão/ergonomia).
- Node.js + TypeScript (NestJS): prós (full-stack TS), contras (toolchain diferente do planejado, desalinhado do Gradle wrapper).
- Python + FastAPI: prós (prototipagem rápida), contras (runtime separado além de `uv`/`uvx`; menos alinhado ao setup JVM).
- Lint alternativo: Ktlint (mais opinativo/formatador) poderia ser usado; optamos por Detekt para checks de estilo e code smells, mantendo a opção de adicionar formatador depois.

## Relacionados
- Issues: #129
- PRs: _(definido pela PR que introduzir este ADR)_
- Outros ADRs:
  - `docs/adr/0001-branch-main-stack-pr-ghstack.md`
  - `docs/adr/0002-api-style-and-errors.md`
  - `docs/adr/0003-nfrs-and-observability.md`
  - `docs/adr/0004-security-privacy-environments.md`
