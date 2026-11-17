// =============================================================
// queries/usuarios.js — SQL de usuários
// =============================================================

const db = require('../connection');

const stmtListar = db.prepare(`
  SELECT * FROM usuarios WHERE ativo = 1 ORDER BY nome COLLATE NOCASE
`);
const stmtListarTodos = db.prepare(`
  SELECT * FROM usuarios ORDER BY nome COLLATE NOCASE
`);
const stmtBuscarPorId = db.prepare(`SELECT * FROM usuarios WHERE id = ?`);

const stmtInserir = db.prepare(`
  INSERT INTO usuarios (nome, email, perfil, ativo)
  VALUES (@nome, @email, @perfil, @ativo)
`);

const stmtAtualizar = db.prepare(`
  UPDATE usuarios
  SET nome = @nome, email = @email, perfil = @perfil, ativo = @ativo
  WHERE id = @id
`);

function listar({ incluirInativos = false } = {}) {
  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
}

function buscarPorId(id) { return stmtBuscarPorId.get(id); }

function inserir({ nome, email = null, perfil = 'Usuário', ativo = 1 }) {
  const info = stmtInserir.run({ nome, email, perfil, ativo });
  return buscarPorId(info.lastInsertRowid);
}

function atualizar(id, { nome, email = null, perfil, ativo = 1 }) {
  stmtAtualizar.run({ id, nome, email, perfil, ativo });
  return buscarPorId(id);
}

module.exports = { listar, buscarPorId, inserir, atualizar };