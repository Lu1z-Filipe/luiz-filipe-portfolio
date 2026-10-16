// Links que dependem do repositório remoto só aparecem quando VITE_REPO_URL está definido
// (o workflow de CI define; localmente ficam ocultos em vez de apontar para um endereço inventado).
const repoUrl = (import.meta.env.VITE_REPO_URL ?? '').replace(/\/$/, '');
const githubProfile = (import.meta.env.VITE_GITHUB_PROFILE ?? '').replace(/\/$/, '');

if (githubProfile) {
  for (const a of document.querySelectorAll('[data-github]')) {
    a.href = githubProfile;
    a.hidden = false;
  }
}
if (repoUrl) {
  for (const a of document.querySelectorAll('[data-repo]')) {
    const path = a.dataset.repo;
    a.href = `${repoUrl}/${path.startsWith('.github') ? 'blob' : 'tree'}/main/${path}`;
    a.hidden = false;
  }
}

document.getElementById('year').textContent = String(new Date().getFullYear());

// Destaque do item de menu da seção visível + revelação suave (desligada com prefers-reduced-motion via CSS).
const links = [...document.querySelectorAll('.nav ul a')];
const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);

if ('IntersectionObserver' in window) {
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        for (const l of links) l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`);
      }
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((s) => spy.observe(s));

  const reveal = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) (e.target.classList.add('in'), reveal.unobserve(e.target));
    },
    { threshold: 0.1 },
  );
  document.querySelectorAll('.card, .timeline > li').forEach((el) => {
    el.classList.add('reveal');
    reveal.observe(el);
  });
}
