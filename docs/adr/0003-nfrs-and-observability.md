# ADR 0003 — NFRs e Observabilidade

Status: Accepted
Data: 2025-11-17

## Contexto
- Queremos ter metas claras de desempenho, disponibilidade e operacionalidade desde o início.
- Também precisamos de diretrizes para logs, métricas e tracing que suportem essas metas.

## Decisão
- Registrar NFRs (SLOs, performance, resiliência, escalabilidade, dados, operabilidade, custo) em `docs/NFR.md`.
- Definir diretrizes de observabilidade (logs JSON, métricas, tracing, health checks, alertas, web vitals) em `docs/OBSERVABILITY.md`.
- Usar esses documentos como referência ao desenhar futuras APIs/serviços e pipelines.

## Consequências
- Há um baseline explícito para discutir trade-offs de arquitetura.
- Qualquer nova solução deve ser avaliada à luz das metas de NFRs e das práticas de observabilidade.
- Facilita futuras integrações com plataformas de logs/métricas/tracing.

## Alternativas consideradas
- Não registrar NFRs/observabilidade formalmente:
  - Leva a decisões implícitas e possivelmente contraditórias.
- Postergar essas definições até existir backend:
  - Perde-se oportunidade de influenciar o desenho inicial com metas claras.

## Relacionados
- `docs/NFR.md`
- `docs/OBSERVABILITY.md`
- `docs/ENVIRONMENTS.md`

