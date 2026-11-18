# Guia do Mentor — DispensaAudit Local

> Roteiro de 15 encontros de aproximadamente 2 horas. O objetivo é ajudar Amanda
> a raciocinar e experimentar, não entregar a resposta pronta.

## Antes do primeiro encontro

- [ ] Confirmar Node.js 20+, npm, Git e acesso ao repositório.
- [ ] Criar uma cópia/branch de treinamento e uma base de dados descartável.
- [ ] Não compartilhar `.env`, banco real nem prontuários/dados identificáveis.
- [ ] Antes do Dia 06, não iniciar o servidor: o código está comentado por etapas.
- [ ] A partir do Dia 06, conferir `npm run dev` e `/api/health` após liberar D06-B01.
- [ ] Descomentar apenas o corpo entre os marcadores; manter as linhas `DESCOMENTE DAQUI` e `ATÉ AQUI`.

### Roteiro fixo de cada encontro

1. **Aquecimento — 5 min:** “O que você lembra da aula anterior?” Peça um exemplo.
2. **Demonstração — 10 min:** mostre primeiro o resultado esperado.
3. **Mão na massa — 60 min:** Amanda lê o bloco, explica o objetivo, altera/descomenta, salva e testa.
4. **Investigação — 20 min:** depure com perguntas, sem tomar o teclado.
5. **Fechamento — 15 min:** rode o teste do dia, faça checkpoint Git e preencha o diário.
6. **Margem — 10 min:** dúvidas e preparação do próximo encontro.

### Prompts de debug prontos

- “Qual foi a primeira mensagem de erro? Vamos começar por ela.”
- “O erro está no console do navegador (F12) ou no terminal do servidor?”
- “O servidor está ativo? O que retorna `/api/health`?”
- “Você salvou o arquivo certo e descomentou o par de delimitadores inteiro?”
- “O dado chega na aba Network? Compare a resposta JSON com o nome da propriedade usada.”
- “Qual é o menor passo que reproduz o problema?”
- “O que mudou desde o último checkpoint Git?”
- “Antes de alterar mais, consegue explicar o que você espera que este trecho faça?”

### Perguntas previsíveis

| Se Amanda perguntar… | Responda… |
|---|---|
| “Por que não fazemos tudo em um arquivo?” | Separar responsabilidades ajuda a localizar e testar cada tipo de trabalho. Vamos seguir um dado da tela até o banco. |
| “Por que precisa de rota e service?” | A rota traduz HTTP; o service aplica regras. Assim, a regra não depende de como foi chamada. |
| “Posso apagar este arquivo de banco?” | Só a cópia descartável. Nunca apague ou resete a base real sem backup e autorização. |
| “O erro é grande, por onde começo?” | Pela primeira linha do erro e pelo menor caso que o reproduz; depois siga os dados etapa por etapa. |
| “Preciso decorar os comandos?” | Não. Entenda o propósito, mantenha um caderno e use a documentação oficial. |
| “Por que o sistema não usa React?” | O escopo didático prioriza HTML, CSS e JavaScript nativos; a aplicação não precisa de framework para ensinar SPA. |

## Roteiro dos 15 dias

### DIA 01 — Visão geral e instalação
- [ ] **Objetivo:** executar a aplicação e identificar as ferramentas instaladas.
- **Aquecimento/demonstração:** mostrar a interface já pronta do mentor e desenhar navegador → API → banco.
- **Mão na massa:** conferir Node/npm/Git e instalar dependências. A branch didática não inicia o app antes das aulas de banco e backend.
- **Arquivos/blocos:** `README.md`, `package.json`, `.env.example`; D01-B01 (preparação, sem código a descomentar).
- **Teste do dia:** versões das ferramentas conferidas e dependências instaladas com `npm ci`.
- **Screenshot esperado:** VS Code com o projeto aberto e terminal mostrando versões do Node e npm.
- **Troubleshooting:** dependências ausentes → `npm ci`; não iniciar o servidor nesta aula.
- **Se travar:** pedir que Amanda diga qual comando rodou e leia a primeira mensagem do terminal.
- **Fechamento:** “Qual parte roda no navegador e qual parte roda no servidor?”

### DIA 02 — Git + GitHub
- [ ] **Objetivo:** guardar uma mudança pequena e localizar um checkpoint.
- **Pré-requisito:** Dia 01; acesso autorizado ao repositório remoto.
- **Mão na massa:** `git status`, `git diff`, `git add`, `git commit`; inspecionar `.gitignore`.
- **Arquivos/blocos:** `.gitignore`, `.vscode/tasks.json`; D02-B01.
- **Teste do dia:** `git status` limpo após commit; `.env` e banco local não devem ser publicados.
- **Screenshot esperado:** histórico com um commit didático sem dados privados.
- **Troubleshooting:** identidade ausente → configurar `user.name` e `user.email` localmente; conflito → parar e inspecionar antes de resolver.
- **Se travar:** perguntar “o que o diff mostra antes de salvar?”.
- **Fechamento:** explicar commit como checkpoint, não como backup de segredos.

