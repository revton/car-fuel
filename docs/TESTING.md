# Estratégia de Testes — Car Fuel

Este documento descreve a visão de testes para o projeto Car Fuel. Ele não amarra ferramentas específicas, mas define direções para quando código de backend/frontend for introduzido.

## Pirâmide de testes
- Base: testes de unidade (maioria) — funções, serviços, regras de negócio isoladas.
- Meio: testes de integração — interação com banco, gateways externos, contratos de API.
- Topo: poucos testes ponta‑a‑ponta (e2e) para fluxos críticos.

Objetivo: priorizar feedback rápido em unidade/integrado e evitar uma suíte e2e pesada e frágil.

## Cobertura
- Medir cobertura é útil, mas não é meta absoluta.
- Foco: 
  - Cobrir regras de negócio críticas.
  - Cobrir integrações e cenários de erro relevantes.
- Evitar perseguir 100% de cobertura às custas de testes pouco significativos.

## Ferramentas recomendadas (quando houver código)
- Backend Java/Kotlin:
  - Testes de unidade/integrados: JUnit.
  - Mocks: Mockito ou MockK (se Kotlin for usado).
  - Integrações reais com banco/filas: Testcontainers.
- Frontend (JS/TS):
  - **Testes de Unidade**: Vitest + Testing Library.
    - Arquivos `*.test.tsx` colocados junto aos componentes.
  - **Testes de Integração**: Vitest + Testing Library (com Router mockado).
    - Arquivos `*.integration.test.tsx` em `src/tests/integration/`.
  - Ver **ADR 0011** para detalhes da estratégia.

## Testes de contratos
- Para APIs HTTP, preferir contratos explícitos (OpenAPI) e:
  - Validar schemas de request/response.
  - Reutilizar o catálogo de erros (`docs/ERRORS.md`).
- Considerar testes de contrato (producer/consumer) quando houver múltiplos serviços dependentes.

## Dados de teste
- Usar dados sintéticos e builders/factories para gerar entidades de teste.
- Evitar dependência em dados implícitos (ex.: registros fixos em banco sem setup).
- Em integrações com banco, criar e limpar dados dentro do próprio teste (ou via fixtures controladas).

## Flakiness (testes instáveis)
- Evitar dependências em tempo real (sleep arbitrário, relógio externo) sem controlar o clock.
- Evitar dependência em ordem de execução ou estado global compartilhado.
- Para integrações externas, usar timeouts e, quando possível, dublês (mocks/fakes) em vez de chamadas de rede reais.

## CI
- A suíte de testes deve ser executável em CI de forma não interativa.
- Ordens futuras:
  - Etapa de testes de unidade.
  - Etapa de testes de integração (pode ser opcional quando não houver containers disponíveis).
  - Etapa de testes de contrato/e2e (somente para fluxos críticos).
- Falhas de testes devem bloquear merge em `main` para módulos que já tenham cobertura estabelecida.

