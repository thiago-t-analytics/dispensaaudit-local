// =============================================================
// services/assistentes.js — Regras de assistentes
// =============================================================

const queries = require('../db/queries/assistentes');
const logs = require('./logs');
const { obrigatorio, enumOpcao } = require('../utils/validators');

const PLANTOES = ['Diurno', 'Noturno'];

function listar(opcoes) { return { ok: true, data: queries.listar(opcoes) }; }

function buscarPorId(id) {
  const item = queries.buscarPorId(id);
  if (!item) return { ok: false, status: 404, message: 'Assistente não encontrado.' };
  return { ok: true, data: item };
}

function criar(dados, usuario) {
  const v1 = obrigatorio(dados.nome, 'nome');
  if (!v1.ok) return { ok: false, status: 400, message: v1.message };

  const v2 = enumOpcao(dados.plantao, 'plantao', PLANTOES);
  if (!v2.ok) return { ok: false, status: 400, message: v2.message };

  const novo = queries.inserir({
    nome: String(dados.nome).trim(),
    plantao: dados.plantao,
    farmaceutico_id: dados.farmaceutico_id || null,
    ativo: dados.ativo === 0 ? 0 : 1
  });

  logs.registrar({
    usuario, acao: 'Cadastro', tabela: 'assistentes',
    registro: novo.id, valorNovo: novo
  });

  return { ok: true, data: novo };
}

function atualizar(id, dados, usuario) {
  const existente = queries.buscarPorId(id);
  if (!existente) return { ok: false, status: 404, message: 'Assistente não encontrado.' };

  const v1 = obrigatorio(dados.nome, 'nome');
  if (!v1.ok) return { ok: false, status: 400, message: v1.message };

  const v2 = enumOpcao(dados.plantao, 'plantao', PLANTOES);
  if (!v2.ok) return { ok: false, status: 400, message: v2.message };

  const atualizado = queries.atualizar(id, {
    nome: String(dados.nome).trim(),
    plantao: dados.plantao,
    farmaceutico_id: dados.farmaceutico_id || null,
    ativo: dados.ativo === 0 ? 0 : 1
  });

  logs.registrar({
    usuario, acao: 'Edição', tabela: 'assistentes',
    registro: id, valorAnterior: existente, valorNovo: atualizado
  });

  return { ok: true, data: atualizado };
}

function excluir(id, usuario) {
  const existente = queries.buscarPorId(id);
  if (!existente) return { ok: false, status: 404, message: 'Assistente não encontrado.' };

  const atualizado = queries.atualizar(id, {
    nome: existente.nome,
    plantao: existente.plantao,
    farmaceutico_id: existente.farmaceutico_id,
    ativo: 0
  });

  logs.registrar({
    usuario, acao: 'Exclusão (lógica)', tabela: 'assistentes',
    registro: id, valorAnterior: existente, valorNovo: atualizado
  });

  return { ok: true, data: atualizado };
}

module.exports = { listar, buscarPorId, criar, atualizar, excluir, PLANTOES };