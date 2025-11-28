# Processo de Trabalho — Fase 4

## Revisões e merges
- Repositório de único mantenedor: não exigir aprovação de terceiros; usar checks obrigatórios e checklist no template de PR.
- Com 2+ revisores: exigir ≥1 aprovação e considerar CODEOWNERS.
- Merge: "Squash and merge" para histórico linear.

## Uso de Issues e PRs
- Uma issue por objetivo; vincule PR com “Closes #<id>”.
- Para mudanças dependentes, use PRs empilhadas (ghstack) ou baseie PR filha na branch da PR pai.

## Fluxo Devcontainer
- Alterações em `.devcontainer/`, `docker/dev/` ou `compose.devcontainer.yml` exigem rebuild do container (`Dev Containers: Rebuild Container`).
- Use scripts de hot deploy (`scripts/dev/`) para iterar rapidamente no backend e frontend sem rebuilds completos.


## Projects v2
- Colunas: Backlog → In Progress → Review → Done.
- Automação: mover para Review na abertura de PR e para Done no merge.
- Backlog atual (Fase 5): itens priorizados em `docs/project/ISSUES.csv` foram adicionados ao Project “Car Fuel — Gestão” na coluna Backlog e devem seguir o fluxo acima (um card por issue, linkando PRs com `Closes #<id>`).
