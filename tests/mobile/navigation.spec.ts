/**
 * AC: Navegação mobile funciona corretamente em todas as páginas
 */
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Hide Next.js dev overlay so it doesn't intercept pointer events during tests
  await page.addInitScript(() => {
    const style = document.createElement("style");
    style.textContent = "nextjs-portal { display: none !important; }";
    document.head.appendChild(style);
  });
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
});

test("top bar mobile está visível", async ({ page }) => {
  const header = page.locator("header").first();
  await expect(header).toBeVisible();
});

test("sidebar desktop está oculta em mobile", async ({ page }) => {
  const sidebar = page.locator("aside");
  await expect(sidebar).toBeHidden();
});

test("bottom nav está visível e fixo", async ({ page }) => {
  // The bottom nav is a <nav> with fixed positioning at bottom
  const bottomNav = page
    .locator("nav")
    .filter({ has: page.locator("a").first() })
    .last();
  await expect(bottomNav).toBeVisible();
});

test("bottom nav — link para Despesas navega corretamente", async ({ page }) => {
  await page.getByRole("link", { name: /despesas/i }).click();
  await expect(page).toHaveURL("/expenses");
});

test("bottom nav — link para Relatórios navega corretamente", async ({ page }) => {
  await page.getByRole("link", { name: /relatórios/i }).click();
  await expect(page).toHaveURL("/reports");
});

test("bottom nav — link para Categorias navega corretamente", async ({ page }) => {
  await page.getByRole("link", { name: /categorias/i }).click();
  await expect(page).toHaveURL("/categories");
});

test("bottom nav — link para Dashboard navega corretamente", async ({ page }) => {
  await page.goto("/expenses");
  // Use native JS click to bypass Next.js dev portal shadow DOM pointer interception
  await page.evaluate(() => {
    const link = document.querySelector(
      '[data-testid="bottom-nav"] a[href="/dashboard"]'
    ) as HTMLElement;
    link?.click();
  });
  await page.waitForURL("**/dashboard", { timeout: 10000 });
});

test("bottom nav não fica coberto por conteúdo da página", async ({ page }) => {
  await page.goto("/expenses");
  await page.waitForLoadState("networkidle");

  // The content div inside main has pb-24 (96px) to clear the fixed bottom nav
  const contentArea = page.locator("main > div").first();
  const paddingBottom = await contentArea.evaluate((el) => {
    return parseInt(getComputedStyle(el).paddingBottom, 10);
  });

  // Should have at least 80px padding-bottom for the bottom nav (~56px + safe area)
  expect(paddingBottom).toBeGreaterThanOrEqual(80);
});
