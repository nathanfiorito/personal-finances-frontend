# CI/CD Pipeline

## Overview

GitHub Actions CI runs automatically on every `feature/**` branch. When all checks pass on the first push, a PR to `develop` is opened automatically. Subsequent pushes re-run CI via the PR sync event.

Branch strategy: `feature/**` → `develop` → `main`

---

## Workflow

**File:** `.github/workflows/ci.yml`

### Triggers

| Event | Condition |
|---|---|
| `push` to `feature/**` | Runs only if no open PR exists for the branch |
| `pull_request` targeting `develop` or `main` | Runs on every push once a PR is open |

The `preflight` job detects when a `push` fires on a branch that already has an open PR and sets `skip=true`, so CI always runs exactly once per commit — via `pull_request` once the PR exists, via `push` before it does.

### Jobs

```
push (no PR)    → preflight → lint → test → build → auto-pr
push (PR open)  → preflight [skip=true] → (all skipped)
pull_request    → preflight → lint → test → build
```

| Job | Trigger | Purpose |
|---|---|---|
| `preflight` | Always | Checks if push has an open PR; sets `skip` output |
| `lint` | When not skipped | `eslint src/` |
| `test` | When not skipped | `vitest run` |
| `build` | When not skipped | `next build` with placeholder env vars |
| `auto-pr` | Push only, after CI passes | Opens PR to `develop` if one doesn't exist yet |

---

## Developer Workflow

1. Create and push a feature branch:
   ```bash
   git checkout -b feature/my-feature
   git push origin feature/my-feature
   ```

2. CI runs lint + test + build. If all pass, a PR to `develop` is opened automatically with the title derived from the branch name (`feature/` prefix stripped).

3. Every subsequent push to the branch re-runs CI via the PR `synchronize` event. The `push` event is suppressed (preflight detects the existing PR).

4. Merge the PR when ready.

---

## ESLint Configuration

ESLint uses flat config (`eslint.config.mjs`). The config imports `eslint-config-next` directly, which exports a native flat config array since Next.js 16:

```js
import nextConfig from "eslint-config-next";
export default nextConfig;
```

---

## Branch Protection

Import `docs/github-ruleset.json` into the repository to enforce:

- PR required before merging to `develop` and `main`
- `lint`, `test`, and `build` checks must pass
- No force pushes
- No branch deletion

**How to import:**  
GitHub → Settings → Rules → Rulesets → New ruleset → Import ruleset → select `github-ruleset.json`

> **Note:** Branch protection rulesets require the repository to be **public** or the account to be on **GitHub Pro**. On a free private repo, the ruleset file can still serve as documentation of the intended policy.
