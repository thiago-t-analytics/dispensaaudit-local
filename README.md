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

| Camada         | Tecnologia                                |
| -------------- | ----------------------------------------- |
| Runtime        | Node.js 20+                               |
| Framework web  | Express 4                                 |
| Banco de dados | SQLite 3 (`better-sqlite3`)               |
| Frontend       | HTML + CSS + JavaScript puro (Vanilla JS) |
| Geração de PDF | Puppeteer (HTML → PDF)                    |
| Versionamento  | Git + GitHub                              |

## Como rodar (após instalar tudo)

```bash
# 1. Clonar o repositório
git clone <url-do-repo>
cd dispensaaudit-local

# 2. Instalar dependências
npm install

# 3. Criar o banco a partir do schema
npm run db:setup

# 4. (Opcional) Popular com dados iniciais
npm run db:seed

# 5. Iniciar o servidor
npm run dev
Acesse: http://localhost:3000
```

## Documentação

- Toda a documentação está em docs/:
  - 00-guia-do-aluno.md — passo a passo, dia a dia
  - 00-guia-do-mentor.md — roteiro de condução
  - 01-requisitos.md — o que o sistema faz
  - 02-arquitetura.md — como ele é construído
  - 03-banco-de-dados.md — modelagem relacional

## Estrutura do repositório

database/ → schema e dados iniciais
docs/ → documentação
src/ → backend (Express)
public/ → frontend (HTML/CSS/JS)
templates/ → templates HTML usados na geração de PDF
