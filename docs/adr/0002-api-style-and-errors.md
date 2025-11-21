# ADR 0002 — Estilo de API e catálogo de erros

Status: Accepted
Data: 2025-11-17

## Contexto
- O projeto precisará expor APIs HTTP (ou gateways) no futuro.
- Para evitar divergência de padrões, foi definido um estilo de API e um formato padrão de erros.

## Decisão
- Adotar REST pragmático com versionamento explícito no caminho (ex.: `/v1/...`).
- Definir estilo de recursos, métodos, códigos e paginação em `docs/API_STYLE.md`.
- Usar um envelope de erro inspirado na RFC 7807 (`application/problem+json`) com campos como `type`, `title`, `status`, `detail`, `code`, `requestId`, conforme `docs/ERRORS.md`.

## Consequências
- Clientes podem depender de um formato de erro previsível.
- Contratos OpenAPI futuros podem reutilizar schemas/responses comuns de erro.
- Mudanças no formato de erro passam a ser controladas via catálogo, reduzindo risco de breaking changes inesperados.

## Alternativas consideradas
- Formatos de erro ad hoc por endpoint:
  - Flexível, mas difícil de manter e documentar.
- Uso imediato de um framework específico de API:
  - Ainda prematuro; preferimos registrar princípios antes da escolha de stack.

## Relacionados
- `docs/API_STYLE.md`
- `docs/ERRORS.md`
- `docs/SECURITY.md`

