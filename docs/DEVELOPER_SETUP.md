# Setup de Desenvolvimento - Car Fuel

Este guia ajuda a preparar o ambiente de desenvolvimento para o Car Fuel.

## Pré-requisitos
- Git instalado e configurado.
- Ferramentas de linha de comando:
  - `gh` (GitHub CLI) autenticado (`gh auth status`).
  - `uvx` + `uvx` para rodar ferramentas Python (ghstack, pre-commit).
  - Node.js 20+ (para `npx` usado no lint OpenAPI, hooks e frontend).
  - PowerShell (Windows) para scripts em `scripts/*.ps1`.
    - `scripts/dev/start-dev.ps1`: Sobe o ambiente completo (app + db).
    - `scripts/dev/stop-dev.ps1`: Para o ambiente.
- IDE/editor com suporte a UTF-8 (VS Code, IntelliJ, etc.).

## Devcontainer (Recomendado)
- O projeto suporta **Devcontainers** (VS Code Remote - Containers) para um ambiente de desenvolvimento padronizado e isolado.
- Requisitos: Docker Desktop e VS Code com extensão "Dev Containers".
- Ao abrir o projeto no VS Code, aceite a sugestão para "Reopen in Container".
- O ambiente inclui automaticamente: JDK, Node.js, ferramentas de CLI e configurações de rede.
- Veja `docs/adr/0012-devcontainer.md` para detalhes da decisão arquitetural.


## Encoding e fim de linha
- Usar **UTF-8** como encoding padrão.
- Em Windows, manter CRLF apenas onde o repositório já estiver configurado; evitar mudar fim de linha desnecessariamente.
- Configure o editor para respeitar `.gitattributes` do projeto.

## Gradle wrapper (backend)
- O wrapper é a forma padrão de build/teste do backend:
  - Linux/macOS: `./gradlew test`.
  - Windows: `gradlew.bat test`.
- Não é necessário instalar Gradle globalmente; use o wrapper versionado.

## Variáveis de ambiente e `.env`
- Para serviços locais (API/webapp):
  - Use arquivos `.env` **não versionados** ou variáveis de ambiente.
  - Exemplos de variáveis (futuras): `CARFUEL_API_URL`, `CARFUEL_DB_URL`, `CARFUEL_LOG_LEVEL`.
- Veja `docs/ENVIRONMENTS.md` para diretrizes por ambiente e `docs/PRIVACY.md` para cuidados com dados.

## ghstack e uv
- Instalar `uv` (ver instruções em `docs/STACK-PR-GHSTACK.md`).
- Verificar:
  - `uvx --python 3.11 ghstack --version`
- Configurar `~/.ghstackrc` com token de repositório (PAT `repo`) conforme `docs/STACK-PR-GHSTACK.md`.
- Sem acesso à internet (ou quando `uvx` não consegue baixar pacotes), use o `ghstack` vendorizado:
  - Windows: `.\scripts\ghstack\run-ghstack.ps1 ...`
  - Linux/macOS: `./scripts/ghstack/run-ghstack.sh ...`
  - Qualquer SO: `python scripts/ghstack/run_ghstack.py ...`
  - Os scripts carregam automaticamente `vendor/python`, que inclui `ghstack==0.12.0` e dependências.

## OpenAPI lint e pre-commit
- Dependências: Node 20+ com `npx`, `uvx` instalado, regras em `.spectral.yaml`.
- Instalação do hook: `uvx pre-commit install`.
- Execução manual:
  - `uvx pre-commit run spectral-openapi-lint --all-files` (OpenAPI)
  - `uvx pre-commit run ktlint --all-files` (Kotlin)
  - `uvx pre-commit run gradle-test --all-files` (suíte de testes com `./gradlew test`)
- Escape quando necessário: `SKIP=spectral-openapi-lint,ktlint git commit ...`.
- CI: workflows `.github/workflows/openapi-lint.yml`, `.github/workflows/kotlin-lint.yml`, `.github/workflows/backend-test.yml` e `.github/workflows/backend-build.yml` mantêm paridade com os comandos locais.
- Nota: o hook `ktlint` usa `scripts/hooks/ktlint_runner.py` para chamar o wrapper correto em cada SO (`./gradlew ktlint` no Unix, `gradlew.bat ktlint` no Windows).

## Backend Kotlin (build/test/lint)
- Build/Testes locais: `./gradlew test` (Linux/macOS) ou `gradlew.bat test` (Windows).
- Subir aplicação para desenvolvimento:
  - `./gradlew bootRun` (ou `gradlew.bat bootRun`)
  - Health: `http://localhost:8080/v1/health`
- Lint estático Kotlin: `./gradlew ktlint` (ou `gradlew.bat ktlint`) - alias para Detekt (JDK 17).
- CI: workflow `.github/workflows/kotlin-lint.yml` roda `./gradlew ktlint`; demais jobs de build/test devem usar o wrapper (`./gradlew ...`) com JDK 17.

