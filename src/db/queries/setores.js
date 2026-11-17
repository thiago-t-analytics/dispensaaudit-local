// =============================================================
// queries/setores.js — SQL de setores
// =============================================================

const db = require('../connection');

const stmtListar = db.prepare(`
  SELECT * FROM setores WHERE ativo = 1 ORDER BY nome COLLATE NOCASE
`);
const stmtListarTodos = db.prepare(`
  SELECT * FROM setores ORDER BY nome COLLATE NOCASE
`);
const stmtBuscarPorId = db.prepare(`SELECT * FROM setores WHERE id = ?`);

const stmtInserir = db.prepare(`
  INSERT INTO setores (nome, ativo) VALUES (@nome, @ativo)
`);

const stmtAtualizar = db.prepare(`
  UPDATE setores SET nome = @nome, ativo = @ativo WHERE id = @id
`);

const stmtContarOcorrencias = db.prepare(`
  SELECT COUNT(*) AS total FROM ocorrencias WHERE setor_id = ?
`);

function listar({ incluirInativos = false } = {}) {
  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
}

function buscarPorId(id) { return stmtBuscarPorId.get(id); }

function inserir({ nome, ativo = 1 }) {
  const info = stmtInserir.run({ nome, ativo });
  return buscarPorId(info.lastInsertRowid);
}

function atualizar(id, { nome, ativo = 1 }) {
  stmtAtualizar.run({ id, nome, ativo });
  return buscarPorId(id);
}

function contarOcorrencias(setorId) {
  return stmtContarOcorrencias.get(setorId).total;
}

module.exports = { listar, buscarPorId, inserir, atualizar, contarOcorrencias };