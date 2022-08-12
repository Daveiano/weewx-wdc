import { test, expect, type Page } from "@playwright/test";

test.describe("Alternative index.html", () => {
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
    ).toHaveCount(10);

    // 2022 menu.
    await expect(
      page.locator(
        "bx-side-nav bx-side-nav-items bx-side-nav-menu[title='2022'] bx-side-nav-menu-item"
      )
    ).toHaveCount(6);
  });

  test("Footer", async ({ page }) => {});

  test("Basic Display", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Current Weather Conditions");

    await expect(page).toHaveScreenshot({ fullPage: true });
  });

  test("Stat tiles", async ({ page }) => {
    await expect(
      page.locator(".stat-tile[data-test='outTemp'] .value span")
    ).toHaveText("20.9°C");
  });
});

test.describe("Classic index.html", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-classic-weewx-html/public_html/index.html");
  });

  test("Basic Display", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("Current Weather Conditions");

    await expect(page).toHaveScreenshot({ fullPage: true });
  });
});
