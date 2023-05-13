import { test, expect, type Page } from "@playwright/test";

test.describe("Basic page elements", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
  });

  test("SideNav and Header", async ({ page }) => {
    await expect(
      page.locator("text=WeeWX Haselbachtal, Saxony, Germany")
    ).toBeVisible();

    // 4 Links: Celestial, Stats, About and Archive & NOAA.
    await expect(
      page.locator(
        "bx-side-nav bx-side-nav-items bx-side-nav-link >> visible=true"
      )
    ).toHaveCount(4);

    // 3 Sub-menus: Years, 2021, 2022.
    await expect(
      page.locator(
        "bx-side-nav bx-side-nav-items bx-side-nav-menu >> visible=true"
      )
    ).toHaveCount(3);

    // Years menu.
    await expect(
      page.locator(
        "bx-side-nav bx-side-nav-items bx-side-nav-menu[title='Years'] bx-side-nav-menu-item"
      )
    ).toHaveCount(2);

    // 2021 menu.
    await expect(
      page.locator(
        "bx-side-nav bx-side-nav-items bx-side-nav-menu[title='2021'] bx-side-nav-menu-item"
      )
    ).toHaveCount(3);

    // 2022 menu.
    await expect(
      page.locator(
        "bx-side-nav bx-side-nav-items bx-side-nav-menu[title='2022'] bx-side-nav-menu-item"
      )
    ).toHaveCount(6);
  });

  test("Footer", async ({ page }) => {
    const footer = page.locator("#footer");
    await expect(footer.locator("text=Weewx uptime:")).toBeVisible();
    await expect(footer.locator("text=Server uptime:")).toBeVisible();
    await expect(footer.locator("text=with Interceptor")).toBeVisible();
    await expect(
      footer.locator("text=Skin: Weather Data Center")
    ).toBeVisible();
    await expect(footer.locator("text=Altitude:")).toBeVisible();
    await expect(footer.locator("text=Latitude:")).toBeVisible();
    await expect(footer.locator("text=Longitude:")).toBeVisible();
    await expect(
      footer.locator(
        "text=This station is controlled by WeeWX, an experimental weather software system written in Python."
      )
    ).toBeVisible();
  });
});

test.describe("Basic pages display", () => {
  test("Alternative index", async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
    await expect(page.locator("h1")).toHaveText("Current Weather Conditions");
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
  test("Classic index", async ({ page }) => {
    await page.goto("artifacts-classic-weewx-html/public_html/index.html");
    await expect(page.locator("h1")).toHaveText("Current Weather Conditions");
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
  test("Alterantive statistics", async ({ page }) => {
    await page.goto(
      "artifacts-alternative-weewx-html/public_html/statistics.html"
    );
    await expect(page.locator("h1")).toHaveText("All time statistics");
    await expect(
      page.locator(
        ".diagram-tile[data-test='appTemp'] svg[data-test='d3-diagram-svg'] g path[data-test='line-appTemp']"
      )
    ).toBeVisible();
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
  test("Classic statistics", async ({ page }) => {
    await page.goto("artifacts-classic-weewx-html/public_html/statistics.html");
    await expect(page.locator("h1")).toHaveText("All time statistics");
    await expect(
      page.locator(
        ".diagram-tile[data-test='appTemp'] svg[data-test='d3-diagram-svg'] g path[data-test='line-appTemp']"
      )
    ).toBeVisible();
    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});

test("Dark mode", async ({ page }) => {
  await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
  await page.locator("bx-header #header-global bx-btn").click();
  await expect(page).toHaveScreenshot({ fullPage: true });

  await page.goto(
    "artifacts-alternative-weewx-html/public_html/statistics.html"
  );
  await expect(
    page.locator(
      ".diagram-tile[data-test='appTemp'] svg[data-test='d3-diagram-svg'] g path[data-test='line-appTemp']"
    )
  ).toBeVisible();
  await expect(page).toHaveScreenshot({ fullPage: true });

  await page.goto("artifacts-classic-weewx-html/public_html/index.html");
  await expect(page).toHaveScreenshot({ fullPage: true });

  await page.goto("artifacts-classic-weewx-html/public_html/statistics.html");
  await expect(
    page.locator(
      ".diagram-tile[data-test='appTemp'] svg[data-test='d3-diagram-svg'] g path[data-test='line-appTemp']"
    )
  ).toBeVisible();
  await expect(page).toHaveScreenshot({ fullPage: true });
});
