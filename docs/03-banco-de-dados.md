# 03 — Modelagem do Banco de Dados

> **Este documento responde à pergunta: "Como os dados são organizados?"**
> A modelagem foi derivada diretamente da planilha `DispensaAudit.xlsx`,
> com **duas melhorias estruturais**:
>
> 1. Normalização de `Setor` (antes texto livre) em tabela própria.
> 2. Correção da representação de horários e da diferença de quantidade.

---

## 1. Diagrama de Entidades

```text
┌───────────────┐
│   Setores     │
│───────────────│
│ id (PK)       │
│ nome          │
│ ativo         │
└───────┬───────┘
        │
        │ 1
        │
        │ N
┌───────────────┐   ┌────────────────┐   ┌───────────────┐
│ Medicamentos  │   │                │   │  TiposErro    │
│───────────────│   │                │   │───────────────│
│ id (PK)       │   │                │   │ id (PK)       │
│ nome          │   │  Ocorrencias   │   │ descricao     │
│ ativo         │   │────────────────│   │ categoria     │
└───────┬───────┘   │ id (PK)        │   │ ativo         │
        │ 1         │ data_ocorrencia│   └───────┬───────┘
        │           │ prontuario     │           │ 1
        │ N         │ numero_prescricao          │
        └──────────▶│ medicamento_id ├───────────┘
                    │ tipo_erro_id                │
                    │ setor_id                    │
                    │ quantidade_prescrita
                    │ quantidade_dispensada (NULL)
                    │ diferenca_quantidade
                    │ hora_prescricao (HH:MM)
                    │ hora_dispensacao (HH:MM)
                    │ diferenca_minutos
                    │ classificacao_horario
                    │ plantao
                    │ farmaceutico_id          ◀──────┐
                    │ assistente_id            ◀──┐   │
                    │ responsavel_erro             │   │
                    │ observacoes                  │   │
                    │ status                       │   │
                    │ usuario_cadastro             │   │
                    │ criado_em                    │   │
                    │ atualizado_em                │   │
                    │ excluido_em                  │   │
                    └──────────────────────────────┘   │
                                                       │
┌──────────────────────┐      ┌────────────────┐       │
│ Assistentes          │      │ Farmaceuticos  │       │
│──────────────────────│      │────────────────│       │
│ id (PK)              │      │ id (PK)        │       │
│ nome                 │      │ nome           │       │
│ plantao              │      │ plantao        │       │
│ farmaceutico_id (FK) │      │ tipo           │       │
│ ativo                │      │ ativo          │       │
└──────────────────────┘      └────────────────┘       │
                                                       │
┌──────────────────────┐      ┌──────────────────┐     │
│ Usuarios             │      │ Logs             │     │
│──────────────────────│      │──────────────────│     │
│ id (PK)              │      │ id (PK)          │     │
│ nome                 │      │ data_hora        │     │
│ email                │      │ usuario          │     │
│ perfil               │      │ acao             │     │
│ ativo                │      │ tabela           │     │
└──────────────────────┘      │ registro         │     │
                              │ valor_anterior   │     │
                              │ valor_novo       │     │
                              └──────────────────┘     │
```

---

## 2. Tabelas

### 2.1 `setores`

| Coluna      | Tipo    | Restrição           | Descrição                        |
| ----------- | ------- | ------------------- | -------------------------------- |
| `id`        | INTEGER | PK, AUTOINCREMENT   | —                                |
| `nome`      | TEXT    | NOT NULL, UNIQUE    | Ex.: "UTI", "Enfermaria Clínica" |
| `ativo`     | INTEGER | NOT NULL, DEFAULT 1 | 1 = ativo, 0 = inativo           |
| `criado_em` | TEXT    | NOT NULL            | Data ISO 8601                    |

> **Sobre a normalização**: no sistema original, `Setor` era texto livre e aparecia
> inconsistente ("Enfermaria Clinica" sem acento vs. "Enfermaria Cirúrgica" com
> acento no formulário). A tabela `setores` resolve isso.

