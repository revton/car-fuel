# Guia de Estilo de API — Car Fuel

Este documento define convenções para APIs HTTP deste repositório, complementando `docs/DIRETRIZES.md` (Padrões de API) e orientando futuros contratos (OpenAPI, gateways, serviços).

## Versionamento
- Usar versionamento explícito no caminho (ex.: `/v1/...`).
- Evitar breaking changes dentro da mesma versão; para mudanças incompatíveis, criar `/v2/`.
- Quando necessário, suportar versões antigas por um período definido e documentar depreciações.

## Recursos e URLs
- Usar substantivos no plural: `/vehicles`, `/fills`, `/users`.
- IDs simples no caminho: `/vehicles/{vehicleId}`.
- Sub-recursos quando fizer sentido: `/vehicles/{vehicleId}/fills`.
- Filtros por query string: `/fills?vehicleId={id}&from={data}&to={data}`.

## Métodos e semântica
- `GET` — leitura (idempotente, sem efeitos colaterais).
- `POST` — criação de recurso ou ação não idempotente.
- `PUT` — substituição total de recurso existente.
- `PATCH` — atualização parcial.
- `DELETE` — remoção lógica ou física (documentar qual).

## Códigos de status
- 2xx: `200 OK`, `201 Created`, `204 No Content`.
- 4xx: `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`, `422 Unprocessable Entity`.
- 5xx: `500 Internal Server Error` (erros inesperados); preferir log detalhado e resposta enxuta.

## Paginação
- Padrão sugerido: `page` e `per_page` ou paginação por cursor.
- Resposta deve incluir metadados de paginação (páginas/total ou próximo cursor).

## Headers
- `Content-Type`: `application/json; charset=utf-8`.
- `Accept`: preferir `application/json`.
- Header de correlação (ex.: `X-Request-Id`) para rastrear requisições ponta a ponta.

## Segurança
- Sempre sob HTTPS; nunca enviar credenciais em HTTP.
- Autenticação a definir (token/JWT/OAuth) — documentar no contrato da API.
- Evitar vazamento de informações sensíveis em mensagens de erro.

## Depreciação
- Marcar endpoints em depreciação na documentação.
- Se possível, adicionar header de aviso (ex.: `Deprecation` / `Link` para doc).
- Definir janela de suporte (data ou versão) e segui-la.

## Convenções de payload
- JSON com campos em `camelCase` ou `snake_case` (escolher e manter consistente).
- Datas em ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).
- Erros com estrutura consistente (código interno, mensagem, detalhes e `requestId`).

## Linters e validação
- Ao introduzir OpenAPI/Swagger, usar linters (como `spectral`) no CI para validar contratos.
- Contratos devem ser versionados junto com o código e revisados via PR.

