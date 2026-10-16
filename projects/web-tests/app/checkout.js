import { getCart, cartTotal, brl } from './cart.js';

if (!sessionStorage.getItem('user')) location.replace('index.html');

const form = document.getElementById('checkout-form');
const confirmation = document.getElementById('confirmation');
const total = cartTotal(getCart());
document.querySelector('[data-testid="checkout-total"]').textContent = brl(total);

const rules = {
  name: (v) => (v.trim().split(/\s+/).length >= 2 ? '' : 'Informe nome e sobrenome.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Informe um e-mail válido.'),
  cep: (v) => (/^\d{8}$/.test(v) ? '' : 'O CEP deve ter 8 dígitos numéricos.'),
  card: (v) => (/^\d{16}$/.test(v) ? '' : 'O cartão deve ter 16 dígitos numéricos.'),
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = total > 0;
  if (total === 0) {
    confirmation.hidden = false;
    confirmation.textContent = 'Seu carrinho está vazio.';
  }
  for (const [field, check] of Object.entries(rules)) {
    const message = check(form[field].value);
    const box = document.getElementById(`${field}-error`);
    box.textContent = message;
    box.hidden = !message;
    form[field].setAttribute('aria-invalid', String(Boolean(message)));
    if (message) valid = false;
  }
  if (!valid) return;
  form.hidden = true;
  confirmation.hidden = false;
  confirmation.textContent = `Pedido confirmado! Total pago: ${brl(total)}`;
  sessionStorage.removeItem('cart');
});
