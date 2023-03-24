import { test, expect } from "@playwright/test";

// @todo Add real testing once https://github.com/microsoft/playwright/issues/4488 hits.
test.describe("MQTT Front page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("artifacts-mqtt-weewx-html/public_html/index.html");
  });

  test("Basic notification rendering", async ({ page }) => {
    const mqttInfoContainer = page.locator("#notification-container-mqtt");

    expect(mqttInfoContainer).toBeTruthy();
    await mqttInfoContainer.waitFor({ state: "visible" });

    const mqttNotfication = mqttInfoContainer.locator("bx-inline-notification");
    expect(await mqttNotfication.getAttribute("title")).toBe(
      "Could not connect to live weather station."
    );
    expect(await mqttNotfication.getAttribute("kind")).toBe("error");
  });
});
