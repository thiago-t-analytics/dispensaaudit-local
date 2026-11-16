// =============================================================
// app.js — Inicialização e navegação
// =============================================================
// O QUE ESTE ARQUIVO FAZ:
//   1. Carrega dados de referência (medicamentos, tipos, etc.)
//   2. Abre o modal de seleção de usuário
//   3. Configura navegação entre páginas
//   4. Inicia o dashboard na primeira tela
// =============================================================

window.App = (() => {

  // ═══════════════════════════════════════════════════════════
  // REFS (dados de referência para selects e cache)
  // ═══════════════════════════════════════════════════════════
  async function carregarRefs() {
    const [med, tipos, set, farm, ass, usr] = await Promise.all([
      Api.get('/api/medicamentos').then(r => r.data),
      Api.get('/api/tipos-erro').then(r => r.data),
      Api.get('/api/setores').then(r => r.data),
      Api.get('/api/farmaceuticos').then(r => r.data),
      Api.get('/api/assistentes').then(r => r.data),
      Api.get('/api/usuarios').then(r => r.data)
    ]);
    State.refs.medicamentos = med;
    State.refs.tiposErro = tipos;
    State.refs.setores = set;
    State.refs.farmaceuticos = farm;
    State.refs.assistentes = ass;
    State.refs.usuarios = usr;
  }

  async function recarregarRefs() {
    await carregarRefs();
    popularFiltrosDashboard();
  }

  // ═══════════════════════════════════════════════════════════
  // FILTROS DO DASHBOARD (dropdowns)
  // ═══════════════════════════════════════════════════════════
  function popularFiltrosDashboard() {
    const fill = (id, lista, valCampo, txtCampo) => {
      const sel = document.getElementById(id);
      if (!sel) return;
      const atual = sel.value;
      sel.innerHTML = '<option value="">Todos</option>' +
        lista.map(d => `<option value="${d[valCampo]}">${d[txtCampo]}</option>`).join('');
      sel.value = atual;
    };
    fill('filterSetor', State.refs.setores, 'id', 'nome');
    fill('filterTipoErro', State.refs.tiposErro, 'id', 'descricao');
    fill('filterFarmaceutico', State.refs.farmaceuticos, 'id', 'nome');
  }

  // ═══════════════════════════════════════════════════════════
  // NAVEGAÇÃO
  // ═══════════════════════════════════════════════════════════
  function navegar(page) {
    document.querySelectorAll('.nav-item').forEach(el =>
      el.classList.toggle('active', el.dataset.page === page)
    );
    document.querySelectorAll('.page').forEach(el =>
      el.classList.toggle('active', el.id === `page-${page}`)
    );

    const titulos = {
      dashboard: 'Dashboard',
      ocorrencias: 'Registro de Ocorrências',
      configuracoes: 'Configurações',
      logs: 'Logs de Auditoria'
    };
    document.getElementById('pageTitle').textContent = titulos[page] || page;

    if (page === 'dashboard') Dashboard.carregar();
    if (page === 'ocorrencias') Ocorrencias.inicializar();
    if (page === 'configuracoes') Cruds.renderizar();
    if (page === 'logs') Logs.carregar();
  }

  // ═══════════════════════════════════════════════════════════
  // USUÁRIO
  // ═══════════════════════════════════════════════════════════
  function abrirModalUsuario() {
    const sel = document.getElementById('userSelect');
    sel.innerHTML = '<option value="">Selecione...</option>' +
      State.refs.usuarios.map(u => `<option value="${u.nome}">${u.nome}</option>`).join('');
    document.getElementById('userModalOverlay').classList.add('active');
    document.getElementById('btnConfirmUser').disabled = true;
    sel.onchange = () => {
      document.getElementById('btnConfirmUser').disabled = !sel.value;
    };
  }

  function confirmarUsuario() {
    const nome = document.getElementById('userSelect').value;
    if (!nome) return;
    State.usuario.nome = nome;
    document.getElementById('userName').textContent = nome;
    document.getElementById('userAvatar').textContent = nome.charAt(0).toUpperCase();
    document.getElementById('userModalOverlay').classList.remove('active');
    UI.toast(`Bem-vindo(a), ${nome}!`, 'info');
  }

  // ═══════════════════════════════════════════════════════════
  // RELÓGIO
  // ═══════════════════════════════════════════════════════════
  function atualizarRelogio() {
    const now = new Date();
    document.getElementById('currentDateTime').textContent =
      now.toLocaleDateString('pt-BR') + ' ' +
      now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // ═══════════════════════════════════════════════════════════
  // INIT
  // ═══════════════════════════════════════════════════════════
  async function init() {
    atualizarRelogio();
    setInterval(atualizarRelogio, 30000);

    // Eventos de navegação
    document.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        if (!State.usuario.nome) {
          UI.toast('Selecione seu usuário primeiro.', 'warning');
          return;
        }
        navegar(el.dataset.page);
      });
    });

    // Filtros do dashboard (recarregam ao mudar)
    ['filterPeriodo', 'filterStatus', 'filterPlantao', 'filterSetor', 'filterTipoErro', 'filterFarmaceutico']
      .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', () => Dashboard.carregar());
      });

    // Carrega refs e abre modal de usuário
    try {
      await carregarRefs();
      popularFiltrosDashboard();
      abrirModalUsuario();
    } catch (err) {
      UI.toast('Erro ao carregar dados: ' + err.message, 'error');
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  return { recarregarRefs, navegar, confirmarUsuario };
})();