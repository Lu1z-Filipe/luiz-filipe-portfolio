import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  /** Página já autenticada: faz login pela UI uma vez por teste. */
  loggedPage: async ({ page }, use) => {
    await page.goto('/');
    await page.getByLabel('E-mail').fill('qa@example.com');
    await page.getByLabel('Senha').fill('Passw0rd!');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/catalog\.html$/);
    await use(page);
  },
});

export { expect };
