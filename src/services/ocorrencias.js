// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 08 — BACKEND: OCORRENCIAS
// ║ O QUE ESTE BLOCO FAZ: Implementa consultas, validacoes, regras, lote e auditoria.
// ║ CONCEITO APRENDIDO: regras de negocio, transacoes SQLite e integridade referencial.
// ║ COMO TESTAR: Cadastre e liste uma ocorrencia ficticia; valide tambem um lote.
// ║ REQUER: Dias 04 e 07 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D08-B01 ▼▼▼
//// =============================================================
//// services/ocorrencias.js — Regras de negócio das ocorrências
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   É o CÉREBRO do cadastro de ocorrência. Aplica as regras de
////   cálculo automático, valida integridade e chama o banco.
////
//// CONCEITO APRENDIDO:
////   - Regras de negócio (cálculos, derivações) vivem no service,
////     NÃO na route nem na query.
////   - O service recebe dados "crus" do cliente e devolve dados
////     "enriquecidos" prontos para o banco.
////   - Validação em cascata: campos obrigatórios → enum → FK.
//// =============================================================
//
//const queries = require('../db/queries/ocorrencias');
//const queriesMed = require('../db/queries/medicamentos');
//const queriesTipo = require('../db/queries/tiposErro');
//const queriesSetor = require('../db/queries/setores');
//const queriesFarm = require('../db/queries/farmaceuticos');
//const queriesAssist = require('../db/queries/assistentes');
//const logs = require('./logs');
//
//const {
//  obrigatorio,
//  numero,
//  data: validarData,
//  horaOpcional,
//  enumOpcao
//} = require('../utils/validators');
//
//const {
//  calcularDiferencaMinutos,
//  classificarHorario,
//  calcularDiferencaQuantidade,
//  agoraIso
//} = require('../utils/formatters');
//
//const STATUS_PERMITIDOS = ['Ativa', 'Concluida', 'Excluida'];
//const RESPONSAVEIS = ['Farmacêutico', 'Assistente'];
//const PLANTOES = ['Diurno', 'Noturno'];
//
//// ═══════════════════════════════════════════════════════════════
//// APLICA REGRAS DE NEGÓCIO (cálculos + observação automática)
//// ═══════════════════════════════════════════════════════════════
//function aplicarRegras(dados) {
//  const resultado = { ...dados };
//
//  // ── 1. Diferença de quantidade ─────────────────────────────
//  resultado.diferenca_quantidade = calcularDiferencaQuantidade(
//    resultado.quantidade_prescrita,
//    resultado.quantidade_dispensada
//  );
//
//  // ── 2. Diferença de minutos + classificação ────────────────
//  if (resultado.hora_prescricao && resultado.hora_dispensacao) {
//    const diff = calcularDiferencaMinutos(
//      resultado.hora_prescricao,
//      resultado.hora_dispensacao
//    );
//    resultado.diferenca_minutos = diff;
//    resultado.classificacao_horario = classificarHorario(diff);
//
//    // Observação automática para horários fora da janela
//    if (resultado.classificacao_horario === 'Antecipada' ||
//        resultado.classificacao_horario === 'Atrasada') {
//      const obsAuto = `[REGISTRO AUTOMÁTICO DE HORÁRIO] Classificação: ${resultado.classificacao_horario}. Hora da Prescrição: ${resultado.hora_prescricao}, Hora da Dispensação: ${resultado.hora_dispensacao} (Diferença: ${diff} min).`;
//      resultado.observacoes = resultado.observacoes
//        ? `${resultado.observacoes}\n\n${obsAuto}`
//        : obsAuto;
//    }
//  } else {
//    resultado.diferenca_minutos = null;
//    resultado.classificacao_horario = 'Não informado';
//  }
//
//  return resultado;
//}
//
//// ═══════════════════════════════════════════════════════════════
//// VALIDA UM CONJUNTO DE DADOS DE OCORRÊNCIA
//// ═══════════════════════════════════════════════════════════════
//function validar(dados) {
//  // ── Campos básicos ─────────────────────────────────────────
//  const checagens = [
//    ['data_ocorrencia', validarData(dados.data_ocorrencia, 'data_ocorrencia')],
//    ['prontuario', obrigatorio(dados.prontuario, 'prontuario')],
//    ['numero_prescricao', obrigatorio(dados.numero_prescricao, 'numero_prescricao')],
//    ['quantidade_prescrita', numero(dados.quantidade_prescrita, 'quantidade_prescrita', { min: 0 })],
//    ['plantao', enumOpcao(dados.plantao, 'plantao', PLANTOES)],
//    ['responsavel_erro', enumOpcao(dados.responsavel_erro, 'responsavel_erro', RESPONSAVEIS)],
//    ['hora_prescricao', horaOpcional(dados.hora_prescricao, 'hora_prescricao')],
//    ['hora_dispensacao', horaOpcional(dados.hora_dispensacao, 'hora_dispensacao')]
//  ];
//
//  for (const [, r] of checagens) {
//    if (!r.ok) return r;
//  }
//
//  // ── Quantidade dispensada (opcional, mas se vier tem que ser ≥ 0) ──
//  if (dados.quantidade_dispensada !== null &&
//      dados.quantidade_dispensada !== undefined &&
//      dados.quantidade_dispensada !== '') {
//    const r = numero(dados.quantidade_dispensada, 'quantidade_dispensada', { min: 0 });
//    if (!r.ok) return r;
//  }
//
//  // ── FKs obrigatórias ───────────────────────────────────────
//  if (!dados.medicamento_id) {
//    return { ok: false, status: 400, message: 'medicamento_id é obrigatório.' };
//  }
//  if (!queriesMed.buscarPorId(dados.medicamento_id)) {
//    return { ok: false, status: 400, message: 'Medicamento não encontrado.' };
//  }
//
//  if (!dados.tipo_erro_id) {
//    return { ok: false, status: 400, message: 'tipo_erro_id é obrigatório.' };
//  }
//  if (!queriesTipo.buscarPorId(dados.tipo_erro_id)) {
//    return { ok: false, status: 400, message: 'Tipo de erro não encontrado.' };
//  }
//
//  if (!dados.setor_id) {
//    return { ok: false, status: 400, message: 'setor_id é obrigatório.' };
//  }
//  if (!queriesSetor.buscarPorId(dados.setor_id)) {
//    return { ok: false, status: 400, message: 'Setor não encontrado.' };
//  }
//
//  if (!dados.farmaceutico_id) {
//    return { ok: false, status: 400, message: 'farmaceutico_id é obrigatório.' };
//  }
//  if (!queriesFarm.buscarPorId(dados.farmaceutico_id)) {
//    return { ok: false, status: 400, message: 'Farmacêutico não encontrado.' };
//  }
//
//  // ── Regra do assistente ────────────────────────────────────
//  if (dados.responsavel_erro === 'Assistente') {
//    if (!dados.assistente_id) {
//      return {
//        ok: false,
//        status: 400,
//        message: 'assistente_id é obrigatório quando o responsável é Assistente.'
//      };
//    }
//    if (!queriesAssist.buscarPorId(dados.assistente_id)) {
//      return { ok: false, status: 400, message: 'Assistente não encontrado.' };
//    }
//  }
//
//  return { ok: true };
//}
//
//// ═══════════════════════════════════════════════════════════════
//// NORMALIZA OS DADOS (limpa, converte, alinha com o schema)
//// ═══════════════════════════════════════════════════════════════
//function normalizar(dados) {
//  return {
//    data_ocorrencia: dados.data_ocorrencia,
//    prontuario: String(dados.prontuario).trim(),
//    numero_prescricao: String(dados.numero_prescricao).trim(),
//    medicamento_id: Number(dados.medicamento_id),
//    tipo_erro_id: Number(dados.tipo_erro_id),
//    setor_id: Number(dados.setor_id),
//    quantidade_prescrita: Number(dados.quantidade_prescrita),
//    quantidade_dispensada:
//      (dados.quantidade_dispensada === null ||
//       dados.quantidade_dispensada === undefined ||
//       dados.quantidade_dispensada === '')
//        ? null
//        : Number(dados.quantidade_dispensada),
//    hora_prescricao: dados.hora_prescricao || null,
//    hora_dispensacao: dados.hora_dispensacao || null,
//    plantao: dados.plantao,
//    farmaceutico_id: Number(dados.farmaceutico_id),
//    assistente_id:
//      (dados.responsavel_erro === 'Assistente' && dados.assistente_id)
//        ? Number(dados.assistente_id)
//        : null,
//    responsavel_erro: dados.responsavel_erro,
//    observacoes: dados.observacoes || null,
//    status: dados.status || 'Ativa'
//  };
//}
//
//// ═══════════════════════════════════════════════════════════════
//// API PÚBLICA
//// ═══════════════════════════════════════════════════════════════
//function listar(filtros) {
//  return { ok: true, ...queries.listar(filtros) };
//}
//
//function buscarPorId(id) {
//  const item = queries.buscarPorId(id);
//  if (!item) {
//    return { ok: false, status: 404, message: 'Ocorrência não encontrada.' };
//  }
//  return { ok: true, data: item };
//}
//
//function criar(dadosBrutos, usuario) {
//  // 1. Normaliza
//  const dados = normalizar(dadosBrutos);
//
//  // 2. Valida
//  const v = validar(dados);
//  if (!v.ok) return v;
//
//  // 3. Aplica regras (cálculos)
//  const enriquecidos = aplicarRegras(dados);
//
//  // 4. Preenche campos de auditoria
//  const agora = agoraIso();
//  const paraInserir = {
//    ...enriquecidos,
//    usuario_cadastro: usuario || 'Sistema',
//    criado_em: agora,
//    atualizado_em: agora
//  };
//
//  // 5. Insere
//  const novo = queries.inserir(paraInserir);
//
//  // 6. Auditoria
//  logs.registrar({
//    usuario,
//    acao: 'Cadastro',
//    tabela: 'ocorrencias',
//    registro: novo.id,
//    valorNovo: novo
//  });
//
//  return { ok: true, data: novo };
//}
//
//function criarLote(dadosBrutos, usuario) {
//  const identificacao = dadosBrutos?.identificacao || {};
//  const itens = dadosBrutos?.itens;
//
//  const checagensIdentificacao = [
//    validarData(identificacao.data_ocorrencia, 'data_ocorrencia'),
//    obrigatorio(identificacao.prontuario, 'prontuario'),
//    obrigatorio(identificacao.numero_prescricao, 'numero_prescricao'),
//    enumOpcao(identificacao.plantao, 'plantao', PLANTOES)
//  ];
//  for (const resultado of checagensIdentificacao) {
//    if (!resultado.ok) return { ...resultado, status: 400 };
//  }
//
//  const setorId = Number(identificacao.setor_id);
//  if (!setorId || !queriesSetor.buscarPorId(setorId)) {
//    return { ok: false, status: 400, message: 'Setor não encontrado.' };
//  }
//  if (!Array.isArray(itens) || itens.length === 0) {
//    return { ok: false, status: 400, message: 'Adicione ao menos um item ao lote.' };
//  }
//
//  const agora = agoraIso();
//  const paraInserir = [];
//  for (const [indice, item] of itens.entries()) {
//    // Valida antes de normalizar: Number(null) se tornaria zero e ocultaria campo ausente.
//    if (!obrigatorio(item?.quantidade_prescrita, 'quantidade_prescrita').ok) {
//      return {
//        ok: false,
//        status: 400,
//        message: `Item ${indice + 1}: quantidade_prescrita é obrigatório.`
//      };
//    }
//
//    const dados = normalizar({
//      ...item,
//      data_ocorrencia: identificacao.data_ocorrencia,
//      prontuario: identificacao.prontuario,
//      numero_prescricao: identificacao.numero_prescricao,
//      setor_id: setorId,
//      plantao: identificacao.plantao
//    });
//    const validacao = validar(dados);
//    if (!validacao.ok) {
//      return {
//        ok: false,
//        status: 400,
//        message: `Item ${indice + 1}: ${validacao.message}`
//      };
//    }
//
//    paraInserir.push({
//      ...aplicarRegras(dados),
//      usuario_cadastro: usuario || 'Sistema',
//      criado_em: agora,
//      atualizado_em: agora
//    });
//  }
//
//  const criadas = queries.inserirLote(paraInserir);
//  const ids = criadas.map(ocorrencia => ocorrencia.id);
//  const codigos = criadas.map(ocorrencia => ocorrencia.codigo);
//
//  logs.registrar({
//    usuario,
//    acao: 'Cadastro em Lote',
//    tabela: 'ocorrencias',
//    registro: ids.join(', '),
//    valorNovo: { ids, codigos, total: criadas.length }
//  });
//
//  return { ok: true, ids, total: criadas.length, codigos };
//}
//
//function atualizar(id, dadosBrutos, usuario) {
//  const existente = queries.buscarPorId(id);
//  if (!existente) {
//    return { ok: false, status: 404, message: 'Ocorrência não encontrada.' };
//  }
//
//  const dados = normalizar({ ...existente, ...dadosBrutos });
//
//  const v = validar(dados);
//  if (!v.ok) return v;
//
//  const enriquecidos = aplicarRegras(dados);
//
//  const paraAtualizar = {
//    ...enriquecidos,
//    atualizado_em: agoraIso()
//  };
//
//  const atualizado = queries.atualizar(id, paraAtualizar);
//
//  logs.registrar({
//    usuario,
//    acao: 'Edição',
//    tabela: 'ocorrencias',
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
//    return { ok: false, status: 404, message: 'Ocorrência não encontrada.' };
//  }
//
//  if (existente.status === 'Excluida') {
//    return { ok: false, status: 409, message: 'Ocorrência já está excluída.' };
//  }
//
//  const agora = agoraIso();
//  const excluida = queries.marcarExcluida(id, agora);
//
//  logs.registrar({
//    usuario,
//    acao: 'Exclusão',
//    tabela: 'ocorrencias',
//    registro: id,
//    valorAnterior: existente,
//    valorNovo: excluida
//  });
//
//  return { ok: true, data: excluida };
//}
//
//function alterarStatus(id, novoStatus, usuario) {
//  const existente = queries.buscarPorId(id);
//  if (!existente) {
//    return { ok: false, status: 404, message: 'Ocorrência não encontrada.' };
//  }
//
//  if (!['Ativa', 'Concluida'].includes(novoStatus)) {
//    return {
//      ok: false,
//      status: 400,
//      message: 'Status inválido. Use "Ativa" ou "Concluida".'
//    };
//  }
//
//  const atualizado = queries.atualizar(id, {
//    ...existente,
//    status: novoStatus,
//    atualizado_em: agoraIso()
//  });
//
//  logs.registrar({
//    usuario,
//    acao: 'Atualização de Status',
//    tabela: 'ocorrencias',
//    registro: id,
//    valorAnterior: existente.status,
//    valorNovo: novoStatus
//  });
//
//  return { ok: true, data: atualizado };
//}
//
//module.exports = {
//  listar,
//  buscarPorId,
//  criar,
//  criarLote,
//  atualizar,
//  excluir,
//  alterarStatus
//};
// ▲▲▲ ATE AQUI — D08-B01 ▲▲▲
// CHECKPOINT: apos D08-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
