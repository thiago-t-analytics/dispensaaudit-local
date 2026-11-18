// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 09 — BACKEND: GRAFICOS E ROTA
// ║ O QUE ESTE BLOCO FAZ: Prepara series agregadas e expoe os dados do dashboard.
// ║ CONCEITO APRENDIDO: contratos JSON e agregacao por categoria e periodo.
// ║ COMO TESTAR: Consulte GET /api/dashboard.
// ║ REQUER: D08-B01 e D09-B01 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D09-B02 ▼▼▼
//// =============================================================
//// services/graficos.js — Agregações para os gráficos
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Transforma a lista de ocorrências em arrays de
////   { nome, valor } prontos para o frontend renderizar barras.
////
//// CONCEITO APRENDIDO:
////   - Padronização de saída: todos os gráficos retornam
////     [{ nome, valor }], o que simplifica o front.
////   - Ordenação por valor decrescente (o maior fica primeiro).
//// =============================================================
//
//function agruparPorCampo(ocorrencias, campo) {
//  const mapa = {};
//  for (const o of ocorrencias) {
//    const valor = o[campo] || 'Não informado';
//    mapa[valor] = (mapa[valor] || 0) + 1;
//  }
//  return Object.entries(mapa)
//    .map(([nome, valor]) => ({ nome, valor }))
//    .sort((a, b) => b.valor - a.valor);
//}
//
//function calcularGraficos(ocorrencias) {
//  return {
//    porTipoErro: agruparPorCampo(ocorrencias, 'tipo_erro_descricao'),
//    porMedicamento: agruparPorCampo(ocorrencias, 'medicamento_nome'),
//    porFarmaceutico: agruparPorCampo(ocorrencias, 'farmaceutico_nome'),
//    porAssistente: agruparPorCampo(ocorrencias, 'assistente_nome'),
//    porSetor: agruparPorCampo(ocorrencias, 'setor_nome'),
//    porPlantao: agruparPorCampo(ocorrencias, 'plantao'),
//    porClassificacaoHorario: agruparPorCampo(ocorrencias, 'classificacao_horario'),
//    porCategoriaErro: agruparPorCampo(ocorrencias, 'tipo_erro_categoria')
//  };
//}
//
///**
// * Calcula a evolução temporal (ocorrências por data).
// * Útil para gráfico de linha.
// */
//function calcularEvolucaoTemporal(ocorrencias) {
//  const mapa = {};
//  for (const o of ocorrencias) {
//    if (o.data_ocorrencia) {
//      mapa[o.data_ocorrencia] = (mapa[o.data_ocorrencia] || 0) + 1;
//    }
//  }
//  return Object.entries(mapa)
//    .map(([data, valor]) => ({ data, valor }))
//    .sort((a, b) => a.data.localeCompare(b.data));
//}
//
//module.exports = { calcularGraficos, calcularEvolucaoTemporal };
// ▲▲▲ ATE AQUI — D09-B02 ▲▲▲
// CHECKPOINT: apos D09-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
