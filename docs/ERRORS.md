# Catálogo de Erros — Car Fuel

Este documento define o formato padrão de erros para APIs HTTP do projeto, alinhado ao estilo descrito em `docs/API_STYLE.md`.

## Envelope de erro (inspirado na RFC 7807)

Erro de API deve ser retornado em JSON com os campos abaixo (compatível com `application/problem+json`):

- `type` (string, opcional): URI ou identificador da categoria de erro (ex.: `"https://car-fuel/errors/vehicle_not_found"`).
- `title` (string, obrigatório): resumo curto, estável e legível (ex.: `"Vehicle not found"`).
- `status` (number, obrigatório): código HTTP correspondente (ex.: `404`).
- `detail` (string, opcional): mensagem detalhada, específica da ocorrência.
- `instance` (string, opcional): URI ou identificador da ocorrência (ex.: caminho da rota).
- `code` (string, obrigatório): código interno estável (ex.: `"vehicle_not_found"`).
- `requestId` (string, opcional): id de correlação da requisição (mesmo valor de `X-Request-Id`).
- `errors` (object, opcional): mapa de erros de validação por campo (ex.: `{ "plate": ["invalid_format"] }`).

### Exemplo de payload de erro

```json
{
  "type": "https://car-fuel/errors/vehicle_not_found",
  "title": "Vehicle not found",
  "status": 404,
  "detail": "No vehicle was found for id '123'",
  "instance": "/v1/vehicles/123",
  "code": "vehicle_not_found",
  "requestId": "f4c0f291-1c3e-4d1e-9f7c-123456789abc"
}
```

## Códigos comuns e mapeamentos

Sugestão de códigos internos (campo `code`) e mapeamento para HTTP:

| code                       | HTTP status | Descrição                                   |
|----------------------------|------------|---------------------------------------------|
| `vehicle_not_found`        | 404        | Veículo não encontrado                      |
| `fill_not_found`           | 404        | Abastecimento não encontrado                |
| `invalid_fill_payload`     | 400        | Dados de abastecimento inválidos            |
| `invalid_query_params`     | 400        | Parâmetros de consulta inválidos            |
| `unauthorized`             | 401        | Não autenticado                             |
| `forbidden`                | 403        | Sem permissão para acessar o recurso        |
| `conflict`                 | 409        | Conflito de estado (ex.: recurso duplicado) |
| `rate_limited`             | 429        | Limite de requisições excedido              |
| `internal_error`           | 500        | Erro interno inesperado                     |

Ao adicionar novos erros de domínio, crie códigos internos consistentes (snake_case) e documente-os neste catálogo.

## Erros de validação

Para erros de validação de payload ou query string, use `status = 400` ou `422` e preencha o campo `errors`:

```json
{
  "title": "Invalid request",
  "status": 400,
  "code": "invalid_fill_payload",
  "errors": {
    "odometer": ["must_be_positive"],
    "liters": ["must_be_greater_than_zero"]
  }
}
```

## OpenAPI / Padrões de contrato

Ao modelar erros em OpenAPI/Swagger:

- Definir um schema compartilhado para o envelope de erro (ex.: `ProblemDetails`).
- Reutilizar esse schema em respostas padrão (ex.: `400Error`, `404Error`, `DefaultError`).
- Quando possível, referenciar `code` e `type` com enum ou documentação textual.

O objetivo é manter erros previsíveis para clientes (tanto humanos quanto automações) e garantir que qualquer mudança de formato seja centralmente controlada por este catálogo.

