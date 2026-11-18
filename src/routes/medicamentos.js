// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: PRIMEIRO CRUD
// ║ O QUE ESTE BLOCO FAZ: Conecta SQLite, valida dados e implementa medicamentos.
// ║ CONCEITO APRENDIDO: prepared statements, validacao e separacao em camadas.
// ║ COMO TESTAR: Descomente o grupo e teste GET/POST /api/medicamentos.
// ║ REQUER: D06-B01 e schema D04 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B01 ▼▼▼
//// =============================================================
//// routes/medicamentos.js — Rotas HTTP
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Define as URLs e os verbos HTTP para o CRUD de medicamentos.
////   NÃO contém SQL, NÃO contém validação de negócio.
////
//// CONCEITO APRENDIDO:
////   - Uma route é "fina": recebe req, chama service, devolve res.
////   - Status HTTP corretos: 200 (ok), 201 (criado), 404 (não achou), 400 (inválido).
////   - Usuário vem do header X-Usuario (sistema simplificado, sem login real).
//// =============================================================
//
//const express = require('express');
//const router = express.Router();
//const service = require('../services/medicamentos');
//
//// Helper: lê o usuário do header (ou usa "Sistema")
//function getUsuario(req) {
//  return req.headers['x-usuario'] || 'Sistema';
//}
//
//// ── GET /api/medicamentos ─────────────────────────────────────
//router.get('/', (req, res) => {
//  const incluirInativos = req.query.incluirInativos === 'true';
//  const resultado = service.listar({ incluirInativos });
//  res.json(resultado);
//});
//
//// ── GET /api/medicamentos/:id ─────────────────────────────────
//router.get('/:id', (req, res) => {
//  const resultado = service.buscarPorId(Number(req.params.id));
//  res.status(resultado.ok ? 200 : resultado.status).json(resultado);
//});
//
//// ── POST /api/medicamentos ────────────────────────────────────
//router.post('/', (req, res) => {
//  const resultado = service.criar(req.body, getUsuario(req));
//  res.status(resultado.ok ? 201 : resultado.status).json(resultado);
//});
//
//// ── PUT /api/medicamentos/:id ─────────────────────────────────
//router.put('/:id', (req, res) => {
//  const resultado = service.atualizar(Number(req.params.id), req.body, getUsuario(req));
//  res.status(resultado.ok ? 200 : resultado.status).json(resultado);
//});
//
//// ── DELETE /api/medicamentos/:id ──────────────────────────────
//router.delete('/:id', (req, res) => {
//  const resultado = service.excluir(Number(req.params.id), getUsuario(req));
//  res.status(resultado.ok ? 200 : resultado.status).json(resultado);
//});
//
//module.exports = router;
// ▲▲▲ ATE AQUI — D07-B01 ▲▲▲
// CHECKPOINT: apos D07-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
