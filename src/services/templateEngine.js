// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 14 — PDF: MOTOR DE TEMPLATES
// ║ O QUE ESTE BLOCO FAZ: Interpreta placeholders e protege valores inseridos nos templates.
// ║ CONCEITO APRENDIDO: substituicao de templates e escape de HTML.
// ║ COMO TESTAR: Renderize um template com dados ficticios.
// ║ REQUER: D08-B01 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D14-B01 ▼▼▼
//// =============================================================
//// templateEngine.js — Mini-motor de templates
//// =============================================================
//// O QUE ESTE ARQUIVO FAZ:
////   Lê um template HTML com placeholders {{...}} e substitui
////   pelos dados. Suporta loops com {{#lista}}...{{/lista}}.
////
//// CONCEITO APRENDIDO:
////   - Como funciona um motor de template (o mesmo conceito do
////     Handlebars, EJS, Jinja, Mustache — só que minimalista).
////   - Por que separar lógica de apresentação (o template tem
////     HTML puro, o motor injeta os dados).
////   - Escapamento de HTML para prevenir XSS.
////
//// SINTAXE SUPORTADA:
////   {{campo}}                  → substitui pelo valor
////   {{campo.subcampo}}         → acesso aninhado
////   {{#lista}}...{{/lista}}    → repete o bloco para cada item
////   {{campo|safe}}             → NÃO escapa HTML (use com cuidado!)
//// =============================================================
//
///**
// * Escapa caracteres especiais de HTML.
// * Ex.: "<script>" → "&lt;script&gt;"
// */
//function escaparHtml(valor) {
//  if (valor === null || valor === undefined) return '';
//  return String(valor)
//    .replace(/&/g, '&amp;')
//    .replace(/</g, '&lt;')
//    .replace(/>/g, '&gt;')
//    .replace(/"/g, '&quot;')
//    .replace(/'/g, '&#39;');
//}
//
///**
// * Acessa uma propriedade aninhada: "a.b.c" → dados.a.b.c
// */
//function acessar(dados, caminho) {
//  return caminho.split('.').reduce((acc, key) => {
//    if (acc === null || acc === undefined) return undefined;
//    return acc[key];
//  }, dados);
//}
//
///**
// * Renderiza um template com os dados fornecidos.
// * @param {string} template - Conteúdo HTML com placeholders
// * @param {object} dados    - Objeto com os valores
// * @returns {string}        - HTML final
// */
//function render(template, dados) {
//  let resultado = template;
//
//  // ── 1. Processa loops {{#lista}}...{{/lista}} ──────────────
//  // Regex captura: {{#nomeLista}}  conteúdo  {{/nomeLista}}
//  const regexLoop = /{{#(\w+)}}([\s\S]*?){{\/\1}}/g;
//
//  resultado = resultado.replace(regexLoop, (match, nomeLista, corpo) => {
//    const lista = acessar(dados, nomeLista);
//    if (!Array.isArray(lista) || lista.length === 0) return '';
//    return lista.map(item => {
//      // Renderiza o corpo com os dados do item + o contexto pai
//      return render(corpo, { ...dados, ...item, item });
//    }).join('');
//  });
//
//  // ── 2. Processa condicionais simples {{#if campo}}...{{/if}} ──
//  const regexIf = /{{#if (\w+)}}([\s\S]*?){{\/if}}/g;
//  resultado = resultado.replace(regexIf, (match, campo, corpo) => {
//    const valor = acessar(dados, campo);
//    return valor ? render(corpo, dados) : '';
//  });
//
//  // ── 3. Substitui variáveis {{campo}} e {{campo|safe}} ──────
//  const regexVar = /{{([\w.]+)(\|safe)?}}/g;
//  resultado = resultado.replace(regexVar, (match, caminho, safeFlag) => {
//    const valor = acessar(dados, caminho);
//    if (valor === null || valor === undefined) return '';
//    return safeFlag ? String(valor) : escaparHtml(valor);
//  });
//
//  return resultado;
//}
//
//module.exports = { render, escaparHtml };
// ▲▲▲ ATE AQUI — D14-B01 ▲▲▲
// CHECKPOINT: apos D14-B01, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
