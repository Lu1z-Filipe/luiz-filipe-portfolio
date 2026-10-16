const form = document.getElementById('login-form');
const errorBox = document.getElementById('login-error');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = form.email.value.trim();
  const password = form.password.value;
  if (!email || !password) {
    errorBox.textContent = 'Informe e-mail e senha.';
    errorBox.hidden = false;
    return;
  }
  if (email !== 'qa@example.com' || password !== 'Passw0rd!') {
    errorBox.textContent = 'E-mail ou senha inválidos.';
    errorBox.hidden = false;
    return;
  }
  sessionStorage.setItem('user', email);
  location.href = 'catalog.html';
});
