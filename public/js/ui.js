// =============================================================
// ui.js — Componentes reutilizáveis de interface
// =============================================================
// O QUE ESTE ARQUIVO FAZ:
//   Toasts, loading, modal genérico, helpers de renderização.
//   Qualquer módulo pode chamar UI.toast(), UI.loading(), etc.
//
// CONCEITO APRENDIDO:
//   - Componentização: um mesmo componente (toast) reutilizado
//     em todos os módulos, sem duplicação de código.
//   - Helpers de formatação (data, badge de status).
// =============================================================

window.UI = (() => {

  // ═══════════════════════════════════════════════════════════
  // TOAST (notificação flutuante)
  // ═══════════════════════════════════════════════════════════
  function toast(mensagem, tipo = 'success') {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast ${tipo}`;

    const icones = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    el.innerHTML = `
      <span style="font-size: 20px;">${icones[tipo] || 'ℹ️'}</span>
      <span>${mensagem}</span>
    `;

    container.appendChild(el);

    setTimeout(() => {
      el.classList.add('hiding');
      setTimeout(() => el.remove(), 300);
    }, 4000);
  }

  // ═══════════════════════════════════════════════════════════
  // LOADING (overlay)
  // ═══════════════════════════════════════════════════════════
  function loading(mensagem = 'Carregando...') {
    document.getElementById('loadingMessage').textContent = mensagem;
    document.getElementById('loadingOverlay').classList.add('active');
  }

  function esconderLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
  }

  // ═══════════════════════════════════════════════════════════
  // MODAL genérico
  // ═══════════════════════════════════════════════════════════
  function abrirModal(titulo, corpoHtml) {
    document.getElementById('modalTitle').textContent = titulo;
    document.getElementById('modalBody').innerHTML = corpoHtml;
    document.getElementById('modalOverlay').classList.add('active');
  }

  function fecharModal() {
    document.getElementById('modalOverlay').classList.remove('active');
  }

  // ═══════════════════════════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════════════════════════
  function formatarDataBr(dataIso) {
    if (!dataIso) return '—';
    const [ano, mes, dia] = String(dataIso).split('-');
    if (!ano || !mes || !dia) return dataIso;
    return `${dia}/${mes}/${ano}`;
  }

  function formatarDataHora(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('pt-BR') + ' ' +
             d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch { return iso; }
  }

  function badgeStatus(status) {
    return `<span class="status-badge ${status}">${status}</span>`;
  }

  // ═══════════════════════════════════════════════════════════
  // CONFIRMAÇÃO (usa modal)
  // ═══════════════════════════════════════════════════════════
  function confirmar(titulo, mensagem, onConfirmar) {
    abrirModal(titulo, `
      <p style="margin-bottom: 20px;">${mensagem}</p>
      <div class="form-actions">
        <button class="btn btn-outline" onclick="UI.fecharModal()">Cancelar</button>
        <button class="btn btn-danger" id="btnConfirmarAcao">Confirmar</button>
      </div>
    `);
    document.getElementById('btnConfirmarAcao').onclick = () => {
      fecharModal();
      onConfirmar();
    };
  }

  // ── API pública ─────────────────────────────────────────────
  return {
    toast, loading, esconderLoading,
    abrirModal, fecharModal, confirmar,
    formatarDataBr, formatarDataHora, badgeStatus
  };
})();