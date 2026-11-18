# Dia 12 — Frontend: Dashboard Interativo

## Objetivo
Conectar filtros, KPIs e gráficos Canvas com cross-filter.

## Pré-requisitos
- [ ] Dias 09 e 11 concluídos.

## Passo a passo
1. Descomente D12-B01 em `public/js/dashboard.js` e o script correspondente no HTML.
2. Depois descomente D12-B02 em `public/js/charts.js` e o script correspondente no HTML.
3. No sistema, aplique um filtro e clique em uma barra para observar o chip.
4. Clique novamente na mesma barra para remover o filtro.
5. Redimensione a janela e confira os gráficos.

## Conceitos
- `requestAnimationFrame` anima sem bloquear a atualização da tela.
- Canvas desenha pixels; o callback de clique liga uma região desenhada ao filtro.

## Blocos a descomentar
- D12-B01 — filtros, chips e KPIs.
- D12-B02 — gráficos e cross-filter.

## Teste do Dia
- [ ] KPIs e gráficos refletem filtros aplicados.
- [ ] O chip remove o filtro e o estado vazio permanece compreensível.
- [ ] `node --check` passa nos dois módulos JavaScript.

## Se travar, respire e confira
- Verifique primeiro JSON e nomes das propriedades da API.
- Confirme que o listener de clique mapeia a categoria selecionada.

## Reflexão final
Explique em três frases como uma barra consegue filtrar os demais gráficos.
