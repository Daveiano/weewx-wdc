import { test, expect, type Page } from "@playwright/test";

test.describe("Modal", () => {
  const modalTestExpectations = [
    {
      url: "artifacts-custom-weewx-html/public_html/index.html",
      external: true,
      statTiles: true,
    },
    {
      url: "artifacts-custom-weewx-html/public_html/week.html",
      external: false,
      statTiles: true,
    },
    {
      url: "artifacts-custom-weewx-html/public_html/month.html",
      external: false,
      statTiles: true,
    },
    {
      url: "artifacts-custom-weewx-html/public_html/year.html",
      external: false,
      statTiles: true,
    },
  ];

  for (const testExpectation of modalTestExpectations) {
    test(`Modal, url: ${testExpectation.url}`, async ({ page }) => {
      await page.goto(testExpectation.url);

      const modalStatET = page.locator("#modal-ET"),
        modalExternal1 = page.locator("#modal-external_1"),
        modalRadar = page.locator("#modal-radar-default");

      await expect(modalStatET).toBeHidden();
      await expect(modalExternal1).toBeHidden();
      await expect(modalRadar).toBeHidden();

      // Open stat tile modal.
      await page.locator('.stat-tile[data-observation="ET"]').click();
      await expect(modalStatET).toBeVisible();
      await expect(modalExternal1).toBeHidden();
      await expect(modalRadar).toBeHidden();

      await expect(page).toHaveScreenshot();

      // Close stat tile modal.
      await modalStatET.getByRole("button", { name: "Close" }).click();
      await expect(modalStatET).toBeHidden();

      if (testExpectation.external) {
        // Open Radar tile modal.
        await page.locator("#panel-radar").click();
        await expect(modalRadar).toBeVisible();
        await expect(modalStatET).toBeHidden();
        await expect(modalExternal1).toBeHidden();

        await expect(page).toHaveScreenshot();

        // Close Radar tile modal.
        await modalRadar.getByRole("button", { name: "Close" }).click();
        await expect(modalRadar).toBeHidden();

        // Open external tile modal.
        await page.locator("#tab-external_1").click();
        await page.locator("#panel-external_1").click();
        await expect(modalExternal1).toBeVisible();
        await expect(modalStatET).toBeHidden();
        await expect(modalRadar).toBeHidden();

        await expect(page).toHaveScreenshot();

        // Close external tile modal.
        await modalExternal1.getByRole("button", { name: "Close" }).click();
        await expect(modalExternal1).toBeHidden();
      }
    });
  }
});
