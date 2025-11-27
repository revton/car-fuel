# ADR 0010 — Diretrizes de UI e UX

Status: Proposed
Data: 2025-11-25

## Contexto
- O desenvolvimento do frontend Car Fuel Web (Fase 6) requer uma definição clara de diretrizes visuais e de experiência do usuário para garantir consistência e qualidade.
- As notas de UX foram levantadas em `docs/guides/FASE6-UX-NOTES.md`.
- É necessário estabelecer padrões de tipografia, cores, espaçamento e comportamento de feedback antes de iniciar a implementação massiva de telas.
- O objetivo é criar uma interface com design "Premium", responsiva e com micro-interações, evitando o aspecto de "MVP básico".

## Decisão

### Estilo Visual (Look & Feel)
- **Design System Próprio**: Utilizaremos CSS Vanilla (com variáveis CSS) para criar um sistema de design leve e customizável, focado em uma estética moderna (Glassmorphism, gradientes sutis, sombras suaves).
- **Tipografia**:
  - Família principal: **Inter** ou **Outfit** (Google Fonts).
  - Pesos: Regular (400), Medium (500), Bold (700).
  - Escala tipográfica baseada em `rem`.
- **Cores**:
  - **Primária**: Indigo/Violeta (ex: `#6366f1` a `#4f46e5`) para ações principais e destaques.
  - **Fundo**: Dark Mode por padrão ou Light Mode com tons de cinza muito claros (`#f8fafc`) e superfícies brancas com sombra.
  - **Feedback**:
    - Sucesso: Emerald/Green.
    - Erro: Rose/Red.
    - Alerta: Amber/Yellow.
- **Espaçamento e Grid**:
  - Grid de 4px (0.25rem).
  - Container centralizado com largura máxima para telas grandes.
  - Layout responsivo (Mobile First).

### Estrutura de Layout
- **Navegação**:
  - Desktop: Sidebar lateral fixa à esquerda.
  - Mobile: Menu "Hambúrguer" ou Bottom Navigation.
- **Área de Conteúdo**:
  - Cabeçalho com título da página e ações globais (perfil, notificações).
  - Conteúdo principal com breadcrumbs.

### Feedback ao Usuário
- **Toasts**: Notificações flutuantes para sucesso/erro de operações (ex: "Abastecimento salvo com sucesso").
- **Skeletons**: Loading states para carregamento de dados (melhor que spinners para tabelas/cards).
- **Validação Inline**: Mensagens de erro logo abaixo dos campos de formulário.

## Consequências
- **Positivos**:
  - Interface consistente e profissional.
  - Facilidade de manutenção através de variáveis CSS globais.
  - Independência de frameworks de UI pesados (como MUI ou Bootstrap), permitindo maior controle sobre a performance e o visual "Premium".
- **Negativos**:
  - Maior esforço inicial para configurar o design system (botões, inputs, cards) em comparação a usar uma lib pronta.
- **Impactos**:
  - Necessidade de criar componentes base (`Button`, `Input`, `Card`) logo no início.

## Alternativas consideradas
- **Tailwind CSS**:
  - Rejeitado no momento pois a instrução do projeto prefere Vanilla CSS, a menos que explicitamente solicitado.
- **Material UI / Ant Design**:
  - Rejeitado para evitar o "look genérico" de admin templates e permitir uma estética mais customizada e "wow".

## Relacionados
- Issues: #163 (Design de UX e layout)
- Docs: `docs/guides/FASE6-UX-NOTES.md`
- ADRs: `docs/adr/0008-frontend-stack.md`
