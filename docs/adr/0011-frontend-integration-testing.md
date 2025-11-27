# ADR 0011 — Estratégia de Testes de Integração no Frontend

Status: Accepted
Data: 2025-11-26

## Contexto
- O desenvolvimento do frontend (React/Vite) introduziu fluxos de navegação e interação do usuário (ex: "Quick Actions" no Dashboard, formulários de veículos e abastecimentos).
- Identificamos bugs visuais e de comportamento (ex: uso de `<a>` causando reload de página em vez de navegação SPA) que poderiam passar despercebidos sem validação manual constante.
- A pirâmide de testes sugerida em `docs/TESTING.md` prioriza testes de unidade e integração, evitando excesso de testes E2E (ponta-a-ponta) que são mais lentos e frágeis.
- Precisamos garantir que componentes críticos e fluxos de página funcionem corretamente sem depender exclusivamente de testes manuais repetitivos.

## Decisão
- **Adotar Testes de Integração de Página** como a principal estratégia de validação para fluxos de UI.
- **Manter Testes Unitários Colocados:** Arquivos de teste unitário (`*.test.tsx`) devem permanecer na mesma pasta do componente que testam. Isso facilita a manutenção, refatoração e visibilidade imediata da cobertura de testes.
- **Separar Testes de Integração:** Criar arquivos específicos (ex: `src/tests/integration/*.integration.test.tsx`) para testes que validam fluxos completos, mantendo os arquivos `*.test.tsx` junto aos componentes focados em testes unitários.
- Utilizar **Vitest** + **React Testing Library** para renderizar páginas inteiras (ou componentes container) em um ambiente simulado (jsdom).
- Os testes devem simular interações do usuário (cliques, preenchimento de formulários) e verificar o resultado na DOM ou na navegação (mock do Router).
- **Não implementar testes E2E (Cypress/Playwright) neste momento** para o MVP, focando em feedback rápido via testes de integração.

## Consequências
- **Positivos:**
  - Feedback rápido (segundos vs minutos).
  - Execução simples em CI e localmente (`npm test`).
  - Menor custo de manutenção que E2E.
  - Valida a integração entre componentes, hooks e roteamento.
- **Negativos:**
  - Não valida renderização real no navegador (CSS, layouts complexos).
  - Não valida integração real com o backend (usa mocks de API).
- **Impactos:**
  - Necessidade de manter mocks atualizados para respostas da API.
  - Desenvolvedores devem escrever testes para cada nova página/fluxo crítico.

## Alternativas consideradas
- **Testes Manuais (QA):** Baixo custo inicial, mas alto risco de regressão e erro humano. Descartado como única estratégia.
- **Testes E2E (Cypress/Playwright):** Alta fidelidade, mas configuração complexa e execução lenta. Descartado para o MVP para manter agilidade, mas pode ser introduzido futuramente para "Smoke Tests".

## Relacionados
- `docs/TESTING.md`
- `frontend/src/pages/HomePage.test.tsx` (Exemplo de implementação)
