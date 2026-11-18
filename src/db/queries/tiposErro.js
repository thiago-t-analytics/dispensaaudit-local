// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: DEMAIS CADASTROS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs de tipos de erro, setores, equipes e usuarios.
// ║ CONCEITO APRENDIDO: reuso de padroes de consulta, servico e rota.
// ║ COMO TESTAR: Teste listar e cadastrar um registro ficticio em cada cadastro.
// ║ REQUER: D07-B01 completo e schema de referencia criado.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B02 ▼▼▼
//// =============================================================
//// queries/tiposErro.js — SQL de tipos de erro
//// =============================================================
//
//const db = require('../connection');
//
//const stmtListar = db.prepare(`
//  SELECT * FROM tipos_erro WHERE ativo = 1
//  ORDER BY categoria, descricao COLLATE NOCASE
//`);
//
//const stmtListarTodos = db.prepare(`
//  SELECT * FROM tipos_erro
//  ORDER BY categoria, descricao COLLATE NOCASE
//`);
//
//const stmtBuscarPorId = db.prepare(`SELECT * FROM tipos_erro WHERE id = ?`);
//
//const stmtInserir = db.prepare(`
//  INSERT INTO tipos_erro (descricao, categoria, exemplo, ativo)
//  VALUES (@descricao, @categoria, @exemplo, @ativo)
//`);
//
//const stmtAtualizar = db.prepare(`
//  UPDATE tipos_erro
//  SET descricao = @descricao,
//      categoria = @categoria,
//      exemplo = @exemplo,
//      ativo = @ativo
//  WHERE id = @id
//`);
//
//function listar({ incluirInativos = false } = {}) {
//  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
//}
//
//function buscarPorId(id) { return stmtBuscarPorId.get(id); }
//
//function inserir({ descricao, categoria, exemplo = null, ativo = 1 }) {
//  const info = stmtInserir.run({ descricao, categoria, exemplo, ativo });
//  return buscarPorId(info.lastInsertRowid);
//}
//
//function atualizar(id, { descricao, categoria, exemplo = null, ativo = 1 }) {
//  stmtAtualizar.run({ id, descricao, categoria, exemplo, ativo });
//  return buscarPorId(id);
//}
//
//module.exports = { listar, buscarPorId, inserir, atualizar };
// ▲▲▲ ATE AQUI — D07-B02 ▲▲▲
// CHECKPOINT: apos D07-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
