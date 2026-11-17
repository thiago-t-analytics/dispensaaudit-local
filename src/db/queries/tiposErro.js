// =============================================================
// queries/tiposErro.js — SQL de tipos de erro
// =============================================================

const db = require('../connection');

const stmtListar = db.prepare(`
  SELECT * FROM tipos_erro WHERE ativo = 1
  ORDER BY categoria, descricao COLLATE NOCASE
`);

const stmtListarTodos = db.prepare(`
  SELECT * FROM tipos_erro
  ORDER BY categoria, descricao COLLATE NOCASE
`);

const stmtBuscarPorId = db.prepare(`SELECT * FROM tipos_erro WHERE id = ?`);

const stmtInserir = db.prepare(`
  INSERT INTO tipos_erro (descricao, categoria, exemplo, ativo)
  VALUES (@descricao, @categoria, @exemplo, @ativo)
`);

const stmtAtualizar = db.prepare(`
  UPDATE tipos_erro
  SET descricao = @descricao,
      categoria = @categoria,
      exemplo = @exemplo,
      ativo = @ativo
  WHERE id = @id
`);

function listar({ incluirInativos = false } = {}) {
  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
}

function buscarPorId(id) { return stmtBuscarPorId.get(id); }

function inserir({ descricao, categoria, exemplo = null, ativo = 1 }) {
  const info = stmtInserir.run({ descricao, categoria, exemplo, ativo });
  return buscarPorId(info.lastInsertRowid);
}

function atualizar(id, { descricao, categoria, exemplo = null, ativo = 1 }) {
  stmtAtualizar.run({ id, descricao, categoria, exemplo, ativo });
  return buscarPorId(id);
}

module.exports = { listar, buscarPorId, inserir, atualizar };