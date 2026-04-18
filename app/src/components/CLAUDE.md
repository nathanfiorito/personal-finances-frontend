# CLAUDE.md — app/src/components/

## Purpose

Shared UI that is not feature-specific. Split into primitives (`ui/`) and layout chrome (`layout/`).

## Folders

```
components/
├── ui/       shadcn/ui primitives + generic composites (Combobox, DatePicker, Pagination, etc.)
└── layout/   AppShell and layout-only components
```

## `ui/` conventions

- **shadcn first.** Before writing a new primitive, check `npx shadcn@latest add <name>` and the shadcn registry. `components.json` at `app/components.json` pins the style, radius, and alias paths.
- **Composites live here too.** `Combobox`, `DatePicker`, `Pagination`, and similar non-shadcn primitives that are reused across features belong in `ui/`, not in a feature.
- **Stories colocated.** Every primitive ships with `<name>.stories.tsx` next to it. Run `npm run storybook` to see them.
- **Tailwind 4** via `@tailwindcss/vite`. The brand palette and shadcn tokens live in `src/index.css`.
- Use `cn()` from `lib/utils.ts` for conditional class names.

## `layout/` conventions

- Just `AppShell.tsx` today — the app frame (header, sidebar, main).
- Additions here should be layout chrome only. Feature-specific layouts belong inside the feature.

## Storybook-first rule

Same as features: build in Storybook, get user approval, then consume in a page or feature. See `../features/CLAUDE.md`.

## When to update this file

- New shadcn primitive added → no update needed (the component speaks for itself).
- New non-shadcn composite in `ui/` → mention it in the "`ui/` conventions" list so future Claude knows it exists as a primitive.

## Pointers

- Features that consume these components: `../features/CLAUDE.md`.
- `cn()` helper and other cross-cutting utilities: `../lib/CLAUDE.md`.
