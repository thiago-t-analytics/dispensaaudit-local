# API de cadastro em lote

## `POST /api/ocorrencias/lote`

Cria várias ocorrências com os mesmos dados de identificação. O endpoint valida
todos os itens antes de gravar; se um item falhar, nenhum registro é criado.

### Requisição

```json
{
  "identificacao": {
    "data_ocorrencia": "2026-11-17",
    "prontuario": "1234567",
    "numero_prescricao": "8012345",
    "setor_id": 2,
    "plantao": "Noturno"
  },
  "itens": [
    {
      "medicamento_id": 1,
      "tipo_erro_id": 4,
      "quantidade_prescrita": 2,
      "quantidade_dispensada": null,
      "hora_prescricao": "20:00",
      "hora_dispensacao": null,
      "farmaceutico_id": 7,
      "assistente_id": null,
      "responsavel_erro": "Farmacêutico",
      "observacoes": "Observação opcional"
    }
  ]
}
```

`data_ocorrencia`, `prontuario`, `numero_prescricao`, `setor_id` e `plantao` são
compartilhados. Cada item exige medicamento, tipo de erro, quantidade prescrita,
farmacêutico e responsável pelo erro. Quantidade dispensada, horários,
assistente e observações seguem as regras do cadastro individual.

### Resposta de sucesso — HTTP 201

```json
{
  "ok": true,
  "ids": [147, 148],
  "total": 2,
  "codigos": ["OCR000147", "OCR000148"]
}
```

### Erro de validação — HTTP 400

```json
{
  "ok": false,
  "status": 400,
  "message": "Item 2: quantidade_prescrita é obrigatório."
}
```

Os inserts são executados em uma transação SQLite. Após o commit, é registrado
um único log de auditoria com os IDs, códigos e total do lote.