# Portfólio de QA — Luiz Filipe Nascimento

Portfólio profissional (site estático) acompanhado de **estudos técnicos de QA e automação** executáveis e testados em CI.

> Os projetos em `projects/` são **estudos pessoais** com aplicações e dados sintéticos criados para este repositório.
> Não representam trabalhos executados em empresas onde atuei e não contêm dados de clientes nem credenciais reais.

## Estrutura

| Pasta | O que é |
|---|---|
| `site/` | Portfólio (Vite, HTML/CSS/JS puros) + testes Playwright do próprio site |
| `projects/api-tests/` | Estudo 1 — automação de testes de API (Playwright) contra uma API local controlada |
| `projects/web-tests/` | Estudo 2 — automação de testes web (Playwright) contra uma aplicação de demonstração |
| `projects/sql-validation/` | Estudo 3 — validação de consistência de dados com SQL (SQLite, `node:test`) |
| `.github/workflows/ci.yml` | Estudo 4 — pipeline de qualidade e publicação no GitHub Pages |
| `scripts/` | Varredura de segredos executada no CI |

Cada projeto tem README próprio (objetivo, arquitetura, execução, resultados).

## Pré-requisitos

- Node.js **24** (mínimo 22.5, por causa do `node:sqlite`) e npm
- Para os testes web e do site: um navegador do Playwright (`npx playwright install chromium`) **ou** o Edge/Chrome instalado, usando `PW_CHANNEL=msedge` (ou `chrome`)

## Executar localmente

```bash
npm install
npm run lint          # ESLint
npm run scan          # varredura de segredos
npm run test:sql      # 18 testes
npm run test:api      # 29 testes
npm run test:web      # 28 execuções (14 testes x desktop e mobile)
npm run test:site     # 18 execuções (9 testes x desktop e mobile); faz o build e testa o resultado
npm test              # todos os testes
npm run dev -w site   # site em modo desenvolvimento
```

No PowerShell, use `$env:PW_CHANNEL="msedge"` antes dos comandos que usam navegador.

## Resultados da última execução local (16/10/2026)

| Suíte | Resultado |
|---|---|
| SQL (`node:test`) | 18 passaram, 0 falharam |
| API (Playwright) | 29 passaram, 0 falharam |
| Web (Playwright, Edge) | 28 passaram, 0 falharam |
| Site (Playwright, Edge) | 18 passaram, 0 falharam |

O estado do pipeline no GitHub é o da aba **Actions** do repositório; não há selo de status aqui de propósito, para não
afirmar nada que não esteja comprovado.

## CI/CD (GitHub Actions)

`ci.yml` roda em Pull Requests, em *push* no `main` e manualmente:

1. **lint** — ESLint e varredura de segredos
2. **sql**, **api**, **web**, **site** — em paralelo; relatórios (HTML, JUnit, traces, screenshots) vão como artefatos
3. **deploy** — só em *push* no `main` e **somente se os cinco jobs anteriores passarem**; publica `site/dist` no GitHub Pages

Permissões padrão: `contents: read`. Só o job de deploy recebe `pages: write` e `id-token: write`.
Para impedir *merge* com testes falhando, ative *branch protection* no `main` exigindo os checks `lint`, `sql`, `api`, `web` e `site`.

### Habilitar a publicação

No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. O primeiro *push* no `main` publica o site em
`https://<usuario>.github.io/<repositorio>/`.

## Manutenção

**Atualizar o currículo/conteúdo:** edite `site/index.html` (texto estático, sem etapa de dados). Mantenha a distinção
das etiquetas de competência: `pro` (citada em experiência), `cv` (listada no currículo) e `est` (estudo pessoal).

**Adicionar um projeto:**
1. Crie `projects/<nome>/` com `package.json`, testes, `README.md` e dados sintéticos.
2. Adicione o workspace em `package.json` (raiz) e o script `test:<nome>`.
3. Crie um job em `.github/workflows/ci.yml` e inclua-o em `needs` do `deploy`.
4. Adicione o card em `#projetos` de `site/index.html` (`data-repo="projects/<nome>"`) e atualize o teste que conta os cards em `site/tests/site.spec.js`.

**Variáveis do build do site** (definidas pelo CI): `VITE_REPO_URL` e `VITE_GITHUB_PROFILE` habilitam os links do GitHub.
Sem elas os links ficam ocultos, em vez de apontar para endereços inventados.

## Decisões

- **Sem framework no site:** conteúdo estático = melhor SEO, carregamento rápido e nenhuma dependência de runtime. Vite apenas empacota.
- **`base: './'`:** o build funciona em qualquer subcaminho do GitHub Pages.
- **Currículo em PDF não é publicado:** contém telefone e data de nascimento. Um teste garante que esses dados não entrem no build.
- **Mesmo Playwright nos três projetos de automação:** evita duplicar ferramentas; Cypress consta como experiência profissional, não como projeto aqui.
