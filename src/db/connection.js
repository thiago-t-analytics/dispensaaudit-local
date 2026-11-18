// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: PRIMEIRO CRUD
// ║ O QUE ESTE BLOCO FAZ: Conecta SQLite, valida dados e implementa medicamentos.
// ║ CONCEITO APRENDIDO: prepared statements, validacao e separacao em camadas.
// ║ COMO TESTAR: Descomente o grupo e teste GET/POST /api/medicamentos.
// ║ REQUER: D06-B01 e schema D04 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B01 ▼▼▼
//// =============================================================
//// connection.js — Conexão única com o SQLite
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Abre uma conexão com o arquivo do banco e a exporta para
////   ser usada em TODAS as queries do sistema.
////
//// CONCEITO APRENDIDO:
////   - Singleton: uma única instância compartilhada
////   - better-sqlite3 é SÍNCRONO (mais simples que async/await)
////   - Sempre fechar a conexão ao encerrar (graceful shutdown)
//// =============================================================
//
//const path = require('path');
//const fs = require('fs');
//const Database = require('better-sqlite3');
//
//const ROOT = path.join(__dirname, '..', '..');
//const DB_PATH = process.env.DB_PATH
//  ? path.resolve(ROOT, process.env.DB_PATH)
//  : path.join(ROOT, 'database', 'dispensaaudit.db');
//
//// ── 1. Confere se o banco existe ──────────────────────────────
//if (!fs.existsSync(DB_PATH)) {
//  console.error(`❌ Banco não encontrado em: ${DB_PATH}`);
//  console.error('   Rode: npm run db:setup e npm run db:seed:demo');
//  process.exit(1);
//}
//
//// ── 2. Abre a conexão ─────────────────────────────────────────
//const db = new Database(DB_PATH);
//
//// ── 3. Configurações de performance e integridade ────────────
//db.pragma('foreign_keys = ON');   // Respeita FOREIGN KEY
//db.pragma('journal_mode = WAL');  // Melhor concorrência de leitura
//db.pragma('busy_timeout = 5000'); // Espera 5s se o banco estiver ocupado
//
//console.log(`📦 Banco conectado: ${path.relative(ROOT, DB_PATH)}`);
//
//// ── 4. Graceful shutdown ──────────────────────────────────────
//// Fecha a conexão quando o processo é encerrado (Ctrl+C).
//process.on('SIGINT', () => {
//  console.log('\n🛑 Encerrando...');
//  db.close();
//  process.exit(0);
//});
//
//module.exports = db;
// ▲▲▲ ATE AQUI — D07-B01 ▲▲▲
// CHECKPOINT: apos D07-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
