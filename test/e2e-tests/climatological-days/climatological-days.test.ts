import { test, expect, type Page } from "@playwright/test";

test.describe("Climatological days", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
  });

  test("Table", async ({ page }) => {
    const table = page.locator("#panel-table");
    await expect(table).toBeVisible();

    const rainDays = table.locator("[data-test='rainDays']");
    await expect(
      rainDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("208");

    const stormDays = table.locator("[data-test='stormDays']");
    await expect(
      stormDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("1");

    const hotDays = table.locator("[data-test='hotDays']");
    await expect(
      hotDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("6");
  });

  test("Rain days", async ({ page }) => {
    const rainDays = page.locator("#panel-diagram-rain");

    await page.locator("bx-tab[value='diagram-rain']").click();
    await expect(rainDays).toBeVisible();

    await expect(rainDays).toHaveScreenshot();
  });

  test("Avg outside temp", async ({ page }) => {
    const avgTemp = page.locator("#panel-diagram-temp-avg");

    await page.locator("bx-tab[value='diagram-temp-avg']").click();
    await expect(avgTemp).toBeVisible();

    await expect(avgTemp).toHaveScreenshot();
  });
});
