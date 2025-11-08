# Stack PR — Visualização da Pilha

Este arquivo é atualizado automaticamente para refletir as PRs abertas e suas dependências (base → head) como um diagrama Mermaid. Edite apenas as seções fora dos marcadores se necessário.

<!-- stack-pr:begin -->
```mermaid
flowchart TD
  pr103["PR #103
docs(plan): detalhar Fase 4 (Projects, Processo, Template)"]
  pr102["PR #102
docs(processo): política de revisão e template de PR (Fase 4)"]
  pr101["PR #101
docs(projects): guia Projects v2 (Fase 4)"]
  pr100["PR #100
docs(diretrizes): guia de desenvolvimento inicial"]
  pr102 --> pr103
  pr101 --> pr102
```
<!-- stack-pr:end -->

## Notas
- A cadeia é inferida quando a `base` de uma PR é exatamente o `head` de outra PR (PRs empilhadas).
- Mantenha no corpo das PRs: `Depends on #<PR>` para ajudar a navegação.
- Ordem de merge: base → topo da pilha; usar "Squash and merge".
