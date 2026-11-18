// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 13 — FRONTEND: CONFIGURACOES E LOGS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs administrativos e timeline de auditoria.
// ║ CONCEITO APRENDIDO: event delegation, tabelas e consulta de logs.
// ║ COMO TESTAR: Altere um cadastro e verifique seu registro de auditoria.
// ║ REQUER: D07-B02 e D13-B01 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D13-B02 ▼▼▼
//// =============================================================
//// logs.js — Timeline de auditoria
//// O que faz: filtra e apresenta os logs em ordem cronológica, com carga incremental.
//// Por que existe: facilita a leitura da atividade sem perder os filtros atuais da API.
//// Como testar: abra Logs, combine ação/tabela/período e use “Carregar mais”.
//// =============================================================
//
//window.Logs = (() => {
//  let requisicaoAtual = 0;
//  let carregandoMais = false;
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
//  function iconeAcao(acao) {
//    const nome = String(acao || '').toLocaleLowerCase('pt-BR');
//    if (nome.includes('cadastro')) {
//      return {
//        classe: 'log-icon-success',
//        caminho: '<path d="M12 5v14M5 12h14"/>'
//      };
//    }
//    if (nome.includes('edição') || nome.includes('edicao')) {
//      return {
//        classe: 'log-icon-warning',
//        caminho: '<path d="m4 16.5-.8 3.3 3.3-.8L19 6.5 16.5 4 4 16.5Z"/><path d="m14.8 5.7 3.5 3.5"/>'
//      };
//    }
//    if (nome.includes('exclus')) {
//      return {
//        classe: 'log-icon-danger',
//        caminho: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'
//      };
//    }
//    return {
//      classe: 'log-icon-neutral',
//      caminho: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5M12 8h.01"/>'
//    };
//  }
//
//  function montarFiltros(pagina) {
//    const dataFim = document.getElementById('logFilterDataFim').value;
//    return new URLSearchParams({
//      acao: document.getElementById('logFilterAcao').value,
//      tabela: document.getElementById('logFilterTabela').value,
//      dataInicio: document.getElementById('logFilterDataInicio').value,
//      dataFim: dataFim ? `${dataFim}T23:59:59.999Z` : '',
//      pagina: String(pagina),
//      porPagina: String(State.logs.porPagina)
//    });
//  }
//
//  async function carregar(pagina = 1, anexar = false) {
//    const numeroRequisicao = ++requisicaoAtual;
//    if (!anexar) {
//      State.logs.dados = [];
//      State.logs.pagina = 1;
//      UI.loading('Carregando logs...');
//    } else {
//      carregandoMais = true;
//      atualizarBotaoMais();
//    }
//
//    try {
//      const resposta = await Api.get(`/api/logs?${montarFiltros(pagina)}`);
//      if (numeroRequisicao !== requisicaoAtual) return;
//
//      State.logs.dados = anexar
//        ? [...State.logs.dados, ...resposta.dados]
//        : resposta.dados;
//      State.logs.paginacao = resposta.paginacao;
//      State.logs.pagina = Number(resposta.paginacao?.pagina) || pagina;
//      renderizar();
//    } catch (erro) {
//      if (numeroRequisicao === requisicaoAtual) {
//        UI.toast(`Erro ao carregar logs: ${erro.message}`, 'error');
//      }
//    } finally {
//      if (numeroRequisicao === requisicaoAtual) {
//        carregandoMais = false;
//        UI.esconderLoading();
//        atualizarBotaoMais();
//      }
//    }
//  }
//
//  function montarEvento(log) {
//    const acao = escaparHtml(log.acao || 'Atividade');
//    const icone = iconeAcao(log.acao);
//    const registro = log.registro ? `Registro ${log.registro}` : 'Registro não informado';
//    const data = String(log.data_hora || '');
//    return `
//      <li class="log-event">
//        <time class="log-event-time" datetime="${escaparHtml(data)}">
//          ${escaparHtml(UI.formatarDataHora(data))}
//        </time>
//        <span class="log-event-marker ${icone.classe}" aria-hidden="true">
//          <svg viewBox="0 0 24 24" focusable="false">${icone.caminho}</svg>
//        </span>
//        <div class="log-event-content">
//          <div class="log-event-heading">
//            <span class="log-action">${acao}</span>
//            <span class="log-user">${escaparHtml(log.usuario || 'Sistema')}</span>
//          </div>
//          <p>${escaparHtml(log.tabela || 'Tabela não informada')} · ${escaparHtml(registro)}</p>
//        </div>
//      </li>`;
//  }
//
//  function atualizarBotaoMais() {
//    const botao = document.getElementById('btnLogLoadMore');
//    const paginacao = State.logs.paginacao;
//    const temMais = paginacao && State.logs.pagina < paginacao.totalPaginas;
//    botao.hidden = !temMais;
//    botao.disabled = carregandoMais;
//    botao.textContent = carregandoMais ? 'Carregando...' : 'Carregar mais';
//  }
//
//  function renderizar() {
//    const timeline = document.getElementById('logTableBody');
//    const total = Number(State.logs.paginacao?.total) || 0;
//    if (State.logs.dados.length === 0) {
//      timeline.innerHTML = '<li class="log-empty">Nenhum evento encontrado para estes filtros.</li>';
//    } else {
//      timeline.innerHTML = State.logs.dados.map(montarEvento).join('');
//    }
//
//    document.getElementById('logInfo').textContent =
//      `Exibindo ${State.logs.dados.length} de ${total} eventos`;
//    atualizarBotaoMais();
//  }
//
//  function aplicarFiltros() {
//    carregar(1);
//  }
//
//  function limparFiltros() {
//    ['logFilterAcao', 'logFilterTabela', 'logFilterDataInicio', 'logFilterDataFim']
//      .forEach(id => { document.getElementById(id).value = ''; });
//    aplicarFiltros();
//  }
//
//  function carregarMais() {
//    const paginacao = State.logs.paginacao;
//    if (!carregandoMais && paginacao && State.logs.pagina < paginacao.totalPaginas) {
//      carregar(State.logs.pagina + 1, true);
//    }
//  }
//
//  return { carregar, renderizar, aplicarFiltros, limparFiltros, carregarMais };
//})();
// ▲▲▲ ATE AQUI — D13-B02 ▲▲▲
// CHECKPOINT: apos D13-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
