# Estudo 2 — Automação de testes web (Playwright)

> Estudo técnico pessoal. Aplicação de demonstração e dados sintéticos criados para este repositório.

## Objetivo
Cobrir fluxos críticos de uma aplicação web (login → catálogo → carrinho → checkout) com cenários positivos e negativos,
validação de formulário, seletores confiáveis e evidências de falha.

## Arquitetura
- `app/` — "Loja Demo" em HTML/JS puro (sessão e carrinho em `sessionStorage`); `server.js` serve os arquivos estáticos.
- `tests/fixtures.js` — *fixture* `loggedPage` (página já autenticada).
- `tests/login.spec.js`, `purchase-flow.spec.js`, `checkout-validation.spec.js`.
- `playwright.config.js` — projetos **desktop** (Chrome) e **mobile** (Pixel 7); `screenshot: only-on-failure`, `trace: on-first-retry`.

## Boas práticas aplicadas
- Seletores por **papel e rótulo** (`getByRole`, `getByLabel`) e `data-testid` apenas onde não há semântica melhor.
- Sem `sleep`: apenas *web-first assertions* (`expect(...).toHaveText`, etc.).
- Validação com `aria-invalid` e `role="alert"/"status"`, o que também verifica acessibilidade básica.
- Casos negativos parametrizados (nome sem sobrenome, e-mail sem domínio, CEP curto/com letras, cartão com 15 dígitos).

## Executar
```bash
npm install
npx playwright install chromium     # ou use um navegador instalado: PW_CHANNEL=msedge
npm run test:web
npx playwright show-report projects/web-tests/reports/html
```
Credencial **fictícia**: `qa@example.com` / `Passw0rd!`.

## Resultado esperado
28 execuções passando (14 testes em 2 projetos). Em 16/10/2026, localmente com Edge, passaram 28/28.

## Sobre Cypress
Cypress aparece no meu currículo como experiência profissional. Não o dupliquei aqui para evitar trabalho redundante.
