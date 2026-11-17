// =============================================================
// logs.js — Módulo de auditoria
// =============================================================

window.Logs = (() => {

  async function carregar() {
    UI.loading('Carregando logs...');
    try {
      const acao = document.getElementById('logFilterAcao').value;
      const tabela = document.getElementById('logFilterTabela').value;
      const qs = new URLSearchParams({
        acao, tabela, pagina: State.logs.pagina, porPagina: State.logs.porPagina
      }).toString();

      const r = await Api.get(`/api/logs?${qs}`);
      State.logs.dados = r.dados;
      State.logs.paginacao = r.paginacao;
      renderizar();
    } catch (err) {
      UI.toast('Erro: ' + err.message, 'error');
    } finally {
      UI.esconderLoading();
    }
  }

  function renderizar() {
    const tbody = document.getElementById('logTableBody');
    if (State.logs.dados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:30px;color:#9CA3AF;">Nenhum log encontrado</td></tr>`;
    } else {
      tbody.innerHTML = State.logs.dados.map(l => `
        <tr>
          <td>${UI.formatarDataHora(l.data_hora)}</td>
          <td>${l.usuario}</td>
          <td>${l.acao}</td>
          <td>${l.tabela}</td>
          <td>${l.registro || '—'}</td>
        </tr>
      `).join('');
    }

    const p = State.logs.paginacao;
    document.getElementById('logInfo').textContent =
      p ? `Página ${p.pagina} de ${p.totalPaginas} (${p.total} registros)` : '—';
  }

  return { carregar, renderizar };
})();