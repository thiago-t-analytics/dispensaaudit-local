#!/usr/bin/env node
/**
 * Executor único do projeto dispensaaudit-local.
 *
 * Etapa 1: cria a raiz do projeto + docs/ + database/ + pastas vazias (src, public, templates)
 * Etapa 2: popula src/ com a árvore de arquivos .js (server, db, routes, services, utils)
 *
 * Idempotente: nada é sobrescrito se já existir.
 */
const fs   = require("fs");
const path = require("path");

const ROOT = "dispensaaudit-local";

/* ---------- helpers ---------- */
function ensureDir(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p, { recursive: true });
    console.log("📁 criada  :", p);
  }
}

function ensureFile(p, content = "") {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, content);
    console.log("📄 criado  :", p);
  } else {
    console.log("⏭  existe  :", p);
  }
}

/* ---------- ETAPA 1: raiz + docs + database ---------- */

const rootDirs = [
  "docs",
  "database",
  "src",
  "public",
  "templates",
];

const rootFiles = [
  "README.md",
  "package.json",
  ".gitignore",
  ".env.example",

  "docs/00-guia-do-aluno.md",
  "docs/00-guia-do-mentor.md",
  "docs/01-requisitos.md",
  "docs/02-arquitetura.md",
  "docs/03-banco-de-dados.md",
  "docs/04-apis.md",
  "docs/05-manual-manutencao.md",

  "database/schema.sql",
  "database/seed.sql",
];

const initialContent = {
  "README.md":
`# DispensAaudit — Local

Projeto em desenvolvimento.

## Estrutura
- \`docs/\` — documentação
- \`database/\` — schema e seed SQL
- \`src/\` — código-fonte (Node.js)
- \`public/\` — estáticos (Fase 3)
- \`templates/\` — templates de view (Fase 3)
`,

  "package.json":
JSON.stringify(
  {
    name: "dispensaaudit-local",
    version: "0.1.0",
    private: true,
    description: "DispensAaudit — ambiente local",
    main: "src/server.js",
    scripts: {
      start: "node src/server.js",
      dev: "node --watch src/server.js"
    },
    license: "UNLICENSED"
  }, null, 2) + "\n",

  ".gitignore":
`node_modules/
.env
*.log
.DS_Store
`,

  ".env.example":
`# Copie para .env e preencha
PORT=3000
DB_HOST=localhost
DB_USER=
DB_PASS=
DB_NAME=dispensaaudit
`,
};

function etapa1() {
  console.log(`\n=== ETAPA 1 — raiz, docs, database ===\n`);
  ensureDir(ROOT);
  rootDirs.forEach((d) => ensureDir(path.join(ROOT, d)));
  rootFiles.forEach((f) =>
    ensureFile(path.join(ROOT, f), initialContent[f] ?? "")
  );
}

/* ---------- ETAPA 2: src/ ---------- */

const SRC = path.join(ROOT, "src");

const srcDirs = [
  "db/queries",
  "routes",
  "services",
  "utils",
];

const srcFiles = [
  "server.js",
  "db/connection.js",
  "db/queries/medicamentos.js",
  "db/queries/tiposErro.js",
  "db/queries/setores.js",
  "db/queries/farmaceuticos.js",
  "db/queries/assistentes.js",
  "db/queries/usuarios.js",
  "db/queries/ocorrencias.js",
  "db/queries/logs.js",
  "routes/index.js",
  "routes/medicamentos.js",
  "routes/tiposErro.js",
  "routes/setores.js",
  "routes/farmaceuticos.js",
  "routes/assistentes.js",
  "routes/usuarios.js",
  "routes/ocorrencias.js",
  "routes/dashboard.js",
  "routes/logs.js",
  "routes/pdf.js",
  "services/ocorrencias.js",
  "services/kpis.js",
  "services/graficos.js",
  "services/logs.js",
  "services/pdf.js",
  "utils/validators.js",
  "utils/formatters.js",
];

function etapa2() {
  console.log(`\n=== ETAPA 2 — populando src/ ===\n`);
  ensureDir(SRC);
  srcDirs.forEach((d) => ensureDir(path.join(SRC, d)));
  srcFiles.forEach((f) => ensureFile(path.join(SRC, f), ""));
}

/* ---------- main ---------- */

console.log(`▶ Executando em: ${process.cwd()}`);
etapa1();
etapa2();
console.log(`\n✅ Estrutura completa criada em ./${ROOT}\n`);