import { test, expect, type Page } from "@playwright/test";

test.describe("DWD", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-dwd-weewx-html/public_html/index.html");
  });

  test("Front page forecast", async ({ page }) => {
    const forecast = page.locator(".dwd-forecast");
    expect(await forecast.locator("h3").innerText()).toBe(
      "Wettervorhersage für Pulsnitz"
    );
    expect(await forecast.locator("data-test=dwd-pop-label").innerText()).toBe(
      "Niederschlags­wahr­scheinlich­keit"
    );

    expect(await forecast.locator("role=columnheader").count()).toBe(6);

    expect(
      await forecast.locator("role=columnheader").nth(1).innerText()
    ).toBeTruthy();

    await page
      .locator("body > main > section > div > div:nth-child(4)")
      .screenshot({ path: "test/e2e-tests/dwd/forecast-front.png" });

    await expect(
      page.locator("body > main > section > div > div:nth-child(4)")
    ).toHaveScreenshot({ maxDiffPixelRatio: 0.3 });

    // Switch to daily forecast.
    await forecast.locator("role=tab").nth(1).click();
    expect(await forecast.locator("role=columnheader").count()).toBeGreaterThan(
      230
    );

    await page
      .locator("body > main > section > div > div:nth-child(4)")
      .screenshot({ path: "test/e2e-tests/dwd/forecast-front-daily.png" });
  });

  test("DWD Page", async ({ page }) => {
    await Promise.all([
      // Waits for the next navigation.
      // It is important to call waitForNavigation before click to set up waiting.
      page.waitForNavigation(),
      // Triggers a navigation after a timeout.
      page.locator("bx-side-nav").locator("role=listitem").nth(2).click(),
    ]);

    await expect(
      page.locator("dds-image-with-caption[heading='Wetterwarnungen']")
    ).toHaveAttribute("default-src", "dwd/SchilderLZ.jpg");

    await page.screenshot({
      path: "test/e2e-tests/dwd/dwd-page.png",
      fullPage: true,
    });
  });
});
