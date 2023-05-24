import { test, expect, type Page } from "@playwright/test";

test.describe("Stat tiles", () => {
  test("Alternative index", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");

    const outTemp = page.locator(".stat-tile[data-test='outTemp']");
    await expect(outTemp.locator(".value span.raw")).toHaveText("20.9°C");
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
    await expect(rain.locator(".value > span")).toContainText("0.00 cm Total");
    await expect(
      rain.locator("[data-test='rain-rate-current'] .stat-value")
    ).toHaveText("0.00 cm/h");
    await expect(rain.locator(".value > span")).toContainText("0.00 cm Total");
    await expect(
      rain.locator("[data-test='rain-rate-max'] .stat-value")
    ).toHaveText("0.00 cm/h");
    await expect(rain.locator("[data-test='min']")).toHaveCount(0);
    await expect(rain.locator("[data-test='max']")).toHaveCount(0);

    const radiation = page.locator(".stat-tile[data-test='radiation']");
    await expect(radiation.locator(".value > span")).toHaveText("48 W/m²");
    await expect(radiation.locator("[data-test='max'] .stat-value")).toHaveText(
      "176 W/m²"
    );
    await expect(radiation.locator("[data-test='min']")).toHaveCount(0);
    await expect(radiation.locator("[data-test='sum']")).toHaveCount(0);

    const et = page.locator(".stat-tile[data-test='ET']");
    await expect(et.locator(".value span.stat-title-obs-value")).toContainText(
      "0.01 cm Total"
    );
    await expect(et.locator("[data-test='min']")).toHaveCount(0);
    await expect(et.locator("[data-test='max']")).toHaveCount(0);
    await expect(et.locator("[data-test='total-week'] .stat-value")).toHaveText(
      "1.37 cm"
    );

    // Test Icons.
    expect(await outTemp.locator(".value svg").innerHTML()).toMatchSnapshot();
    expect(
      await windSpeed.locator(".value svg >> nth=0").innerHTML()
    ).toMatchSnapshot();
    expect(await rain.locator(".value svg").innerHTML()).toMatchSnapshot();
    expect(await radiation.locator(".value svg").innerHTML()).toMatchSnapshot();
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

    const rain = page.locator(".stat-tile[data-test='rain']");
    await expect(rain.locator(".value span >> nth=0")).toContainText("0.00 cm");
    await expect(rain.locator("[data-test='min'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='sum'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='max'] .stat-value")).toHaveText(
      "0.03 cm"
    );
  });

  test("Rain tile", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/week.html");

    let rain = page.locator(".stat-tile[data-test='rain']");
    await expect(rain.locator(".value span >> nth=0")).toContainText(
      "0.12 cm Total"
    );
    await expect(rain.locator("[data-test='min'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='sum'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='max'] .stat-value")).toHaveCount(0);
    await expect(
      rain.locator("[data-test='rain-days'] .stat-value")
    ).toHaveText("1");
    await expect(
      rain.locator("[data-test='rain-rate-max'] .stat-value")
    ).toHaveText("0.30 cm/h");

    await page.goto("artifacts-alternative-weewx-html/public_html/year.html");

    rain = page.locator(".stat-tile[data-test='rain']");
    await expect(rain.locator(".value span >> nth=0")).toContainText(
      "18.74 cm Total"
    );
    await expect(rain.locator("[data-test='min'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='sum'] .stat-value")).toHaveCount(0);
    await expect(rain.locator("[data-test='max'] .stat-value")).toHaveCount(0);
    await expect(
      rain.locator("[data-test='rain-days'] .stat-value")
    ).toHaveText("65");
    await expect(
      rain.locator("[data-test='rain-rate-max'] .stat-value")
    ).toHaveText("1.86 cm/h");
  });

  test("Custom Icons", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");

    const rain = page.locator(".stat-tile[data-test='rain']");
    const cloudbase = page.locator(".stat-tile[data-test='cloudbase']");
    const outHumidity = page.locator(".stat-tile[data-test='outHumidity']");

    // Diagrams
    expect(await rain.locator(".value svg").innerHTML()).toMatchSnapshot();
    expect(
      await outHumidity.locator(".value svg").innerHTML()
    ).toMatchSnapshot();
    await expect(cloudbase.locator(".value svg")).toHaveCount(0);
    await expect(cloudbase.locator(".value img")).toHaveCount(1);
  });
});
