# Requisitos Não Funcionais (NFRs) — Car Fuel

Este documento registra requisitos não funcionais esperados para o sistema Car Fuel. Ele serve como referência de decisões e trade-offs durante o desenho de APIs, serviços e integrações.

## SLOs (Service Level Objectives)
- Disponibilidade alvo: **99,5%** para funcionalidades centrais (registro e consulta de abastecimentos).
- Latência alvo (p95):
  - Leitura simples (ex.: GET /fills/{id}): **≤ 300 ms**.
  - Listagens com filtros simples: **≤ 500 ms**.
- Erro 5xx (pico): idealmente < **1%** das requisições em períodos normais.

Estes valores são referências de projeto, não SLAs contratuais.

## Performance
- Evitar N+1 em consultas; preferir agregações apropriadas e uso parcimonioso de JOINs.
- Paginação obrigatória em listagens potencialmente grandes.
- Operações de escrita devem ser otimizadas para o caminho comum (ex.: registro de abastecimento) e não exigir validações excessivamente caras.

## Resiliência
- Timeouts razoáveis em chamadas externas (para evitar requisições presas indefinidamente).
- Re-tentativas idempotentes em operações de leitura ou comandos seguros (cuando fizer sentido), com backoff.
- Foco em falha segura: se um componente opcional falhar (ex.: envio de notificação), a operação principal não deve necessariamente ser abortada.

## Escalabilidade
- Arquitetura preparada para escalar horizontalmente onde fizer sentido (stateless em camadas de borda).
- Uso de cache para leituras quentes quando necessário, com estratégias claras de invalidação.
- Limites por requisição (page size, payload máximo) para evitar uso abusivo.

## Segurança e Observabilidade (resumo)
- Todas as comunicações externas devem usar HTTPS.
- Logs estruturados com correlação por `requestId`.
- Métricas de latência, taxa de erro e volume por endpoint devem ser passíveis de coleta.
- Erros devem seguir o catálogo de `docs/ERRORS.md`.

## Dados
- Consistência: eventual onde aceitável, forte em operações críticas (ex.: registro de abastecimento e saldos derivados imediatos).
- Retenção: datas de abastecimento e dados históricos devem ser mantidos por período suficiente para análise de consumo; regras detalhadas podem ser documentadas em ADRs específicos.
- Privacidade: dados de localização ou identificadores pessoais devem ser tratados com cuidado, minimizando armazenamento quando não essencial. Ver detalhes em `docs/PRIVACY.md`.

## Operabilidade
- Deve ser possível identificar rapidamente a causa de falhas frequentes via logs e métricas.
- Releases devem ser incrementais e reversíveis (rollback simples).
- Feature flags podem ser usadas para ativar/desativar funcionalidades sem novo deploy.

## Custo
- Escolhas de arquitetura devem considerar simplicidade e custo operacional (infraestrutura, storage, observabilidade).
- Evitar dependências complexas quando um design mais simples atende aos requisitos funcionais e não funcionais.
