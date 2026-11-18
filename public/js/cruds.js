// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 13 — FRONTEND: CONFIGURACOES E LOGS
// ║ O QUE ESTE BLOCO FAZ: Habilita CRUDs administrativos e timeline de auditoria.
// ║ CONCEITO APRENDIDO: event delegation, tabelas e consulta de logs.
// ║ COMO TESTAR: Altere um cadastro e verifique seu registro de auditoria.
// ║ REQUER: D07-B02 e D13-B01 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D13-B02 ▼▼▼
//// =============================================================
//// cruds.js — Configurações (medicamentos, tipos, setores, etc.)
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Renderiza tabelas e modais de edição para cada entidade
////   de referência do sistema.
////
//// CONCEITO APRENDIDO:
////   - Padrão genérico de CRUD reutilizado para 5 entidades
////   - Um único modal que se adapta ao tipo em edição
//// =============================================================
//
//window.Cruds = (() => {
//
//  // Escapa valores da API antes de inseri-los na marcação do painel.
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
//  // ── Configuração de cada entidade ──────────────────────────
//  const CONFIG = {
//    medicamentos: {
//      titulo: 'Medicamentos',
//      singular: 'medicamento',
//      api: '/api/medicamentos',
//      colunas: [
//        { campo: 'id', label: 'ID' },
//        { campo: 'nome', label: 'Nome' },
//        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
//      ],
//      form: [
//        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true }
//      ]
//    },
//    tiposErro: {
//      titulo: 'Tipos de Erro',
//      singular: 'tipo de erro',
//      api: '/api/tipos-erro',
//      colunas: [
//        { campo: 'id', label: 'ID' },
//        { campo: 'descricao', label: 'Descrição' },
//        { campo: 'categoria', label: 'Categoria' },
//        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
//      ],
//      form: [
//        { campo: 'descricao', label: 'Descrição', tipo: 'text', obrigatorio: true },
//        { campo: 'categoria', label: 'Categoria', tipo: 'select', obrigatorio: true,
//          opcoes: ['Quantidade', 'Omissão', 'Tempo', 'Seleção', 'Identificação', 'Processo', 'Documentação'] },
//        { campo: 'exemplo', label: 'Exemplo', tipo: 'text' }
//      ]
//    },
//    setores: {
//      titulo: 'Setores',
//      singular: 'setor',
//      api: '/api/setores',
//      colunas: [
//        { campo: 'id', label: 'ID' },
//        { campo: 'nome', label: 'Nome' },
//        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
//      ],
//      form: [
//        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true }
//      ]
//    },
//    farmaceuticos: {
//      titulo: 'Farmacêuticos',
//      singular: 'farmacêutico',
//      api: '/api/farmaceuticos',
//      colunas: [
//        { campo: 'id', label: 'ID' },
//        { campo: 'nome', label: 'Nome' },
//        { campo: 'plantao', label: 'Plantão' },
//        { campo: 'tipo', label: 'Tipo' },
//        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
//      ],
//      form: [
//        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true },
//        { campo: 'plantao', label: 'Plantão', tipo: 'select', obrigatorio: true, opcoes: ['Diurno', 'Noturno'] },
//        { campo: 'tipo', label: 'Tipo', tipo: 'select', obrigatorio: true, opcoes: ['Fixo', 'Folguista'] }
//      ]
//    },
//    assistentes: {
//      titulo: 'Assistentes',
//      singular: 'assistente',
//      api: '/api/assistentes',
//      colunas: [
//        { campo: 'id', label: 'ID' },
//        { campo: 'nome', label: 'Nome' },
//        { campo: 'plantao', label: 'Plantão' },
//        { campo: 'farmaceutico_nome', label: 'Farmacêutico' },
//        { campo: 'ativo', label: 'Status', render: v => UI.badgeStatus(v ? 'Ativa' : 'Excluida') }
//      ],
//      form: [
//        { campo: 'nome', label: 'Nome', tipo: 'text', obrigatorio: true },
//        { campo: 'plantao', label: 'Plantão', tipo: 'select', obrigatorio: true, opcoes: ['Diurno', 'Noturno'] },
//        { campo: 'farmaceutico_id', label: 'Farmacêutico', tipo: 'select-fk',
//          fonte: () => State.refs.farmaceuticos }
//      ]
//    }
//  };
//
//  // ═══════════════════════════════════════════════════════════
//  // TABS
//  // ═══════════════════════════════════════════════════════════
//  function mudarTab(tab) {
//    State.configTab = tab;
//    document.querySelectorAll('.config-tabs .tab').forEach(t => {
//      const ativa = t.dataset.tab === tab;
//      t.classList.toggle('active', ativa);
//      t.setAttribute('aria-selected', String(ativa));
//    });
//    document.getElementById('configContent')
//      .setAttribute('aria-labelledby', `tab-${tab}`);
//    renderizar();
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // RENDERIZAÇÃO DA TABELA
//  // ═══════════════════════════════════════════════════════════
//  async function renderizar() {
//    const cfg = CONFIG[State.configTab];
//    const container = document.getElementById('configContent');
//
//    UI.loading('Carregando...');
//    try {
//      const r = await Api.get(`${cfg.api}?incluirInativos=true`);
//      const dados = Array.isArray(r.data) ? r.data : [];
//
//      const headers = cfg.colunas.map(c => `<th scope="col">${escaparHtml(c.label)}</th>`).join('') +
//        '<th scope="col">Ações</th>';
//      const rows = dados.map(item => {
//        const cells = cfg.colunas.map(c => {
//          const valor = item[c.campo];
//          return `<td>${c.render ? c.render(valor, item) : escaparHtml(valor ?? '—')}</td>`;
//        }).join('');
//        const id = Number(item.id);
//        return `
//          <tr data-id="${id}">
//            ${cells}
//            <td>
//              <div class="table-actions">
//                <button class="btn btn-sm btn-outline" type="button"
//                  aria-label="Editar registro ${id}" onclick="Cruds.editar('${id}')">Editar</button>
//                <button class="btn btn-sm btn-danger" type="button"
//                  aria-label="Inativar registro ${id}" onclick="Cruds.excluir('${id}')">Inativar</button>
//              </div>
//            </td>
//          </tr>
//        `;
//      }).join('');
//
//      container.innerHTML = `
//        <div class="table-wrapper">
//          <div class="table-header">
//            <div>
//              <h3>${escaparHtml(cfg.titulo)}</h3>
//              <p class="table-count">${dados.length} registros cadastrados</p>
//            </div>
//            <button class="btn btn-primary" type="button" onclick="Cruds.novo()">
//              <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true">
//                <path d="M12 5v14M5 12h14"/>
//              </svg>
//              Novo
//            </button>
//          </div>
//          <div class="table-scroll">
//            <table class="data-table">
//              <thead><tr>${headers}</tr></thead>
//              <tbody>${rows}</tbody>
//            </table>
//          </div>
//        </div>
//      `;
//    } catch (err) {
//      container.innerHTML = `<p class="crud-error">Erro ao carregar ${escaparHtml(cfg.titulo)}: ${escaparHtml(err.message)}</p>`;
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  // ═══════════════════════════════════════════════════════════
//  // MODAL (novo / editar)
//  // ═══════════════════════════════════════════════════════════
//  async function abrirFormulario(item = null) {
//    const cfg = CONFIG[State.configTab];
//    const titulo = item ? `Editar ${cfg.singular}` : `Novo ${cfg.singular}`;
//
//    const form = cfg.form.map(f => {
//      const valor = item ? (item[f.campo] ?? '') : '';
//      if (f.tipo === 'select') {
//        const opts = f.opcoes.map(o =>
//          `<option value="${escaparHtml(o)}" ${valor === o ? 'selected' : ''}>${escaparHtml(o)}</option>`
//        ).join('');
//        return `<div class="form-group">
//          <label for="form_${f.campo}">${escaparHtml(f.label)}${f.obrigatorio ? ' <span class="required">*</span>' : ''}</label>
//          <select id="form_${f.campo}" ${f.obrigatorio ? 'required aria-required="true"' : ''}>
//            <option value="">Selecione...</option>${opts}
//          </select>
//        </div>`;
//      }
//      if (f.tipo === 'select-fk') {
//        const fonte = f.fonte();
//        const opts = fonte.map(x =>
//          `<option value="${Number(x.id)}" ${Number(valor) === Number(x.id) ? 'selected' : ''}>
//            ${escaparHtml(x.nome)}
//          </option>`
//        ).join('');
//        return `<div class="form-group">
//          <label for="form_${f.campo}">${escaparHtml(f.label)}</label>
//          <select id="form_${f.campo}"><option value="">Nenhum</option>${opts}</select>
//        </div>`;
//      }
//      return `<div class="form-group">
//        <label for="form_${f.campo}">${escaparHtml(f.label)}${f.obrigatorio ? ' <span class="required">*</span>' : ''}</label>
//        <input type="${escaparHtml(f.tipo)}" id="form_${f.campo}"
//          value="${escaparHtml(valor)}" ${f.obrigatorio ? 'required aria-required="true"' : ''}>
//      </div>`;
//    }).join('');
//
//    UI.abrirModal(titulo, `
//      <form id="formCrud">
//        ${form}
//        <div class="form-actions">
//          <button class="btn btn-outline" type="button" onclick="UI.fecharModal()">Cancelar</button>
//          <button class="btn btn-primary" type="button" id="btnSalvarCRUD">${item ? 'Atualizar' : 'Cadastrar'}</button>
//        </div>
//      </form>
//    `);
//
//    document.getElementById('btnSalvarCRUD').onclick = () => {
//      if (document.getElementById('formCrud').reportValidity()) salvar(item?.id);
//    };
//  }
//
//  async function salvar(id = null) {
//    const cfg = CONFIG[State.configTab];
//    const dados = {};
//    for (const f of cfg.form) {
//      const el = document.getElementById(`form_${f.campo}`);
//      dados[f.campo] = el.value.trim() || null;
//    }
//
//    UI.loading('Salvando...');
//    try {
//      if (id) {
//        await Api.put(`${cfg.api}/${id}`, dados);
//        UI.toast('Atualizado!', 'success');
//      } else {
//        await Api.post(cfg.api, dados);
//        UI.toast('Cadastrado!', 'success');
//      }
//      UI.fecharModal();
//      await App.recarregarRefs();
//      renderizar();
//    } catch (err) {
//      UI.toast('Erro: ' + err.message, 'error');
//    } finally {
//      UI.esconderLoading();
//    }
//  }
//
//  async function editar(id) {
//    const cfg = CONFIG[State.configTab];
//    try {
//      const r = await Api.get(`${cfg.api}/${id}`);
//      abrirFormulario(r.data);
//    } catch (err) {
//      UI.toast('Erro: ' + err.message, 'error');
//    }
//  }
//
//  async function excluir(id) {
//    const cfg = CONFIG[State.configTab];
//    UI.confirmar(
//      'Confirmar exclusão',
//      'Deseja realmente excluir (inativar) este registro?',
//      async () => {
//        UI.loading('Excluindo...');
//        try {
//          await Api.del(`${cfg.api}/${id}`);
//          UI.toast('Excluído!', 'success');
//          await App.recarregarRefs();
//          renderizar();
//        } catch (err) {
//          UI.toast('Erro: ' + err.message, 'error');
//        } finally {
//          UI.esconderLoading();
//        }
//      }
//    );
//  }
//
//  function novo() { abrirFormulario(null); }
//
//  return { mudarTab, renderizar, novo, editar, excluir };
//})();
// ▲▲▲ ATE AQUI — D13-B02 ▲▲▲
// CHECKPOINT: apos D13-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
