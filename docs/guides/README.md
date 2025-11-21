# Guias de Estudo

Esta pasta reúne **guias de estudo** para implementações importantes do projeto.
Cada guia deve explicar, de forma prática, como uma parte do sistema foi
construída e como reproduzir ou evoluir aquela solução.

## Quando criar ou atualizar um guia

- Sempre que houver uma implementação relevante (nova fase, módulo grande,
  mudança de arquitetura ou de processo).
- Sempre que uma sequência maior de issues/PRs for concluída (por exemplo, uma
  fase inteira do `PHASE_PLAN`).

## Estrutura sugerida de um guia

- Contexto: qual problema/fase resolve, links para issues, ADRs e PRs.
- Decisões principais: referência aos ADRs e aos arquivos de código/configuração
  impactados.
- Passo a passo: o que foi criado/alterado (arquivos e diretórios principais),
  com foco em como reproduzir o raciocínio.
- Como rodar e validar: comandos (`uv`, `ghstack`, `gh`, build/test, etc.).
- Próximos passos: o que ficou explícita ou implicitamente para fases futuras.

## Convenções

- Nome do arquivo em inglês ou português, mas descritivo, por exemplo:
  - `FASE5-BACKEND-MVP.md`
  - `STACK-PR-GHSTACK-CASO-PRATICO.md`
- Sempre que possível, relacionar o guia com:
  - Fase no `docs/project/PHASE_PLAN.md`.
  - Issues no GitHub (com `#<número>`).
  - ADRs em `docs/adr/`.

