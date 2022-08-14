import { test, expect, type Page } from "@playwright/test";

test.describe("Stat tiles", () => {
  test("Alternative index", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");

    const outTemp = page.locator(".stat-tile[data-test='outTemp']");
    await expect(outTemp.locator(".value span")).toHaveText("20.9°C");
    await expect(outTemp.locator("[data-test='min'] .stat-value")).toHaveText(
      "11.4°C"
    );
    await expect(outTemp.locator("[data-test='max'] .stat-value")).toHaveText(
      "21.5°C"
    );

    const windSpeed = page.locator(".stat-tile[data-test='windSpeed']");
    await expect(windSpeed.locator(".value > span")).toHaveText(/1 km\/h/);
    await expect(windSpeed.locator(".value > span .stat-wind-dir")).toHaveText(
      /SSE/
    );
    await expect(windSpeed.locator("[data-test='max'] .stat-value")).toHaveText(
      "3 km/h , S"
    );
    await expect(windSpeed.locator("[data-test='min']")).toHaveCount(0);

    const rain = page.locator(".stat-tile[data-test='rain']");
    await expect(rain.locator(".value > span")).toHaveText("0.00 cm");
    await expect(rain.locator("[data-test='sum'] .stat-value")).toHaveText(
      "0.00 cm"
    );
    await expect(rain.locator("[data-test='min']")).toHaveCount(0);

    const radiation = page.locator(".stat-tile[data-test='radiation']");
    await expect(radiation.locator(".value > span")).toHaveText("48 W/m²");
    await expect(radiation.locator("[data-test='max'] .stat-value")).toHaveText(
      "176 W/m²"
    );
    await expect(radiation.locator("[data-test='min']")).toHaveCount(0);
  });
});
