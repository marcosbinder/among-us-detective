import { expect, test } from "../fixtures/base";

test.describe("Map display and selection", () => {
  test("Map is hidden by default; Show map button is visible", async ({
    page,
  }) => {
    await expect(page.locator("[data-test='map-container']")).not.toBeVisible();
    await expect(
      page.locator("[data-test='toggle-map-btn']").first()
    ).toBeVisible();
  });

  test("Clicking Show map reveals the map container", async ({ page }) => {
    await page.click("[data-test='toggle-map-btn']");
    await expect(page.locator("[data-test='map-container']")).toBeVisible();
  });

  test("Clicking Hide map hides the map container again", async ({ page }) => {
    await page.click("[data-test='toggle-map-btn']"); // show
    // After showing, click the now-visible "Hide map" button specifically
    await page.locator("[data-test='toggle-map-btn']:visible").first().click(); // hide
    await expect(page.locator("[data-test='map-container']")).not.toBeVisible();
  });

  test("Map selector is visible when map is shown", async ({ page }) => {
    await page.click("[data-test='toggle-map-btn']");
    await expect(
      page.locator("[data-test='map-selector']").first()
    ).toBeVisible();
  });

  test.describe("Map switching", () => {
    test.beforeEach(async ({ page }) => {
      await page.click("[data-test='toggle-map-btn']");
    });

    test("The Skeld is selected by default", async ({ page }) => {
      await expect(
        page.locator("[data-test='map-btn-the-skeld']").first()
      ).toHaveClass(/bg-emerald-600/);
    });

    test("Selecting Mira HQ activates its button", async ({ page }) => {
      await page
        .locator("[data-test='map-btn-mira-hq']")
        .first()
        .click();
      await expect(
        page.locator("[data-test='map-btn-mira-hq']").first()
      ).toHaveClass(/bg-emerald-600/);
      await expect(
        page.locator("[data-test='map-btn-the-skeld']").first()
      ).not.toHaveClass(/bg-emerald-600/);
    });

    test("Selecting Polus activates its button", async ({ page }) => {
      await page
        .locator("[data-test='map-btn-polus']")
        .first()
        .click();
      await expect(
        page.locator("[data-test='map-btn-polus']").first()
      ).toHaveClass(/bg-emerald-600/);
    });

    test("Selecting The Airship activates its button", async ({ page }) => {
      await page
        .locator("[data-test='map-btn-the-airship']")
        .first()
        .click();
      await expect(
        page.locator("[data-test='map-btn-the-airship']").first()
      ).toHaveClass(/bg-emerald-600/);
    });

    test("Selecting The Fungle activates its button", async ({ page }) => {
      await page
        .locator("[data-test='map-btn-the-fungle']")
        .first()
        .click();
      await expect(
        page.locator("[data-test='map-btn-the-fungle']").first()
      ).toHaveClass(/bg-emerald-600/);
    });

    test("Mira HQ shows a Show/Hide sensors button", async ({ page }) => {
      await page
        .locator("[data-test='map-btn-mira-hq']")
        .first()
        .click();
      await expect(
        page.locator("[data-test='toggle-sensors-btn']")
      ).toBeVisible();
    });

    test("Mira HQ sensors toggle shows and hides the overlay", async ({
      page,
    }) => {
      await page
        .locator("[data-test='map-btn-mira-hq']")
        .first()
        .click();
      await page.click("[data-test='toggle-sensors-btn']");
      // After showing sensors, button text changes to "Hide sensors"
      await expect(page.locator("[data-test='toggle-sensors-btn']")).toHaveText(
        "Hide sensors"
      );
      await page.click("[data-test='toggle-sensors-btn']");
      await expect(page.locator("[data-test='toggle-sensors-btn']")).toHaveText(
        "Show sensors"
      );
    });
  });
});
