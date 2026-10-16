import { PRODUCTS, getCart, saveCart, cartTotal, brl } from './cart.js';

if (!sessionStorage.getItem('user')) location.replace('index.html');

const list = document.getElementById('products');
for (const p of PRODUCTS) {
  const row = document.createElement('div');
  row.className = 'product';
  row.dataset.testid = `product-${p.id}`;
  row.innerHTML = `<span>${p.name} — ${brl(p.price)}</span><button type="button" data-testid="add-${p.id}">Adicionar</button>`;
  row.querySelector('button').addEventListener('click', () => {
    const cart = getCart();
    cart[p.id] = (cart[p.id] ?? 0) + 1;
    saveCart(cart);
    render();
  });
  list.append(row);
}

document.getElementById('logout').addEventListener('click', () => {
  sessionStorage.clear();
  location.href = 'index.html';
});

function render() {
  const cart = getCart();
  document.querySelector('[data-testid="cart-count"]').textContent = String(Object.values(cart).reduce((a, b) => a + b, 0));
  document.querySelector('[data-testid="cart-total"]').textContent = brl(cartTotal(cart));
}
render();
