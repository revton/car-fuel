# Setup de Desenvolvimento — Car Fuel

Este guia ajuda a preparar o ambiente de desenvolvimento para o Car Fuel.

## Pré‑requisitos
- Git instalado e configurado.
- Ferramentas de linha de comando:
  - `gh` (GitHub CLI) autenticado (`gh auth status`).
  - `uv` + `uvx` para rodar ferramentas Python (ghstack).
  - PowerShell (Windows) para scripts em `scripts/*.ps1`.
- IDE/editor com suporte a UTF‑8 (VS Code, IntelliJ, etc.).

## Encoding e fim de linha
- Usar **UTF‑8** como encoding padrão.
- Em Windows, manter CRLF apenas onde o repositório já estiver configurado; evitar mudar fim de linha desnecessariamente.
- Configure o editor para respeitar `.gitattributes` do projeto.

## Gradle wrapper (backend futuro)
- Quando houver backend Java/Kotlin, o wrapper será a forma padrão de build/teste:
  - Linux/macOS: `./gradlew test`.
  - Windows: `gradlew.bat test`.
- Não é necessário instalar Gradle globalmente; use o wrapper versionado.

## Variáveis de ambiente e `.env`
- Para serviços locais (API/webapp futuros):
  - Use arquivos `.env` **não versionados** ou variáveis de ambiente.
  - Exemplos de variáveis (futuras): `CARFUEL_API_URL`, `CARFUEL_DB_URL`, `CARFUEL_LOG_LEVEL`.
- Veja `docs/ENVIRONMENTS.md` para diretrizes por ambiente e `docs/PRIVACY.md` para cuidados com dados.

## ghstack e uv
- Instalar `uv` (ver instruções em `docs/STACK-PR-GHSTACK.md`).
- Verificar:
  - `uvx --python 3.11 ghstack --version`
- Configurar `~/.ghstackrc` com token de repositório (PAT `repo`) conforme `docs/STACK-PR-GHSTACK.md`.

## Troubleshooting
- `uvx` não encontrado:
  - Confirme instalação do `uv` e que `$HOME/.local/bin` (Linux/macOS) ou `%USERPROFILE%\.local\bin` (Windows) está no `PATH`.
- Scripts PowerShell falhando:
  - Verifique política de execução (`Set-ExecutionPolicy -Scope Process Bypass`) para a sessão atual.
- Problemas de encoding/acentuação:
  - Certifique‑se de que o arquivo está em UTF‑8 e que o editor não converte automaticamente para outro encoding.

Para mais detalhes sobre fluxo de contribuição e testes, veja `docs/CONTRIBUTING.md` e `docs/TESTING.md`.

