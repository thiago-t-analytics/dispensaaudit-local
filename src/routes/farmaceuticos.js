// =============================================================
// routes/farmaceuticos.js — Rotas de farmacêuticos
// =============================================================

const express = require('express');
const router = express.Router();
const service = require('../services/farmaceuticos');

function getUsuario(req) { return req.headers['x-usuario'] || 'Sistema'; }

router.get('/', (req, res) => {
  const incluirInativos = req.query.incluirInativos === 'true';
  const plantao = req.query.plantao;
  if (plantao) {
    res.json(service.listarPorPlantao(plantao));
    return;
  }
  res.json(service.listar({ incluirInativos }));
});

router.get('/:id', (req, res) => {
  const r = service.buscarPorId(Number(req.params.id));
  res.status(r.ok ? 200 : r.status).json(r);
});

router.post('/', (req, res) => {
  const r = service.criar(req.body, getUsuario(req));
  res.status(r.ok ? 201 : r.status).json(r);
});

router.put('/:id', (req, res) => {
  const r = service.atualizar(Number(req.params.id), req.body, getUsuario(req));
  res.status(r.ok ? 200 : r.status).json(r);
});

router.delete('/:id', (req, res) => {
  const r = service.excluir(Number(req.params.id), getUsuario(req));
  res.status(r.ok ? 200 : r.status).json(r);
});

module.exports = router;