// =============================================================
// routes/index.js — Agregador progressivo das rotas da API
// =============================================================

const express = require('express');
const router = express.Router();

// DIA 06 — verificação mínima do servidor, sem dependência do banco.
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'DispensaAudit Local está rodando!',
    versao: '0.1.0',
    horario: new Date().toISOString()
  });
});

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: ROTAS CRUD DE REFERÊNCIA                ║
// ║ O QUE ESTE BLOCO FAZ: conecta os cadastros ao servidor.     ║
// ║ CONCEITO APRENDIDO: composição de routers Express.          ║
// ║ COMO TESTAR: descomente e consulte /api/medicamentos.       ║
// ║ REQUER: D06-B01 e D07-B01 completos.                         ║
// ╚══════════════════════════════════════════════════════════════╝
/*
// ▼▼▼ DESCOMENTE DAQUI — D07-B01 ▼▼▼
router.use('/medicamentos', require('./medicamentos'));
// ▲▲▲ ATÉ AQUI — D07-B01 ▲▲▲
*/

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: ROTAS DOS DEMAIS CADASTROS              ║
// ║ O QUE ESTE BLOCO FAZ: conecta os CRUDs restantes à API.     ║
// ║ CONCEITO APRENDIDO: reuso de routers por recurso.           ║
// ║ COMO TESTAR: consulte /api/setores e /api/farmaceuticos.    ║
// ║ REQUER: D07-B01 completo.                                    ║
// ╚══════════════════════════════════════════════════════════════╝
/*
// ▼▼▼ DESCOMENTE DAQUI — D07-B02 ▼▼▼
router.use('/tipos-erro', require('./tiposErro'));
router.use('/setores', require('./setores'));
router.use('/farmaceuticos', require('./farmaceuticos'));
router.use('/assistentes', require('./assistentes'));
router.use('/usuarios', require('./usuarios'));
// ▲▲▲ ATÉ AQUI — D07-B02 ▲▲▲
*/

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 08 — BACKEND: ROTAS DE OCORRÊNCIAS                    ║
// ║ O QUE ESTE BLOCO FAZ: disponibiliza o recurso de ocorrências.║
// ║ CONCEITO APRENDIDO: endpoints agrupados por recurso.       ║
// ║ COMO TESTAR: consulte /api/ocorrencias na base fictícia.    ║
// ║ REQUER: D07-B01 e Dia 08 completos.                          ║
// ╚══════════════════════════════════════════════════════════════╝
/*
// ▼▼▼ DESCOMENTE DAQUI — D08-B01 ▼▼▼
router.use('/ocorrencias', require('./ocorrencias'));
// ▲▲▲ ATÉ AQUI — D08-B01 ▲▲▲
*/

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 09 — BACKEND: DASHBOARD                              ║
// ║ O QUE ESTE BLOCO FAZ: expõe agregações e KPIs da API.       ║
// ║ CONCEITO APRENDIDO: rotas REST e serviços de leitura.       ║
// ║ COMO TESTAR: consulte /api/dashboard.                       ║
// ║ REQUER: Dia 09 completo.                                     ║
// ╚══════════════════════════════════════════════════════════════╝
/*
// ▼▼▼ DESCOMENTE DAQUI — D09-B02 ▼▼▼
router.use('/dashboard', require('./dashboard'));
// ▲▲▲ ATÉ AQUI — D09-B02 ▲▲▲
*/

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 13 — BACKEND: CONSULTA AOS LOGS                       ║
// ║ O QUE ESTE BLOCO FAZ: expõe os registros de auditoria.      ║
// ║ CONCEITO APRENDIDO: endpoint de leitura e trilha de auditoria.║
// ║ COMO TESTAR: consulte /api/logs após criar uma ocorrência.  ║
// ║ REQUER: D07-B01 e os Dias 08 e 13 completos.                 ║
// ╚══════════════════════════════════════════════════════════════╝
/*
// ▼▼▼ DESCOMENTE DAQUI — D13-B02 ▼▼▼
router.use('/logs', require('./logs'));
// ▲▲▲ ATÉ AQUI — D13-B02 ▲▲▲
*/

// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 14 — BACKEND: GERAÇÃO DE PDF                          ║
// ║ O QUE ESTE BLOCO FAZ: expõe os três relatórios em PDF.      ║
// ║ CONCEITO APRENDIDO: rota HTTP delegando a um service.       ║
// ║ COMO TESTAR: gere um relatório pelos endpoints /api/pdf.    ║
// ║ REQUER: Dias 07–09 e 14 completos.                           ║
// ╚══════════════════════════════════════════════════════════════╝
/*
// ▼▼▼ DESCOMENTE DAQUI — D14-B02 ▼▼▼
router.use('/pdf', require('./pdf'));
// ▲▲▲ ATÉ AQUI — D14-B02 ▲▲▲
*/

// CHECKPOINT: no Dia 06, somente /health fica ativo; cada grupo de
// rotas é ligado após queries, services e handlers estarem prontos.
module.exports = router;
