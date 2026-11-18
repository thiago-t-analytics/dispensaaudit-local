// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 08 — BACKEND: OCORRENCIAS
// ║ O QUE ESTE BLOCO FAZ: Implementa consultas, validacoes, regras, lote e auditoria.
// ║ CONCEITO APRENDIDO: regras de negocio, transacoes SQLite e integridade referencial.
// ║ COMO TESTAR: Cadastre e liste uma ocorrencia ficticia; valide tambem um lote.
// ║ REQUER: Dias 04 e 07 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D08-B01 ▼▼▼
//// =============================================================
//// routes/ocorrencias.js — Rotas HTTP de ocorrências
//// =============================================================
//
//const express = require('express');
//const router = express.Router();
//const service = require('../services/ocorrencias');
//
//function getUsuario(req) { return req.headers['x-usuario'] || 'Sistema'; }
//
//// GET /api/ocorrencias?status=Ativa&pagina=1&porPagina=20&...
//router.get('/', (req, res) => {
//  const filtros = {
//    status: req.query.status,
//    periodoInicio: req.query.periodoInicio,
//    periodoFim: req.query.periodoFim,
//    plantao: req.query.plantao,
//    farmaceutico_id: req.query.farmaceutico_id,
//    assistente_id: req.query.assistente_id,
//    medicamento_id: req.query.medicamento_id,
//    tipo_erro_id: req.query.tipo_erro_id,
//    setor_id: req.query.setor_id,
//    pagina: req.query.pagina,
//    porPagina: req.query.porPagina
//  };
//  res.json(service.listar(filtros));
//});
//
//router.get('/:id', (req, res) => {
//  const r = service.buscarPorId(Number(req.params.id));
//  res.status(r.ok ? 200 : r.status).json(r);
//});
//
//router.post('/', (req, res) => {
//  const r = service.criar(req.body, getUsuario(req));
//  res.status(r.ok ? 201 : r.status).json(r);
//});
//
//// POST /api/ocorrencias/lote — valida tudo antes da gravação atômica.
//router.post('/lote', (req, res) => {
//  const r = service.criarLote(req.body, getUsuario(req));
//  res.status(r.ok ? 201 : r.status).json(r);
//});
//
//router.put('/:id', (req, res) => {
//  const r = service.atualizar(Number(req.params.id), req.body, getUsuario(req));
//  res.status(r.ok ? 200 : r.status).json(r);
//});
//
//// PATCH /api/ocorrencias/:id/status — só muda o status
//router.patch('/:id/status', (req, res) => {
//  const r = service.alterarStatus(Number(req.params.id), req.body.status, getUsuario(req));
//  res.status(r.ok ? 200 : r.status).json(r);
//});
//
//router.delete('/:id', (req, res) => {
//  const r = service.excluir(Number(req.params.id), getUsuario(req));
//  res.status(r.ok ? 200 : r.status).json(r);
//});
//
//module.exports = router;
// ▲▲▲ ATE AQUI — D08-B01 ▲▲▲
// CHECKPOINT: apos D08-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
