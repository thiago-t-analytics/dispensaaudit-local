// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 11 — FRONTEND: ESTADO, API E INTERFACE
// ║ O QUE ESTE BLOCO FAZ: Prepara estado da sessao, chamadas HTTP e utilitarios visuais.
// ║ CONCEITO APRENDIDO: fetch, estado compartilhado e manipulacao de DOM.
// ║ COMO TESTAR: Abra o console e confirme inicializacao sem erro.
// ║ REQUER: Dia 10 e backend ate o Dia 09.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D11-B01 ▼▼▼
//// =============================================================
//// state.js — Estado global da aplicação
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Guarda as informações compartilhadas entre todos os módulos:
////   identidade local padrão, cache de dados de referência, filtros atuais.
////
//// CONCEITO APRENDIDO:
////   - Estado global compartilhado entre módulos em JS puro
////     (mesmo princípio do Redux/Context do React, só que mais simples).
////   - Por que centralizar o usuário atual: todos os módulos precisam
////     enviá-lo no header X-Usuario das chamadas API.
//// =============================================================
//
//window.State = {
//  // ── Identidade padrão da instalação local (sem tela de login) ──
//  usuario: {
//    nome: 'Sistema',
//    email: null
//  },
//
//  // ── Dados de referência (cacheados na inicialização) ───────
//  refs: {
//    medicamentos: [],
//    tiposErro: [],
//    setores: [],
//    farmaceuticos: [],
//    assistentes: [],
//    usuarios: []
//  },
//
//  // ── Estado dos filtros de gráfico do dashboard ────────────
//  dashboard: {
//    filtrosGrafico: {}
//  },
//
//  // ── Estado temporário do lançamento em lote ─────────────────
//  ocorrenciasLote: {
//    etapa: 1,
//    itens: [],
//    indiceEdicao: null
//  },
//
//  // ── Estado dos logs ────────────────────────────────────────
//  logs: {
//    dados: [],
//    pagina: 1,
//    porPagina: 20,
//    paginacao: null
//  },
//
//  // ── Aba atual de configurações ─────────────────────────────
//  configTab: 'medicamentos'
//};
// ▲▲▲ ATE AQUI — D11-B01 ▲▲▲
// CHECKPOINT: apos D11-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