### DIA 03 — Estrutura do projeto
- [ ] **Objetivo:** apontar onde moram interface, servidor, SQL e PDFs.
- **Pré-requisito:** Dia 01.
- **Mão na massa:** seguir `README.md`, `docs/01-requisitos.md` e `docs/02-arquitetura.md`; liberar D03-B01 e executar o scaffold somente numa pasta de laboratório vazia, fora do repositório.
- **Arquivos/blocos:** `scripts/create-structure.js` (D03-B01) e mapa de `src/`, `public/`, `database/`, `templates/`.
- **Teste do dia:** Amanda localiza a rota de ocorrências, a consulta SQL e a tela correspondente.
- **Screenshot esperado:** diagrama simples do fluxo com nomes reais dos arquivos.
- **Troubleshooting:** nomes parecidos confundem → procurar pelo endpoint e seguir imports.
- **Se travar:** dar apenas a próxima pasta para procurar; deixar que ela identifique o arquivo.
- **Fechamento:** registrar três camadas no diário.

### DIA 04 — Banco de dados SQLite
- [ ] **Objetivo:** explicar tabelas, chaves e relações essenciais.
- **Pré-requisito:** Dia 03; cópia de treinamento do banco.
- **Mão na massa:** abrir `database/schema.sql` no DB Browser; localizar `ocorrencias`, chaves estrangeiras e constraints.
- **Arquivos/blocos:** `database/schema.sql`, `docs/03-banco-de-dados.md`; D04-B01 → D04-B02 → D04-B03. O executor `scripts/setup-db.js` é D04-B04; `src/db/connection.js` só é liberado no D07-B01.
- **Teste do dia:** criar/inspecionar a estrutura numa base descartável e identificar como uma ocorrência aponta para medicamento e setor.
- **Screenshot esperado:** diagrama/tabelas do SQLite Browser, sem dados pessoais visíveis.
- **Troubleshooting:** banco bloqueado → encerrar a instância de teste; tabela não aparece → verificar caminho do arquivo aberto.
- **Se travar:** perguntar qual coluna guarda a relação e por que ela existe.
- **Fechamento:** distinguir schema (estrutura) de dados (linhas).

### DIA 05 — Seed e dados de treinamento
- [ ] **Objetivo:** recriar e popular uma base descartável de forma reproduzível.
- **Pré-requisito:** Dia 04; backup/cópia isolada.
- **Mão na massa:** ler `seed-demo.sql` e `seed-demo-db.js`; executar setup/seed apenas numa cópia descartável do projeto.
- **Arquivos/blocos:** `database/seed-demo.sql`, `scripts/seed-demo-db.js`; D05-B01 e D05-B02.
- **Teste do dia:** contagens de tabelas aumentam após seed; reiniciar o servidor não apaga os dados.
- **Screenshot esperado:** consultas de contagem e interface com dados de demonstração.
- **Troubleshooting:** seed duplicado → conferir os `INSERT OR IGNORE`; base vazia → confirmar se D04 foi descomentado e qual banco está aberto.
- **Se travar:** pedir para Amanda desenhar a sequência “criar estrutura → inserir dados”.
- **Fechamento:** reforçar que `db:setup` substitui a base, e os seeds locais/planilha não devem ser usados nem enviados ao GitHub.

### DIA 06 — Backend parte 1: Express
- [ ] **Objetivo:** seguir uma requisição até uma resposta HTTP.
- **Pré-requisito:** Dias 01, 04 e 05.
- **Mão na massa:** descomentar o corpo de `src/server.js`; estudar `src/routes/index.js`, cuja rota de saúde permanece ativa.
- **Arquivos/blocos:** D06-B01 — `src/server.js`; `/api/health` já está disponível no agregador mínimo.
- **Teste do dia:** abrir `/api/health`; identificar status HTTP e JSON.
- **Screenshot esperado:** resposta JSON no navegador e log da requisição no terminal.
- **Troubleshooting:** 404 → conferir caminho `/api/health`; conexão recusada → iniciar servidor/confirmar porta.
- **Se travar:** perguntar o que acontece antes e depois do middleware de log.
- **Fechamento:** definir endpoint com as próprias palavras.

