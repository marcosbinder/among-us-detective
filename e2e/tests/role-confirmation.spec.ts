import { expect, test } from "../fixtures/base";
import { activateAllCrew, dragElement } from "../helpers/crew";

test.describe("Role confirmation", () => {
  test.beforeEach(async ({ page }) => {
    await activateAllCrew(page);
  });

  test("assigning a crew role stays as a claim until confirmed", async ({ page }) => {
    const member = page.locator("[data-test='crew-member-red']");

    await member.click();
    await page.getByRole("button", { name: "Detective" }).click();

    await expect(page.locator("[data-test='crew-column-trusted'] [data-test='crew-member-red']")).not.toBeVisible();
    await expect(page.locator("[data-test='crew-column-unknown'] [data-test='crew-member-red']")).toBeVisible();

    await member.click();
    await page.getByRole("button", { name: "Confirm role" }).click();

    await expect(page.locator("[data-test='crew-column-hard-clear'] [data-test='crew-member-red']")).toBeVisible();
  });

  test("moving an impostor role to Impostor confirms it, while a crew role is cleared", async ({ page }) => {
    const impostorMember = page.locator("[data-test='crew-member-red']");
    await impostorMember.click();
    await page.getByRole("button", { name: "Shapeshifter" }).click();
    await dragElement(page, "[data-test='crew-member-red']", "[data-test='crew-column-impostor']");

    await expect(page.locator("[data-test='crew-column-impostor'] [data-test='crew-member-red']")).toBeVisible();
    await expect(page.locator("[data-test='crew-member-red']")).toHaveAttribute("title", /Verified/);

    const crewMember = page.locator("[data-test='crew-member-blue']");
    await crewMember.click();
    await page.getByRole("button", { name: "Detective" }).click();
    await dragElement(page, "[data-test='crew-member-blue']", "[data-test='crew-column-impostor']");

    await expect(page.locator("[data-test='crew-column-impostor'] [data-test='crew-member-blue']")).toBeVisible();
    await expect(page.locator("[data-test='crew-member-blue']")).toHaveAttribute("title", /\(.*Claimed/);
  });
});