## Frontend (Fase 6 - React + Vite)
- O frontend pode rodar de duas formas: dev server local (Vite) ou container Docker.
- Pré-requisitos adicionais:
  - Node.js 20+ (mesmo usado para lint OpenAPI).
- Instalação de dependências (uma vez):
  - `cd frontend`
  - `npm install` (ou `pnpm install`, se preferir).
- Subir o frontend em desenvolvimento (dev server local):
  - `cd frontend`
  - `npm run dev`
  - Acesse `http://localhost:5173` no navegador (aponta por padrão para `http://localhost:8080` via `VITE_API_BASE_URL`).
- Testes do frontend:
  - `cd frontend`
  - `npm test` (Roda unitários e integração).
  - Testes de integração estão em `frontend/src/tests/integration`.
- Estrutura inicial relevante:
  - Página inicial em `frontend/src/pages/HomePage.tsx`, consumindo o endpoint `/v1/health` da API.
  - Configuração compartilhada da API em `frontend/src/shared/config/apiConfig.ts` (usa `VITE_API_BASE_URL` ou `http://localhost:8080`).
  - Cliente de health em `frontend/src/shared/api/health.ts`.

### Frontend via Docker (dev)
- Além do backend, o `docker-compose.yml` possui o serviço `frontend-web` (Nginx servindo o build do Vite):
  - Build e subir tudo (db, API e frontend):  
    - `docker compose --profile dev up --build -d`
  - Ou apenas frontend (assumindo `db-dev` e `app` já em execução):  
    - `docker compose --profile dev up --build -d frontend-web`
- Com `frontend-web` rodando:
  - Frontend em `http://localhost:3000`.
  - O build do Vite usa `VITE_API_BASE_URL=http://app:8080`, apontando para o serviço `app` dentro da rede Docker.
- Use esta opção quando quiser validar o frontend integrado ao backend via navegador, sem subir o dev server local.

## Troubleshooting
- `uvx` não encontrado:
  - Confirme instalação do `uv` e que `$HOME/.local/bin` (Linux/macOS) ou `%USERPROFILE%\.local\bin` (Windows) está no `PATH`.
- Scripts PowerShell falhando:
  - Verifique política de execução (`Set-ExecutionPolicy -Scope Process Bypass`) para a sessão atual.
- Problemas de encoding/acentuação:
  - Certifique-se de que o arquivo está em UTF-8 e que o editor não converte automaticamente para outro encoding.

## Banco de dados (PostgreSQL via Docker)
- Subir ambiente de desenvolvimento:  
  - `docker compose --profile dev up -d db-dev`  
    (porta 5432, DB/USER/PASS = `carfuel`).
- As apps leem `POSTGRES_URL/USER/PASSWORD`; defaults apontam para `localhost:5432/carfuel`. Ajuste conforme necessário.
- Testes usam Testcontainers; se Docker não estiver disponível, caem em H2 (modo PostgreSQL).

## Aplicação via Docker (backend)
- Build e subir app + db (dev):  
  - `docker compose --profile dev up --build -d app db-dev`
- API sobe em `http://localhost:8080` usando o banco `db-dev` (envs já configuradas no compose).
- Health: `GET http://localhost:8080/v1/health`; contrato: `api/openapi/car-fuel-v1.yaml`.
- Build mais estável/rápido: Dockerfile usa cache de Gradle com BuildKit (`RUN --mount=type=cache,target=/root/.gradle`). Se ocorrer timeout de download durante o build, tente novamente com rede estável; o cache persiste entre builds.

## OpenAPI (uso em dev)
- Contrato: `api/openapi/car-fuel-v1.yaml` (OAS 3.0.3).
- Servindo a API local (`./gradlew bootRun` ou Docker compose), use a extensão/preview da IDE ou ferramentas como Insomnia/Postman apontando para `http://localhost:8080`.
- UIs embutidas (app precisa estar rodando):
  - Swagger UI: `http://localhost:8080/docs` (carrega `/openapi/car-fuel-v1.yaml`).
  - ReDoc: `http://localhost:8080/redoc.html` (bundle local em `static/vendor/redoc/redoc.standalone.js` para evitar bloqueio de CDN).
  - Contrato bruto: `http://localhost:8080/openapi/car-fuel-v1.yaml`.
- Lint do contrato:  
  - `npx --yes @stoplight/spectral-cli@6 lint api/openapi/car-fuel-v1.yaml`  
  - ou `uvx pre-commit run spectral-openapi-lint --all-files`.

Para mais detalhes sobre fluxo de contribuição e testes, veja `docs/CONTRIBUTING.md` e `docs/TESTING.md`.
