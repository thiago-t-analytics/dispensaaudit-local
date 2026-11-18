// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 11 — FRONTEND: NAVEGACAO SPA
// ║ O QUE ESTE BLOCO FAZ: Inicializa a aplicacao e alterna entre paginas.
// ║ CONCEITO APRENDIDO: eventos DOM, navegacao e carregamento progressivo.
// ║ COMO TESTAR: Navegue pelas paginas e confira o breadcrumb.
// ║ REQUER: D11-B01 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D11-B02 ▼▼▼
//// =============================================================
//// app.js — Inicialização e navegação
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   1. Carrega dados de referência (medicamentos, tipos, etc.)
////   2. Configura navegação entre páginas
////   3. Usa a identidade local padrão, sem bloquear a interface por login
//// =============================================================
//
//window.App = (() => {
//
//  // ═══════════════════════════════════════════════════════════
//  // REFS (dados de referência para selects e cache)
//  // ═══════════════════════════════════════════════════════════
//  async function carregarRefs() {
//    const [med, tipos, set, farm, ass, usr] = await Promise.all([
//      Api.get('/api/medicamentos').then(r => r.data),
//      Api.get('/api/tipos-erro').then(r => r.data),
//      Api.get('/api/setores').then(r => r.data),
//      Api.get('/api/farmaceuticos').then(r => r.data),
//      Api.get('/api/assistentes').then(r => r.data),
//      Api.get('/api/usuarios').then(r => r.data)
//    ]);
//    State.refs.medicamentos = med;
//    State.refs.tiposErro = tipos;
//    State.refs.setores = set;
//    State.refs.farmaceuticos = farm;
//    State.refs.assistentes = ass;
//    State.refs.usuarios = usr;
//  }
//
//  async function recarregarRefs() {
//    await carregarRefs();
//    popularFiltrosDashboard();
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // FILTROS DO DASHBOARD (dropdowns)
//  // ═══════════════════════════════════════════════════════════
//  function popularFiltrosDashboard() {
//    const fill = (id, lista, valCampo, txtCampo) => {
//      const sel = document.getElementById(id);
//      if (!sel) return;
//      const atual = sel.value;
//      sel.innerHTML = '<option value="">Todos</option>' +
//        lista.map(d => `<option value="${d[valCampo]}">${d[txtCampo]}</option>`).join('');
//      sel.value = atual;
//    };
//    fill('filterSetor', State.refs.setores, 'id', 'nome');
//    fill('filterTipoErro', State.refs.tiposErro, 'id', 'descricao');
//    fill('filterFarmaceutico', State.refs.farmaceuticos, 'id', 'nome');
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // NAVEGAÇÃO
//  // ═══════════════════════════════════════════════════════════
//  async function navegar(paginaSolicitada) {
//    // O nome antigo continua aceito por scripts ou links que ainda o utilizem.
//    const aliases = { ocorrencias: 'ocorrencias-lancar' };
//    const page = aliases[paginaSolicitada] || paginaSolicitada;
//    const titulos = {
//      dashboard: 'Dashboard',
//      'ocorrencias-lista': 'Ocorrências Cadastradas',
//      'ocorrencias-lancar': 'Lançar Ocorrência',
//      configuracoes: 'Configurações',
//      logs: 'Logs de Auditoria'
//    };
//    const paginaAlvo = document.getElementById(`page-${page}`);
//    if (!paginaAlvo) {
//      UI.toast('Não foi possível abrir esta página.', 'error');
//      return;
//    }
//
//    document.querySelectorAll('.nav-item').forEach(el => {
//      const ativa = el.dataset.page === page;
//      el.classList.toggle('active', ativa);
//      if (ativa) el.setAttribute('aria-current', 'page');
//      else el.removeAttribute('aria-current');
//    });
//
//    document.querySelectorAll('.page').forEach(el => {
//      const ativa = el === paginaAlvo;
//      el.classList.toggle('active', ativa);
//      el.setAttribute('aria-hidden', String(!ativa));
//    });
//
//    const titulo = titulos[page] || page;
//    document.getElementById('pageTitle').textContent = titulo;
//    document.getElementById('breadcrumbCurrent').textContent = titulo;
//    fecharSidebar();
//
//    const skeleton = document.getElementById('pageSkeleton');
//    const main = document.getElementById('mainContent');
//    skeleton.hidden = false;
//    main.setAttribute('aria-busy', 'true');
//
//    try {
//      if (page === 'dashboard' && window.Dashboard) await window.Dashboard.carregar();
//      if (page === 'ocorrencias-lancar') {
//        if (window.OcorrenciasLote) await OcorrenciasLote.inicializar();
//        else if (window.Ocorrencias) await window.Ocorrencias.inicializar();
//      }
//      if (page === 'ocorrencias-lista' && window.OcorrenciasLista) {
//        await window.OcorrenciasLista.carregar();
//      }
//      if (page === 'configuracoes' && window.Cruds) await window.Cruds.renderizar();
//      if (page === 'logs' && window.Logs) await window.Logs.carregar();
//    } catch (err) {
//      UI.toast(`Erro ao abrir ${titulo.toLowerCase()}: ${err.message}`, 'error');
//    } finally {
//      skeleton.hidden = true;
//      main.removeAttribute('aria-busy');
//    }
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // USUÁRIO
//  // ═══════════════════════════════════════════════════════════
//  function abrirModalUsuario() {
//    const sel = document.getElementById('userSelect');
//    elementoComFocoAnterior = document.activeElement;
//    sel.innerHTML = '<option value="">Selecione...</option>' +
//      State.refs.usuarios.map(u => `<option value="${u.nome}">${u.nome}</option>`).join('');
//    sel.value = State.usuario.nome || '';
//    document.getElementById('userModalOverlay').classList.add('active');
//    document.getElementById('btnConfirmUser').disabled = !sel.value;
//    sel.onchange = () => {
//      document.getElementById('btnConfirmUser').disabled = !sel.value;
//    };
//    sel.focus();
//  }
//
//  function confirmarUsuario() {
//    const nome = document.getElementById('userSelect').value;
//    if (!nome) {
//      UI.toast('Selecione seu nome para continuar.', 'warning');
//      document.getElementById('userSelect').focus();
//      return;
//    }
//    State.usuario.nome = nome;
//    document.getElementById('userName').textContent = nome;
//    document.getElementById('userAvatar').textContent = nome.charAt(0).toUpperCase();
//    document.getElementById('userModalOverlay').classList.remove('active');
//    UI.toast(`Bem-vindo(a), ${nome}!`, 'info');
//    if (elementoComFocoAnterior && elementoComFocoAnterior !== document.body &&
//      elementoComFocoAnterior.isConnected) {
//      elementoComFocoAnterior.focus();
//    } else {
//      document.getElementById('mainContent').focus();
//    }
//  }
//
//  let elementoComFocoAnterior = null;
//
//  function alternarSidebar(aberta) {
//    document.body.classList.toggle('sidebar-open', aberta);
//    document.getElementById('sidebarToggle').setAttribute('aria-expanded', String(aberta));
//  }
//
//  function fecharSidebar() {
//    alternarSidebar(false);
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // RELÓGIO
//  // ═══════════════════════════════════════════════════════════
//  function atualizarRelogio() {
//    const now = new Date();
//    document.getElementById('currentDateTime').textContent =
//      now.toLocaleDateString('pt-BR') + ' ' +
//      now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // INIT
//  // ═══════════════════════════════════════════════════════════
//  async function init() {
//    atualizarRelogio();
//    setInterval(atualizarRelogio, 30000);
//
//    // Navegação acessível: controles button suportam Enter e Espaço nativamente.
//    document.querySelectorAll('[data-page]').forEach(el => {
//      el.addEventListener('click', () => {
//        navegar(el.dataset.page);
//      });
//    });
//
//    document.getElementById('sidebarToggle').addEventListener('click', () => {
//      alternarSidebar(!document.body.classList.contains('sidebar-open'));
//    });
//    document.getElementById('sidebarBackdrop').addEventListener('click', fecharSidebar);
//    const seletorUsuario = document.getElementById('btnOpenUserModal');
//    if (seletorUsuario) seletorUsuario.addEventListener('click', abrirModalUsuario);
//
//    document.addEventListener('keydown', event => {
//      if (event.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
//        fecharSidebar();
//        document.getElementById('sidebarToggle').focus();
//      }
//    });
//
//    // Filtros do dashboard (recarregam ao mudar)
//    ['filterPeriodo', 'filterStatus', 'filterPlantao', 'filterSetor', 'filterTipoErro', 'filterFarmaceutico']
//      .forEach(id => {
//        const el = document.getElementById(id);
//        if (el) el.addEventListener('change', () => {
//          if (!window.Dashboard) return;
//          window.Dashboard.limparFiltroGrafico(id);
//          window.Dashboard.carregar();
//        });
//      });
//
//    // Carrega os dados de referência; a identidade local não exige login.
//    try {
//      await carregarRefs();
//      popularFiltrosDashboard();
//    } catch (err) {
//      UI.toast('Erro ao carregar dados: ' + err.message, 'error');
//    }
//    await navegar('dashboard');
//  }
//
//  document.addEventListener('DOMContentLoaded', init);
//
//  return {
//    recarregarRefs,
//    navegar,
//    confirmarUsuario,
//    fecharSidebar
//  };
//})();
// ▲▲▲ ATE AQUI — D11-B02 ▲▲▲
// CHECKPOINT: apos D11-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
