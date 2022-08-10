import { test, expect, type Page } from "@playwright/test";

test.describe("Alternative index.html", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-alternative-weewx-html/public_html/index.html");
  });

  test("Basic Display", async ({ page }) => {
    // expect(container.querySelector("h1")).not.toBeNull();
    // expect(container.querySelector("h1")).toHaveTextContent(
    //   "Current Weather Conditions"
    // );
    // expect(
    //   getByText(container, "Haselbachtal, Saxony, Germany")
    // ).toBeInTheDocument();
    // const sideNav = getByLabelText(container, "Side navigation");
    // expect(getAllByRole(sideNav, "listitem", { hidden: true }).length).toBe(10);
    await expect(page.locator("h1")).toHaveText("Current Weather Conditions");
  });
});
