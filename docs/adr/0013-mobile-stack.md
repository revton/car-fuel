# ADR 0013 — Stack Mobile (React Native/Expo)

Status: Accepted
Data: 2025-11-27

## Contexto
Precisamos desenvolver o aplicativo móvel do Car Fuel para permitir que motoristas registrem abastecimentos e visualizem o dashboard.
Requisitos principais:
- Reutilização de lógica de negócios e tipos existentes no frontend web.
- Desenvolvimento ágil e compatibilidade com Android/iOS.
- Armazenamento seguro de tokens de autenticação.
- Navegação fluida entre telas.

## Decisão
Optamos por utilizar **React Native** com **Expo** (Managed Workflow) integrado ao monorepo existente.

### Detalhes da Stack
1.  **Framework**: Expo (React Native). Facilita o setup, build e deploy (EAS).
2.  **Linguagem**: TypeScript, para manter consistência com o backend e frontend.
3.  **Navegação**: React Navigation. Padrão da indústria, flexível e robusto.
4.  **Armazenamento Local**: `expo-secure-store` para guardar tokens JWT de forma segura.
5.  **Gerenciamento de Estado**: React Context API + Hooks (reutilizados do `packages/shared`).
6.  **Arquitetura de Monorepo**:
    - Extração de código comum (interfaces, DTOs, validações, hooks de API) para `packages/shared`.
    - `frontend` (Vite) e `mobile` (Expo) consumindo `packages/shared`.

## Consequências
### Positivos
- **Reuso de Código**: Grande parte da lógica de negócios e tipagem será compartilhada, reduzindo duplicação e bugs.
- **Produtividade**: Expo oferece ferramentas excelentes (Go, EAS, OTA updates).
- **Consistência**: Mesma linguagem e ferramentas (pnpm, eslint, prettier) em todo o projeto.

### Negativos
- **Refatoração Inicial**: Necessário extrair código do `frontend/src` para `packages/shared`.
- **Complexidade do Monorepo**: Gerenciamento de dependências e scripts de build pode ficar mais complexo.

## Alternativas consideradas
- **Flutter**: Ótima performance, mas exigiria reescrever lógica em Dart (sem reuso direto de TS).
- **Native (Kotlin/Swift)**: Maior custo de desenvolvimento e manutenção de duas bases de código.
- **PWA**: Menor acesso a APIs nativas e performance inferior para a experiência desejada.

## Relacionados
- Issues: #174
