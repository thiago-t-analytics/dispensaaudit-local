// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 08 — BACKEND: OCORRENCIAS
// ║ O QUE ESTE BLOCO FAZ: Implementa consultas, validacoes, regras, lote e auditoria.
// ║ CONCEITO APRENDIDO: regras de negocio, transacoes SQLite e integridade referencial.
// ║ COMO TESTAR: Cadastre e liste uma ocorrencia ficticia; valide tambem um lote.
// ║ REQUER: Dias 04 e 07 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D08-B01 ▼▼▼
//// =============================================================
//// queries/ocorrencias.js — SQL de ocorrências
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Contém as queries SQL da tabela `ocorrencias`.
////   É a tabela central do sistema — a que tudo se relaciona.
////
//// CONCEITO APRENDIDO:
////   - JOINs para trazer os NOMES das tabelas relacionadas
////     (medicamento, setor, farmacêutico, etc.) em vez dos IDs.
////   - Filtros dinâmicos construídos com segurança (sem SQL Injection).
////   - Paginação com LIMIT/OFFSET.
//// =============================================================
//
//const db = require('../connection');
//
//// ── SELECT base: sempre traz os nomes já resolvidos via JOIN ──
//const SELECT_BASE = `
//  SELECT
//    o.id,
//    'OCR' || printf('%06d', o.id) AS codigo,
//    o.data_ocorrencia,
//    o.prontuario,
//    o.numero_prescricao,
//    o.medicamento_id,
//    m.nome AS medicamento_nome,
//    o.tipo_erro_id,
//    t.descricao AS tipo_erro_descricao,
//    t.categoria AS tipo_erro_categoria,
//    o.setor_id,
//    s.nome AS setor_nome,
//    o.quantidade_prescrita,
//    o.quantidade_dispensada,
//    o.diferenca_quantidade,
//    o.hora_prescricao,
//    o.hora_dispensacao,
//    o.diferenca_minutos,
//    o.classificacao_horario,
//    o.plantao,
//    o.farmaceutico_id,
//    f.nome AS farmaceutico_nome,
//    o.assistente_id,
//    a.nome AS assistente_nome,
//    o.responsavel_erro,
//    o.observacoes,
//    o.status,
//    o.usuario_cadastro,
//    o.criado_em,
//    o.atualizado_em,
//    o.excluido_em
//  FROM ocorrencias o
//  JOIN medicamentos  m ON m.id = o.medicamento_id
//  JOIN tipos_erro    t ON t.id = o.tipo_erro_id
//  JOIN setores       s ON s.id = o.setor_id
//  JOIN farmaceuticos f ON f.id = o.farmaceutico_id
//  LEFT JOIN assistentes a ON a.id = o.assistente_id
//`;
//
//const stmtBuscarPorId = db.prepare(`${SELECT_BASE} WHERE o.id = ?`);
//
//// ── Inserção ─────────────────────────────────────────────────
//const stmtInserir = db.prepare(`
//  INSERT INTO ocorrencias (
//    data_ocorrencia, prontuario, numero_prescricao,
//    medicamento_id, tipo_erro_id, setor_id,
//    quantidade_prescrita, quantidade_dispensada, diferenca_quantidade,
//    hora_prescricao, hora_dispensacao, diferenca_minutos, classificacao_horario,
//    plantao, farmaceutico_id, assistente_id, responsavel_erro,
//    observacoes, status, usuario_cadastro,
//    criado_em, atualizado_em
//  ) VALUES (
//    @data_ocorrencia, @prontuario, @numero_prescricao,
//    @medicamento_id, @tipo_erro_id, @setor_id,
//    @quantidade_prescrita, @quantidade_dispensada, @diferenca_quantidade,
//    @hora_prescricao, @hora_dispensacao, @diferenca_minutos, @classificacao_horario,
//    @plantao, @farmaceutico_id, @assistente_id, @responsavel_erro,
//    @observacoes, @status, @usuario_cadastro,
//    @criado_em, @atualizado_em
//  )
//`);
//
//// ── Atualização ──────────────────────────────────────────────
//const stmtAtualizar = db.prepare(`
//  UPDATE ocorrencias SET
//    data_ocorrencia = @data_ocorrencia,
//    prontuario = @prontuario,
//    numero_prescricao = @numero_prescricao,
//    medicamento_id = @medicamento_id,
//    tipo_erro_id = @tipo_erro_id,
//    setor_id = @setor_id,
//    quantidade_prescrita = @quantidade_prescrita,
//    quantidade_dispensada = @quantidade_dispensada,
//    diferenca_quantidade = @diferenca_quantidade,
//    hora_prescricao = @hora_prescricao,
//    hora_dispensacao = @hora_dispensacao,
//    diferenca_minutos = @diferenca_minutos,
//    classificacao_horario = @classificacao_horario,
//    plantao = @plantao,
//    farmaceutico_id = @farmaceutico_id,
//    assistente_id = @assistente_id,
//    responsavel_erro = @responsavel_erro,
//    observacoes = @observacoes,
//    status = @status,
//    atualizado_em = @atualizado_em
//  WHERE id = @id
//`);
//
//// ── Soft delete (marca como Excluida) ────────────────────────
//const stmtMarcarExcluida = db.prepare(`
//  UPDATE ocorrencias
//  SET status = 'Excluida',
//      excluido_em = @excluido_em,
//      atualizado_em = @excluido_em
//  WHERE id = @id
//`);
//
//// ── Função: listar com filtros dinâmicos + paginação ─────────
//function listar(filtros = {}) {
//  const condições = [];
//  const params = {};
//
//  // Sempre exclui "Excluida" por padrão (a menos que o filtro peça)
//  if (filtros.status && filtros.status !== 'todas') {
//    condições.push('o.status = @status');
//    params.status = filtros.status;
//  } else if (filtros.status === 'todas') {
//    // Não filtra status — traz todas, inclusive Excluida
//  } else {
//    // Default: só Ativa e Concluida (esconde Excluida)
//    condições.push("o.status IN ('Ativa', 'Concluida')");
//  }
//
//  if (filtros.periodoInicio) {
//    condições.push('o.data_ocorrencia >= @periodoInicio');
//    params.periodoInicio = filtros.periodoInicio;
//  }
//  if (filtros.periodoFim) {
//    condições.push('o.data_ocorrencia <= @periodoFim');
//    params.periodoFim = filtros.periodoFim;
//  }
//  if (filtros.plantao) {
//    condições.push('o.plantao = @plantao');
//    params.plantao = filtros.plantao;
//  }
//  if (filtros.farmaceutico_id) {
//    condições.push('o.farmaceutico_id = @farmaceutico_id');
//    params.farmaceutico_id = Number(filtros.farmaceutico_id);
//  }
//  if (filtros.assistente_id) {
//    condições.push('o.assistente_id = @assistente_id');
//    params.assistente_id = Number(filtros.assistente_id);
//  }
//  if (filtros.medicamento_id) {
//    condições.push('o.medicamento_id = @medicamento_id');
//    params.medicamento_id = Number(filtros.medicamento_id);
//  }
//  if (filtros.tipo_erro_id) {
//    condições.push('o.tipo_erro_id = @tipo_erro_id');
//    params.tipo_erro_id = Number(filtros.tipo_erro_id);
//  }
//  if (filtros.setor_id) {
//    condições.push('o.setor_id = @setor_id');
//    params.setor_id = Number(filtros.setor_id);
//  }
//  if (filtros.classificacao_horario) {
//    condições.push('o.classificacao_horario = @classificacao_horario');
//    params.classificacao_horario = filtros.classificacao_horario;
//  }
//
//  const where = condições.length ? `WHERE ${condições.join(' AND ')}` : '';
//
//  // ── Paginação ────────────────────────────────────────────
//  const pagina = Math.max(1, Number(filtros.pagina) || 1);
//  const porPagina = Math.min(100, Math.max(1, Number(filtros.porPagina) || 20));
//  const offset = (pagina - 1) * porPagina;
//
//  // ── Total (sem paginação) ────────────────────────────────
//  const stmtTotal = db.prepare(`
//    SELECT COUNT(*) AS total FROM ocorrencias o ${where}
//  `);
//  const { total } = stmtTotal.get(params);
//
//  // ── Página ───────────────────────────────────────────────
//  const stmtPagina = db.prepare(`
//    ${SELECT_BASE}
//    ${where}
//    ORDER BY o.data_ocorrencia DESC, o.id DESC
//    LIMIT @limit OFFSET @offset
//  `);
//  const dados = stmtPagina.all({ ...params, limit: porPagina, offset });
//
//  return {
//    dados,
//    paginacao: {
//      pagina,
//      porPagina,
//      total,
//      totalPaginas: Math.ceil(total / porPagina)
//    }
//  };
//}
//
//// ── Função: listar TODAS sem paginação (para KPIs e gráficos) ─
//function listarTodasParaCalculo(filtros = {}) {
//  const { dados } = listar({ ...filtros, pagina: 1, porPagina: 100000 });
//  return dados;
//}
//
//function buscarPorId(id) {
//  return stmtBuscarPorId.get(id);
//}
//
//function inserir(dados) {
//  const info = stmtInserir.run(dados);
//  return buscarPorId(info.lastInsertRowid);
//}
//
//// Insere o lote em uma única transação para impedir salvamentos parciais.
//function inserirLote(itens) {
//  const inserirTudo = db.transaction(lista => lista.map(inserir));
//  return inserirTudo(itens);
//}
//
//function atualizar(id, dados) {
//  stmtAtualizar.run({ ...dados, id });
//  return buscarPorId(id);
//}
//
//function marcarExcluida(id, quando) {
//  stmtMarcarExcluida.run({ id, excluido_em: quando });
//  return buscarPorId(id);
//}
//
//module.exports = {
//  listar,
//  listarTodasParaCalculo,
//  buscarPorId,
//  inserir,
//  inserirLote,
//  atualizar,
//  marcarExcluida
//};
// ▲▲▲ ATE AQUI — D08-B01 ▲▲▲
// CHECKPOINT: apos D08-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
