import { test, expect, type Page } from "@playwright/test";

test.describe("Legends", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
  });

  test("Basic", async ({ page }) => {
    // Index Temp-Dew.
    const tempDewLegend = page.locator(
      ".diagram-tile[data-test='outTemp-dewpoint'] svg[data-test='d3-diagram-svg'] g.legend"
    );
    expect(
      await tempDewLegend.evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();

    // Month min-max-avg outTemp.
    await page.goto("artifacts-alternative-weewx-html/public_html/month.html");
    const outTempMinMaxAvgLegend = page.locator(
      ".diagram-tile[data-test='outTemp-outTemp-outTemp'] svg[data-test='d3-diagram-svg'] g.legend"
    );
    expect(
      await outTempMinMaxAvgLegend.evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();

    // Stats climatogram.
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    await page.locator("bx-tab[value='climatogram']").click();
    const climatogramLegend = page.locator(
      ".diagram-tile[data-test='rain-outTemp'] svg[data-test='d3-diagram-svg'] g.legend"
    );
    expect(
      await climatogramLegend.evaluate((el) => el.outerHTML)
    ).toMatchSnapshot();
  });

  const legendPositionsToTest = [
    {
      position: "top",
      chart: "outTemp-dewpoint-barometer-pressure",
    },
    {
      position: "bottom",
      chart: "rain-outTemp-outTemp",
    },
    {
      position: "top left",
      chart: "outTemp-dewpoint",
    },
    {
      position: "bottom left",
      chart: "windchill-heatindex",
    },
    {
      position: "bottom right",
      chart: "windSpeed-windGust",
    },
  ];

  for (const { position, chart } of legendPositionsToTest) {
    test(`Position ${position}`, async ({ page }) => {
      await page.goto("artifacts-custom-weewx-html/public_html/index.html");

      const chartElement = page.locator(`.diagram-tile[data-test='${chart}']`);
      await chartElement.scrollIntoViewIfNeeded();

      let legendElement;
      if (position === "top" || position === "bottom") {
        legendElement = chartElement.locator(`div.diagram-legend`);
      } else {
        legendElement = chartElement.locator(
          `svg[data-test='d3-diagram-svg'] g.legend`
        );
      }

      expect(
        await legendElement.evaluate((el) => el.outerHTML)
      ).toMatchSnapshot();

      await expect(chartElement).toHaveScreenshot();
    });
  }
});
