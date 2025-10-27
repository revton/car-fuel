# Guia de Uso — ghstack (PRs Empilhadas)

Este guia descreve como criar e manter PRs empilhadas usando a ferramenta `ghstack` (https://github.com/ezyang/ghstack) no fluxo deste repositório.

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

## Troubleshooting
- Permissão negada: verifique o token salvo no keychain (`ghstack` solicitará novamente se necessário).
- PRs fora de ordem: rode `ghstack` após ajustar commits/rebase.
- CI vermelho no `stack-graph`: abra o arquivo `docs/stack-plan/STACK-PR-PLAN.md` para checar se há base incorreta.

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
