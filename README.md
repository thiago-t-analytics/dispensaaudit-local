# DispensaAudit — Versão Local

Sistema de Gestão de Não Conformidades na Dispensação Hospitalar.

> **Este é o projeto de estudo/reescrita do sistema original em Google Apps Script.**
> O objetivo é aprender a arquitetura de um sistema web real, partindo do zero,
> sem depender de plataformas fechadas. Ele roda **100% na sua máquina** (localhost).

## Objetivo

- Reescrever o sistema DispensaAudit (originalmente em Google Apps Script) usando uma
  stack moderna e local: **Node.js + Express + SQLite + HTML/CSS/JS**.
- Servir como material de estudo para entender **como um sistema web é construído**:
  - Como modelar um banco de dados relacional
  - Como criar uma API REST
  - Como o frontend consome a API
  - Como gerar PDFs a partir de HTML
  - Como registrar logs de auditoria

## Stack

| Camada           | Tecnologia                                |
| ---------------- | ----------------------------------------- |
| Runtime          | Node.js 20+                               |
| Framework web    | Express 4                                 |
| Banco de dados   | SQLite 3 (`better-sqlite3`)             |
| Frontend         | HTML + CSS + JavaScript puro (Vanilla JS) |
| Geração de PDF | Puppeteer (HTML → PDF)                   |
| Versionamento    | Git + GitHub                              |

## Como rodar (após instalar tudo)

> Na branch didática `curso-amanda`, siga os dias do curso: schema, scripts,
> módulos do backend e scripts do navegador têm blocos comentados por dependência.
> Descomente somente os blocos indicados em cada aula. Nunca use a base local real.

```bash
# 1. Clonar o repositório
git clone <url-do-repo>
cd dispensaaudit-local

# 2. Instalar as versões registradas no lockfile
npm ci

# 3. Depois de concluir o Dia 04, criar o banco a partir do schema
# ATENÇÃO: libere D04-B01..B04 e execute numa cópia descartável.
npm run db:setup

# 4. Depois do Dia 05, popular com dados sintéticos de treinamento
npm run db:seed:demo

# 5. Depois do Dia 06 e de liberar os módulos requeridos, iniciar o servidor
npm run dev
```
Acesse: http://localhost:3000

## Documentação

- A documentação do projeto está em `docs/`:
  - 00-guia-do-aluno.md — passo a passo, dia a dia
  - 00-guia-do-mentor.md — roteiro de condução
  - 01-requisitos.md — o que o sistema faz
  - 02-arquitetura.md — como ele é construído
  - 03-banco-de-dados.md — modelagem relacional
  - 04-apis.md — contrato dos endpoints
  - 05-manual-manutencao.md — manutenção local
  - 06-repaginacao.md — design system e experiência visual
  - 06-diario-de-bordo.md — reflexões ao final de cada aula
  - 07-perguntas-frequentes.md — conceitos e dúvidas comuns
  - aulas/ — roteiros práticos dos 15 dias

Os marcadores `Dxx-Bxx` identificam os blocos progressivos. Em JavaScript, retire
o prefixo de comentário somente no corpo delimitado; no SQL, remova o comentário
do bloco indicado; no HTML, descomente os links CSS/scripts descritos na aula.
Não remova os delimitadores nem ative blocos fora da ordem indicada.

## Interface atual

A aplicação é uma SPA Vanilla JS com cinco páginas:

1. **Dashboard** — KPIs, filtros sincronizados com gráficos Canvas e atalhos para PDFs.
2. **Ocorrências Cadastradas** — busca, filtros, paginação, edição, exclusão e PDF.
3. **Lançar Ocorrência** — identificação compartilhada e cadastro transacional de vários itens.
4. **Configurações** — CRUD de medicamentos, tipos de erro, setores, farmacêuticos e assistentes.
5. **Logs de Auditoria** — filtros por ação, tabela e período, apresentados em timeline.

O layout adapta a navegação para um drawer em telas estreitas. Os estilos ficam em
`public/css/` e os módulos do navegador em `public/js/`; não há framework nem
dependências adicionais no frontend. A geração de PDFs usa os templates locais em
`templates/` e o serviço Puppeteer existente.

O cadastro em lote acrescenta `POST /api/ocorrencias/lote`. A API valida todos os
itens antes de gravá-los, usa uma transação SQLite e registra uma única entrada de
auditoria para o lote.

## Estrutura do repositório

- `database/` — schema e dados iniciais
- `docs/` — documentação do projeto
- `src/` — backend Express, serviços e consultas SQLite
- `public/` — SPA HTML/CSS/JavaScript
- `templates/` — templates HTML usados na geração de PDF
