// Alternância PT/EN. O português é o HTML original (funciona sem JavaScript e é o que os buscadores indexam);
// o inglês vem de translations.js e é aplicado trocando o conteúdo dos elementos marcados com data-i18n.
import { en } from './translations.js';

const SUPPORTED = ['pt', 'en'];
const STORAGE_KEY = 'lang';
const HTML_LANG = { pt: 'pt-BR', en: 'en' };
const OG_LOCALE = { pt: 'pt_BR', en: 'en_US' };

function saved() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null; // armazenamento bloqueado (modo privado, política do navegador)
  }
}

// Prioridade: ?lang= na URL (link compartilhável) > escolha anterior > idioma do navegador.
function initialLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (SUPPORTED.includes(fromUrl)) return fromUrl;
  const stored = saved();
  if (SUPPORTED.includes(stored)) return stored;
  const preferred = (navigator.languages?.[0] ?? navigator.language ?? 'pt').toLowerCase();
  return preferred.startsWith('pt') ? 'pt' : 'en';
}

function translate(selector, dataKey, read, write, lang) {
  for (const el of document.querySelectorAll(selector)) {
    // guarda o original (português) na primeira passagem para poder voltar a ele
    el.dataset[`pt${dataKey}`] ??= read(el);
    const key = el.getAttribute(`data-i18n${dataKey ? `-${dataKey.toLowerCase()}` : ''}`);
    write(el, lang === 'en' ? en[key] : el.dataset[`pt${dataKey}`]);
  }
}

export function applyLang(lang) {
  const root = document.documentElement;
  root.lang = HTML_LANG[lang];

  translate('[data-i18n]', '', (el) => el.innerHTML, (el, v) => (el.innerHTML = v), lang);
  translate(
    '[data-i18n-aria]',
    'Aria',
    (el) => el.getAttribute('aria-label'),
    (el, v) => el.setAttribute('aria-label', v),
    lang,
  );
  translate(
    '[data-i18n-content]',
    'Content',
    (el) => el.getAttribute('content'),
    (el, v) => el.setAttribute('content', v),
    lang,
  );

  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', OG_LOCALE[lang]);
  for (const b of document.querySelectorAll('[data-lang]')) b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
}

function choose(lang) {
  applyLang(lang);
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // sem armazenamento: a escolha vale só para esta visita
  }
  const url = new URL(location.href);
  url.searchParams.set('lang', lang);
  history.replaceState(null, '', url);
}

export function initLang() {
  applyLang(initialLang());
  for (const b of document.querySelectorAll('[data-lang]')) b.addEventListener('click', () => choose(b.dataset.lang));
}