### 2.2 `medicamentos`

| Coluna         | Tipo    | Restrição           |
| -------------- | ------- | ------------------- |
| `id`           | INTEGER | PK                  |
| `nome`         | TEXT    | NOT NULL            |
| `apresentacao` | TEXT    | —                   |
| `unidade`      | TEXT    | —                   |
| `ativo`        | INTEGER | NOT NULL, DEFAULT 1 |
| `criado_em`    | TEXT    | NOT NULL            |

### 2.3 `tipos_erro`

| Coluna      | Tipo    | Restrição           |
| ----------- | ------- | ------------------- |
| `id`        | INTEGER | PK                  |
| `descricao` | TEXT    | NOT NULL, UNIQUE    |
| `categoria` | TEXT    | NOT NULL            |
| `exemplo`   | TEXT    | —                   |
| `ativo`     | INTEGER | NOT NULL, DEFAULT 1 |

**Categorias permitidas** (CHECK): `Quantidade`, `Omissão`, `Tempo`, `Seleção`, `Identificação`, `Processo`, `Documentação`.

### 2.4 `farmaceuticos`

| Coluna    | Tipo    | Restrição                               |
| --------- | ------- | --------------------------------------- |
| `id`      | INTEGER | PK                                      |
| `nome`    | TEXT    | NOT NULL                                |
| `plantao` | TEXT    | NOT NULL, CHECK (`Diurno` ou `Noturno`) |
| `tipo`    | TEXT    | NOT NULL, CHECK (`Fixo` ou `Folguista`) |
| `ativo`   | INTEGER | NOT NULL, DEFAULT 1                     |

### 2.5 `assistentes`

| Coluna            | Tipo    | Restrição                               |
| ----------------- | ------- | --------------------------------------- |
| `id`              | INTEGER | PK                                      |
| `nome`            | TEXT    | NOT NULL                                |
| `plantao`         | TEXT    | NOT NULL, CHECK (`Diurno` ou `Noturno`) |
| `farmaceutico_id` | INTEGER | FK → farmaceuticos, NULL permitido      |
| `ativo`           | INTEGER | NOT NULL, DEFAULT 1                     |

### 2.6 `usuarios`

| Coluna   | Tipo    | Restrição              |
| -------- | ------- | ---------------------- |
| `id`     | INTEGER | PK                     |
| `nome`   | TEXT    | NOT NULL               |
| `email`  | TEXT    | UNIQUE, NULL permitido |
| `perfil` | TEXT    | NOT NULL               |
| `ativo`  | INTEGER | NOT NULL, DEFAULT 1    |

### 2.7 `ocorrencias` (tabela central)

