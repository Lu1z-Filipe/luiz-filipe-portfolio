// Textos em inglês. O português é o conteúdo original de index.html (atributo data-i18n = chave).
// Mantenha as chaves sincronizadas com o HTML: um teste falha se faltar ou sobrar alguma.
export const en = {
  title: 'Luiz Filipe Nascimento - QA Engineer',
  'meta.description':
    'Portfolio of Luiz Filipe Nascimento, software quality (QA) analyst since 2021: functional testing, REST API, SQL, automation with Playwright and Cypress, TOTVS ERP and AI applied to QA.',
  'meta.ogdesc': 'Software quality across the whole lifecycle: requirements, testing, automation, data and CI/CD.',
  'meta.ogalt': 'Luiz Filipe Nascimento - QA Engineer, test automation',

  skip: 'Skip to content',
  'aria.nav': 'Main',
  'aria.home': 'Home',
  'aria.facts': 'Highlights',

  'nav.about': 'about',
  'nav.skills': 'skills',
  'nav.experience': 'experience',
  'nav.projects': 'projects',
  'nav.education': 'education',
  'nav.contact': 'contact',

  'hero.role': 'QA Engineer · Test automation · Quality across the whole lifecycle',
  'hero.lead':
    'Quality analyst since 2021. I work from requirements analysis and acceptance criteria through to sign-off, with functional, API and data testing, AI-assisted automation and experience in ERP environments. I have also led testing and development teams.',
  'hero.f1': 'working in software quality',
  'hero.f2': 'TOTVS ERP environments',
  'hero.f3.t': 'English C1',
  'hero.f3': 'advanced level',
  'hero.cta': 'See hands-on projects',
  'btn.email': 'Email',

  'h.about': 'About',
  'about.1':
    'I started in IT support (2019) and moved into software quality in 2021 as a QA analyst. I went on to manage the testing department and then held a development supervision position before returning to test analysis, now in an ERP environment.',
  'about.2':
    'I see quality as something that starts before the code: clear requirements, business rules and well-defined acceptance criteria prevent more defects than any late-stage test. That is why I take part in refinements, help define scope and test strategy, and follow every defect through to its root cause.',
  'about.3':
    'I use AI, especially Claude Code, to generate scenarios, write and run test scripts and analyze results, always reviewing what is produced.',
  'about.4':
    '<strong>Goal:</strong> QA Engineer, QA Automation, Quality Engineer and SDET positions, and technical leadership in software quality.',

  'h.skills': 'Skills',
  'leg.pro': 'professional use',
  'leg.pro.d': 'mentioned in my work experience',
  'leg.cv': 'skill',
  'leg.cv.d': 'listed on my résumé',
  'leg.est': 'personal study',
  'leg.est.d': 'practiced in this portfolio’s projects',

  'c.testing': 'Testing and processes',
  'c.api': 'API and integrations',
  'c.auto': 'Automation and AI',
  'c.data': 'Data',
  'c.tools': 'Tools and workflow',
  'c.method': 'Methodologies and ERP',

  't.functional': 'functional',
  't.exploratory': 'exploratory',
  't.regression': 'regression',
  't.integration': 'integration',
  't.uat': 'acceptance (UAT)',
  't.cases': 'test cases and scenarios',
  't.criteria': 'acceptance criteria',
  't.defects': 'defect management',
  't.risk': 'risk analysis',
  't.status': 'status codes and payloads',
  't.pwapi': 'Playwright (API)',
  't.cc': 'Claude Code (web testing)',
  't.pwhere': 'Playwright (projects here)',
  't.ai': 'AI applied to QA',
  't.integrity': 'integrity validation',
  't.sqlite': 'SQL checks (SQLite)',

  'h.experience': 'Experience',
  'w1': 'Mar 2026 – present',
  'r1': 'Mid-level Test Analyst · SIAN',
  'e1.1': 'Analysis of functional and non-functional requirements, flagging risks, inconsistencies and quality impacts.',
  'e1.2': 'Test scenarios and cases built from business rules and acceptance criteria; participation in technical refinements.',
  'e1.3': 'Functional, regression, exploratory, integration and acceptance (UAT) testing, including patches and new releases.',
  'e1.4': 'Data validation with SQL/MySQL and REST API testing with Postman and Insomnia (endpoints, methods, status codes, JSON/XML).',
  'e1.5': 'Web test automation and AI in QA with Claude Code: scenario generation, scripts, execution and results analysis.',
  'e1.6': 'Scrum/Kanban, Git, Bitbucket and Pull Request review; work items via Jira, Azure DevOps and Trello.',
  'w2': 'Dec 2024 – Feb 2026',
  'r2': 'Development Supervisor · SoftNews',
  'e2.1': 'Coordination of development projects, deadlines and delivery quality; progress reports to stakeholders.',
  'e2.2': 'Supervision of cross-functional teams, indicator analysis and process mapping to reduce bottlenecks.',
  'e2.3': 'Review of technical documentation and validation of data and results.',
  'w3': 'Apr 2021 – Dec 2024',
  'r3': 'QA Analyst · GR8 Sistemas e Tecnologia',
  'e3.1': 'Detailed checks of features against requirements; creation of test scenarios and documentation.',
  'e3.2': 'Testing of new features focused on defects, usability, performance and security; guidance on fixes.',
  'e3.3': 'Management of the testing department: team coordination, definition of work processes and delivery quality.',
  'e3.4': 'Collaboration with development so that improvements met stakeholder expectations.',
  'w4': 'Mar 2019 – Apr 2021',
  'r4': 'IT Support Analyst · GR8 Sistemas e Tecnologia',
  'e4.1': 'Hardware and software maintenance and technical support for users, identifying improvements to internal processes.',
  'exp.note':
    'Earlier experience (2016–2019): internship at Claro Empresas (Celmax Telecom) and apprenticeship at Soloplan, in administrative roles.',

  'h.projects': 'QA and automation projects',
  'proj.note':
    'Personal technical studies, executable and documented. They use applications and synthetic data created for these studies. <strong>They are not projects carried out at companies where I have worked.</strong>',
  'k.api': 'personal study · API',
  'k.web': 'personal study · Web',
  'k.data': 'personal study · Data',
  'k.ci': 'personal study · CI/CD',
  'p1.t': 'API test automation',
  'p1.d':
    'Playwright suite against a controlled local API (login, products, orders): success and failure paths, error contract, field validation, boundary values, discount and stock rules, authentication.',
  'p2.t': 'Web test automation',
  'p2.d':
    'Login, catalog, cart and checkout flow with form validation, positive and negative scenarios, role/label-based selectors and execution on desktop and mobile. Screenshot and trace on failures.',
  'p3.t': 'Data validation with SQL',
  'p3.d':
    'Eight documented checks (duplicates, required fields, referential integrity, total consistency, status domain) run against a clean dataset and another with planted defects.',
  'p4.t': 'Quality pipeline',
  'p4.d':
    'GitHub Actions on every Pull Request and on the main branch: lint, secret scanning and site tests, reports as artifacts, and publishing only if everything passes. Each study above has its own pipeline in its repository.',
  't.artifacts': 'Artifacts',
  'more.repo': 'view code and README ⟶',
  'more.workflow': 'view workflow ⟶',

  'h.education': 'Education',
  'edu.1':
    '<strong>Postgraduate degree in Software Engineering with emphasis on Software Quality and Testing</strong> - Anhanguera Educacional · Jan–Jun 2026 · completed',
  'edu.2': '<strong>Bachelor’s degree in Computer Engineering</strong> - Anhanguera Educacional · 2018–2022',
  'edu.3': '<strong>Languages:</strong> Portuguese (native) · English C1 / advanced',

  'h.contact': 'Contact',
  'contact.p': 'Open to conversations about QA, automation and software quality positions.',
};
