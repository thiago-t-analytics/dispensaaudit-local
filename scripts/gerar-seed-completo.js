// =============================================================
// gerar-seed-completo.js — Gera o seed.sql a partir do .xlsx real
// =============================================================
// COMO USAR:
//   1. Coloque o arquivo DispensaAudit.xlsx na raiz do projeto
//   2. npm install xlsx
//   3. npm run seed:gerar
//
// O QUE ELE FAZ:
//   1. Lê o DispensaAudit.xlsx
//   2. Lê cada aba (USUARIOS, TiposErro, MEDICAMENTOS, ...)
//   3. Converte cada linha em INSERT SQL
//   4. Escreve o resultado em database/seed.sql (sobrescreve!)
//
// CONCEITO APRENDIDO:
//   - Migração de dados: como transformar dados de um sistema
//     antigo (planilha) em dados de um sistema novo (SQL).
//   - Validação de dados: nem tudo que vem da planilha é confiável.
//   - Por que migrar é mais confiável do que redigitar à mão.
// =============================================================

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const ROOT = path.join(__dirname, '..');
const XLSX_PATH = path.join(ROOT, 'DispensaAudit.xlsx');
const SEED_PATH = path.join(ROOT, 'database', 'seed.sql');

if (!fs.existsSync(XLSX_PATH)) {
  console.error(`❌ Arquivo não encontrado: ${XLSX_PATH}`);
  console.error('   Coloque o DispensaAudit.xlsx na raiz do projeto.');
  process.exit(1);
}

console.log('📖 Lendo planilha...');
const wb = XLSX.readFile(XLSX_PATH);

// ── Contadores de diagnóstico ────────────────────────────────
const diag = {
  horasDescartadas: 0,
  horasCorrigidas: 0,
  setoresNormalizados: 0
};

// ── Funções auxiliares ────────────────────────────────────────
function lerAba(nome) {
  const sheet = wb.Sheets[nome];
  if (!sheet) {
    console.warn(`⚠️  Aba "${nome}" não encontrada. Pulando.`);
    return [];
  }
  return XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });
}

function esc(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
}

/**
 * Normaliza um valor de hora vindo do Excel/Sheets.
 *
 * Casos possíveis:
 *   "20:00"                    → "20:00"       (formato correto)
 *   "20:00:00"                 → "20:00"       (trunca segundos)
 *   "00:00:00"                 → "00:00"       (zero é válido)
 *   "1899-12-30 00:00:00"      → null          (lixo do Sheets — Date vira 1899)
 *   "0.8333"                   → null          (serial do Excel sem formatação)
 *   ""  / null                 → null          (vazio)
 *   "abc"                      → null          (texto inválido)
 *
 * Retorna SEMPRE uma string "HH:MM" válida ou null.
 */
function normalizarHora(valor) {
  if (valor === null || valor === undefined) return null;

  const s = String(valor).trim();
  if (s === '') return null;

  // Caso 1: já está em HH:MM ou HH:MM:SS
  const matchHHMM = s.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (matchHHMM) {
    const h = parseInt(matchHHMM[1], 10);
    const m = parseInt(matchHHMM[2], 10);
    if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
      if (matchHHMM[3]) diag.horasCorrigidas++;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }
    diag.horasDescartadas++;
    return null;
  }

  // Caso 2: lixo do Sheets — Date convertido para "1899-..." ou "1900-..."
  if (/^18\d{2}-|^19\d{2}-/.test(s)) {
    diag.horasDescartadas++;
    return null;
  }

  // Caso 3: serial do Excel sem formatação (ex.: 0.8333 = 20:00)
  // Se for um número puro entre 0 e 1, é uma fração de dia.
  // Mas SÓ aceitamos se a planilha declarou como hora.
  // Como não temos essa info, descartamos para evitar erro.
  if (/^\d*\.?\d+$/.test(s)) {
    diag.horasDescartadas++;
    return null;
  }

  // Caso 4: qualquer outra coisa — descarta
  diag.horasDescartadas++;
  return null;
}

