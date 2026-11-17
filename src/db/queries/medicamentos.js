// =============================================================
// queries/medicamentos.js — Acesso ao banco (SQL puro)
// =============================================================
// O QUE ESTE ARQUIVO FAZ:
//   Contém apenas as queries SQL da tabela `medicamentos`.
//   NÃO contém validação, NÃO contém regra de negócio.
//
// CONCEITO APRENDIDO:
//   - Separação de responsabilidades: SQL vive aqui, regra vive
//     no service, HTTP vive na route.
//   - better-sqlite3 é SÍNCRONO — não precisa de await/async.
//   - Prepared statements evitam SQL Injection.
// =============================================================

const db = require('../connection');

// ── Statements preparados (compilados uma vez, executados N vezes) ──

const stmtListar = db.prepare(`
  SELECT * FROM medicamentos
  WHERE ativo = 1
  ORDER BY nome COLLATE NOCASE ASC
`);

const stmtListarTodos = db.prepare(`
  SELECT * FROM medicamentos
  ORDER BY nome COLLATE NOCASE ASC
`);

const stmtBuscarPorId = db.prepare(`
  SELECT * FROM medicamentos WHERE id = ?
`);

const stmtInserir = db.prepare(`
  INSERT INTO medicamentos (nome, apresentacao, unidade, ativo)
  VALUES (@nome, @apresentacao, @unidade, @ativo)
`);

const stmtAtualizar = db.prepare(`
  UPDATE medicamentos
  SET nome = @nome,
      apresentacao = @apresentacao,
      unidade = @unidade,
      ativo = @ativo
  WHERE id = @id
`);

const stmtExcluir = db.prepare(`DELETE FROM medicamentos WHERE id = ?`);

// ── API pública do módulo ─────────────────────────────────────

function listar({ incluirInativos = false } = {}) {
  return incluirInativos ? stmtListarTodos.all() : stmtListar.all();
}

function buscarPorId(id) {
  return stmtBuscarPorId.get(id);
}

function inserir({ nome, apresentacao = null, unidade = null, ativo = 1 }) {
  const info = stmtInserir.run({ nome, apresentacao, unidade, ativo });
  return buscarPorId(info.lastInsertRowid);
}

function atualizar(id, { nome, apresentacao = null, unidade = null, ativo = 1 }) {
  stmtAtualizar.run({ id, nome, apresentacao, unidade, ativo });
  return buscarPorId(id);
}

function excluir(id) {
  return stmtExcluir.run(id);
}

module.exports = {
  listar,
  buscarPorId,
  inserir,
  atualizar,
  excluir
};