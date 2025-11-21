# Documentação — Car Fuel

Este documento é o índice central da documentação do projeto e o ponto de partida para novos contribuidores.

## Primeiros Passos
- Leia as diretrizes gerais de desenvolvimento: `docs/DIRETRIZES.md`.
- Entenda o processo de trabalho (revisão/merge, uso de Issues e PRs): `docs/PROCESSO.md`.
- Veja como o trabalho é organizado no GitHub Projects v2: `docs/PROJECTS.md`.
- Consulte o plano de fases e releases: `docs/project/PHASE_PLAN.md`.

Se estiver usando um agente (Codex, etc.), veja também `AGENTS.md` para contexto específico de automação.

## Índice de Documentação
- `AGENTS.md` — contexto para agentes/automação (Codex Cloud, ghstack-land, checks obrigatórios).
- `docs/DIRETRIZES.md` — diretrizes de desenvolvimento (arquitetura, qualidade, CI/CD, fluxo de PRs).
- `docs/API_STYLE.md` — guia de estilo de API (versionamento, recursos, métodos, códigos, paginação, headers, segurança, depreciação, convenções e linters).
- `docs/ERRORS.md` — catálogo de erros (envelope tipo RFC 7807, campos, códigos internos e exemplos para OpenAPI).
- `docs/NFR.md` — requisitos não funcionais (SLOs, performance, resiliência, escalabilidade, segurança/observabilidade, dados, operabilidade, custo).
- `docs/ENVIRONMENTS.md` — visão de ambientes (local/dev/prod), variáveis/segredos, CORS, flags, observabilidade por ambiente, limites, dados e promoção.
- `docs/SECURITY.md` — diretrizes gerais de segurança (authN/authZ, transporte, CORS, rate limiting, segredos, supply chain, CI/CD, incidentes).
- `docs/PRIVACY.md` — baseline de privacidade (classificação de dados, minimização, base legal, retenção, direitos, subprocessadores, telemetria, incidentes).
 - `docs/TESTING.md` — estratégia de testes (pirâmide, cobertura, ferramentas, contratos, dados de teste, flakiness, CI).
- `docs/PROCESSO.md` — processo de trabalho (revisões, merges, uso de Issues/PRs, Projects v2).
- `docs/PROJECTS.md` — guia do GitHub Projects v2 (colunas, campos, views e fluxo backlog→merge).
- `docs/STACK-PR-GHSTACK.md` — guia de Stack PR com ghstack (pilhas baseadas em `main` + workflow `ghstack-land`).
- `docs/project/PHASE_PLAN.md` — plano por fases, releases e governança de branch.
- `docs/project/ISSUES.csv` — backlog estruturado usado como referência para criação/priorização de Issues.
 - `docs/templates/ISSUE_TEMPLATE.md` — modelo de issue alinhado aos campos do Project v2 (tipo, prioridade, módulo, OpenAPI?, ADR?).

## Ferramentas e Scripts
- Scripts PowerShell de automação ficam em `scripts/` (ex.: utilitários com GitHub CLI `gh`).
- Use a ajuda embutida (`-?`, `--help`) e leia `docs/DIRETRIZES.md` / `docs/PROCESSO.md` para garantir que o uso esteja alinhado ao fluxo atual.

## Stack PR e ghstack
- O fluxo padrão de PRs empilhadas está descrito em `docs/STACK-PR-GHSTACK.md`.
- Integração com CI:
  - Seção “Pilha” no body das PRs (`stack-pr-body.yml`).
  - Validação básica do `ghstack` (`ghstack-validate.yml`).
- Para landing automatizado de uma pilha, use o workflow `ghstack-land` com o PAT configurado (`GHSTACK_TOKEN`).

## Convenções importantes
- Sempre usar PRs contra `main` e preferir "Squash and merge".
- Fechamento automático de Issues: incluir `Closes #<id>` nas PRs que entram em `main`.
- Manter os arquivos de documentação acima atualizados quando houver mudanças de processo, fluxo de stack ou organização de Project.
