# CLAUDE.md — personal-finances-frontend

This file provides guidance to Claude Code when working in this repository.

## Project Overview

React SPA web dashboard for the personal finances system. Shows transactions,
categories, reports, and the spend dashboard. All data comes from the Java
backend REST API at `/api/v1/*` via JWT-authenticated fetch calls.

## Stack

- **Framework:** Vite 8 + React 19 + TypeScript (SPA, no SSR)
- **Router:** React Router 7 (`createBrowserRouter`)
- **Data fetching:** TanStack Query 5
- **Forms:** react-hook-form + zod
- **Styling:** Tailwind CSS 4 (via `@tailwindcss/vite`) + shadcn/ui primitives
- **Icons:** lucide-react
- **Charts:** recharts
- **Money arithmetic:** big.js (never coerce amounts to `Number`)
- **Testing:** Vitest 4 + Testing Library (unit / component), Playwright (e2e)
- **Stories:** Storybook 10.3 (react-vite framework)
- **Hosting:** Vercel
- **Auth:** Backend-native JWT via `POST /api/auth/login`, stored in
  `localStorage` under `pf.auth`

## Commands

```bash
npm install
cp .env.example .env.local          # set VITE_API_BASE_URL

npm run dev                          # Vite dev server, port 3000
npm run build                        # tsc -b && vite build → dist/
npm run preview                      # vite preview on port 4173
npm run lint                         # ESLint (flat config)
npm run typecheck                    # tsc -b --noEmit
npm run test                         # Vitest (unit + component)
npm run test:watch                   # Vitest watch mode
npm run test:e2e                     # Playwright
npm run storybook                    # Storybook dev on port 6006
npm run build-storybook              # Static Storybook build
npm run format                       # Prettier --write
```

## Folder Structure

```
src/
├── main.tsx                 # Vite entry
├── App.tsx                  # Providers + <RouterProvider>
├── routes.tsx               # BrowserRouter tree
├── index.css                # Tailwind v4 + brand palette + shadcn tokens
├── components/
│   ├── ui/                  # shadcn primitives + generic composites (Combobox, DatePicker, Pagination)
│   └── layout/              # AppShell
├── features/
│   ├── auth/                # LoginForm, login-schema
│   ├── categories/          # useCategories, CategoryCombobox, CategoryList, CategoryForm
│   ├── dashboard/           # KpiCard, PeriodPicker, RecentTransactionsList, SpendByCategoryChart, hooks
│   ├── transactions/        # TransactionsList, TransactionForm, AmountInput, hooks
│   └── reports/             # MonthlyBarChart, YearPicker, use-monthly-report
├── pages/                   # One file per route (LoginPage, DashboardPage, ...)
├── routes/                  # ProtectedRoute, PublicRoute
├── lib/
│   ├── api/                 # client.ts (createApiClient), endpoints.ts, types.ts (snake_case DTOs)
│   ├── auth/                # auth-context, token-storage, use-auth
│   ├── query/               # query-client, query-keys
│   ├── theme/               # theme-provider, use-theme
│   ├── format/              # format-money (big.js), format-date (date-fns)
│   ├── hooks/               # use-media-query
│   └── utils.ts             # cn() helper
├── config/                  # env.ts
└── test/                    # setup, test-utils
```

## Auth Flow

1. User submits `LoginForm`.
2. `AuthProvider.login()` POSTs to `/api/auth/login`.
3. Response `{ token, expiresIn }` is stored as
   `{ token, expires_at }` in `localStorage` under `pf.auth`.
4. `ApiClient` reads the token via `getToken()` and sends it as
   `Authorization: Bearer <token>` on every `/api/v1/*` request.
5. On 401, the client calls `onUnauthorized` → `AuthProvider` clears the
   token and routes to `/login?next=<current>`.

## API Conventions

All `/api/v1/*` traffic uses snake_case on the wire. Amounts are strings
(BigDecimal precision) — always route arithmetic through `big.js`. Dates are
ISO 8601. Response error envelopes are normalized by `ApiClient` into a typed
`ApiError { status, code, message, details }`.

See `docs/api-conventions.md` for the full endpoint map.

## Storybook-First Workflow

Every new feature/composite component ships with a `*.stories.tsx`
colocated next to it. See `docs/CONTRIBUTING.md` for the review workflow
(story first → review in Storybook → wire into a page).

## Environment Variables

See `.env.example`. Only one:

- `VITE_API_BASE_URL` — backend base URL (default `http://localhost:8080`)

## Git workflow

- Branch: `feature/<name>`, `fix/<name>`, `chore/<name>` off `develop`.
- Never commit directly to `main` or `develop`.
- PRs to `develop`; `develop` → `main` for releases.