| Coluna                  | Tipo    | Restrição                         | Observação                                           |
| ----------------------- | ------- | --------------------------------- | ---------------------------------------------------- |
| `id`                    | INTEGER | PK                                | —                                                    |
| `data_ocorrencia`       | TEXT    | NOT NULL                          | Formato `YYYY-MM-DD`                                 |
| `prontuario`            | TEXT    | NOT NULL                          | —                                                    |
| `numero_prescricao`     | TEXT    | NOT NULL                          | Aceita texto livre                                   |
| `medicamento_id`        | INTEGER | NOT NULL, FK                      | → `medicamentos(id)`                                 |
| `tipo_erro_id`          | INTEGER | NOT NULL, FK                      | → `tipos_erro(id)`                                   |
| `setor_id`              | INTEGER | NOT NULL, FK                      | → `setores(id)`                                      |
| `quantidade_prescrita`  | REAL    | NOT NULL                          | ≥ 0                                                  |
| `quantidade_dispensada` | REAL    | NULL                              | NULL = "não dispensado"                              |
| `diferenca_quantidade`  | REAL    | NOT NULL                          | Calculada no service                                 |
| `hora_prescricao`       | TEXT    | NULL                              | Formato `HH:MM` (sem conversão!)                     |
| `hora_dispensacao`      | TEXT    | NULL                              | Formato `HH:MM` (sem conversão!)                     |
| `diferenca_minutos`     | INTEGER | NULL                              | Calculado no service                                 |
| `classificacao_horario` | TEXT    | NOT NULL, DEFAULT `Não informado` | `Antecipada`/`No horário`/`Atrasada`/`Não informado` |
| `plantao`               | TEXT    | NOT NULL, CHECK                   | `Diurno`/`Noturno`                                   |
| `farmaceutico_id`       | INTEGER | NOT NULL, FK                      | → `farmaceuticos(id)`                                |
| `assistente_id`         | INTEGER | NULL, FK                          | → `assistentes(id)`                                  |
| `responsavel_erro`      | TEXT    | NOT NULL, CHECK                   | `Farmacêutico`/`Assistente`                          |
| `observacoes`           | TEXT    | NULL                              | —                                                    |
| `status`                | TEXT    | NOT NULL, DEFAULT `Ativa`         | `Ativa`/`Concluida`/`Excluida`                       |
| `usuario_cadastro`      | TEXT    | NOT NULL                          | Nome do usuário                                      |
| `criado_em`             | TEXT    | NOT NULL                          | ISO 8601                                             |
| `atualizado_em`         | TEXT    | NOT NULL                          | ISO 8601                                             |
| `excluido_em`           | TEXT    | NULL                              | ISO 8601, preenchido no soft delete                  |

**Regra de integridade (CHECK):**

```sql
CHECK (
  (responsavel_erro = 'Farmacêutico' AND assistente_id IS NULL)
  OR
  (responsavel_erro = 'Assistente' AND assistente_id IS NOT NULL)
)
```

### 2.8 logs

| Coluna         | Tipo    | Restrição           |
| -------------- | ------- | ------------------- |
| id             | INTEGER | PK                  |
| data_hora      | TEXT    | NOT NULL (ISO 8601) |
| usuario        | TEXT    | NOT NULL            |
| acao           | TEXT    | NOT NULL            |
| tabela         | TEXT    | NOT NULL            |
| registro       | TEXT    | NULL                |
| valor_anterior | TEXT    | NULL (JSON string)  |
| valor_novo     | TEXT    | NULL (JSON string)  |

### 2.9 configuracoes

| Coluna Tipo Restrição |      |          |
| --------------------- | ---- | -------- |
| chave                 | TEXT | PK       |
| valor                 | TEXT | NOT NULL |

## 3. Índices

Para performance em filtros e ordenação:

```SQL
CREATE INDEX idx_ocorrencias_data ON ocorrencias(data_ocorrencia);
CREATE INDEX idx_ocorrencias_status ON ocorrencias(status);
CREATE INDEX idx_ocorrencias_setor ON ocorrencias(setor_id);
CREATE INDEX idx_ocorrencias_farmaceutico ON ocorrencias(farmaceutico_id);
CREATE INDEX idx_ocorrencias_tipo_erro ON ocorrencias(tipo_erro_id);
CREATE INDEX idx_logs_data ON logs(data_hora);
```

## 4. Decisões de Modelagem

Decisão Motivo
| ----------------------- | ---- |
IDs numéricos (INTEGER) | Performance e simplicidade. O "código visível" (OCR000001) é gerado na aplicação, não no banco. |
hora\_\* como TEXT HH:MM | Evita o bug do GAS que converte Time para Date. |
quantidade_dispensada NULL | Diferencia "não dispensado" (NULL) de "dispensado zero" (0) |
classificacao_horario calculado | Mantido como coluna para consultas rápidas em dashboards. |
Soft delete em ocorrências | Preserva auditoria. |
setores como tabela | Elimina inconsistência de digitação. |
Sem FK declarada para usuario_cadastro | O usuário é gravado por nome (string) para simplificar. |
