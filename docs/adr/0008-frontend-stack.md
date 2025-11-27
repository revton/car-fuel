# ADR 0008 – Stack técnica do frontend Car Fuel Web

Status: Proposed  
Data: 2025-11-24

## Contexto
- A Fase 6 prevê a construção do **frontend Car Fuel Web**, consumindo a Car Fuel API definida e implementada na Fase 5.
- Já existem diretrizes gerais de arquitetura, NFRs, segurança, privacidade e testes em:
  - `docs/DIRETRIZES.md`
  - `docs/NFR.md`
  - `docs/SECURITY.md`
  - `docs/PRIVACY.md`
  - `docs/TESTING.md`
  - `docs/OBSERVABILITY.md`
- O contrato da API está versionado em `api/openapi/car-fuel-v1.yaml` e segue `docs/API_STYLE.md` e `docs/ERRORS.md`.
- O repositório já padroniza o backend em Kotlin/Spring Boot com Gradle wrapper, e a Fase 6 deve:
  - facilitar o desenvolvimento local junto com o backend,
  - ter build simples para empacotar o frontend em artefatos estáticos,
  - alinhar com a estratégia de CI/Projects já em uso.

## Decisão

### Linguagem e framework
- **Linguagem:** TypeScript (sobre JavaScript ES2019+).
- **Framework:** React (SPA tradicional) com **Vite** como bundler/dev-server.

Motivações:
- Stack amplamente adotada no ecossistema web, com boa documentação, tooling e suporte em IDEs.
- TypeScript oferece tipagem estática e melhor refatoração, importante em integrações com um backend tipado (Kotlin).
- Vite proporciona ciclo de desenvolvimento rápido (hot reload) e build simples, alinhado com o foco de um MVP.

### Estrutura de projeto
- Diretório raiz do frontend: `frontend/`.
- Organização inicial sugerida:
  - `frontend/src/pages/` – páginas de alto nível (ex.: `VehiclesPage`, `TanksPage`, `FuelingsPage`, `HomePage`).
  - `frontend/src/components/` – componentes reutilizáveis (tabelas, formulários, layout).
  - `frontend/src/api/` – clientes HTTP e mapeamentos para a Car Fuel API (podendo usar fetch/axios).
  - `frontend/src/hooks/` – hooks customizados (ex.: uso de API, estado de filtros).
  - `frontend/src/styles/` – estilos globais e temas, se necessário.

### Gerenciador de pacotes e scripts
- Gerenciador de pacotes: **pnpm** (preferencial) ou `npm` se não houver pnpm disponível no ambiente:
  - `pnpm install` (ou `npm install`) para instalar dependências.
- Scripts padrão em `package.json`:
  - `dev` – sobe o dev server (`vite`).
  - `build` – gera artefatos estáticos (`vite build`).
  - `preview` – preview local do build (`vite preview`).
  - `test` – testes unitários/integração de UI (Vitest + React Testing Library).
  - `lint` – lint de código (ESLint + regras para React/TS).

### Integração com backend
- O frontend deve consumir a API exposta pelo backend em `http://localhost:8080` no ambiente de desenvolvimento, com URLs definidas em variáveis de ambiente (`VITE_API_BASE_URL` ou equivalente).
- Para outros ambientes (dev remoto / prod), seguir `docs/ENVIRONMENTS.md` (mapeando base URLs e CORS).
- O contrato `api/openapi/car-fuel-v1.yaml` será utilizado como referência de endpoints, tipos e códigos de erro; geração automática de cliente (via OpenAPI Generator, por exemplo) é opcional e pode ser endereçada em ADR futuro.

### Build e deploy
- Build principal: `pnpm build` (ou `npm run build`) gera artefatos estáticos em `frontend/dist/`.
- Deploy inicial previsto:
  - Empacotar `frontend/dist/` como assets estáticos servidos por um servidor HTTP simples (Nginx, ou o próprio backend via Spring Static Resources em fase posterior), ou
  - Publicar em hosting estático (GitHub Pages, S3+CloudFront, etc.), conforme decisão operacional futura.
