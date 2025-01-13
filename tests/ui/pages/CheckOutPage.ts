import { BasePage } from "./BasePage";
import { Page } from "@playwright/test";

export class CheckoutPage extends BasePage {
    constructor({ page }: { page: Page }) {
        super({ page });
    }

  firstNameInput = this.page.locator('#first-name');
  lastNameInput = this.page.locator('#last-name');
  postalCodeInput = this.page.locator('#postal-code');
  continueButton = this.page.locator('#continue');
  finishButton = this.page.locator('#finish');
  summaryTotalLabel = this.page.locator('.summary_total_label');
  completeHeader = this.page.locator('.complete-header');

  async fillCheckoutInformation({ firstName, lastName, postalCode }: 
    { firstName: string; lastName: string; postalCode: string }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueCheckout() {
    await this.continueButton.click();
  }

  async finishCheckout() {
    await this.finishButton.click();
  }
}
