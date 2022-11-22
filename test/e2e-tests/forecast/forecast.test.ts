import { test, expect, type Page } from "@playwright/test";

test.describe("Forecast", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-forecast-weewx-html/public_html/index.html");
  });

  test("Forecast table", async ({ page }) => {
    const forecast_table = page.locator(".forecast .forecast-list.daily");

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

    await page.locator(".forecast-tile").screenshot({
      path: "test/e2e-tests/forecast/forecast-front.png",
    });
  });

  test("Daily/Hourly switch", async ({ page }) => {
    const switcher = page.locator(".forecast-tile bx-content-switcher");
    const forecast_daily = page.locator(".forecast-list.daily");
    const forecast_hourly = page.locator(".forecast-list.hourly");

    await expect(forecast_daily).toBeVisible();
    await expect(forecast_hourly).not.toBeVisible();

    await switcher.locator("bx-content-switcher-item >> nth=1").click();

    await expect(forecast_daily).not.toBeVisible();
    await expect(forecast_hourly).toBeVisible();
  });

  test("Zambretti", async ({ page }) => {
    const forecast_zambretti = page.locator("[data-test='forecast-zambretti']");

    await expect(forecast_zambretti.locator("h3")).toHaveText("Zambretti");
    await expect(forecast_zambretti.locator("p")).toContainText(
      "The forecast is Occasional rain, worsening"
    );
  });
});
