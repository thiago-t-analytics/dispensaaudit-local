// =============================================================
// services/farmaceuticos.js — Regras de farmacêuticos
// =============================================================

const queries = require('../db/queries/farmaceuticos');
const logs = require('./logs');
const { obrigatorio, enumOpcao } = require('../utils/validators');

const PLANTOES = ['Diurno', 'Noturno'];
const TIPOS = ['Fixo', 'Folguista'];

function listar(opcoes) { return { ok: true, data: queries.listar(opcoes) }; }

function buscarPorId(id) {
  const item = queries.buscarPorId(id);
  if (!item) return { ok: false, status: 404, message: 'Farmacêutico não encontrado.' };
  return { ok: true, data: item };
}

function listarPorPlantao(plantao) {
  return { ok: true, data: queries.listarPorPlantao(plantao) };
}

function criar(dados, usuario) {
  const v1 = obrigatorio(dados.nome, 'nome');
  if (!v1.ok) return { ok: false, status: 400, message: v1.message };

  const v2 = enumOpcao(dados.plantao, 'plantao', PLANTOES);
  if (!v2.ok) return { ok: false, status: 400, message: v2.message };

  const tipo = dados.tipo || 'Fixo';
  const v3 = enumOpcao(tipo, 'tipo', TIPOS);
  if (!v3.ok) return { ok: false, status: 400, message: v3.message };

  const novo = queries.inserir({
    nome: String(dados.nome).trim(),
    plantao: dados.plantao,
    tipo,
    ativo: dados.ativo === 0 ? 0 : 1
  });

  logs.registrar({
    usuario, acao: 'Cadastro', tabela: 'farmaceuticos',
    registro: novo.id, valorNovo: novo
  });

  return { ok: true, data: novo };
}

function atualizar(id, dados, usuario) {
  const existente = queries.buscarPorId(id);
  if (!existente) return { ok: false, status: 404, message: 'Farmacêutico não encontrado.' };

  const v1 = obrigatorio(dados.nome, 'nome');
  if (!v1.ok) return { ok: false, status: 400, message: v1.message };

  const v2 = enumOpcao(dados.plantao, 'plantao', PLANTOES);
  if (!v2.ok) return { ok: false, status: 400, message: v2.message };

  const tipo = dados.tipo || existente.tipo;
  const v3 = enumOpcao(tipo, 'tipo', TIPOS);
  if (!v3.ok) return { ok: false, status: 400, message: v3.message };

  const atualizado = queries.atualizar(id, {
    nome: String(dados.nome).trim(),
    plantao: dados.plantao,
    tipo,
    ativo: dados.ativo === 0 ? 0 : 1
  });

  logs.registrar({
    usuario, acao: 'Edição', tabela: 'farmaceuticos',
    registro: id, valorAnterior: existente, valorNovo: atualizado
  });

  return { ok: true, data: atualizado };
}

function excluir(id, usuario) {
  const existente = queries.buscarPorId(id);
  if (!existente) return { ok: false, status: 404, message: 'Farmacêutico não encontrado.' };

  const atualizado = queries.atualizar(id, {
    nome: existente.nome,
    plantao: existente.plantao,
    tipo: existente.tipo,
    ativo: 0
  });

  logs.registrar({
    usuario, acao: 'Exclusão (lógica)', tabela: 'farmaceuticos',
    registro: id, valorAnterior: existente, valorNovo: atualizado
  });

  return { ok: true, data: atualizado };
}

module.exports = { listar, buscarPorId, listarPorPlantao, criar, atualizar, excluir, PLANTOES, TIPOS };