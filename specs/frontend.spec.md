# Spec: Personal Finances Frontend

## Objetivo
Interface web para visualização e gerenciamento de despesas do FinBot. Consome a REST API do backend (`telegram-finances`) e usa Supabase Auth para autenticação. Acesso exclusivamente single-user — sem cadastro público; o usuário é criado via seed direto no Supabase.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS
- **Auth:** Supabase Auth (`@supabase/supabase-js`) — email + senha
- **Deploy:** Vercel
- **Linguagem:** TypeScript

## Entradas / Saídas

### Autenticação
- **Entrada:** email + senha na tela de login
- **Saída:** JWT armazenado no cliente (via Supabase SDK); redirecionamento para Dashboard
- **Sem cadastro:** formulário de login sem opção de "criar conta"

### Dashboard
- **Entrada:** nenhuma (carrega mês corrente automaticamente)
- **Saída:** total gasto no mês, breakdown por categoria (cards + gráfico de pizza), número de transações

### Expenses
- **Input:** optional filters (date range, category), creation/edit form
- **Output:** paginated expense table; creation/edit modal; confirmation before deleting

### Relatórios
- **Entrada:** seletor de ano
- **Saída:** gráfico de barras com total por mês; tabela de breakdown por categoria por mês

### Categories
- **Input:** creation form, rename/activate/deactivate actions
- **Output:** category list with status; success/error feedback

## Comportamentos

1. Toda rota exceto `/login` é protegida — usuário não autenticado é redirecionado para `/login`.
2. Após login bem-sucedido, redireciona para `/dashboard`.
3. O JWT do Supabase é enviado em todas as chamadas à API no header `Authorization: Bearer <jwt>`.
4. Erros `401`/`403` da API redirecionam automaticamente para `/login` (token expirado ou inválido).
5. Dashboard carrega o mês corrente por padrão; não há seletor de período nessa tela.
6. Expense table supports pagination (20 items/page) and filters by date range and category.
7. Creating and editing expenses is done via modal (no navigation to a new page).
8. Deleting an expense shows confirmation before calling `DELETE /api/expenses/{id}`.
9. `DELETE /api/categories/{id}` deactivates the category — the button must make it clear it is "deactivate", not "delete".
10. Monthly report displays only months with at least one expense in the selected year.
11. Visual feedback (toast or banner) for all write operations (create, edit, delete).
12. Loading state visible on all asynchronous API calls.

## Casos extremos / Erros

- Login com credenciais inválidas → mensagem de erro abaixo do formulário, sem redirecionar
- API indisponível → mensagem de erro genérica, sem quebrar a página
- Período sem despesas no Dashboard → estado vazio com mensagem amigável
- Período sem despesas no Relatório → apenas os meses com dados são exibidos (comportamento já vem da API)
- `page_size` nunca enviado acima de 100 (frontend não precisa validar — API trunca)
- Categoria com nome duplicado no cadastro → exibir erro vindo do `409` da API

## Critérios de Aceite

- [ ] `/login` redireciona para `/dashboard` após login bem-sucedido
- [ ] Rotas protegidas redirecionam para `/login` se não autenticado
- [ ] Erro 401/403 da API redireciona para `/login`
- [ ] Dashboard exibe total, número de transações e breakdown por categoria do mês corrente
- [ ] Dashboard exibe gráfico de pizza com categorias
- [ ] Expense table paginates correctly (20 per page)
- [ ] Date range filter on expense table works
- [ ] Category filter on expense table works
- [ ] Expense creation modal opens, sends `POST /api/expenses` and refreshes the list
- [ ] Edit modal pre-fills fields with existing data and sends `PUT /api/expenses/{id}`
- [ ] Deleting an expense shows confirmation and calls `DELETE /api/expenses/{id}`
- [ ] Report displays bar chart with monthly totals
- [ ] Year selector on report reloads the data
- [ ] Category list shows only active ones
- [ ] Creating a category with a duplicate name shows an error
- [ ] Deactivate category button shows confirmation and calls `DELETE /api/categories/{id}`
- [ ] Success/error toasts appear after write operations
- [ ] Loading states visible during API calls

## Restrições técnicas

- Next.js 15 com App Router e Server Components onde possível
- Tailwind CSS para toda a estilização — sem bibliotecas de componentes externas (shadcn manual se necessário)
- Supabase Auth via `@supabase/supabase-js` e `@supabase/ssr` para gerenciar sessão com cookies no App Router
- Chamadas à API do backend via `fetch` nativo (Server Components usam fetch no servidor; Client Components usam fetch no cliente com o JWT da sessão)
- Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL`
- Sem opção de cadastro — a rota de signup não deve existir
- O usuário seed deve ser criado via script `scripts/seed-user.ts` que usa a Supabase Admin API
- Deploy na Vercel — `next.config.ts` deve estar pronto para produção
