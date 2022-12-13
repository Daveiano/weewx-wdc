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
});
