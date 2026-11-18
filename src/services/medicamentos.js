// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: PRIMEIRO CRUD
// ║ O QUE ESTE BLOCO FAZ: Conecta SQLite, valida dados e implementa medicamentos.
// ║ CONCEITO APRENDIDO: prepared statements, validacao e separacao em camadas.
// ║ COMO TESTAR: Descomente o grupo e teste GET/POST /api/medicamentos.
// ║ REQUER: D06-B01 e schema D04 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B01 ▼▼▼
//// =============================================================
//// services/medicamentos.js — Regras de negócio
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Orquestra validação + auditoria + chamada ao banco.
////   É chamado pela route, chama a query.
////
//// CONCEITO APRENDIDO:
////   - Service é o "cérebro" da operação: valida ANTES de gravar,
////     registra log DEPOIS de gravar.
////   - Sempre retorna { ok, data } ou { ok: false, message, status }.
//// =============================================================
//
//const queries = require('../db/queries/medicamentos');
//const logs = require('./logs');
//const { obrigatorio } = require('../utils/validators');
//
//function listar(opcoes = {}) {
//  return { ok: true, data: queries.listar(opcoes) };
//}
//
//function buscarPorId(id) {
//  const item = queries.buscarPorId(id);
//  if (!item) {
//    return { ok: false, status: 404, message: 'Medicamento não encontrado.' };
//  }
//  return { ok: true, data: item };
//}
//
//function criar(dados, usuario) {
//  // ── 1. Validação ────────────────────────────────────────────
//  const v = obrigatorio(dados.nome, 'nome');
//  if (!v.ok) return { ok: false, status: 400, message: v.message };
//
//  // ── 2. Inserção ─────────────────────────────────────────────
//  const novo = queries.inserir({
//    nome: String(dados.nome).trim(),
//    apresentacao: dados.apresentacao || null,
//    unidade: dados.unidade || null,
//    ativo: dados.ativo === 0 ? 0 : 1
//  });
//
//  // ── 3. Auditoria ────────────────────────────────────────────
//  logs.registrar({
//    usuario,
//    acao: 'Cadastro',
//    tabela: 'medicamentos',
//    registro: novo.id,
//    valorNovo: novo
//  });
//
//  return { ok: true, data: novo };
//}
//
//function atualizar(id, dados, usuario) {
//  const existente = queries.buscarPorId(id);
//  if (!existente) {
//    return { ok: false, status: 404, message: 'Medicamento não encontrado.' };
//  }
//
//  const v = obrigatorio(dados.nome, 'nome');
//  if (!v.ok) return { ok: false, status: 400, message: v.message };
//
//  const atualizado = queries.atualizar(id, {
//    nome: String(dados.nome).trim(),
//    apresentacao: dados.apresentacao || null,
//    unidade: dados.unidade || null,
//    ativo: dados.ativo === 0 ? 0 : 1
//  });
//
//  logs.registrar({
//    usuario,
//    acao: 'Edição',
//    tabela: 'medicamentos',
//    registro: id,
//    valorAnterior: existente,
//    valorNovo: atualizado
//  });
//
//  return { ok: true, data: atualizado };
//}
//
//function excluir(id, usuario) {
//  const existente = queries.buscarPorId(id);
//  if (!existente) {
//    return { ok: false, status: 404, message: 'Medicamento não encontrado.' };
//  }
//
//  // ⚠️ Exclusão LÓGICA — não apagamos fisicamente.
//  // Motivo: um medicamento inativado ainda pode aparecer em
//  // ocorrências antigas. Apagar quebraria a integridade.
//  const atualizado = queries.atualizar(id, {
//    nome: existente.nome,
//    apresentacao: existente.apresentacao,
//    unidade: existente.unidade,
//    ativo: 0
//  });
//
//  logs.registrar({
//    usuario,
//    acao: 'Exclusão (lógica)',
//    tabela: 'medicamentos',
//    registro: id,
//    valorAnterior: existente,
//    valorNovo: atualizado
//  });
//
//  return { ok: true, data: atualizado };
//}
//
//module.exports = { listar, buscarPorId, criar, atualizar, excluir };
// ▲▲▲ ATE AQUI — D07-B01 ▲▲▲
// CHECKPOINT: apos D07-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
