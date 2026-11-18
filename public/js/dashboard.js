// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 12 — FRONTEND: DASHBOARD
// ║ O QUE ESTE BLOCO FAZ: Sincroniza filtros, KPIs e dados do dashboard.
// ║ CONCEITO APRENDIDO: filtros combinaveis, estado e chamadas de API.
// ║ COMO TESTAR: Altere um filtro e confirme atualizacao dos indicadores.
// ║ REQUER: D09-B02 e D11-B02 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D12-B01 ▼▼▼
//// =============================================================
//// dashboard.js — Módulo do Dashboard
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Carrega os KPIs, controla filtros e prepara os gráficos do dashboard.
////   A tabela completa pertence à página de Ocorrências Cadastradas.
////
//// CONCEITO APRENDIDO:
////   - Como ler valores de vários filtros de uma vez
////   - Como renderizar HTML dinamicamente a partir de JSON
////   - Como animar números sem dependências e respeitar movimento reduzido
////
//// TESTE VISUAL:
////   Abra Dashboard, aguarde os números animarem e remova um chip; os indicadores
////   devem recarregar e refletir o período/status/setor selecionado.
//// =============================================================
//
//window.Dashboard = (() => {
//
//  const DURACAO_CONTADOR = 800;
//  const CONFIG_FILTROS = [
//    { id: 'filterPeriodo', nome: 'Período', padrao: 'todos' },
//    { id: 'filterStatus', nome: 'Status', padrao: 'todas' },
//    { id: 'filterPlantao', nome: 'Plantão', padrao: '' },
//    { id: 'filterSetor', nome: 'Setor', padrao: '' },
//    { id: 'filterTipoErro', nome: 'Tipo de erro', padrao: '' },
//    { id: 'filterFarmaceutico', nome: 'Farmacêutico', padrao: '' }
//  ];
//
//  const ICONES_KPI = {
//    total: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4zM8 9h8M8 13h5"/></svg>',
//    mes: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>',
//    status: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
//    setor: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V8l8-4 8 4v12M8 20v-6h8v6M8 9h.01M16 9h.01"/></svg>',
//    plantao: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
//    tipo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 3.5 18h17L12 3Z"/><path d="M12 9v4M12 16h.01"/></svg>',
//    medicamento: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4h8a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"/><path d="M8 12h8"/></svg>'
//  };
//  const instanciasGraficos = {};
//
//  // ═══════════════════════════════════════════════════════════
//  // CARREGAR (chamado ao abrir a página ou ao mudar filtro)
//  // ═══════════════════════════════════════════════════════════
//  async function carregar() {
//    UI.loading('Carregando dashboard...');
//    try {
//      const filtros = obterFiltros();
//      aplicarFiltrosGrafico(filtros);
//      const qs = new URLSearchParams(filtros).toString();
//      const dados = await Api.get(`/api/dashboard?${qs}`);
//
//      renderizarKPIs(dados.kpis);
//      renderizarChips();
//      renderizarGraficos(dados.graficos, dados.evolucaoTemporal);
//    } catch (err) {
//      UI.toast('Erro ao carregar dashboard: ' + err.message, 'error');
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  function obterFiltros() {
//    const periodo = document.getElementById('filterPeriodo').value;
//    const hoje = new Date();
//    const hojeStr = [
//      hoje.getFullYear(),
//      String(hoje.getMonth() + 1).padStart(2, '0'),
//      String(hoje.getDate()).padStart(2, '0')
//    ].join('-');
//
//    let periodoInicio = '';
//    let periodoFim = '';
//
//    switch (periodo) {
//      case 'hoje':
//        periodoInicio = hojeStr;
//        periodoFim = hojeStr;
//        break;
//      case '7dias': {
//        const d = new Date(hoje);
//        d.setDate(d.getDate() - 7);
//        periodoInicio = dataLocal(d);
//        periodoFim = hojeStr;
//        break;
//      }
//      case '30dias': {
//        const d = new Date(hoje);
//        d.setDate(d.getDate() - 30);
//        periodoInicio = dataLocal(d);
//        periodoFim = hojeStr;
//        break;
//      }
//      case 'mes':
//        periodoInicio = hojeStr.substring(0, 7) + '-01';
//        periodoFim = hojeStr;
//        break;
//    }
//
//    return {
//      periodoInicio,
//      periodoFim,
//      status: document.getElementById('filterStatus').value,
//      plantao: document.getElementById('filterPlantao').value,
//      setor_id: document.getElementById('filterSetor').value,
//      tipo_erro_id: document.getElementById('filterTipoErro').value,
//      farmaceutico_id: document.getElementById('filterFarmaceutico').value,
//      porPagina: 20
//    };
//  }
//
//  function dataLocal(data) {
//    return [
//      data.getFullYear(),
//      String(data.getMonth() + 1).padStart(2, '0'),
//      String(data.getDate()).padStart(2, '0')
//    ].join('-');
//  }
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
//  // ═══════════════════════════════════════════════════════════
//  // KPIs
//  // ═══════════════════════════════════════════════════════════
//  function renderizarKPIs(k) {
//    const status = k.statusResumo || {};
//    const percentuais = Number(status.percentualAtivas) || 0;
//    const cards = [
//      criarCardKpi('total', 'Total de Ocorrências', k.total, 'No recorte selecionado', 'total'),
//      criarCardKpi('mes', 'Ocorrências no Mês', k.mes, 'Desde o primeiro dia do mês', 'mes'),
//      criarCardStatus(status, percentuais),
//      criarCardRanking('setor', 'Setor Mais Afetado', k.setorMaisFrequente?.setor,
//        k.setorMaisFrequente?.total, 'setor'),
//      criarCardRanking('plantao', 'Plantão Mais Afetado', k.plantaoMaior?.plantao,
//        k.plantaoMaior?.total, 'plantao'),
//      criarCardRanking('tipo', 'Tipo de Erro Predominante', k.tipoErroMaisFrequente?.tipo,
//        k.tipoErroMaisFrequente?.total, 'tipo'),
//      criarCardRanking('medicamento', 'Medicamento Mais Envolvido',
//        k.medicamentoMaisEnvolvido?.medicamento, k.medicamentoMaisEnvolvido?.total, 'medicamento')
//    ];
//
//    document.getElementById('kpiGrid').innerHTML = cards.join('');
//    document.querySelectorAll('#kpiGrid [data-contador]').forEach(animarContador);
//  }
//
//  function criarCardKpi(classe, titulo, valor, detalhe, icone) {
//    return `
//      <article class="kpi-card kpi-${classe}" aria-label="${escaparHtml(titulo)}">
//        <span class="kpi-icon">${ICONES_KPI[icone]}</span>
//        <p class="label">${escaparHtml(titulo)}</p>
//        <p class="value"><span data-contador="${numeroSeguro(valor)}"
//          aria-label="${numeroSeguro(valor)}">0</span></p>
//        <p class="kpi-caption">${escaparHtml(detalhe)}</p>
//      </article>`;
//  }
//
//  function criarCardRanking(classe, titulo, nome, total, icone) {
//    const nomeSeguro = nome || 'Nenhum';
//    return `
//      <article class="kpi-card kpi-${classe}" aria-label="${escaparHtml(titulo)}">
//        <span class="kpi-icon">${ICONES_KPI[icone]}</span>
//        <p class="label">${escaparHtml(titulo)}</p>
//        <p class="value kpi-text-value">
//          <span class="kpi-value-text">${escaparHtml(nomeSeguro)}</span>
//          <span class="kpi-count">(<span data-contador="${numeroSeguro(total)}"
//            aria-label="${numeroSeguro(total)}">0</span>)</span>
//        </p>
//        <p class="kpi-caption">No recorte selecionado</p>
//      </article>`;
//  }
//
//  function criarCardStatus(status, percentualAtivas) {
//    const ativas = numeroSeguro(status.ativas);
//    const concluidas = numeroSeguro(status.concluidas);
//    return `
//      <article class="kpi-card kpi-status" aria-label="Ocorrências ativas e concluídas">
//        <span class="kpi-icon">${ICONES_KPI.status}</span>
//        <p class="label">Ativas / Concluídas</p>
//        <p class="value kpi-status-value">
//          <span data-contador="${ativas}" aria-label="${ativas}">0</span>
//          <span aria-hidden="true">/</span>
//          <span data-contador="${concluidas}" aria-label="${concluidas}">0</span>
//        </p>
//        <div class="kpi-progress" role="img"
//          aria-label="${percentualAtivas}% ativas e ${numeroSeguro(status.percentualConcluidas)}% concluídas">
//          <span style="width:${Math.min(100, Math.max(0, percentualAtivas))}%"></span>
//        </div>
//        <p class="kpi-caption">${percentualAtivas}% ativas · ${numeroSeguro(status.percentualConcluidas)}% concluídas</p>
//      </article>`;
//  }
//
//  function numeroSeguro(valor) {
//    const numero = Number(valor);
//    return Number.isFinite(numero) && numero > 0 ? Math.round(numero) : 0;
//  }
//
//  function animarContador(elemento) {
//    const final = Number(elemento.dataset.contador);
//    const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//    if (movimentoReduzido || !Number.isFinite(final)) {
//      elemento.textContent = new Intl.NumberFormat('pt-BR').format(final || 0);
//      return;
//    }
//
//    const inicio = performance.now();
//    function atualizar(agora) {
//      const progresso = Math.min(1, (agora - inicio) / DURACAO_CONTADOR);
//      const suavizado = 1 - Math.pow(1 - progresso, 3);
//      elemento.textContent = new Intl.NumberFormat('pt-BR')
//        .format(Math.round(final * suavizado));
//      if (progresso < 1) requestAnimationFrame(atualizar);
//    }
//    requestAnimationFrame(atualizar);
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // GRÁFICOS (Canvas; cada instância é atualizada sem recriar o card)
//  // ═══════════════════════════════════════════════════════════
//  function renderizarGraficos(graficos, evolucao) {
//    const especificacoes = [
//      { id: 'chartTipoErro', titulo: 'Por Tipo de Erro', metodo: 'bar',
//        campo: 'tipo_erro', dados: graficos.porTipoErro },
//      { id: 'chartSetor', titulo: 'Por Setor', metodo: 'bar',
//        campo: 'setor', dados: graficos.porSetor },
//      { id: 'chartFarmaceutico', titulo: 'Por Farmacêutico', metodo: 'bar',
//        campo: 'farmaceutico', dados: graficos.porFarmaceutico },
//      { id: 'chartPlantao', titulo: 'Por Plantão', metodo: 'bar',
//        campo: 'plantao', dados: graficos.porPlantao },
//      { id: 'chartClassificacao', titulo: 'Por Classificação de Horário', metodo: 'donut',
//        campo: 'classificacao_horario', dados: graficos.porClassificacaoHorario },
//      { id: 'chartEvolucao', titulo: 'Evolução Temporal', metodo: 'line',
//        campo: 'evolucao_temporal', dados: (evolucao || []).map(item => ({
//          nome: UI.formatarDataBr(item.data),
//          valor: item.valor,
//          valorApi: item.data
//        })) }
//    ];
//
//    const container = document.getElementById('chartsGrid');
//    if (!container.querySelector('.chart-visualization')) {
//      container.innerHTML = especificacoes.map(grafico => `
//        <article class="chart-card" id="${grafico.id}">
//          <h4>${grafico.titulo}</h4>
//          <div class="chart-visualization" id="${grafico.id}Visual"></div>
//        </article>
//      `).join('');
//    }
//
//    especificacoes.forEach(grafico => {
//      const estadoAtivo = State.dashboard.filtrosGrafico[grafico.campo];
//      const opcoes = {
//        titulo: grafico.titulo,
//        filtroAtivo: estadoAtivo?.valor || null,
//        onClick: item => aplicarFiltroGrafico(grafico.campo, item)
//      };
//      const visual = document.getElementById(`${grafico.id}Visual`);
//      if (instanciasGraficos[grafico.id]) {
//        instanciasGraficos[grafico.id].atualizar(grafico.dados, opcoes);
//      } else {
//        instanciasGraficos[grafico.id] = window.Chart[grafico.metodo](visual, grafico.dados, opcoes);
//      }
//    });
//  }
//
//  function aplicarFiltroGrafico(campo, item) {
//    const nome = item.nome;
//    const mapa = {
//      setor: {
//        parametro: 'setor_id',
//        selectId: 'filterSetor',
//        registro: State.refs.setores.find(setor => setor.nome === nome)
//      },
//      tipo_erro: {
//        parametro: 'tipo_erro_id',
//        selectId: 'filterTipoErro',
//        registro: State.refs.tiposErro.find(tipo => tipo.descricao === nome)
//      },
//      farmaceutico: {
//        parametro: 'farmaceutico_id',
//        selectId: 'filterFarmaceutico',
//        registro: State.refs.farmaceuticos.find(farmaceutico => farmaceutico.nome === nome)
//      },
//      plantao: { parametro: 'plantao', valorApi: nome },
//      classificacao_horario: { parametro: 'classificacao_horario', valorApi: nome },
//      evolucao_temporal: {
//        periodo: true,
//        valorApi: item.valorApi || item.data,
//        valor: nome
//      }
//    };
//    const definicao = mapa[campo];
//    if (!definicao) return;
//
//    const filtros = State.dashboard.filtrosGrafico;
//    const ativo = filtros[campo];
//    const valorApi = definicao.registro ? definicao.registro.id : definicao.valorApi;
//    if (definicao.registro) definicao.valor = nome;
//
//    if (ativo && String(ativo.valorApi) === String(valorApi)) {
//      removerFiltroGrafico(campo);
//      return;
//    }
//    if (!valorApi) {
//      UI.toast('Não foi possível relacionar esta categoria a um filtro válido.', 'warning');
//      return;
//    }
//
//    filtros[campo] = {
//      valor: definicao.valor || nome,
//      valorApi,
//      parametro: definicao.parametro,
//      selectId: definicao.selectId,
//      periodo: definicao.periodo
//    };
//    if (definicao.selectId) {
//      document.getElementById(definicao.selectId).value = String(valorApi);
//    }
//    carregar();
//  }
//
//  function aplicarFiltrosGrafico(filtros) {
//    Object.values(State.dashboard.filtrosGrafico).forEach(filtro => {
//      if (filtro.periodo) {
//        filtros.periodoInicio = filtro.valorApi;
//        filtros.periodoFim = filtro.valorApi;
//      } else if (filtro.parametro) {
//        filtros[filtro.parametro] = filtro.valorApi;
//      }
//    });
//  }
//
//  function removerFiltroGrafico(campo) {
//    const filtro = State.dashboard.filtrosGrafico[campo];
//    if (!filtro) return;
//    delete State.dashboard.filtrosGrafico[campo];
//    if (filtro.selectId) document.getElementById(filtro.selectId).value = '';
//    carregar();
//  }
//
//  function limparFiltroGrafico(idControle) {
//    Object.entries(State.dashboard.filtrosGrafico).forEach(([campo, filtro]) => {
//      if (filtro.selectId === idControle ||
//          (idControle === 'filterPeriodo' && filtro.periodo)) {
//        delete State.dashboard.filtrosGrafico[campo];
//      }
//    });
//  }
//
//  function renderizarChips() {
//    const container = document.getElementById('filterChips');
//    const filtrosGrafico = State.dashboard.filtrosGrafico;
//    const controlesComOrigemGrafico = new Set(
//      Object.values(filtrosGrafico).map(filtro => filtro.selectId).filter(Boolean)
//    );
//    const ativos = CONFIG_FILTROS.reduce((resultado, config) => {
//      const campo = document.getElementById(config.id);
//      if (!campo || !campo.value || campo.value === config.padrao ||
//          controlesComOrigemGrafico.has(config.id)) return resultado;
//      const texto = campo.selectedOptions?.[0]?.textContent || campo.value;
//      resultado.push({ ...config, texto });
//      return resultado;
//    }, []);
//
//    container.hidden = ativos.length === 0;
//    const chipsNormais = ativos.map(filtro => `
//      <span class="filter-chip">
//        ${escaparHtml(filtro.nome)}: ${escaparHtml(filtro.texto)}
//        <button type="button" data-remover-filtro="${filtro.id}"
//          aria-label="Remover filtro ${escaparHtml(filtro.nome)}">×</button>
//      </span>
//    `);
//    const nomesGraficos = {
//      setor: 'Setor',
//      tipo_erro: 'Tipo de erro',
//      farmaceutico: 'Farmacêutico',
//      plantao: 'Plantão',
//      classificacao_horario: 'Classificação',
//      evolucao_temporal: 'Data'
//    };
//    const chipsGraficos = Object.entries(filtrosGrafico).map(([campo, filtro]) => `
//      <span class="filter-chip filter-chip-chart">
//        Gráfico · ${nomesGraficos[campo]}: ${escaparHtml(filtro.valor)}
//        <button type="button" data-remover-filtro-grafico="${campo}"
//          aria-label="Remover filtro do gráfico ${nomesGraficos[campo]}">×</button>
//      </span>
//    `);
//    container.hidden = !chipsNormais.length && !chipsGraficos.length;
//    container.innerHTML = [...chipsNormais, ...chipsGraficos].join('');
//
//    container.querySelectorAll('[data-remover-filtro]').forEach(botao => {
//      botao.addEventListener('click', () => {
//        const filtro = document.getElementById(botao.dataset.removerFiltro);
//        const config = CONFIG_FILTROS.find(item => item.id === botao.dataset.removerFiltro);
//        if (!filtro || !config) return;
//        filtro.value = config.padrao;
//        carregar();
//      });
//    });
//    container.querySelectorAll('[data-remover-filtro-grafico]').forEach(botao => {
//      botao.addEventListener('click', () => removerFiltroGrafico(botao.dataset.removerFiltroGrafico));
//    });
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // AÇÕES
//  // ═══════════════════════════════════════════════════════════
//  async function gerarPdfIndividual(id) {
//    UI.loading('Gerando PDF...');
//    try {
//      const r = await Api.get(`/api/pdf/individual/${id}`);
//      window.open(r.caminho, '_blank', 'noopener');
//      UI.fecharModal();
//      UI.toast('PDF gerado!', 'success');
//    } catch (err) {
//      UI.toast('Erro ao gerar PDF: ' + err.message, 'error');
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  async function gerarPdfGerencial() {
//    const filtros = obterFiltros();
//    const qs = new URLSearchParams({
//      periodoInicio: filtros.periodoInicio,
//      periodoFim: filtros.periodoFim
//    }).toString();
//
//    UI.loading('Gerando PDF gerencial... Isso pode demorar...');
//    try {
//      const r = await Api.get(`/api/pdf/gerencial?${qs}`);
//      window.open(r.caminho, '_blank', 'noopener');
//      UI.toast('PDF gerencial gerado!', 'success');
//    } catch (err) {
//      UI.toast('Erro ao gerar PDF: ' + err.message, 'error');
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  async function abrirModalPdfIndividual() {
//    try {
//      const resposta = await Api.get('/api/ocorrencias?status=todas&pagina=1&porPagina=100');
//      const ocorrencias = resposta.dados || [];
//      const opcoes = ocorrencias.map(item => `
//        <option value="${item.id}">
//          ${escaparHtml(item.codigo)} · ${escaparHtml(item.data_ocorrencia)} ·
//          ${escaparHtml(item.prontuario)} · ${escaparHtml(item.medicamento_nome)}
//        </option>
//      `).join('');
//
//      UI.abrirModal('Gerar PDF individual', `
//        <form id="formPdfIndividual">
//          <div class="form-group">
//            <label for="pdfOcorrenciaBusca">Buscar ocorrência</label>
//            <input id="pdfOcorrenciaBusca" type="search"
//              placeholder="Código, prontuário ou medicamento">
//          </div>
//          <div class="form-group">
//            <label for="pdfOcorrenciaId">Selecione o registro</label>
//            <select id="pdfOcorrenciaId" size="6" required>
//              ${opcoes || '<option value="">Nenhuma ocorrência disponível</option>'}
//            </select>
//          </div>
//          <div class="form-actions">
//            <button class="btn btn-outline" type="button" onclick="UI.fecharModal()">Cancelar</button>
//            <button class="btn btn-primary" type="submit" ${opcoes ? '' : 'disabled'}>
//              Gerar PDF
//            </button>
//          </div>
//        </form>
//      `);
//
//      const busca = document.getElementById('pdfOcorrenciaBusca');
//      const lista = document.getElementById('pdfOcorrenciaId');
//      busca.addEventListener('input', () => {
//        const termo = busca.value.trim().toLocaleLowerCase('pt-BR');
//        Array.from(lista.options).forEach(opcao => {
//          opcao.hidden = !opcao.textContent.toLocaleLowerCase('pt-BR').includes(termo);
//        });
//      });
//      document.getElementById('formPdfIndividual').addEventListener('submit', event => {
//        event.preventDefault();
//        if (lista.value) gerarPdfIndividual(Number(lista.value));
//      });
//    } catch (err) {
//      UI.toast('Erro ao carregar ocorrências: ' + err.message, 'error');
//    }
//  }
//
//  function abrirModalPdfFarmaceutico() {
//    const opcoes = State.refs.farmaceuticos.map(farmaceutico =>
//      `<option value="${farmaceutico.id}">${escaparHtml(farmaceutico.nome)}</option>`
//    ).join('');
//
//    UI.abrirModal('PDF por farmacêutico', `
//      <form id="formPdfFarmaceutico">
//        <div class="form-group">
//          <label for="pdfFarmaceuticoId">Farmacêutico</label>
//          <select id="pdfFarmaceuticoId" required>
//            <option value="">Selecione...</option>${opcoes}
//          </select>
//        </div>
//        <div class="form-grid pdf-date-range">
//          <div class="form-group">
//            <label for="pdfFarmaceuticoInicio">Data inicial</label>
//            <input id="pdfFarmaceuticoInicio" type="date">
//          </div>
//          <div class="form-group">
//            <label for="pdfFarmaceuticoFim">Data final</label>
//            <input id="pdfFarmaceuticoFim" type="date">
//          </div>
//        </div>
//        <div class="form-actions">
//          <button class="btn btn-outline" type="button" onclick="UI.fecharModal()">Cancelar</button>
//          <button class="btn btn-primary" type="submit">Gerar PDF</button>
//        </div>
//      </form>
//    `);
//
//    document.getElementById('formPdfFarmaceutico').addEventListener('submit', event => {
//      event.preventDefault();
//      gerarPdfFarmaceutico(
//        document.getElementById('pdfFarmaceuticoId').value,
//        document.getElementById('pdfFarmaceuticoInicio').value,
//        document.getElementById('pdfFarmaceuticoFim').value
//      );
//    });
//  }
//
//  async function gerarPdfFarmaceutico(id, periodoInicio, periodoFim) {
//    if (!id) {
//      UI.toast('Selecione um farmacêutico.', 'warning');
//      return;
//    }
//    const qs = new URLSearchParams({ periodoInicio, periodoFim });
//    UI.loading('Gerando relatório do farmacêutico...');
//    try {
//      const resposta = await Api.get(`/api/pdf/farmaceutico/${id}?${qs}`);
//      window.open(resposta.caminho, '_blank', 'noopener');
//      UI.fecharModal();
//      UI.toast('PDF por farmacêutico gerado!', 'success');
//    } catch (err) {
//      UI.toast('Erro ao gerar PDF: ' + err.message, 'error');
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  function configurarBotoesPdf() {
//    document.getElementById('btnPdfIndividual')
//      .addEventListener('click', abrirModalPdfIndividual);
//    document.getElementById('btnPdfFarmaceutico')
//      .addEventListener('click', abrirModalPdfFarmaceutico);
//  }
//
//  document.addEventListener('DOMContentLoaded', configurarBotoesPdf);
//
//  // ── API pública ─────────────────────────────────────────────
//  return {
//    carregar, gerarPdfIndividual, gerarPdfGerencial,
//    abrirModalPdfIndividual, abrirModalPdfFarmaceutico, gerarPdfFarmaceutico,
//    aplicarFiltroGrafico, removerFiltroGrafico, limparFiltroGrafico
//  };
//})();
// ▲▲▲ ATE AQUI — D12-B01 ▲▲▲
// CHECKPOINT: apos D12-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
