/**
 * AC: Todas as páginas renderizam sem overflow horizontal em 390px de largura
 * AC: Gráficos se redimensionam corretamente sem corte ou overflow
 */
import { test, expect } from "@playwright/test";

const PROTECTED_PAGES = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/expenses", name: "Despesas" },
  { path: "/reports", name: "Relatórios" },
  { path: "/categories", name: "Categorias" },
];

async function checkNoHorizontalOverflow(page: Parameters<typeof test>[1] extends (args: { page: infer P }) => unknown ? P : never) {
  const hasOverflow = await page.evaluate(() => {
    // Check root and body for horizontal overflow
    const root = document.documentElement;
    const body = document.body;
    return (
      root.scrollWidth > root.clientWidth ||
      body.scrollWidth > body.clientWidth
    );
  });
  return hasOverflow;
}

for (const { path, name } of PROTECTED_PAGES) {
  test(`${name} — sem overflow horizontal em 390px`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");

    const hasOverflow = await checkNoHorizontalOverflow(page);
    expect(hasOverflow, `Página "${name}" tem overflow horizontal`).toBe(false);
  });
}

test("Dashboard — gráfico de pizza não causa overflow", async ({ page }) => {
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  // The chart container should not exceed the viewport width
  const chartContainer = page.locator(".recharts-responsive-container").first();
  if (await chartContainer.isVisible()) {
    const box = await chartContainer.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(390);
  }
});

test("Relatórios — gráfico de barras não causa overflow", async ({ page }) => {
  await page.goto("/reports");
  await page.waitForLoadState("networkidle");

  const chartContainer = page.locator(".recharts-responsive-container").first();
  if (await chartContainer.isVisible()) {
    const box = await chartContainer.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(390);
  }
});
