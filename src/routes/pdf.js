// =============================================================
// routes/pdf.js — Rotas de geração de PDF
// =============================================================

const express = require('express');
const router = express.Router();
const pdfService = require('../services/pdf');

// ── GET /api/pdf/individual/:id ─────────────────────────────
router.get('/individual/:id', async (req, res) => {
  try {
    const resultado = await pdfService.gerarIndividual(Number(req.params.id));
    res.json({ ok: true, ...resultado });
  } catch (err) {
    console.error('Erro ao gerar PDF individual:', err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ── GET /api/pdf/farmaceutico/:id?periodoInicio=&periodoFim= ─
router.get('/farmaceutico/:id', async (req, res) => {
  try {
    const resultado = await pdfService.gerarFarmaceutico(
      Number(req.params.id),
      {
        periodoInicio: req.query.periodoInicio,
        periodoFim: req.query.periodoFim
      }
    );
    res.json({ ok: true, ...resultado });
  } catch (err) {
    console.error('Erro ao gerar PDF por farmacêutico:', err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

// ── GET /api/pdf/gerencial?periodoInicio=&periodoFim= ───────
router.get('/gerencial', async (req, res) => {
  try {
    const resultado = await pdfService.gerarGerencial({
      periodoInicio: req.query.periodoInicio,
      periodoFim: req.query.periodoFim
    });
    res.json({ ok: true, ...resultado });
  } catch (err) {
    console.error('Erro ao gerar PDF gerencial:', err);
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;