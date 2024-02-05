import { test, expect, type Page } from "@playwright/test";

test.describe("Stat tables", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
  });

  const outTempMinTests = [
    {
      testid: "month-2021-10-min-outTemp",
      expected: "2.9°C",
    },
    {
      testid: "month-2022-06-min-outTemp",
      expected: "8.2°C",
    },
    {
      testid: "year-2021-min-outTemp",
      expected: "-9.3°C",
    },
    {
      testid: "year-2022-min-outTemp",
      expected: "-4.8°C",
    },
    {
      testid: "agg-month-3-min-outTemp",
      expected: "-4.0°C",
    },
    {
      testid: "total-min-outTemp",
      expected: "-9.3°C",
    },
  ];

  const outTempAvgTests = [
    {
      testid: "month-2022-04-avg-outTemp",
      expected: "7.5°C",
    },
    {
      testid: "month-2021-12-avg-outTemp",
      expected: "1.6°C",
    },
    {
      testid: "year-2021-avg-outTemp",
      expected: "5.3°C",
    },
    {
      testid: "year-2022-avg-outTemp",
      expected: "8.5°C",
    },
    {
      testid: "agg-month-4-avg-outTemp",
      expected: "7.5°C",
    },
    {
      testid: "total-avg-outTemp",
      expected: "7.5°C",
    },
  ];

  const outTempMaxTests = [
    {
      testid: "month-2021-10-max-outTemp",
      expected: "18.7°C",
    },
    {
      testid: "month-2022-06-max-outTemp",
      expected: "37.3°C",
    },
    {
      testid: "year-2021-max-outTemp",
      expected: "18.7°C",
    },
    {
      testid: "year-2022-max-outTemp",
      expected: "37.3°C",
    },
    {
      testid: "agg-month-5-max-outTemp",
      expected: "27.1°C",
    },
    {
      testid: "total-max-outTemp",
      expected: "37.3°C",
    },
  ];

  const rainTotalTests = [
    {
      testid: "month-2021-10-sum-rain",
      expected: "0.25 cm",
    },
    {
      testid: "month-2022-06-sum-rain",
      expected: "1.67 cm",
    },
    {
      testid: "year-2021-sum-rain",
      expected: "11.27 cm",
    },
    {
      testid: "year-2022-sum-rain",
      expected: "18.74 cm",
    },
    {
      testid: "agg-month-5-sum-rain",
      expected: "2.03 cm",
    },
    {
      testid: "total-sum-rain",
      expected: "30.01 cm",
    },
  ];

  const rainAvgTests = [
    {
      testid: "month-2021-10-avg-rain",
      expected: "0.25 cm",
    },
    {
      testid: "month-2022-06-avg-rain",
      expected: "1.67 cm",
    },
    {
      testid: "year-2021-avg-rain",
      expected: "3.76 cm",
    },
    {
      testid: "year-2022-avg-rain",
      expected: "3.12 cm",
    },
    {
      testid: "agg-month-5-avg-rain",
      expected: "2.03 cm",
    },
    {
      testid: "total-avg-rain",
      expected: "3.33 cm",
    },
  ];

  test("Out temp min", async ({ page }) => {
    const panel = page.locator("#panel-tables_outtemp");
    const outTempMinTable = panel.getByTestId("min-outTemp");

    await page.locator("bx-tab[value='tables_outtemp']").click();
    await expect(panel).toBeVisible();
    await expect(outTempMinTable).toBeVisible();

    for (const { testid, expected } of outTempMinTests) {
      const outTempMin = outTempMinTable.getByTestId(testid);
      await expect(outTempMin).toContainText(expected);
    }
  });

  test("Out temp avg", async ({ page }) => {
    const panel = page.locator("#panel-tables_outtemp");
    const outTempAvgTable = panel.getByTestId("avg-outTemp");

    await page.locator("bx-tab[value='tables_outtemp']").click();
    await expect(panel).toBeVisible();
    await expect(outTempAvgTable).toBeVisible();

    for (const { testid, expected } of outTempAvgTests) {
      const outTempAvg = outTempAvgTable.getByTestId(testid);
      await expect(outTempAvg).toContainText(expected);
    }
  });

  test("Out temp max", async ({ page }) => {
    const panel = page.locator("#panel-tables_outtemp");
    const outTempMaxTable = panel.getByTestId("max-outTemp");

    await page.locator("bx-tab[value='tables_outtemp']").click();
    await expect(panel).toBeVisible();
    await expect(outTempMaxTable).toBeVisible();

    for (const { testid, expected } of outTempMaxTests) {
      const outTempMax = outTempMaxTable.getByTestId(testid);
      await expect(outTempMax).toContainText(expected);
    }
  });

  test("Rain total", async ({ page }) => {
    const panel = page.locator("#panel-tables_rain");
    const rainTotalTable = panel.getByTestId("sum-rain");

    await page.locator("bx-tab[value='tables_rain']").click();
    await expect(panel).toBeVisible();
    await expect(rainTotalTable).toBeVisible();

    for (const { testid, expected } of rainTotalTests) {
      const rainTotal = rainTotalTable.getByTestId(testid);
      await expect(rainTotal).toContainText(expected);
    }
  });

  test("Rain avg", async ({ page }) => {
    const panel = page.locator("#panel-tables_rain");
    const rainAvgTable = panel.getByTestId("avg-rain");

    await page.locator("bx-tab[value='tables_rain']").click();
    await expect(panel).toBeVisible();
    await expect(rainAvgTable).toBeVisible();

    for (const { testid, expected } of rainAvgTests) {
      const rainAvg = rainAvgTable.getByTestId(testid);
      await expect(rainAvg).toContainText(expected);
    }
  });
});
