// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: PRIMEIRO CRUD
// ║ O QUE ESTE BLOCO FAZ: Conecta SQLite, valida dados e implementa medicamentos.
// ║ CONCEITO APRENDIDO: prepared statements, validacao e separacao em camadas.
// ║ COMO TESTAR: Descomente o grupo e teste GET/POST /api/medicamentos.
// ║ REQUER: D06-B01 e schema D04 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B01 ▼▼▼
//// =============================================================
//// formatters.js — Formatação de datas, horas e cálculos
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Funções puras (sem efeito colateral) para formatar e
////   calcular coisas comuns no sistema.
////
//// CONCEITO APRENDIDO:
////   - Funções PURAS: mesmo input → mesmo output (fáceis de testar)
////   - Por que separar cálculo de apresentação (o banco guarda
////     YYYY-MM-DD, mas a tela mostra DD/MM/YYYY)
//// =============================================================
//
///**
// * Calcula a diferença em minutos entre dois horários HH:MM.
// * Retorna null se algum horário for inválido.
// */
//function calcularDiferencaMinutos(horaInicio, horaFim) {
//  if (!horaInicio || !horaFim) return null;
//  const [h1, m1] = String(horaInicio).split(':').map(Number);
//  const [h2, m2] = String(horaFim).split(':').map(Number);
//  if ([h1, m1, h2, m2].some(n => Number.isNaN(n))) return null;
//  return (h2 * 60 + m2) - (h1 * 60 + m1);
//}
//
///**
// * Classifica o horário baseado na diferença em minutos.
// * - Antecipada: < -15 min
// * - Atrasada:   > 30 min
// * - No horário: caso contrário
// */
//function classificarHorario(diferencaMinutos) {
//  if (diferencaMinutos === null || diferencaMinutos === undefined) {
//    return 'Não informado';
//  }
//  if (diferencaMinutos < -15) return 'Antecipada';
//  if (diferencaMinutos > 30) return 'Atrasada';
//  return 'No horário';
//}
//
///**
// * Calcula a diferença entre quantidade prescrita e dispensada.
// * Regra: null em dispensada é tratado como 0 (não dispensado).
// */
//function calcularDiferencaQuantidade(qPrescrita, qDispensada) {
//  const presc = Number(qPrescrita) || 0;
//  const disp = (qDispensada === null || qDispensada === undefined || qDispensada === '')
//    ? 0
//    : Number(qDispensada);
//  return presc - disp;
//}
//
///**
// * Formata data YYYY-MM-DD para DD/MM/YYYY.
// */
//function formatarDataBr(dataIso) {
//  if (!dataIso) return '';
//  const [ano, mes, dia] = String(dataIso).split('-');
//  if (!ano || !mes || !dia) return dataIso;
//  return `${dia}/${mes}/${ano}`;
//}
//
///**
// * Retorna data de hoje em YYYY-MM-DD.
// */
//function hojeIso() {
//  return new Date().toISOString().split('T')[0];
//}
//
///**
// * Retorna timestamp atual em ISO 8601 (para logs e auditoria).
// */
//function agoraIso() {
//  return new Date().toISOString();
//}
//
///**
// * Gera o próximo código visível (OCR000001, MED0001, etc.).
// */
//function gerarCodigoVisivel(prefixo, idNumerico, tamanho = 6) {
//  return `${prefixo}${String(idNumerico).padStart(tamanho, '0')}`;
//}
//
//module.exports = {
//  calcularDiferencaMinutos,
//  classificarHorario,
//  calcularDiferencaQuantidade,
//  formatarDataBr,
//  hojeIso,
//  agoraIso,
//  gerarCodigoVisivel
//};
// ▲▲▲ ATE AQUI — D07-B01 ▲▲▲
// CHECKPOINT: apos D07-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
