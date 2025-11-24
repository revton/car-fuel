# Notas de UX – Fase 6 (Frontend Car Fuel)

> Documento de apoio ao **Passo 3 – Design de UX e layout (Issue #163)** descrito em `docs/guides/FASE6-FRONTEND-MVP.md`.

## Objetivo

Concentrar, em um único lugar, as decisões de UX e layout do frontend Car Fuel, para que:

- os fluxos principais de usuário fiquem claros;
- os layouts/wireframes possam ser versionados e evoluídos;
- futuras implementações (web e mobile) reutilizem os mesmos conceitos de navegação, feedback e visual.

## Fluxos principais

- **Cadastro e uso de veículo e tanque**
  - [ ] Fluxo: cadastrar veículo → cadastrar tanque → registrar abastecimento.
  - [ ] Estados de erro e sucesso para cada etapa.
- **Consulta de histórico**
  - [ ] Fluxo: selecionar veículo/tanque → listar abastecimentos.
  - [ ] Filtros (datas, veículo, tanque) e comportamento quando não há dados.

> Preencher esta seção com descrições textuais, diagramas simples ou links para ferramentas externas (figma, etc.), sempre que possível incluindo imagens exportadas na pasta `docs/guides/assets/` ou similar.

## Wireframes

- [ ] Lista/detalhe de veículos.
- [ ] Lista/detalhe de tanques.
- [ ] Tela de registro/listagem de abastecimentos.
- [ ] Página inicial com visão geral/health.

Descrever aqui (ou linkar) os wireframes de baixa fidelidade correspondentes. Quando imagens forem adicionadas ao repositório, referenciar o caminho do arquivo.

## Diretrizes de UI

- **Tipografia**
  - [ ] Fonte padrão, tamanhos e pesos para títulos, subtítulos e corpo.
- **Cores**
  - [ ] Paleta principal (primária/secundária/neutra) e uso previsto.
- **Espaçamentos e grid**
  - [ ] Margens e espaçamentos recorrentes; alinhamento de formulários e listas.
- **Feedbacks**
  - [ ] Padrões para mensagens de sucesso/erro/alerta.
  - [ ] Tratamento visual para erros de validação de formulários.

## Considerações de mobile e reuso futuro

- [ ] Decisões de layout que facilitam portar as telas para um app mobile (por exemplo, React Native/Expo).
- [ ] Padrões de navegação que podem ser compartilhados entre Web e mobile (lista/detalhe, tabs, etc.).

## Referências

- `docs/guides/FASE6-FRONTEND-MVP.md` (Passo 3 – Design de UX e layout).
- `docs/API_STYLE.md`, `docs/ERRORS.md`.
- `docs/NFR.md`, `docs/PRIVACY.md`.
- OpenAPI: `api/openapi/car-fuel-v1.yaml`.

