# Spec: Income and Outcome

## Objetivo
Suportar tanto receitas quanto despesas no FinBot. Atualmente o sistema registra apenas despesas (`expenses`). Esta feature renomeia a tabela para `transactions`, adiciona o campo `transaction_type` (`income` | `outcome`), e propaga essa distinção pelo fluxo completo: extração via Telegram, API REST e frontend.

## Entradas / Saídas

### Telegram (bot)
- **Entrada:** mensagem de texto, imagem ou PDF enviada pelo usuário
- **Saída:** mensagem de confirmação com o tipo identificado ("Receita" ou "Despesa") e botões inline para confirmar ou cancelar

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
7. A mensagem de confirmação exibe o tipo identificado: "Tipo: Receita" ou "Tipo: Despesa".
8. O estado pendente (`models/pending.py`) armazena o `transaction_type` junto com os demais campos.

### Backend — API
9. Todas as rotas `/api/expenses/*` passam a ser `/api/transactions/*`. As rotas antigas retornam `301 Moved Permanently` apontando para as novas (compatibilidade temporária).
10. `GET /api/transactions` aceita o filtro `transaction_type` para retornar apenas receitas ou apenas despesas.
11. `POST /api/transactions` exige `transaction_type`; retorna `422` se ausente ou inválido.
12. `GET /api/reports/summary` e `GET /api/reports/monthly` passam a retornar totais separados por `transaction_type` (ou filtráveis por ele).

### Frontend
13. A tabela de transações exibe uma coluna "Tipo" com badge visual diferenciando Receita (verde) de Despesa (vermelho).
14. O filtro de transações inclui um seletor de tipo: Todos | Receitas | Despesas.
15. O modal de criação/edição inclui campo obrigatório "Tipo" (select: Receita / Despesa), com padrão "Despesa".
16. O Dashboard exibe cards separados: total de receitas, total de despesas e saldo líquido (receitas − despesas) do mês corrente.
17. O relatório mensal exibe receitas e despesas separadas por linha ou coluna por mês.

## Casos extremos / Erros

- **Agente não identifica o tipo:** assume `"outcome"` por padrão — nunca retorna `null` ou omite o campo.
- **API recebe `transaction_type` inválido** (ex: `"expense"`): retorna `422 Unprocessable Entity`.
- **Frontend recebe registro sem `transaction_type`** (dados legados): tratar como `"outcome"` e não quebrar a renderização.
- **Filtro `transaction_type` com valor inválido na query string:** API retorna `422`.
- **Relatório com apenas receitas ou apenas despesas no período:** exibir os totais disponíveis; o valor ausente aparece como `R$ 0,00`.
- **Responsividade frontend:** nenhuma alteração deve introduzir overflow horizontal em 390px; a coluna "Tipo" deve ser visível sem scroll em mobile.

## Critérios de Aceite

- [ ] Tabela `transactions` existe no banco com a coluna `transaction_type` com constraint `CHECK IN ('income', 'outcome')` e `DEFAULT 'outcome'`
- [ ] Registros migrados da tabela `expenses` têm `transaction_type = 'outcome'`
- [ ] Via Telegram, mensagem de receita (ex: "Recebi R$ 500 de salário") resulta em confirmação com "Tipo: Receita"
- [ ] Via Telegram, mensagem ambígua resulta em confirmação com "Tipo: Despesa" (padrão)
- [ ] `POST /api/transactions` sem `transaction_type` retorna 422
- [ ] `POST /api/transactions` com `transaction_type: "income"` persiste corretamente
- [ ] `GET /api/transactions?transaction_type=income` retorna apenas receitas
- [ ] `GET /api/transactions?transaction_type=outcome` retorna apenas despesas
- [ ] Rotas `/api/expenses/*` retornam 301 redirecionando para `/api/transactions/*`
- [ ] Dashboard exibe total de receitas, total de despesas e saldo líquido do mês
- [ ] Tabela de transações exibe coluna "Tipo" com badge colorido
- [ ] Filtro por tipo na tabela funciona para Receitas, Despesas e Todos
- [ ] Modal de criação inclui campo "Tipo" com padrão "Despesa"
- [ ] Modal de edição exibe o tipo atual da transação
- [ ] Relatório mensal mostra receitas e despesas separadas por mês
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
