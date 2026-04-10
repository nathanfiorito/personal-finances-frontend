# Spec: Income and Outcome

## Objetivo
Suportar tanto receitas quanto despesas no FinBot. Atualmente o sistema registra apenas despesas (`expenses`). Esta feature renomeia a tabela para `transactions`, adiciona o campo `transaction_type` (`income` | `outcome`), e propaga essa distinção pelo fluxo completo: extração via Telegram, API REST e frontend.

## Entradas / Saídas

### Telegram (bot)
- **Entrada:** mensagem de texto, imagem ou PDF enviada pelo usuário
- **Saída:** mensagem de confirmação com o tipo identificado ("Income" ou "Expense") e botões inline para confirmar ou cancelar

### API
- **GET /api/expenses** (passa a ser **/api/transactions**)
  - Entrada: query params existentes + `transaction_type` opcional (`income` | `outcome`)
  - Saída: `{ items: Transaction[], total, page, page_size }` — cada item inclui `transaction_type`

- **POST /api/expenses** (passa a ser **/api/transactions**)
  - Entrada: body existente + `transaction_type: "income" | "outcome"` (obrigatório)
  - Saída: `Transaction` criada (201)

- **PUT /api/expenses/{id}** (passa a ser **/api/transactions/{id}**)
  - Entrada: body existente + `transaction_type` opcional
  - Saída: `Transaction` atualizada

- **GET, DELETE** — sem mudanças além do prefixo de rota

### Banco de dados
- **Entrada:** operações de leitura/escrita na tabela `transactions`
- **Saída:** registros com `transaction_type VARCHAR CHECK IN ('income', 'outcome') DEFAULT 'outcome'`

### Frontend
- **Entrada:** ações do usuário (filtros, criação, edição)
- **Saída:** tabela e dashboard exibindo o tipo de cada transação; totais separados por tipo

## Comportamentos

### Backend — Banco de dados
1. Renomear tabela `expenses` → `transactions` via migration SQL.
2. Adicionar coluna `transaction_type VARCHAR NOT NULL DEFAULT 'outcome' CHECK (transaction_type IN ('income', 'outcome'))`.
3. Registros existentes recebem `transaction_type = 'outcome'` automaticamente pelo `DEFAULT`.

### Backend — Agente extrator (Telegram)
4. O prompt do extrator deve incluir instrução para identificar se o input é uma receita (dinheiro entrando: salário, transferência recebida, reembolso, venda) ou despesa (dinheiro saindo: compra, pagamento, conta).
5. O campo `transaction_type` é adicionado ao schema JSON de resposta do agente (`"income"` ou `"outcome"`).
6. Se não for possível determinar o tipo com confiança, o agente retorna `"outcome"` como padrão.

### Backend — Fluxo de confirmação (Telegram)
7. The confirmation message displays the identified type: "Type: Income" or "Type: Expense".
8. O estado pendente (`models/pending.py`) armazena o `transaction_type` junto com os demais campos.

### Backend — API
9. Todas as rotas `/api/expenses/*` passam a ser `/api/transactions/*`. As rotas antigas retornam `301 Moved Permanently` apontando para as novas (compatibilidade temporária).
10. `GET /api/transactions` aceita o filtro `transaction_type` para retornar apenas receitas ou apenas despesas.
11. `POST /api/transactions` exige `transaction_type`; retorna `422` se ausente ou inválido.
12. `GET /api/reports/summary` e `GET /api/reports/monthly` passam a retornar totais separados por `transaction_type` (ou filtráveis por ele).

### Frontend
13. The transaction table displays a "Type" column with a visual badge differentiating Income (green) from Expense (red).
14. The transaction filter includes a type selector: All | Income | Expenses.
15. The creation/edit modal includes a required "Type" field (select: Income / Expense), defaulting to "Expense".
16. The Dashboard displays separate cards: total income, total expenses, and net balance (income − expenses) for the current month.
17. The monthly report shows income and expenses separated by row or column per month.

## Casos extremos / Erros

- **Agente não identifica o tipo:** assume `"outcome"` por padrão — nunca retorna `null` ou omite o campo.
- **API recebe `transaction_type` inválido** (ex: `"expense"`): retorna `422 Unprocessable Entity`.
- **Frontend recebe registro sem `transaction_type`** (dados legados): tratar como `"outcome"` e não quebrar a renderização.
- **Filtro `transaction_type` com valor inválido na query string:** API retorna `422`.
- **Report with only income or only expenses in the period:** display available totals; the missing value appears as `R$ 0,00`.
- **Frontend responsiveness:** no change should introduce horizontal overflow at 390px; the "Type" column must be visible without scrolling on mobile.

## Critérios de Aceite

- [ ] Tabela `transactions` existe no banco com a coluna `transaction_type` com constraint `CHECK IN ('income', 'outcome')` e `DEFAULT 'outcome'`
- [ ] Registros migrados da tabela `expenses` têm `transaction_type = 'outcome'`
- [ ] Via Telegram, income message (e.g., "Received R$ 500 salary") results in confirmation showing "Type: Income"
- [ ] Via Telegram, ambiguous message results in confirmation showing "Type: Expense" (default)
- [ ] `POST /api/transactions` sem `transaction_type` retorna 422
- [ ] `POST /api/transactions` com `transaction_type: "income"` persiste corretamente
- [ ] `GET /api/transactions?transaction_type=income` returns only income
- [ ] `GET /api/transactions?transaction_type=outcome` returns only expenses
- [ ] Rotas `/api/expenses/*` retornam 301 redirecionando para `/api/transactions/*`
- [ ] Dashboard displays total income, total expenses, and net balance for the month
- [ ] Transaction table displays "Type" column with colored badge
- [ ] Type filter on table works for Income, Expenses, and All
- [ ] Creation modal includes "Type" field defaulting to "Expense"
- [ ] Edit modal displays the current transaction type
- [ ] Monthly report shows income and expenses separated by month
- [ ] Nenhuma página apresenta overflow horizontal em 390px após as mudanças

## Restrições técnicas

### Backend (telegram-finances)
- Python 3.12+ / FastAPI
- Migration SQL via Supabase (renomear tabela + adicionar coluna); sem ORMs — SQL direto
- Manter os nomes de variáveis Python em snake_case: `transaction_type`
- O campo JSON retornado pela API usa snake_case também: `transaction_type` (consistente com os demais campos)
- Routers afetados: `src/routers/expenses.py` → renomear para `src/routers/transactions.py`
- Modelo Pydantic: adicionar `transaction_type: Literal["income", "outcome"] = "outcome"`
- Agente extrator: `src/agents/extractor.py` — adicionar campo ao schema e ao prompt

### Frontend (personal-finances-frontend)
- Next.js 15 (App Router) + Tailwind CSS + TypeScript
- Sem novas bibliotecas externas
- Badge de tipo: usar classes Tailwind (`text-green-600 bg-green-50` para receita; `text-red-600 bg-red-50` para despesa)
- Manter compatibilidade com dark mode (`dark:` prefixes)
- Breakpoint mobile: `md` (768px), viewport mínima: 390px
