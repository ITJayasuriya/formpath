import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Upstream Firefox regression: https://github.com/microsoft/playwright/issues/44135
// Keep this independent of React, date widgets and FormPath transitions.
test("label lookup after axe scans a named region", async ({ page }) => {
  await page.setContent(`<!doctype html><html lang="en"><head><title>ARIA probe</title></head>
    <body><main><section aria-labelledby="title"><h1 id="title">Dates</h1>
    <label for="start">Start date</label><input id="start" type="date" required>
    </section></main></body></html>`);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByLabel("Start date", { exact: true }).fill("2026-12-03");
  await expect(page.getByLabel("Start date", { exact: true })).toHaveValue(
    "2026-12-03",
  );
});

test("required date control without an axe scan", async ({ page }) => {
  await page.setContent(
    '<label for="start">Start date</label><input id="start" type="date" required>',
  );
  await page.getByLabel("Start date").fill("2026-12-03");
  await expect(page.getByLabel("Start date")).toHaveValue("2026-12-03");
});