- A integração com Docker poderá ser feita em um Dockerfile específico do frontend ou combinada com o backend em compose, mas isso não é obrigatório no MVP.

### Testes e CI
- Testes:
  - Unitários e de componentes com **Vitest** + React Testing Library.
  - Uso das diretrizes de `docs/TESTING.md` para pirâmide de testes (frontend focando em unidade e integração de componentes).
- CI:
  - Workflows dedicados em `.github/workflows/`:
    - `frontend-lint` – roda lint (`pnpm lint`).
    - `frontend-test` – roda testes (`pnpm test`).
    - `frontend-build` – valida build (`pnpm build`).

## Consequências

Pontos positivos:
- Stack moderna e amplamente adotada (React + TS + Vite) facilita contratação, onboarding e reutilização de exemplos/doc.
- Build rápido e leve, integrável com o pipeline existente (GitHub Actions) sem alterar a stack do backend.
- Tipagem estática de ponta a ponta (TS no frontend, Kotlin no backend) reduz erros de integração.

Pontos negativos / trade-offs:
- Introduz toolchain Node.js além da JVM (já usada pelo backend), o que demanda mais dependências no ambiente de desenvolvimento e CI.
- React/Vite são orientados a SPA; se no futuro houver necessidade forte de SSR/SEO, pode ser necessário rever a decisão (ex.: migrar para Next.js ou outro framework).
- Dependência de algumas ferramentas adicionais (ESLint, Vitest, etc.) que também precisam de manutenção de versões.

Impactos:
- `docs/DEVELOPER_SETUP.md` precisará ser ajustado para incluir pré-requisitos de Node/pnpm e comandos básicos de frontend.
- `docs/TESTING.md` deve ser atualizado para incluir a camada de testes de frontend e ferramentas escolhidas.
- `docs/ENVIRONMENTS.md`, `docs/SECURITY.md`, `docs/PRIVACY.md` e `docs/OBSERVABILITY.md` deverão considerar o frontend (CORS, coleta de Web Vitals, logging de erros de UI, etc.), em alinhamento com o ADR de integração (#157).

## Alternativas consideradas

- **Next.js (React + SSR)**
  - Prós: SSR/SSG nativos, melhor SEO, convenções de rota.
  - Contras: complexidade adicional (rota/servidor), overhead desnecessário para o MVP que inicialmente consumirá apenas a própria API.

- **Vue 3 + Vite**
  - Prós: framework moderno e produtivo, boa integração com Vite.
  - Contras: time/projeto parecem já ter forte exposição a React/TS (pelas docs/TESTING e referências), o que tornaria React a escolha mais natural.

- **Svelte / SvelteKit**
  - Prós: API de componentes enxuta, boa performance.
  - Contras: ecossistema menor; menos alinhado com ferramentas mencionadas em `docs/TESTING.md`.

## Relacionados

- Issues:
  - #156 feat(frontend): stack técnica Car Fuel Web
- PRs:
  - _(a ser definido pela PR que introduzir este ADR)_
- Outros ADRs:
  - `docs/adr/0001-branch-main-stack-pr-ghstack.md`
  - `docs/adr/0002-api-style-and-errors.md`
  - `docs/adr/0003-nfrs-and-observability.md`
  - `docs/adr/0004-security-privacy-environments.md`
  - `docs/adr/0005-backend-stack.md`
  - `docs/adr/0006-domain-model-vehicles-fuelings.md`
  - `docs/adr/0007-openapi-lint-pre-commit.md`

## Nota sobre reuso com app mobile

- A arquitetura proposta do frontend (React + TypeScript) deve ser organizada para maximizar o reaproveitamento de modelos, validações e clientes HTTP em um futuro app mobile.
- Sempre que possível, concentrar lógica de domínio e integrações da API em módulos TypeScript puros (por exemplo, `frontend/src/shared/`), desacoplados de React, para que possam ser reutilizados por um projeto mobile (como React Native/Expo) ou outras interfaces de usuário.
