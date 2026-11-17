# 02 — Arquitetura do Sistema

> **Este documento responde à pergunta: "Como o sistema é construído por dentro?"**
> Ele apresenta as camadas, os fluxos de dados e a lógica de organização do código.

---

## 1. Visão de Alto Nível

O DispensaAudit Local é uma **aplicação web monólito**, dividida em três grandes blocos:

```ascii
┌────────────────────────────────────────────────────────────┐
│                    NAVEGADOR                               │
│                                                            │
│   ┌───────────────────────────────────────────────────┐    │
│   │             FRONTEND (public/)                    │    │
│   │        HTML + CSS + JavaScript puro               │    │
│   │        Roda no navegador da Amanda                │    │
│   └───────────────────────────────────────────────────┘    │
│                          │                                 │
│                  fetch() / JSON                            │
│                          ▼                                 │
└────────────────────────────────────────────────────────────┘
                           │
                           │ HTTP (localhost:3000)
                           ▼
┌────────────────────────────────────────────────────────────┐
│                 SERVIDOR NODE.JS                           │
│                                                            │
│   ┌───────────────────────────────────────────────────┐    │
│   │             BACKEND (src/)                        │    │
│   │        Express + Lógica de Negócio                │    │
│   │                                                   │    │
│   │   routes/      → define as URLs                   │    │
│   │   controllers/ → recebe a requisição              │    │
│   │   services/    → aplica regras de negócio         │    │
│   │   db/          → conversa com o SQLite            │    │
│   └───────────────────────────────────────────────────┘    │
│                          │                                 │
│                          │ SQL                             │
│                          ▼                                 │
│   ┌───────────────────────────────────────────────────┐    │
│   │    BANCO DE DADOS (database/dispensaaudit.db)     │    │
│   │           SQLite — um único arquivo               │    │
│   └───────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────┘
```

---

## 2. Por que separar em camadas?

Imagine que você precisa mudar a forma como o banco de dados funciona (ex.: trocar
SQLite por PostgreSQL). Se **todo o código** estivesse em um único arquivo, você
teria que mexer em cada canto do sistema.

Separando em camadas:

- **`routes/`** só sabe qual URL chamar.
- **`controllers/`** só sabe ler a requisição HTTP e devolver uma resposta HTTP.
- **`services/`** só sabe aplicar regras de negócio (ex.: calcular a diferença de horas).
- **`db/`** só sabe executar SQL.

Se você trocar SQLite por PostgreSQL amanhã, **só o `db/` muda**. O resto continua igual.
Isso é o **princípio da responsabilidade única**.

---

## 3. Organização das pastas do backend

src/
├── server.js ← Ponto de entrada (cria o Express)
│
├── db/
│ ├── connection.js ← Abre conexão com SQLite
│ └── queries/ ← Consultas SQL organizadas por entidade
│ ├── medicamentos.js
│ ├── tiposErro.js
│ ├── setores.js
│ ├── farmaceuticos.js
│ ├── assistentes.js
│ ├── ocorrencias.js
│ └── logs.js
│
├── routes/
│ ├── index.js ← Agrupa todas as rotas
│ ├── medicamentos.js ← GET /api/medicamentos, POST, PUT, DELETE
│ ├── tiposErro.js
│ ├── setores.js
│ ├── farmaceuticos.js
│ ├── assistentes.js
│ ├── ocorrencias.js
│ ├── dashboard.js
│ └── logs.js
│
├── services/
│ ├── ocorrencias.js ← Regras de negócio de ocorrência
│ ├── kpis.js ← Cálculo de KPIs
│ ├── graficos.js ← Agregações para gráficos
│ ├── logs.js ← Registro de auditoria
│ └── pdf.js ← Geração de PDF (Puppeteer)
│
└── utils/
├── validators.js ← Validação de campos
└── formatters.js ← Formatação de datas/horas

---

## 4. Fluxo de uma requisição (exemplo real)

**Cenário**: a Amanda preenche o formulário de nova ocorrência e clica em "Salvar".

1. [FRONTEND] JavaScript captura os dados do formulário
   │
   │ fetch('POST /api/ocorrencias', { body: JSON })
   ▼
2. [EXPRESS] Encontra a rota em routes/ocorrencias.js
   │
   ▼
3. [CONTROLLER] Chama services/ocorrencias.criar(dados)
   │
   ▼
4. [SERVICE]
   ├─ Valida os campos obrigatórios
   ├─ Calcula DiferencaQuantidade
   ├─ Calcula DiferencaMinutos e ClassificacaoHorario
   ├─ Gera observação automática se for Antecipada/Atrasada
   └─ Chama db/queries/ocorrencias.inserir(dadosCalculados)
   │
   ▼
