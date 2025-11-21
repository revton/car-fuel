# Codex Cloud — Contexto Operacional

Este repositório usa ghstack como fluxo padrão para PRs empilhadas. Quando estiver atuando pelo Codex no Cloud, siga estas referências e práticas:

## Documentação essencial
- `docs/STACK-PR-GHSTACK.md`: passo a passo para criar, rebasear e publicar pilhas com `uvx ghstack`. Use-o para entender flags (`ghstack submit`, `ghstack land`, `ghstack checkout`).
- `docs/DIRETRIZES.md`: diretrizes gerais (arquitetura, padrões de commit, revisão única, scripts). Consulte ao definir padrões de código ou justificar decisões.
- `docs/PROCESSO.md`: política de revisão/merge (Squash & Merge, uso de issues e PRs, referência a PR template).
- `docs/PROJECTS.md`: guia para o Project v2; use quando precisar alinhar tarefas com Backlog/In Progress/Review/Done.
- `docs/project/PHASE_PLAN.md`: estado macro das fases. Atualize sempre que uma fase fechar ou iniciar.
- `.github/pull_request_template.md`: checklist exigido; mantenha a estrutura nos PRs.
- `.github/workflows/ghstack-land.yml`: workflow manual para `ghstack land`. Exige o secret `GHSTACK_TOKEN` com escopo `repo`.
- `docs/API_STYLE.md`: convenções de API HTTP (versionamento, recursos, códigos, paginação, headers, segurança, depreciação, convenções e linters). Use sempre que houver rotas/contratos de API.
- `docs/ERRORS.md`: catálogo de erros para APIs (envelope padrão, `code` internos, exemplos e diretrizes para OpenAPI). Ao definir endpoints, alinhar os erros a este catálogo.
- `docs/NFR.md`: NFRs (SLOs, performance, resiliência, escalabilidade, segurança/observabilidade, dados, operabilidade, custo). Ao propor soluções de arquitetura, verifique alinhamento com estes requisitos.
- `docs/ENVIRONMENTS.md`: visão de ambientes (local/dev/prod), variáveis/segredos, CORS, flags, observabilidade por ambiente, limites, dados e promoção. Considere sempre o ambiente alvo ao automatizar scripts e pipelines.
- `docs/SECURITY.md`: baseline de segurança (authZ/authN, transporte, CORS, rate limiting, segredos/cripto, supply chain, CI/CD, auditoria, incidentes). Consulte antes de sugerir alterações que afetem segurança.
- `docs/PRIVACY.md`: baseline de privacidade (classificação de dados, minimização, base legal, retenção, direitos, subprocessadores, telemetria, incidentes). Use ao propor logs, telemetria ou novas fontes de dados de usuário.
- `docs/TESTING.md`: estratégia de testes (pirâmide, cobertura, ferramentas, contratos, dados de teste, flakiness, CI). Consulte ao sugerir novos testes ou ajustar pipelines.
- `docs/OBSERVABILITY.md`: diretrizes de observabilidade (logs JSON, métricas, tracing, health checks, alertas, web vitals). Use ao propor logging, métricas ou instrumentação de serviços.
- `docs/CONTRIBUTING.md`: guia de contribuição (branches, Conventional Commits, Stack PR, checklist, code review, DoD, releases). Útil para alinhar automações e fluxos propostos pelo agente.
- `docs/DEVELOPER_SETUP.md`: setup de desenvolvimento (pré‑requisitos, encoding, Gradle wrapper, variáveis de ambiente, troubleshooting). Consulte ao orientar ajustes de ambiente local ou PATH.
 - `docs/adr/0000-template.md`: modelo para novos ADRs. Use quando uma decisão impactar arquitetura, NFRs, segurança, observabilidade ou dados de forma significativa.

## ghstack (stacks de PR)
1. Faça commits na `main` (branch única).
2. Publique/atualize a pilha: `uvx --python 3.11 ghstack submit -B main`.
3. Para landing automático, use o workflow `ghstack-land` informando o número do PR topo. Antes de executar, habilite temporariamente “Allow force pushes” na proteção da `main`; após o land, restaure as proteções (force push off e checks `update`/`validate`).
4. Se preferir, abra uma PR de release da branch da pilha para `main` e faça Squash and Merge.

## CI/Checks
- Checks obrigatórios atuais: `stack-pr-body / update` e `ghstack-validate / validate`.
- O antigo stack-graph foi removido; não recrie o Mermaid (`docs/stack-plan/STACK-PR-PLAN.md` não existe).

## Scripts e automações
- Scripts PowerShell estão em `scripts/`; veja `docs/README.md` para exemplos gerais.

## Ao atualizar documentação/Fases
- Registre estados em `docs/project/PHASE_PLAN.md` (inclua releases, fases concluídas e observações).
- Referencie guias específicos (Projects, Processo, Diretrizes) ao descrever mudanças de governança.

## Token/segurança
- O workflow `ghstack-land` precisa do secret `GHSTACK_TOKEN` (PAT com escopo `repo`). Se falhar com “Resource not accessible…”, gere novo PAT e atualize o secret.

## Checklist rápido para Codex
- Use Conventional Commits.
- PRs devem citar issues via `Closes #<id>` quando aplicável.
- Ao mexer no fluxo ghstack, reveja `docs/STACK-PR-GHSTACK.md` e `docs/DIRETRIZES.md` para manter consistência.
- Documente mudanças de processo em `docs/PROCESSO.md` e `docs/PROJECTS.md` quando necessário.
