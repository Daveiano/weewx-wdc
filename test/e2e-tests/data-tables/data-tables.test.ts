import { test, expect, type Page } from "@playwright/test";

test.describe("Data tables", () => {
  test("index", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
    // Do not test the component as is, just test that we are giving the currect values in.
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });

  test("statistics", async ({ page }) => {
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    // Do not test the component as is, just test that we are giving the currect values in.
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });
});
