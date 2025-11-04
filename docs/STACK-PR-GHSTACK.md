# Guia de Uso — ghstack (PRs Empilhadas)

Este guia descreve como criar e manter PRs empilhadas usando a ferramenta `ghstack` (https://github.com/ezyang/ghstack) no fluxo deste repositório.

## Cheat Sheet (rápido)
- Publicar/atualizar a pilha atual: `uvx ghstack`
- Ajuda/versão: `uvx ghstack --help` • `uvx ghstack --version`
- Criar pilha 1 → 2 → 3 (base develop):
  ```bash
  git checkout develop && git pull
  git checkout -b feat/part-1
  # commits...
  uvx ghstack    # PR1 base develop

  git checkout -b feat/part-2
  # commits...
  uvx ghstack    # PR2 base PR1

  git checkout -b feat/part-3
  # commits...
  uvx ghstack    # PR3 base PR2
  ```
- Rebase/sync após mudanças: `git rebase develop` (ou ajuste commits) → `uvx ghstack`
- Merge: Squash & merge na ordem PR1 → PR2 → PR3; feche issues via PR de release `develop → main` com “Closes #<id>”.

## Por que usar ghstack
- Cria/atualiza automaticamente PRs encadeadas a partir dos commits/branches locais.
- Reaplica a cadeia após rebase/amend (um único comando).
- Facilita revisões pequenas com rastreabilidade clara.

## Pré‑requisitos
- Git + Python 3.8+
- Gerenciador de pacotes: `uv` (padrão neste repo)

### Instalação com `uv` (recomendado)
- Instale o `uv` (ver instruções oficiais do projeto Astral):
  - Linux/macOS: `curl -LsSf https://astral.sh/uv/install.sh | sh`
  - Windows (PowerShell): `iwr https://astral.sh/uv/install.ps1 -UseBasicParsing | iex`
- Rode ferramentas com `uvx` (sem instalar globalmente):
  - `uvx ghstack --version`
- Opcional (instalar como ferramenta):
  - `uv tool install ghstack`

### Alternativas (se necessário)
- `pipx install ghstack` ou `pip install --user ghstack`
- Verifique: `ghstack --version`

## Autenticação
- Na primeira execução, o `ghstack` solicitará um token do GitHub com permissão de escrita no repositório (scope `repo`).
- O token é salvo no keychain do sistema. Não é necessário definir variáveis de ambiente.

## Convenções deste repo
- Branch base da pilha: `develop`.
- Visualização e verificação:
  - Diagrama: `docs/stack-plan/STACK-PR-PLAN.md` (workflow `stack-graph.yml`).
  - Seção “Pilha” no topo do body da PR (workflow `stack-pr-body.yml`).
- Fechamento de issues: ocorre quando a PR (ou PR de release) entra em `main` com “Closes #<id>”.

## Fluxo de trabalho (exemplo)
1) Primeiro patch (base develop)
```
 git checkout develop
 git pull
 git checkout -b chore/feat-1
 # commits…
 ghstack
```
- Resultado: PR 1 aberta (base `develop`).

2) Segundo patch (empilhado sobre o primeiro)
```
 git checkout -b chore/feat-2
 # commits…
 ghstack
```
- Resultado: PR 2 aberta (base = PR 1). Cadeia: 1 → 2.

3) Terceiro patch
```
 git checkout -b chore/feat-3
 # commits…
 ghstack
```
- Resultado: PR 3 aberta (base = PR 2). Cadeia: 1 → 2 → 3.

4) Atualizações
- Faça `git rebase`/`git commit --amend` normalmente.
- Rode `ghstack` para propagar as mudanças por toda a pilha.

5) Merge (landing)
- Faça Squash and merge da base para o topo (PR 1 → PR 2 → PR 3).
- Para fechar issues: na PR de release `develop → main`, inclua:
  - `Closes #<id>` (ex.: “Closes #69, Closes #70, Closes #71”).

## Dicas
- Mantendo mensagens limpas: use Conventional Commits; o `ghstack` adiciona trailers próprios.
- Sincronização com `develop`: rebase a pilha em `develop` e rode `ghstack`.
- Revisões pequenas: preferir diffs ≤ 300 linhas por PR.

## Pitfalls Comuns
- Base incorreta na PR: se a base não for o head da PR anterior, rode `git rebase develop` (ou ajuste a cadeia) e `uvx ghstack` para reescrever as bases.
- Token do GitHub insuficiente: o ghstack requer token com escopo `repo`. Se falhar, gere um novo token e re‑execute `uvx ghstack` (ele salva no keychain).
- “Closes #…” não fechando issues: apenas PRs que entram na `main` fecham automaticamente. Use “Closes #…” na PR de release `develop → main`.
- Commit/branch bagunçada: o ghstack opera sobre commits. Mantenha cada patch pequeno (um conjunto lógico) e publique a cadeia com `uvx ghstack`.
- CI vermelho no `stack-graph`: cheque `docs/stack-plan/STACK-PR-PLAN.md` para identificar um elo fora de ordem; sincronize com `uvx ghstack`.

## Execução com `uvx` (atalhos úteis)
- Rodar `ghstack` diretamente:
  - `uvx ghstack`
- Checar versão/ajuda:
  - `uvx ghstack --version`
  - `uvx ghstack --help`

## Referências
- ghstack: https://github.com/ezyang/ghstack
- Diagrama de pilha (Mermaid): `docs/stack-plan/STACK-PR-PLAN.md`
- Workflows: `.github/workflows/stack-graph.yml`, `.github/workflows/stack-pr-body.yml`

## Conversão de cadeia existente (exemplo prático)
Quando já existem PRs filhas abertas e você quer migrar para o ghstack, reempilhe os patches como commits em uma única branch e publique a pilha.

1) Criar branch de stack e trazer os patches como commits
```
# Baseie-se em develop
git checkout develop && git pull
git checkout -b stack/fase3

# Commit 1 (ex.: docs quick guide)
git merge --squash origin/docs/70-scripts-guide-troubleshooting
git commit -m "docs(readme): quick guide and troubleshooting for scripts"

# Commit 2 (ex.: CI dry-run)
git merge --squash origin/ci/71-dryrun-v3-sample
git commit -m "ci(scripts): run v3 dry-run against sample CSV"
```

2) Publicar somente os commits da pilha com base em `develop`
```
# Recomendado: usar Python 3.11 (uvx) para evitar avisos do asyncio
uvx --python 3.11 ghstack submit -B develop --stack HEAD~2..HEAD --no-skip
```

3) Fechar PRs antigas
a) Feche as PRs antigas como “Superseded by #<nova_base> / #<nova_topo>”.
b) A partir de agora, use `uvx ghstack` para atualizar a pilha (rebase/sync).

### Landing (opcional)
Quando todas as PRs da pilha estiverem verdes e aprovadas:
```
uvx --python 3.11 ghstack land
```
Requisitos:
- Checks verdes e sem conflitos
- Permissões de merge no repositório
- Política do time: confirmar se o uso de “land” está alinhado (Squash & merge é o padrão deste repo)
