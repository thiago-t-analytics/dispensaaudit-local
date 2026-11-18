# Dia 04 — Banco de Dados SQLite

## Objetivo
Entender as tabelas centrais e suas relações usando uma base de treinamento.

## Pré-requisitos
- [ ] Dia 03 concluído.
- [ ] Cópia isolada do banco disponível.

## Passo a passo
1. Abra `database/schema.sql` e localize `ocorrencias`, `medicamentos`, `setores` e `logs`.
2. Identifique `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `CHECK` e índices.
3. Descomente D04-B01 → D04-B03 em `database/schema.sql`, nessa ordem.
4. Descomente D04-B04 em `scripts/setup-db.js` e execute `npm run db:setup` somente numa cópia descartável.
5. Abra a base de treinamento no DB Browser for SQLite e observe a estrutura criada.
6. Desenhe as relações `ocorrencias` → medicamento, tipo de erro, setor e equipe.

## Conceitos
- Schema descreve estrutura e restrições; seed insere dados iniciais.
- Chave estrangeira liga registros e reduz referências inválidas.

## Blocos a descomentar
- D04-B01 — usuários e tabelas de referência.
- D04-B02 — ocorrências e índices; requer D04-B01.
- D04-B03 — logs, configurações e view; requer D04-B01 e D04-B02.
- D04-B04 — executor do schema; requer os três blocos anteriores e uma cópia descartável.

## Teste do Dia
- [ ] A Amanda aponta a chave estrangeira do medicamento e sua tabela de destino.
- [ ] Nenhum dado real foi alterado.
- [ ] `node --check scripts/setup-db.js` passa depois de descomentar.

## Se travar, respire e confira
- Verifique o caminho exato do arquivo aberto no DB Browser.
- Compare o nome da coluna com `schema.sql`.

## Reflexão final
Explique em três frases o que uma chave estrangeira protege.
