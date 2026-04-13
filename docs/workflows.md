# Frontend — Workflows

## Run the dev server locally

```bash
npm run dev
# App available at http://localhost:3000
```

Requires `.env.local` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_API_BASE_URL` pointing to the running backend.

## Run unit tests

```bash
npm run test          # single run
npm run test:watch    # watch mode
```

Unit tests live in `src/test/` and use Vitest.

## Run e2e tests

```bash
npm run test:e2e
# Results in playwright-report/
```

Playwright tests live in `e2e/` and `tests/`. Requires the dev server running.

## Add a new page

1. Create `src/app/(protected)/<route>/page.tsx` as an async server component.
2. Fetch data with `serverFetch()`.
3. Create supporting components in `src/components/<domain>/`.
4. Add the route to the sidebar in `src/components/layout/Sidebar.tsx`.

## Add a new API call

1. Check `src/lib/types.ts` — add a new interface for the response shape if needed.
2. In a server component: call `serverFetch<YourType>("/api/v2/<endpoint>")`.
3. In a client component that needs to mutate: use `fetch` directly with the token from a custom hook, or move the mutation to a server action.

## Deploy to Vercel

Vercel deploys automatically on push to `main`. To deploy manually:

```bash
vercel --prod
```

Check environment variables in the Vercel dashboard match `.env.local`.
