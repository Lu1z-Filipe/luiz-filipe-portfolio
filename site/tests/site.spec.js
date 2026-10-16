import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SECTIONS = ['inicio', 'sobre', 'competencias', 'experiencia', 'projetos', 'formacao', 'contato'];

test('carrega sem erros de console nem requisições falhas', async ({ page }) => {
  const problems = [];
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`));
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => problems.push(`requestfailed: ${r.url()}`));
  page.on('response', (r) => r.status() >= 400 && problems.push(`http ${r.status()}: ${r.url()}`));
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(problems).toEqual([]);
});

test('estrutura semântica: idioma, título, um h1 e landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page).toHaveTitle(/Luiz Filipe Caroso/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /QA/);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Principal' })).toBeVisible();
  await expect(page.getByRole('contentinfo')).toBeVisible();
});

test('imagem de compartilhamento (Open Graph) existe e é servida', async ({ page, request }) => {
  await page.goto('/');
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(og).toMatch(/\/og\.png$/);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  // o endereço absoluto só existe após a publicação; localmente validamos o arquivo do build
  const res = await request.get('/og.png');
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});

test('todas as seções existem e todo link de âncora do menu aponta para uma delas', async ({ page }) => {
  await page.goto('/');
  for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toHaveCount(1);
  const hrefs = await page.locator('nav a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThanOrEqual(6);
  for (const h of hrefs) await expect(page.locator(h)).toHaveCount(1);
});

test('links externos usam rel noopener e destinos esperados', async ({ page }) => {
  await page.goto('/');
  const external = page.locator('a[target="_blank"]:visible');
  expect(await external.count()).toBeGreaterThan(0);
  for (const a of await external.all()) await expect(a).toHaveAttribute('rel', /noopener/);
  await expect(page.getByRole('link', { name: 'LinkedIn' }).first()).toHaveAttribute('href', /linkedin\.com\/in\/luiz-filipe-caroso/);
  await expect(page.getByRole('link', { name: 'E-mail' })).toHaveAttribute('href', 'mailto:luizcaroso@gmail.com');
});

test('links para repositório/GitHub ficam ocultos quando as variáveis de ambiente não estão definidas', async ({ page }) => {
  test.skip(!!process.env.VITE_REPO_URL, 'build com repositório definido');
  await page.goto('/');
  await expect(page.locator('[data-repo]:visible')).toHaveCount(0);
  await expect(page.locator('[data-github]:visible')).toHaveCount(0);
});

test('projetos demonstrativos são identificados como estudos pessoais', async ({ page }) => {
  await page.goto('/#projetos');
  await expect(page.locator('#projetos .note.strong')).toContainText('Não são projetos executados em empresas');
  await expect(page.locator('#projetos .kind')).toHaveCount(4);
  for (const k of await page.locator('#projetos .kind').allTextContents()) expect(k).toMatch(/estudo pessoal/);
});

test('sem rolagem horizontal', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test('navegação por teclado: o primeiro Tab leva ao link de pular conteúdo', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Pular para o conteúdo' })).toBeFocused();
});

test('build de produção não expõe dados pessoais sensíveis do currículo', async () => {
  const dist = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
  const files = [];
  (function walk(d) {
    for (const f of readdirSync(d)) {
      const p = join(d, f);
      statSync(p).isDirectory() ? walk(p) : files.push(p);
    }
  })(dist);
  const content = files.map((f) => readFileSync(f, 'utf8')).join('\n');
  expect(content).not.toMatch(/99126/); // telefone
  expect(content).not.toMatch(/18\/04\/2000/); // data de nascimento
});
