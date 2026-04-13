# personal-finances-frontend

Next.js web dashboard for viewing and managing personal expenses. Connects to the FastAPI backend via REST API with Supabase JWT auth.

## Stack

| Component | Technology |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Auth | Supabase Auth (SSR) |

## Setup

```bash
npm install
cp .env.example .env.local
```

## Running

```bash
npm run dev    # dev server
npm run build  # production build
```

## Testing & Linting

```bash
npm run test       # Vitest
npm run test:watch # Vitest watch
npm run lint       # ESLint
```

## Seed

```bash
npm run seed  # create the Supabase auth user
```

## Documentation

Full documentation lives in [`personal-finances-doc/`](../personal-finances-doc/):

- [Architecture](../personal-finances-doc/content/architecture/frontend.md) — pages, auth flow, component patterns
- [API Reference](../personal-finances-doc/content/api-reference/) — REST endpoints consumed by this app
- [Roadmap](../personal-finances-doc/content/roadmap/) — milestones and future plans
