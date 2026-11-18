// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: DEMAIS CADASTROS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs de tipos de erro, setores, equipes e usuarios.
// ║ CONCEITO APRENDIDO: reuso de padroes de consulta, servico e rota.
// ║ COMO TESTAR: Teste listar e cadastrar um registro ficticio em cada cadastro.
// ║ REQUER: D07-B01 completo e schema de referencia criado.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B02 ▼▼▼
//// =============================================================
//// queries/farmaceuticos.js — SQL de farmacêuticos
//// =============================================================
//
//const db = require('../connection');
//
//const stmtListar = db.prepare(`
//  SELECT * FROM farmaceuticos WHERE ativo = 1 ORDER BY nome COLLATE NOCASE
//`);
//const stmtListarTodos = db.prepare(`
//  SELECT * FROM farmaceuticos ORDER BY nome COLLATE NOCASE
//`);
//const stmtBuscarPorId = db.prepare(`SELECT * FROM farmaceuticos WHERE id = ?`);
//
//const stmtInserir = db.prepare(`
//  INSERT INTO farmaceuticos (nome, plantao, tipo, ativo)
//  VALUES (@nome, @plantao, @tipo, @ativo)
//`);
//
//const stmtAtualizar = db.prepare(`
//  UPDATE farmaceuticos
//  SET nome = @nome, plantao = @plantao, tipo = @tipo, ativo = @ativo
//  WHERE id = @id
//`);
//
//const stmtPorPlantao = db.prepare(`
//  SELECT * FROM farmaceuticos WHERE ativo = 1 AND plantao = ?
//  ORDER BY nome COLLATE NOCASE
//`);
//
//function listar({ incluirInativos = false } = {}) {
//  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
//}
//
//function buscarPorId(id) { return stmtBuscarPorId.get(id); }
//
//function inserir({ nome, plantao, tipo = 'Fixo', ativo = 1 }) {
//  const info = stmtInserir.run({ nome, plantao, tipo, ativo });
//  return buscarPorId(info.lastInsertRowid);
//}
//
//function atualizar(id, { nome, plantao, tipo = 'Fixo', ativo = 1 }) {
//  stmtAtualizar.run({ id, nome, plantao, tipo, ativo });
//  return buscarPorId(id);
//}
//
//function listarPorPlantao(plantao) {
//  return stmtPorPlantao.all(plantao);
//}
//
//module.exports = { listar, buscarPorId, inserir, atualizar, listarPorPlantao };
// ▲▲▲ ATE AQUI — D07-B02 ▲▲▲
// CHECKPOINT: apos D07-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
