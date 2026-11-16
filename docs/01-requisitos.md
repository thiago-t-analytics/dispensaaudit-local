# 01 — Requisitos do Sistema

> **Este documento responde à pergunta: "O que o sistema faz?"**
> Ele foi construído a partir da análise do sistema original (Google Apps Script)
> e da planilha real `DispensaAudit.xlsx` contendo dados em produção.

---

## 1. Visão Geral

O **DispensaAudit** é um sistema de gestão de não conformidades na dispensação
hospitalar. Ele permite:

- Registrar ocorrências de erro de dispensação.
- Acompanhar o status (Ativa / Concluída).
- Analisar indicadores por meio de KPIs e gráficos.
- Gerar relatórios em PDF.
- Manter um registro auditável (logs) de todas as ações.

---

## 2. Atores

| Ator              | Descrição                                     | Permissões                                                                        |
| ----------------- | --------------------------------------------- | --------------------------------------------------------------------------------- |
| **Administrador** | Usuário técnico                               | Todas as ações                                                                    |
| **Administração** | Colaboradora que opera o sistema no dia a dia | Registra ocorrências, acessa dashboard, gera relatórios, edita/exclui ocorrências |
| **Coordenação**   | Coordenadora de Farmácia                      | Consulta, gera relatórios gerenciais                                              |
| **Farmacêutica**  | Profissional que analisa as ocorrências       | Consulta, gera relatórios                                                         |

> **Nota de escopo**: no projeto local, a autenticação é **simplificada** — o usuário
> apenas se identifica numa lista (sem senha), igual ao sistema original.

---

## 3. Requisitos Funcionais (RF)

### RF-01 — Registrar Ocorrência

O usuário deve poder registrar uma não conformidade de dispensação com os
seguintes dados:

| Campo                | Tipo        | Obrigatório | Regra                                         |
| -------------------- | ----------- | ----------- | --------------------------------------------- |
| DataOcorrencia       | Data        | Sim         | Não pode ser futura                           |
| Prontuario           | Texto       | Sim         | —                                             |
| NumeroPrescricao     | Texto       | Sim         | Aceita valores como "8162149 e 8164606"       |
| Medicamento          | Referência  | Sim         | FK → Medicamentos                             |
| TipoErro             | Referência  | Sim         | FK → TiposErro                                |
| Setor                | Referência  | Sim         | FK → Setores                                  |
| QuantidadePrescrita  | Número      | Sim         | ≥ 0                                           |
| QuantidadeDispensada | Número      | Não         | ≥ 0, pode ser `NULL`                          |
| HoraPrescricao       | Texto HH:MM | Não         | —                                             |
| HoraDispensacao      | Texto HH:MM | Não         | —                                             |
| Plantao              | Enum        | Sim         | `Diurno` ou `Noturno`                         |
| Farmaceutico         | Referência  | Sim         | FK → Farmaceuticos                            |
| Assistente           | Referência  | Condicional | Obrigatório se `ResponsavelErro = Assistente` |
| ResponsavelErro      | Enum        | Sim         | `Farmacêutico` ou `Assistente`                |
| Observacoes          | Texto       | Não         | Livre                                         |

**Regras de cálculo automático:**

- `DiferencaQuantidade = QuantidadePrescrita - (QuantidadeDispensada ?? 0)`
- Se `HoraPrescricao` e `HoraDispensacao` existirem:
  - `DiferencaMinutos = (horaDispensacao - horaPrescricao) em minutos`
  - `ClassificacaoHorario`:
    - `< -15 min` → `Antecipada`
    - `> 30 min` → `Atrasada`
    - Caso contrário → `No horário`
  - Se classificada como Antecipada ou Atrasada, adiciona observação automática.

### RF-02 — Editar Ocorrência

O usuário deve poder editar qualquer campo de uma ocorrência existente.

### RF-03 — Excluir Ocorrência

O usuário deve poder **excluir** uma ocorrência (ex.: lançamento incorreto).
A exclusão deve ser **lógica** (soft delete) — ou seja, o registro não é removido
fisicamente, mas marcado como `Excluida`. Isso preserva a auditoria.

### RF-04 — Alternar Status

O usuário pode alternar entre `Ativa` e `Concluida`.

### RF-05 — Dashboard

Exibir:

- **KPIs**: total de ocorrências, ocorrências no mês, distribuição Ativa/Concluída,
  setor com mais ocorrência, plantão com mais ocorrência, medicamento mais envolvido,
  tipo de erro mais frequente.
