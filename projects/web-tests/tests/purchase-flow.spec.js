import { test, expect } from './fixtures.js';

async function fillCheckout(page, overrides = {}) {
  const data = { Nome: 'Maria Souza', 'E-mail': 'maria@example.com', CEP: '75000000', Cartão: '4111111111111111', ...overrides };
  await page.getByLabel('Nome completo').fill(data.Nome);
  await page.getByLabel('E-mail').fill(data['E-mail']);
  await page.getByLabel(/CEP/).fill(data.CEP);
  await page.getByLabel(/Cartão/).fill(data.Cartão);
}

test.describe('Fluxo crítico: catálogo → carrinho → checkout', () => {
  test('adicionar itens atualiza contador e total do carrinho', async ({ loggedPage: page }) => {
    await page.getByTestId('add-1').click();
    await page.getByTestId('add-2').click();
    await page.getByTestId('add-2').click();
    await expect(page.getByTestId('cart-count')).toHaveText('3');
    await expect(page.getByTestId('cart-total')).toHaveText(/R\$\s?410,00/); // 250 + 2 x 80
  });

  test('compra completa exibe confirmação com o total', async ({ loggedPage: page }) => {
    await page.getByTestId('add-1').click();
    await page.getByTestId('go-checkout').click();
    await expect(page.getByTestId('checkout-total')).toHaveText(/R\$\s?250,00/);
    await fillCheckout(page);
    await page.getByRole('button', { name: 'Finalizar pedido' }).click();
    await expect(page.getByRole('status')).toContainText('Pedido confirmado!');
    await expect(page.getByRole('status')).toContainText('250,00');
  });

  test('checkout com carrinho vazio não confirma o pedido', async ({ loggedPage: page }) => {
    await page.getByTestId('go-checkout').click();
    await fillCheckout(page);
    await page.getByRole('button', { name: 'Finalizar pedido' }).click();
    await expect(page.getByRole('status')).toHaveText('Seu carrinho está vazio.');
  });

  test('sair encerra a sessão e bloqueia o catálogo', async ({ loggedPage: page }) => {
    await page.getByRole('button', { name: 'Sair' }).click();
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
    await page.goto('/catalog.html');
    await expect(page.getByRole('heading', { name: 'Entrar' })).toBeVisible();
  });
});
