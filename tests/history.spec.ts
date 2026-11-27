import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const base = "#/apply/equipment-loan";

test("deep links recover without answers or fabricated receipts", async ({
  page,
}) => {
  for (const target of [
    "review",
    "receipt",
    "step/dates",
    "step/%E0%A4%A",
    "step/missing",
  ]) {
    await page.goto(`/${base}/${target}`);
    await expect(page).toHaveURL(new RegExp(`${base}/step/equipment$`));
    await expect(page.locator("#flow-heading")).toBeFocused();
    await expect(page.getByRole("status")).toContainText(
      "That page is unavailable",
    );
    await expect(
      page.getByRole("heading", { name: "Your demo receipt" }),
    ).toHaveCount(0);
  }
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("browser back/forward retain answers and replace obsolete branches", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("radio", { name: "Drill" }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: "Organisation", exact: true }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page
    .getByLabel("Organisation name", { exact: true })
    .fill("Synthetic history group");
  await page.goBack();
  await expect(
    page.getByRole("radio", { name: "Organisation", exact: true }),
  ).toBeChecked();
  await expect(page.locator("#flow-heading")).toBeFocused();
  await page.goForward();
  await expect(
    page.getByLabel("Organisation name", { exact: true }),
  ).toHaveValue("Synthetic history group");
  await page.goBack();
  await page.getByRole("radio", { name: "Individual" }).check();
  await page.goForward();
  await expect(page).toHaveURL(new RegExp(`${base}/step/dates$`));
  await expect(page.getByRole("status")).toContainText(
    "That page is unavailable",
  );
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`${base}/step/borrower$`));
  await page.getByRole("radio", { name: "Organisation", exact: true }).check();
  await page.goForward();
  await expect(page).toHaveURL(new RegExp(`${base}/step/dates$`));
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByLabel("Organisation name", { exact: true }),
  ).toHaveValue("Synthetic history group");
  expect(
    await page.evaluate(() => JSON.stringify(history.state)),
  ).not.toContain("Synthetic");
  await expect(page).not.toHaveURL(/Synthetic/);
});

test("same-step review edit, receipt back and reload recover safely", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/");
  await page.getByRole("radio", { name: "Drill" }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("radio", { name: "Individual" }).check();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByLabel("Start date", { exact: true }).fill("2026-12-01");
  await page.getByLabel("End date", { exact: true }).fill("2026-12-03");
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Change End date" }).click();
  await expect(page.getByLabel("End date", { exact: true })).toBeFocused();
  await page.goBack();
  await expect(page.locator("#flow-heading")).toHaveText("Check your answers");
  await page.goForward();
  await expect(page.locator("#flow-heading")).toHaveText("Requested dates");
  await expect(page.getByRole("button", { name: "Continue" })).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Generate demo receipt" }).click();
  await page.goBack();
  await expect(page.locator("#flow-heading")).toHaveText("Requested dates");
  await page.goForward();
  await expect(page.locator("#flow-heading")).toHaveText("Check your answers");
  await page.reload();
  await expect(page).toHaveURL(new RegExp(`${base}/step/equipment$`));
  await expect(page.getByRole("radio", { name: "Drill" })).not.toBeChecked();
});
