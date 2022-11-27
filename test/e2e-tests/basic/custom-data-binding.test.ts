import { test, expect, type Page } from "@playwright/test";

test.describe("Custom data_binding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "artifacts-custom-binding-weewx-html/public_html/index.html"
    );
  });

  test("Stat tiles", async ({ page }) => {
    let testTemp = page.locator(".stat-tile[data-test='test_temp']");
    await expect(testTemp.locator(".value span")).toHaveText("9.6°C");
    await expect(testTemp.locator("[data-test='min'] .stat-value")).toHaveText(
      "-1.1°C"
    );
    await expect(testTemp.locator("[data-test='max'] .stat-value")).toHaveText(
      "14.0°C"
    );

    await page.goto(
      "artifacts-custom-binding-weewx-html/public_html/year.html"
    );

    testTemp = page.locator(".stat-tile[data-test='test_temp']");
    await expect(testTemp.locator(".value span >> nth=0")).toContainText(
      "9.9°C"
    );
    await expect(testTemp.locator("[data-test='min'] .stat-value")).toHaveText(
      "-1.1°C"
    );
    await expect(testTemp.locator("[data-test='max'] .stat-value")).toHaveText(
      "21.1°C"
    );
  });

  test("Diagrams", async ({ page }) => {
    let testTemp = page.locator(".diagram-tile[data-test='test_temp']");
    expect(
      await testTemp.locator(".value script").innerText()
    ).toMatchSnapshot();

    expect(
      await testTemp.locator(".value > .diagram").getAttribute("data-labels")
    ).toMatchSnapshot();
    expect(
      await testTemp.locator(".value > .diagram").getAttribute("data-value")
    ).toMatchSnapshot();
    expect(
      await testTemp.locator(".value > .diagram").getAttribute("data-color")
    ).toMatchSnapshot();
    expect(
      await testTemp.locator(".value > .diagram").getAttribute("data-diagram")
    ).toMatchSnapshot();
    expect(
      await testTemp
        .locator(".value > .diagram")
        .getAttribute("data-aggregate-type")
    ).toMatchSnapshot();
    expect(
      await testTemp
        .locator(".value > .diagram")
        .getAttribute("data-nivo-props")
    ).toMatchSnapshot();

    await page.goto(
      "artifacts-custom-binding-weewx-html/public_html/month.html"
    );

    testTemp = page.locator(".diagram-tile[data-test='test_temp']");
    expect(
      await testTemp.locator(".value script").innerText()
    ).toMatchSnapshot();

    const tempDew = page.locator(
      ".diagram-tile.combined[data-test='outTemp-dewpoint-test_temp']"
    );
    await expect(tempDew.locator(".value script")).toHaveCount(3);
    expect(
      await tempDew.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();
    expect(
      await tempDew.locator(".value script >> nth=2").innerText()
    ).toMatchSnapshot();
  });

  test("Data tables", async ({ page }) => {
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();

    await page.goto(
      "artifacts-custom-binding-weewx-html/public_html/week.html"
    );

    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });
});
