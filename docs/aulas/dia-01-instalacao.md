# Dia 01 — Visão Geral e Instalação

## Objetivo
Preparar o ambiente e conhecer o resultado final do DispensaAudit.

## Passo a passo
1. Abra a pasta de treinamento no VS Code e o terminal integrado.
2. Confira as ferramentas:
   ```powershell
   node --version
   npm --version
   git --version
   ```
3. Na cópia de treinamento, instale as dependências: `npm ci`.
4. Observe a demonstração do mentor (ou screenshot) antes de estudar o código.
5. Desenhe navegador → API → banco. A branch didática ainda não inicia o app; isso virá após banco e backend.

## Conceitos
- Node.js executa JavaScript fora do navegador; npm instala e executa tarefas do projeto.
- O navegador apresenta a interface, enquanto o servidor responde às chamadas da API.

## Blocos a descomentar
- D01-B01 — preparação e configuração do ambiente; não há lógica da aplicação a descomentar.

## Teste do Dia
- [ ] As versões e dependências estão corretas.
- [ ] Você consegue apontar onde fica navegador, backend e banco.

## Se travar, respire e confira
- Você está na pasta que contém `package.json`?
- O Node atende à versão mínima indicada pelo projeto?
- Não inicie `npm run db:setup` nem `npm run dev` antes das aulas de banco/backend.

## Reflexão final
Escreva três frases suas: o que aprendeu, o que ainda quer descobrir e o que chamou sua atenção.
