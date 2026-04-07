/**
 * AC: Gráficos se redimensionam corretamente sem corte ou overflow
 * AC: Todas as páginas renderizam sem overflow horizontal em 390px
 */
import { test, expect } from "@playwright/test";

// ─── Dashboard ─────────────────────────────────────────────────────────────────

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");
  });

  test("cards de resumo empilham em coluna única", async ({ page }) => {
    // On mobile, summary cards should stack vertically (grid-cols-1 sm:grid-cols-3)
    const cards = page.locator("[data-testid='summary-card']");

    if ((await cards.count()) > 1) {
      const firstBox = await cards.nth(0).boundingBox();
      const secondBox = await cards.nth(1).boundingBox();

      // Cards should be stacked vertically (same x position, different y)
      expect(firstBox?.x).toBeCloseTo(secondBox?.x ?? 0, -1);
      expect(firstBox?.y).toBeLessThan(secondBox?.y ?? 0);
    }
  });

  test("gráfico de pizza não ultrapassa a largura do viewport", async ({
    page,
  }) => {
    const chart = page.locator(".recharts-responsive-container").first();
    if (await chart.isVisible()) {
      const box = await chart.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(390);
    }
  });

  test("seção 'Maiores gastos' não causa overflow horizontal", async ({
    page,
  }) => {
    const hasOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasOverflow).toBe(false);
  });
});

// ─── Relatórios ────────────────────────────────────────────────────────────────

test.describe("Relatórios", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/reports");
    await page.waitForLoadState("networkidle");
  });

  test("header com seletor de ano não causa overflow", async ({ page }) => {
    const hasOverflow = await page.evaluate(() => {
      return (
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth
      );
    });
    expect(hasOverflow).toBe(false);
  });

  test("gráfico de barras não ultrapassa a largura do viewport", async ({
    page,
  }) => {
    const chart = page.locator(".recharts-responsive-container").first();
    if (await chart.isVisible()) {
      const box = await chart.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(390);
    }
  });

  test("tabela de resumo mensal não causa overflow horizontal", async ({
    page,
  }) => {
    // The monthly summary table should have overflow-x-auto or adapt to mobile
    const tableWrapper = page.locator(".overflow-x-auto").last();
    if (await tableWrapper.isVisible()) {
      const box = await tableWrapper.boundingBox();
      expect(box?.width).toBeLessThanOrEqual(390);
    }
  });

  test("botões de navegação de ano têm tamanho adequado para toque", async ({
    page,
  }) => {
    const prevBtn = page.getByRole("button", { name: /ano anterior/i });
    const nextBtn = page.getByRole("button", { name: /próximo ano/i });

    for (const btn of [prevBtn, nextBtn]) {
      const box = await btn.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(36);
    }
  });
});
