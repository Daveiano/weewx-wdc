import { test, expect } from "@playwright/test";

test.describe("Radar and Externals embeds", () => {
  test("Front page", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/index.html");

    const radarExternalsTile = page.locator(".radar-container");

    await expect(radarExternalsTile).toBeVisible();
    await expect(radarExternalsTile.locator("bx-tabs")).toBeVisible();
    await expect(radarExternalsTile.locator("bx-tabs bx-tab")).toHaveCount(4);

    await expect(radarExternalsTile.locator("#panel-radar")).toBeVisible();
    await expect(
      radarExternalsTile.locator("#panel-external_1")
    ).not.toBeVisible();

    // Select webcam 1.
    await page.locator("bx-tab[value='external_1']").click();

    await expect(
      page.locator('p:text("Webcam 1, facing North")')
    ).toBeVisible();

    await expect(radarExternalsTile).toHaveScreenshot();
  });

  test("Externals page", async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/externals.html");

    await expect(page.locator(".bx--tile.webcam-tile")).toHaveCount(2);

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
