# Dia 13 — Ocorrências, CRUDs e Logs

## Objetivo
Percorrer os principais fluxos operacionais e verificar seus efeitos.

## Pré-requisitos
- [ ] Dias 08 e 11 concluídos; Dia 12 ajuda a conectar a navegação.

## Passo a passo
1. Descomente D13-B01 nos scripts de ocorrência e nas tags correspondentes no HTML; abra a lista, use filtros e paginação.
2. Na página de lançamento, complete a identificação e adicione itens ao lote de teste.
3. Abra Configurações e observe como os cadastros alimentam os formulários.
4. Descomente D13-B02 (CRUDs, logs e consulta da API de logs), habilite sua rota e encontre o registro da ação de demonstração.
5. Revise `ocorrencias.js`, `ocorrencias-lista.js`, `ocorrencias-lote.js`, `cruds.js` e `logs.js`.

## Conceitos
- Estado do formulário e estado persistido no servidor são coisas diferentes.
- Auditoria registra ações para permitir rastreabilidade.

## Blocos a descomentar
- D13-B01 — formulário, listagem e cadastro em lote.
- D13-B02 — configurações, logs e apresentação tabular.

## Teste do Dia
- [ ] Um registro de treinamento aparece na listagem e a ação correspondente nos logs.
- [ ] Nenhum cadastro é feito com dados reais.
- [ ] As rotas de logs são habilitadas somente depois do grupo D13-B02.

## Se travar, respire e confira
- Referências dos dropdowns vêm da API; confirme carregamento dos dados.
- Use Network para diferenciar erro de envio de erro de renderização.

## Reflexão final
Descreva em três frases o que acontece entre salvar um item e vê-lo na lista.