function toSnake(str) {
  return String(str)
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

// ── 1. Usuários ───────────────────────────────────────────────
console.log('👥 Usuários...');
const usuarios = lerAba('USUARIOS');
const sqlUsuarios = usuarios.map((u, i) =>
  `  (${i + 1}, ${esc(u.Nome)}, ${esc(u.Email)}, ${esc(u.Perfil)}, 1)`
).join(',\n');

// ── 2. Setores ────────────────────────────────────────────────
console.log('🏥 Setores...');
const setoresFixos = [
  'UTI',
  'Enfermaria Clínica',
  'Enfermaria Cirúrgica',
  'Centro Cirúrgico',
  'Maternidade'
];
const ocorrenciasRaw = lerAba('OCORRENCIAS');
const setoresDetectados = new Set(setoresFixos);
ocorrenciasRaw.forEach(o => {
  const s = (o.Setor || '').trim();
  if (s && !s.toLowerCase().includes('outro')) setoresDetectados.add(s);
});
const setoresFinal = [...setoresDetectados];
const sqlSetores = setoresFinal.map((s, i) =>
  `  (${i + 1}, ${esc(s)})`
).join(',\n');

// ── 3. Tipos de erro ──────────────────────────────────────────
console.log('⚠️  Tipos de erro...');
const tiposErro = lerAba('TiposErro');
const sqlTiposErro = tiposErro.map((t, i) =>
  `  (${i + 1}, ${esc(t.Descricao)}, ${esc(t.Categoria)}, ${esc(t.Exemplo)})`
).join(',\n');

// ── 4. Farmacêuticos ──────────────────────────────────────────
console.log('💊 Farmacêuticos...');
const farmaceuticos = lerAba('FARMACEUTICOS');
const mapFarmac = {};
farmaceuticos.forEach((f, i) => { mapFarmac[f.ID_Farmaceutico] = i + 1; });
const sqlFarmaceuticos = farmaceuticos.map((f, i) =>
  `  (${i + 1}, ${esc(f.Nome)}, ${esc(f.Plantao)}, ${esc(f.Tipo || 'Fixo')}, 1)`
).join(',\n');

// ── 5. Assistentes ────────────────────────────────────────────
console.log('🧑‍⚕️ Assistentes...');
const assistentes = lerAba('ASSISTENTES');
const mapAssist = {};
assistentes.forEach((a, i) => { mapAssist[a.ID_Assistente] = i + 1; });
const sqlAssistentes = assistentes.map((a, i) => {
  const farmId = mapFarmac[a.ID_Farmaceutico] || 'NULL';
  return `  (${i + 1}, ${esc(a.Nome)}, ${esc(a.Plantao)}, ${farmId}, 1)`;
}).join(',\n');

// ── 6. Medicamentos ───────────────────────────────────────────
console.log('💉 Medicamentos...');
const medicamentos = lerAba('MEDICAMENTOS');
const mapMed = {};
medicamentos.forEach((m, i) => { mapMed[m.ID_Medicamento] = i + 1; });
const sqlMedicamentos = medicamentos.map((m, i) =>
  `  (${i + 1}, ${esc(m.NomeMedicamento)}, 1)`
).join(',\n');

// ── 7. Ocorrências ────────────────────────────────────────────
console.log('📋 Ocorrências...');
const mapSetor = {};
setoresFinal.forEach((s, i) => { mapSetor[s] = i + 1; });

function mapSetorNome(nomeBruto) {
  const s = String(nomeBruto || '').trim();
  if (mapSetor[s]) return mapSetor[s];
  const found = Object.keys(mapSetor).find(k =>
    k.toLowerCase() === s.toLowerCase()
  );
  if (found) {
    diag.setoresNormalizados++;
    return mapSetor[found];
  }
  return 1;
}

function mapTipoErro(idOriginal) {
  const idx = tiposErro.findIndex(t => t.ID_TipoErro === idOriginal);
  return idx >= 0 ? idx + 1 : 1;
}

const sqlOcorrencias = ocorrenciasRaw.map((o, i) => {
  const id = i + 1;
  const medId = mapMed[o.ID_Medicamento] || 'NULL';
  const tipoId = mapTipoErro(o.ID_TipoErro);
  const setorId = mapSetorNome(o.Setor);
  const farmId = mapFarmac[o.ID_Farmaceutico] || 'NULL';
  const assId = o.ID_Assistente ? (mapAssist[o.ID_Assistente] || 'NULL') : 'NULL';

  const data = String(o.DataOcorrencia || '').split(' ')[0];

  // ✅ Correção principal: normalização robusta das horas
  const hPresc = normalizarHora(o.HoraPrescricao);
  const hDisp = normalizarHora(o.HoraDispensacao);

  let status = o.Status || 'Ativa';
  if (!['Ativa', 'Concluida', 'Excluida'].includes(status)) status = 'Ativa';

  const responsavel = o.ResponsavelErro || (assId !== 'NULL' ? 'Assistente' : 'Farmacêutico');

  const qPresc = parseFloat(o.QuantidadePrescrita) || 0;
  const qDispRaw = o.QuantidadeDispensada;
  const qDisp = (qDispRaw === null || qDispRaw === '' || qDispRaw === undefined)
    ? 'NULL' : (parseFloat(qDispRaw) || 0);
  const dif = (qDispRaw === null || qDispRaw === '' || qDispRaw === undefined)
    ? qPresc : (qPresc - parseFloat(qDispRaw));

  const classif = o.ClassificacaoHorario || 'Não informado';

  return `  (${id}, ${esc(data)}, ${esc(o.Prontuario)}, ${esc(o.NumeroPrescricao)},\n` +
         `   ${medId}, ${tipoId}, ${setorId},\n` +
         `   ${qPresc}, ${qDisp}, ${dif},\n` +
         `   ${hPresc ? esc(hPresc) : 'NULL'}, ${hDisp ? esc(hDisp) : 'NULL'}, ` +
         `${o.DiferencaMinutos || 'NULL'}, ${esc(classif)},\n` +
         `   ${esc(o.Plantao)}, ${farmId}, ${assId}, ${esc(responsavel)},\n` +
         `   ${esc(o.Observacoes)},\n` +
         `   ${esc(status)}, ${esc(o.UsuarioCadastro || 'Sistema')},\n` +
         `   ${esc(o.DataCriacao || new Date().toISOString())},\n` +
         `   ${esc(o.UltimaAtualizacao || o.DataCriacao || new Date().toISOString())})`;
}).join(',\n');

// ── 8. Logs ───────────────────────────────────────────────────
console.log('📝 Logs (50 mais recentes)...');
const logsRaw = lerAba('LOGS');
const logsRecentes = logsRaw.slice(-50);
const sqlLogs = logsRecentes.map(l => {
  return `  (${esc(l.DataHora)}, ${esc(l.Usuario)}, ${esc(l.Acao)}, ` +
         `${esc(l.Tabela)}, ${esc(l.Registro)}, ` +
         `${esc(l.ValorAnterior)}, ${esc(l.ValorNovo)})`;
}).join(',\n');

// ── 9. Monta o arquivo final ──────────────────────────────────
const sqlFinal = `-- =============================================================
-- DispensaAudit — Seed COMPLETO (gerado automaticamente)
-- =============================================================
-- Gerado por scripts/gerar-seed-completo.js
-- a partir de: DispensaAudit.xlsx
-- Gerado em: ${new Date().toISOString()}
--
-- Contém:
--   • ${usuarios.length} usuários
--   • ${setoresFinal.length} setores
--   • ${tiposErro.length} tipos de erro
--   • ${farmaceuticos.length} farmacêuticos
--   • ${assistentes.length} assistentes
--   • ${medicamentos.length} medicamentos
--   • ${ocorrenciasRaw.length} ocorrências
--   • ${logsRecentes.length} logs (amostra)
--
-- Diagnóstico de normalização:
--   • Horas corrigidas (com segundos removidos): ${diag.horasCorrigidas}
--   • Horas descartadas (lixo do Sheets):       ${diag.horasDescartadas}
--   • Setores normalizados (acento/case):        ${diag.setoresNormalizados}
-- =============================================================

-- USUARIOS
INSERT INTO usuarios (id, nome, email, perfil, ativo) VALUES
${sqlUsuarios};

-- SETORES
INSERT INTO setores (id, nome) VALUES
${sqlSetores};

-- TIPOS DE ERRO
INSERT INTO tipos_erro (id, descricao, categoria, exemplo) VALUES
${sqlTiposErro};

-- FARMACEUTICOS
INSERT INTO farmaceuticos (id, nome, plantao, tipo, ativo) VALUES
${sqlFarmaceuticos};

-- ASSISTENTES
INSERT INTO assistentes (id, nome, plantao, farmaceutico_id, ativo) VALUES
${sqlAssistentes};

-- MEDICAMENTOS
INSERT INTO medicamentos (id, nome, ativo) VALUES
${sqlMedicamentos};

-- OCORRENCIAS
INSERT INTO ocorrencias (
  id, data_ocorrencia, prontuario, numero_prescricao,
  medicamento_id, tipo_erro_id, setor_id,
  quantidade_prescrita, quantidade_dispensada, diferenca_quantidade,
  hora_prescricao, hora_dispensacao, diferenca_minutos, classificacao_horario,
  plantao, farmaceutico_id, assistente_id, responsavel_erro,
  observacoes, status, usuario_cadastro,
  criado_em, atualizado_em
) VALUES
${sqlOcorrencias};

-- LOGS
INSERT INTO logs (data_hora, usuario, acao, tabela, registro, valor_anterior, valor_novo) VALUES
${sqlLogs};

-- CONFIGURACOES
INSERT INTO configuracoes (chave, valor) VALUES
  ('nome_sistema',        'DispensaAudit'),
  ('versao',              '0.1.0'),
  ('unidade_hospital',    'Hospital Regional de Ivaiporã'),
  ('administrador_email', 'thiragorosa.adm25@gmail.com'),
  ('cor_tema',            '#3A506B'),
  ('itens_por_pagina',    '10'),
  ('fuso_horario',        'America/Sao_Paulo');
`;

fs.writeFileSync(SEED_PATH, sqlFinal, 'utf8');

console.log('\n✅ seed.sql completo gerado!');
console.log(`   • Usuários:        ${usuarios.length}`);
console.log(`   • Setores:         ${setoresFinal.length}`);
console.log(`   • Tipos de erro:   ${tiposErro.length}`);
console.log(`   • Farmacêuticos:   ${farmaceuticos.length}`);
console.log(`   • Assistentes:     ${assistentes.length}`);
console.log(`   • Medicamentos:    ${medicamentos.length}`);
console.log(`   • Ocorrências:     ${ocorrenciasRaw.length}`);
console.log(`   • Logs (amostra):  ${logsRecentes.length}`);

if (diag.horasCorrigidas > 0 || diag.horasDescartadas > 0) {
  console.log('\n🔧 Diagnóstico de horas:');
  console.log(`   • Corrigidas (segundos removidos): ${diag.horasCorrigidas}`);
  console.log(`   • Descartadas (lixo do Sheets):    ${diag.horasDescartadas}`);
}

if (diag.setoresNormalizados > 0) {
  console.log(`\n🏥 Setores normalizados: ${diag.setoresNormalizados}`);
}

console.log('\n📄 Arquivo gerado em: database/seed.sql');
console.log('👉 Agora rode: npm run db:reset');