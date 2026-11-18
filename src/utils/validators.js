// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: PRIMEIRO CRUD
// ║ O QUE ESTE BLOCO FAZ: Conecta SQLite, valida dados e implementa medicamentos.
// ║ CONCEITO APRENDIDO: prepared statements, validacao e separacao em camadas.
// ║ COMO TESTAR: Descomente o grupo e teste GET/POST /api/medicamentos.
// ║ REQUER: D06-B01 e schema D04 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B01 ▼▼▼
//// =============================================================
//// validators.js — Validação de campos
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Centraliza todas as regras de validação de campos.
////   Toda validação retorna { ok: true } ou { ok: false, message }
////
//// CONCEITO APRENDIDO:
////   - Validação em CAMADA ÚNICA (não espalhada pelas rotas)
////   - Retorno consistente { ok, message } facilita o uso
////   - Mensagens de erro em português, claras para o usuário
//// =============================================================
//
///**
// * Valida se um campo obrigatório está preenchido.
// */
//function obrigatorio(valor, nomeCampo) {
//  if (valor === null || valor === undefined) {
//    return { ok: false, message: `O campo "${nomeCampo}" é obrigatório.` };
//  }
//  if (typeof valor === 'string' && valor.trim() === '') {
//    return { ok: false, message: `O campo "${nomeCampo}" é obrigatório.` };
//  }
//  return { ok: true };
//}
//
///**
// * Valida um número (aceita 0, rejeita null/undefined/NaN).
// */
//function numero(valor, nomeCampo, { min = null, max = null } = {}) {
//  if (valor === null || valor === undefined || valor === '') {
//    return { ok: false, message: `O campo "${nomeCampo}" deve ser um número.` };
//  }
//  const n = Number(valor);
//  if (Number.isNaN(n)) {
//    return { ok: false, message: `O campo "${nomeCampo}" deve ser um número.` };
//  }
//  if (min !== null && n < min) {
//    return { ok: false, message: `"${nomeCampo}" deve ser ≥ ${min}.` };
//  }
//  if (max !== null && n > max) {
//    return { ok: false, message: `"${nomeCampo}" deve ser ≤ ${max}.` };
//  }
//  return { ok: true };
//}
//
///**
// * Valida o formato de uma data YYYY-MM-DD.
// */
//function data(valor, nomeCampo) {
//  if (!valor) return { ok: false, message: `"${nomeCampo}" é obrigatório.` };
//  const re = /^\d{4}-\d{2}-\d{2}$/;
//  if (!re.test(valor)) {
//    return { ok: false, message: `"${nomeCampo}" deve estar no formato YYYY-MM-DD.` };
//  }
//  return { ok: true };
//}
//
///**
// * Valida hora no formato HH:MM (ou aceita null/vazio = opcional).
// */
//function horaOpcional(valor, nomeCampo) {
//  if (valor === null || valor === undefined || valor === '') {
//    return { ok: true }; // opcional
//  }
//  const re = /^\d{2}:\d{2}$/;
//  if (!re.test(String(valor))) {
//    return { ok: false, message: `"${nomeCampo}" deve estar no formato HH:MM.` };
//  }
//  return { ok: true };
//}
//
///**
// * Valida se um valor está entre opções permitidas (enum).
// */
//function enumOpcao(valor, nomeCampo, opcoes) {
//  if (!opcoes.includes(valor)) {
//    return {
//      ok: false,
//      message: `"${nomeCampo}" deve ser um destes: ${opcoes.join(', ')}.`
//    };
//  }
//  return { ok: true };
//}
//
///**
// * Valida uma lista de regras de uma vez.
// * Uso:  validarTudo([['nome', regra1], ['data', regra2], ...])
// */
//function validarTudo(regras) {
//  for (const [nome, resultado] of regras) {
//    if (!resultado.ok) return resultado;
//  }
//  return { ok: true };
//}
//
//module.exports = {
//  obrigatorio,
//  numero,
//  data,
//  horaOpcional,
//  enumOpcao,
//  validarTudo
//};
// ▲▲▲ ATE AQUI — D07-B01 ▲▲▲
// CHECKPOINT: apos D07-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
