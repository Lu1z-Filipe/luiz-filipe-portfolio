import { test, expect } from './fixtures.js';

test.describe('Validação do formulário de checkout', () => {
  test.beforeEach(async ({ loggedPage: page }) => {
    await page.getByTestId('add-2').click();
    await page.getByTestId('go-checkout').click();
  });

  test('formulário vazio exibe os quatro erros e marca campos como inválidos', async ({ loggedPage: page }) => {
    await page.getByRole('button', { name: 'Finalizar pedido' }).click();
    for (const msg of [
      'Informe nome e sobrenome.',
      'Informe um e-mail válido.',
      'O CEP deve ter 8 dígitos numéricos.',
      'O cartão deve ter 16 dígitos numéricos.',
    ]) {
      await expect(page.getByText(msg)).toBeVisible();
    }
    await expect(page.getByLabel('E-mail')).toHaveAttribute('aria-invalid', 'true');
  });

  const invalidos = [
    ['nome sem sobrenome', 'Nome completo', 'Maria', 'Informe nome e sobrenome.'],
    ['e-mail sem domínio', 'E-mail', 'maria@', 'Informe um e-mail válido.'],
    ['CEP com 7 dígitos', /CEP/, '7500000', 'O CEP deve ter 8 dígitos numéricos.'],
    ['CEP com letras', /CEP/, '7500000A', 'O CEP deve ter 8 dígitos numéricos.'],
    ['cartão com 15 dígitos', /Cartão/, '411111111111111', 'O cartão deve ter 16 dígitos numéricos.'],
  ];
  for (const [nome, label, valor, mensagem] of invalidos) {
    test(`${nome} é rejeitado`, async ({ loggedPage: page }) => {
      await page.getByLabel('Nome completo').fill('Maria Souza');
      await page.getByLabel('E-mail').fill('maria@example.com');
      await page.getByLabel(/CEP/).fill('75000000');
      await page.getByLabel(/Cartão/).fill('4111111111111111');
      await page.getByLabel(label).fill(valor);
      await page.getByRole('button', { name: 'Finalizar pedido' }).click();
      await expect(page.getByText(mensagem)).toBeVisible();
      await expect(page.getByRole('status')).toBeHidden();
    });
  }
});
