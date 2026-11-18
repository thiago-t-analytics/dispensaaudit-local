// ╔══════════════════════════════════════════════════════════════╗
// ║ 🎓 DIA 12 — FRONTEND: GRAFICOS
// ║ O QUE ESTE BLOCO FAZ: Desenha graficos em Canvas e liga interacao de clique e hover.
// ║ CONCEITO APRENDIDO: Canvas, eventos, responsividade e acessibilidade.
// ║ COMO TESTAR: Redimensione e clique numa barra para filtrar.
// ║ REQUER: D12-B01 completo.
// ╚══════════════════════════════════════════════════════════════╝
// ▼▼▼ DESCOMENTE DAQUI — D12-B02 ▼▼▼
//// =============================================================
//// charts.js — Gráficos Canvas internos, sem bibliotecas externas
//// O que faz: desenha barras, rosca, linha e barras empilhadas em Canvas 2D.
//// Por que existe: mantém gráficos rápidos e interativos sem adicionar dependências.
//// Teste visual: use os seis gráficos do Dashboard; clique em uma categoria,
//// redimensione a janela e confira legenda acessível, tooltip e estado vazio.
//// =============================================================
//
//window.Chart = (() => {
//  const PALETA = [
//    '#0EA5E9', '#10B981', '#F59E0B', '#EF4444',
//    '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
//  ];
//  const instancias = new Set();
//  let temporizadorRedimensionamento = null;
//  let ouvinteRedimensionamentoInstalado = false;
//
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
//  function normalizar(dados) {
//    return Array.isArray(dados) ? dados.map(item => {
//      const valores = item.valores || {};
//      const valor = item.valor === undefined
//        ? Object.values(valores).reduce((soma, atual) => soma + (Number(atual) || 0), 0)
//        : Number(item.valor) || 0;
//      return {
//        ...item,
//        nome: String(item.nome ?? item.data ?? 'Não informado'),
//        valor
//      };
//    }) : [];
//  }
//
//  function escurecerHex(cor) {
//    const partes = cor.match(/^#([0-9a-f]{6})$/i);
//    if (!partes) return cor;
//    const valor = Number.parseInt(partes[1], 16);
//    const vermelho = Math.round(((valor >> 16) & 255) * 0.78);
//    const verde = Math.round(((valor >> 8) & 255) * 0.78);
//    const azul = Math.round((valor & 255) * 0.78);
//    return `rgb(${vermelho}, ${verde}, ${azul})`;
//  }
//
//  function instalarRedimensionamento() {
//    if (ouvinteRedimensionamentoInstalado) return;
//    ouvinteRedimensionamentoInstalado = true;
//    window.addEventListener('resize', () => {
//      window.clearTimeout(temporizadorRedimensionamento);
//      temporizadorRedimensionamento = window.setTimeout(() => {
//        instancias.forEach(instancia => instancia.desenhar(false));
//      }, 200);
//    });
//  }
//
//  function criar(container, dados, opcoes, tipo) {
//    const config = { ...opcoes };
//    let itens = normalizar(dados);
//    let indiceHover = -1;
//    let geometria = [];
//    let total = 0;
//    const canvas = document.createElement('canvas');
//    const contexto = canvas.getContext('2d');
//    const tooltip = document.createElement('div');
//    const vazio = document.createElement('div');
//    const legenda = document.createElement('div');
//
//    container.replaceChildren();
//    container.classList.add('chart-visualization');
//    canvas.className = 'chart-canvas';
//    canvas.setAttribute('role', 'img');
//    canvas.setAttribute('aria-label', config.titulo || 'Gráfico');
//    tooltip.className = 'chart-tooltip';
//    tooltip.setAttribute('role', 'status');
//    tooltip.hidden = true;
//    vazio.className = 'chart-empty';
//    vazio.hidden = true;
//    vazio.innerHTML = `
//      <svg viewBox="0 0 64 48" aria-hidden="true">
//        <path d="M7 39h50M12 35V23h8v12m7 0V12h8v23m7 0V18h8v17"
//          fill="none" stroke="currentColor" stroke-linecap="round"
//          stroke-linejoin="round" stroke-width="2"/>
//        <path d="m9 10 5 5m0-5-5 5" fill="none" stroke="currentColor"
//          stroke-linecap="round" stroke-width="2"/>
//      </svg>
//      <span>Sem dados para este filtro</span>`;
//    legenda.className = 'chart-legend';
//    container.append(canvas, vazio, tooltip, legenda);
//
//    function atualizarLegenda() {
//      legenda.replaceChildren();
//      legenda.hidden = !itens.length;
//      total = itens.reduce((soma, item) => soma + Math.max(0, item.valor), 0);
//
//      itens.forEach((item, indice) => {
//        const botao = document.createElement('button');
//        const marcador = document.createElement('span');
//        const texto = document.createElement('span');
//        const percentual = total ? Math.round((item.valor / total) * 100) : 0;
//        botao.className = 'chart-legend-item';
//        botao.type = 'button';
//        botao.setAttribute('aria-label',
//          `${item.nome}: ${item.valor} (${percentual}%). Filtrar gráfico`);
//        marcador.className = 'chart-legend-dot';
//        marcador.style.backgroundColor = corDo(indice);
//        texto.textContent = `${item.nome} (${item.valor})`;
//        botao.append(marcador, texto);
//        botao.addEventListener('click', () => selecionar(indice));
//        legenda.appendChild(botao);
//      });
//    }
//
//    function corDo(indice) {
//      return (config.corPaleta || PALETA)[indice % (config.corPaleta || PALETA).length];
//    }
//
//    function selecionar(indice) {
//      if (itens[indice] && typeof config.onClick === 'function') {
//        config.onClick(itens[indice]);
//      }
//    }
//
//    function desenharBarraArredondada(ctx, x, y, largura, altura, raio) {
//      const topo = Math.min(raio, largura / 2, altura);
//      ctx.beginPath();
//      ctx.moveTo(x, y + altura);
//      ctx.lineTo(x, y + topo);
//      ctx.quadraticCurveTo(x, y, x + topo, y);
//      ctx.lineTo(x + largura - topo, y);
//      ctx.quadraticCurveTo(x + largura, y, x + largura, y + topo);
//      ctx.lineTo(x + largura, y + altura);
//      ctx.closePath();
//      ctx.fill();
//    }
//
//    function prepararTela(ctx, largura, altura) {
//      ctx.clearRect(0, 0, largura, altura);
//      ctx.font = '12px system-ui, sans-serif';
//      ctx.textBaseline = 'middle';
//      ctx.fillStyle = '#78716C';
//      ctx.strokeStyle = 'rgba(120, 113, 108, 0.16)';
//      ctx.lineWidth = 1;
//    }
//
//    function desenharGrade(ctx, area, maximo, passos = 4) {
//      for (let passo = 0; passo <= passos; passo++) {
//        const y = area.top + (area.height * passo / passos);
//        const valor = Math.round(maximo * (passos - passo) / passos);
//        ctx.beginPath();
//        ctx.moveTo(area.left, y);
//        ctx.lineTo(area.left + area.width, y);
//        ctx.stroke();
//        ctx.textAlign = 'right';
//        ctx.fillText(String(valor), area.left - 8, y);
//      }
//    }
//
//    function opacidadeDo(indice) {
//      if (!config.filtroAtivo) return 1;
//      return itens[indice]?.nome === config.filtroAtivo ? 1 : 0.4;
//    }
//
//    function desenharBarras(ctx, largura, altura, progresso) {
//      const margem = { top: 16, right: 12, bottom: 56, left: 40 };
//      const area = {
//        left: margem.left,
//        top: margem.top,
//        width: Math.max(1, largura - margem.left - margem.right),
//        height: Math.max(1, altura - margem.top - margem.bottom)
//      };
//      const maximo = Math.max(1, ...itens.map(item => item.valor));
//      const passo = area.width / Math.max(1, itens.length);
//      const larguraBarra = Math.max(4, Math.min(42, passo * 0.62));
//      geometria = [];
//      desenharGrade(ctx, area, maximo);
//
//      itens.forEach((item, indice) => {
//        const valor = Math.max(0, item.valor);
//        const alturaBase = (valor / maximo) * area.height;
//        const alturaBarra = Math.max(0, alturaBase * progresso) + (indice === indiceHover ? 3 : 0);
//        const x = area.left + passo * indice + (passo - larguraBarra) / 2;
//        const y = area.top + area.height - alturaBarra;
//        const cor = corDo(indice);
//        ctx.save();
//        ctx.globalAlpha = opacidadeDo(indice);
//        if (indice === indiceHover) {
//          ctx.shadowColor = `${cor}66`;
//          ctx.shadowBlur = 12;
//          ctx.shadowOffsetY = 2;
//        }
//        const gradiente = ctx.createLinearGradient(0, y, 0, y + alturaBarra);
//        gradiente.addColorStop(0, cor);
//        gradiente.addColorStop(1, escurecerHex(cor));
//        ctx.fillStyle = gradiente;
//        desenharBarraArredondada(ctx, x, y, larguraBarra, alturaBarra, 6);
//        if (config.filtroAtivo && item.nome === config.filtroAtivo) {
//          ctx.setLineDash([4, 3]);
//          ctx.lineWidth = 2;
//          ctx.strokeStyle = '#F59E0B';
//          ctx.stroke();
//          ctx.setLineDash([]);
//        }
//        ctx.restore();
//
//        const rotacionar = itens.length > 4;
//        ctx.save();
//        ctx.globalAlpha = 1;
//        ctx.fillStyle = '#57534E';
//        ctx.textAlign = rotacionar ? 'right' : 'center';
//        ctx.translate(x + larguraBarra / 2, area.top + area.height + 12);
//        if (rotacionar) ctx.rotate(-Math.PI / 5);
//        const rotulo = item.nome.length > 18 ? `${item.nome.slice(0, 17)}…` : item.nome;
//        ctx.fillText(rotulo, 0, 0, rotacionar ? 110 : passo);
//        ctx.restore();
//        geometria.push({ tipo: 'barra', x, y, largura: larguraBarra, altura: alturaBarra, indice });
//      });
//    }
//
//    function desenharRosca(ctx, largura, altura, progresso) {
//      const raio = Math.max(8, Math.min(largura, altura) * 0.34);
//      const interno = raio * 0.58;
//      const centro = { x: largura / 2, y: altura / 2 };
//      let angulo = -Math.PI / 2;
//      geometria = [];
//
//      if (!total) return;
//      itens.forEach((item, indice) => {
//        const fatia = (Math.max(0, item.valor) / total) * Math.PI * 2 * progresso;
//        const inicio = angulo;
//        const fim = angulo + fatia;
//        ctx.save();
//        ctx.globalAlpha = opacidadeDo(indice);
//        ctx.beginPath();
//        ctx.arc(centro.x, centro.y, raio, inicio, fim);
//        ctx.arc(centro.x, centro.y, interno, fim, inicio, true);
//        ctx.closePath();
//        ctx.fillStyle = corDo(indice);
//        if (indice === indiceHover) {
//          ctx.shadowColor = `${corDo(indice)}66`;
//          ctx.shadowBlur = 12;
//        }
//        ctx.fill();
//        ctx.restore();
//        geometria.push({ tipo: 'fatia', inicio, fim, centro, raio, interno, indice });
//        angulo = fim;
//      });
//      ctx.fillStyle = '#1C1917';
//      ctx.font = '700 20px system-ui, sans-serif';
//      ctx.textAlign = 'center';
//      ctx.fillText(String(total), centro.x, centro.y);
//    }
//
//    function desenharLinha(ctx, largura, altura, progresso) {
//      const margem = { top: 16, right: 14, bottom: 42, left: 40 };
//      const area = {
//        left: margem.left,
//        top: margem.top,
//        width: Math.max(1, largura - margem.left - margem.right),
//        height: Math.max(1, altura - margem.top - margem.bottom)
//      };
//      const maximo = Math.max(1, ...itens.map(item => item.valor));
//      const passo = area.width / Math.max(1, itens.length - 1);
//      geometria = [];
//      desenharGrade(ctx, area, maximo);
//      ctx.beginPath();
//      itens.forEach((item, indice) => {
//        const ponto = {
//          x: area.left + (itens.length === 1 ? area.width / 2 : passo * indice),
//          y: area.top + area.height - (item.valor / maximo) * area.height * progresso
//        };
//        if (indice === 0) ctx.moveTo(ponto.x, ponto.y);
//        else ctx.lineTo(ponto.x, ponto.y);
//        geometria.push({ tipo: 'ponto', ...ponto, raio: 7, indice });
//      });
//      ctx.strokeStyle = corDo(0);
//      ctx.lineWidth = 3;
//      ctx.lineCap = 'round';
//      ctx.lineJoin = 'round';
//      ctx.stroke();
//
//      geometria.forEach(ponto => {
//        ctx.beginPath();
//        ctx.arc(ponto.x, ponto.y, ponto.indice === indiceHover ? 6 : 4, 0, Math.PI * 2);
//        ctx.fillStyle = '#ffffff';
//        ctx.fill();
//        ctx.strokeStyle = corDo(0);
//        ctx.lineWidth = 2;
//        ctx.stroke();
//        ctx.fillStyle = '#57534E';
//        ctx.font = '11px system-ui, sans-serif';
//        ctx.textAlign = 'center';
//        const data = ponto.indice;
//        const rotulo = itens[data].nome.slice(5).replace('-', '/');
//        if (itens.length <= 8 || data % Math.ceil(itens.length / 8) === 0) {
//          ctx.fillText(rotulo, ponto.x, area.top + area.height + 18);
//        }
//      });
//    }
//
//    function desenharEmpilhadas(ctx, largura, altura, progresso) {
//      const serieKeys = config.series || Object.keys(itens[0]?.valores || {});
//      if (!serieKeys.length) return desenharBarras(ctx, largura, altura, progresso);
//      const totais = itens.map(item => serieKeys.reduce((soma, chave) =>
//        soma + (Number(item.valores?.[chave]) || 0), 0));
//      const margem = { top: 16, right: 12, bottom: 48, left: 40 };
//      const area = {
//        left: margem.left,
//        top: margem.top,
//        width: Math.max(1, largura - margem.left - margem.right),
//        height: Math.max(1, altura - margem.top - margem.bottom)
//      };
//      const maximo = Math.max(1, ...totais);
//      const passo = area.width / Math.max(1, itens.length);
//      const larguraBarra = Math.max(4, Math.min(42, passo * 0.62));
//      geometria = [];
//      desenharGrade(ctx, area, maximo);
//      itens.forEach((item, indice) => {
//        let topo = area.top + area.height;
//        const x = area.left + passo * indice + (passo - larguraBarra) / 2;
//        serieKeys.forEach((chave, serieIndice) => {
//          const valor = Number(item.valores?.[chave]) || 0;
//          const segmento = (valor / maximo) * area.height * progresso;
//          topo -= segmento;
//          ctx.fillStyle = corDo(serieIndice);
//          desenharBarraArredondada(ctx, x, topo, larguraBarra, segmento, 3);
//          geometria.push({ tipo: 'barra', x, y: topo, largura: larguraBarra,
//            altura: segmento, indice });
//        });
//        ctx.fillStyle = '#57534E';
//        ctx.textAlign = 'center';
//        ctx.fillText(item.nome.slice(0, 12), x + larguraBarra / 2, area.top + area.height + 18);
//      });
//    }
//
//    function itemNoPonto(x, y) {
//      if (tipo === 'donut') {
//        const fatia = geometria.find(area => {
//          const dx = x - area.centro.x;
//          const dy = y - area.centro.y;
//          const distancia = Math.sqrt(dx * dx + dy * dy);
//          let angulo = Math.atan2(dy, dx);
//          if (angulo < 0) angulo += Math.PI * 2;
//          const inicio = (area.inicio + Math.PI * 2) % (Math.PI * 2);
//          const fim = (area.fim + Math.PI * 2) % (Math.PI * 2);
//          const dentroDaFatia = fim < inicio
//            ? angulo >= inicio || angulo <= fim
//            : angulo >= inicio && angulo <= fim;
//          return distancia >= area.interno && distancia <= area.raio &&
//            dentroDaFatia;
//        });
//        return fatia?.indice ?? -1;
//      }
//      const area = geometria.find(item => tipo === 'line'
//        ? Math.hypot(x - item.x, y - item.y) <= item.raio + 4
//        : x >= item.x && x <= item.x + item.largura && y >= item.y && y <= item.y + item.altura);
//      return area?.indice ?? -1;
//    }
//
//    function mostrarTooltip(indice, evento) {
//      if (indice < 0 || !itens[indice]) {
//        tooltip.hidden = true;
//        return;
//      }
//      const item = itens[indice];
//      const percentual = total ? Math.round((item.valor / total) * 100) : 0;
//      tooltip.innerHTML = `<strong>${escaparHtml(item.nome)}</strong>
//        <span>${item.valor} ocorrências · ${percentual}%</span>`;
//      const retangulo = container.getBoundingClientRect();
//      tooltip.style.left = `${Math.max(4, Math.min(retangulo.width - 190,
//        evento.clientX - retangulo.left + 12))}px`;
//      tooltip.style.top = `${Math.max(4, evento.clientY - retangulo.top - 48)}px`;
//      tooltip.hidden = false;
//    }
//
//    function desenhar(animar = true) {
//      const largura = container.clientWidth;
//      const altura = container.clientHeight;
//      if (!largura || !altura) return;
//
//      const proporcao = window.devicePixelRatio || 1;
//      canvas.width = Math.round(largura * proporcao);
//      canvas.height = Math.round(altura * proporcao);
//      const ctx = canvas.getContext('2d');
//      ctx.setTransform(proporcao, 0, 0, proporcao, 0, 0);
//      canvas.style.width = `${largura}px`;
//      canvas.style.height = `${altura}px`;
//
//      const semDados = !itens.length || total === 0;
//      canvas.hidden = semDados;
//      vazio.hidden = !semDados;
//      if (semDados) {
//        legenda.hidden = true;
//        return;
//      }
//      atualizarLegenda();
//
//      const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
//      const inicio = performance.now();
//      const duracao = tipo === 'bar' || tipo === 'stackedBar' ? 300 : 320;
//      function quadro(agora) {
//        const progressoBruto = animar && !reduzirMovimento
//          ? Math.min(1, (agora - inicio) / duracao)
//          : 1;
//        const progresso = 1 - Math.pow(1 - progressoBruto, 3);
//        prepararTela(ctx, largura, altura);
//        if (tipo === 'bar') desenharBarras(ctx, largura, altura, progresso);
//        if (tipo === 'donut') desenharRosca(ctx, largura, altura, progresso);
//        if (tipo === 'line') desenharLinha(ctx, largura, altura, progresso);
//        if (tipo === 'stackedBar') desenharEmpilhadas(ctx, largura, altura, progresso);
//        if (progressoBruto < 1) window.requestAnimationFrame(quadro);
//      }
//      window.requestAnimationFrame(quadro);
//    }
//
//    canvas.addEventListener('pointermove', evento => {
//      const retangulo = canvas.getBoundingClientRect();
//      const escalaX = canvas.width ? canvas.clientWidth / canvas.width : 1;
//      const escalaY = canvas.height ? canvas.clientHeight / canvas.height : 1;
//      const x = (evento.clientX - retangulo.left) / escalaX / (window.devicePixelRatio || 1);
//      const y = (evento.clientY - retangulo.top) / escalaY / (window.devicePixelRatio || 1);
//      const indice = itemNoPonto(x, y);
//      if (indice !== indiceHover) {
//        indiceHover = indice;
//        desenhar(false);
//      }
//      canvas.style.cursor = indice >= 0 ? 'pointer' : 'default';
//      mostrarTooltip(indice, evento);
//    });
//    canvas.addEventListener('pointerleave', () => {
//      indiceHover = -1;
//      tooltip.hidden = true;
//      desenhar(false);
//    });
//    canvas.addEventListener('click', evento => {
//      const retangulo = canvas.getBoundingClientRect();
//      const x = evento.clientX - retangulo.left;
//      const y = evento.clientY - retangulo.top;
//      selecionar(itemNoPonto(x, y));
//    });
//
//    instalarRedimensionamento();
//    const instancia = {
//      desenhar,
//      atualizar(novosDados, novasOpcoes = {}) {
//        if (Object.prototype.hasOwnProperty.call(novasOpcoes, 'filtroAtivo')) {
//          config.filtroAtivo = novasOpcoes.filtroAtivo;
//        }
//        config.onClick = novasOpcoes.onClick || config.onClick;
//        itens = normalizar(novosDados);
//        indiceHover = -1;
//        tooltip.hidden = true;
//        atualizarLegenda();
//        desenhar(true);
//      }
//    };
//    instancias.add(instancia);
//    atualizarLegenda();
//    desenhar(true);
//    return instancia;
//  }
//
//  return {
//    bar: (container, dados, opcoes = {}) => criar(container, dados, opcoes, 'bar'),
//    donut: (container, dados, opcoes = {}) => criar(container, dados, opcoes, 'donut'),
//    line: (container, dados, opcoes = {}) => criar(container, dados, opcoes, 'line'),
//    stackedBar: (container, dados, opcoes = {}) => criar(container, dados, opcoes, 'stackedBar')
//  };
//})();
// ▲▲▲ ATE AQUI — D12-B02 ▲▲▲
// CHECKPOINT: apos D12-B02, este modulo fica disponivel; mantenha os pre-requisitos listados acima.
