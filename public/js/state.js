// =============================================================
// state.js — Estado global da aplicação
// =============================================================
// O QUE ESTE ARQUIVO FAZ:
//   Guarda as informações compartilhadas entre todos os módulos:
//   usuário logado, cache de dados de referência, filtros atuais.
//
// CONCEITO APRENDIDO:
//   - Estado global compartilhado entre módulos em JS puro
//     (mesmo princípio do Redux/Context do React, só que mais simples).
//   - Por que centralizar o usuário atual: todos os módulos precisam
//     enviá-lo no header X-Usuario das chamadas API.
// =============================================================

window.State = {
  // ── Usuário logado ─────────────────────────────────────────
  usuario: {
    nome: null,
    email: null
  },

  // ── Dados de referência (cacheados na inicialização) ───────
  refs: {
    medicamentos: [],
    tiposErro: [],
    setores: [],
    farmaceuticos: [],
    assistentes: [],
    usuarios: []
  },

  // ── Estado da tabela do dashboard ──────────────────────────
  dashboard: {
    dados: [],
    filtro: '',
    pagina: 1,
    porPagina: 10,
    paginacao: null
  },

  // ── Estado dos logs ────────────────────────────────────────
  logs: {
    dados: [],
    pagina: 1,
    porPagina: 50,
    paginacao: null
  },

  // ── Aba atual de configurações ─────────────────────────────
  configTab: 'medicamentos'
};