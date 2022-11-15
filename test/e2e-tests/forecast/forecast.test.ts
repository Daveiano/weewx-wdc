import { test, expect, type Page } from "@playwright/test";

test.describe("Forecast", () => {
  test("Forecast table", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");

    const forecast_table = page.locator(".forecast .forecast-list");

    // 7 rows.
    await expect(
      forecast_table.locator("bx-structured-list-body > bx-structured-list-row")
    ).toHaveCount(7);

    // 6 columns.
    await expect(
      forecast_table.locator(
        "bx-structured-list-head bx-structured-list-header-cell"
      )
    ).toHaveCount(6);

    await expect(
      forecast_table.locator(
        "bx-structured-list-body bx-structured-list-row:nth-child(2) bx-structured-list-cell:nth-child(1)"
      )
    ).toContainText("Temp in °C");
  });
});
