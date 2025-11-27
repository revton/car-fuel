# Segurança — Car Fuel

Este documento estabelece diretrizes gerais de segurança para o projeto Car Fuel. Ele complementa `docs/NFR.md`, `docs/API_STYLE.md`, `docs/ERRORS.md` e `docs/ENVIRONMENTS.md`.

## Autenticação e Autorização (AuthN/AuthZ)
- Autenticação deverá ser baseada em token (por exemplo, JWT ou OAuth2) quando um backend for introduzido.
- Princípio do menor privilégio: cada token/usuário deve ter apenas as permissões necessárias.
- Rotas sensíveis (ex.: gestão de dados pessoais) devem exigir autenticação e autorização explícitas.

## Transporte
- Todo tráfego externo deve usar HTTPS.
- Não expor endpoints HTTP em produção; redirecionar (ou bloquear) acesso em porta insegura.

## CORS
- Seguir as diretrizes de `docs/ENVIRONMENTS.md` para origens permitidas por ambiente.
- Em produção, restringir CORS a domínios oficiais da aplicação e aos métodos/headers realmente necessários.

## Rate limiting e proteção contra abuso
- Para APIs públicas, aplicar limites de requisição por IP/usuário/chave.
- Em caso de abuso, retornar `429 Too Many Requests` com mensagem consistente (`rate_limited` em `docs/ERRORS.md`).

## Headers de segurança
- Em aplicações web futuras, considerar cabeçalhos como:
  - `Strict-Transport-Security`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options` / Content-Security-Policy (CSP)

## Segredos e Criptografia
- Segredos (tokens, chaves de API, connection strings) nunca devem ser commitados no repositório.
- Em dev/local, usar `.env` ignorado no git; em CI/CD, GitHub Secrets.
- Senhas/hashs (se existirem) devem usar algoritmos adequados (ex.: bcrypt, argon2) com salt.

## Mobile Security
- **Armazenamento Seguro**: Tokens de autenticação e dados sensíveis devem ser armazenados usando `expo-secure-store` (iOS Keychain / Android Keystore). Nunca usar `AsyncStorage` para dados sensíveis.
- **Deep Linking**: Validar parâmetros de entrada em deep links para evitar ataques de injeção ou redirecionamento malicioso.
- **SSL Pinning**: Considerar implementação futura para mitigar ataques Man-in-the-Middle (MitM).

## Supply Chain (Dependências)
- Usar versões pinadas ou faixas de versão controladas para dependências críticas.
- Evitar dependências sem manutenção ou de origem duvidosa.
- Revisar dependências adicionadas em PRs e, quando possível, automatizar checagens de vulnerabilidades.

## CI/CD
- Workflows de CI/CD devem usar tokens com escopo mínimo necessário.
- Não ecoar segredos em logs; mascarar variáveis sensíveis.
- Revisar PRs que alteram workflows com atenção redobrada.

## Auditoria e incidentes
- Logs devem registrar eventos importantes (ex.: falhas de autenticação, erros inesperados) sem incluir dados sensíveis.
- Em caso de incidente de segurança:
  - Revogar/rotacionar segredos afetados.
  - Registrar o incidente (issue privada ou canal apropriado) com detalhes suficientes para investigação.
  - Revisar se foram necessárias mudanças de código/configuração para evitar recorrência.

