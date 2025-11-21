# Observabilidade — Car Fuel

Este documento reúne diretrizes de observabilidade para o projeto Car Fuel (logs, métricas, tracing, health checks e alertas).

## Logs (JSON estruturado)
- Formato recomendado:
  - `timestamp`
  - `level` (info/warn/error)
  - `message`
  - `requestId` (para correlação com métricas/traces)
  - `context` (ex.: endpoint, usuário, vehicleId — sem dados sensíveis em claro)
- Evitar incluir PII (e-mail, placa completa, dados pessoais) diretamente nos logs; ver `docs/PRIVACY.md`.
- Em dev/local, logs podem ser mais verbosos; em prod, priorizar informações úteis para diagnóstico.

## Métricas
- Métricas técnicas principais:
  - Latência por endpoint (p50/p95/p99).
  - Taxa de erro (4xx/5xx) por endpoint.
  - Throughput (requisições/segundo).
- Métricas de negócio (futuro):
  - Número de abastecimentos registrados.
  - Consumo médio por veículo/período.
- Sempre que possível, incluir labels como `env`, `service`, `endpoint`.

## Tracing (OpenTelemetry)
- Cada requisição deve ter um `traceId` e, idealmente, `spanId` para operações internas.
- `requestId` em logs deve ser correlacionável com `traceId`.
- Futuramente, usar OpenTelemetry (OTel) para instrumentar serviços e enviar traces a um coletor.

## Health checks
- Endpoints de saúde sugeridos (futuro backend):
  - `/health/live` — indica se o processo está vivo.
  - `/health/ready` — indica se o serviço está pronto para receber tráfego (dependências principais OK).
- Health checks devem ser leves e não carregar operações pesadas.

## Alertas
- Alertas devem ser baseados em métricas, por exemplo:
  - Aumento significativo na taxa de erros 5xx.
  - Latência acima dos SLOs definidos em `docs/NFR.md`.
  - Falhas recorrentes em health checks.
- Criticidade e canais de alerta podem ser definidos posteriormente, conforme o ambiente (ver `docs/ENVIRONMENTS.md`).

## Web Vitals (frontend futuro)
- Para uma eventual UI web, considerar métricas de experiência como LCP, FID e CLS.
- Coletas devem respeitar `docs/PRIVACY.md` (telemetria sem dados pessoais identificáveis).

