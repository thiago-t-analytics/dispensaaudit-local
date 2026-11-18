# Dia 14 — Geração de PDF

## Objetivo
Rastrear os dados de um relatório até o PDF final A4.

## Pré-requisitos
- [ ] Dias 07–09 e 11 concluídos.

## Passo a passo
1. Descomente D14-B01 em `src/services/templateEngine.js` e identifique placeholders `{{chave}}`.
2. Descomente D14-B02 no service/route de PDF, `public/js/pdf.js` e habilite o grupo PDF em `src/routes/index.js`.
3. Abra um template em `templates/` e acompanhe como dados viram HTML.
4. Gere relatórios de teste; abra-os e confira paginação, margem e logos.
5. Compare a chamada do botão no frontend com o endpoint correspondente.

## Conceitos
- Um template separa conteúdo/apresentação dos dados do relatório.
- Puppeteer renderiza a página com Chromium e imprime em PDF.

## Blocos a descomentar
- D14-B01 — motor de templates e placeholders.
- D14-B02 — serviço, rota, templates HTML e imagens.

## Teste do Dia
- [ ] PDF individual, por farmacêutico e gerencial abrem corretamente.
- [ ] Os dados e imagens são exibidos sem distorção.
- [ ] `node --check` passa nos módulos de PDF.

## Se travar, respire e confira
- Se o PDF está vazio, examine o HTML renderizado e o objeto de dados.
- Se uma logo falta, verifique o arquivo e o caminho esperado pelo serviço.

## Reflexão final
Explique em três frases por que o PDF começa como HTML.
