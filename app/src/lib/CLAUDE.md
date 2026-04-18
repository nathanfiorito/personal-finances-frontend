# CLAUDE.md — app/src/lib/

## Purpose

Cross-feature infrastructure. Anything a feature depends on but does not own.

## Module inventory

| Folder / file | Role |
|---|---|
| `api/client.ts` | `createApiClient()` — wraps `fetch`, injects JWT, normalizes errors into typed `ApiError` |
| `api/endpoints.ts` | Every `/api/v1/*` call. Features import from here, never from `client.ts` directly |
| `api/types.ts` | Wire-level DTOs (snake_case) shared with the backend |
| `auth/auth-context.tsx` | React context — current token, login/logout |
| `auth/token-storage.ts` | `localStorage` under the `pf.auth` key as `{ token, expires_at }` |
| `auth/use-auth.ts` | Hook for components to read auth state |
| `format/format-money.ts` | `big.js` formatting helpers — the **only** place money arithmetic is allowed |
| `format/format-date.ts` | `date-fns` wrappers (ISO in, pt-BR display out) |
| `hooks/use-media-query.ts` | Responsive helper |
| `query/query-client.ts` | TanStack Query client config (stale times, retries) |
| `query/query-keys.ts` | Central query-key factory; features import keys from here |
| `theme/theme-provider.tsx` + `use-theme.ts` | Light/dark mode |
| `utils.ts` | `cn()` helper (shadcn/clsx+tailwind-merge) |
| `bank-registry.ts` | Known Brazilian banks (Itaú, Nubank, etc.) for the card/invoice-import flow |

## Auth flow

1. `LoginForm` submits `{ email, password }`.
2. `AuthProvider.login()` POSTs to `/api/auth/login`.
3. Response `{ token, expires_in }` is stored as `{ token, expires_at }` in `localStorage` under `pf.auth`.
4. `ApiClient` reads the token via `getToken()` and sends it as `Authorization: Bearer <token>` on every `/api/v1/*` request.
5. On 401, the client calls `onUnauthorized` → `AuthProvider` clears the token and routes to `/login?next=<current>`.

## API conventions

All `/api/v1/*` traffic uses **snake_case** on the wire. Amounts are **strings** (BigDecimal precision) — always route arithmetic through `big.js` via `format/format-money`. Dates are ISO 8601. Error envelopes are normalized by `ApiClient` into `ApiError { status, code, message, details }`.

See `docs/api-conventions.md` for the full endpoint map shared with the backend.

## Rules

- **Money = `big.js`.** Coercing a wire amount to JavaScript `Number` loses precision. Always go through `format-money`.
- **One API surface.** Features call `api/endpoints`, never `fetch` directly, never `api/client` directly.
- **Query keys in one place.** A new query registers its key in `query/query-keys.ts`.

## When to update this file

- New module under `lib/` → add a row to the Module inventory.

## Pointers

- Consumers: `../features/CLAUDE.md`.
- UI primitives (shadcn + composites): `../components/CLAUDE.md`.
