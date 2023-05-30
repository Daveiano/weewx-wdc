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
    ).toHaveText("104");
    await expect(
      rainDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Rain > 0 cm/);

    const summerDays = table.locator("[data-test='summerDays']");
    await expect(
      summerDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("18");
    await expect(
      summerDays.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/Outside Temperaturemax ≥ 25°C/);

    const hotDays = table.locator("[data-test='hotDays']");
    await expect(
      hotDays.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("2");
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
    ).toHaveText("1");
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
    ).toHaveText("65");
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

  test("Rain Stats table", async ({ page }) => {
    // Stats page.
    const rainTable = page
      .getByRole("tabpanel", { name: "Rain days" })
      .locator(".clim-days-extended-table");

    await page.getByRole("tab", { name: "Rain days" }).click();
    await expect(rainTable).toBeVisible();

    await expect(rainTable.getByTestId("last-rain")).toContainText(
      "06/20/22, 17:00:00"
    );
    await expect(rainTable.getByTestId("most-days-with-rain")).toContainText(
      "12/12/21 - 12/20/21 (9 days, 0.94 cm)"
    );
    await expect(rainTable.getByTestId("most-days-without-rain")).toContainText(
      "04/26/22 - 05/15/22 (20 days)"
    );

    // 2021.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/year-2021.html"
    );
    await page.getByRole("tab", { name: "Rain days" }).click();
    await expect(rainTable).toBeVisible();

    await expect(rainTable.getByTestId("last-rain")).toHaveCount(0);
    await expect(rainTable.getByTestId("most-days-with-rain")).toContainText(
      "12/12/21 - 12/20/21 (9 days, 0.94 cm)"
    );
    await expect(rainTable.getByTestId("most-days-without-rain")).toContainText(
      "10/27/21 - 10/31/21 (5 days)"
    );

    // 2022.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/year-2022.html"
    );
    await page.getByRole("tab", { name: "Rain days" }).click();
    await expect(rainTable).toBeVisible();

    await expect(rainTable.getByTestId("last-rain")).toHaveCount(0);
    await expect(rainTable.getByTestId("most-days-with-rain")).toContainText(
      "01/22/22 - 01/26/22 (5 days, 1.05 cm)"
    );
    await expect(rainTable.getByTestId("most-days-without-rain")).toContainText(
      "	04/26/22 - 05/15/22 (20 days)"
    );
  });

  test("Avg outside temp", async ({ page }) => {
    const avgTemp = page.locator("#panel-diagram-temp-avg");

    await page.locator("bx-tab[value='diagram-temp-avg']").click();
    await expect(avgTemp).toBeVisible();

    await expect(avgTemp).toHaveScreenshot();
    expect(await avgTemp.locator("> script").innerText()).toMatchSnapshot();
  });

  test("Climatogram Stats", async ({ page }) => {
    const climatogram = page.locator("#panel-climatogram");

    await page.locator("bx-tab[value='climatogram']").click();
    await expect(climatogram).toBeVisible();

    await expect(climatogram).toHaveScreenshot();
    // Rain data.
    expect(
      await climatogram
        .locator(".diagram-tile.combined .value > script >> nth=0")
        .innerText()
    ).toMatchSnapshot();

    // outTemp data.
    expect(
      await climatogram
        .locator(".diagram-tile.combined .value > script >> nth=1")
        .innerText()
    ).toMatchSnapshot();
  });

  test("Climatogram Year", async ({ page }) => {
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/year-2022.html"
    );

    const climatogram = page.locator("#panel-climatogram");

    await page.locator("bx-tab[value='climatogram']").click();
    await expect(climatogram).toBeVisible();

    await expect(climatogram).toHaveScreenshot();
    // Rain data.
    expect(
      await climatogram
        .locator(".diagram-tile.combined .value > script >> nth=0")
        .innerText()
    ).toMatchSnapshot();

    // outTemp data.
    expect(
      await climatogram
        .locator(".diagram-tile.combined .value > script >> nth=1")
        .innerText()
    ).toMatchSnapshot();
  });
});
