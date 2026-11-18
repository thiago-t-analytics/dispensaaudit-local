// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 09 — BACKEND: GRAFICOS E ROTA
// ║ O QUE ESTE BLOCO FAZ: Prepara series agregadas e expoe os dados do dashboard.
// ║ CONCEITO APRENDIDO: contratos JSON e agregacao por categoria e periodo.
// ║ COMO TESTAR: Consulte GET /api/dashboard.
// ║ REQUER: D08-B01 e D09-B01 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D09-B02 ▼▼▼
//// =============================================================
//// routes/dashboard.js — Endpoint do dashboard
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Orquestra KPIs + gráficos + tabela e devolve tudo num JSON.
////   É o endpoint que o frontend vai chamar ao abrir o dashboard.
//// =============================================================
//
//const express = require('express');
//const router = express.Router();
//const queries = require('../db/queries/ocorrencias');
//const { calcularKPIs } = require('../services/kpis');
//const { calcularGraficos, calcularEvolucaoTemporal } = require('../services/graficos');
//
//router.get('/', (req, res) => {
//  try {
//    const filtros = {
//      periodoInicio: req.query.periodoInicio,
//      periodoFim: req.query.periodoFim,
//      plantao: req.query.plantao,
//      farmaceutico_id: req.query.farmaceutico_id,
//      assistente_id: req.query.assistente_id,
//      medicamento_id: req.query.medicamento_id,
//      tipo_erro_id: req.query.tipo_erro_id,
//      setor_id: req.query.setor_id,
//      classificacao_horario: req.query.classificacao_horario,
//      status: req.query.status || 'todas' // dashboard mostra todas por padrão
//    };
//
//    // Todas as ocorrências do período (sem filtro de status, para KPIs)
//    const todas = queries.listarTodasParaCalculo({
//      ...filtros,
//      status: 'todas'
//    });
//
//    // Ocorrências visíveis (com filtro de status do usuário)
//    const visiveis = queries.listarTodasParaCalculo({
//      ...filtros,
//      status: req.query.status || 'todas'
//    });
//
//    const kpis = calcularKPIs(todas, visiveis);
//    const graficos = calcularGraficos(visiveis);
//    const evolucao = calcularEvolucaoTemporal(visiveis);
//
//    // Tabela paginada (só a primeira página)
//    const tabela = queries.listar({
//      ...filtros,
//      pagina: req.query.pagina || 1,
//      porPagina: req.query.porPagina || 10
//    });
//
//    res.json({
//      ok: true,
//      kpis,
//      graficos,
//      evolucaoTemporal: evolucao,
//      tabela: tabela.dados,
//      paginacao: tabela.paginacao
//    });
//  } catch (err) {
//    console.error('Erro no dashboard:', err);
//    res.status(500).json({ ok: false, message: err.message });
//  }
//});
//
//module.exports = router;
// ▲▲▲ ATE AQUI — D09-B02 ▲▲▲
// CHECKPOINT: apos D09-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