### DIA 07 — Backend parte 2: CRUDs
- [ ] **Objetivo:** entender um CRUD de medicamento de ponta a ponta.
- **Pré-requisito:** Dias 04 e 06.
- **Mão na massa:** descomentar os arquivos de D07-B01 e depois D07-B02, além dos grupos correspondentes em `src/routes/index.js`.
- **Arquivos/blocos:** D07-B01 — conexão, validadores, formatadores, logs de escrita e CRUD de medicamentos; D07-B02 — queries, services e routes dos outros cadastros.
- **Teste do dia:** listar e criar/editar/inativar um cadastro de teste pela aplicação/API; observar o resultado no banco isolado.
- **Screenshot esperado:** item de demonstração atualizado e resposta da API.
- **Troubleshooting:** 400 → examinar validação/body; 500 → ler terminal; mudança ausente → confirmar método e ID da rota.
- **Se travar:** pedir para localizar cada camada antes de sugerir correção.
- **Fechamento:** diferenciar GET, POST, PUT e DELETE/inativação.

### DIA 08 — Backend parte 3: ocorrências e regras
- [ ] **Objetivo:** explicar as validações, cálculos e atomicidade do cadastro em lote.
- **Pré-requisito:** Dias 04, 05 e 07.
- **Mão na massa:** descomentar o módulo completo de ocorrências e seguir validação, regra, transação e auditoria no mesmo fluxo.
- **Arquivos/blocos:** D08-B01 — `src/db/queries/ocorrencias.js`, `src/services/ocorrencias.js` e `src/routes/ocorrencias.js`. A validação comum (`utils/`) e o service de logs já vêm do D07-B01.
- **Teste do dia:** enviar dados inválidos contra a cópia de treinamento e confirmar que nenhum registro parcial foi salvo.
- **Screenshot esperado:** resposta de validação e contagem do banco antes/depois iguais.
- **Troubleshooting:** campo obrigatório convertido incorretamente → comparar valor de entrada e valor normalizado; parcial salvo → revisar transação.
- **Se travar:** desenhar “validar todos → iniciar transação → gravar → log”.
- **Fechamento:** explicar por que atomicidade protege os dados.

### DIA 09 — Backend parte 4: Dashboard
- [ ] **Objetivo:** relacionar filtros, SQL agregado, KPIs e gráficos.
- **Pré-requisito:** Dias 07 e 08.
- **Mão na massa:** liberar D09-B01 para os KPIs; depois D09-B02 para gráficos e rota, incluindo o grupo da rota em `src/routes/index.js`.
- **Arquivos/blocos:** D09-B01 KPIs; D09-B02 agregações/rota.
- **Teste do dia:** consultar `/api/dashboard`, reconhecer os campos do JSON e mudar um filtro.
- **Screenshot esperado:** resposta com KPIs e agregações coerentes com a base de demonstração.
- **Troubleshooting:** resultado inesperado → verificar filtros, status excluídos e período; erro de propriedade → comparar JSON com consumidor.
- **Se travar:** começar com `COUNT` antes de analisar o endpoint inteiro.
- **Fechamento:** explicar `GROUP BY` usando um exemplo do dashboard.

### DIA 10 — Frontend parte 1: HTML e CSS
- [ ] **Objetivo:** localizar estrutura semântica, estilos base e layout responsivo.
- **Pré-requisito:** Dia 03.
- **Mão na massa:** estudar o HTML já existente em `public/index.html`; descomentar os links CSS D10-B02 e D10-B03 e observar a interface ganhar estilo.
- **Arquivos/blocos:** D10-B01 leitura da estrutura semântica em `public/index.html` (sem código a descomentar); D10-B02 tokens/base/componentes; D10-B03 layout e estilos das páginas.
- **Teste do dia:** fazer uma alteração visual pequena na branch didática e conferir em desktop e largura 375 px.
- **Screenshot esperado:** mesmas páginas com uma mudança pequena visível e sem overflow.
- **Troubleshooting:** estilo não aplica → conferir ordem/import e seletor no DevTools; quebra mobile → inspecionar media query.
- **Se travar:** pedir que identifique primeiro qual regra vence no painel Styles.
- **Fechamento:** distinguir estrutura (HTML) de apresentação (CSS).

### DIA 11 — Frontend parte 2: JavaScript e SPA
- [ ] **Objetivo:** seguir o carregamento inicial e uma chamada `fetch`.
- **Pré-requisito:** Dias 06 e 10.
- **Mão na massa:** descomentar scripts D11-B01 e D11-B02 no fim de `public/index.html`, preservando a ordem indicada.
- **Arquivos/blocos:** D11-B01 estado/API/UI; D11-B02 inicialização/navegação.
- **Teste do dia:** navegar pelas cinco páginas, acompanhar uma chamada na aba Network e localizar o JSON recebido.
- **Screenshot esperado:** SPA com página trocada e resposta API visível no DevTools.
- **Troubleshooting:** `X is not defined` → ordem de scripts/global; fetch falha → URL, servidor e console.
- **Se travar:** perguntar “quem chama esta função e qual dado ela recebe?”.
- **Fechamento:** explicar evento → API → renderização.

