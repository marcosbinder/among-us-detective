import { expect, test } from "../fixtures/base";
import { closeModal, openTasks } from "../helpers/modals";

test.describe("Tasks modal", () => {
  test("Tasks modal opens when Tasks button is clicked", async ({ page }) => {
    await openTasks(page);
    await expect(page.locator("[role='dialog']")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Tasks" })).toBeVisible();
  });

  test("Tasks modal shows a list of tasks for the current map", async ({
    page,
  }) => {
    await openTasks(page);
    // Tasks table should contain tasks
    await expect(page.locator("[role='dialog'] table tbody tr").first()).toBeVisible();
  });

  test("Map selector is visible inside the tasks modal", async ({ page }) => {
    await openTasks(page);
    await expect(
      page.locator("[role='dialog'] [data-test='map-selector']")
    ).toBeVisible();
  });

  test("Switching maps inside tasks modal loads the new map's tasks", async ({
    page,
  }) => {
    await openTasks(page);
    // Verify initial map has tasks
    await expect(page.locator("[role='dialog'] table tbody tr").first()).toBeVisible();

    // Switch to Mira HQ
    await page.locator("[role='dialog'] [data-test='map-btn-mira-hq']").click();
    await expect(page.locator("[role='dialog'] table tbody tr").first()).toBeVisible();
  });

  test("Tasks modal closes via the X button", async ({ page }) => {
    await openTasks(page);
    await closeModal(page);
    await expect(page.locator("[role='dialog']")).not.toBeVisible();
  });
});
