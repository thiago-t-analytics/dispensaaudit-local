# Dia 07 — Backend: CRUDs

## Objetivo
Seguir um CRUD de medicamento por query, service e rota.

## Pré-requisitos
- [ ] Dias 04 e 06 concluídos.

## Passo a passo
1. Descomente D07-B01 nos arquivos de conexão, validação, query, service e rota de medicamentos.
2. Habilite o grupo D07-B01 em `src/routes/index.js`.
3. Consulte `GET /api/medicamentos` na API ou pela interface.
4. Descomente D07-B02 nos arquivos de tipos de erro, setores, farmacêuticos, assistentes e usuários; habilite o grupo D07-B02 em `src/routes/index.js`.
5. Crie/edite/inative apenas um registro de demonstração na base isolada.

## Conceitos
- CRUD resume Create, Read, Update e Delete; neste sistema exclusão pode ser lógica/inativação.
- A rota lida com HTTP, o service com regras, e a query com persistência.

## Blocos a descomentar
- D07-B01 — CRUD de medicamentos.
- D07-B02 — comparação dos cadastros de referência.

## Teste do Dia
- [ ] A listagem apresenta o cadastro de demonstração.
- [ ] O mentor confirma que nenhuma informação real foi alterada.
- [ ] `node --check` passa nos arquivos de ambos os blocos.

## Se travar, respire e confira
- Veja método HTTP, URL, corpo e status na aba Network.
- Leia a validação e a mensagem do terminal antes de alterar código.

## Reflexão final
Explique em três frases o papel de query, service e rota.
