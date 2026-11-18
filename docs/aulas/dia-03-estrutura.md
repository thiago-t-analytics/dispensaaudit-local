# Dia 03 — Estrutura do Projeto

## Objetivo
Encontrar o arquivo responsável por cada parte do produto.

## Pré-requisitos
- [ ] Dias 01 e 02 concluídos.

## Passo a passo
1. Leia `README.md`, `docs/01-requisitos.md` e `docs/02-arquitetura.md`.
2. Localize `public/`, `src/`, `database/`, `templates/`, `scripts/` e `docs/`.
3. Descomente D03-B01 em `scripts/create-structure.js` e rode-o somente a partir de uma pasta de laboratório vazia, fora deste repositório.
4. Compare a árvore criada com este projeto; escolha uma ocorrência e desenhe formulário → endpoint → service → query → SQLite.
5. Localize o endpoint e os arquivos correspondentes antes de ler o código em detalhe.

## Conceitos
- Uma camada agrupa responsabilidades relacionadas.
- Imports e chamadas revelam dependências mais confiavelmente que o nome de uma pasta sozinho.

## Blocos a descomentar
- D03-B01 — scaffold de pastas em `scripts/create-structure.js`; executar fora do repositório, em diretório descartável.

## Teste do Dia
- [ ] Encontre rota, serviço e consulta de ocorrências.
- [ ] Encontre o HTML de um relatório PDF e o serviço que o gera.
- [ ] O scaffold foi executado sem criar arquivos dentro do repositório do curso.

## Se travar, respire e confira
- Procure primeiro `/api/ocorrencias` nas rotas.
- Depois siga os `require()` para service e query.

## Reflexão final
Descreva em três frases o caminho que um dado percorre da tela até o banco e de volta.
