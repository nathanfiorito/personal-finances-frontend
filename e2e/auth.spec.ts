import { test, expect } from "@playwright/test";

if (!process.env.TEST_USER_EMAIL || !process.env.TEST_USER_PASSWORD) {
  throw new Error(
    "TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in .env.test"
  );
}

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

test("unauthenticated /dashboard redirects to /login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("login with invalid credentials shows error without redirect", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[type="email"]', "wrong@example.com");
  await page.fill('input[type="password"]', "wrongpassword");
  await page.click('button[type="submit"]');
  await expect(page.locator("text=Invalid email or password")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);
});

test("login with valid credentials redirects to dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.fill('input[type="email"]', TEST_EMAIL);
  await page.fill('input[type="password"]', TEST_PASSWORD);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/dashboard/);
});
