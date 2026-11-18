// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 13 — FRONTEND: OCORRENCIAS
// ║ O QUE ESTE BLOCO FAZ: Habilita formulario, cadastro em lote e listagem.
// ║ CONCEITO APRENDIDO: formularios, validacao no cliente e paginacao.
// ║ COMO TESTAR: Crie ocorrencia ficticia e encontre-a na lista.
// ║ REQUER: Dias 07, 08 e 11 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D13-B01 ▼▼▼
//// =============================================================
//// ocorrencias-lista.js — Listagem, edição e exclusão de ocorrências
//// O que faz: carrega a tabela paginada, filtra e oferece ações por registro.
//// Por que existe: separa o acompanhamento de ocorrências do Dashboard,
//// mantendo a API atual como única fonte dos dados.
//// Como testar: abra “Ocorrências Cadastradas”, filtre, pagine e use as ações.
//// =============================================================
//
//window.OcorrenciasLista = (() => {
//  const POR_PAGINA = 20;
//  let paginaAtual = 1;
//  let dadosPagina = [];
//  let paginacao = { total: 0, totalPaginas: 0 };
//  let inicializado = false;
//  // Ignora respostas antigas se filtros forem alterados durante uma requisição.
//  let requisicaoAtual = 0;
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
//  function inicializar() {
//    if (inicializado) return;
//    inicializado = true;
//
//    document.getElementById('tableSearch').addEventListener('input', renderizarTabela);
//    ['listPeriodoInicio', 'listPeriodoFim', 'listStatus'].forEach(id => {
//      document.getElementById(id).addEventListener('change', () => carregar(1));
//    });
//
//    document.getElementById('tablePagination').addEventListener('click', evento => {
//      const botao = evento.target.closest('button[data-pagina]');
//      if (!botao || botao.disabled) return;
//      carregar(Number(botao.dataset.pagina));
//    });
//
//    document.getElementById('tableBody').addEventListener('click', evento => {
//      const botao = evento.target.closest('button[data-acao]');
//      if (!botao) return;
//      const id = Number(botao.dataset.id);
//      if (!Number.isInteger(id) || id < 1) return;
//
//      if (botao.dataset.acao === 'editar') editar(id);
//      if (botao.dataset.acao === 'excluir') confirmarExclusao(id);
//      if (botao.dataset.acao === 'pdf') Dashboard.gerarPdfIndividual(id);
//    });
//  }
//
//  function montarFiltros(pagina) {
//    const parametros = new URLSearchParams({
//      pagina: String(pagina),
//      porPagina: String(POR_PAGINA)
//    });
//    const status = document.getElementById('listStatus').value;
//    const inicio = document.getElementById('listPeriodoInicio').value;
//    const fim = document.getElementById('listPeriodoFim').value;
//
//    if (status) parametros.set('status', status);
//    if (inicio) parametros.set('periodoInicio', inicio);
//    if (fim) parametros.set('periodoFim', fim);
//    return parametros;
//  }
//
//  async function carregar(pagina = paginaAtual) {
//    inicializar();
//    paginaAtual = Math.max(1, Number(pagina) || 1);
//    const numeroRequisicao = ++requisicaoAtual;
//    const corpo = document.getElementById('tableBody');
//    corpo.innerHTML = '<tr><td colspan="9">Carregando ocorrências...</td></tr>';
//    UI.loading('Carregando ocorrências...');
//
//    try {
//      const parametros = montarFiltros(paginaAtual);
//      const resposta = await Api.get(`/api/ocorrencias?${parametros}`);
//      if (numeroRequisicao !== requisicaoAtual) return;
//
//      dadosPagina = Array.isArray(resposta.dados) ? resposta.dados : [];
//      paginacao = resposta.paginacao || { total: dadosPagina.length, totalPaginas: 1 };
//      paginaAtual = Number(paginacao.pagina) || paginaAtual;
//      renderizarTabela();
//      renderizarPaginacao();
//    } catch (erro) {
//      if (numeroRequisicao !== requisicaoAtual) return;
//      corpo.innerHTML = `<tr><td colspan="9">Não foi possível carregar: ${escaparHtml(erro.message)}</td></tr>`;
//      document.getElementById('tableInfo').textContent = 'Falha ao carregar os registros.';
//      document.getElementById('tablePagination').replaceChildren();
//      UI.toast(`Erro ao carregar ocorrências: ${erro.message}`, 'error');
//    } finally {
//      if (numeroRequisicao === requisicaoAtual) UI.esconderLoading();
//    }
//  }
//
//  function renderizarTabela() {
//    const termo = document.getElementById('tableSearch').value.trim().toLocaleLowerCase('pt-BR');
//    // A busca é local aos 20 registros da página; a navegação continua no servidor.
//    const encontrados = dadosPagina.filter(ocorrencia => {
//      const campos = [
//        ocorrencia.codigo,
//        ocorrencia.prontuario,
//        ocorrencia.medicamento_nome,
//        ocorrencia.tipo_erro_descricao,
//        ocorrencia.farmaceutico_nome,
//        ocorrencia.setor_nome
//      ];
//      return campos.some(valor => String(valor ?? '').toLocaleLowerCase('pt-BR').includes(termo));
//    });
//
//    const corpo = document.getElementById('tableBody');
//    if (!encontrados.length) {
//      const mensagem = termo
//        ? 'Nenhuma ocorrência nesta página corresponde à busca.'
//        : 'Nenhuma ocorrência encontrada para os filtros selecionados.';
//      corpo.innerHTML = `<tr><td colspan="9">${mensagem}</td></tr>`;
//    } else {
//      corpo.innerHTML = encontrados.map(criarLinha).join('');
//    }
//
//    const total = Number(paginacao.total) || 0;
//    const inicio = total ? (paginaAtual - 1) * POR_PAGINA + 1 : 0;
//    const fim = Math.min(paginaAtual * POR_PAGINA, total);
//    document.getElementById('tableInfo').textContent =
//      `Mostrando ${inicio}–${fim} de ${total} ocorrências` +
//      (termo ? ` · ${encontrados.length} nesta página correspondem à busca` : '');
//  }
//
//  function criarLinha(ocorrencia) {
//    const id = Number(ocorrencia.id);
//    const status = ['Ativa', 'Concluida', 'Excluida'].includes(ocorrencia.status)
//      ? ocorrencia.status
//      : 'Desconhecido';
//    const codigo = escaparHtml(ocorrencia.codigo);
//    const rotuloPdf = `Gerar PDF de ${codigo}`;
//
//    return `
//      <tr data-id="${id}">
//        <td><strong>${codigo}</strong></td>
//        <td>${escaparHtml(UI.formatarDataBr(ocorrencia.data_ocorrencia))}</td>
//        <td>${escaparHtml(ocorrencia.prontuario)}</td>
//        <td>${escaparHtml(ocorrencia.medicamento_nome)}</td>
//        <td>${escaparHtml(ocorrencia.tipo_erro_descricao)}</td>
//        <td>${escaparHtml(ocorrencia.farmaceutico_nome)}</td>
//        <td>${escaparHtml(ocorrencia.setor_nome)}</td>
//        <td><span class="status-badge ${status}">${escaparHtml(status)}</span></td>
//        <td>
//          <button class="btn btn-sm btn-outline" type="button" data-acao="editar"
//            data-id="${id}" aria-label="Editar ${codigo}">Editar</button>
//          <button class="btn btn-sm btn-danger" type="button" data-acao="excluir"
//            data-id="${id}" aria-label="Excluir ${codigo}">Excluir</button>
//          <button class="btn btn-sm btn-pdf" type="button" data-acao="pdf"
//            data-id="${id}" aria-label="${rotuloPdf}">PDF</button>
//        </td>
//      </tr>`;
//  }
//
//  function renderizarPaginacao() {
//    const totalPaginas = Math.max(1, Number(paginacao.totalPaginas) || 1);
//    const pagina = Math.min(paginaAtual, totalPaginas);
//    const anterior = Math.max(1, pagina - 1);
//    const proxima = Math.min(totalPaginas, pagina + 1);
//    document.getElementById('tablePagination').innerHTML = `
//      <button class="btn btn-sm btn-outline" type="button" data-pagina="${anterior}"
//        aria-label="Página anterior" ${pagina <= 1 ? 'disabled' : ''}>Anterior</button>
//      <span aria-live="polite">Página ${pagina} de ${totalPaginas}</span>
//      <button class="btn btn-sm btn-outline" type="button" data-pagina="${proxima}"
//        aria-label="Próxima página" ${pagina >= totalPaginas ? 'disabled' : ''}>Próxima</button>
//    `;
//  }
//
//  function opcoesSelect(lista, campoTexto, selecionado) {
//    return lista.map(item => `
//      <option value="${Number(item.id)}" ${Number(item.id) === Number(selecionado) ? 'selected' : ''}>
//        ${escaparHtml(item[campoTexto])}
//      </option>`).join('');
//  }
//
//  function montarFormularioEdicao(ocorrencia) {
//    const responsavel = ocorrencia.responsavel_erro ||
//      (ocorrencia.assistente_id ? 'Assistente' : 'Farmacêutico');
//    const opcoesMedicamentos = opcoesSelect(State.refs.medicamentos, 'nome', ocorrencia.medicamento_id);
//    const opcoesTipos = opcoesSelect(State.refs.tiposErro, 'descricao', ocorrencia.tipo_erro_id);
//    const opcoesSetores = opcoesSelect(State.refs.setores, 'nome', ocorrencia.setor_id);
//
//    return `
//      <form id="formEditarOcorrencia">
//        <div class="form-grid">
//          <div class="form-group">
//            <label for="editData">Data da ocorrência</label>
//            <input id="editData" name="data_ocorrencia" type="date" required
//              value="${escaparHtml(ocorrencia.data_ocorrencia)}">
//          </div>
//          <div class="form-group">
//            <label for="editProntuario">Prontuário</label>
//            <input id="editProntuario" name="prontuario" required
//              value="${escaparHtml(ocorrencia.prontuario)}">
//          </div>
//          <div class="form-group">
//            <label for="editPrescricao">Número da prescrição</label>
//            <input id="editPrescricao" name="numero_prescricao" required
//              value="${escaparHtml(ocorrencia.numero_prescricao)}">
//          </div>
//          <div class="form-group">
//            <label for="editMedicamento">Medicamento</label>
//            <select id="editMedicamento" name="medicamento_id" required>${opcoesMedicamentos}</select>
//          </div>
//          <div class="form-group">
//            <label for="editTipoErro">Tipo de erro</label>
//            <select id="editTipoErro" name="tipo_erro_id" required>${opcoesTipos}</select>
//          </div>
//          <div class="form-group">
//            <label for="editSetor">Setor</label>
//            <select id="editSetor" name="setor_id" required>${opcoesSetores}</select>
//          </div>
//          <div class="form-group">
//            <label for="editQuantidadePrescrita">Quantidade prescrita</label>
//            <input id="editQuantidadePrescrita" name="quantidade_prescrita" type="number"
//              min="0" step="0.01" required value="${escaparHtml(ocorrencia.quantidade_prescrita)}">
//          </div>
//          <div class="form-group">
//            <label for="editQuantidadeDispensada">Quantidade dispensada</label>
//            <input id="editQuantidadeDispensada" name="quantidade_dispensada" type="number"
//              min="0" step="0.01" value="${escaparHtml(ocorrencia.quantidade_dispensada)}">
//          </div>
//          <div class="form-group">
//            <label for="editHoraPrescricao">Hora da prescrição</label>
//            <input id="editHoraPrescricao" name="hora_prescricao" type="time"
//              value="${escaparHtml(String(ocorrencia.hora_prescricao || '').slice(0, 5))}">
//          </div>
//          <div class="form-group">
//            <label for="editHoraDispensacao">Hora da dispensação</label>
//            <input id="editHoraDispensacao" name="hora_dispensacao" type="time"
//              value="${escaparHtml(String(ocorrencia.hora_dispensacao || '').slice(0, 5))}">
//          </div>
//          <div class="form-group">
//            <label for="editPlantao">Plantão</label>
//            <select id="editPlantao" name="plantao" required>
//              <option value="Diurno" ${ocorrencia.plantao === 'Diurno' ? 'selected' : ''}>Diurno</option>
//              <option value="Noturno" ${ocorrencia.plantao === 'Noturno' ? 'selected' : ''}>Noturno</option>
//            </select>
//          </div>
//          <div class="form-group">
//            <label for="editFarmaceutico">Farmacêutico</label>
//            <select id="editFarmaceutico" name="farmaceutico_id" required></select>
//          </div>
//          <div class="form-group">
//            <label for="editResponsavelErro">Responsável pelo erro</label>
//            <select id="editResponsavelErro" name="responsavel_erro" required>
//              <option value="Assistente" ${responsavel === 'Assistente' ? 'selected' : ''}>Assistente</option>
//              <option value="Farmacêutico" ${responsavel === 'Farmacêutico' ? 'selected' : ''}>Farmacêutico</option>
//            </select>
//          </div>
//          <div class="form-group">
//            <label for="editAssistente">Assistente</label>
//            <select id="editAssistente" name="assistente_id"></select>
//          </div>
//          <div class="form-group">
//            <label for="editStatus">Status</label>
//            <select id="editStatus" name="status">
//              <option value="Ativa" ${ocorrencia.status === 'Ativa' ? 'selected' : ''}>Ativa</option>
//              <option value="Concluida" ${ocorrencia.status === 'Concluida' ? 'selected' : ''}>Concluída</option>
//              <option value="Excluida" ${ocorrencia.status === 'Excluida' ? 'selected' : ''}>Excluída</option>
//            </select>
//          </div>
//          <div class="form-group">
//            <label for="editObservacoes">Observações</label>
//            <textarea id="editObservacoes" name="observacoes" rows="3">${escaparHtml(ocorrencia.observacoes)}</textarea>
//          </div>
//        </div>
//        <div class="form-actions">
//          <button class="btn btn-outline" type="button" id="btnCancelarEdicao">Cancelar</button>
//          <button class="btn btn-primary" type="submit">Salvar alterações</button>
//        </div>
//      </form>`;
//  }
//
//  function carregarFarmaceuticos(plantao, selecionado) {
//    const select = document.getElementById('editFarmaceutico');
//    const lista = State.refs.farmaceuticos.filter(item => item.plantao === plantao);
//    select.innerHTML = opcoesSelect(lista, 'nome', selecionado);
//  }
//
//  function carregarAssistentes(ocorrencia, selecionado) {
//    const responsavel = document.getElementById('editResponsavelErro').value;
//    const select = document.getElementById('editAssistente');
//    const farmaceuticoId = Number(document.getElementById('editFarmaceutico').value);
//    const farmaceutico = State.refs.farmaceuticos.find(item => item.id === farmaceuticoId);
//    let lista = [];
//
//    if (responsavel === 'Assistente' && farmaceutico) {
//      lista = farmaceutico.tipo === 'Folguista'
//        ? State.refs.assistentes.filter(item => item.plantao === farmaceutico.plantao)
//        : State.refs.assistentes.filter(item => item.farmaceutico_id === farmaceuticoId);
//    }
//
//    select.innerHTML = '<option value="">Selecione...</option>' +
//      opcoesSelect(lista, 'nome', selecionado);
//    if (selecionado && !lista.some(item => item.id === Number(selecionado)) &&
//        ocorrencia.assistente_id === Number(selecionado)) {
//      select.insertAdjacentHTML('beforeend', `
//        <option value="${Number(selecionado)}" selected>
//          ${escaparHtml(ocorrencia.assistente_nome)} (atual)
//        </option>`);
//    }
//    select.disabled = responsavel !== 'Assistente';
//  }
//
//  async function editar(id) {
//    try {
//      const resposta = await Api.get(`/api/ocorrencias/${id}`);
//      const ocorrencia = resposta.data;
//      if (!ocorrencia) throw new Error('A API não retornou os dados da ocorrência.');
//      UI.abrirModal(`Editar ${ocorrencia.codigo}`,
//        montarFormularioEdicao(ocorrencia));
//
//      const form = document.getElementById('formEditarOcorrencia');
//      const plantao = document.getElementById('editPlantao');
//      const farmaceutico = document.getElementById('editFarmaceutico');
//      const responsavel = document.getElementById('editResponsavelErro');
//      carregarFarmaceuticos(plantao.value, ocorrencia.farmaceutico_id);
//      carregarAssistentes(ocorrencia, ocorrencia.assistente_id);
//
//      plantao.addEventListener('change', () => {
//        carregarFarmaceuticos(plantao.value, null);
//        carregarAssistentes(ocorrencia, null);
//      });
//      farmaceutico.addEventListener('change', () => carregarAssistentes(ocorrencia, null));
//      responsavel.addEventListener('change', () => carregarAssistentes(ocorrencia, null));
//      document.getElementById('btnCancelarEdicao').addEventListener('click', UI.fecharModal);
//      form.addEventListener('submit', evento => salvarEdicao(evento, id));
//    } catch (erro) {
//      UI.toast(`Erro ao abrir ocorrência: ${erro.message}`, 'error');
//    }
//  }
//
//  async function salvarEdicao(evento, id) {
//    evento.preventDefault();
//    const form = evento.currentTarget;
//    if (!form.reportValidity()) return;
//
//    const responsavel = form.elements.responsavel_erro.value;
//    const dados = {
//      data_ocorrencia: form.elements.data_ocorrencia.value,
//      prontuario: form.elements.prontuario.value.trim(),
//      numero_prescricao: form.elements.numero_prescricao.value.trim(),
//      medicamento_id: Number(form.elements.medicamento_id.value),
//      tipo_erro_id: Number(form.elements.tipo_erro_id.value),
//      setor_id: Number(form.elements.setor_id.value),
//      quantidade_prescrita: Number(form.elements.quantidade_prescrita.value),
//      quantidade_dispensada: form.elements.quantidade_dispensada.value
//        ? Number(form.elements.quantidade_dispensada.value)
//        : null,
//      hora_prescricao: form.elements.hora_prescricao.value || null,
//      hora_dispensacao: form.elements.hora_dispensacao.value || null,
//      plantao: form.elements.plantao.value,
//      farmaceutico_id: Number(form.elements.farmaceutico_id.value),
//      responsavel_erro: responsavel,
//      assistente_id: responsavel === 'Assistente'
//        ? Number(form.elements.assistente_id.value) || null
//        : null,
//      observacoes: form.elements.observacoes.value.trim() || null,
//      status: form.elements.status.value
//    };
//
//    UI.loading('Salvando alterações...');
//    try {
//      await Api.put(`/api/ocorrencias/${id}`, dados);
//      UI.fecharModal();
//      UI.toast('Ocorrência atualizada.', 'success');
//      await carregar(paginaAtual);
//    } catch (erro) {
//      UI.toast(`Erro ao salvar ocorrência: ${erro.message}`, 'error');
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  function confirmarExclusao(id) {
//    const ocorrencia = dadosPagina.find(item => Number(item.id) === id);
//    const codigo = escaparHtml(ocorrencia?.codigo || `#${id}`);
//    UI.confirmar(
//      'Excluir ocorrência',
//      `Confirma a exclusão de ${codigo}? O registro ficará disponível com status “Excluída”.`,
//      async () => {
//        UI.loading('Excluindo ocorrência...');
//        try {
//          await Api.del(`/api/ocorrencias/${id}`);
//          UI.toast('Ocorrência excluída.', 'success');
//          await carregar(paginaAtual);
//        } catch (erro) {
//          UI.toast(`Erro ao excluir ocorrência: ${erro.message}`, 'error');
//        } finally {
//          UI.esconderLoading();
//        }
//      }
//    );
//  }
//
//  return { carregar };
//})();
// ▲▲▲ ATE AQUI — D13-B01 ▲▲▲
// CHECKPOINT: apos D13-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
