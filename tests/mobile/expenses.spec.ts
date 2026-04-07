/**
 * AC: A tabela de despesas é legível e utilizável em mobile
 * AC: Textos longos são truncados com ellipsis e não quebram o layout
 * AC: Filtros, formulários e modais são utilizáveis com toque (campos com tamanho adequado)
 */
import { test, expect } from "@playwright/test";

const MIN_TOUCH_TARGET_PX = 44;

test.beforeEach(async ({ page }) => {
  await page.goto("/expenses");
  await page.waitForLoadState("networkidle");
});

// ─── Tabela de despesas ────────────────────────────────────────────────────────

test("tabela de despesas — não causa overflow horizontal", async ({ page }) => {
  const tableWrapper = page.locator(".overflow-x-auto").first();
  if (await tableWrapper.isVisible()) {
    const box = await tableWrapper.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(390);
  }
});

test("tabela de despesas — ações (editar/excluir) estão acessíveis sem scroll", async ({
  page,
}) => {
  // If expenses exist, action buttons should be visible within the viewport width
  const editBtn = page.getByRole("button", { name: /editar/i }).first();
  const deleteBtn = page.getByRole("button", { name: /excluir/i }).first();

  if (await editBtn.isVisible()) {
    const editBox = await editBtn.boundingBox();
    expect(editBox?.x).toBeLessThan(390); // button starts within viewport
  }

  if (await deleteBtn.isVisible()) {
    const deleteBox = await deleteBtn.boundingBox();
    expect(deleteBox?.x).toBeLessThan(390);
  }
});

// ─── Textos longos ─────────────────────────────────────────────────────────────

test("nomes de estabelecimento longos são truncados e não causam overflow", async ({
  page,
}) => {
  const truncatedCells = page.locator(".truncate");
  const count = await truncatedCells.count();

  for (let i = 0; i < count; i++) {
    const cell = truncatedCells.nth(i);
    const overflow = await cell.evaluate((el) => {
      return el.scrollWidth > el.clientWidth + 1; // +1 for rounding tolerance
    });
    // The element may or may not overflow depending on content, but the container must not
    const parentOverflow = await cell.evaluate((el) => {
      const parent = el.parentElement;
      return parent ? parent.scrollWidth > parent.clientWidth + 1 : false;
    });
    expect(parentOverflow).toBe(false);
  }
});

// ─── Filtros ───────────────────────────────────────────────────────────────────

test("filtros — campos de data têm altura mínima para toque", async ({
  page,
}) => {
  const dateInputs = page.locator('input[type="date"]');
  const count = await dateInputs.count();

  for (let i = 0; i < count; i++) {
    const box = await dateInputs.nth(i).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  }
});

test("filtros — select de categoria tem altura mínima para toque", async ({
  page,
}) => {
  const selects = page.locator("select");
  const count = await selects.count();

  for (let i = 0; i < count; i++) {
    const box = await selects.nth(i).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  }
});

test("filtros — não causam overflow horizontal", async ({ page }) => {
  const filtersContainer = page.locator(".flex.flex-wrap").first();
  if (await filtersContainer.isVisible()) {
    const overflow = await filtersContainer.evaluate(
      (el) => el.scrollWidth > el.clientWidth + 1
    );
    expect(overflow).toBe(false);
  }
});

test("botão 'Nova despesa' está acessível em mobile", async ({ page }) => {
  const newBtn = page.getByRole("button", { name: /nova despesa/i });
  await expect(newBtn).toBeVisible();
  const box = await newBtn.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
});

// ─── Modal de despesa ──────────────────────────────────────────────────────────

test("modal 'Nova despesa' — não ultrapassa os limites da tela", async ({
  page,
}) => {
  await page.getByRole("button", { name: /nova despesa/i }).click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  const box = await modal.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(390);
  expect(box?.x).toBeGreaterThanOrEqual(0);
});

test("modal 'Nova despesa' — campos do formulário têm altura mínima para toque", async ({
  page,
}) => {
  await page.getByRole("button", { name: /nova despesa/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const inputs = page.getByRole("dialog").locator("input, select");
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    const box = await inputs.nth(i).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(MIN_TOUCH_TARGET_PX);
  }
});

test("modal 'Nova despesa' — grid de 2 colunas não causa overflow em mobile", async ({
  page,
}) => {
  await page.getByRole("button", { name: /nova despesa/i }).click();
  await expect(page.getByRole("dialog")).toBeVisible();

  const hasOverflow = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return dialog ? dialog.scrollWidth > dialog.clientWidth + 1 : false;
  });
  expect(hasOverflow).toBe(false);
});
