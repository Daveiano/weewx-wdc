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
    await expect(
      rainDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Rain > 0 cm/);

    const summerDays = table.locator("[data-test='summerDays']");
    await expect(
      summerDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("59");
    await expect(
      summerDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Outside Temperaturemax ≥ 25°C/);

    const hotDays = table.locator("[data-test='hotDays']");
    await expect(
      hotDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("6");
    await expect(
      hotDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Outside Temperaturemax ≥ 30°C/);

    const desertDays = table.locator("[data-test='desertDays']");
    await expect(
      desertDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("1");
    await expect(
      desertDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Outside Temperaturemax ≥ 35°C/);

    const tropicalNights = table.locator("[data-test='tropicalNights']");
    await expect(
      tropicalNights.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("5");
    await expect(
      tropicalNights.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Outside Temperaturemin ≥ 20°C/);

    const stormDays = table.locator("[data-test='stormDays']");
    await expect(
      stormDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("1");
    await expect(
      stormDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Gust Speed > 62 km\/h/);

    const iceDays = table.locator("[data-test='iceDays']");
    await expect(
      iceDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("5");
    await expect(
      iceDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Outside Temperaturemax < 0°C/);

    const frostDays = table.locator("[data-test='frostDays']");
    await expect(
      frostDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("86");
    await expect(
      frostDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Outside Temperaturemin < 0°C/);
  });

  test("Rain days", async ({ page }) => {
    const rainDays = page.locator("#panel-diagram-rain");

    await page.locator("bx-tab[value='diagram-rain']").click();
    await expect(rainDays).toBeVisible();

    await expect(rainDays).toHaveScreenshot();
    expect(await rainDays.locator("> script").innerText()).toMatchSnapshot();
  });

  test("Avg outside temp", async ({ page }) => {
    const avgTemp = page.locator("#panel-diagram-temp-avg");

    await page.locator("bx-tab[value='diagram-temp-avg']").click();
    await expect(avgTemp).toBeVisible();

    await expect(avgTemp).toHaveScreenshot();
    expect(await avgTemp.locator("> script").innerText()).toMatchSnapshot();
  });
});
