# Dia 09 — Backend: Dashboard

## Objetivo
Relacionar filtros da API, agregações SQL e objetos de KPI/gráficos.

## Pré-requisitos
- [ ] Dias 07 e 08 concluídos.

## Passo a passo
1. Descomente D09-B01 em `src/services/kpis.js` e compare o cálculo com dados fictícios.
2. Descomente D09-B02 em `src/services/graficos.js` e `src/routes/dashboard.js`; habilite D09-B02 em `src/routes/index.js`.
3. Observe as consultas e agregações usadas para setores, erros e períodos.
4. Abra `http://localhost:3000/api/dashboard` e examine a resposta JSON.
5. Experimente filtros seguros e compare os campos retornados.

## Conceitos
- `COUNT` resume linhas e `GROUP BY` cria grupos para comparação.
- O formato da resposta da API é um contrato com o frontend.

## Blocos a descomentar
- D09-B01 — cálculo dos KPIs.
- D09-B02 — agregações, gráficos e rotas do dashboard.

## Teste do Dia
- [ ] Você identifica os campos `kpis` e `graficos` na resposta.
- [ ] Um filtro altera os dados coerentemente sem erro no servidor.
- [ ] `node --check` passa nos módulos do dashboard.

## Se travar, respire e confira
- Verifique nomes dos parâmetros e campos da resposta.
- Comece com a consulta agregada mais simples e confirme o SQL.

## Reflexão final
Descreva em três frases como dados de várias ocorrências viram um KPI.
