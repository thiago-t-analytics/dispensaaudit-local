
-- =============================================================
-- DispensaAudit — Schema SQLite
-- =============================================================
-- Este arquivo cria todas as tabelas, índices e constraints do
-- banco de dados local. É executado por `npm run db:setup`.
-- =============================================================

PRAGMA foreign_keys = ON;

-- ─────────────────────────────────────────────────────────────
-- USUARIOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usuarios (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT    NOT NULL,
  email      TEXT    UNIQUE,
  perfil     TEXT    NOT NULL DEFAULT 'Usuário',
  ativo      INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────────────────────
-- MEDICAMENTOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS medicamentos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  nome          TEXT    NOT NULL,
  apresentacao  TEXT,
  unidade       TEXT,
  ativo         INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
  criado_em     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_medicamentos_nome ON medicamentos(nome);

-- ─────────────────────────────────────────────────────────────
-- TIPOS DE ERRO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tipos_erro (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  descricao  TEXT    NOT NULL UNIQUE,
  categoria  TEXT    NOT NULL CHECK (categoria IN (
              'Quantidade', 'Omissão', 'Tempo', 'Seleção',
              'Identificação', 'Processo', 'Documentação'
             )),
  exemplo    TEXT,
  ativo      INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1))
);

-- ─────────────────────────────────────────────────────────────
-- SETORES (nova tabela — antes era texto livre)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS setores (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT    NOT NULL UNIQUE,
  ativo      INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
  criado_em  TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ─────────────────────────────────────────────────────────────
-- FARMACEUTICOS
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmaceuticos (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  nome      TEXT    NOT NULL,
  plantao   TEXT    NOT NULL CHECK (plantao IN ('Diurno', 'Noturno')),
  tipo      TEXT    NOT NULL DEFAULT 'Fixo' CHECK (tipo IN ('Fixo', 'Folguista')),
  ativo     INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1))
);

-- ─────────────────────────────────────────────────────────────
-- ASSISTENTES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assistentes (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  nome             TEXT    NOT NULL,
  plantao          TEXT    NOT NULL CHECK (plantao IN ('Diurno', 'Noturno')),
  farmaceutico_id  INTEGER,
  ativo            INTEGER NOT NULL DEFAULT 1 CHECK (ativo IN (0, 1)),
  FOREIGN KEY (farmaceutico_id) REFERENCES farmaceuticos(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_assistentes_farmaceutico
  ON assistentes(farmaceutico_id);

-- ─────────────────────────────────────────────────────────────
-- OCORRENCIAS (tabela central)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ocorrencias (
  id                      INTEGER PRIMARY KEY AUTOINCREMENT,
  data_ocorrencia         TEXT    NOT NULL,
  prontuario              TEXT    NOT NULL,
  numero_prescricao       TEXT    NOT NULL,
  medicamento_id          INTEGER NOT NULL,
  tipo_erro_id            INTEGER NOT NULL,
  setor_id                INTEGER NOT NULL,
  quantidade_prescrita    REAL    NOT NULL CHECK (quantidade_prescrita >= 0),
  quantidade_dispensada   REAL             CHECK (quantidade_dispensada IS NULL OR quantidade_dispensada >= 0),
  diferenca_quantidade    REAL    NOT NULL,
  hora_prescricao         TEXT             CHECK (hora_prescricao IS NULL OR hora_prescricao GLOB '[0-2][0-9]:[0-5][0-9]'),
  hora_dispensacao        TEXT             CHECK (hora_dispensacao IS NULL OR hora_dispensacao GLOB '[0-2][0-9]:[0-5][0-9]'),
  diferenca_minutos       INTEGER,
  classificacao_horario   TEXT    NOT NULL DEFAULT 'Não informado'
                                  CHECK (classificacao_horario IN (
                                    'Antecipada', 'No horário', 'Atrasada', 'Não informado'
                                  )),
  plantao                 TEXT    NOT NULL CHECK (plantao IN ('Diurno', 'Noturno')),
  farmaceutico_id         INTEGER NOT NULL,
  assistente_id           INTEGER,
  responsavel_erro        TEXT    NOT NULL CHECK (responsavel_erro IN ('Farmacêutico', 'Assistente')),
  observacoes             TEXT,
  status                  TEXT    NOT NULL DEFAULT 'Ativa'
                                  CHECK (status IN ('Ativa', 'Concluida', 'Excluida')),
  usuario_cadastro        TEXT    NOT NULL,
  criado_em               TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em           TEXT    NOT NULL DEFAULT (datetime('now')),
  excluido_em             TEXT,

  FOREIGN KEY (medicamento_id)   REFERENCES medicamentos(id),
  FOREIGN KEY (tipo_erro_id)     REFERENCES tipos_erro(id),
  FOREIGN KEY (setor_id)         REFERENCES setores(id),
  FOREIGN KEY (farmaceutico_id)  REFERENCES farmaceuticos(id),
  FOREIGN KEY (assistente_id)    REFERENCES assistentes(id),

  -- Regra: se responsável é Assistente, assistente_id é obrigatório.
  -- Se responsável é Farmacêutico, assistente_id deve ser NULL.
  CHECK (
    (responsavel_erro = 'Farmacêutico' AND assistente_id IS NULL)
    OR
    (responsavel_erro = 'Assistente' AND assistente_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_ocorrencias_data
  ON ocorrencias(data_ocorrencia);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_status
  ON ocorrencias(status);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_setor
  ON ocorrencias(setor_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_farmaceutico
  ON ocorrencias(farmaceutico_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_tipo_erro
  ON ocorrencias(tipo_erro_id);

-- ─────────────────────────────────────────────────────────────
-- LOGS (auditoria)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS logs (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  data_hora       TEXT    NOT NULL DEFAULT (datetime('now')),
  usuario         TEXT    NOT NULL,
  acao            TEXT    NOT NULL,
  tabela          TEXT    NOT NULL,
  registro        TEXT,
  valor_anterior  TEXT,
  valor_novo      TEXT
);

CREATE INDEX IF NOT EXISTS idx_logs_data ON logs(data_hora);

-- ─────────────────────────────────────────────────────────────
-- CONFIGURACOES
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS configuracoes (
  chave  TEXT PRIMARY KEY,
  valor  TEXT NOT NULL
);

-- ─────────────────────────────────────────────────────────────
-- VIEWS auxiliares para consultas comuns
-- ─────────────────────────────────────────────────────────────
CREATE VIEW IF NOT EXISTS vw_ocorrencias_completas AS
SELECT
  o.id,
  o.data_ocorrencia,
  o.prontuario,
  o.numero_prescricao,
  m.nome   AS medicamento,
  t.descricao AS tipo_erro,
  s.nome   AS setor,
  o.quantidade_prescrita,
  o.quantidade_dispensada,
  o.diferenca_quantidade,
  o.hora_prescricao,
  o.hora_dispensacao,
  o.diferenca_minutos,
  o.classificacao_horario,
  o.plantao,
  f.nome   AS farmaceutico,
  a.nome   AS assistente,
  o.responsavel_erro,
  o.observacoes,
  o.status,
  o.usuario_cadastro,
  o.criado_em,
  o.atualizado_em
FROM ocorrencias o
JOIN medicamentos  m ON m.id = o.medicamento_id
JOIN tipos_erro    t ON t.id = o.tipo_erro_id
JOIN setores       s ON s.id = o.setor_id
JOIN farmaceuticos f ON f.id = o.farmaceutico_id
LEFT JOIN assistentes a ON a.id = o.assistente_id;