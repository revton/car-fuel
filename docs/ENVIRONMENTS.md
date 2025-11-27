# Ambientes — Car Fuel

Este documento descreve os ambientes previstos para o Car Fuel e como pensar variáveis/segredos, CORS, flags, observabilidade, limites, dados e promoção entre eles.

## Ambientes previstos
- **Local**: desenvolvimento na máquina do dev (ex.: API em localhost, banco local/contêiner). Maior liberdade de logs e dados de teste.
- **Dev / Preview** (futuro): ambiente compartilhado para validação rápida de features; pode usar dados sintéticos.
- **Prod** (futuro): ambiente real de uso, com dados de usuários; políticas de segurança, observabilidade e limites mais rígidas.

## Variáveis e segredos
- Em desenvolvimento local, usar arquivos `.env` (não versionados) ou variáveis de ambiente.
- Em pipelines/Actions, usar GitHub Secrets para tokens/chaves sensíveis.
- Nunca commitar chaves, tokens ou credenciais (API keys, senhas, connection strings) no repositório.
- Parametrizar URLs de backend, chaves de API e credenciais via env vars específicas por ambiente.
- **Mobile**:
  - `EXPO_PUBLIC_API_URL`: URL da API backend.
  - `EXPO_PUBLIC_ENV`: Ambiente atual (`development`, `staging`, `production`).

## CORS
- Local/dev: permitir origens de desenvolvimento conhecidas (ex.: `http://localhost:*`).
- Prod: restringir a origens oficiais (domínios da aplicação) e apenas métodos/headers necessários.
- Evitar wildcards amplos (`*`) em produção para origens e headers sensíveis.

## Feature flags
- Funcionalidades experimentais devem ser controladas via flags (env vars ou config) por ambiente.
- Em local/dev, flags podem ser ligadas por padrão; em prod, devem ser ativadas explicitamente.
- Flags devem ter nomes claros e, quando removidas, limpar também o código morto associado.

## Observabilidade por ambiente
- Local/dev: nível de log mais verboso; logs podem incluir mais detalhes (sem dados sensíveis).
- Prod: logs estruturados com foco em correlação (`requestId`) e diagnóstico; evitar dados pessoais nos logs.
- Métricas e traces devem permitir identificar problemas por ambiente (tag `env=local/dev/prod`).

## Limites e uso
- Aplicar limites de tamanho de payload e page size em endpoints que listam recursos.
- Para futuros serviços públicos, considerar rate limiting por chave/usuário/IP, com políticas diferentes por ambiente.

## Dados
- Local/dev: preferir dados sintéticos; se usar dumps de produção, anonimizar dados sensíveis.
- Prod: seguir as regras de retenção e privacidade do projeto (ver `docs/NFR.md`, `docs/PRIVACY.md` e ADRs relevantes).

## Promoção entre ambientes
- Fluxo sugerido (quando existirem dev/prod):
  1. Commit/PR → merge em `main`.
  2. Deploy automático ou manual em dev/preview.
  3. Validação (testes, smoke, métricas).
  4. Promoção para prod (deploy a partir da mesma artefato/commit).
- Mudanças de configuração sensíveis devem ser revisadas em PRs específicas e testadas em dev antes de ir para prod.
