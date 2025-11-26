# Guia de Estudo - Fase 6 / Passo 5 (Fluxos de Veículos, Abastecimentos e Testes)

Status: Draft
Data: 2025-11-26

## O que foi feito (passo a passo)

### 1) Estrutura e Layout Base
- Implementação do **Layout Principal** (`MainLayout`) com **Sidebar** responsiva.
- Definição de estilos globais e variáveis CSS (`index.css`) seguindo o guia de UI (Glassmorphism, Dark Mode).
- Configuração de rotas com `react-router-dom` em `App.tsx`.

### 2) Fluxo de Veículos
- **Listagem (`VehicleList`)**:
  - Exibe cards de veículos cadastrados.
  - Integração com `GET /v1/vehicles`.
  - Estado de carregamento e tratamento de erro.
  - Botão flutuante (FAB) para adicionar novo veículo.
- **Formulário (`VehicleForm`)**:
  - Criação e edição de veículos.
  - Campos: Nome, Placa, Unidade de Odômetro (KM/MI).
  - Integração com `POST /v1/vehicles`.

### 3) Fluxo de Abastecimentos
- **Listagem (`FuelingList`)**:
  - Histórico de abastecimentos com detalhes (data, volume, preço, custo total).
  - Integração com `GET /v1/fuelings`.
- **Formulário (`FuelingForm`)**:
  - Registro de novo abastecimento.
  - Seleção dinâmica de **Veículo** e **Tanque** (cascata).
  - Cálculo automático de **Custo Total** (Volume * Preço).
  - Integração com `POST /v1/fuelings`.

### 4) Integração com Backend e Robustez
- **Cliente de API Real (`apiClient.ts`)**:
  - Substituição dos mocks por chamadas reais `fetch` ao backend (`http://localhost:8080`).
  - Tratamento padronizado de erros (`ApiError`) baseado no `ProblemDetails` do backend.
- **Contexto de Saúde (`HealthContext`)**:
  - Monitoramento global do status do backend (`/v1/health`).
  - **Modo Offline**: Desabilita ações de escrita (botões "Novo", formulários) quando o backend está inacessível.
  - Indicador visual de status na Sidebar.
- **Empty States**:
  - Componente reutilizável `EmptyState` para listas vazias (Veículos, Abastecimentos), melhorando a UX.

### 5) Testes Abrangentes
- **Testes Unitários**:
  - Componentes de UI: `Button`, `Card`, `EmptyState`.
  - Páginas (isoladas): `HomePage.test.tsx` (foco em renderização de estados).
- **Testes de Integração (Separados)**:
  - Conforme **ADR 0011**, testes de fluxo completo foram movidos para `src/tests/integration`.
  - `HomePage.integration.test.tsx`: Validação de navegação SPA ("Quick Actions").
  - Outros testes de página (`VehicleList`, `FuelingForm`, etc.) cobrem fluxos críticos.
- **Correções e Melhorias**:
  - **Navegação SPA**: Correção no `HomePage` substituindo `<a>` por `<Link>` para evitar recarregamento da página.
  - **Acessibilidade**: Adição de `id` e `htmlFor` em formulários para garantir testes acessíveis.
  - **Robustez**: Uso de `userEvent` e `findBy` para testes assíncronos.
  - **Correções de Infraestrutura e Bugs**:
    - **Porta do Frontend**: Alterada para `3000` (`http://localhost:3000`) para evitar conflitos de porta locais.
    - **CORS**: Configuração do Nginx para remover cabeçalhos `Origin` e `Referer` em requisições `/v1`, permitindo POSTs seguros.
    - **Formato de Data**: Ajuste no `FuelingForm` para enviar datas em ISO 8601 (`toISOString()`), corrigindo erro 400 no backend.
    - **API Client**: Correção na lógica de `BASE_URL` para suportar caminhos relativos corretamente.

### 6) Melhorias e Correções Pós-MVP
- **Gestão de Tanques (`TankList`, `TankForm`)**:
  - Implementação completa do CRUD de tanques por veículo.
  - Navegação via botão "Manage Tanks" na lista de veículos.
  - Correção de layout no botão "Add Tank" para consistência visual.
- **Melhorias em Abastecimentos**:
  - **Listagem Rica**: Exibição do nome do Veículo e Tanque em cada item da lista de abastecimentos (resolvido via frontend join).
  - **Novos Tipos de Combustível**: Adição de "Gas (CNG/LPG/GPL)" nos formulários de Veículo e Tanque.
- **Correções de Navegação**:
  - Correção da rota `/dashboard` que exibia tela em branco.
  - Ajustes de consistência nos labels de combustível.

## Arquivos tocados e por que

- `frontend/src/components/Layout/`
  - `MainLayout.tsx`, `Sidebar.tsx`: Estrutura de navegação e feedback visual de saúde do sistema.
- `frontend/src/pages/Vehicles/`
  - `VehicleList.tsx`, `VehicleForm.tsx`: Telas do CRUD de veículos.
- `frontend/src/pages/Tanks/`
  - `TankList.tsx`, `TankForm.tsx`: Telas de gestão de tanques.
- `frontend/src/pages/Fuelings/`
  - `FuelingList.tsx`, `FuelingForm.tsx`: Telas do fluxo de abastecimento.
- `frontend/src/shared/api/`
  - `apiClient.ts`: Cliente HTTP centralizado.
  - `apiErrors.ts`: Classe de erro customizada.
- `frontend/src/shared/context/`
  - `HealthContext.tsx`: Gerenciamento de estado global de conectividade.
- `frontend/src/components/UI/`
  - `EmptyState.tsx`: Feedback visual para listas vazias.
- `frontend/src/**/*.test.tsx` e `frontend/src/tests/integration/`
  - Suíte completa de testes (Unitários e Integração).
- `docs/adr/0011-frontend-integration-testing.md`
  - Documentação da estratégia de testes adotada.

## Próximos passos (Conclusão da Fase 6)

- O MVP do Frontend está funcional e testado.
- Próximas ações podem incluir:
  - Refinamento visual (animações, transições).
  - Preparação para build de produção e deploy.
