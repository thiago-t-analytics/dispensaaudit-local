# Dia 05 — Seed e Dados de Treinamento

## Objetivo
Inicializar e popular uma base descartável de forma reproduzível.

## Pré-requisitos
- [ ] Dia 04 concluído.
- [ ] Cópia/branch de treinamento e backup confirmado.

## Passo a passo
1. Confirme que o Dia 04 criou a estrutura na cópia descartável; não repita o setup sem necessidade.
2. Descomente D05-B01 em `database/seed-demo.sql`.
3. Descomente D05-B02 em `scripts/seed-demo-db.js`.
4. Execute `npm run db:seed:demo` e confira os registros fictícios.
5. Compare a tabela `ocorrencias` no SQLite Browser com o conteúdo sintético do seed.
6. Não use `database/seed.sql` nem `DispensaAudit.xlsx` nos exercícios: são dados locais ignorados pelo Git.
7. Não execute `npm run db:reset` até o mentor confirmar a base ativa.

## Conceitos
- Um seed é um conjunto reprodutível de dados iniciais para desenvolvimento.
- Um reset pode ser destrutivo; identificar a base antes de executar é parte da segurança.

## Blocos a descomentar
- D05-B01 — dados sintéticos em `database/seed-demo.sql`.
- D05-B02 — executor `scripts/seed-demo-db.js`; requer D05-B01 e D04 completo.

## Teste do Dia
- [ ] A base descartável contém os dois registros sintéticos de demonstração.
- [ ] O servidor continua lendo a base isolada correta.

## Se travar, respire e confira
- Confira o terminal e o caminho do banco; não apague arquivos SQLite manualmente.
- Compare com o `schema.sql` e confirme se o seed foi executado.

## Reflexão final
Em três frases, diferencie estrutura, seed e dados criados durante o uso.