- **Gráficos de barras**: por tipo de erro, medicamento, farmacêutico, assistente, setor.
- **Tabela paginada**: lista de ocorrências com filtros.

### RF-06 — Filtros

Filtrar ocorrências por: período, plantão, farmacêutico, assistente, medicamento,
tipo de erro, setor, status.

### RF-07 — CRUDs de Configuração

CRUD completo para:

- Medicamentos
- Tipos de Erro
- Farmacêuticos
- Assistentes
- **Setores** (novo — antes era texto livre)

O "delete" dos CRUDs de referência é **lógico** (Status → Inativo), para
preservar histórico.

### RF-08 — Gerar PDF Individual

Gerar um PDF com os dados de uma única ocorrência, a partir de um template HTML.

### RF-09 — Gerar PDF por Farmacêutico

Gerar um PDF consolidando as ocorrências de um farmacêutico num período.

### RF-10 — Gerar PDF Gerencial

Gerar um PDF com KPIs, gráficos e rankings de um período.

### RF-11 — Logs de Auditoria

Registrar automaticamente toda operação de escrita:
`{ data_hora, usuario, acao, tabela, registro, valor_anterior, valor_novo }`.

---

## 4. Requisitos Não Funcionais (RNF)

| Código | Requisito                                                      |
| ------ | -------------------------------------------------------------- |
| RNF-01 | O sistema deve rodar em `localhost:3000`                       |
| RNF-02 | Deve funcionar sem conexão com a internet (após instalado)     |
| RNF-03 | Tempo de resposta das APIs < 500ms para até 10.000 ocorrências |
| RNF-04 | Interface responsiva (desktop e mobile)                        |
| RNF-05 | Código comentado linha a linha nos pontos-chave                |
| RNF-06 | O banco deve ser versionado via SQL (`schema.sql`)             |
| RNF-07 | Deve ser possível reiniciar o banco (`npm run db:reset`)       |
| RNF-08 | PDFs gerados devem ser visualizáveis no navegador              |

---

## 5. Entidades do Domínio (derivadas da planilha real)

| Entidade         | Descrição                    | Origem (planilha)                                |
| ---------------- | ---------------------------- | ------------------------------------------------ |
| **Usuario**      | Pessoas que usam o sistema   | aba `USUARIOS`                                   |
| **Medicamento**  | Catálogo de medicamentos     | aba `MEDICAMENTOS` (354 registros)               |
| **TipoErro**     | Classificação dos erros      | aba `TiposErro` (25 registros)                   |
| **Farmaceutico** | Profissional farmacêutico    | aba `FARMACEUTICOS` (8 registros)                |
| **Assistente**   | Técnico/auxiliar de farmácia | aba `ASSISTENTES` (14 registros)                 |
| **Setor**        | Setor hospitalar             | **NOVO** — antes era texto livre nas ocorrências |
| **Ocorrencia**   | Registro de não conformidade | aba `OCORRENCIAS` (146 registros)                |
| **Log**          | Trilha de auditoria          | aba `LOGS` (307 registros)                       |
| **Configuracao** | Parâmetros do sistema        | aba `CONFIGURACOES`                              |

---

## 6. Regras de Negócio (RN)

| Código | Regra                                                                                                             |
| ------ | ----------------------------------------------------------------------------------------------------------------- |
| RN-01  | Um farmacêutico só pode ser associado a um plantão (`Diurno` ou `Noturno`)                                        |
| RN-02  | Um assistente pode ter ou não um farmacêutico vinculado                                                           |
| RN-03  | Se `Farmaceutico.Tipo = "Folguista"`, o assistente pode ser de qualquer plantão; se `"Fixo"`, só do mesmo plantão |
| RN-04  | A `DiferencaQuantidade` nunca é negativa por causa de `NULL` — `NULL` é tratado como 0 no cálculo                 |
| RN-05  | `ClassificacaoHorario` só é calculada se ambas as horas estiverem preenchidas                                     |
| RN-06  | Toda ocorrência começa com status `Ativa`                                                                         |
| RN-07  | A exclusão de ocorrência é **lógica** (status → `Excluida`), nunca física                                         |
| RN-08  | Um `Setor` não pode ser excluído se houver ocorrências vinculadas (só pode ser inativado)                         |
| RN-09  | O `ResponsavelErro` determina a obrigatoriedade de `ID_Assistente`                                                |
