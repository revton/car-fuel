# Stack PR — Visualização da Pilha

Este arquivo é atualizado automaticamente para refletir as PRs abertas e suas dependências (base → head) como um diagrama Mermaid. Edite apenas as seções fora dos marcadores se necessário.

<!-- stack-pr:begin -->
```mermaid
flowchart TD
  pr86["PR #86
docs(stack): update Mermaid stack graph"]
  pr85["PR #85
ci: remove legacy stack-pr placeholder workflow (#63)"]
  pr84["PR #84
docs(stack): update Mermaid stack graph"]
  pr83["PR #83
chore(infra): fix docs/readme encoding (#60)"]
  pr82["PR #82
docs(stack): update Mermaid stack graph"]
  pr81["PR #81
chore(gh-script): ensure label idempotent (#59)"]
  pr80["PR #80
docs(stack): update Mermaid stack graph"]
  pr79["PR #79
chore(gh-script): fix quoting in search query (#58)"]
  pr78["PR #78
docs(stack): update Mermaid stack graph"]
  pr77["PR #77
docs(stack): add Stack PR visualization (Mermaid + workflow) (#61)"]
  pr76["PR #76
ci(stack): auto-update Stack section in PR bodies (#62)"]
  pr74["PR #74
ci(scripts): run v3 dry-run against sample CSV"]
  pr73["PR #73
docs(readme): quick guide and troubleshooting for scripts"]
  pr73 --> pr74
```
<!-- stack-pr:end -->

## Notas
- A cadeia é inferida quando a `base` de uma PR é exatamente o `head` de outra PR (PRs empilhadas).
- Mantenha no corpo das PRs: `Depends on #<PR>` para ajudar a navegação.
- Ordem de merge: base → topo da pilha; usar "Squash and merge".

