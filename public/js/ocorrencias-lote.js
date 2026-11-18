// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 13 — FRONTEND: OCORRENCIAS
// ║ O QUE ESTE BLOCO FAZ: Habilita formulario, cadastro em lote e listagem.
// ║ CONCEITO APRENDIDO: formularios, validacao no cliente e paginacao.
// ║ COMO TESTAR: Crie ocorrencia ficticia e encontre-a na lista.
// ║ REQUER: Dias 07, 08 e 11 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D13-B01 ▼▼▼
//// =============================================================
//// ocorrencias-lote.js — Assistente de lançamento de ocorrências em lote
//// O que faz: mantém a identificação compartilhada e gerencia os itens do lote.
//// Por que existe: permite registrar vários erros do mesmo prontuário em uma
//// chamada atômica, sem duplicar os dados de identificação.
//// Como testar: preencha a identificação, adicione itens, revise e salve o lote.
//// =============================================================
//
//window.OcorrenciasLote = (() => {
//  // Mantém a etapa e os itens mesmo se o usuário navegar para outra página.
//  const estado = State.ocorrenciasLote;
//  let inicializado = false;
//
//  function escaparHtml(valor) {
//    return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
//      '&': '&amp;',
//      '<': '&lt;',
//      '>': '&gt;',
//      '"': '&quot;',
//      "'": '&#39;'
//    })[caractere]);
//  }
//
//  function preencherSelect(id, lista, texto) {
//    const select = document.getElementById(id);
//    select.innerHTML = '<option value="">Selecione...</option>' +
//      lista.map(item => `<option value="${Number(item.id)}">${escaparHtml(item[texto])}</option>`).join('');
//  }
//
//  function inicializar() {
//    if (inicializado) return;
//    inicializado = true;
//
//    preencherSelect('loteSetor', State.refs.setores, 'nome');
//    preencherSelect('loteMedicamento', State.refs.medicamentos, 'nome');
//    preencherSelect('loteTipoErro', State.refs.tiposErro, 'descricao');
//    if (!document.getElementById('loteDataOcorrencia').value) {
//      document.getElementById('loteDataOcorrencia').value =
//        new Date().toISOString().slice(0, 10);
//    }
//
//    document.querySelectorAll('#loteIdentificacaoTitulo + .form-grid input, ' +
//      '#loteIdentificacaoTitulo + .form-grid select').forEach(campo => {
//      campo.addEventListener('input', atualizarBotaoContinuar);
//      campo.addEventListener('change', atualizarBotaoContinuar);
//    });
//    document.getElementById('lotePlantao').addEventListener('change', () => {
//      carregarFarmaceuticos();
//      atualizarBotaoContinuar();
//    });
//    document.getElementById('btnContinuarEtapa1').addEventListener('click', continuar);
//    document.getElementById('btnVoltarIdentificacao').addEventListener('click', () => definirEtapa(1));
//    document.getElementById('btnVoltarItens').addEventListener('click', () => definirEtapa(2));
//    document.getElementById('btnVerPrevia').addEventListener('click', abrirPrevia);
//    document.getElementById('btnSalvarLote').addEventListener('click', salvarLote);
//    document.getElementById('formItemLote').addEventListener('submit', adicionarItem);
//    document.getElementById('loteFarmaceutico').addEventListener('change', () => carregarAssistentes());
//    document.getElementById('loteErroFarmaceutico').addEventListener('change', alternarResponsavel);
//    document.getElementById('loteItensLista').addEventListener('click', tratarAcaoItem);
//
//    carregarFarmaceuticos();
//    atualizarBotaoContinuar();
//    renderizarItens();
//    definirEtapa(estado.etapa || 1);
//  }
//
//  function obterCamposIdentificacao() {
//    return {
//      data_ocorrencia: document.getElementById('loteDataOcorrencia').value,
//      prontuario: document.getElementById('loteProntuario').value.trim(),
//      numero_prescricao: document.getElementById('loteNumeroPrescricao').value.trim(),
//      setor_id: Number(document.getElementById('loteSetor').value),
//      plantao: document.getElementById('lotePlantao').value
//    };
//  }
//
//  function camposIdentificacao() {
//    return [
//      document.getElementById('loteDataOcorrencia'),
//      document.getElementById('loteProntuario'),
//      document.getElementById('loteNumeroPrescricao'),
//      document.getElementById('loteSetor'),
//      document.getElementById('lotePlantao')
//    ];
//  }
//
//  function identificacaoValida(mostrarErro = false) {
//    const invalido = camposIdentificacao().find(campo => !campo.checkValidity());
//    if (invalido && mostrarErro) invalido.reportValidity();
//    return !invalido;
//  }
//
//  function atualizarBotaoContinuar() {
//    document.getElementById('btnContinuarEtapa1').disabled = !identificacaoValida();
//  }
//
//  function continuar() {
//    if (!identificacaoValida(true)) return;
//    definirEtapa(2);
//  }
//
//  function definirEtapa(etapa) {
//    estado.etapa = etapa;
//    document.getElementById('loteEtapa2').hidden = etapa !== 2;
//    document.getElementById('loteEtapa3').hidden = etapa !== 3;
//    document.getElementById('btnContinuarEtapa1').hidden = etapa !== 1;
//    document.querySelectorAll('[data-etapa-indicador]').forEach(indicador => {
//      const numero = Number(indicador.dataset.etapaIndicador);
//      if (numero === etapa) indicador.setAttribute('aria-current', 'step');
//      else indicador.removeAttribute('aria-current');
//      indicador.classList.toggle('concluida', numero < etapa);
//    });
//    if (etapa === 3) renderizarItens();
//  }
//
//  function carregarFarmaceuticos(selecionado = '') {
//    const plantao = document.getElementById('lotePlantao').value;
//    const select = document.getElementById('loteFarmaceutico');
//    const lista = State.refs.farmaceuticos.filter(item => item.plantao === plantao);
//    select.innerHTML = '<option value="">Selecione...</option>' +
//      lista.map(item => `<option value="${Number(item.id)}">${escaparHtml(item.nome)}</option>`).join('');
//    select.value = selecionado ? String(selecionado) : '';
//    carregarAssistentes();
//  }
//
//  function carregarAssistentes(selecionado = '') {
//    const select = document.getElementById('loteAssistente');
//    const farmaceuticoId = Number(document.getElementById('loteFarmaceutico').value);
//    const farmaceutico = State.refs.farmaceuticos.find(item => item.id === farmaceuticoId);
//    const responsavelFarmaceutico = document.getElementById('loteErroFarmaceutico').checked;
//
//    if (responsavelFarmaceutico) {
//      select.innerHTML = '<option value="">Não se aplica</option>';
//      select.disabled = true;
//      return;
//    }
//    if (!farmaceutico) {
//      select.innerHTML = '<option value="">Selecione o farmacêutico primeiro</option>';
//      select.disabled = true;
//      return;
//    }
//
//    const lista = farmaceutico.tipo === 'Folguista'
//      ? State.refs.assistentes.filter(item => item.plantao === farmaceutico.plantao)
//      : State.refs.assistentes.filter(item => item.farmaceutico_id === farmaceuticoId);
//    select.innerHTML = '<option value="">Selecione...</option>' +
//      lista.map(item => `<option value="${Number(item.id)}">${escaparHtml(item.nome)}</option>`).join('');
//    select.disabled = false;
//    select.value = selecionado ? String(selecionado) : '';
//  }
//
//  function alternarResponsavel() {
//    const select = document.getElementById('loteAssistente');
//    if (document.getElementById('loteErroFarmaceutico').checked) {
//      select.innerHTML = '<option value="">Não se aplica</option>';
//      select.disabled = true;
//    } else {
//      carregarAssistentes();
//    }
//  }
//
//  function lerItemDoFormulario() {
//    const responsavelFarmaceutico = document.getElementById('loteErroFarmaceutico').checked;
//    const medicamentoId = Number(document.getElementById('loteMedicamento').value);
//    const tipoErroId = Number(document.getElementById('loteTipoErro').value);
//
//    return {
//      medicamento_id: medicamentoId,
//      tipo_erro_id: tipoErroId,
//      quantidade_prescrita: Number(document.getElementById('loteQuantidadePrescrita').value),
//      quantidade_dispensada: document.getElementById('loteQuantidadeDispensada').value
//        ? Number(document.getElementById('loteQuantidadeDispensada').value)
//        : null,
//      hora_prescricao: document.getElementById('loteHoraPrescricao').value || null,
//      hora_dispensacao: document.getElementById('loteHoraDispensacao').value || null,
//      farmaceutico_id: Number(document.getElementById('loteFarmaceutico').value),
//      assistente_id: responsavelFarmaceutico
//        ? null
//        : Number(document.getElementById('loteAssistente').value) || null,
//      responsavel_erro: responsavelFarmaceutico ? 'Farmacêutico' : 'Assistente',
//      observacoes: document.getElementById('loteObservacoes').value.trim() || null
//    };
//  }
//
//  function adicionarItem(evento) {
//    evento.preventDefault();
//    if (!identificacaoValida(true)) return;
//
//    const form = evento.currentTarget;
//    if (!form.reportValidity()) return;
//    const item = lerItemDoFormulario();
//    if (!item.farmaceutico_id) {
//      UI.toast('Selecione o farmacêutico responsável pelo plantão.', 'warning');
//      document.getElementById('loteFarmaceutico').focus();
//      return;
//    }
//    if (item.responsavel_erro === 'Assistente' && !item.assistente_id) {
//      UI.toast('Selecione o assistente ou marque “Erro do farmacêutico”.', 'warning');
//      document.getElementById('loteAssistente').focus();
//      return;
//    }
//
//    if (estado.indiceEdicao === null) {
//      estado.itens.push(item);
//    } else {
//      // Na edição, substitui a posição original em vez de duplicar o item.
//      estado.itens[estado.indiceEdicao] = item;
//      estado.indiceEdicao = null;
//    }
//
//    limparFormularioItem();
//    renderizarItens();
//    definirEtapa(2);
//    UI.toast(`${estado.itens.length} ${estado.itens.length === 1 ? 'item adicionado' : 'itens adicionados'}.`, 'success');
//  }
//
//  function limparFormularioItem() {
//    document.getElementById('formItemLote').reset();
//    document.getElementById('loteErroFarmaceutico').checked = false;
//    carregarAssistentes();
//    document.getElementById('btnAdicionarItem').textContent = 'Adicionar à lista';
//  }
//
//  function nomeReferencia(lista, id, campo) {
//    return lista.find(item => Number(item.id) === Number(id))?.[campo] || 'Não informado';
//  }
//
//  function renderizarItens() {
//    const lista = document.getElementById('loteItensLista');
//    const contador = estado.itens.length;
//    document.getElementById('loteContagem').textContent =
//      `${contador} ${contador === 1 ? 'item será salvo' : 'itens serão salvos'}`;
//    document.getElementById('btnVerPrevia').disabled = contador === 0;
//    document.getElementById('btnVerPrevia').textContent = `Revisar itens (${contador})`;
//    document.getElementById('btnSalvarLote').disabled = contador === 0;
//
//    if (!contador) {
//      lista.innerHTML = '<p class="lote-vazio">Adicione ao menos um item antes de revisar o lote.</p>';
//      return;
//    }
//
//    lista.innerHTML = estado.itens.map((item, indice) => {
//      const medicamento = nomeReferencia(State.refs.medicamentos, item.medicamento_id, 'nome');
//      const tipoErro = nomeReferencia(State.refs.tiposErro, item.tipo_erro_id, 'descricao');
//      const farmaceutico = nomeReferencia(State.refs.farmaceuticos, item.farmaceutico_id, 'nome');
//      const assistente = item.assistente_id
//        ? nomeReferencia(State.refs.assistentes, item.assistente_id, 'nome')
//        : 'Não se aplica';
//      const quantidadeDispensada = item.quantidade_dispensada ?? '—';
//
//      return `
//        <article class="lote-item-card">
//          <div class="lote-item-dados">
//            <h5>${escaparHtml(medicamento)}</h5>
//            <p>${escaparHtml(tipoErro)}</p>
//            <dl>
//              <div><dt>Quantidade</dt><dd>${escaparHtml(item.quantidade_prescrita)} prescrita · ${escaparHtml(quantidadeDispensada)} dispensada</dd></div>
//              <div><dt>Horários</dt><dd>${escaparHtml(item.hora_prescricao || '—')} → ${escaparHtml(item.hora_dispensacao || '—')}</dd></div>
//              <div><dt>Equipe</dt><dd>${escaparHtml(farmaceutico)} · ${escaparHtml(assistente)}</dd></div>
//            </dl>
//          </div>
//          <div class="lote-item-acoes">
//            <button class="btn btn-sm btn-outline" type="button" data-acao-item="editar"
//              data-indice="${indice}" aria-label="Editar item ${indice + 1}">Editar</button>
//            <button class="btn btn-sm btn-danger" type="button" data-acao-item="remover"
//              data-indice="${indice}" aria-label="Remover item ${indice + 1}">Remover</button>
//          </div>
//        </article>`;
//    }).join('');
//  }
//
//  function tratarAcaoItem(evento) {
//    const botao = evento.target.closest('button[data-acao-item]');
//    if (!botao) return;
//    const indice = Number(botao.dataset.indice);
//    if (!Number.isInteger(indice) || !estado.itens[indice]) return;
//
//    if (botao.dataset.acaoItem === 'editar') editarItem(indice);
//    if (botao.dataset.acaoItem === 'remover') removerItem(indice);
//  }
//
//  function editarItem(indice) {
//    const item = estado.itens[indice];
//    document.getElementById('loteMedicamento').value = String(item.medicamento_id);
//    document.getElementById('loteTipoErro').value = String(item.tipo_erro_id);
//    document.getElementById('loteQuantidadePrescrita').value = item.quantidade_prescrita;
//    document.getElementById('loteQuantidadeDispensada').value = item.quantidade_dispensada ?? '';
//    document.getElementById('loteHoraPrescricao').value = item.hora_prescricao || '';
//    document.getElementById('loteHoraDispensacao').value = item.hora_dispensacao || '';
//    carregarFarmaceuticos(item.farmaceutico_id);
//    const responsavelFarmaceutico = item.responsavel_erro === 'Farmacêutico';
//    document.getElementById('loteErroFarmaceutico').checked = responsavelFarmaceutico;
//    if (responsavelFarmaceutico) alternarResponsavel();
//    else carregarAssistentes(item.assistente_id);
//    document.getElementById('loteObservacoes').value = item.observacoes || '';
//    estado.indiceEdicao = indice;
//    document.getElementById('btnAdicionarItem').textContent = 'Atualizar item';
//    definirEtapa(2);
//    document.getElementById('loteMedicamento').focus();
//  }
//
//  function removerItem(indice) {
//    estado.itens.splice(indice, 1);
//    if (estado.indiceEdicao === indice) {
//      estado.indiceEdicao = null;
//      limparFormularioItem();
//    } else if (estado.indiceEdicao !== null && estado.indiceEdicao > indice) {
//      estado.indiceEdicao -= 1;
//    }
//    renderizarItens();
//  }
//
//  function abrirPrevia() {
//    if (!estado.itens.length) {
//      UI.toast('Adicione ao menos um item para revisar.', 'warning');
//      return;
//    }
//    renderizarItens();
//    definirEtapa(3);
//  }
//
//  async function salvarLote() {
//    if (!identificacaoValida(true)) {
//      definirEtapa(1);
//      return;
//    }
//    if (!estado.itens.length) {
//      UI.toast('Adicione ao menos um item antes de salvar.', 'warning');
//      definirEtapa(2);
//      return;
//    }
//
//    const payload = {
//      identificacao: obterCamposIdentificacao(),
//      itens: estado.itens
//    };
//    UI.loading('Salvando ocorrências do lote...');
//    try {
//      const resposta = await Api.post('/api/ocorrencias/lote', payload);
//      const total = Number(resposta.total) || estado.itens.length;
//      UI.toast(`${total} ${total === 1 ? 'ocorrência criada' : 'ocorrências criadas'}.`, 'success');
//      limparLote();
//    } catch (erro) {
//      // Preserva o formulário e os itens para correção quando a API rejeita o lote.
//      UI.toast(`Não foi possível salvar o lote: ${erro.message}`, 'error');
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  function limparLote() {
//    estado.itens = [];
//    estado.indiceEdicao = null;
//    estado.etapa = 1;
//    document.getElementById('loteDataOcorrencia').value = new Date().toISOString().slice(0, 10);
//    document.getElementById('loteProntuario').value = '';
//    document.getElementById('loteNumeroPrescricao').value = '';
//    document.getElementById('loteSetor').value = '';
//    document.getElementById('lotePlantao').value = '';
//    carregarFarmaceuticos();
//    limparFormularioItem();
//    atualizarBotaoContinuar();
//    renderizarItens();
//    definirEtapa(1);
//  }
//
//  return { inicializar };
//})();
// ▲▲▲ ATE AQUI — D13-B01 ▲▲▲
// CHECKPOINT: apos D13-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
