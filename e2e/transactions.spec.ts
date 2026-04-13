import { test, expect } from "@playwright/test";

// Reusable login helper
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill('input[type="email"]', process.env.TEST_USER_EMAIL!);
  await page.fill('input[type="password"]', process.env.TEST_USER_PASSWORD!);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}

test("create a transaction and see it in the table", async ({ page }) => {
  await login(page);
  await page.goto("/transactions");
  await page.click("text=+ Add transaction");
  await page.fill('input[type="number"]', "99.99");
  await page.selectOption('select[value="expense"]', "expense");
  await page.selectOption("select", { label: /alimenta/i });
  await page.click('button[type="submit"]');
  await expect(page.locator("text=Transaction created")).toBeVisible();
  await expect(page.locator("text=99,99")).toBeVisible();
});

test("delete a transaction with confirmation", async ({ page }) => {
  await login(page);
  await page.goto("/transactions");
  // Confirm the first delete button
  page.once("dialog", dialog => dialog.accept());
  await page.locator('[title="Delete"]').first().click();
  await expect(page.locator("text=Transaction deleted")).toBeVisible();
});
