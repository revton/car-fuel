# Privacidade — Car Fuel

Este documento registra princípios de privacidade para o Car Fuel. Não é uma política jurídica formal, mas um baseline técnico para orientar decisões de dados e código.

## Classificação de dados
- **Dados de veículo**: modelo, ano, placa, identificação interna.
- **Dados de consumo**: quilometragem, litros, valores de abastecimento.
- **Dados de usuário** (se existirem): identificadores de conta, e-mail, nome, preferências.
- **Dados técnicos**: logs de requisições, métricas, IDs de sessão.

Em geral, dados de usuário e placa podem ser considerados dados pessoais/identificáveis; logs e métricas devem evitar armazenar esses valores em claro sempre que possível.

## Minimização de dados
- Coletar apenas os dados necessários para as funcionalidades do Car Fuel.
- Em logs, evitar registrar PII diretamente (ex.: placa completa, e-mail). Se necessário, mascarar ou usar identificadores internos.
- Em ambientes de dev/test, preferir dados sintéticos ou dumps anonimizados (ver `docs/ENVIRONMENTS.md`).

## Base legal (visão de alto nível)
- Qualquer uso real com dados pessoais deve estar ancorado em base legal adequada (ex.: consentimento, legítimo interesse, obrigação legal).
- Ao projetar novas funcionalidades que envolvam dados pessoais, considerar se a base legal está clara e documentar em ADRs quando apropriado.

## Retenção
- Dados de consumo (abastecimentos e métricas) devem ser mantidos apenas pelo tempo necessário para análise de eficiência e histórico para o usuário.
- Logs de aplicação e access logs devem ter janelas de retenção razoáveis (ex.: 30–90 dias), conforme necessidade de diagnóstico.
- Dumps usados em dev/test devem ser rotacionados e descartados quando não forem mais necessários.

## Direitos do usuário (alto nível)
- O sistema deve facilitar, no futuro, funcionalidades como:
  - Acesso aos dados próprios (exportar histórico de consumo).
  - Correção de dados incorretos.
  - Exclusão de dados de conta, quando aplicável.
- Mesmo antes dessas funcionalidades existirem, o desenho de dados deve facilitar implementá-las sem grandes retrabalhos.

## Subprocessadores
- Serviços de terceiros (ex.: armazenamento em nuvem, analytics) que venham a processar dados devem ser considerados subprocessadores.
- Ao introduzir um novo serviço externo, avaliar que tipos de dados ele receberá e se isso está alinhado aos princípios deste documento.

## Telemetria
- Telemetria deve focar em métricas agregadas (ex.: número de requisições, latências, taxas de erro).
- Evitar incluir dados pessoais em eventos de telemetria; quando inevitável, considerar anonimização ou pseudonimização.
- Qualquer integração com ferramentas de analytics deve ser revisada à luz deste documento e de `docs/SECURITY.md`.

## Mobile e Permissões
- O aplicativo móvel deve solicitar permissões apenas quando necessário (ex.: câmera para escanear QR Code, localização para mapa de postos).
- Explicar ao usuário o motivo da solicitação antes de pedir a permissão.
- Dados sensíveis armazenados no dispositivo (tokens) devem usar armazenamento seguro (`SecureStore`).

## Incidentes de privacidade
- Em caso de incidente envolvendo dados pessoais (ex.: exposição indevida de logs), deve-se:
  - Identificar rapidamente a extensão (quais dados, por quanto tempo).
  - Corrigir a causa raiz (ajuste de log, permissão, código, configuração).
  - Rotacionar segredos ou credenciais afetadas.
  - Registrar o incidente em canal apropriado (issue privada ou doc interno) para aprendizado futuro.

