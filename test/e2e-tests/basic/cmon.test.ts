import { test, expect } from "@playwright/test";

test.describe("CMON", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(
      "artifacts-cmon-weewx-html/public_html/computer-monitor.html"
    );
  });

  test("CMON page", async ({ page }) => {
    const navLink = page.getByRole("link", { name: "Computer Monitor" });
    await expect(navLink).toBeVisible();

    // Stat tiles.
    const cpuUser = page.locator('[data-test="cpu_user"]');
    await expect(cpuUser.locator(".value span.raw")).toHaveText(/1850%/);
    await expect(cpuUser.locator("[data-test='max'] .stat-value")).toHaveText(
      "4953%"
    );

    const cpuTemp = page.locator('[data-test="cpu_temp"]');
    await expect(cpuTemp.locator(".value span.raw")).toHaveText(/45.3°C/);
    await expect(cpuTemp.locator("[data-test='max'] .stat-value")).toHaveText(
      "47.7°C"
    );

    const procTotal = page.locator('[data-test="proc_total"]');
    await expect(procTotal.locator(".value span.raw")).toHaveText("202.0");
    await expect(procTotal.locator("[data-test='max'] .stat-value")).toHaveText(
      "214.0"
    );

    // Charts.
    const cpuTempChart = page.locator(".diagram-tile[data-test='cpu_temp']");
    expect(
      await cpuTempChart.locator(".value script").innerText()
    ).toMatchSnapshot();
    await expect(cpuTempChart).toHaveScreenshot();

    const loadChart = page.locator(
      ".diagram-tile[data-test='load1-load5-load15']"
    );
    await expect(loadChart.locator(".value script")).toHaveCount(3);
    expect(
      await loadChart.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await loadChart.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();
    expect(
      await loadChart.locator(".value script >> nth=2").innerText()
    ).toMatchSnapshot();
    await expect(loadChart).toHaveScreenshot();

    const netChart = page.locator(
      ".diagram-tile[data-test='net_eth0_rbytes-net_eth0_rpackets-net_eth0_tbytes-net_eth0_tpackets']"
    );
    await expect(netChart.locator(".value script")).toHaveCount(4);
    expect(
      await netChart.locator(".value script >> nth=0").innerText()
    ).toMatchSnapshot();
    expect(
      await netChart.locator(".value script >> nth=1").innerText()
    ).toMatchSnapshot();
    expect(
      await netChart.locator(".value script >> nth=2").innerText()
    ).toMatchSnapshot();
    expect(
      await netChart.locator(".value script >> nth=3").innerText()
    ).toMatchSnapshot();
    await expect(netChart).toHaveScreenshot();

    // Lazy table testing.
    expect(
      await page.locator(".data-table-tile script").innerText()
    ).toMatchSnapshot();
  });
});
