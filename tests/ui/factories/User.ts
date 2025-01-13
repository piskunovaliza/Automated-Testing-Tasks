export class User {
    get validUser() {
        return {
            username: 'standard_user',
            password: 'secret_sauce'
        }
    }

    get invalidUser() {
        return {
            username: 'standard_user_123',
            password: 'secret_sauce_123'
        }
    }
}