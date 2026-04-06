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

### Despesas
- **Entrada:** filtros opcionais (período, categoria), formulário de criação/edição
- **Saída:** tabela paginada de despesas; modal de criação/edição; confirmação antes de excluir

### Relatórios
- **Entrada:** seletor de ano
- **Saída:** gráfico de barras com total por mês; tabela de breakdown por categoria por mês

### Categorias
- **Entrada:** formulário de criação, ações de renomear/ativar/desativar
- **Saída:** lista de categorias com status; feedback de sucesso/erro

## Comportamentos

1. Toda rota exceto `/login` é protegida — usuário não autenticado é redirecionado para `/login`.
2. Após login bem-sucedido, redireciona para `/dashboard`.
3. O JWT do Supabase é enviado em todas as chamadas à API no header `Authorization: Bearer <jwt>`.
4. Erros `401`/`403` da API redirecionam automaticamente para `/login` (token expirado ou inválido).
5. Dashboard carrega o mês corrente por padrão; não há seletor de período nessa tela.
6. Tabela de despesas suporta paginação (20 itens/página) e filtros por período e categoria.
7. Criação e edição de despesas são feitas via modal (sem navegação para nova página).
8. Exclusão de despesa exibe confirmação antes de chamar `DELETE /api/expenses/{id}`.
9. `DELETE /api/categories/{id}` desativa a categoria — o botão deve deixar claro que é "desativar", não "excluir".
10. Relatório mensal exibe apenas os meses com ao menos uma despesa no ano selecionado.
11. Feedback visual (toast ou banner) para todas as operações de escrita (criar, editar, excluir).
12. Estado de loading visível em todas as chamadas assíncronas.

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
- [ ] Tabela de despesas pagina corretamente (20 por página)
- [ ] Filtro por período na tabela de despesas funciona
- [ ] Filtro por categoria na tabela de despesas funciona
- [ ] Modal de criação de despesa abre, envia `POST /api/expenses` e atualiza a lista
- [ ] Modal de edição preenche os campos com dados existentes e envia `PUT /api/expenses/{id}`
- [ ] Exclusão de despesa exibe confirmação e chama `DELETE /api/expenses/{id}`
- [ ] Relatório exibe gráfico de barras com total mensal
- [ ] Seletor de ano no relatório recarrega os dados
- [ ] Lista de categorias mostra apenas as ativas
- [ ] Criação de categoria com nome duplicado exibe erro
- [ ] Botão de desativar categoria exibe confirmação e chama `DELETE /api/categories/{id}`
- [ ] Toasts de sucesso/erro aparecem após operações de escrita
- [ ] Loading states visíveis durante chamadas à API

## Restrições técnicas

- Next.js 15 com App Router e Server Components onde possível
- Tailwind CSS para toda a estilização — sem bibliotecas de componentes externas (shadcn manual se necessário)
- Supabase Auth via `@supabase/supabase-js` e `@supabase/ssr` para gerenciar sessão com cookies no App Router
- Chamadas à API do backend via `fetch` nativo (Server Components usam fetch no servidor; Client Components usam fetch no cliente com o JWT da sessão)
- Variáveis de ambiente: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL`
- Sem opção de cadastro — a rota de signup não deve existir
- O usuário seed deve ser criado via script `scripts/seed-user.ts` que usa a Supabase Admin API
- Deploy na Vercel — `next.config.ts` deve estar pronto para produção
