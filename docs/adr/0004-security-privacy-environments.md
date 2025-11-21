# ADR 0004 — Segurança, Privacidade e Ambientes

Status: Accepted
Data: 2025-11-17

## Contexto
- O Car Fuel poderá lidar com dados de veículos e, potencialmente, dados pessoais de usuários.
- É importante considerar segurança, privacidade e diferenças entre ambientes desde o início, mesmo sem backend implementado.

## Decisão
- Definir um baseline de segurança em `docs/SECURITY.md` (authN/authZ, transporte, CORS, segredos, supply chain, CI/CD, incidentes).
- Definir um baseline de privacidade em `docs/PRIVACY.md` (classificação de dados, minimização, retenção, telemetria, incidentes de privacidade).
- Descrever ambientes (local/dev/prod) e como variáveis/segredos, CORS, flags, observabilidade e dados comportam-se em cada um em `docs/ENVIRONMENTS.md`.

## Consequências
- Decisões futuras sobre logs, telemetria, dados de teste e autenticação devem seguir esses baselines.
- Reduzimos o risco de introduzir práticas inseguras ou incompatíveis com expectativas de privacidade.

## Alternativas consideradas
- Tratar segurança/privacidade apenas quando o produto estiver em produção:
  - Risco alto de retrabalho e de decisões difíceis de reverter.

## Relacionados
- `docs/SECURITY.md`
- `docs/PRIVACY.md`
- `docs/ENVIRONMENTS.md`
