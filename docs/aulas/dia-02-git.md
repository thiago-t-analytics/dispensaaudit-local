# Dia 02 — Git e GitHub

## Objetivo
Usar Git para observar e salvar uma mudança pequena sem incluir arquivos privados.

## Pré-requisitos
- [ ] Dia 01 concluído.
- [ ] Acesso autorizado à branch/repositório didático.

## Passo a passo
1. Confira a branch e o estado atual: `git status --short`.
2. Faça uma alteração didática pequena e examine-a: `git diff`.
3. Adicione somente o arquivo esperado: `git add caminho/do/arquivo`.
4. Crie um checkpoint: `git commit -m "docs: registrar primeiro exercício"`.
5. Confirme com `git status --short` e `git log -1 --oneline`.

## Conceitos
- Um commit registra um conjunto revisável de mudanças; uma branch separa uma linha de trabalho.
- `.gitignore` ajuda a evitar que dados locais, dependências e segredos entrem no repositório.

## Blocos a descomentar
- D02-B01 — leitura do `.gitignore` e checkpoint Git; sem bloco de runtime.

## Teste do Dia
- [ ] O commit contém apenas o arquivo didático esperado.
- [ ] `.env`, banco local e PDFs gerados não aparecem no commit.

## Se travar, respire e confira
- Rode `git diff --staged` antes do commit.
- Se houver alteração inesperada ou conflito, pare e peça ajuda; não use `reset --hard`.

## Reflexão final
Explique em três frases o que o commit salvou, o que ficou fora e por quê.
