# ADR 0012 — Ambiente de Desenvolvimento Containerizado (Devcontainer)

Status: Proposed
Data: 2025-11-27

## Contexto
- A configuração do ambiente de desenvolvimento atual exige instalação manual de várias ferramentas (Java, Node, Docker, CLI tools), o que pode gerar inconsistências entre máquinas de desenvolvedores e CI.
- O onboarding de novos desenvolvedores pode ser lento devido à complexidade do setup.
- Necessidade de garantir que todos usem as mesmas versões de runtime e ferramentas.

## Decisão
- Adotar **Devcontainers** (VS Code Remote - Containers) como ambiente de desenvolvimento padrão/recomendado.
- Utilizar uma imagem base customizada ou composta via Docker Compose para incluir:
    - OpenJDK 17/21 (conforme projeto)
    - Node.js 20+
    - Ferramentas de CLI: git, gh, ghstack, uv (para python tools)
- Configurar `docker-compose.yml` com perfis para permitir execução híbrida (app no container, dependências no docker host ou vice-versa).
- Manter suporte a desenvolvimento local (sem container) mas com aviso de que o devcontainer é a referência ("source of truth").

## Consequências
- **Positivos**:
    - Ambiente reprodutível e isolado.
    - "Infrastructure as Code" para o ambiente de dev.
    - Onboarding rápido (apenas Docker e VS Code necessários).
- **Negativos**:
    - Overhead de performance no Windows/Mac (Docker Desktop).
    - Curva de aprendizado para quem não conhece Docker/Devcontainers.
- **Impactos**:
    - `docs/DEVELOPER_SETUP.md` será atualizado para priorizar o setup via Devcontainer.
    - CI pode eventualmente usar a mesma imagem para build/test.

## Alternativas consideradas
- **Vagrant**: Tecnologia mais antiga, mais pesada (VM completa).
- **Nix/NixOS**: Curva de aprendizado muito alta, embora garanta reprodutibilidade.
- **Scripts de setup locais**: Difícil manter compatibilidade entre OSs (Windows/Linux/Mac).

## Relacionados
- Issues: #168
- PRs:
- Outros ADRs: `docs/adr/0004-security-privacy-environments.md`
