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
    await expect(rain.locator("[data-test='max']")).toHaveCount(0);

    const radiation = page.locator(".stat-tile[data-test='radiation']");
    await expect(radiation.locator(".value > span")).toHaveText("48 W/m²");
    await expect(radiation.locator("[data-test='max'] .stat-value")).toHaveText(
      "176 W/m²"
    );
    await expect(radiation.locator("[data-test='min']")).toHaveCount(0);
    await expect(radiation.locator("[data-test='sum']")).toHaveCount(0);
  });

  test("Show min/max time", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
    let outTemp = page.locator(".stat-tile[data-test='outTemp']");
    await expect(outTemp.locator("[data-test='max'] .stat-value")).toHaveText(
      "21.5°C"
    );
    // No tooltip present.
    await expect(outTemp.locator("[data-test='max'] .stat-label")).toHaveText(
      "Todays Max"
    );
    await expect(
      outTemp.locator("[data-test='max'] .stat-label bx-tooltip-definition")
    ).toHaveCount(0);

    await page.goto("artifacts-custom-weewx-html/public_html/index.html");
    outTemp = page.locator(".stat-tile[data-test='outTemp']");
    await expect(outTemp.locator("[data-test='max'] .stat-value")).toHaveText(
      "21.5°C"
    );
    // Tooltip present.
    await expect(
      outTemp.locator("[data-test='max'] .stat-label")
    ).toContainText("Todays Max");

    await expect(
      outTemp.locator("[data-test='max'] .stat-label bx-tooltip-definition")
    ).toHaveCount(1);

    const maxTime = await outTemp
      .locator("[data-test='max'] .stat-label bx-tooltip-definition")
      .getAttribute("body-text");

    expect(maxTime).toBe("07:23:05");
  });

  test("Sum/Min/Max", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/week.html");

    const outTemp = page.locator(".stat-tile[data-test='outTemp']");
    await expect(outTemp.locator(".value span >> nth=0")).toContainText(
      "19.7°C"
    );
    await expect(outTemp.locator("[data-test='min'] .stat-value")).toHaveCount(
      0
    );
    await expect(outTemp.locator("[data-test='sum'] .stat-value")).toHaveCount(
      0
    );
    await expect(outTemp.locator("[data-test='max'] .stat-value")).toHaveText(
      "37.4°C"
    );

    const rainRate = page.locator(".stat-tile[data-test='rainRate']");
    await expect(rainRate.locator(".value span >> nth=0")).toContainText(
      "0.00 cm/h"
    );
    await expect(rainRate.locator("[data-test='min'] .stat-value")).toHaveCount(
      0
    );
    await expect(rainRate.locator("[data-test='sum'] .stat-value")).toHaveCount(
      0
    );
    await expect(rainRate.locator("[data-test='max'] .stat-value")).toHaveText(
      "0.30 cm/h"
    );

    const rain = page.locator(".stat-tile[data-test='rain']");
    await expect(rain.locator(".value span >> nth=0")).toContainText("0.00 cm");
    await expect(rain.locator("[data-test='min'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='sum'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='max'] .stat-value")).toHaveText(
      "0.03 cm"
    );
  });
});
