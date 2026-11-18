// =============================================================
// seed-demo-db.js — Popula a base com exemplos fictícios
// DIA 05 — Execute somente numa cópia descartável do projeto.
// =============================================================

const __courseDemoSeedSource = require('fs').readFileSync(__filename, 'utf8');
if (/^\s*\/\*\s*$/m.test(__courseDemoSeedSource)) {
  console.error('D05-B02 ainda esta comentado. Libere o script antes de executar o seed demo.');
  process.exitCode = 1;
}

/*
// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 05 — SEED: EXECUTAR O SCRIPT DE TREINAMENTO            ║
// ║ O QUE ESTE BLOCO FAZ: lê e executa seed-demo.sql no SQLite.  ║
// ║ CONCEITO APRENDIDO: leitura de arquivo e execução de SQL.    ║
// ║ COMO TESTAR: descomente, rode npm run db:seed:demo e confira║
// ║ as duas ocorrências fictícias no DB Browser.                 ║
// ║ REQUER: D04-B01, D04-B02, D04-B03 e D05-B01 completos.       ║
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D05-B02 ▼▼▼
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const ROOT = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'database', 'dispensaaudit.db');
const SEED_PATH = path.join(ROOT, 'database', 'seed-demo.sql');

if (!fs.existsSync(DB_PATH)) {
  throw new Error('Banco não encontrado. Rode npm run db:setup na cópia de treinamento.');
}

if (!fs.existsSync(SEED_PATH)) {
  throw new Error(`Arquivo de seed não encontrado: ${SEED_PATH}`);
}

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

try {
  db.exec(fs.readFileSync(SEED_PATH, 'utf8'));
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM ocorrencias').get();
  console.log(`Seed de demonstração executado; ocorrências na base: ${total}.`);
} catch (error) {
  console.error(`Falha ao executar seed de demonstração: ${error.message}`);
  process.exitCode = 1;
} finally {
  db.close();
}
// ▲▲▲ ATÉ AQUI — D05-B02 ▲▲▲

// CHECKPOINT: o script deve encerrar a conexão e informar a contagem,
// sem incluir dados pessoais ou depender da planilha de produção.
*/
