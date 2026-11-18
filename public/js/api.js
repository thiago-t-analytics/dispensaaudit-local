// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 11 — FRONTEND: ESTADO, API E INTERFACE
// ║ O QUE ESTE BLOCO FAZ: Prepara estado da sessao, chamadas HTTP e utilitarios visuais.
// ║ CONCEITO APRENDIDO: fetch, estado compartilhado e manipulacao de DOM.
// ║ COMO TESTAR: Abra o console e confirme inicializacao sem erro.
// ║ REQUER: Dia 10 e backend ate o Dia 09.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D11-B01 ▼▼▼
//// =============================================================
//// api.js — Wrapper de fetch
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Centraliza todas as chamadas HTTP ao backend.
////   Todos os módulos usam Api.get/post/put/delete.
////
//// CONCEITO APRENDIDO:
////   - DRY: em vez de repetir `fetch('/api/...')` em cada arquivo,
////     centralizamos num único lugar.
////   - Header X-Usuario vai automaticamente em toda requisição.
////   - Tratamento de erro padronizado.
//// =============================================================
//
//window.Api = (() => {
//
//  // ── Requisição base ─────────────────────────────────────────
//  async function request(metodo, url, body = null) {
//    const headers = {
//      'Content-Type': 'application/json',
//      'X-Usuario': window.State?.usuario?.nome || 'Sistema'
//    };
//
//    const opcoes = { method: metodo, headers };
//    if (body) opcoes.body = JSON.stringify(body);
//
//    const resp = await fetch(url, opcoes);
//    const dados = await resp.json().catch(() => ({}));
//
//    if (!resp.ok) {
//      const mensagem = dados.message || `Erro HTTP ${resp.status}`;
//      throw new Error(mensagem);
//    }
//
//    return dados;
//  }
//
//  // ── API pública ─────────────────────────────────────────────
//  return {
//    get:  (url)         => request('GET', url),
//    post: (url, body)   => request('POST', url, body),
//    put:  (url, body)   => request('PUT', url, body),
//    del:  (url)         => request('DELETE', url),
//    patch:(url, body)   => request('PATCH', url, body)
//  };
//})();
// ▲▲▲ ATE AQUI — D11-B01 ▲▲▲
// CHECKPOINT: apos D11-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
