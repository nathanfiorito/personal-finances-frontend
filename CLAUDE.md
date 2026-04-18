# CLAUDE.md — personal-finances-frontend

This file provides guidance to Claude Code when working in this repository.

**Always read the CLAUDE.md inside the layer you are editing.**

## Project Overview

React SPA dashboard for the Personal Finances system. Shows transactions, categories, cards, invoices, dashboard, and reports. All data comes from the Java backend REST API at `/api/v1/*` via JWT-authenticated fetch calls.

## Layout

```
personal-finances-frontend/
├── .github/workflows/ci.yml     CI jobs (all run inside app/)
├── docs/                        api-conventions.md, CONTRIBUTING.md
├── CLAUDE.md                    this file
├── README.md
└── app/                         Vite React SPA — run every npm command here
    ├── src/                     features / lib / components / pages / routes / config / test
    ├── public/
    ├── .storybook/
    ├── package.json
    ├── vite.config.ts
    ├── components.json          shadcn
    └── vercel.json              SPA rewrite
```

The unusual root/`app/` split keeps the repo root clean for CI and meta. Treat `app/` as the project root for every command.

## Stack

Vite 8 · React 19 · TypeScript · React Router 7 · TanStack Query 5 · Tailwind CSS 4 · shadcn/ui · react-hook-form + zod · recharts · big.js · Vitest · Playwright · Storybook.

Hosting: Vercel with root directory set to `app/`. Auth: backend-native JWT via `POST /api/auth/login`, stored in `localStorage` under `pf.auth`.

## Commands

**Always `cd app` first.**

```bash
cd app
npm install
cp .env.example .env.local        # set VITE_API_BASE_URL
npm run dev                       # port 3000
npm run build                     # tsc -b && vite build → app/dist/
npm run preview                   # port 4173
npm run lint
npm run typecheck
npm run test                      # Vitest (unit + component)
npm run test:watch
npm run test:e2e                  # Playwright
npm run storybook                 # port 6006
npm run build-storybook
npm run format                    # Prettier
```

## Layer routing — read the CLAUDE.md inside the layer you are editing

- `app/src/features/` — end-user concerns (auth, cards, categories, dashboard, invoice-import, reports, transactions). See `app/src/features/CLAUDE.md`.
- `app/src/lib/` — API client, auth, query, format, theme, bank registry. See `app/src/lib/CLAUDE.md`.
- `app/src/components/` — shadcn primitives and layout chrome. See `app/src/components/CLAUDE.md`.

`app/src/pages/` (one file per route), `app/src/routes/` (ProtectedRoute, PublicRoute), `app/src/config/env.ts`, and `app/src/test/` are small and stay covered by this file.

## Storybook-first workflow

Every new component, feature, or page must be designed in Storybook first and submitted for approval before being wired into the app. Detail: `app/src/features/CLAUDE.md` and `docs/CONTRIBUTING.md`.

## Environment Variables

- `VITE_API_BASE_URL` — defaults to `http://localhost:8080`. Set per environment in Vercel for production.

## Testing Standards

- Every change ships with unit **and** integration tests (Vitest + Testing Library for unit/component; Playwright for e2e). Coverage ≥ **80%**, via `npm run test -- --coverage`.

## Git workflow

Branch (`feature/*`, `fix/*`, `chore/*`) off `develop`. Never commit directly to `main` or `develop`. PRs to `develop`; `develop` → `main` for releases.
