import { BasePage } from "./BasePage";
import { Page } from "@playwright/test";

export class LoginPage extends BasePage {
    constructor({ page }: { page: Page }) {
        super({ page });
    }

    usernameInput = this.page.locator('[data-test="username"]');
    passwordInput = this.page.locator('[data-test="password"]');
    loginButton = this.page.locator('[data-test="login-button"]');

    async goto() {
        await this.page.goto('https://www.saucedemo.com/');
    }

    async login({ username, password }) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click()
    }
}