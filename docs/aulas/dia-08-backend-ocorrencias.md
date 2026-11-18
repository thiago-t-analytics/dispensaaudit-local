# Dia 08 — Backend: Ocorrências e Regras

## Objetivo
Compreender a validação, cálculos, atomicidade do lote e auditoria.

## Pré-requisitos
- [ ] Dias 04, 05 e 07 concluídos.

## Passo a passo
1. Confirme que D07-B01 já liberou validadores, formatadores e o serviço de logs.
2. Descomente D08-B01 em `src/db/queries/ocorrencias.js`, `src/services/ocorrencias.js` e `src/routes/ocorrencias.js`; habilite o grupo D08-B01 em `src/routes/index.js`.
3. Localize validação de identificação, normalização, cálculo e tratamento de erro.
4. Procure a transação do cadastro em lote e a chamada de auditoria.
5. Na base descartável, teste uma requisição inválida e compare contagens antes/depois.

## Conceitos
- Validação protege as regras antes da persistência.
- Transação garante que um lote inteiro confirme ou seja revertido.

## Blocos a descomentar
- D08-B01 — módulo completo de ocorrências (query, serviço, rota, regras, transação e auditoria).

## Teste do Dia
- [ ] Um lote inválido não deixa registros parciais.
- [ ] Uma operação válida gera o log esperado na base de treinamento.
- [ ] `node --check` passa nos três arquivos descomentados.

## Se travar, respire e confira
- Compare entrada original, valor normalizado e erro de validação.
- Verifique o começo e o fim da transação; não use dados pessoais no teste.

## Reflexão final
Em três frases, explique por que validar o lote inteiro antes de gravar.
