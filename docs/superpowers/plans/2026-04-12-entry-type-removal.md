# Entry Type Removal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the "Entry type" Select from the expense create/edit modal; auto-set `entry_type` to `"manual"` for all REST API-created expenses so they are distinguishable from bot-created entries.

**Architecture:** Frontend-only change. The backend already accepts any string for `entry_type` in `TransactionCreate`. The field remains in `ExpenseInput` and is sent to the backend — it just is not user-editable. No backend changes needed.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest

---

## Files

| Action | Path |
|---|---|
| Modify | `personal-finances-frontend/src/components/expenses/ExpenseModal.tsx` |
| Modify | `personal-finances-frontend/src/test/ExpenseModal.test.tsx` |

---

### Task 1: Remove Entry type field from modal

**Files:**
- Modify: `personal-finances-frontend/src/components/expenses/ExpenseModal.tsx`
- Test: `personal-finances-frontend/src/test/ExpenseModal.test.tsx`

- [ ] **Step 1: Write a failing test confirming the field is gone**

Add a new describe block in `src/test/ExpenseModal.test.tsx`:

```typescript
describe("ExpenseModal — entry_type field", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render an Entry type select", () => {
    renderModal();
    expect(screen.queryByLabelText("Entry type")).not.toBeInTheDocument();
  });

  it("sends entry_type as 'manual' in the create payload", async () => {
    const { createExpense } = await import("@/lib/api");
    renderModal();
    fireEvent.change(screen.getByLabelText("Amount (R$)"), { target: { value: "50" } });
    fireEvent.submit(screen.getByRole("dialog").querySelector("form")!);
    await waitFor(() => {
      expect(createExpense).toHaveBeenCalledWith(
        expect.objectContaining({ entry_type: "manual" })
      );
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd personal-finances-frontend
npm run test -- --run ExpenseModal
```

Expected: `FAILED` — "Entry type" select still renders and `entry_type` defaults to `"text"`.

- [ ] **Step 3: Update ExpenseModal.tsx**

Make the following changes to `src/components/expenses/ExpenseModal.tsx`:

**Remove** the `TIPO_OPTIONS` constant (lines 18–22):
```typescript
// DELETE this block:
const TIPO_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "image", label: "Image" },
  { value: "pdf", label: "PDF" },
];
```

**Update** `DEFAULT_FORM` — change `entry_type` from `"text"` to `"manual"`:
```typescript
const DEFAULT_FORM: ExpenseInput = {
  amount: 0,
  date: new Date().toISOString().split("T")[0],
  establishment: "",
  description: "",
  category_id: undefined,
  entry_type: "manual",
  transaction_type: "outcome",
};
```

**Update** `validate()` — remove the `entry_type` check:
```typescript
const validate = (): boolean => {
  const errs: Partial<Record<keyof ExpenseInput, string>> = {};
  if (!form.amount || form.amount <= 0) errs.amount = "Enter an amount greater than zero";
  if (!form.date) errs.date = "Enter the date";
  setErrors(errs);
  return Object.keys(errs).length === 0;
};
```

**Remove** the Entry type `<Select>` element from the JSX (the standalone `<Select label="Entry type" ...>` block at the bottom of the form, just above the submit buttons).

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd personal-finances-frontend
npm run test -- --run ExpenseModal
```

Expected: all tests pass.

- [ ] **Step 5: Lint**

```bash
cd personal-finances-frontend
npm run lint
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
cd personal-finances-frontend
git add src/components/expenses/ExpenseModal.tsx src/test/ExpenseModal.test.tsx
git commit -m "feat: remove entry_type field from modal, auto-set to 'manual' for REST entries"
```
