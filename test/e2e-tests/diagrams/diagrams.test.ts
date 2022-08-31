import { test, expect, type Page } from "@playwright/test";

test.describe("Diagrams", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
  });

  // Do not test the component as is, just test that we are giving the currect values in.
  test("Diagram tiles", async ({ page }) => {
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
  });

  test("Combined diagram tiles", async ({ page }) => {
    const tempDew = page.locator(
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

  // @todo Add test for custom "show_beafort = False".
  test("Windrose", async ({ page }) => {
    let windrose = page.locator(".diagram-tile[data-test='windrose']");
    expect(
      await windrose.locator(".value script").innerText()
    ).toMatchSnapshot();

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
});
