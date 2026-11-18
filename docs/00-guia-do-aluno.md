# Guia do Aluno — Amanda

Bem-vinda! Ao longo de 15 encontros, você vai entender e experimentar cada camada
do DispensaAudit Local. A meta não é decorar código: é conseguir explicar de onde
um dado vem, como é validado e como aparece na tela.

## Como usar este curso

1. Trabalhe sempre na branch/cópia de treinamento combinada com o mentor.
2. Use apenas `database/seed-demo.sql` numa cópia descartável. Não copie dados do
   seed local ignorado, da planilha, prontuários, credenciais ou `.env` para mensagens,
   screenshots ou commits.
3. Leia o objetivo e o teste do dia antes de começar.
4. Localize os marcadores `Dxx-Bxx` nos arquivos. Descomente somente o corpo entre
   `DESCOMENTE DAQUI` e `ATÉ AQUI`; não remova as linhas marcadoras.
5. Depois de cada exercício, rode o teste e faça um checkpoint Git combinado.
6. Se algo falhar, guarde a mensagem completa e descreva o menor passo que reproduz o erro.
7. Em HTML, habilite os links comentados; em CSS e templates, siga o checkpoint do
   arquivo e ative-os somente na etapa indicada. `package.json` e imagens binárias
   não recebem comentários para não invalidar seus formatos.

## Seu percurso

| Dia | Você vai… | Aula |
|---|---|---|
| 01 | Preparar as ferramentas e conhecer o produto | [Instalação](aulas/dia-01-instalacao.md) |
| 02 | Criar checkpoints com Git e entender o GitHub | [Git](aulas/dia-02-git.md) |
| 03 | Encontrar cada camada e seguir o fluxo | [Estrutura do projeto](aulas/dia-03-estrutura.md) |
| 04 | Ler tabelas, chaves e relações SQLite | [Banco de dados](aulas/dia-04-banco-de-dados.md) |
| 05 | Recriar e popular uma base de treinamento | [Seed](aulas/dia-05-seed.md) |
| 06 | Ver uma rota Express responder a HTTP | [Backend: Express](aulas/dia-06-backend-express.md) |
| 07 | Percorrer um CRUD de ponta a ponta | [Backend: CRUDs](aulas/dia-07-backend-crud.md) |
| 08 | Entender validação, transação e auditoria | [Backend: ocorrências](aulas/dia-08-backend-ocorrencias.md) |
| 09 | Relacionar SQL agregado aos KPIs | [Backend: dashboard](aulas/dia-09-backend-dashboard.md) |
| 10 | Construir a estrutura visual das páginas | [Frontend: HTML e CSS](aulas/dia-10-frontend-html-css.md) |
| 11 | Entender estado, fetch e navegação SPA | [Frontend: JavaScript](aulas/dia-11-frontend-javascript.md) |
| 12 | Sincronizar filtros, KPIs e gráficos | [Frontend: dashboard](aulas/dia-12-frontend-dashboard.md) |
| 13 | Trabalhar com ocorrências, CRUDs e logs | [Frontend: operações](aulas/dia-13-frontend-operacoes.md) |
| 14 | Gerar documentos PDF com Puppeteer | [PDF](aulas/dia-14-pdf.md) |
| 15 | Validar e apresentar o produto local | [Produção local](aulas/dia-15-producao.md) |

## Antes de começar

- [ ] Consigo abrir o terminal integrado do VS Code.
- [ ] Sei qual pasta é a cópia/branch didática.
- [ ] Sei como confirmar com o mentor antes de resetar banco ou remover arquivos.
- [ ] Sei que a inicialização local completa acontece depois das aulas de banco e backend.
- [ ] Sei que cada bloco pode estar em vários arquivos e que a aula informa a ordem.
- [ ] Tenho um lugar para registrar perguntas e descobertas no [diário de bordo](06-diario-de-bordo.md).

### Quando você travar

Respire e confira, nesta ordem: arquivo salvo; terminal do servidor; console do
navegador; aba Network; URL/método HTTP; JSON recebido; nomes dos campos; último
checkpoint Git. Não apague nem resete a base para “ver se resolve”.

Ao terminar cada aula, escreva três frases suas: o que entendeu, o que ainda quer
investigar e algo que descobriu sem ajuda.