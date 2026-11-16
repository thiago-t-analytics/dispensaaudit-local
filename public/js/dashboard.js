// =============================================================
// dashboard.js — Módulo do Dashboard
// =============================================================
// O QUE ESTE ARQUIVO FAZ:
//   Carrega e renderiza os KPIs, gráficos e tabela de ocorrências.
//   Todos os filtros da tela são considerados na chamada da API.
//
// CONCEITO APRENDIDO:
//   - Como ler valores de vários filtros de uma vez
//   - Como renderizar HTML dinamicamente a partir de JSON
//   - Cores geradas programaticamente para os gráficos
// =============================================================

window.Dashboard = (() => {

  const CORES = [
    '#3A506B', '#4F6A8A', '#6FA8DC', '#5CB85C', '#F4A261',
    '#E76F51', '#9B59B6', '#1ABC9C', '#F39C12', '#2ECC71'
  ];

  // ═══════════════════════════════════════════════════════════
  // CARREGAR (chamado ao abrir a página ou ao mudar filtro)
  // ═══════════════════════════════════════════════════════════
  async function carregar() {
    UI.loading('Carregando dashboard...');
    try {
      const filtros = obterFiltros();
      const qs = new URLSearchParams(filtros).toString();
      const dados = await Api.get(`/api/dashboard?${qs}`);

      renderizarKPIs(dados.kpis);
      renderizarGraficos(dados.graficos);
      State.dashboard.dados = dados.tabela;
      State.dashboard.paginacao = dados.paginacao;
      State.dashboard.pagina = 1;
      renderizarTabela();
    } catch (err) {
      UI.toast('Erro ao carregar dashboard: ' + err.message, 'error');
    } finally {
      UI.esconderLoading();
    }
  }

  function obterFiltros() {
    const periodo = document.getElementById('filterPeriodo').value;
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split('T')[0];

    let periodoInicio = '';
    let periodoFim = '';

    switch (periodo) {
      case 'hoje':
        periodoInicio = hojeStr;
        periodoFim = hojeStr;
        break;
      case '7dias': {
        const d = new Date(hoje); d.setDate(d.getDate() - 7);
        periodoInicio = d.toISOString().split('T')[0];
        periodoFim = hojeStr;
        break;
      }
      case '30dias': {
        const d = new Date(hoje); d.setDate(d.getDate() - 30);
        periodoInicio = d.toISOString().split('T')[0];
        periodoFim = hojeStr;
        break;
      }
      case 'mes':
        periodoInicio = hojeStr.substring(0, 7) + '-01';
        periodoFim = hojeStr;
        break;
    }

    return {
      periodoInicio,
      periodoFim,
      status: document.getElementById('filterStatus').value,
      plantao: document.getElementById('filterPlantao').value,
      setor_id: document.getElementById('filterSetor').value,
      tipo_erro_id: document.getElementById('filterTipoErro').value,
      farmaceutico_id: document.getElementById('filterFarmaceutico').value,
      porPagina: 20
    };
  }

  // ═══════════════════════════════════════════════════════════
  // KPIs
  // ═══════════════════════════════════════════════════════════
  function renderizarKPIs(k) {
    document.getElementById('kpiGrid').innerHTML = `
      <div class="kpi-card">
        <div class="label">Total</div>
        <div class="value">${k.total}</div>
      </div>
      <div class="kpi-card">
        <div class="label">No Mês</div>
        <div class="value">${k.mes}</div>
      </div>
      <div class="kpi-card">
        <div class="label">Ativas / Concluídas</div>
        <div class="value" style="font-size: 18px;">
          ${k.statusResumo.ativas} / ${k.statusResumo.concluidas}
          <span class="sub">(${k.statusResumo.percentualAtivas}% / ${k.statusResumo.percentualConcluidas}%)</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="label">Setor Mais Afetado</div>
        <div class="value" style="font-size: 16px;">
          ${k.setorMaisFrequente.setor}
          <span class="sub">(${k.setorMaisFrequente.total})</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="label">Plantão Mais Afetado</div>
        <div class="value" style="font-size: 16px;">
          ${k.plantaoMaior.plantao}
          <span class="sub">(${k.plantaoMaior.total})</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="label">Tipo de Erro Predominante</div>
        <div class="value" style="font-size: 16px;">
          ${k.tipoErroMaisFrequente.tipo}
          <span class="sub">(${k.tipoErroMaisFrequente.total})</span>
        </div>
      </div>
      <div class="kpi-card">
        <div class="label">Medicamento Mais Envolvido</div>
        <div class="value" style="font-size: 14px;">
          ${k.medicamentoMaisEnvolvido.medicamento}
          <span class="sub">(${k.medicamentoMaisEnvolvido.total})</span>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════
  // GRÁFICOS (barras)
  // ═══════════════════════════════════════════════════════════
  function renderizarGraficos(g) {
    document.getElementById('chartsGrid').innerHTML = `
      ${renderizarGraficoBarras('Por Tipo de Erro', g.porTipoErro)}
      ${renderizarGraficoBarras('Por Setor', g.porSetor)}
      ${renderizarGraficoBarras('Por Farmacêutico', g.porFarmaceutico)}
      ${renderizarGraficoBarras('Por Plantão', g.porPlantao)}
      ${renderizarGraficoBarras('Por Classificação de Horário', g.porClassificacaoHorario)}
    `;
  }

  function renderizarGraficoBarras(titulo, dados) {
    if (!dados || dados.length === 0) {
      return `
        <div class="chart-card">
          <h4>${titulo}</h4>
          <div style="text-align: center; color: #9CA3AF; padding: 40px 0;">
            Sem dados
          </div>
        </div>
      `;
    }

    const itens = dados.slice(0, 8);
    const maxValor = Math.max(...itens.map(d => d.valor), 1);

    const barras = itens.map((item, i) => {
      const altura = Math.max((item.valor / maxValor) * 160, 12);
      const cor = CORES[i % CORES.length];
      return `
        <div class="chart-bar"
             style="height: ${altura}px; background: ${cor};"
             title="${item.nome}: ${item.valor}">
          <div class="tooltip">${item.nome}: ${item.valor}</div>
        </div>
      `;
    }).join('');

    const legenda = itens.map((item, i) => `
      <span>
        <span class="dot" style="background: ${CORES[i % CORES.length]};"></span>
        ${item.nome} (${item.valor})
      </span>
    `).join('');

    return `
      <div class="chart-card">
        <h4>${titulo}</h4>
        <div class="chart-container">${barras}</div>
        <div class="chart-legend">${legenda}</div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════
  // TABELA
  // ═══════════════════════════════════════════════════════════
  function filtrarTabela() {
    State.dashboard.filtro = document.getElementById('tableSearch').value.toLowerCase();
    State.dashboard.pagina = 1;
    renderizarTabela();
  }

  function renderizarTabela() {
    const termo = State.dashboard.filtro;
    let dados = State.dashboard.dados;

    if (termo) {
      dados = dados.filter(o =>
        JSON.stringify(o).toLowerCase().includes(termo)
      );
    }

    const porPagina = State.dashboard.porPagina;
    const total = dados.length;
    const totalPaginas = Math.ceil(total / porPagina) || 1;
    if (State.dashboard.pagina > totalPaginas) State.dashboard.pagina = totalPaginas;

    const inicio = (State.dashboard.pagina - 1) * porPagina;
    const fim = Math.min(inicio + porPagina, total);
    const pagina = dados.slice(inicio, fim);

    const tbody = document.getElementById('tableBody');

    if (pagina.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 30px; color: #9CA3AF;">Nenhuma ocorrência encontrada</td></tr>`;
    } else {
      tbody.innerHTML = pagina.map(o => `
        <tr>
          <td><strong>${o.codigo || '—'}</strong></td>
          <td>${UI.formatarDataBr(o.data_ocorrencia)}</td>
          <td>${o.prontuario || '—'}</td>
          <td title="${o.medicamento_nome}">${(o.medicamento_nome || '—').substring(0, 30)}</td>
          <td>${o.tipo_erro_descricao || '—'}</td>
          <td>${o.farmaceutico_nome || '—'}</td>
          <td>${o.setor_nome || '—'}</td>
          <td>${UI.badgeStatus(o.status)}</td>
          <td>
            <button class="btn btn-sm btn-pdf" onclick="Dashboard.gerarPdfIndividual(${o.id})">📄</button>
            <button class="btn btn-sm btn-outline" onclick="Dashboard.alterarStatus(${o.id}, '${o.status}')">
              ${o.status === 'Ativa' ? '✓' : '↺'}
            </button>
          </td>
        </tr>
      `).join('');
    }

    document.getElementById('tableInfo').textContent = total > 0
      ? `Mostrando ${inicio + 1}–${fim} de ${total} registros`
      : 'Nenhum registro';

    // Paginação
    const pag = document.getElementById('tablePagination');
    let html = `<button ${State.dashboard.pagina === 1 ? 'disabled' : ''} onclick="Dashboard.irPagina(${State.dashboard.pagina - 1})">‹</button>`;

    const maxBotoes = 7;
    for (let i = 1; i <= Math.min(totalPaginas, maxBotoes); i++) {
      html += `<button class="${i === State.dashboard.pagina ? 'active' : ''}" onclick="Dashboard.irPagina(${i})">${i}</button>`;
    }
    if (totalPaginas > maxBotoes) {
      html += `<span style="padding: 4px 8px;">…</span>`;
      html += `<button onclick="Dashboard.irPagina(${totalPaginas})">${totalPaginas}</button>`;
    }

    html += `<button ${State.dashboard.pagina >= totalPaginas ? 'disabled' : ''} onclick="Dashboard.irPagina(${State.dashboard.pagina + 1})">›</button>`;

    pag.innerHTML = html;
  }

  function irPagina(n) {
    State.dashboard.pagina = n;
    renderizarTabela();
  }

  // ═══════════════════════════════════════════════════════════
  // AÇÕES
  // ═══════════════════════════════════════════════════════════
  async function alterarStatus(id, statusAtual) {
    const novoStatus = statusAtual === 'Concluida' ? 'Ativa' : 'Concluida';
    UI.loading('Atualizando status...');
    try {
      await Api.patch(`/api/ocorrencias/${id}/status`, { status: novoStatus });
      UI.toast(`Status atualizado para ${novoStatus}.`, 'success');
      carregar();
    } catch (err) {
      UI.toast('Erro: ' + err.message, 'error');
    } finally {
      UI.esconderLoading();
    }
  }

  async function gerarPdfIndividual(id) {
    UI.loading('Gerando PDF...');
    try {
      const r = await Api.get(`/api/pdf/individual/${id}`);
      window.open(r.caminho, '_blank');
      UI.toast('PDF gerado!', 'success');
    } catch (err) {
      UI.toast('Erro ao gerar PDF: ' + err.message, 'error');
    } finally {
      UI.esconderLoading();
    }
  }

  async function gerarPdfGerencial() {
    const filtros = obterFiltros();
    const qs = new URLSearchParams({
      periodoInicio: filtros.periodoInicio,
      periodoFim: filtros.periodoFim
    }).toString();

    UI.loading('Gerando PDF gerencial... Isso pode demorar...');
    try {
      const r = await Api.get(`/api/pdf/gerencial?${qs}`);
      window.open(r.caminho, '_blank');
      UI.toast('PDF gerencial gerado!', 'success');
    } catch (err) {
      UI.toast('Erro ao gerar PDF: ' + err.message, 'error');
    } finally {
      UI.esconderLoading();
    }
  }

  // ── API pública ─────────────────────────────────────────────
  return {
    carregar, filtrarTabela, irPagina,
    alterarStatus, gerarPdfIndividual, gerarPdfGerencial
  };
})();