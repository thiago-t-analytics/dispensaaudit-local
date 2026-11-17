// =============================================================
// seed-db.js — Popula o banco com os dados do seed.sql
// =============================================================
// COMO USAR:  npm run db:seed
//
// O QUE ESTE ARQUIVO FAZ:
//   1. Confere se o banco existe (senão manda rodar db:setup)
//   2. Lê o arquivo database/seed.sql
//   3. Executa cada comando INSERT
//   4. Mostra quantos registros foram inseridos por tabela
//
// CONCEITO APRENDIDO:
//   - Como o "seed" (dados iniciais) é separado do "schema" (estrutura)
//   - Como contar linhas de cada tabela após o seed (verificação)
//   - Diferença entre "criar a estrutura" e "popular os dados"
// =============================================================

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const ROOT = path.join(__dirname, '..');
const DB_PATH = path.join(ROOT, 'database', 'dispensaaudit.db');
const SEED_PATH = path.join(ROOT, 'database', 'seed.sql');

// ── 1. Confere se o banco foi criado ──────────────────────────
if (!fs.existsSync(DB_PATH)) {
  console.error('❌ Banco não encontrado. Rode primeiro: npm run db:setup');
  process.exit(1);
}

// ── 2. Confere se o seed.sql existe ───────────────────────────
if (!fs.existsSync(SEED_PATH)) {
  console.error(`❌ Arquivo não encontrado: ${SEED_PATH}`);
  process.exit(1);
}

// ── 3. Abre conexão ───────────────────────────────────────────
const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

// ── 4. Executa o seed.sql ─────────────────────────────────────
console.log('📄 Lendo seed.sql...');
const seedSql = fs.readFileSync(SEED_PATH, 'utf8');

try {
  db.exec(seedSql);
  console.log('✅ Seed executado com sucesso.');
} catch (err) {
  console.error('❌ Erro ao executar o seed:');
  console.error(err.message);
  process.exit(1);
}

// ── 5. Conta registros por tabela ─────────────────────────────
const TABELAS = [
  'usuarios',
  'setores',
  'tipos_erro',
  'farmaceuticos',
  'assistentes',
  'medicamentos',
  'ocorrencias',
  'logs',
  'configuracoes'
];

console.log('\n📊 Registros inseridos:');
for (const t of TABELAS) {
  try {
    const { total } = db.prepare(`SELECT COUNT(*) AS total FROM ${t}`).get();
    console.log(`   ${t.padEnd(16)} ${total}`);
  } catch {
    console.log(`   ${t.padEnd(16)} (tabela não existe)`);
  }
}

// ── 6. Fecha ──────────────────────────────────────────────────
db.close();
console.log('\n🎉 Seed concluído com sucesso!');
console.log('👉 Próximo passo: npm run dev');