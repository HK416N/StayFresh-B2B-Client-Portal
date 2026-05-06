# Attributions

This document credits the open-source software, services, and tools used to build StayFresh, along with educational sources and acknowledgments of AI assistance during development.

---

## Open-source software

This project depends on the following open-source software, each used under its respective license. Many thanks to the maintainers and contributors of these projects.

### Backend

- [Express.js](https://expressjs.com) — MIT License — Web framework
- [PostgreSQL](https://www.postgresql.org) — PostgreSQL License — Relational database
- [pg (node-postgres)](https://node-postgres.com) — MIT License — PostgreSQL client for Node
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — MIT License — Password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — MIT License — JWT signing and verification
- [express-validator](https://express-validator.github.io) — MIT License — Request body validation
- [dotenv](https://github.com/motdotla/dotenv) — BSD-2-Clause License — Environment variable loading
- [cors](https://github.com/expressjs/cors) — MIT License — Cross-origin resource sharing
- [morgan](https://github.com/expressjs/morgan) — MIT License — HTTP request logging

### Frontend

- [React](https://react.dev) — MIT License — UI library
- [React Router](https://reactrouter.com) — MIT License — Client-side routing
- [Vite](https://vitejs.dev) — MIT License — Build tool and dev server
- [Tailwind CSS](https://tailwindcss.com) — MIT License — Utility-first CSS framework
- [PostCSS](https://postcss.org) — MIT License — CSS transformation tool
- [autoprefixer](https://github.com/postcss/autoprefixer) — MIT License — CSS vendor prefixing
- [react-toastify](https://fkhadra.github.io/react-toastify) — MIT License — Toast notifications
- [lucide-react](https://lucide.dev) — ISC License — Icon library

### Runtime and tooling

- [Bun](https://bun.sh) — MIT License — JavaScript runtime and package manager
- [Node.js](https://nodejs.org) — MIT-style License — Server runtime
- [ESLint](https://eslint.org) — MIT License — Code linting

### Development tools

- [Beekeeper Studio](https://www.beekeeperstudio.io) — GPL-3.0 — Database GUI client
- [Bruno](https://www.usebruno.com) — MIT License — API testing client
- [Visual Studio Code](https://code.visualstudio.com) — MIT-style License — Code editor
- [Git](https://git-scm.com) — GPL-2.0 — Version control

---

## Hosting and infrastructure

- [Neon](https://neon.tech) — Serverless PostgreSQL hosting (free tier)
- [Netlify](https://www.netlify.com) — Frontend static site hosting
- [Railway](https://railway.app) — Backend application hosting
- [GitHub](https://github.com) — Source control hosting

---

## AI assistance

This project was developed with assistance from the following AI tools:

- **Anthropic Claude** ([claude.ai](https://claude.ai)) — Used for architectural planning, debugging support, code review, and documentation drafting throughout the build week. Claude helped scaffold the initial folder structure, suggested patterns for role-based access control and identified bugs during code audits.

- **Qwen2.5-Coder 7B** (run locally via [Ollama](https://ollama.com)) — Used for boilerplate generation on routine page components, including the Cart, Orders list, and Order History pages, plus utility helpers like `formatStatus`. I served as the primary editor and integrator, auditing all generated code to meet production standards.

All architectural decisions, the data model, the build sequence, library and tooling choices, deployment configuration, and the final implementation are my own work. AI tools accelerated routine tasks and helped catch bugs during review, but did not make design decisions on my behalf.

---

## Educational sources

The skills and patterns used in this project were learned through:

- **General Assembly Software Engineering Bootcamp** — Course curriculum and lessons covering full-stack development, REST API design, JWT authentication, React fundamentals, and the PERN stack
- [MDN Web Docs](https://developer.mozilla.org) — JavaScript, Fetch API, and web standards reference
- [PostgreSQL official documentation](https://www.postgresql.org/docs) — SQL syntax, transactions, and `FOR UPDATE` row locking
- [React documentation](https://react.dev/learn) — Hooks, Context, and component patterns
- [React Router documentation](https://reactrouter.com/en/main) — Route configuration and protected routes
- [Tailwind CSS documentation](https://tailwindcss.com/docs) — Utility classes and theming
- [Express.js guides](https://expressjs.com/en/guide/routing.html) — Routing, middleware, and error handling
- [express-validator documentation](https://express-validator.github.io/docs) — Validation chains and error handling

---

## Domain context

The wholesale produce ordering workflow — including UEN-based company registration, the staff/client role separation, snapshot pricing on order line items, and the order status lifecycle (PLACED → TRANSIT → COMPLETE / CANCELLED) — is inspired by the operations of B2B fresh produce distributors in Singapore.

All sample product data, company names, UENs, and user accounts in the seed file are fabricated for demonstration purposes. No real supplier data, customer data, or proprietary business information was used.

---

## Notes

If a license, attribution, or credit has been unintentionally omitted from this document, please open an issue on the project repository so it can be corrected.
