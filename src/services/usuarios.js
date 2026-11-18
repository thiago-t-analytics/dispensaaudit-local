// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 07 — BACKEND: DEMAIS CADASTROS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs de tipos de erro, setores, equipes e usuarios.
// ║ CONCEITO APRENDIDO: reuso de padroes de consulta, servico e rota.
// ║ COMO TESTAR: Teste listar e cadastrar um registro ficticio em cada cadastro.
// ║ REQUER: D07-B01 completo e schema de referencia criado.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D07-B02 ▼▼▼
//// =============================================================
//// services/usuarios.js — Regras de usuários
//// =============================================================
//
//const queries = require('../db/queries/usuarios');
//const logs = require('./logs');
//const { obrigatorio } = require('../utils/validators');
//
//const PERFIS = ['Administrador', 'Administração', 'Coordenação', 'Farmacêutica', 'Usuário'];
//
//function listar(opcoes) { return { ok: true, data: queries.listar(opcoes) }; }
//
//function buscarPorId(id) {
//  const item = queries.buscarPorId(id);
//  if (!item) return { ok: false, status: 404, message: 'Usuário não encontrado.' };
//  return { ok: true, data: item };
//}
//
//function criar(dados, usuario) {
//  const v = obrigatorio(dados.nome, 'nome');
//  if (!v.ok) return { ok: false, status: 400, message: v.message };
//
//  const novo = queries.inserir({
//    nome: String(dados.nome).trim(),
//    email: dados.email || null,
//    perfil: dados.perfil || 'Usuário',
//    ativo: dados.ativo === 0 ? 0 : 1
//  });
//
//  logs.registrar({
//    usuario, acao: 'Cadastro', tabela: 'usuarios',
//    registro: novo.id, valorNovo: novo
//  });
//
//  return { ok: true, data: novo };
//}
//
//function atualizar(id, dados, usuario) {
//  const existente = queries.buscarPorId(id);
//  if (!existente) return { ok: false, status: 404, message: 'Usuário não encontrado.' };
//
//  const v = obrigatorio(dados.nome, 'nome');
//  if (!v.ok) return { ok: false, status: 400, message: v.message };
//
//  const atualizado = queries.atualizar(id, {
//    nome: String(dados.nome).trim(),
//    email: dados.email || null,
//    perfil: dados.perfil || existente.perfil,
//    ativo: dados.ativo === 0 ? 0 : 1
//  });
//
//  logs.registrar({
//    usuario, acao: 'Edição', tabela: 'usuarios',
//    registro: id, valorAnterior: existente, valorNovo: atualizado
//  });
//
//  return { ok: true, data: atualizado };
//}
//
//function excluir(id, usuario) {
//  const existente = queries.buscarPorId(id);
//  if (!existente) return { ok: false, status: 404, message: 'Usuário não encontrado.' };
//
//  const atualizado = queries.atualizar(id, {
//    nome: existente.nome,
//    email: existente.email,
//    perfil: existente.perfil,
//    ativo: 0
//  });
//
//  logs.registrar({
//    usuario, acao: 'Exclusão (lógica)', tabela: 'usuarios',
//    registro: id, valorAnterior: existente, valorNovo: atualizado
//  });
//
//  return { ok: true, data: atualizado };
//}
//
//module.exports = { listar, buscarPorId, criar, atualizar, excluir, PERFIS };
// ▲▲▲ ATE AQUI — D07-B02 ▲▲▲
// CHECKPOINT: apos D07-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
