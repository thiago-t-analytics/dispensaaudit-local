// =============================================================
// routes/index.js — Agregador de todas as rotas
// =============================================================

const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DispensaAudit Local está rodando!',
    versao: '0.1.0',
    horario: new Date().toISOString()
  });
});

// CRUDs
router.use('/medicamentos', require('./medicamentos'));
router.use('/tipos-erro', require('./tiposErro'));
router.use('/setores', require('./setores'));
router.use('/farmaceuticos', require('./farmaceuticos'));
router.use('/assistentes', require('./assistentes'));
router.use('/usuarios', require('./usuarios'));

// Núcleo
router.use('/ocorrencias', require('./ocorrencias'));
router.use('/dashboard', require('./dashboard'));
router.use('/logs', require('./logs'));

// PDF
router.use('/pdf', require('./pdf'));

module.exports = router;