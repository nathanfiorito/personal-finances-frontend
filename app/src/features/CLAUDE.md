# CLAUDE.md — app/src/features/

## Purpose

Feature folders. One folder per end-user concern. Each feature colocates its components, hooks, schemas, and stories.

## Current features

| Folder | What it contains |
|---|---|
| `auth/` | `LoginForm`, `login-schema` |
| `categories/` | `useCategories`, `CategoryCombobox`, `CategoryList`, `CategoryForm` |
| `dashboard/` | `KpiCard`, `PeriodPicker`, `RecentTransactionsList`, `SpendByCategoryChart`, dashboard hooks |
| `transactions/` | `TransactionsList`, `TransactionForm`, `AmountInput`, transaction hooks |
| `reports/` | `MonthlyBarChart`, `YearPicker`, `use-monthly-report` |
| `cards/` | `CardCarousel`, `CardForm`, `CardCombobox`, `BankCombobox`, `CreditCardVisual`, `InvoiceChart`, `InvoiceKpiRow`, `InvoiceTransactionList`, `card-schema`, hooks: `use-cards`, `use-card-mutations`, `use-invoice`, `use-invoice-prediction`, `use-invoice-timeline` |
| `invoice-import/` | `InvoiceDropzone`, `InvoicePreviewTable`, `InvoiceImportView`, `page-state`, `types`, `use-invoice-import`, plus `*.stories.tsx` and `*.test.tsx` siblings |

## Feature folder shape

- `*.tsx` — React components, PascalCase files.
- `*-schema.ts` — zod validation schemas for forms.
- `use-*.ts` / `use-*.tsx` — hooks (TanStack Query wrappers, local state machines).
- `*.stories.tsx` — Storybook stories colocated next to the component.
- `*.test.tsx` / `*.test.ts` — Vitest + Testing Library unit/component tests.
- `page-state.ts` — state helpers for multi-step flows (see `invoice-import/`).
- `types.ts` — feature-local TypeScript types.

## Storybook-first rule

Every new component, feature, or page **must** be designed in Storybook first and submitted to the user for approval before being wired into the app. Workflow:

1. Build the component and its `*.stories.tsx` inside the feature folder.
2. Run `npm run storybook` (port 6006).
3. Share the story with the user.
4. Only after explicit approval, integrate the component into a route/page.

See `docs/CONTRIBUTING.md` for the detailed review workflow.

## Conventions

- API calls go through `lib/api/endpoints.ts` — not directly from features.
- Money: **never** coerce amounts to `Number`. Use `big.js` via `lib/format/format-money`.
- Forms: `react-hook-form` + `zod`. Schemas live inside the feature folder.
- Data fetching: TanStack Query. Query keys live in `lib/query/query-keys.ts`.

## When to update this file

- New feature folder → add it to the Current features table.
- Removed feature → strike the row.

## Pointers

- Shared primitives and composites: `../components/CLAUDE.md`.
- API client, query config, money/date helpers: `../lib/CLAUDE.md`.
