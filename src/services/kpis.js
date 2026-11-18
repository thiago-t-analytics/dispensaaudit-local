// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 09 — BACKEND: KPIS
// ║ O QUE ESTE BLOCO FAZ: Calcula indicadores resumidos para o dashboard.
// ║ CONCEITO APRENDIDO: agregacao de dados e funcoes puras.
// ║ COMO TESTAR: Compare os KPIs com uma consulta manual as ocorrencias.
// ║ REQUER: D08-B01 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D09-B01 ▼▼▼
//// =============================================================
//// services/kpis.js — Cálculo dos indicadores do dashboard
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Recebe a lista de ocorrências e calcula os KPIs exibidos
////   no topo do dashboard (total, mês, plantão, setor, etc.).
////
//// CONCEITO APRENDIDO:
////   - Funções puras: mesmo input → mesmo output
////   - Agregações com reduce (contar, somar, achar o máximo)
////   - Por que KPIs são calculados no service e não no SQL
////     (facilita testar cada regra isoladamente)
//// =============================================================
//
//function calcularPlantaoMaior(ocorrencias) {
//  const contagem = {};
//  for (const o of ocorrencias) {
//    if (o.plantao) contagem[o.plantao] = (contagem[o.plantao] || 0) + 1;
//  }
//  let maior = { plantao: 'Nenhum', total: 0 };
//  for (const [plantao, total] of Object.entries(contagem)) {
//    if (total > maior.total) maior = { plantao, total };
//  }
//  return maior;
//}
//
//function calcularMedicamentoMaisEnvolvido(ocorrencias) {
//  const contagem = {};
//  for (const o of ocorrencias) {
//    const nome = o.medicamento_nome || 'Não informado';
//    contagem[nome] = (contagem[nome] || 0) + 1;
//  }
//  let maior = { medicamento: 'Nenhum', total: 0 };
//  for (const [medicamento, total] of Object.entries(contagem)) {
//    if (total > maior.total) maior = { medicamento, total };
//  }
//  return maior;
//}
//
//function calcularTipoErroMaisFrequente(ocorrencias) {
//  const contagem = {};
//  for (const o of ocorrencias) {
//    const nome = o.tipo_erro_descricao || 'Não informado';
//    contagem[nome] = (contagem[nome] || 0) + 1;
//  }
//  let maior = { tipo: 'Nenhum', total: 0 };
//  for (const [tipo, total] of Object.entries(contagem)) {
//    if (total > maior.total) maior = { tipo, total };
//  }
//  return maior;
//}
//
//function calcularSetorMaisFrequente(ocorrencias) {
//  const contagem = {};
//  for (const o of ocorrencias) {
//    const nome = o.setor_nome || 'Não informado';
//    contagem[nome] = (contagem[nome] || 0) + 1;
//  }
//  let maior = { setor: 'Nenhum', total: 0 };
//  for (const [setor, total] of Object.entries(contagem)) {
//    if (total > maior.total) maior = { setor, total };
//  }
//  return maior;
//}
//
///**
// * Calcula todos os KPIs de uma vez.
// * @param {Array} todas       - Todas as ocorrências (sem filtro de status)
// * @param {Array} visiveis    - Ocorrências do filtro atual
// */
//function calcularKPIs(todas, visiveis) {
//  const hoje = new Date().toISOString().split('T')[0];
//  const mes = hoje.substring(0, 7);
//
//  const ativas = todas.filter(o => o.status === 'Ativa').length;
//  const concluidas = todas.filter(o => o.status === 'Concluida').length;
//  const total = todas.length;
//
//  return {
//    total,
//    hoje: todas.filter(o => o.data_ocorrencia === hoje).length,
//    mes: todas.filter(o => o.data_ocorrencia && o.data_ocorrencia.startsWith(mes)).length,
//    plantaoMaior: calcularPlantaoMaior(todas),
//    medicamentoMaisEnvolvido: calcularMedicamentoMaisEnvolvido(todas),
//    tipoErroMaisFrequente: calcularTipoErroMaisFrequente(todas),
//    setorMaisFrequente: calcularSetorMaisFrequente(todas),
//    statusResumo: {
//      ativas,
//      concluidas,
//      percentualAtivas: total ? Math.round((ativas / total) * 100) : 0,
//      percentualConcluidas: total ? Math.round((concluidas / total) * 100) : 0
//    },
//    visiveis: visiveis.length
//  };
//}
//
//module.exports = { calcularKPIs };
// ▲▲▲ ATE AQUI — D09-B01 ▲▲▲
// CHECKPOINT: apos D09-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
