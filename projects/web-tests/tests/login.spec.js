import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('credenciais válidas levam ao catálogo', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('E-mail').fill('qa@example.com');
    await page.getByLabel('Senha').fill('Passw0rd!');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL(/catalog\.html$/);
    await expect(page.getByRole('heading', { name: 'Catálogo' })).toBeVisible();
  });

  test('senha incorreta exibe erro e permanece na tela de login', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('E-mail').fill('qa@example.com');
    await page.getByLabel('Senha').fill('errada');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('alert')).toHaveText('E-mail ou senha inválidos.');
    await expect(page).not.toHaveURL(/catalog/);
  });

  test('campos vazios exibem mensagem de preenchimento obrigatório', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByRole('alert')).toHaveText('Informe e-mail e senha.');
  });

  test('acesso direto ao catálogo sem sessão redireciona para o login', async ({ page }) => {
    await page.goto('/catalog.html');
    await expect(page).toHaveURL(/\/(index\.html)?$/);
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });
});
