// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: DEMAIS CADASTROS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs de tipos de erro, setores, equipes e usuarios.
// ║ CONCEITO APRENDIDO: reuso de padroes de consulta, servico e rota.
// ║ COMO TESTAR: Teste listar e cadastrar um registro ficticio em cada cadastro.
// ║ REQUER: D07-B01 completo e schema de referencia criado.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B02 ▼▼▼
//// =============================================================
//// routes/setores.js — Rotas de setores
//// =============================================================
//
//const express = require('express');
//const router = express.Router();
//const service = require('../services/setores');
//
//function getUsuario(req) { return req.headers['x-usuario'] || 'Sistema'; }
//
//router.get('/', (req, res) => {
//  const incluirInativos = req.query.incluirInativos === 'true';
//  res.json(service.listar({ incluirInativos }));
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
//router.put('/:id', (req, res) => {
//  const r = service.atualizar(Number(req.params.id), req.body, getUsuario(req));
//  res.status(r.ok ? 200 : r.status).json(r);
//});
//
//router.delete('/:id', (req, res) => {
//  const r = service.excluir(Number(req.params.id), getUsuario(req));
//  res.status(r.ok ? 200 : r.status).json(r);
//});
//
//module.exports = router;
// ▲▲▲ ATE AQUI — D07-B02 ▲▲▲
// CHECKPOINT: apos D07-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
