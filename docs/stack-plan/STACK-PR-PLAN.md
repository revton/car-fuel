# Stack PR — Visualização da Pilha

Este arquivo é atualizado automaticamente para refletir as PRs abertas e suas dependências (base → head) como um diagrama Mermaid. Edite apenas as seções fora dos marcadores se necessário.

<!-- stack-pr:begin -->
```mermaid
flowchart TD
  pr74["PR #74
ci(scripts): run v3 dry-run against sample CSV"]
  pr73["PR #73
docs(readme): quick guide and troubleshooting for scripts"]
  pr72["PR #72
chore(scripts): validate CSV columns + sample"]
  pr73 --> pr74
  pr72 --> pr73
```
<!-- stack-pr:end -->

## Notas
- A cadeia é inferida quando a `base` de uma PR é exatamente o `head` de outra PR (PRs empilhadas).
- Mantenha no corpo das PRs: `Depends on #<PR>` para ajudar a navegação.
- Ordem de merge: base → topo da pilha; usar "Squash and merge".
