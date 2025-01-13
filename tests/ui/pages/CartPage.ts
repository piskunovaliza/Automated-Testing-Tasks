import { BasePage } from "./BasePage";
import { Page } from "@playwright/test";

export class CartPage extends BasePage {
    constructor({ page }: { page: Page }) {
        super({ page });
    }

  cartItems = this.page.locator('.cart_item');
  checkoutButton = this.page.locator('#checkout');

  removeBackpackBtn = this.page.locator('#remove-sauce-labs-backpack');

  backpackItem = this.page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
  bikeLightItem = this.page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });

  async removeBackpack() {
    await this.removeBackpackBtn.click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
