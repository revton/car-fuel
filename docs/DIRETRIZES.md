# Diretrizes de Desenvolvimento — Car Fuel

Este documento define diretrizes para desenvolvimento, qualidade e fluxo de entrega neste repositório.

## Arquitetura e Módulos
- Separação por camadas: borda (APIs/CLI/Jobs), domínio (regras), infraestrutura (persistência/integr.)
- APIs contract‑first quando aplicável; documentação e contratos versionados com o código.
- Observabilidade como requisito: logs estruturados, métricas e rastreabilidade em operações críticas.
- NFRs (performance, resiliência, escalabilidade, etc.) sumarizados em `docs/NFR.md`.

## Padrões de API (quando houver backend)
- REST pragmático, versionamento no caminho (ex.: `/v1/...`).
- Respostas consistentes de erro (código, mensagem, detalhes), com correlação de requisições.
- Idempotência em operações sensíveis; validações e mensagens claras.
- Detalhamento adicional em `docs/API_STYLE.md` (recursos, códigos, paginação, headers, segurança, depreciação, convenções e linters) e `docs/ERRORS.md` (envelope de erro, códigos internos e exemplos).

## Qualidade de Código
- Mensagens de commit em Conventional Commits (ex.: `feat:`, `fix:`, `docs:`, `ci:`, `chore:`).
- Revisões via PR: recomendadas. Em repositório de único mantenedor, não exigir aprovação de terceiros; usar checks obrigatórios (status checks) e checklist da PR. Com 2+ revisores, exigir ≥1 aprovação (e opcionalmente CODEOWNERS).
- Testes: foco em unidades críticas e integrações mínimas; automação em CI quando aplicável.

## CI/CD
- GitHub Actions ativas:
  - `stack-graph`: gera diagrama Mermaid da pilha de PRs em `docs/stack-plan/STACK-PR-PLAN.md`.
  - `stack-pr-body`: atualiza a seção “Pilha” no corpo das PRs.
  - `ghstack-validate`: valida disponibilidade do `ghstack` (via `uvx`).
- Branch Protection (main): exigir PR, histórico linear e status checks (generate/update/validate).

## Fluxo de Branches e PRs
- Branch padrão única: `main`.
- Use PRs sempre; preferir “Squash and merge”.
- Fechamento de issues: incluir `Closes #<id>` na PR que vai para `main`.

### PRs empilhadas (Stack PR)
- Usar `ghstack` para publicar/atualizar pilhas de commits como PRs encadeadas.
- Guia: `docs/STACK-PR-GHSTACK.md` (uso com `uvx`, configuração de token e comandos comuns).
- Basear pilhas em `main` e manter o rebase frequente antes de publicar.

## Ferramentas e versões
- Scripts de automação via PowerShell (`scripts/*`), com GitHub CLI (`gh`) autenticado.
- ghstack via `uvx` (Python 3.11 recomendado) — sem necessidade de instalação global.
- Se/Quando houver backend Java: alinhar a JDK 17 e ferramentas de build (Maven/Gradle) padronizadas.

## Gestão de Tarefas
- GitHub Issues com labels: `type:*`, `area:*`, `priority:*`, `status:*`.
- GitHub Projects v2: colunas Backlog → In Progress → Review → Done; política de SLA de review.

## Como começar
1. Abra uma branch a partir de `main`.
2. Faça commits pequenos, testáveis; padronize mensagens.
3. Publique PR para `main` (ou uma pilha com `ghstack` quando houver dependências).
4. Aguarde checks verdes e review; faça Squash and merge.
5. Issues fecham automaticamente se a PR contiver `Closes #<id>`.
