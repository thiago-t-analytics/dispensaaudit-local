// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: DEMAIS CADASTROS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs de tipos de erro, setores, equipes e usuarios.
// ║ CONCEITO APRENDIDO: reuso de padroes de consulta, servico e rota.
// ║ COMO TESTAR: Teste listar e cadastrar um registro ficticio em cada cadastro.
// ║ REQUER: D07-B01 completo e schema de referencia criado.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B02 ▼▼▼
//// =============================================================
//// queries/setores.js — SQL de setores
//// =============================================================
//
//const db = require('../connection');
//
//const stmtListar = db.prepare(`
//  SELECT * FROM setores WHERE ativo = 1 ORDER BY nome COLLATE NOCASE
//`);
//const stmtListarTodos = db.prepare(`
//  SELECT * FROM setores ORDER BY nome COLLATE NOCASE
//`);
//const stmtBuscarPorId = db.prepare(`SELECT * FROM setores WHERE id = ?`);
//
//const stmtInserir = db.prepare(`
//  INSERT INTO setores (nome, ativo) VALUES (@nome, @ativo)
//`);
//
//const stmtAtualizar = db.prepare(`
//  UPDATE setores SET nome = @nome, ativo = @ativo WHERE id = @id
//`);
//
//const stmtContarOcorrencias = db.prepare(`
//  SELECT COUNT(*) AS total FROM ocorrencias WHERE setor_id = ?
//`);
//
//function listar({ incluirInativos = false } = {}) {
//  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
//}
//
//function buscarPorId(id) { return stmtBuscarPorId.get(id); }
//
//function inserir({ nome, ativo = 1 }) {
//  const info = stmtInserir.run({ nome, ativo });
//  return buscarPorId(info.lastInsertRowid);
//}
//
//function atualizar(id, { nome, ativo = 1 }) {
//  stmtAtualizar.run({ id, nome, ativo });
//  return buscarPorId(id);
//}
//
//function contarOcorrencias(setorId) {
//  return stmtContarOcorrencias.get(setorId).total;
//}
//
//module.exports = { listar, buscarPorId, inserir, atualizar, contarOcorrencias };
// ▲▲▲ ATE AQUI — D07-B02 ▲▲▲
// CHECKPOINT: apos D07-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
