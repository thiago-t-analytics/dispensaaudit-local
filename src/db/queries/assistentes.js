// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: DEMAIS CADASTROS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs de tipos de erro, setores, equipes e usuarios.
// ║ CONCEITO APRENDIDO: reuso de padroes de consulta, servico e rota.
// ║ COMO TESTAR: Teste listar e cadastrar um registro ficticio em cada cadastro.
// ║ REQUER: D07-B01 completo e schema de referencia criado.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B02 ▼▼▼
//// =============================================================
//// queries/assistentes.js — SQL de assistentes
//// =============================================================
//
//const db = require('../connection');
//
//const stmtListar = db.prepare(`
//  SELECT a.*, f.nome AS farmaceutico_nome
//  FROM assistentes a
//  LEFT JOIN farmaceuticos f ON f.id = a.farmaceutico_id
//  WHERE a.ativo = 1
//  ORDER BY a.nome COLLATE NOCASE
//`);
//
//const stmtListarTodos = db.prepare(`
//  SELECT a.*, f.nome AS farmaceutico_nome
//  FROM assistentes a
//  LEFT JOIN farmaceuticos f ON f.id = a.farmaceutico_id
//  ORDER BY a.nome COLLATE NOCASE
//`);
//
//const stmtBuscarPorId = db.prepare(`
//  SELECT a.*, f.nome AS farmaceutico_nome
//  FROM assistentes a
//  LEFT JOIN farmaceuticos f ON f.id = a.farmaceutico_id
//  WHERE a.id = ?
//`);
//
//const stmtInserir = db.prepare(`
//  INSERT INTO assistentes (nome, plantao, farmaceutico_id, ativo)
//  VALUES (@nome, @plantao, @farmaceutico_id, @ativo)
//`);
//
//const stmtAtualizar = db.prepare(`
//  UPDATE assistentes
//  SET nome = @nome, plantao = @plantao,
//      farmaceutico_id = @farmaceutico_id, ativo = @ativo
//  WHERE id = @id
//`);
//
//function listar({ incluirInativos = false } = {}) {
//  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
//}
//
//function buscarPorId(id) { return stmtBuscarPorId.get(id); }
//
//function inserir({ nome, plantao, farmaceutico_id = null, ativo = 1 }) {
//  const info = stmtInserir.run({ nome, plantao, farmaceutico_id, ativo });
//  return buscarPorId(info.lastInsertRowid);
//}
//
//function atualizar(id, { nome, plantao, farmaceutico_id = null, ativo = 1 }) {
//  stmtAtualizar.run({ id, nome, plantao, farmaceutico_id, ativo });
//  return buscarPorId(id);
//}
//
//module.exports = { listar, buscarPorId, inserir, atualizar };
// ▲▲▲ ATE AQUI — D07-B02 ▲▲▲
// CHECKPOINT: apos D07-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
