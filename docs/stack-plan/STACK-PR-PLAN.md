# Stack PR — Visualização da Pilha

Este arquivo é atualizado automaticamente para refletir as PRs abertas e suas dependências (base → head) como um diagrama Mermaid. Edite apenas as seções fora dos marcadores se necessário.

<!-- stack-pr:begin -->
```mermaid
flowchart TD
  pr61["PR #61
docs(stack): add Stack PR visualization (Mermaid + workflow)"]
  pr60["PR #60
chore(infra): fix docs/readme encoding"]
  pr59["PR #59
chore(gh-script): ensure label idempotent"]
  pr58["PR #58
chore(gh-script): fix quoting in search query"]
  pr59 --> pr60
  pr58 --> pr59
```
<!-- stack-pr:end -->

## Notas
- A cadeia é inferida quando a `base` de uma PR é exatamente o `head` de outra PR (PRs empilhadas).
- Mantenha no corpo das PRs: `Depends on #<PR>` para ajudar a navegação.
- Ordem de merge: base → topo da pilha; usar "Squash and merge".

