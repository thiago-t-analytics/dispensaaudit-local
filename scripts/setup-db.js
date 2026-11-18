const __courseSetupSource = require('fs').readFileSync(__filename, 'utf8');
if (!/^\s*const\s+Database\s*=\s*require\(['"]better-sqlite3['"]\);/m.test(__courseSetupSource)) {
  console.error('D04-B04 ainda esta comentado. Libere o executor do schema primeiro.');
  process.exitCode = 1;
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 04 — FERRAMENTA: CONFIGURACAO DO BANCO
// ║ O QUE ESTE BLOCO FAZ: Executa o schema SQLite numa base local.
// ║ CONCEITO APRENDIDO: execucao de SQL por script Node.js.
// ║ COMO TESTAR: Use somente numa copia descartavel; este script substitui a base indicada.
// ║ REQUER: D04-B01..B03 e confirmacao de copia descartavel.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D04-B04 ▼▼▼
//// =============================================================
//// setup-db.js — Cria o banco de dados a partir do schema.sql
//// =============================================================
//// COMO USAR:  npm run db:setup
////
//// O QUE ESTE ARQUIVO FAZ:
////   1. Apaga o banco antigo (se existir) — cuidado!
////   2. Lê o arquivo database/schema.sql
////   3. Executa cada comando CREATE TABLE / CREATE INDEX / CREATE VIEW
////   4. Mostra as tabelas criadas no final
////
//// CONCEITO APRENDIDO:
////   - Como Node.js lê arquivos do disco (fs.readFileSync)
////   - Como executar SQL programaticamente (better-sqlite3)
////   - Por que versionar o schema em um arquivo .sql é boa prática
//// =============================================================
//
//const fs = require('fs');
//const path = require('path');
//const Database = require('better-sqlite3');
//
//// ── 1. Define os caminhos ─────────────────────────────────────
//const ROOT = path.join(__dirname, '..');
//const DB_PATH = path.join(ROOT, 'database', 'dispensaaudit.db');
//const SCHEMA_PATH = path.join(ROOT, 'database', 'schema.sql');
//
//// ── 2. Remove o banco antigo, se existir ──────────────────────
//if (fs.existsSync(DB_PATH)) {
//  console.log('🗑️  Removendo banco antigo...');
//  fs.unlinkSync(DB_PATH);
//}
//
//// ── 3. Confere se o schema.sql existe ─────────────────────────
//if (!fs.existsSync(SCHEMA_PATH)) {
//  console.error(`❌ Arquivo não encontrado: ${SCHEMA_PATH}`);
//  process.exit(1);
//}
//
//// ── 4. Abre conexão com o SQLite ──────────────────────────────
//const db = new Database(DB_PATH);
//db.pragma('foreign_keys = ON');
//
//// ── 5. Lê e executa o schema.sql ──────────────────────────────
//console.log('📄 Lendo schema.sql...');
//const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
//
//try {
//  db.exec(schemaSql);
//  console.log('✅ Schema executado com sucesso.');
//} catch (err) {
//  console.error('❌ Erro ao executar o schema:');
//  console.error(err.message);
//  process.exit(1);
//}
//
//// ── 6. Lista as tabelas criadas ───────────────────────────────
//const tabelas = db.prepare(`
//  SELECT name, type
//  FROM sqlite_master
//  WHERE type IN ('table', 'view')
//    AND name NOT LIKE 'sqlite_%'
//  ORDER BY type, name
//`).all();
//
//console.log('\n📊 Estrutura criada:');
//for (const t of tabelas) {
//  const icone = t.type === 'table' ? '🗂️ ' : '👁️ ';
//  console.log(`   ${icone} ${t.name}`);
//}
//
//// ── 7. Fecha a conexão ────────────────────────────────────────
//db.close();
//
//console.log(`\n🎉 Banco criado em: ${DB_PATH}`);
//console.log('👉 Próximo passo: npm run db:seed:demo');
// ▲▲▲ ATE AQUI — D04-B04 ▲▲▲
// CHECKPOINT: apos D04-B04, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
