# Dia 11 — Frontend: JavaScript e SPA

## Objetivo
Entender estado compartilhado, chamadas `fetch` e navegação entre páginas.

## Pré-requisitos
- [ ] Dias 06 e 10 concluídos.

## Passo a passo
1. Descomente D11-B01 no final de `public/index.html` (state, API e UI), nessa ordem.
2. Descomente D11-B02 (`app.js`) depois do bloco base; os módulos de dashboard e operações continuam desligados até os próximos dias.
3. Abra DevTools → Network; navegue para Dashboard e observe a requisição API.
4. Compare JSON recebido, estado atualizado e conteúdo renderizado.

## Conceitos
- `fetch` envia pedidos HTTP do navegador e permite tratar a resposta assíncronamente.
- Uma SPA atualiza regiões da página e mantém estado entre módulos.

## Blocos a descomentar
- D11-B01 — estado, cliente API e utilitários de interface.
- D11-B02 — inicialização e navegação.

## Teste do Dia
- [ ] As cinco páginas abrem pela navegação.
- [ ] Uma requisição de dados retorna com sucesso na aba Network.
- [ ] Páginas sem seus módulos ainda não exibem erro `ReferenceError`.

## Se travar, respire e confira
- `X is not defined`: verifique a ordem de carregamento dos scripts.
- Fetch falhando: confirme servidor, URL, método, status e resposta.

## Reflexão final
Em três frases, relate como um clique termina em conteúdo novo na tela.
