// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: PRIMEIRO CRUD
// ║ O QUE ESTE BLOCO FAZ: Conecta SQLite, valida dados e implementa medicamentos.
// ║ CONCEITO APRENDIDO: prepared statements, validacao e separacao em camadas.
// ║ COMO TESTAR: Descomente o grupo e teste GET/POST /api/medicamentos.
// ║ REQUER: D06-B01 e schema D04 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B01 ▼▼▼
//// =============================================================
//// logs.js (service) — Auditoria de todas as operações
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Registra no banco toda operação de escrita (CREATE, UPDATE,
////   DELETE) para que exista uma trilha auditável.
////
//// CONCEITO APRENDIDO:
////   - Auditoria como requisito NÃO FUNCIONAL obrigatório
////     em sistemas hospitalares (rastreabilidade).
////   - Como isolar "escrita de log" da lógica de negócio.
////   - Nunca deixar log quebrar a operação principal
////     (try/catch separado).
//// =============================================================
//
//const db = require('../db/connection');
//const { agoraIso } = require('../utils/formatters');
//
//const stmtInserir = db.prepare(`
//  INSERT INTO logs (data_hora, usuario, acao, tabela, registro, valor_anterior, valor_novo)
//  VALUES (@data_hora, @usuario, @acao, @tabela, @registro, @valor_anterior, @valor_novo)
//`);
//
///**
// * Registra uma entrada na trilha de auditoria.
// *
// * @param {object} params
// * @param {string} params.usuario      - Nome do usuário que fez a ação
// * @param {string} params.acao         - Ex.: 'Cadastro', 'Edição', 'Exclusão'
// * @param {string} params.tabela       - Ex.: 'ocorrencias', 'medicamentos'
// * @param {string} [params.registro]   - ID ou código do registro afetado
// * @param {any}    [params.valorAnterior] - Estado antes (será serializado em JSON)
// * @param {any}    [params.valorNovo]  - Estado depois (será serializado em JSON)
// */
//function registrar({ usuario, acao, tabela, registro = null, valorAnterior = null, valorNovo = null }) {
//  try {
//    stmtInserir.run({
//      data_hora: agoraIso(),
//      usuario: usuario || 'Sistema',
//      acao,
//      tabela,
//      registro: registro !== null ? String(registro) : null,
//      valor_anterior: valorAnterior !== null ? JSON.stringify(valorAnterior) : null,
//      valor_novo: valorNovo !== null ? JSON.stringify(valorNovo) : null
//    });
//  } catch (err) {
//    // Log NUNCA deve quebrar a operação principal.
//    console.error('⚠️ Falha ao registrar log:', err.message);
//  }
//}
//
//module.exports = { registrar };
// ▲▲▲ ATE AQUI — D07-B01 ▲▲▲
// CHECKPOINT: apos D07-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
