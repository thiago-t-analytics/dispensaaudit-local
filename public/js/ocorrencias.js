// =============================================================
// ocorrencias.js — Formulário de ocorrências
// =============================================================

window.Ocorrencias = (() => {

  async function inicializar() {
    // Popula selects a partir do State.refs
    preencherSelect('ocMedicamento', State.refs.medicamentos, 'id', 'nome');
    preencherSelect('ocTipoErro', State.refs.tiposErro, 'id', 'descricao');
    preencherSelect('ocSetor', State.refs.setores, 'id', 'nome');

    // Define data de hoje
    document.getElementById('ocDataOcorrencia').value =
      new Date().toISOString().split('T')[0];

    // Calcula próximo ID
    await carregarProximoId();
  }

  function preencherSelect(idSelect, dados, campoValor, campoTexto) {
    const sel = document.getElementById(idSelect);
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecione...</option>' +
      dados.map(d => `<option value="${d[campoValor]}">${d[campoTexto]}</option>`).join('');
  }

  async function carregarProximoId() {
    try {
      const r = await Api.get('/api/ocorrencias?pagina=1&porPagina=1&status=todas');
      // Não temos endpoint específico pra isso, então só mostramos a próxima estimativa
      const proximo = (r.paginacao?.total || 0) + 1;
      document.getElementById('proximoIdOcorrencia').textContent =
        `OCR${String(proximo).padStart(6, '0')}`;
    } catch {
      document.getElementById('proximoIdOcorrencia').textContent = '—';
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CARREGAMENTO EM CADEIA (plantão → farmacêutico → assistente)
  // ═══════════════════════════════════════════════════════════
  function carregarFarmaceuticos() {
    const plantao = document.getElementById('ocPlantao').value;
    const sel = document.getElementById('ocFarmaceutico');
    const selAss = document.getElementById('ocAssistente');

    selAss.innerHTML = '<option value="">Selecione o farmacêutico primeiro</option>';

    if (!plantao) {
      sel.innerHTML = '<option value="">Selecione o plantão primeiro</option>';
      return;
    }

    const lista = State.refs.farmaceuticos.filter(f => f.plantao === plantao);
    sel.innerHTML = '<option value="">Selecione...</option>' +
      lista.map(f => `<option value="${f.id}">${f.nome}</option>`).join('');
  }

  function carregarAssistentes() {
    const farmId = Number(document.getElementById('ocFarmaceutico').value);
    const sel = document.getElementById('ocAssistente');
    const checkbox = document.getElementById('ocErroFarmaceutico');

    if (checkbox.checked) {
      sel.innerHTML = '<option value="">Não se aplica</option>';
      return;
    }

    if (!farmId) {
      sel.innerHTML = '<option value="">Selecione o farmacêutico primeiro</option>';
      return;
    }

    // Regra: se farmacêutico é "Folguista", mostra todos do mesmo plantão
    const farm = State.refs.farmaceuticos.find(f => f.id === farmId);
    let lista;
    if (farm?.tipo === 'Folguista') {
      lista = State.refs.assistentes.filter(a => a.plantao === farm.plantao);
    } else {
      lista = State.refs.assistentes.filter(a => a.farmaceutico_id === farmId);
    }

    sel.innerHTML = '<option value="">Selecione...</option>' +
      lista.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
  }

  function toggleResponsavelErro() {
    const checkbox = document.getElementById('ocErroFarmaceutico');
    if (checkbox.checked) {
      document.getElementById('ocAssistente').innerHTML =
        '<option value="">Não se aplica</option>';
    } else {
      carregarAssistentes();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // CÁLCULOS AO VIVO
  // ═══════════════════════════════════════════════════════════
  function calcularDiferenca() {
    const presc = parseFloat(document.getElementById('ocQuantidadePrescrita').value) || 0;
    const disp = parseFloat(document.getElementById('ocQuantidadeDispensada').value) || 0;
    document.getElementById('ocDiferencaDisplay').textContent = (presc - disp).toFixed(2);
  }

  function calcularHorario() {
    const p = document.getElementById('ocHoraPrescricao').value;
    const d = document.getElementById('ocHoraDispensacao').value;
    const el = document.getElementById('ocClassificacaoDisplay');

    if (!p || !d) {
      el.textContent = 'Aguardando horários';
      el.style.color = '';
      return;
    }

    const [h1, m1] = p.split(':').map(Number);
    const [h2, m2] = d.split(':').map(Number);
    const diff = (h2 * 60 + m2) - (h1 * 60 + m1);

    let classificacao, cor;
    if (diff < -15) { classificacao = 'Antecipada'; cor = '#E65100'; }
    else if (diff > 30) { classificacao = 'Atrasada'; cor = '#C62828'; }
    else { classificacao = 'No horário'; cor = '#2E7D32'; }

    el.textContent = `${classificacao} (${diff > 0 ? '+' : ''}${diff} min)`;
    el.style.color = cor;
  }

  // ═══════════════════════════════════════════════════════════
  // SALVAR
  // ═══════════════════════════════════════════════════════════
  async function salvar() {
    const erroFarm = document.getElementById('ocErroFarmaceutico').checked;

    const dados = {
      data_ocorrencia: document.getElementById('ocDataOcorrencia').value,
      prontuario: document.getElementById('ocProntuario').value.trim(),
      numero_prescricao: document.getElementById('ocNumeroPrescricao').value.trim(),
      medicamento_id: Number(document.getElementById('ocMedicamento').value),
      tipo_erro_id: Number(document.getElementById('ocTipoErro').value),
      setor_id: Number(document.getElementById('ocSetor').value),
      quantidade_prescrita: parseFloat(document.getElementById('ocQuantidadePrescrita').value),
      quantidade_dispensada: document.getElementById('ocQuantidadeDispensada').value
        ? parseFloat(document.getElementById('ocQuantidadeDispensada').value)
        : null,
      hora_prescricao: document.getElementById('ocHoraPrescricao').value || null,
      hora_dispensacao: document.getElementById('ocHoraDispensacao').value || null,
      plantao: document.getElementById('ocPlantao').value,
      farmaceutico_id: Number(document.getElementById('ocFarmaceutico').value),
      assistente_id: erroFarm ? null : (Number(document.getElementById('ocAssistente').value) || null),
      responsavel_erro: erroFarm ? 'Farmacêutico' : 'Assistente',
      observacoes: document.getElementById('ocObservacoes').value.trim() || null
    };

    // Validação básica no frontend
    const obrigatorios = ['data_ocorrencia', 'prontuario', 'numero_prescricao',
      'medicamento_id', 'tipo_erro_id', 'setor_id', 'plantao', 'farmaceutico_id'];
    for (const campo of obrigatorios) {
      if (!dados[campo] && dados[campo] !== 0) {
        UI.toast(`Preencha o campo: ${campo.replace(/_/g, ' ')}`, 'warning');
        return;
      }
    }
    if (!erroFarm && !dados.assistente_id) {
      UI.toast('Selecione o assistente ou marque "Erro do farmacêutico"', 'warning');
      return;
    }

    UI.loading('Salvando ocorrência...');
    try {
      await Api.post('/api/ocorrencias', dados);
      UI.toast('Ocorrência registrada!', 'success');
      limpar();
      carregarProximoId();
    } catch (err) {
      UI.toast('Erro: ' + err.message, 'error');
    } finally {
      UI.esconderLoading();
    }
  }

  function limpar() {
    document.getElementById('ocDataOcorrencia').value = new Date().toISOString().split('T')[0];
    document.getElementById('ocProntuario').value = '';
    document.getElementById('ocNumeroPrescricao').value = '';
    document.getElementById('ocMedicamento').value = '';
    document.getElementById('ocTipoErro').value = '';
    document.getElementById('ocSetor').value = '';
    document.getElementById('ocQuantidadePrescrita').value = '';
    document.getElementById('ocQuantidadeDispensada').value = '';
    document.getElementById('ocHoraPrescricao').value = '';
    document.getElementById('ocHoraDispensacao').value = '';
    document.getElementById('ocPlantao').value = '';
    document.getElementById('ocFarmaceutico').innerHTML = '<option value="">Selecione o plantão primeiro</option>';
    document.getElementById('ocAssistente').innerHTML = '<option value="">Selecione o farmacêutico primeiro</option>';
    document.getElementById('ocErroFarmaceutico').checked = false;
    document.getElementById('ocObservacoes').value = '';
    document.getElementById('ocDiferencaDisplay').textContent = '0';
    document.getElementById('ocClassificacaoDisplay').textContent = 'Aguardando horários';
    document.getElementById('ocClassificacaoDisplay').style.color = '';
  }

  return {
    inicializar, carregarFarmaceuticos, carregarAssistentes,
    toggleResponsavelErro, calcularDiferenca, calcularHorario,
    salvar, limpar
  };
})();