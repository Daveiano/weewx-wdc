import { test, expect, type Page } from "@playwright/test";

test.describe("Conditions table", () => {
  test("Classic statistics", async ({ page }) => {
    await page.goto("artifacts-classic-weewx-html/public_html/statistics.html");

    const conditionsTable = page.locator(".obs-stat-tile");

    const outTemp = conditionsTable.locator("[data-test='outTemp']");
    await expect(
      outTemp.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("9.9°C");

    await expect(
      outTemp.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/-9\.3°C([\s\S]*)am 12\/26\/21 01:25:00/);

    await expect(
      outTemp.locator("bx-structured-list-cell >> nth=3")
    ).toHaveText(/37\.4°C([\s\S]*)am 06\/19\/22 16:33:57/);

    const windSpeed = conditionsTable.locator("[data-test='windSpeed']");
    await expect(
      windSpeed.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("6 km/h , SSW");

    await expect(
      windSpeed.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/0 km\/h([\s\S]*)am 03\/04\/21 19:57:00/);

    await expect(
      windSpeed.locator("bx-structured-list-cell >> nth=3")
    ).toHaveText(/53 km\/h([\s\S]*), N([\s\S]*)am 01\/30\/22 05:53:00/);

    const rain = conditionsTable.locator("[data-test='rain']");
    await expect(rain.locator("bx-structured-list-cell >> nth=1")).toHaveText(
      "81.07 cm"
    );
  });
});
