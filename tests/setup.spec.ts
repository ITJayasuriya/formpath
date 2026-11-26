import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function continueFlow(page: Page) {
  await page.getByRole("button", { name: "Continue" }).click();
}
async function enterDates(page: Page) {
  await page.getByLabel("Start date", { exact: true }).fill("2026-12-01");
  await page.getByLabel("End date", { exact: true }).fill("2026-12-03");
  await continueFlow(page);
}

test("keyboard errors, branch correction, active-only demo receipt", async ({
  page,
}) => {
  await page.goto("/");
  await continueFlow(page);
  await expect(page.locator("#flow-errors")).toBeFocused();
  await page.getByRole("link", { name: "Equipment: Enter an answer" }).click();
  await expect(page.getByRole("radio", { name: "Drill" })).toBeFocused();
  await page.keyboard.press("Space");
  await continueFlow(page);
  await expect(
    page.getByRole("heading", { name: "Who is borrowing?" }),
  ).toBeFocused();
  await page.getByRole("radio", { name: "Organisation", exact: true }).check();
  await continueFlow(page);
  await page
    .getByLabel("Organisation name", { exact: true })
    .fill("Synthetic workshop");
  await continueFlow(page);
  await enterDates(page);
  await page.getByRole("button", { name: "Change Borrower type" }).click();
  await expect(
    page.getByRole("radio", { name: "Organisation", exact: true }),
  ).toBeFocused();
  await page.getByRole("radio", { name: "Individual" }).check();
  await expect(page.getByRole("status")).toContainText(
    "Hidden answers are kept",
  );
  await page.getByRole("button", { name: "Confirm changes" }).click();
  await expect(
    page.getByRole("heading", { name: "Check your answers" }),
  ).toBeFocused();
  await expect(page.locator(".review")).not.toContainText("Synthetic workshop");
  await expect(
    page.getByRole("button", { name: "Change Organisation name" }),
  ).toHaveCount(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Generate demo receipt" }).click();
  await expect(
    page.getByRole("heading", { name: "Your demo receipt" }),
  ).toBeFocused();
  await expect(page.locator("pre")).not.toContainText("organisationName");
  await expect(
    page.getByText("No application was submitted", { exact: false }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Choose equipment" }),
  ).toBeVisible();
  await expect(page.getByRole("radio", { name: "Drill" })).not.toBeChecked();
});

test("mobile date-order recovery, back retention and error semantics", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("radio", { name: "Projector" }).check();
  await continueFlow(page);
  await page.getByRole("radio", { name: "Individual" }).check();
  await continueFlow(page);
  await page.getByLabel("Start date", { exact: true }).fill("2026-12-03");
  await page.getByLabel("End date", { exact: true }).fill("2026-12-01");
  await continueFlow(page);
  await expect(page.locator("#flow-errors")).toBeFocused();
  await expect(page.getByLabel("End date", { exact: true })).toHaveAttribute(
    "aria-invalid",
    "true",
  );
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("link", { name: "End date: End date must" }).click();
  await expect(page.getByLabel("End date", { exact: true })).toBeFocused();
  await page.getByLabel("End date", { exact: true }).fill("2026-12-04");
  await expect(page.locator("#flow-errors")).toHaveCount(0);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByRole("radio", { name: "Individual" })).toBeChecked();
  await continueFlow(page);
  await expect(page.getByLabel("End date", { exact: true })).toHaveValue(
    "2026-12-04",
  );
  await continueFlow(page);
  await page.getByRole("button", { name: "Change Start date" }).click();
  await expect(page.getByLabel("Start date", { exact: true })).toBeFocused();
  await page.getByLabel("Start date", { exact: true }).fill("2026-12-05");
  await page.getByRole("button", { name: "Confirm changes" }).click();
  await expect(page.locator("#flow-errors")).toBeFocused();
  await page.getByLabel("End date", { exact: true }).fill("2026-12-06");
  await page.getByRole("button", { name: "Confirm changes" }).click();
  await expect(
    page.getByRole("heading", { name: "Check your answers" }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
