import { test, expect, type Page } from "@playwright/test";

test.describe("Colored temperature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-mqtt-weewx-html/public_html/index.html");
  });

  test("Temperature color", async ({ page }) => {
    const outTemp = page.locator(".stat-tile[data-test='outTemp']");

    await expect(outTemp).toHaveScreenshot();
    await expect(outTemp).toHaveCSS(
      "background-color",
      "rgba(255, 232, 0, 0.35)"
    );

    const outTempRawValue = outTemp.locator(".stat-title-obs-value .raw");

    await outTempRawValue.evaluate((node) => (node.innerHTML = "-40,0 °C"));
    await expect(outTemp).toHaveCSS(
      "background-color",
      "rgba(255, 0, 255, 0.35)"
    );

    await outTempRawValue.evaluate((node) => (node.innerHTML = "-20,0 °C"));
    await expect(outTemp).toHaveCSS(
      "background-color",
      "rgba(255, 0, 255, 0.35)"
    );

    await outTempRawValue.evaluate((node) => (node.innerHTML = "0,0 °C"));
    await expect(outTemp).toHaveCSS(
      "background-color",
      "rgba(63, 255, 255, 0.35)"
    );

    await outTempRawValue.evaluate((node) => (node.innerHTML = "20,0 °C"));
    await expect(outTemp).toHaveCSS(
      "background-color",
      "rgba(255, 255, 0, 0.35)"
    );

    await outTempRawValue.evaluate((node) => (node.innerHTML = "35,0 °C"));
    await expect(outTemp).toHaveCSS(
      "background-color",
      "rgba(255, 0, 128, 0.35)"
    );
  });
});
