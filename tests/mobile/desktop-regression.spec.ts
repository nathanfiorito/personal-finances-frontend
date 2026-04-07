/**
 * AC: Não há regressões no layout desktop após as mudanças
 * Roda no projeto "desktop" (viewport 1280x800)
 */
import { test, expect } from "@playwright/test";

const PROTECTED_PAGES = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/expenses", name: "Despesas" },
  { path: "/reports", name: "Relatórios" },
  { path: "/categories", name: "Categorias" },
];

test.describe("Desktop — regressões de layout", () => {
  test("sidebar está visível no desktop", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const sidebar = page.locator("aside");
    await expect(sidebar).toBeVisible();
  });

  test("bottom nav está oculto no desktop", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Bottom nav uses md:hidden — should not be visible at 1280px
    // It's the nav element with fixed bottom-0 positioning
    const allNavs = page.locator("nav");
    const count = await allNavs.count();

    for (let i = 0; i < count; i++) {
      const nav = allNavs.nth(i);
      const isFixed = await nav.evaluate((el) => {
        return getComputedStyle(el).position === "fixed";
      });
      if (isFixed) {
        await expect(nav).toBeHidden();
      }
    }
  });

  test("top bar mobile está oculta no desktop", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const header = page.locator("header").first();
    await expect(header).toBeHidden();
  });

  for (const { path, name } of PROTECTED_PAGES) {
    test(`${name} — sem overflow horizontal em 1280px`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const hasOverflow = await page.evaluate(() => {
        return (
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth
        );
      });
      expect(hasOverflow, `Página "${name}" tem overflow no desktop`).toBe(
        false
      );
    });
  }

  test("Despesas — tabela exibe todas as colunas no desktop", async ({
    page,
  }) => {
    await page.goto("/expenses");
    await page.waitForLoadState("networkidle");

    const headers = page.locator("thead th");
    const count = await headers.count();
    expect(count).toBeGreaterThanOrEqual(5); // Data, Estabelecimento, Categoria, Valor, Tipo, Ações
  });
});
