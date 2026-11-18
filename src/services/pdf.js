// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 14 — PDF: GERACAO E ROTAS
// ║ O QUE ESTE BLOCO FAZ: Gera relatorios e serve os endpoints de PDF.
// ║ CONCEITO APRENDIDO: Puppeteer, HTML para PDF e assets base64.
// ║ COMO TESTAR: Gere os tres relatorios com uma base ficticia.
// ║ REQUER: D07-B02, D08-B01, D09-B01/B02, D11-B02 e D14-B01 completos.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D14-B02 ▼▼▼
//// =============================================================
//// pdf.js (service) — Geração de PDFs com Puppeteer
//// =============================================================
//
//const fs = require('fs');
//const path = require('path');
//const puppeteer = require('puppeteer');
//
//const queriesOcorr = require('../db/queries/ocorrencias');
//const queriesFarm = require('../db/queries/farmaceuticos');
//const { calcularKPIs } = require('./kpis');
//const { calcularGraficos } = require('./graficos');
//const { render } = require('./templateEngine');
//const { formatarDataBr } = require('../utils/formatters');
//
//const ROOT = path.join(__dirname, '..', '..');
//const TEMPLATES_DIR = path.join(ROOT, 'templates');
//const OUTPUT_DIR = path.join(ROOT, 'output');
//
//if (!fs.existsSync(OUTPUT_DIR)) {
//  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
//}
//
//let browserInstance = null;
//let cacheLogos = null;
//
//// Lê as logos institucionais uma única vez e as prepara para o HTML do PDF.
//function carregarLogosBase64() {
//  if (cacheLogos) return cacheLogos;
//
//  const arquivos = {
//    funeas: 'funeas.png',
//    hriv: 'hriv.png',
//    parana: 'parana.png'
//  };
//  const logos = {};
//
//  for (const [chave, nomeArquivo] of Object.entries(arquivos)) {
//    try {
//      const imagem = fs.readFileSync(
//        path.join(TEMPLATES_DIR, 'assets', nomeArquivo)
//      );
//      logos[chave] = `data:image/png;base64,${imagem.toString('base64')}`;
//    } catch (erro) {
//      console.warn(`Logo ${nomeArquivo} indisponível: ${erro.message}`);
//      logos[chave] = '';
//    }
//  }
//
//  cacheLogos = logos;
//  return cacheLogos;
//}
//
//async function getBrowser() {
//  if (!browserInstance) {
//    browserInstance = await puppeteer.launch({
//      headless: 'new',
//      args: ['--no-sandbox', '--disable-setuid-sandbox']
//    });
//  }
//  return browserInstance;
//}
//
//async function gerarPdfDeHtml(html, nomeArquivo) {
//  const browser = await getBrowser();
//  const page = await browser.newPage();
//  try {
//    await page.setContent(html, { waitUntil: 'networkidle0' });
//    const caminhoCompleto = path.join(OUTPUT_DIR, nomeArquivo);
//    await page.pdf({
//      path: caminhoCompleto,
//      format: 'A4',
//      printBackground: true,
//      // O serviço é a fonte única das margens; os templates só definem A4.
//      margin: { top: '1.5cm', bottom: '1.5cm', left: '2cm', right: '2cm' }
//    });
//    return nomeArquivo;
//  } finally {
//    await page.close();
//  }
//}
//
//// ── Helper: enriquece listas de ranking com item_index e percentual ──
//function enriquecerRanking(lista) {
//  const total = lista.reduce((s, i) => s + i.valor, 0) || 1;
//  return lista.map((item, idx) => ({
//    ...item,
//    item_index: idx + 1,
//    percentual: Math.round((item.valor / total) * 100)
//  }));
//}
//
//// ═══════════════════════════════════════════════════════════════
//// PDF 1: Individual
//// ═══════════════════════════════════════════════════════════════
//async function gerarIndividual(idOcorrencia) {
//  const ocorrencia = queriesOcorr.buscarPorId(idOcorrencia);
//  if (!ocorrencia) throw new Error('Ocorrência não encontrada.');
//
//  const logos = carregarLogosBase64();
//  const dados = {
//    ...ocorrencia,
//    // As imagens em disco são injetadas como data URI para o Chromium.
//    logo_funeas: logos.funeas,
//    logo_hriv: logos.hriv,
//    logo_parana: logos.parana,
//    data_ocorrencia_br: formatarDataBr(ocorrencia.data_ocorrencia),
//    data_emissao_br: formatarDataBr(new Date().toISOString().split('T')[0]),
//    quantidade_dispensada: ocorrencia.quantidade_dispensada === null
//      ? 'Não dispensado'
//      : ocorrencia.quantidade_dispensada,
//    hora_prescricao: ocorrencia.hora_prescricao || '—',
//    hora_dispensacao: ocorrencia.hora_dispensacao || '—',
//    diferenca_minutos: ocorrencia.diferenca_minutos === null
//      ? '—'
//      : `${ocorrencia.diferenca_minutos} min`,
//    assistente_nome: ocorrencia.assistente_nome || 'Não se aplica',
//    observacoes: ocorrencia.observacoes || '',
//    classificacao_horario_class: (() => {
//      switch (ocorrencia.classificacao_horario) {
//        case 'Atrasada': return 'atrasada';
//        case 'Antecipada': return 'antecipada';
//        case 'No horário': return 'no-horario';
//        default: return '';
//      }
//    })()
//  };
//
//  const template = fs.readFileSync(
//    path.join(TEMPLATES_DIR, 'ocorrencia-individual.html'),
//    'utf8'
//  );
//  const html = render(template, dados);
//
//  const nomeArquivo = `Ocorrencia_${ocorrencia.codigo}.pdf`;
//  await gerarPdfDeHtml(html, nomeArquivo);
//  return { nomeArquivo, caminho: `/output/${nomeArquivo}` };
//}
//
//// ═══════════════════════════════════════════════════════════════
//// PDF 2: Por Farmacêutico
//// ═══════════════════════════════════════════════════════════════
//async function gerarFarmaceutico(idFarmaceutico, filtros = {}) {
//  const farmaceutico = queriesFarm.buscarPorId(idFarmaceutico);
//  if (!farmaceutico) throw new Error('Farmacêutico não encontrado.');
//
//  const resultado = queriesOcorr.listarTodasParaCalculo({
//    ...filtros,
//    farmaceutico_id: idFarmaceutico,
//    status: 'todas'
//  });
//
//  const kpis = calcularKPIs(resultado, resultado);
//
//  const logos = carregarLogosBase64();
//  const dados = {
//    // As imagens em disco são injetadas como data URI para o Chromium.
//    logo_funeas: logos.funeas,
//    logo_hriv: logos.hriv,
//    logo_parana: logos.parana,
//    farmaceutico_nome: farmaceutico.nome,
//    periodo: `${formatarDataBr(filtros.periodoInicio) || '—'} a ${formatarDataBr(filtros.periodoFim) || '—'}`,
//    total: resultado.length,
//    ativas: kpis.statusResumo.ativas,
//    concluidas: kpis.statusResumo.concluidas,
//    tipo_mais_frequente: kpis.tipoErroMaisFrequente.tipo,
//    data_emissao_br: formatarDataBr(new Date().toISOString().split('T')[0]),
//    ocorrencias: resultado.map(o => ({
//      ...o,
//      data_br: formatarDataBr(o.data_ocorrencia),
//      quantidade_dispensada: o.quantidade_dispensada === null ? '—' : o.quantidade_dispensada
//    }))
//  };
//
//  const template = fs.readFileSync(
//    path.join(TEMPLATES_DIR, 'relatorio-farmaceutico.html'),
//    'utf8'
//  );
//  const html = render(template, dados);
//
//  const nomeArquivo = `Relatorio_${farmaceutico.nome.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
//  await gerarPdfDeHtml(html, nomeArquivo);
//  return { nomeArquivo, caminho: `/output/${nomeArquivo}` };
//}
//
//// ═══════════════════════════════════════════════════════════════
//// PDF 3: Gerencial
//// ═══════════════════════════════════════════════════════════════
//async function gerarGerencial(filtros = {}) {
//  const resultado = queriesOcorr.listarTodasParaCalculo({
//    ...filtros,
//    status: 'todas'
//  });
//
//  const kpis = calcularKPIs(resultado, resultado);
//  const graficos = calcularGraficos(resultado);
//
//  const logos = carregarLogosBase64();
//  const dados = {
//    // As imagens em disco são injetadas como data URI para o Chromium.
//    logo_funeas: logos.funeas,
//    logo_hriv: logos.hriv,
//    logo_parana: logos.parana,
//    periodo: `${formatarDataBr(filtros.periodoInicio) || '—'} a ${formatarDataBr(filtros.periodoFim) || '—'}`,
//    data_emissao_br: formatarDataBr(new Date().toISOString().split('T')[0]),
//    total: kpis.total,
//    ativas: kpis.statusResumo.ativas,
//    concluidas: kpis.statusResumo.concluidas,
//    percentual_ativas: kpis.statusResumo.percentualAtivas,
//    percentual_concluidas: kpis.statusResumo.percentualConcluidas,
//    setor_mais_frequente: kpis.setorMaisFrequente.setor,
//    setor_mais_frequente_qtd: kpis.setorMaisFrequente.total,
//    plantao_maior: kpis.plantaoMaior.plantao,
//    plantao_maior_qtd: kpis.plantaoMaior.total,
//    tipo_mais_frequente: kpis.tipoErroMaisFrequente.tipo,
//    tipo_mais_frequente_qtd: kpis.tipoErroMaisFrequente.total,
//    medicamento_mais_envolvido: kpis.medicamentoMaisEnvolvido.medicamento,
//    medicamento_mais_envolvido_qtd: kpis.medicamentoMaisEnvolvido.total,
//    topTiposErro: enriquecerRanking(graficos.porTipoErro.slice(0, 10)),
//    topSetores: enriquecerRanking(graficos.porSetor.slice(0, 10)),
//    topMedicamentos: enriquecerRanking(graficos.porMedicamento.slice(0, 10)),
//    topPlantoes: graficos.porPlantao
//  };
//
//  const template = fs.readFileSync(
//    path.join(TEMPLATES_DIR, 'relatorio-gerencial.html'),
//    'utf8'
//  );
//  const html = render(template, dados);
//
//  const nomeArquivo = `Relatorio_Gerencial_${Date.now()}.pdf`;
//  await gerarPdfDeHtml(html, nomeArquivo);
//  return { nomeArquivo, caminho: `/output/${nomeArquivo}` };
//}
//
//process.on('SIGINT', async () => {
//  if (browserInstance) await browserInstance.close();
//  process.exit(0);
//});
//
//module.exports = { gerarIndividual, gerarFarmaceutico, gerarGerencial };
// ▲▲▲ ATE AQUI — D14-B02 ▲▲▲
// CHECKPOINT: apos D14-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
