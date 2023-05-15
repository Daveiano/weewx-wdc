import { test, expect } from "@playwright/test";

test.describe("Sensor Status", () => {
  test("Sensor Stauts page", async ({ page }) => {
    await page.goto(
      "artifacts-sensor-status-weewx-html/public_html/sensor-status.html"
    );

    const rxCheckPercentStatTile = page.locator(
      ".stat-tile[data-test='rxCheckPercent']"
    );
    await expect(rxCheckPercentStatTile.locator(".value span.raw")).toHaveText(
      "100%"
    );
    await expect(
      rxCheckPercentStatTile.locator("[data-test='min'] .stat-value")
    ).toHaveText("94%");
    await expect(
      rxCheckPercentStatTile.locator("[data-test='max'] .stat-value")
    ).toHaveText("100%");

    const consBatteryVoltageStatTile = page.locator(
      ".stat-tile[data-test='consBatteryVoltage']"
    );
    await expect(
      consBatteryVoltageStatTile.locator(".value span.raw")
    ).toHaveText(/3.9 V/);
    await expect(
      consBatteryVoltageStatTile.locator("[data-test='min'] .stat-value")
    ).toHaveText("3.9 V");
    await expect(
      consBatteryVoltageStatTile.locator("[data-test='max'] .stat-value")
    ).toHaveText("3.9 V");

    const rxCheckPercentChart = page.locator(
      ".diagram-tile[data-test='rxCheckPercent']"
    );
    expect(
      await rxCheckPercentChart.locator(".value script").innerText()
    ).toMatchSnapshot();

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
