# personal-finances-frontend

React SPA for the Personal Finances project. Dashboard, transactions,
categories, reports, credit cards, and invoice import — all pulling from
the Java backend REST API.

The application source lives inside [`app/`](./app) so the repo root stays
clean for meta files (CI, docs, readme). Run every npm command from inside
`app/`.

## Stack

Vite 8 · React 19 · TypeScript · React Router 7 · TanStack Query 5 ·
Tailwind CSS 4 · shadcn/ui · react-hook-form + zod · recharts · big.js ·
Vitest · Playwright · Storybook 10

## Quick start

```bash
cd app
npm install
cp .env.example .env.local    # set VITE_API_BASE_URL
npm run dev                   # http://localhost:3000
```

Log in with the admin credentials configured on the backend (see
`personal-finances-backend/CLAUDE.md`).

## Scripts (run inside `app/`)

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (port 3000) |
| `npm run build` | Type-check and build to `app/dist/` |
| `npm run preview` | Serve the built app on port 4173 |
| `npm run lint` | ESLint (flat config) |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run test` | Vitest (unit + component) |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:e2e` | Playwright against the dev server |
| `npm run storybook` | Storybook dev server (port 6006) |
| `npm run build-storybook` | Static Storybook |
| `npm run format` | Prettier --write |

## Repository layout

```
personal-finances-frontend/
├── .github/workflows/ci.yml   # CI jobs, all run inside app/
├── docs/                      # Project docs (contributing, api conventions)
├── CLAUDE.md                  # Guidance for Claude Code
├── README.md                  # This file
└── app/                       # Vite React SPA (run npm here)
```

See `CLAUDE.md` for the full folder-by-folder breakdown and `docs/CONTRIBUTING.md`
for the Storybook-first workflow.

## Environment

Single variable: `VITE_API_BASE_URL`, pointing at the backend. In production
this is set per environment in the Vercel project settings.

## Deployment

Vercel, framework preset **Vite**, **Root Directory set to `app`**. The
included `app/vercel.json` adds the SPA rewrite (`/(.*) → /index.html`) so
client-side routes survive direct loads and refreshes.
