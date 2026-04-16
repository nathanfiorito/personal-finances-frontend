# Contributing to the new React SPA (`app/`)

This app is being built as a clean-sheet replacement for the Next.js app in `../src/`. Until cut-over both trees coexist in this repo — **everything in `app/` is the new canonical project**; `../src/` is a legacy reference only and must not be imported from here.

## Golden workflow: Storybook-first

Every new component follows the same order:

1. **Story first, code second.** Write the `*.stories.tsx` file using shadcn primitives only (no one-off styling) and verify every state in Storybook:
   - default, hover, focus, active, disabled
   - loading, empty, error
   - mobile (`375px`), tablet (`768px`), desktop (`1440px`)
   - light and dark theme
2. **Review in Storybook.** The component is only wired into a feature page after the user has signed off on the story.
3. **shadcn is the baseline.** Primitives (Button, Input, Dialog…) come from `shadcn/ui` as-is. Composite components (TransactionRow, KpiCard, LoginForm…) are built from those primitives and get their own stories.

## Component rules

- **shadcn primitives only.** New UI building blocks live in `src/components/ui/` and are installed via `npx shadcn@latest add <name>`.
- **Composite components** (those built from primitives) live in `src/components/app/`.
- **Feature components** (page-scoped, tied to a hook or endpoint) live in `src/features/<feature>/`.
- **Responsive is non-negotiable.** If a component can show on a page, it must render well at 375px width.
- **Dark mode is non-negotiable.** If a component uses any color, it must use Tailwind tokens (`bg-background`, `text-foreground`, …) and never raw hex.
- **All identifiers in English.** Business data values (category names, etc.) can remain in the user's language.

## Where to put what

| What | Path |
|---|---|
| shadcn primitive | `src/components/ui/<name>.tsx` |
| Composite app component | `src/components/app/<Name>.tsx` |
| Feature hook (TanStack Query) | `src/features/<feature>/use-<thing>.ts` |
| Feature component | `src/features/<feature>/<Name>.tsx` |
| Page entry | `src/pages/<Name>Page.tsx` |
| Route definition | `src/routes.tsx` |
| API DTO (snake_case) | `src/lib/api/types.ts` |
| Shared utility | `src/lib/utils/<thing>.ts` |
| Story | colocated `<Name>.stories.tsx` next to the component |

## Commands

```bash
npm run dev              # Vite dev server on :3000
npm run storybook        # Storybook on :6006
npm run test             # Vitest unit/component tests
npm run test:e2e         # Playwright end-to-end
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run format           # Prettier --write
```

## PR rules

- Branch: `feature/<description>` or `fix/<description>` off `develop`.
- Never commit to `main` or `develop` directly.
- Stories for new composite components **must merge before** the page PR that uses them.
- Run `npm run lint && npm run typecheck && npm run test && npm run build` locally before opening a PR.
- Mobile + desktop screenshots attached for any visual change.
