import { test, expect, type Page } from "@playwright/test";

test.describe("Data tables", () => {
  test("index", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
    // Do not test the component as is, just test that we are giving the currect values in.
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });

  test("week", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/week.html");
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });

  test("month", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/month.html");
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });

  test("year", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/year.html");
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });

  test("statistics", async ({ page }) => {
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });
});
