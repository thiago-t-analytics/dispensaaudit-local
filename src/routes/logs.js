// =============================================================
// routes/logs.js — Rotas dos logs (auditoria)
// =============================================================

const express = require('express');
const router = express.Router();
const queries = require('../db/queries/logs');

router.get('/', (req, res) => {
  const resultado = queries.listar({
    usuario: req.query.usuario,
    acao: req.query.acao,
    tabela: req.query.tabela,
    dataInicio: req.query.dataInicio,
    dataFim: req.query.dataFim,
    pagina: req.query.pagina,
    porPagina: req.query.porPagina
  });
  res.json({ ok: true, ...resultado });
});

module.exports = router;