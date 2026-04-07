# Spec: Mobile Responsiveness

## Objetivo
Tornar a aplicação totalmente responsiva em dispositivos mobile. O objetivo é revisar e ajustar toda a estilização, componentizando ao máximo para criar componentes reutilizáveis já responsivos, e depois realizar ajustes pontuais nas páginas onde necessário.

## Entradas / Saídas
- **Entrada:** Acesso à aplicação via dispositivo mobile (referência: iPhone 16, 390px de largura)
- **Saída:** Layout completamente utilizável em mobile, sem overflow horizontal, sem quebras visuais, e com interações acessíveis ao toque

## Comportamentos
1. **Navegação mobile** — Revisar top bar e bottom nav existentes; garantir que todos os itens de navegação estejam presentes e funcionais
2. **Tabela de despesas** — Substituir ou adaptar a tabela atual para mobile (cards empilhados ou scroll horizontal controlado), garantindo legibilidade das informações principais
3. **Filtros de despesas** — Revisar layout dos inputs, selects e botões de filtro para que sejam utilizáveis em telas pequenas
4. **Modal de despesa** — Revisar formulário interno para não ultrapassar as bordas da tela e manter campos com tamanho adequado para toque
5. **Dashboard** — Confirmar que cards de resumo e gráfico de pizza não apresentam quebras visuais; ajustar se necessário
6. **Relatórios** — Adaptar tabela de resumo mensal e gráfico de barras para mobile; revisar altura fixa do gráfico
7. **Página de categorias** — Revisar lista de categorias e botões de ação para mobile
8. **Componentização** — Antes dos ajustes pontuais nas páginas, extrair partes repetidas em componentes reutilizáveis já responsivos

## Casos extremos / Erros
- Textos longos (nomes de estabelecimentos, descrições) devem ser truncados com ellipsis e não quebrar o layout
- Tabelas com muitas colunas devem ter scroll horizontal controlado ou ocultação de colunas secundárias em mobile
- Referência de viewport mínima: 390px (iPhone 16); não é necessário suportar telas abaixo disso

## Critérios de Aceite
- [ ] Todas as páginas renderizam sem overflow horizontal em 390px de largura (iPhone 16)
- [ ] A tabela de despesas é legível e utilizável em mobile
- [ ] Textos longos são truncados com ellipsis e não quebram o layout
- [ ] Filtros, formulários e modais são utilizáveis com toque (campos com tamanho adequado)
- [ ] Navegação mobile funciona corretamente em todas as páginas
- [ ] Gráficos se redimensionam corretamente sem corte ou overflow
- [ ] Não há regressões no layout desktop após as mudanças

## Restrições técnicas
- Framework: Next.js (App Router) + Tailwind CSS + TypeScript
- Não introduzir novas bibliotecas externas
- Manter compatibilidade total com dark mode (usar prefixo `dark:` do Tailwind)
- Breakpoint de referência para mobile/desktop: `md` (768px), conforme padrão já adotado no projeto
- Viewport mínima suportada: 390px (iPhone 16)
