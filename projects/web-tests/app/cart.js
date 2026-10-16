export const PRODUCTS = [
  { id: 1, name: 'Teclado Mecânico', price: 250 },
  { id: 2, name: 'Mouse Óptico', price: 80 },
  { id: 3, name: 'Monitor 27"', price: 1200 },
];

export const getCart = () => JSON.parse(sessionStorage.getItem('cart') ?? '{}');
export const saveCart = (cart) => sessionStorage.setItem('cart', JSON.stringify(cart));
export const cartTotal = (cart) => PRODUCTS.reduce((sum, p) => sum + p.price * (cart[p.id] ?? 0), 0);
export const brl = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
