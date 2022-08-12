import { test, expect, type Page } from "@playwright/test";

test.describe("Alternative statistics.html", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
  });

  test("Basic Display", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("All time statistics");

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});

test.describe("Classic statistics.html", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-classic-weewx-html/public_html/statistics.html");
  });

  test("Basic Display", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("All time statistics");

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