### DIA 12 — Frontend parte 3: Dashboard interativo
- [ ] **Objetivo:** conectar filtros, KPIs e gráficos Canvas.
- **Pré-requisito:** Dias 09 e 11.
- **Mão na massa:** descomentar os scripts D12-B01 e D12-B02 em `public/index.html`; clicar numa categoria e observar cross-filter.
- **Arquivos/blocos:** D12-B01 KPIs/filtros; D12-B02 gráficos/cross-filter.
- **Teste do dia:** filtro atualiza KPIs e gráficos; clicar novamente remove o filtro.
- **Screenshot esperado:** dashboard carregado, chips ativos e gráficos desenhados.
- **Troubleshooting:** gráfico vazio → verificar JSON/API; clique não filtra → conferir callback/campo; canvas borrado → olhar escala/resize.
- **Se travar:** testar primeiro um gráfico com dados fixos e depois a API.
- **Fechamento:** descrever o ciclo filtro → requisição → renderização.

### DIA 13 — Frontend parte 4: Ocorrências, CRUDs e logs
- [ ] **Objetivo:** testar os principais fluxos operacionais e distinguir formulário individual de lote.
- **Pré-requisito:** Dias 08 e 11.
- **Mão na massa:** descomentar scripts D13-B01 e D13-B02 no HTML; habilitar também os módulos de logs da API e o grupo D13-B02 em `src/routes/index.js`.
- **Arquivos/blocos:** D13-B01 formulário/listagem/lote; D13-B02 configurações/timeline.
- **Teste do dia:** cadastrar ocorrência de teste, editar/listar, validar um lote e localizar seu log.
- **Screenshot esperado:** lista atualizada e timeline com a ação de demonstração.
- **Troubleshooting:** referências vazias → conferir `App.carregarRefs`; item não listado → atualizar/paginar; lote parcial → conferir resposta e transação.
- **Se travar:** dividir o fluxo em formulário, requisição, persistência e atualização da tela.
- **Fechamento:** explicar como o log ajuda a rastrear uma alteração.

### DIA 14 — PDFs com Puppeteer
- [ ] **Objetivo:** gerar um PDF e explicar como os dados chegam ao template.
- **Pré-requisito:** Dias 07–09 e 11.
- **Mão na massa:** liberar D14-B01 (motor de templates), depois D14-B02 (service, rotas, frontend e templates); habilitar o grupo PDF em `src/routes/index.js`.
- **Arquivos/blocos:** D14-B01 template engine; D14-B02 serviço/rotas/templates/assets.
- **Teste do dia:** gerar os três relatórios na base isolada; conferir abertura, logos e margens.
- **Screenshot esperado:** PDF legível em A4 aberto no navegador.
- **Troubleshooting:** PDF sem dados → conferir placeholder/dados; logo ausente → conferir arquivo e fallback; browser não inicia → ler erro Puppeteer.
- **Se travar:** renderizar o template como HTML antes de investigar o PDF.
- **Fechamento:** explicar a diferença entre template HTML e resultado PDF.

### DIA 15 — Polish e aplicação local pronta
- [ ] **Objetivo:** validar a aplicação inteira, documentar o setup e criar um checkpoint final.
- **Pré-requisito:** Dias 01–14.
- **Mão na massa:** seguir checklist de manutenção, navegar páginas, verificar responsividade, console, logs, PDFs e Git diff.
- **Arquivos/blocos:** D15-B01 é o checklist de verificação, sem código a descomentar; README e docs. Os scripts D15-B02..B04 são referências locais destrutivas/privadas e ficam fora do treinamento.
- **Teste do dia:** inicialização repetível, cinco páginas, CRUD, lote, logs e PDFs válidos; nenhum dado real usado.
- **Screenshot esperado:** produto final aberto e checklist preenchido.
- **Troubleshooting:** erro após integração → reproduzir e comparar com o último checkpoint; evitar “consertar” várias camadas ao mesmo tempo.
- **Se travar:** fazer uma pausa, registrar evidência e reduzir o problema.
- **Fechamento:** Amanda demonstra o fluxo completo e explica arquitetura em três minutos.

## Checkpoint final do mentor

- [ ] Amanda consegue seguir uma requisição do navegador ao SQLite e de volta.
- [ ] Amanda sabe iniciar a aplicação e conferir a API de saúde.
- [ ] Os testes foram feitos em branch e base descartáveis.
- [ ] O diário foi preenchido e o Git não contém dados sensíveis.