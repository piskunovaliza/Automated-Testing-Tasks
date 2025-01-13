import { BasePage } from "./BasePage";
import { Page } from "@playwright/test";

export class InventoryPage extends BasePage {
    constructor({ page }: { page: Page }) {
        super({ page });
    }  

  appLogo = this.page.locator('.app_logo');
  shoppingCartBadge = this.page.locator('.shopping_cart_badge');
  shoppingCartLink = this.page.locator('.shopping_cart_link');

  backpackAddBtn = this.page.locator('#add-to-cart-sauce-labs-backpack');
  bikeLightAddBtn = this.page.locator('#add-to-cart-sauce-labs-bike-light');

  async addBackpackToCart() {
    await this.backpackAddBtn.click();
  }

  async addBikeLightToCart() {
    await this.bikeLightAddBtn.click();
  }

  async goToCart() {
    await this.shoppingCartLink.click();
  }
}
