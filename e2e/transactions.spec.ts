import { test, expect } from "@playwright/test";

if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
  throw new Error(
    "TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.test"
  );
}

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

// Reusable login helper
async function login(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);
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
  const dialogPromise = page.waitForEvent("dialog");
  await page.locator('[title="Delete"]').first().click();
  const dialog = await dialogPromise;
  await dialog.accept();
  await expect(page.locator("text=Transaction deleted")).toBeVisible();
});
