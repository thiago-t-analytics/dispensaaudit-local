# Dia 10 — Frontend: HTML e CSS

## Objetivo
Localizar a estrutura de páginas, os tokens de design e as regras responsivas.

## Pré-requisitos
- [ ] Dia 03 concluído.

## Passo a passo
1. Abra `public/index.html`; a estrutura semântica de sidebar, header, dashboard e formulários já existe para leitura.
2. Descomente os links D10-B02 (tokens/base/componentes) e D10-B03 (layout e páginas), sem remover a ordem das camadas.
3. Use DevTools para inspecionar um botão e encontrar a regra CSS que o estiliza.
4. Compare a sidebar em desktop e em viewport estreita de 375 px.

## Conceitos
- HTML representa estrutura e significado; CSS controla aparência e adaptação ao viewport.
- Custom properties permitem reutilizar tokens de cor, espaço e tipografia.

## Blocos a descomentar
- D10-B01 — estrutura semântica das páginas.
- D10-B02 — tokens e componentes.
- D10-B03 — layout responsivo e estilos de página.

## Teste do Dia
- [ ] As cinco páginas continuam navegáveis.
- [ ] A 375 px não aparece rolagem horizontal inesperada.
- [ ] Os nove links CSS estão ativos e a página deixa de aparecer sem estilo.

## Se travar, respire e confira
- Veja se o `<link>` do CSS está na página e se o seletor alcança o elemento.
- No DevTools, descubra qual regra está sobrescrevendo outra.

## Reflexão final
Explique em três frases como HTML, CSS e responsividade se complementam.
