# Manual de Manutenção Local

Este manual é para desenvolvimento e treinamento local. Use uma base descartável
para testes. Nunca execute reset ou substitua o banco real sem backup e autorização.

## Iniciar e parar

1. Confira que está na pasta do projeto no terminal do VS Code.
2. Verifique Node.js 20+ e dependências instaladas: `node --version`, `npm --version`.
3. Na branch de curso, libere D06-B01 e os pré-requisitos dos dias seguintes antes de iniciar `npm run dev`.
4. Abra `http://localhost:3000` e confirme a API em `http://localhost:3000/api/health`.
5. Encerre o servidor com `Ctrl+C` no terminal que o iniciou.

Na branch didática, comandos ligados a blocos ainda comentados encerram com uma
mensagem apontando o bloco necessário; não remova essa proteção para contornar um erro.

## Diagnóstico rápido

| Sintoma | Verificação segura |
|---|---|
| Página não abre | Veja se o processo está ativo, confirme porta 3000 e leia o primeiro erro do terminal. |
| API não responde | Abra `/api/health`; confirme URL, porta e log no terminal. |
| Lista vazia | Na aba Network confira status e JSON; confirme se a aplicação está ligada à base de treinamento correta. |
| Erro no navegador | F12 → Console e Network; registre a primeira exceção e a requisição que falhou. |
| Erro de SQL | Leia o erro no terminal e confira nome de tabela/coluna contra `database/schema.sql`. |
| PDF falha | Teste o endpoint, confira terminal, template, assets e caminho do navegador Puppeteer. |
| Porta ocupada | Identifique o processo com o mentor; não encerre processos desconhecidos. |

## Banco de dados e segurança

- SQLite usa um arquivo local; os arquivos `-wal` e `-shm` podem acompanhar uma
  conexão ativa. Não os apague manualmente com o servidor aberto.
- Faça uma cópia do banco antes de testes que alterem dados.
- `npm run db:setup` remove e recria `database/dispensaaudit.db`. Libere D04-B04 e
  execute somente numa cópia descartável do projeto; uma branch na mesma pasta não isola o banco.
- `npm run db:reset` pode apagar/recriar dados. Só execute numa base isolada e após
  confirmar o caminho com o mentor.
- Para as aulas, libere D05-B02 e use `npm run db:seed:demo`, que contém apenas registros sintéticos.
- `.env` e bancos podem conter informações sensíveis. Não os inclua em screenshots,
  commits ou mensagens.
- Para gerar dados fictícios, consulte os scripts e as instruções do projeto.

## Git e recuperação

Antes de editar: `git status --short` e `git diff`. Depois, rode o teste pertinente e
revise o diff. Um commit é um checkpoint versionado; não substitui backup do banco.
Se aparecer uma alteração inesperada, pare, preserve o arquivo e consulte o mentor;
não use `git reset --hard` ou descarte arquivos para “limpar” o workspace.

## Coleta de evidências para pedir ajuda

Envie: o que tentou, o resultado esperado, o resultado observado, a primeira mensagem
de erro e o arquivo/linha relevante. Remova nomes, prontuários, credenciais e outros
dados sensíveis antes de compartilhar qualquer captura.