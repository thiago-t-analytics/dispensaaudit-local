// =============================================================
// cruds.js — Configurações (medicamentos, tipos, setores, etc.)
// =============================================================
// O QUE ESTE ARQUIVO FAZ:
//   Renderiza tabelas e modais de edição para cada entidade
//   de referência do sistema.
//
// CONCEITO APRENDIDO:
//   - Padrão genérico de CRUD reutilizado para 5 entidades
//   - Um único modal que se adapta ao tipo em edição
// =============================================================

window.Cruds = (() => {

  // ── Configuração de cada entidade ──────────────────────────
  const CONFIG = {
    medicamentos: {
      titulo: 'Medicamentos',
      api: '/api/medicamentos',
      colunas: [
        { campo: 'id', label: 'ID' },
        { campo: 'nome', label: 'Nome' },
        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
      ],
      form: [
        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true }
      ]
    },
    tiposErro: {
      titulo: 'Tipos de Erro',
      api: '/api/tipos-erro',
      colunas: [
        { campo: 'id', label: 'ID' },
        { campo: 'descricao', label: 'Descrição' },
        { campo: 'categoria', label: 'Categoria' },
        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
      ],
      form: [
        { campo: 'descricao', label: 'Descrição', tipo: 'text', obrigatorio: true },
        { campo: 'categoria', label: 'Categoria', tipo: 'select', obrigatorio: true,
          opcoes: ['Quantidade', 'Omissão', 'Tempo', 'Seleção', 'Identificação', 'Processo', 'Documentação'] },
        { campo: 'exemplo', label: 'Exemplo', tipo: 'text' }
      ]
    },
    setores: {
      titulo: 'Setores',
      api: '/api/setores',
      colunas: [
        { campo: 'id', label: 'ID' },
        { campo: 'nome', label: 'Nome' },
        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
      ],
      form: [
        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true }
      ]
    },
    farmaceuticos: {
      titulo: 'Farmacêuticos',
      api: '/api/farmaceuticos',
      colunas: [
        { campo: 'id', label: 'ID' },
        { campo: 'nome', label: 'Nome' },
        { campo: 'plantao', label: 'Plantão' },
        { campo: 'tipo', label: 'Tipo' },
        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
      ],
      form: [
        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true },
        { campo: 'plantao', label: 'Plantão', tipo: 'select', obrigatorio: true, opcoes: ['Diurno', 'Noturno'] },
        { campo: 'tipo', label: 'Tipo', tipo: 'select', obrigatorio: true, opcoes: ['Fixo', 'Folguista'] }
      ]
    },
    assistentes: {
      titulo: 'Assistentes',
      api: '/api/assistentes',
      colunas: [
        { campo: 'id', label: 'ID' },
        { campo: 'nome', label: 'Nome' },
        { campo: 'plantao', label: 'Plantão' },
        { campo: 'farmaceutico_nome', label: 'Farmacêutico' },
        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
      ],
      form: [
        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true },
        { campo: 'plantao', label: 'Plantão', tipo: 'select', obrigatorio: true, opcoes: ['Diurno', 'Noturno'] },
        { campo: 'farmaceutico_id', label: 'Farmacêutico', tipo: 'select-fk',
          fonte: () => State.refs.farmaceuticos }
      ]
    }
  };

  // ═══════════════════════════════════════════════════════════
  // TABS
  // ═══════════════════════════════════════════════════════════
  function mudarTab(tab) {
    State.configTab = tab;
    document.querySelectorAll('.tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === tab)
    );
    renderizar();
  }

  // ═══════════════════════════════════════════════════════════
  // RENDERIZAÇÃO DA TABELA
  // ═══════════════════════════════════════════════════════════
  async function renderizar() {
    const cfg = CONFIG[State.configTab];
    const container = document.getElementById('configContent');

    UI.loading('Carregando...');
    try {
      const r = await Api.get(`${cfg.api}?incluirInativos=true`);
      const dados = r.data;

      const headers = cfg.colunas.map(c => `<th>${c.label}</th>`).join('') + '<th>Ações</th>';
      const rows = dados.map(item => {
        const cells = cfg.colunas.map(c => {
          const valor = item[c.campo];
          return `<td>${c.render ? c.render(valor, item) : (valor ?? '—')}</td>`;
        }).join('');
        return `
          <tr>
            ${cells}
            <td>
              <button class="btn btn-sm btn-outline" onclick="Cruds.editar('${item.id}')">Editar</button>
              <button class="btn btn-sm btn-danger" onclick="Cruds.excluir('${item.id}')">Excluir</button>
            </td>
          </tr>
        `;
      }).join('');

      container.innerHTML = `
        <div class="table-wrapper">
          <div class="table-header">
            <h3>${cfg.titulo} (${dados.length})</h3>
            <button class="btn btn-primary" onclick="Cruds.novo()">➕ Novo</button>
          </div>
          <div class="table-scroll">
            <table>
              <thead><tr>${headers}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>
        </div>
      `;
    } catch (err) {
      container.innerHTML = `<p style="color: red;">Erro: ${err.message}</p>`;
    } finally {
      UI.esconderLoading();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // MODAL (novo / editar)
  // ═══════════════════════════════════════════════════════════
  async function abrirFormulario(item = null) {
    const cfg = CONFIG[State.configTab];
    const titulo = item ? `Editar ${cfg.titulo.slice(0, -1)}` : `Novo ${cfg.titulo.slice(0, -1)}`;

    const form = cfg.form.map(f => {
      const valor = item ? (item[f.campo] ?? '') : '';
      if (f.tipo === 'select') {
        const opts = f.opcoes.map(o =>
          `<option value="${o}" ${valor === o ? 'selected' : ''}>${o}</option>`
        ).join('');
        return `<div class="form-group">
          <label>${f.label}${f.obrigatorio ? ' <span class="required">*</span>' : ''}</label>
          <select id="form_${f.campo}"><option value="">Selecione...</option>${opts}</select>
        </div>`;
      }
      if (f.tipo === 'select-fk') {
        const fonte = f.fonte();
        const opts = fonte.map(x =>
          `<option value="${x.id}" ${valor === x.id ? 'selected' : ''}>${x.nome}</option>`
        ).join('');
        return `<div class="form-group">
          <label>${f.label}</label>
          <select id="form_${f.campo}"><option value="">Nenhum</option>${opts}</select>
        </div>`;
      }
      return `<div class="form-group">
        <label>${f.label}${f.obrigatorio ? ' <span class="required">*</span>' : ''}</label>
        <input type="${f.tipo}" id="form_${f.campo}" value="${valor ?? ''}">
      </div>`;
    }).join('');

    UI.abrirModal(titulo, `
      ${form}
      <div class="form-actions">
        <button class="btn btn-outline" onclick="UI.fecharModal()">Cancelar</button>
        <button class="btn btn-primary" id="btnSalvarCRUD">${item ? 'Atualizar' : 'Cadastrar'}</button>
      </div>
    `);

    document.getElementById('btnSalvarCRUD').onclick = () => salvar(item?.id);
  }

  async function salvar(id = null) {
    const cfg = CONFIG[State.configTab];
    const dados = {};
    for (const f of cfg.form) {
      const el = document.getElementById(`form_${f.campo}`);
      dados[f.campo] = el.value.trim() || null;
    }

    UI.loading('Salvando...');
    try {
      if (id) {
        await Api.put(`${cfg.api}/${id}`, dados);
        UI.toast('Atualizado!', 'success');
      } else {
        await Api.post(cfg.api, dados);
        UI.toast('Cadastrado!', 'success');
      }
      UI.fecharModal();
      await App.recarregarRefs();
      renderizar();
    } catch (err) {
      UI.toast('Erro: ' + err.message, 'error');
    } finally {
      UI.esconderLoading();
    }
  }

  async function editar(id) {
    const cfg = CONFIG[State.configTab];
    try {
      const r = await Api.get(`${cfg.api}/${id}`);
      abrirFormulario(r.data);
    } catch (err) {
      UI.toast('Erro: ' + err.message, 'error');
    }
  }

  async function excluir(id) {
    const cfg = CONFIG[State.configTab];
    UI.confirmar(
      'Confirmar exclusão',
      'Deseja realmente excluir (inativar) este registro?',
      async () => {
        UI.loading('Excluindo...');
        try {
          await Api.del(`${cfg.api}/${id}`);
          UI.toast('Excluído!', 'success');
          await App.recarregarRefs();
          renderizar();
        } catch (err) {
          UI.toast('Erro: ' + err.message, 'error');
        } finally {
          UI.esconderLoading();
        }
      }
    );
  }

  function novo() { abrirFormulario(null); }

  return { mudarTab, renderizar, novo, editar, excluir };
})();