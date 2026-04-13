import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, ".env.test") });

export default defineConfig({
  testDir: ".",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: "mobile",
      testMatch: ["./tests/**/*.spec.ts"],
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
        storageState: "tests/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "desktop",
      testMatch: ["./tests/**/*.spec.ts"],
      use: {
        viewport: { width: 1280, height: 800 },
        storageState: "tests/.auth/user.json",
      },
      dependencies: ["setup"],
    },
    {
      name: "chromium",
      testMatch: ["./e2e/**/*.spec.ts"],
      use: {
        browserName: "chromium",
      },
    },
  ],
  // Start the dev server manually before running tests: npm run dev
});
