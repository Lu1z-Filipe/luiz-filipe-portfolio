# Portfólio de QA — Luiz Filipe Nascimento

Portfólio profissional (site estático) testado em CI. Os **estudos técnicos de QA e automação** vivem em repositórios próprios, cada um com README e pipeline de CI.

> Os estudos são **pessoais**, com aplicações e dados sintéticos criados para eles.
> Não representam trabalhos executados em empresas onde atuei e não contêm dados de clientes nem credenciais reais.

## Estudos técnicos

| Repositório | O que é |
|---|---|
| [`qa-api-tests`](https://github.com/Lu1z-Filipe/qa-api-tests) | Automação de testes de API REST (Playwright) contra uma API local controlada |
| [`qa-web-tests-playwright`](https://github.com/Lu1z-Filipe/qa-web-tests-playwright) | Automação de testes web E2E (Playwright), desktop e mobile, contra uma aplicação de demonstração |
| [`qa-sql-data-validation`](https://github.com/Lu1z-Filipe/qa-sql-data-validation) | Validação de consistência de dados com SQL (SQLite, `node:test`) |

## Estrutura deste repositório

| Pasta | O que é |
|---|---|
| `site/` | Portfólio (Vite, HTML/CSS/JS puros) + testes Playwright do próprio site |
| `.github/workflows/ci.yml` | Pipeline de qualidade e publicação no GitHub Pages |
| `scripts/` | Varredura de segredos executada no CI |

## Pré-requisitos

- Node.js **24** (mínimo 22.5) e npm
- Para os testes do site: um navegador do Playwright (`npx playwright install chromium`) **ou** o Edge/Chrome instalado, usando `PW_CHANNEL=msedge` (ou `chrome`)

## Executar localmente

```bash
npm install
npm run lint          # ESLint
npm run scan          # varredura de segredos
npm run test:site     # 18 execuções (9 testes x desktop e mobile); faz o build e testa o resultado
npm test              # igual a test:site
npm run dev -w site   # site em modo desenvolvimento
```

No PowerShell, use `$env:PW_CHANNEL="msedge"` antes dos comandos que usam navegador.

O estado do pipeline no GitHub é o da aba **Actions** de cada repositório.

## CI/CD (GitHub Actions)

`ci.yml` roda em Pull Requests, em *push* no `main` e manualmente:

1. **lint** — ESLint e varredura de segredos
2. **site** — build de produção e testes Playwright; relatórios (HTML, traces, screenshots) vão como artefatos
3. **deploy** — só em *push* no `main` e **somente se os dois jobs anteriores passarem**; publica `site/dist` no GitHub Pages

Permissões padrão: `contents: read`. Só o job de deploy recebe `pages: write` e `id-token: write`.
Para impedir *merge* com testes falhando, ative *branch protection* no `main` exigindo os checks `lint` e `site`.

### Habilitar a publicação

No GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**. O primeiro *push* no `main` publica o site em
`https://<usuario>.github.io/<repositorio>/`.

## Manutenção

**Atualizar o currículo/conteúdo:** edite `site/index.html` (texto estático, sem etapa de dados). Mantenha a distinção
das etiquetas de competência: `pro` (citada em experiência), `cv` (listada no currículo) e `est` (estudo pessoal).

**Adicionar um estudo:**
1. Crie um repositório próprio com `package.json`, testes, `README.md`, dados sintéticos e um workflow de CI.
2. Adicione o card em `#projetos` de `site/index.html` (`data-github-repo="<nome-do-repositorio>"`) e atualize o teste que conta os cards em `site/tests/site.spec.js`.

**Variáveis do build do site** (definidas pelo CI): `VITE_REPO_URL` e `VITE_GITHUB_PROFILE` habilitam os links do GitHub.
Sem elas os links ficam ocultos, em vez de apontar para endereços inventados.

## Decisões

- **Sem framework no site:** conteúdo estático = melhor SEO, carregamento rápido e nenhuma dependência de runtime. Vite apenas empacota.
- **`base: './'`:** o build funciona em qualquer subcaminho do GitHub Pages.
- **Currículo em PDF não é publicado:** contém telefone e data de nascimento. Um teste garante que esses dados não entrem no build.
- **Um repositório por estudo:** cada um tem seu CI e seu histórico. O portfólio só aponta para eles, sem manter cópias.
- **Mesmo Playwright nos estudos de automação:** evita duplicar ferramentas; Cypress consta como experiência profissional, não como projeto aqui.
