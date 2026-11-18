# Dia 06 — Backend: Express

## Objetivo
Ver uma requisição HTTP chegar ao Express e receber uma resposta JSON.

## Pré-requisitos
- [ ] Dias 01, 04 e 05 concluídos.

## Passo a passo
1. Leia o cabeçalho D06-B01 e retire o `//` do corpo de `src/server.js`, sem alterar as linhas delimitadoras.
2. Siga `src/routes/index.js` até a rota de health check, que fica ativa desde o início.
3. Inicie `npm run dev` e abra `http://localhost:3000/api/health`.
4. No terminal, localize o log correspondente à requisição.

## Conceitos
- Express conecta middleware e rotas para tratar requisições HTTP.
- Status HTTP e corpo JSON comunicam resultado ao cliente.

## Blocos a descomentar
- D06-B01 — corpo de `src/server.js`: inicialização Express, middleware e servidor.

## Teste do Dia
- [ ] O endpoint retorna JSON com confirmação de saúde da aplicação.
- [ ] O terminal registra o pedido e o servidor continua ativo.
- [ ] `node --check src/server.js` não aponta erro após descomentar.

## Se travar, respire e confira
- Confirme `localhost`, porta 3000 e caminho `/api/health`.
- Erro de conexão costuma significar servidor parado; 404 costuma indicar URL errada.

## Reflexão final
Resuma em três frases o percurso de uma chamada HTTP no Express.
