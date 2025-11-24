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
- O repositório já antecipa o uso de Gradle wrapper para um backend Java/Kotlin (`docs/DEVELOPER_SETUP.md`), e há familiaridade com o ecossistema Java.
- É necessário escolher uma stack técnica consistente para o backend (linguagem, framework web, modelo de build e persistência) antes de escrever o contrato OpenAPI e a implementação.

## Decisão
- Linguagem e runtime:
  - Java 17 (LTS) como linguagem principal para o backend Car Fuel.
- Framework web:
  - Spring Boot 3.x, com os starters:
    - `spring-boot-starter-web` (API REST).
    - `spring-boot-starter-validation` (validações de entrada).
    - `spring-boot-starter-actuator` (endpoints técnicos /health, métricas).
- Build e tooling:
  - Gradle wrapper (`gradlew` / `gradlew.bat`) como ferramenta padrão de build e testes.
  - Estrutura de pastas padrão do Spring Boot (ex.: `src/main/java`, `src/test/java`).
- Persistência:
  - Banco de dados relacional PostgreSQL como persistência principal em ambientes não locais.
  - JPA/Hibernate via `spring-boot-starter-data-jpa` para mapeamento objeto–relacional.
  - Uso de banco em memória (por exemplo H2) ou Testcontainers em cenários de testes, conforme for mais simples para o time.
- Configuração:
  - Parâmetros sensíveis (URLs de banco, credenciais) definidos via variáveis de ambiente/`application-*.properties` não versionados, alinhados com `docs/ENVIRONMENTS.md` e `docs/PRIVACY.md`.

Motivação:
- Ecossistema maduro para REST, validação, segurança e observabilidade (Spring Boot + Actuator).
- Ferramentas bem suportadas para testes e integração com CI (Gradle, JUnit, Testcontainers).
- A escolha de Java 17 + Spring Boot aproxima o projeto do ecossistema corporativo comum, facilitando futura manutenção.

## Consequências

Pontos positivos:
- Stack altamente suportada, com ampla documentação e exemplos.
- Integração facilitada com métricas, health checks e logs estruturados, alinhando com `docs/OBSERVABILITY.md` e `docs/NFR.md`.
- Uso de Gradle wrapper simplifica o onboarding: basta ter JDK 17 instalado.
- PostgreSQL é padrão de mercado, com bom suporte a recursos relacionais e indexação para consultas futuras de histórico de abastecimentos.

Pontos negativos / trade-offs:
- Curva de aprendizado maior se, no futuro, contribuidores preferirem stacks mais leves (ex.: Node.js/NestJS ou Python/FastAPI).
- Spring Boot adiciona overhead de inicialização e consumo de recursos maior do que frameworks minimalistas, o que pode ser excessivo em cenários muito pequenos.
- JPA/Hibernate aumenta a complexidade de mapeamento; para consultas muito específicas, pode ser necessário SQL nativo ou ajustes de performance.

Impactos:
- ADRs e docs futuros (modelo de dados, contrato OpenAPI) devem assumir Java 17 + Spring Boot + PostgreSQL como base.
- Pipelines de CI precisarão instalar/configurar JDK 17 e executar `./gradlew test` (ou equivalente em Windows).
- As decisões de segurança (authN/authZ, CORS, rate limiting) em `docs/SECURITY.md` deverão ser mapeadas para componentes Spring Security quando forem implementadas.

## Alternativas consideradas

- Node.js + TypeScript (NestJS):
  - Prós:
    - Modelo de desenvolvimento full-stack (TypeScript no front e back) quando houver webapp.
    - Framework opinativo com boa estrutura modular.
  - Contras:
    - Requer toolchain Node.js adicional e outra curva de aprendizado.
    - Menor alinhamento com o Gradle wrapper já previsto no repositório.

- Python + FastAPI:
  - Prós:
    - Velocidade de prototipagem alta, sintaxe simples.
    - Bom suporte a OpenAPI e validação de dados.
  - Contras:
    - Exige gerenciamento de runtime e dependências separado (além do `uv`/`uvx` já usados para ghstack).
    - Menos alinhado com o ecossistema Java já sugerido em `docs/DEVELOPER_SETUP.md`.

## Relacionados
- Issues: #129
- PRs: _(definido pela PR que introduzir este ADR)_
- Outros ADRs:
  - `docs/adr/0001-branch-main-stack-pr-ghstack.md`
  - `docs/adr/0002-api-style-and-errors.md`
  - `docs/adr/0003-nfrs-and-observability.md`
  - `docs/adr/0004-security-privacy-environments.md`

