# ADR 0007 — OpenAPI lint com pre-commit (Python)

Status: Proposed  
Data: 2025-11-21

## Contexto
- O contrato OpenAPI (`api/openapi/car-fuel-v1.yaml`) é a fonte de verdade dos endpoints do backend MVP (issue #131). Falhas só eram detectadas no CI e já houve aviso de ausência de ruleset ao rodar local.
- Já existe workflow de CI (`.github/workflows/openapi-lint.yml`) usando Spectral com regras em `.spectral.yaml` (estende `spectral:oas`).
- O repositório usa branch única (`main`) com pilhas via ghstack; erros tardios quebram a pilha inteira.
- `docs/API_STYLE.md` recomenda linter para contratos; falta padronizar a experiência local e compartilhável entre SOs.

## Decisão
- Adotar a ferramenta `pre-commit` (Python) para rodar o Spectral antes dos commits.
- Configurar `.pre-commit-config.yaml` com um hook `repo: local` que executa `npx --yes @stoplight/spectral-cli@6 lint api/openapi/car-fuel-v1.yaml` reutilizando `.spectral.yaml`.
- Documentar instalação e uso priorizando `uvx pre-commit` (alternativa: `pip install pre-commit`), `pre-commit install`, e variável de escape `SKIP=spectral-openapi-lint` quando necessário.
- Manter o mesmo comando no CI (workflow `openapi-lint`) para paridade entre local e remoto.

## Consequências
- Positivos: feedback imediato; versão do linter travada no hook; multiplataforma; reduz falhas em PRs/pilhas ghstack.
- Negativos: requer Python + pre-commit e Node/npm (para `npx`); adiciona alguns segundos ao commit; demanda manutenção do arquivo de config.
- Impactos: atualizar guias (ex.: `docs/DEVELOPER_SETUP.md` / `docs/API_STYLE.md`) para citar o hook; garantir que `.spectral.yaml` continue versionado.

## Alternativas consideradas
- Apenas CI: simples, mas feedback tardio e risco maior para pilhas.
- Git hook manual (sh/ps1): menos dependências, porém frágil, não reproduzível e não instala sozinho.
- Husky + npm scripts: automatiza, mas traz dependência Node para todo o repo e mais scripts.

## Relacionados
- Issues: #131
- PRs: a definir
- Outros ADRs: `docs/adr/0002-api-style-and-errors.md`, `docs/adr/0005-backend-stack.md`, `docs/adr/0006-domain-model-vehicles-fuelings.md`
