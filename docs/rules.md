# Frontend — Rules

## Auth & data fetching

**Do not bypass middleware auth.**
`middleware.ts` guards all routes under `(protected)/`. Do not add `export const config` matchers that skip authenticated routes, and do not remove the session check.

**Do not query Supabase tables directly from the frontend.**
The frontend uses Supabase only for auth (session/JWT). All data (transactions, categories, reports) comes from the FastAPI backend via `serverFetch()`. Never call `supabase.from('transactions').select(...)` in any component or page.

**Do not call `serverFetch()` inside a client component.**
`serverFetch()` uses the Supabase server client which reads cookies — it only works in server components. If a client component needs data, receive it as props from the parent server component.

## Component design

**Default to server components.**
Only add `"use client"` when the component genuinely needs browser APIs (`window`, `document`), React state (`useState`, `useReducer`), or event listeners. Fetching data is not a reason to make a component a client component.

**Do not add mock data to tests.**
Tests must use real data shapes from `src/lib/types.ts`. If a test needs a transaction object, construct it from the `Transaction` interface — don't invent arbitrary shapes.

## Naming & structure

**One component per file, named export matching the filename.**
`TransactionTable.tsx` exports `export function TransactionTable(...)`. No default exports for components.

**Keep components in `src/components/<domain>/`.**
Domain matches the page: `transactions/`, `categories/`, `reports/`, `dashboard/`, `layout/`, `ui/` (shared primitives).
