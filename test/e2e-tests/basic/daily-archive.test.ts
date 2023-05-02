import { test, expect, type Page } from "@playwright/test";

test.describe("Daily archive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-custom-weewx-html/public_html/statistics.html");
  });

  test("Selector", async ({ page }) => {
    const selector = page.locator("*[data-test='statistics-day-select']");

    await expect(selector).toBeVisible();

    await expect(selector.locator(".bx--form__helper-text")).toHaveText(
      "Choose a day to view a statistics page. You can also filter/search for a date by start typing, eg: 2022-06-23, Format is %Y-%m-%d"
    );

    expect(await selector.locator("script").innerText()).toMatchSnapshot();

    await expect(page).toHaveScreenshot();

    await selector.getByRole("combobox").click();

    await expect(page).toHaveScreenshot();

    await Promise.all([
      // Waits for the next navigation.
      // It is important to call waitForNavigation before click to set up waiting.
      page.waitForNavigation(),
      // Triggers a navigation after a timeout.
      selector.getByRole("option").nth(9).click(),
    ]);

    expect(page.url()).toContain("day-archive/day-2021-10-25.html");

    await expect(page).toHaveScreenshot({ fullPage: true });
  });

  test("Pages", async ({ page }) => {
    await page.goto(
      "artifacts-custom-weewx-html/public_html/day-archive/day-2021-03-04.html"
    );
    await expect(page).toHaveScreenshot({ fullPage: true });

    await page.goto(
      "artifacts-custom-weewx-html/public_html/day-archive/day-2022-06-23.html"
    );
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
