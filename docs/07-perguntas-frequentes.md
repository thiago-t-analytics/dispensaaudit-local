# Perguntas Frequentes

## Por que não usamos React?

O projeto usa HTML, CSS e JavaScript nativos para manter a instalação simples e
ensinar os fundamentos sem uma camada de framework. React é útil em muitos produtos,
mas não é necessário para esta SPA local.

**Exemplo:** `public/js/app.js` troca a página visível e chama os módulos existentes.
**Para saber mais:** [MDN — JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript).

## Por que SQLite e não PostgreSQL?

SQLite guarda a base num arquivo e não exige um servidor de banco separado, o que é
adequado para a instalação local de estudo. PostgreSQL é mais apropriado para cenários
multiusuário/servidor com requisitos operacionais diferentes.

**Exemplo:** `database/dispensaaudit.db` é aberto pelo backend através de `connection.js`.
**Para saber mais:** [SQLite — sobre](https://www.sqlite.org/about.html).

## O que é um commit?

É um checkpoint de alterações no Git, com uma mensagem que explica o que foi salvo.
Ele permite comparar e recuperar versões do código, mas não é backup automático do banco.

**Exemplo:** faça uma mudança pequena, confira `git diff` e registre-a na branch didática.
**Para saber mais:** [Git — commits](https://git-scm.com/docs/git-commit).

## O que é um endpoint?

É um endereço da API associado a um método HTTP e a um comportamento. O frontend envia
uma requisição e recebe uma resposta, normalmente em JSON.

**Exemplo:** `GET /api/health` verifica se a API está disponível.
**Para saber mais:** [MDN — métodos HTTP](https://developer.mozilla.org/pt-BR/docs/Web/HTTP/Methods).

## Por que o JS é “Vanilla”?

“Vanilla” quer dizer JavaScript sem framework de interface. O navegador já oferece
DOM, eventos, módulos e `fetch`, suficientes para este produto e seus exercícios.

**Exemplo:** `document.querySelector()` encontra um elemento sem jQuery.
**Para saber mais:** [MDN — Document Object Model](https://developer.mozilla.org/pt-BR/docs/Web/API/Document_Object_Model).

## Como funcionam os JOINs no SQL?

Um `JOIN` combina linhas de tabelas relacionadas através de uma condição, geralmente
uma chave estrangeira. Assim, podemos mostrar nomes em vez de apenas IDs.

**Exemplo:** uma ocorrência guarda `medicamento_id`; um `JOIN` com `medicamentos`
permite apresentar o nome do medicamento.
**Para saber mais:** [SQLite — SELECT](https://www.sqlite.org/lang_select.html).

## O que é Puppeteer?

É uma biblioteca Node.js que controla o navegador Chromium programaticamente. O sistema
usa esse navegador para renderizar HTML e imprimir o resultado como PDF.

**Exemplo:** o serviço em `src/services/pdf.js` abre um template e chama `page.pdf()`.
**Para saber mais:** [Puppeteer — documentação](https://pptr.dev/).

## Por que os PDFs são gerados a partir de HTML?

HTML e CSS permitem reutilizar a hierarquia visual e o conteúdo do relatório; o Chromium
interpreta esse template e o converte para páginas PDF. É mais fácil ajustar estilos e
dados do que desenhar cada documento manualmente.

**Exemplo:** `templates/relatorio-gerencial.html` recebe dados e vira um relatório A4.
**Para saber mais:** [Puppeteer — PDF](https://pptr.dev/api/puppeteer.page.pdf).

## O que é uma SPA?

É uma aplicação web que mantém uma página principal carregada e atualiza partes da
interface conforme a navegação, sem solicitar um novo documento HTML a cada troca.

**Exemplo:** a sidebar alterna entre Dashboard, ocorrências, configurações e logs.
**Para saber mais:** [MDN — Single-page applications](https://developer.mozilla.org/en-US/docs/Glossary/SPA).

## Por que o banco fica em `database/` e não no servidor?

Este projeto é uma instalação local: backend e banco residem na máquina que executa a
aplicação. Em produção distribuída, o banco normalmente fica num serviço gerenciado ou
num servidor com controles de acesso, backup e disponibilidade.

**Exemplo:** `src/db/connection.js` abre o arquivo SQLite local configurado para a aplicação.
**Para saber mais:** [SQLite — quando usar](https://www.sqlite.org/whentouse.html).
