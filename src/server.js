const __courseServerSource = require('fs').readFileSync(__filename, 'utf8');
if (!/^\s*const\s+express\s*=\s*require\(['"]express['"]\);/m.test(__courseServerSource)) {
  console.error('D06-B01 ainda esta comentado. Libere o bloco antes de iniciar o servidor.');
  process.exitCode = 1;
}

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 06 — BACKEND: SERVIDOR EXPRESS
// ║ O QUE ESTE BLOCO FAZ: Cria o servidor HTTP e entrega a interface local.
// ║ CONCEITO APRENDIDO: middlewares, rotas e servidor Node.js.
// ║ COMO TESTAR: Rode npm run dev e consulte /api/health.
// ║ REQUER: Dia 05; rota de saude ativa.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D06-B01 ▼▼▼
//// =============================================================
//// server.js — Ponto de entrada da aplicação
//// =============================================================
//// COMO USAR:  npm run dev
////
//// O QUE ESTE ARQUIVO FAZ:
////   1. Cria o servidor Express
////   2. Configura middlewares (JSON, arquivos estáticos)
////   3. Registra as rotas da API
////   4. Inicia o servidor na porta configurada
////
//// CONCEITO APRENDIDO:
////   - O que é um middleware (função que roda ANTES da rota)
////   - Como o Express encadeia requisições
////   - Por que separar "app" de "server" (testabilidade)
//// =============================================================
//
//const express = require('express');
//const path = require('path');
//
//// ── 1. Importa as rotas ───────────────────────────────────────
//const routes = require('./routes');
//
//// ── 2. Cria o app Express ─────────────────────────────────────
//const app = express();
//const PORT = process.env.PORT || 3000;
//
//// ── 3. Middlewares globais ────────────────────────────────────
//// express.json() lê o corpo das requisições como JSON
//// (sem ele, req.body seria undefined)
//app.use(express.json());
//
//// express.urlencoded() lê formulários HTML clássicos
//app.use(express.urlencoded({ extended: true }));
//
//// Log simples de cada requisição (útil em desenvolvimento)
//app.use((req, res, next) => {
//  const agora = new Date().toLocaleTimeString('pt-BR');
//  console.log(`[${agora}] ${req.method} ${req.path}`);
//  next(); // ← IMPORTANTE: sem isso, a requisição "para" aqui
//});
//
//// ── 4. Arquivos estáticos ─────────────────────────────────────
//// Servem o front (public/) e os PDFs gerados (output/)
//app.use(express.static(path.join(__dirname, '..', 'public')));
//app.use('/output', express.static(path.join(__dirname, '..', 'output')));
//
//// ── 5. Rotas da API ───────────────────────────────────────────
//app.use('/api', routes);
//
//// ── 6. Handler 404 para rotas não encontradas ─────────────────
//app.use((req, res) => {
//  res.status(404).json({
//    success: false,
//    message: `Rota não encontrada: ${req.method} ${req.path}`
//  });
//});
//
//// ── 7. Handler global de erros ────────────────────────────────
//// Qualquer erro não tratado nas rotas cai aqui.
//app.use((err, req, res, next) => {
//  console.error('❌ Erro não tratado:', err);
//  res.status(500).json({
//    success: false,
//    message: err.message || 'Erro interno do servidor'
//  });
//});
//
//// ── 8. Inicia o servidor ──────────────────────────────────────
//app.listen(PORT, () => {
//  console.log('═'.repeat(55));
//  console.log(`🚀 DispensaAudit Local rodando em:`);
//  console.log(`   http://localhost:${PORT}`);
//  console.log(`   http://localhost:${PORT}/api/health`);
//  console.log('═'.repeat(55));
//});
//
//module.exports = app;
// ▲▲▲ ATE AQUI — D06-B01 ▲▲▲
// CHECKPOINT: apos D06-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
