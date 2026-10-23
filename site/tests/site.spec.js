import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { en } from '../src/translations.js';

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
  await expect(page).toHaveTitle(/Luiz Filipe Nascimento/);
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
  await expect(page.locator('[data-github-repo]:visible')).toHaveCount(0);
  await expect(page.locator('[data-github]:visible')).toHaveCount(0);
});

test('links dos estudos apontam para os repositórios próprios quando o perfil está definido', async ({ page }) => {
  test.skip(!process.env.VITE_GITHUB_PROFILE, 'build sem perfil do GitHub definido');
  await page.goto('/#projetos');
  const perfil = process.env.VITE_GITHUB_PROFILE.replace(/\/$/, '');
  for (const repo of ['qa-api-tests', 'qa-web-tests-playwright', 'qa-sql-data-validation']) {
    await expect(page.locator(`[data-github-repo="${repo}"]`)).toHaveAttribute('href', `${perfil}/${repo}`);
  }
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

test.describe('idioma PT/EN', () => {
  const html = readFileSync(join(fileURLToPath(new URL('..', import.meta.url)), 'index.html'), 'utf8');
  const keysInHtml = [...html.matchAll(/data-i18n(?:-aria|-content)?="([^"]+)"/g)].map((m) => m[1]);

  test('toda chave marcada no HTML tem tradução e toda tradução é usada', () => {
    expect(new Set(keysInHtml)).toEqual(new Set(Object.keys(en)));
    for (const [k, v] of Object.entries(en)) expect(v.trim(), `tradução vazia: ${k}`).not.toBe('');
  });

  test('o seletor troca o conteúdo, o atributo lang e o título, e volta ao português sem perdas', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('[data-lang="pt"]')).toHaveAttribute('aria-pressed', 'true');
    const original = await page.locator('main').innerText();

    await page.locator('[data-lang="en"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('[data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-lang="pt"]')).toHaveAttribute('aria-pressed', 'false');
    await expect(page.locator('.role')).toContainText('Quality across the whole lifecycle');
    await expect(page.locator('#h-exp')).toContainText('Experience');
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /software quality \(QA\) analyst/);
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'en_US');
    await expect(page).toHaveTitle(/Luiz Filipe Nascimento - QA Engineer/);
    await expect(page.locator('#projetos .note.strong')).toContainText('They are not projects carried out at companies');
    await expect(page.locator('h1')).toHaveText('Luiz Filipe Nascimento');

    await page.locator('[data-lang="pt"]').click();
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    expect(await page.locator('main').innerText()).toBe(original);
  });

  test('a escolha persiste ao recarregar e fica na URL para compartilhar', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang="en"]').click();
    expect(new URL(page.url()).searchParams.get('lang')).toBe('en');
    await page.goto('/'); // sem ?lang=: vale a escolha salva
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.reload();
    await expect(page.locator('.role')).toContainText('Test automation');
  });

  test('?lang= na URL tem prioridade sobre a escolha salva', async ({ page }) => {
    await page.goto('/?lang=en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await page.goto('/?lang=pt');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await page.goto('/?lang=xx'); // valor inválido é ignorado
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  });

  test.describe('navegador em inglês', () => {
    test.use({ locale: 'en-US' });
    test('sem escolha anterior, abre em inglês', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.locator('[data-lang="en"]')).toHaveAttribute('aria-pressed', 'true');
    });
    test('?lang=pt força o português', async ({ page }) => {
      await page.goto('/?lang=pt');
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    });
  });

  test('em inglês continuam valendo: estudos pessoais, links externos e navegação', async ({ page }) => {
    await page.goto('/?lang=en#projetos');
    await expect(page.locator('#projetos .kind')).toHaveCount(4);
    for (const k of await page.locator('#projetos .kind').allTextContents()) expect(k).toMatch(/personal study/);
    await expect(page.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:luizcaroso@gmail.com');
    for (const a of await page.locator('a[target="_blank"]:visible').all()) await expect(a).toHaveAttribute('rel', /noopener/);
    const hrefs = await page.locator('nav a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    for (const h of hrefs) await expect(page.locator(h)).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('o seletor é acessível por teclado', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-lang="en"]').focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });
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