5. [DB] Executa INSERT INTO ocorrencias (...) VALUES (...)
   │
   ▼
6. [SERVICE] Chama services/logs.registrar(...) para auditoria
   │
   ▼
7. [CONTROLLER] Devolve { success: true, id: 'OCR000147' }
   │
   ▼
8. [FRONTEND] Recebe a resposta, mostra toast de sucesso e limpa o formulário

Esse fluxo se repete para todas as operações. A diferença está só nos detalhes
de cada service.

---

## 5. Fluxo do Dashboard

1. [FRONTEND] Abre a página do dashboard → chama carregarDashboard()
   │
   │ fetch('GET /api/dashboard?periodoInicio=...&status=ativas')
   ▼
2. [EXPRESS] Rota routes/dashboard.js
   │
   ▼
3. [CONTROLLER] Chama dois services em paralelo:
   ├─ services/kpis.calcular(filtros)
   └─ services/graficos.calcular(filtros)
   │
   ▼
4. [SERVICES] Cada um executa queries SQL agregadas:
   ├─ SELECT COUNT(_) FROM ocorrencias WHERE ...
   ├─ SELECT setor_id, COUNT(_) FROM ocorrencias GROUP BY setor_id
   └─ ...
   │
   ▼
5. [CONTROLLER] Devolve { kpis: {...}, graficos: {...}, tabela: [...] }
   │
   ▼
6. [FRONTEND] Renderiza KPIs, gráficos e tabela

---

## 6. Fluxo de Geração de PDF

O PDF é gerado a partir de **templates HTML**. Isso é o equivalente ao sistema
original que usava Google Docs como template.

1. [FRONTEND] Clica em "Gerar PDF Individual" → chama gerarPdfIndividual(id)
   │
   │ fetch('GET /api/pdf/individual/OCR000001')
   ▼
2. [EXPRESS] Rota routes/pdf.js
   │
   ▼
3. [SERVICE] services/pdf.gerarIndividual(idOcorrencia):
   ├─ Busca dados da ocorrência no banco
   ├─ Busca nomes de medicamento, setor, etc.
   ├─ Lê o template templates/ocorrencia-individual.html
   ├─ Substitui os placeholders ({{ID_Ocorrencia}}, {{Medicamento}}, ...)
   ├─ Usa Puppeteer para converter o HTML em PDF
   ├─ Salva em output/Ocorrencia_OCR000001.pdf
   └─ Devolve o caminho do PDF
   │
   ▼
4. [CONTROLLER] Devolve { success: true, url: '/output/Ocorrencia_OCR000001.pdf' }
   │
   ▼
5. [FRONTEND] Abre o PDF numa nova aba via window.open(url)

---

## 7. Tabela de Decisões Arquiteturais

| Decisão    | Alternativa descartada | Por quê                                                                   |
| ---------- | ---------------------- | ------------------------------------------------------------------------- |
| SQLite     | PostgreSQL             | Zero config, um arquivo, ideal para aprendizado e para rodar em localhost |
| Vanilla JS | React/Vue              | Foco é entender a arquitetura, não framework                              |
| Express    | Fastify                | Mais simples, mais material didático disponível                           |
| Puppeteer  | PDFKit                 | HTML→PDF é mais fácil de manter templates visuais                         |
| Monólito   | Microserviços          | Para um sistema desse porte, simplicidade vence                           |

---

## 8. Equivalências com o projeto GAS original

| Projeto GAS                               | Projeto Local                                                   |
| ----------------------------------------- | --------------------------------------------------------------- |
| `Index.html` (HTML+CSS+JS num só arquivo) | `public/index.html` + `public/css/style.css` + `public/js/*.js` |
| `DispensaAudit.gs`                        | `src/routes/*` + `src/services/*` + `src/db/*`                  |
| Google Sheets (abas)                      | SQLite (tabelas)                                                |
| `google.script.run`                       | `fetch()`                                                       |
| `getSheetData()`                          | `db/queries/*.listar()`                                         |
| `saveSheetData()`                         | `db/queries/*.inserir()` / `.atualizar()`                       |
| Google Docs (template)                    | Templates HTML                                                  |
| `getAs('application/pdf')`                | Puppeteer                                                       |
| `MailApp.sendEmail`                       | Nodemailer (bônus)                                              |
| `CacheService`                            | Não se aplica (SQLite é local e rápido)                         |
| `LockService`                             | Não se aplica (single-user local)                               |
