# Vendor - ghstack

Este diretório contém o pacote `ghstack==0.12.0` (mais dependências) instalado via `uv pip install --target vendor/python ...`.

## Atualizar versão
1. `rm -rf vendor/python`
2. `uv pip install --python 3.11 --target vendor/python "ghstack==<nova-versão>"`
3. Garantir que os scripts em `scripts/ghstack/` continuam funcionando (`python scripts/ghstack/run_ghstack.py --version`).

Evite editar arquivos internos manualmente; regenere o diretório seguindo o passo acima.
