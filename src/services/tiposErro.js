// =============================================================
// services/tiposErro.js — Regras de tipos de erro
// =============================================================

const queries = require('../db/queries/tiposErro');
const logs = require('./logs');
const { obrigatorio, enumOpcao } = require('../utils/validators');

const CATEGORIAS = [
  'Quantidade', 'Omissão', 'Tempo', 'Seleção',
  'Identificação', 'Processo', 'Documentação'
];

function listar(opcoes) { return { ok: true, data: queries.listar(opcoes) }; }

function buscarPorId(id) {
  const item = queries.buscarPorId(id);
  if (!item) return { ok: false, status: 404, message: 'Tipo de erro não encontrado.' };
  return { ok: true, data: item };
}

function criar(dados, usuario) {
  const v1 = obrigatorio(dados.descricao, 'descricao');
  if (!v1.ok) return { ok: false, status: 400, message: v1.message };

  const v2 = enumOpcao(dados.categoria, 'categoria', CATEGORIAS);
  if (!v2.ok) return { ok: false, status: 400, message: v2.message };

  const novo = queries.inserir({
    descricao: String(dados.descricao).trim(),
    categoria: dados.categoria,
    exemplo: dados.exemplo || null,
    ativo: dados.ativo === 0 ? 0 : 1
  });

  logs.registrar({
    usuario, acao: 'Cadastro', tabela: 'tipos_erro',
    registro: novo.id, valorNovo: novo
  });

  return { ok: true, data: novo };
}

function atualizar(id, dados, usuario) {
  const existente = queries.buscarPorId(id);
  if (!existente) return { ok: false, status: 404, message: 'Tipo de erro não encontrado.' };

  const v1 = obrigatorio(dados.descricao, 'descricao');
  if (!v1.ok) return { ok: false, status: 400, message: v1.message };

  const v2 = enumOpcao(dados.categoria, 'categoria', CATEGORIAS);
  if (!v2.ok) return { ok: false, status: 400, message: v2.message };

  const atualizado = queries.atualizar(id, {
    descricao: String(dados.descricao).trim(),
    categoria: dados.categoria,
    exemplo: dados.exemplo || null,
    ativo: dados.ativo === 0 ? 0 : 1
  });

  logs.registrar({
    usuario, acao: 'Edição', tabela: 'tipos_erro',
    registro: id, valorAnterior: existente, valorNovo: atualizado
  });

  return { ok: true, data: atualizado };
}

function excluir(id, usuario) {
  const existente = queries.buscarPorId(id);
  if (!existente) return { ok: false, status: 404, message: 'Tipo de erro não encontrado.' };

  const atualizado = queries.atualizar(id, {
    descricao: existente.descricao,
    categoria: existente.categoria,
    exemplo: existente.exemplo,
    ativo: 0
  });

  logs.registrar({
    usuario, acao: 'Exclusão (lógica)', tabela: 'tipos_erro',
    registro: id, valorAnterior: existente, valorNovo: atualizado
  });

  return { ok: true, data: atualizado };
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, CATEGORIAS };