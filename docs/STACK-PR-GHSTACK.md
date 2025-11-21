# Guia de Uso — ghstack (PRs Empilhadas)

Este guia descreve como criar e manter PRs empilhadas usando a ferramenta `ghstack` (https://github.com/ezyang/ghstack) no fluxo atual deste repositório:
- branch única `main` como base das pilhas
- checks obrigatórios: `stack-pr-body / update` e `ghstack-validate / validate`
- opção de landing automatizado via workflow `ghstack-land`.

## Cheat Sheet (rápido)
- Publicar a pilha (base `main`): `uvx --python 3.11 ghstack submit -B main`
- Atualizar após rebase/amend: `uvx --python 3.11 ghstack`
- Ajuda/versão: `uvx ghstack --help` • `uvx ghstack --version`

Criar pilha 1 → 2 → 3 (base main):
```bash
git checkout main && git pull
git checkout -b feat/part-1
# commits...
uvx --python 3.11 ghstack submit -B main   # PR1 base main

git checkout -b feat/part-2
# commits...
uvx --python 3.11 ghstack                  # PR2 base PR1

git checkout -b feat/part-3
# commits...
uvx --python 3.11 ghstack                  # PR3 base PR2
```

- Rebase/sync: `git rebase main` (ou ajuste commits) → `uvx --python 3.11 ghstack`
- Merge (opções):
  - A) Squash & merge na ordem PR1 → PR2 → PR3
  - B) Usar o workflow `ghstack-land` informando o PR do topo da pilha
- Fechamento de issues: use `Closes #<id>` nas PRs que entram em `main`.

## Por que usar ghstack
- Cria/atualiza automaticamente PRs encadeadas a partir dos commits locais.
- Reaplica a cadeia após rebase/amend com um único comando.
- Facilita revisões pequenas com rastreabilidade clara de dependências.

## Pré‑requisitos
- Git + Python 3.11 (recomendado)
- Gerenciador de pacotes: `uv` (padrão neste repo)

### Instalação com `uv` (recomendado)
- Linux/macOS: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- Windows (PowerShell): `iwr https://astral.sh/uv/install.ps1 -UseBasicParsing | iex`
- Executar sem instalar globalmente:
  - `uvx ghstack --version`
  - `uvx ghstack --help`

### Alternativas
- `pipx install ghstack` ou `pip install --user ghstack`
- Verifique: `ghstack --version`

## Autenticação
- Na primeira execução, o `ghstack` solicitará um token do GitHub com permissão de escrita (scope `repo`).
- O token é salvo no keychain; não é necessário definir variável de ambiente.

## Convenções deste repo
- Branch base da pilha: `main`.
- Visualização e verificação:
  - Seção “Pilha” no topo do body da PR (workflow `.github/workflows/stack-pr-body.yml`).
  - Checks obrigatórios na `main`: `update`, `validate`.
- Fechamento de issues: ocorre quando a PR (ou PR de release) entra em `main` com `Closes #<id>`.

## Fluxo de trabalho (exemplo)

1) Primeiro patch (base main)
```bash
git checkout main
git pull
git checkout -b chore/feat-1
# commits…
uvx --python 3.11 ghstack submit -B main
```
- Resultado: PR 1 aberta (base `main`).

2) Segundo patch (empilhado sobre o primeiro)
```bash
git checkout -b chore/feat-2
# commits…
uvx --python 3.11 ghstack
```
- Resultado: PR 2 aberta (base = PR 1). Cadeia: 1 → 2.

3) Terceiro patch
```bash
git checkout -b chore/feat-3
# commits…
uvx --python 3.11 ghstack
```
- Resultado: PR 3 aberta (base = PR 2). Cadeia: 1 → 2 → 3.

4) Atualizações da pilha
- Faça `git rebase main` / `git commit --amend` normalmente.
- Rode `uvx --python 3.11 ghstack` para propagar as mudanças por toda a pilha.

5) Landing
- Opção A — merges manuais:
  - Deixe todas as PRs verdes
  - Faça Squash & merge na ordem PR1 → PR2 → PR3
- Opção B — workflow `ghstack-land`:
  - Configure o secret `GHSTACK_TOKEN` (PAT `repo`)
  - Ajuste temporariamente a proteção da `main` para permitir force push
  - Actions → `ghstack-land` → Run workflow → `pr = <PR topo>`
  - Após concluir, restaure a proteção da `main` (force push off; checks `update`/`validate`).

## Boas práticas
- Use Conventional Commits; o `ghstack` adiciona trailers próprios.
- Prefira diffs pequenos (≤ ~300 linhas) por PR.
- Mantenha a cadeia linear: sempre rebaseie em `main` antes de publicar.
- Sempre documente dependências no body usando “Depends on #<PR>” quando fizer sentido.

## Pitfalls comuns
- Base incorreta na PR: se a base não for o head da PR anterior, rebaseie em `main` e rode `uvx --python 3.11 ghstack`.
- Token insuficiente: se aparecer erro de permissão ou GraphQL, gere novo PAT `repo` e atualize `GHSTACK_TOKEN` (para o workflow) ou refaça a autenticação local.
- “Closes #…” não fechando issues: apenas PRs que entram na `main` fecham issues; verifique a branch destino.
- CI vermelho em `update`/`validate`: ajuste a pilha e o body da PR (seção “Pilha”), depois republique com `uvx --python 3.11 ghstack`.

## Execução com `uvx` (atalhos úteis)
- Rodar `ghstack` diretamente:
  - `uvx ghstack`
- Checar versão/ajuda:
  - `uvx ghstack --version`
  - `uvx ghstack --help`

## Referências
- Guia de contexto para agentes: `AGENTS.md`
- ghstack: https://github.com/ezyang/ghstack
- Workflow de body: `.github/workflows/stack-pr-body.yml`
- Workflow de land: `.github/workflows/ghstack-land.yml`
