import { expect, test } from "../fixtures/base";
import { closeModal, openSettings } from "../helpers/modals";

test.describe("App settings", () => {
  test("Settings modal opens when Settings button is clicked", async ({
    page,
  }) => {
    await openSettings(page);
    await expect(page.locator("[role='dialog']")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  });

  test("Settings modal closes via the X button", async ({ page }) => {
    await openSettings(page);
    await closeModal(page);
    await expect(page.locator("[role='dialog']")).not.toBeVisible();
  });

  test("Color name highlighting can be toggled", async ({ page }) => {
    await openSettings(page);
    const row = page.locator("[data-test='setting-highlight-color-names']");
    const checkbox = row.locator("input[type='checkbox']");
    await expect(checkbox).not.toBeChecked();
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  });

  test("Interface theme — toggling switches between Light and Dark", async ({
    page,
  }) => {
    await openSettings(page);
    const btn = page.locator("[data-test='setting-theme-btn']");
    const initialText = await btn.textContent();
    await btn.click();
    const newText = await btn.textContent();
    expect(newText).not.toBe(initialText);
  });

  test("Dark mode is enabled by default and can be toggled off", async ({ page }) => {
    await expect(page.locator(".dark-mode").first()).toBeVisible();
    await openSettings(page);
    await page.click("[data-test='setting-theme-btn']");
    await closeModal(page);
    await expect(page.locator(".dark-mode").first()).not.toBeVisible();
  });

  test("Show Imposter setting can be toggled", async ({
    page,
  }) => {
    // Activate crew to see crew stats
    await page.click("[data-test='activate-all-btn']");
    await openSettings(page);
    // Uncheck "Show Imposter checkbox"
    const row = page.locator("[data-test='setting-show-imposter']");
    await row.locator("input[type='checkbox']").uncheck();
    await closeModal(page);
    await expect(row.locator("input[type='checkbox']")).not.toBeChecked();
  });

  test("Show Tasks setting can be toggled", async ({
    page,
  }) => {
    await page.click("[data-test='activate-all-btn']");
    await openSettings(page);
    const row = page.locator("[data-test='setting-show-tasks']");
    await row.locator("input[type='checkbox']").uncheck();
    await closeModal(page);
    await expect(row.locator("input[type='checkbox']")).not.toBeChecked();
  });

  test("Show Meetings setting can be toggled", async ({
    page,
  }) => {
    await page.click("[data-test='activate-all-btn']");
    await openSettings(page);
    const row = page.locator("[data-test='setting-show-meetings']");
    await row.locator("input[type='checkbox']").uncheck();
    await closeModal(page);
    await expect(row.locator("input[type='checkbox']")).not.toBeChecked();
  });

  test("Show player names — toggling the checkbox enables the Edit names button", async ({
    page,
  }) => {
    await openSettings(page);
    const row = page.locator("[data-test='setting-show-player-names']");
    await row.locator("input[type='checkbox']").check();
    await expect(
      page.locator("[data-test='edit-player-names-btn']")
    ).toBeVisible();
  });

  test("Edit player names — opens player names editing view", async ({
    page,
  }) => {
    await openSettings(page);
    await page
      .locator("[data-test='setting-show-player-names']")
      .locator("input[type='checkbox']")
      .check();
    await page.click("[data-test='edit-player-names-btn']");
    await expect(page.locator("text=Player names")).toBeVisible();
  });

  test("Can track own color setting can be toggled", async ({ page }) => {
    await openSettings(page);
    const row = page.locator("[data-test='setting-track-own-color']");
    await row.locator("input[type='checkbox']").uncheck();
    await expect(row.locator("input[type='checkbox']")).not.toBeChecked();
  });

  test("Reset notes each game checkbox is checked by default", async ({
    page,
  }) => {
    await openSettings(page);
    const row = page.locator("[data-test='setting-reset-notes']");
    await expect(row.locator("input[type='checkbox']")).toBeChecked();
  });

  test("Show round notes checkbox is checked by default", async ({ page }) => {
    await openSettings(page);
    const row = page.locator("[data-test='setting-show-round-notes']");
    await expect(row.locator("input[type='checkbox']")).toBeChecked();
  });

  test("Improve map contrast checkbox is checked by default", async ({
    page,
  }) => {
    await openSettings(page);
    const row = page.locator("[data-test='setting-improve-map-contrast']");
    await expect(row.locator("input[type='checkbox']")).toBeChecked();
  });
});
