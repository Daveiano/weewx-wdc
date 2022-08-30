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
    ).toHaveText(/-9\.3°C([\s\S]*) 12\/26\/21 01:25:00/);

    await expect(
      outTemp.locator("bx-structured-list-cell >> nth=3")
    ).toHaveText(/37\.4°C([\s\S]*) 06\/19\/22 16:33:57/);

    const windSpeed = conditionsTable.locator("[data-test='windSpeed']");
    await expect(
      windSpeed.locator("bx-structured-list-cell >> nth=1")
    ).toHaveText("6 km/h , SSW");

    await expect(
      windSpeed.locator("bx-structured-list-cell >> nth=2")
    ).toHaveText(/0 km\/h([\s\S]*) 03\/04\/21 19:57:00/);

    await expect(
      windSpeed.locator("bx-structured-list-cell >> nth=3")
    ).toHaveText(/53 km\/h([\s\S]*), N([\s\S]*) 01\/30\/22 05:53:00/);

    const rain = conditionsTable.locator("[data-test='rain']");
    await expect(rain.locator("bx-structured-list-cell >> nth=1")).toHaveText(
      "81.07 cm"
    );
  });

  test("Show min/max time", async ({ page }) => {
    await page.goto("artifacts-classic-weewx-html/public_html/index.html");
    let conditionsTable = page.locator(".obs-stat-tile");
    let outTemp = conditionsTable.locator("[data-test='outTemp']");

    let max = await outTemp
      .locator("bx-structured-list-cell >> nth=3")
      .innerText();
    expect(max).toBe("21.5°C");

    await page.goto("artifacts-classic-weewx-html/public_html/week.html");
    conditionsTable = page.locator(".obs-stat-tile");
    outTemp = conditionsTable.locator("[data-test='outTemp']");

    max = await outTemp.locator("bx-structured-list-cell >> nth=3").innerText();
    expect(max.replace(/(\r\n|\n|\r)/gm, " ").trim()).toBe(
      "37.4°C 06/19/22 16:33:57"
    );
  });
});
