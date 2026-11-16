// =============================================================
// api.js — Wrapper de fetch
// =============================================================
// O QUE ESTE ARQUIVO FAZ:
//   Centraliza todas as chamadas HTTP ao backend.
//   Todos os módulos usam Api.get/post/put/delete.
//
// CONCEITO APRENDIDO:
//   - DRY: em vez de repetir `fetch('/api/...')` em cada arquivo,
//     centralizamos num único lugar.
//   - Header X-Usuario vai automaticamente em toda requisição.
//   - Tratamento de erro padronizado.
// =============================================================

window.Api = (() => {

  // ── Requisição base ─────────────────────────────────────────
  async function request(metodo, url, body = null) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Usuario': window.State?.usuario?.nome || 'Sistema'
    };

    const opcoes = { method: metodo, headers };
    if (body) opcoes.body = JSON.stringify(body);

    const resp = await fetch(url, opcoes);
    const dados = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      const mensagem = dados.message || `Erro HTTP ${resp.status}`;
      throw new Error(mensagem);
    }

    return dados;
  }

  // ── API pública ─────────────────────────────────────────────
  return {
    get:  (url)         => request('GET', url),
    post: (url, body)   => request('POST', url, body),
    put:  (url, body)   => request('PUT', url, body),
    del:  (url)         => request('DELETE', url),
    patch:(url, body)   => request('PATCH', url, body)
  };
})();