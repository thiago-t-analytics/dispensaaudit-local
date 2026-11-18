-- ╔══════════════════════════════════════════════════════════════╗
-- ║ 🎓 DIA 05 — SEED: DADOS SINTÉTICOS DE TREINAMENTO            ║
-- ║ O QUE ESTE BLOCO FAZ: insere cadastros e ocorrências fictícias.║
-- ║ CONCEITO APRENDIDO: INSERT, ordem das chaves estrangeiras.    ║
-- ║ COMO TESTAR: descomente e execute npm run db:seed:demo numa  ║
-- ║ cópia isolada; confira os registros no DB Browser.           ║
-- ║ REQUER: DIA 04 completo e banco descartável.                  ║
-- ╚══════════════════════════════════════════════════════════════╝
-- ▼▼▼ DESCOMENTE DAQUI — D05-B01 ▼▼▼
/*
-- Estes registros são inteiramente fictícios e não representam pacientes reais.
INSERT OR IGNORE INTO usuarios (id, nome, email, perfil, ativo)
VALUES (1, 'Usuário Demonstração', NULL, 'Coordenação', 1);

INSERT OR IGNORE INTO medicamentos (id, nome, apresentacao, unidade, ativo)
VALUES
  (1, 'Medicamento Exemplo A', 'Comprimido 500 mg', 'comprimido', 1),
  (2, 'Medicamento Exemplo B', 'Solução oral 100 ml', 'frasco', 1);

INSERT OR IGNORE INTO tipos_erro (id, descricao, categoria, exemplo, ativo)
VALUES
  (1, 'Quantidade divergente (demo)', 'Quantidade', 'Exemplo fictício para treinamento.', 1),
  (2, 'Dispensação atrasada (demo)', 'Tempo', 'Exemplo fictício para treinamento.', 1);

INSERT OR IGNORE INTO setores (id, nome, ativo)
VALUES
  (1, 'Setor Demonstração A', 1),
  (2, 'Setor Demonstração B', 1);

INSERT OR IGNORE INTO farmaceuticos (id, nome, plantao, tipo, ativo)
VALUES (1, 'Farmacêutico Exemplo', 'Diurno', 'Fixo', 1);

INSERT OR IGNORE INTO assistentes (id, nome, plantao, farmaceutico_id, ativo)
VALUES (1, 'Assistente Exemplo', 'Diurno', 1, 1);

INSERT OR IGNORE INTO ocorrencias (
  id, data_ocorrencia, prontuario, numero_prescricao, medicamento_id,
  tipo_erro_id, setor_id, quantidade_prescrita, quantidade_dispensada,
  diferenca_quantidade, hora_prescricao, hora_dispensacao,
  diferenca_minutos, classificacao_horario, plantao, farmaceutico_id,
  assistente_id, responsavel_erro, observacoes, status, usuario_cadastro
) VALUES
  (
    1, '2026-11-17', 'DEMO-0001', 'PRESC-DEMO-001', 1,
    1, 1, 2, 1, 1, '08:00', '08:15', 15, 'Atrasada', 'Diurno', 1,
    1, 'Assistente', 'Registro fictício para treinamento.', 'Ativa',
    'Usuário Demonstração'
  ),
  (
    2, '2026-11-16', 'DEMO-0002', 'PRESC-DEMO-002', 2,
    2, 2, 1, 1, 0, '20:00', '20:05', 5, 'No horário', 'Noturno', 1,
    NULL, 'Farmacêutico', 'Segundo registro fictício para treinamento.',
    'Concluida', 'Usuário Demonstração'
  );

INSERT OR IGNORE INTO logs (id, usuario, acao, tabela, registro)
VALUES (1, 'Usuário Demonstração', 'Cadastro de demonstração', 'ocorrencias', '1, 2');
*/
-- ▲▲▲ ATÉ AQUI — D05-B01 ▲▲▲

-- CHECKPOINT: após descomentar D05-B01, há dois registros fictícios
-- disponíveis para testar consultas, filtros e relatórios.
