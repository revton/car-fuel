# Documentação — Car Fuel

Índice e notas rápidas para uso dos utilitários do repositório.

## Stack Graph (PRs Empilhadas)
- Visualização (Mermaid): `docs/stack-plan/STACK-PR-PLAN.md`
- Workflows ativos: `stack-graph.yml` (gera o diagrama) e `stack-pr-body.yml` (seção “Pilha” no body da PR).

## Criar Issues a partir de CSV (gh CLI)

- Script: `scripts/gh_create_issues_from_csv_v3.ps1`
- Pré‑requisitos:
  - Windows PowerShell 5.1+ ou PowerShell 7+
  - GitHub CLI (`gh`) instalado e autenticado (`gh auth status`)
- CSV esperado (UTF‑8): colunas `Title,Body,Labels,Key`
  - `Key` é preenchida automaticamente com o número da issue criada/encontrada
  - Caminho padrão: `docs/project/ISSUES.csv` (pode alterar com `-CsvPath`)

Exemplos (PowerShell):

1) Criar issues (sem Projects):
```
.\scripts\gh_create_issues_from_csv_v3.ps1 -Owner <owner> -Repo <repo>
```

2) Criar issues e adicionar ao Projects v2:
```
.\scripts\gh_create_issues_from_csv_v3.ps1 -Owner <owner> -Repo <repo> -AddToProject -ProjectOwner <owner> -ProjectNumber <num>
```

3) Simular sem criar (dry‑run) e controlar ritmo:
```
.\scripts\gh_create_issues_from_csv_v3.ps1 -Owner <owner> -Repo <repo> -DryRun -RequestDelayMs 200
```

Comportamento importante:
- Deduplicação:
  - Evita duplicar issues ABERTAS comparando título (normalizado/canônico)
  - Tenta identificar duplicata por caminho de doc referenciado no corpo (ex.: `docs/...`)
  - Faz uma busca de fallback (`search/issues`) com o título
- Labels: garante existência/atualização de cor de labels comuns (idempotente)
- Coluna `Key`:
  - Se preenchida no CSV, a linha é ignorada
  - Ao criar/associar, grava o número e reescreve o CSV

Alternativa (v2): `scripts/gh_create_issues_from_csv_v2.ps1`
- Sem extração de caminho de doc; usa índices de título (normalizado/canônico) + busca

## Observações
- Para fechar issues automaticamente, inclua `Closes #<id>` nas PRs que entram na branch padrão (`main`).
- O diagrama Mermaid mostra apenas PRs abertas.

### Atalho
- Você pode usar `.\scripts\gh_create_issues_from_csv.ps1` (wrapper) com os mesmos parâmetros do v3 — ele apenas delega para `gh_create_issues_from_csv_v3.ps1`.

#### CSV de exemplo
- Um arquivo de exemplo está disponível em `docs/project/ISSUES.example.csv` (UTF-8). Copie/ajuste e preencha a coluna `Key` automaticamente com o script.

## Guia Rápido (scripts)
- Criar issues (sem Projects):
  - `.\scripts\gh_create_issues_from_csv_v3.ps1 -Owner <owner> -Repo <repo>`
- Adicionar ao Projects v2:
  - `.\scripts\gh_create_issues_from_csv_v3.ps1 -Owner <owner> -Repo <repo> -AddToProject -ProjectOwner <owner> -ProjectNumber <num>`
- Dry‑run (sem criar) e ritmo:
  - `.\scripts\gh_create_issues_from_csv_v3.ps1 -Owner <owner> -Repo <repo> -DryRun -RequestDelayMs 200`

## Troubleshooting
- `gh` não autenticado: rode `gh auth login` (o script apenas alerta e prossegue; no Dry‑run evita POST/labels)
- CSV inválido (faltando colunas): ver `docs/project/ISSUES.example.csv` e garanta `Title,Body,Labels,Key`
- Duplicação de issues: o v3 evita duplicar por título normalizado/canônico e tenta detectar por caminho `docs/...` no corpo; use `Key` para travar linhas já migradas
- Rate limit: ajuste `-RequestDelayMs` (ex.: 200ms)
- Ambiente Linux no CI: use `pwsh` (PowerShell 7) para executar scripts `.ps1`
