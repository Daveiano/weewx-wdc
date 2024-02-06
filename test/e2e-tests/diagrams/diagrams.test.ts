import { test, expect, type Page } from "@playwright/test";

test.describe("Diagrams", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
  });

  // Do not test the component as is, just test that we are giving the currect values in.
  test("Diagram tiles", async ({ page }) => {
    // Daily.
    const cloudbase = page.locator(".diagram-tile[data-test='cloudbase']");
    expect(
      await cloudbase.locator(".value script").innerText()
    ).toMatchSnapshot();

    const rain = page.locator(".diagram-tile[data-test='rain']");
    expect(await rain.locator(".value script").innerText()).toMatchSnapshot();

    const windDir = page.locator(".diagram-tile[data-test='windDir']");
    expect(
      await windDir.locator(".value script").innerText()
    ).toMatchSnapshot();

    // Yesterday.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/yesterday.html"
    );

    const outHumidity = page.locator(".diagram-tile[data-test='outHumidity']");
    expect(
      await outHumidity.locator(".value script").innerText()
    ).toMatchSnapshot();

    const barometer = page.locator(".diagram-tile[data-test='barometer']");
    expect(
      await barometer.locator(".value script").innerText()
    ).toMatchSnapshot();

    // Weekly
    await page.goto("artifacts-alternative-weewx-html/public_html/week.html");

    let rainRate = page.locator(".diagram-tile[data-test='rainRate']");
    expect(
      await rainRate.locator(".value script").innerText()
    ).toMatchSnapshot();

    const UV = page.locator(".diagram-tile[data-test='UV']");
    expect(await UV.locator(".value script").innerText()).toMatchSnapshot();

    // Monthly.
    await page.goto("artifacts-alternative-weewx-html/public_html/month.html");

    let ET = page.locator(".diagram-tile[data-test='ET']");
    expect(await ET.locator(".value script").innerText()).toMatchSnapshot();

    const radiation = page.locator(".diagram-tile[data-test='radiation']");
    expect(
      await radiation.locator(".value script").innerText()
    ).toMatchSnapshot();

    // Yearly.
    await page.goto("artifacts-alternative-weewx-html/public_html/year.html");

    const appTemp = page.locator(".diagram-tile[data-test='appTemp']");
    expect(
      await appTemp.locator(".value script").innerText()
    ).toMatchSnapshot();

    ET = page.locator(".diagram-tile[data-test='ET']");
    expect(await ET.locator(".value script").innerText()).toMatchSnapshot();

    // Stats.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );

    ET = page.locator(".diagram-tile[data-test='ET']");
    expect(await ET.locator(".value script").innerText()).toMatchSnapshot();

    rainRate = page.locator(".diagram-tile[data-test='rainRate']");
    expect(
      await rainRate.locator(".value script").innerText()
    ).toMatchSnapshot();
  });

  test("Combined diagram tiles", async ({ page }) => {
    let tempDew = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint']"
    );
    await expect(tempDew.locator(".value script")).toHaveCount(2);
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    await page.goto(
      "artifacts-alternative-weewx-html/public_html/yesterday.html"
    );

    tempDew = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint']"
    );
    await expect(tempDew.locator(".value script")).toHaveCount(2);
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    await page.goto("artifacts-alternative-weewx-html/public_html/week.html");

    tempDew = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint']"
    );
    await expect(tempDew.locator(".value script")).toHaveCount(2);
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    await page.goto("artifacts-alternative-weewx-html/public_html/month.html");

    tempDew = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint']"
    );
    await expect(tempDew.locator(".value script")).toHaveCount(2);
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    await page.goto("artifacts-alternative-weewx-html/public_html/year.html");

    tempDew = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint']"
    );
    await expect(tempDew.locator(".value script")).toHaveCount(2);
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );

    tempDew = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint']"
    );
    await expect(tempDew.locator(".value script")).toHaveCount(2);
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();
  });

  test("Diagram property generation", async ({ page }) => {
    const UV = page.locator(".diagram-tile[data-test='UV']");
    expect(
      await UV.locator(".value > .diagram").getAttribute("data-labels")
    ).toMatchSnapshot();
    expect(
      await UV.locator(".value > .diagram").getAttribute("data-value")
    ).toMatchSnapshot();
    expect(
      await UV.locator(".value > .diagram").getAttribute("data-color")
    ).toMatchSnapshot();
    expect(
      await UV.locator(".value > .diagram").getAttribute("data-diagram")
    ).toMatchSnapshot();
    expect(
      await UV.locator(".value > .diagram").getAttribute("data-aggregate-type")
    ).toMatchSnapshot();
    expect(
      await UV.locator(".value > .diagram").getAttribute("data-nivo-props")
    ).toMatchSnapshot();

    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );

    const combinedTemp = page.locator(
      ".diagram-tile[data-test='outTemp-outTemp-outTemp']"
    );
    expect(
      await combinedTemp
        .locator(".diagram.combined")
        .getAttribute("data-labels")
    ).toMatchSnapshot();
    expect(
      await combinedTemp.locator(".diagram.combined").getAttribute("data-value")
    ).toMatchSnapshot();
    expect(
      await combinedTemp.locator(".diagram.combined").getAttribute("data-color")
    ).toMatchSnapshot();
    expect(
      await combinedTemp
        .locator(".diagram.combined")
        .getAttribute("data-diagram")
    ).toMatchSnapshot();
    expect(
      await combinedTemp
        .locator(".diagram.combined")
        .getAttribute("data-aggregate-type")
    ).toMatchSnapshot();
    expect(
      await combinedTemp
        .locator(".diagram.combined")
        .getAttribute("data-nivo-props")
    ).toMatchSnapshot();
  });

  test("Windrose", async ({ page }) => {
    let windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();
    await expect(windrose).toHaveScreenshot();

    // Week page.
    await page.goto("artifacts-alternative-weewx-html/public_html/week.html");
    windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();

    // Month page.
    await page.goto("artifacts-alternative-weewx-html/public_html/month.html");
    windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();

    // Year page.
    await page.goto("artifacts-alternative-weewx-html/public_html/year.html");
    windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();

    // Stats page.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();
  });

  test("Windrose with non-beaufort untis", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");

    const windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();

    await expect(windrose).toHaveScreenshot();
  });

  test("Windrose with non-beaufort untis and without unit labels", async ({
    page,
  }) => {
    await page.goto("artifacts-mqtt-weewx-html/public_html/index.html");

    const windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();

    await expect(windrose.locator(".legendtitletext").first()).toContainText(
      "in km/h"
    );

    await expect(windrose).toHaveScreenshot();
  });

  test("Custom aggregate_interval", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");
    const cloudbase = page.locator(".diagram-tile[data-test='cloudbase']");
    expect(
      await cloudbase.locator(".value script").innerText()
    ).toMatchSnapshot();

    await page.goto("artifacts-custom-weewx-html/public_html/week.html");
    const rain = page.locator(".diagram-tile[data-test='rain']");
    expect(await rain.locator(".value script").innerText()).toMatchSnapshot();

    await page.goto("artifacts-custom-weewx-html/public_html/year.html");
    const windDir = page.locator(".diagram-tile[data-test='windDir']");
    expect(
      await windDir.locator(".value script").innerText()
    ).toMatchSnapshot();
  });

  test("Custom Icons", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");

    const tempDewDiagram = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint']"
    );
    const windDiagram = page.locator(
      ".diagram-tile.combined[data-test='windSpeed-windGust']"
    );
    const uvDiagram = page.locator(
      ".diagram-tile.combined[data-test='windSpeed-windGust']"
    );
    const etDiagram = page.locator(".diagram-tile.combined[data-test='ET']");
    expect(
      await windDiagram.locator(".label svg").innerHTML()
    ).toMatchSnapshot();
    expect(await uvDiagram.locator(".label svg").innerHTML()).toMatchSnapshot();
    await expect(tempDewDiagram.locator(".label svg")).toHaveCount(0);
    await expect(etDiagram.locator(".label svg")).toHaveCount(0);

    await page.goto("artifacts-custom-weewx-html/public_html/year.html");

    const tempMinMax = page.locator(
      ".diagram-tile.combined[data-test='outTemp-outTemp-outTemp']"
    );
    expect(
      await tempMinMax.locator(".label svg").innerHTML()
    ).toMatchSnapshot();
  });

  test("Custom Units", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");

    let rainRate = page.locator(".diagram-tile[data-test='rainRate']");
    const tempDew = page.locator(".diagram-tile[data-test='outTemp-dewpoint']");

    expect(
      await rainRate.locator(".value > .diagram").getAttribute("data-unit")
    ).toBe("[' cm/h']");
    expect(
      await rainRate.locator(".value script").innerText()
    ).toMatchSnapshot();

    expect(
      await tempDew.locator(".value > .diagram").getAttribute("data-unit")
    ).toBe("['°C', '°F']");
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    await page.goto("artifacts-custom-weewx-html/public_html/week.html");

    rainRate = page.locator(".diagram-tile[data-test='rainRate']");

    expect(
      await rainRate.locator(".value > .diagram").getAttribute("data-unit")
    ).toBe("[' mm/h']");
    expect(
      await rainRate.locator(".value script").innerText()
    ).toMatchSnapshot();

    await page.goto("artifacts-custom-weewx-html/public_html/year.html");

    const tempMinMaxAvg = page.locator(
      ".diagram-tile[data-test='outTemp-outTemp-outTemp']"
    );

    expect(
      await tempMinMaxAvg.locator(".value > .diagram").getAttribute("data-unit")
    ).toBe("['°F', '°F', '°F']");
    expect(
      await tempMinMaxAvg.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempMinMaxAvg.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();
    expect(
      await tempMinMaxAvg.locator(".value script >> nth=2").innerText()
    ).toMatchSnapshot();
  });

  test("Custom rounding", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/year.html");

    let barometer = page.locator(".diagram-tile[data-test='barometer']");
    const tempDew = page.locator(".diagram-tile[data-test='outTemp-dewpoint']");
    const windChillHeatIndex = page.locator(
      ".diagram-tile[data-test='windchill-heatindex']"
    );

    expect(
      await windChillHeatIndex.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await windChillHeatIndex.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    expect(
      await barometer.locator(".value script").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();

    await page.goto("artifacts-custom-weewx-html/public_html/week.html");

    barometer = page.locator(".diagram-tile[data-test='barometer']");
    expect(
      await barometer.locator(".value script").innerText()
    ).toMatchSnapshot();
  });

  test("Multiple Units Chart", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/month.html");

    const pressureTemp = page.locator(
      ".diagram-tile[data-test='outTemp-dewpoint-barometer-pressure']"
    );
    const rainTemp = page.locator(
      ".diagram-tile[data-test='rain-outTemp-outTemp']"
    );

    expect(
      await pressureTemp.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await pressureTemp.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();
    expect(
      await pressureTemp.locator(".value script >> nth=2").innerText()
    ).toMatchSnapshot();
    expect(
      await pressureTemp.locator(".value script >> nth=3").innerText()
    ).toMatchSnapshot();

    expect(
      await rainTemp.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await rainTemp.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();
    expect(
      await rainTemp.locator(".value script >> nth=2").innerText()
    ).toMatchSnapshot();

    // Make combined diagram visible.
    await page.evaluate(() => window.scrollBy(0, 250));
    const rainTempSVG = rainTemp.locator(".value .diagram div svg > g"),
      pressureTempSVG = pressureTemp.locator(".value .diagram div svg > g");
    await pressureTempSVG.waitFor();
    await rainTempSVG.waitFor();

    // Text axis labels.
    await expect(pressureTemp.locator(".axis-label-left")).toHaveText("°C");
    await expect(pressureTemp.locator(".axis-label-right")).toHaveText(" mbar");

    await expect(rainTemp.locator(".axis-label-left")).toHaveText(" cm");
    await expect(rainTemp.locator(".axis-label-right")).toHaveText("°C");

    await expect(pressureTemp).toHaveScreenshot();
    await expect(rainTemp).toHaveScreenshot();
  });

  test("xAxis", async ({ page }) => {
    // Index Temp-Dew.
    const tempDewXAxis = page.locator(
      ".diagram-tile[data-test='outTemp-dewpoint'] svg[data-test='d3-diagram-svg'] g[data-test='x-axis']"
    );
    expect(await tempDewXAxis.evaluate((el) => el.outerHTML)).toMatchSnapshot();

    //Index rain.
    const rainXAxis = page.locator(
      ".diagram-tile[data-test='rain'] svg[data-test='d3-diagram-svg'] g[data-test='x-axis']"
    );
    expect(await rainXAxis.evaluate((el) => el.outerHTML)).toMatchSnapshot();

    // Stats climatogram.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    await page.locator("bx-tab[value='climatogram']").click();
    const climatogramXAxis = page.locator(
      ".diagram-tile[data-test='rain-outTemp'] svg[data-test='d3-diagram-svg'] g[data-test='x-axis']"
    );
    expect(
      await climatogramXAxis.evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
  });

  test("yAxis", async ({ page }) => {
    // Index Temp-Dew.
    const tempDewYAxis = page.locator(
      ".diagram-tile[data-test='outTemp-dewpoint'] svg[data-test='d3-diagram-svg'] g[data-test='y-axis-left']"
    );
    expect(await tempDewYAxis.evaluate((el) => el.outerHTML)).toMatchSnapshot();

    //Index rain.
    const rainYAxis = page.locator(
      ".diagram-tile[data-test='rain'] svg[data-test='d3-diagram-svg'] g[data-test='y-axis']"
    );
    expect(await rainYAxis.evaluate((el) => el.outerHTML)).toMatchSnapshot();

    // Index windDir.
    const windDirYAxisOridinal = page.locator(
      ".diagram-tile[data-test='windDir'] svg[data-test='d3-diagram-svg'] g[data-test='y-axis-left']"
    );
    expect(
      await windDirYAxisOridinal.evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();

    // Stats climatogram.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    await page.locator("bx-tab[value='climatogram']").click();
    const climatogramYAxisLeft = page.locator(
      ".diagram-tile[data-test='rain-outTemp'] svg[data-test='d3-diagram-svg'] g[data-test='y-axis-left']"
    );
    expect(
      await climatogramYAxisLeft.evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
    const climatogramYAxisRight = page.locator(
      ".diagram-tile[data-test='rain-outTemp'] svg[data-test='d3-diagram-svg'] g[data-test='y-axis-right']"
    );
    expect(
      await climatogramYAxisRight.evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
  });

  test("Line", async ({ page }) => {
    // Index Temp-Dew.
    const tempDew = page.locator(
      ".diagram-tile[data-test='outTemp-dewpoint'] svg[data-test='d3-diagram-svg']"
    );
    expect(
      await tempDew
        .locator("path[data-test='line-outTemp']")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
    expect(
      await tempDew
        .locator("path[data-test='line-dewpoint']")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();

    // Stats min-max-avg outTemp
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    const outTempMinMaxAvg = page.locator(
      ".diagram-tile[data-test='outTemp-outTemp-outTemp'] svg[data-test='d3-diagram-svg']"
    );
    expect(
      await outTempMinMaxAvg
        .locator("path[data-test='line-outTemp'] >> nth=0")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
    expect(
      await outTempMinMaxAvg
        .locator("path[data-test='line-outTemp'] >> nth=1")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
    expect(
      await outTempMinMaxAvg
        .locator("path[data-test='line-outTemp'] >> nth=2")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();

    // Stats climatogram.
    await page.locator("bx-tab[value='climatogram']").click();
    const climatogram = page.locator(
      ".diagram-tile[data-test='rain-outTemp'] svg[data-test='d3-diagram-svg']"
    );
    expect(
      await climatogram
        .locator("path[data-test='line-outTemp']")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
  });

  test("Bar", async ({ page }) => {
    // Index rain.
    const rain = page.locator(
      ".diagram-tile[data-test='rain'] svg[data-test='d3-diagram-svg']"
    );
    expect(
      await rain
        .locator("rect[data-test='bar'] >> nth=1")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
    expect(
      await rain
        .locator("rect[data-test='bar'] >> nth=5")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();

    // Stats climatogram.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    await page.locator("bx-tab[value='climatogram']").click();
    const climatogram = page.locator(
      ".diagram-tile[data-test='rain-outTemp'] svg[data-test='d3-diagram-svg']"
    );
    expect(
      await climatogram
        .locator("rect[data-test='bar-rain'] >> nth=0")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
    expect(
      await climatogram
        .locator("rect[data-test='bar-rain'] >> nth=1")
        .evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
  });

  test("Color handling", async ({ page }) => {
    // Index Temp-Dew.
    const tempDew = page.locator(
      ".diagram-tile[data-test='outTemp-dewpoint'] svg[data-test='d3-diagram-svg']"
    );
    const ouTemp = tempDew.locator("path[data-test='line-outTemp']");
    const dewPoint = tempDew.locator("path[data-test='line-dewpoint']");
    const outTempLegendRect = tempDew.getByTestId("legend-rect-outTemp");
    const dewPointLegendRect = tempDew.getByTestId("legend-rect-dewpoint");

    // Light theme lines.
    expect(await ouTemp.getAttribute("stroke")).toBe("#8B0000");
    expect(await dewPoint.getAttribute("stroke")).toBe("#5F9EA0");

    // Light theme legend
    expect(await outTempLegendRect.getAttribute("fill")).toBe("#8B0000");
    expect(await dewPointLegendRect.getAttribute("fill")).toBe("#5F9EA0");

    // Switch to dark theme.
    await page.locator("bx-header #header-global bx-btn").click();

    // Dark theme.
    expect(await ouTemp.getAttribute("stroke")).toBe("#D68585");
    expect(await dewPoint.getAttribute("stroke")).toBe("green");

    // Dark theme legend.
    expect(await outTempLegendRect.getAttribute("fill")).toBe("#D68585");
    expect(await dewPointLegendRect.getAttribute("fill")).toBe("green");
  });
});
