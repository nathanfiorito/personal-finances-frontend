# CLAUDE.md — personal-finances-frontend

This file provides guidance to Claude Code when working in this repository.

**Always read `docs/patterns.md`, `docs/workflows.md`, and `docs/rules.md` before making changes.**

## Project Overview

Next.js web dashboard for the personal finances system. Displays transactions, categories, and reports. Reads data from the FastAPI backend via JWT-authenticated API calls.

## Stack

- **Framework:** Next.js 14 App Router (TypeScript)
- **Styling:** Tailwind CSS
- **Auth:** Supabase SSR (`@supabase/ssr`) — session managed via cookies, validated in middleware
- **API calls:** `serverFetch()` utility (`src/lib/api/server.ts`) — adds JWT from Supabase session to every backend request
- **Testing:** Vitest (unit), Playwright (e2e)
- **Hosting:** Vercel
- **Observability:** OpenTelemetry via `@vercel/otel`

## Commands

```bash
npm install
cp .env.local.example .env.local

npm run dev          # start dev server on http://localhost:3000
npm run build        # production build
npm run lint         # eslint src/
npm run test         # vitest run (unit tests)
npm run test:watch   # vitest watch mode
npm run test:e2e     # playwright e2e tests
npm run seed         # create the single Supabase user (run once)
```

## Folder Structure

```
src/
├── app/
│   ├── (auth)/          — login page (public)
│   └── (protected)/     — all authenticated pages
│       ├── layout.tsx   — shared layout with sidebar
│       ├── dashboard/
│       ├── transactions/
│       ├── categories/
│       └── reports/
├── components/
│   ├── dashboard/       — dashboard-specific components
│   ├── transactions/    — TransactionTable, TransactionFilters, TransactionModal
│   ├── categories/      — category list and form components
│   ├── reports/         — chart and report components
│   ├── layout/          — Sidebar, Header, navigation
│   └── ui/              — shared primitives (Spinner, Button, etc.)
├── hooks/               — custom React hooks
└── lib/
    ├── api/
    │   └── server.ts    — serverFetch() utility (server-side JWT fetch)
    ├── supabase/        — Supabase client factories (server + client)
    ├── types.ts         — shared TypeScript types (Transaction, Category, etc.)
    └── utils.ts         — formatting helpers
```

## Auth Flow

1. `middleware.ts` runs on every request (except static assets).
2. It reads the Supabase session from cookies.
3. If no session → redirect to `/login`.
4. All pages inside `(protected)/` are server components that call `serverFetch()`.
5. `serverFetch()` reads the JWT from the active Supabase session and sends it as `Authorization: Bearer <token>` to the backend.

## Key Design Decisions

- **App Router only:** All pages are server components by default. Mark with `"use client"` only when you need browser APIs, state, or event handlers.
- **No direct Supabase queries from pages:** All data comes from the FastAPI backend via `serverFetch()`. The frontend never queries Supabase tables directly — Supabase is used only for auth.
- **BFF pattern:** The backend exposes `/api/v2/bff/` endpoints that aggregate multiple queries into a single response (e.g., `bff/expenses` returns transactions + categories together).

## Environment Variables

See `.env.local.example`. Key vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_BASE_URL` (backend URL).
