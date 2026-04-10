# Spec: Mobile Responsiveness

## Objetivo
Tornar a aplicação totalmente responsiva em dispositivos mobile. O objetivo é revisar e ajustar toda a estilização, componentizando ao máximo para criar componentes reutilizáveis já responsivos, e depois realizar ajustes pontuais nas páginas onde necessário.

## Entradas / Saídas
- **Entrada:** Acesso à aplicação via dispositivo mobile (referência: iPhone 16, 390px de largura)
- **Saída:** Layout completamente utilizável em mobile, sem overflow horizontal, sem quebras visuais, e com interações acessíveis ao toque

## Comportamentos
1. **Navegação mobile** — Revisar top bar e bottom nav existentes; garantir que todos os itens de navegação estejam presentes e funcionais
2. **Expense table** — Replace or adapt the current table for mobile (stacked cards or controlled horizontal scroll), ensuring readability of the main information
3. **Expense filters** — Review layout of inputs, selects, and filter buttons to be usable on small screens
4. **Expense modal** — Review internal form to not exceed screen edges and keep fields with adequate touch size
5. **Dashboard** — Confirmar que cards de resumo e gráfico de pizza não apresentam quebras visuais; ajustar se necessário
6. **Relatórios** — Adaptar tabela de resumo mensal e gráfico de barras para mobile; revisar altura fixa do gráfico
7. **Página de categorias** — Revisar lista de categorias e botões de ação para mobile
8. **Componentização** — Antes dos ajustes pontuais nas páginas, extrair partes repetidas em componentes reutilizáveis já responsivos

## Casos extremos / Erros
- Long texts (establishment names, descriptions) must be truncated with ellipsis and not break the layout
- Tables with many columns must have controlled horizontal scroll or hide secondary columns on mobile
- Referência de viewport mínima: 390px (iPhone 16); não é necessário suportar telas abaixo disso

## Critérios de Aceite
- [ ] All pages render without horizontal overflow at 390px width (iPhone 16)
- [ ] The expense table is readable and usable on mobile
- [ ] Long texts are truncated with ellipsis and do not break the layout
- [ ] Filters, forms, and modals are usable with touch (fields with adequate size)
- [ ] Mobile navigation works correctly on all pages
- [ ] Charts resize correctly without clipping or overflow
- [ ] No regressions in desktop layout after the changes

## Restrições técnicas
- Framework: Next.js (App Router) + Tailwind CSS + TypeScript
- Não introduzir novas bibliotecas externas
- Manter compatibilidade total com dark mode (usar prefixo `dark:` do Tailwind)
- Breakpoint de referência para mobile/desktop: `md` (768px), conforme padrão já adotado no projeto
- Viewport mínima suportada: 390px (iPhone 16)
