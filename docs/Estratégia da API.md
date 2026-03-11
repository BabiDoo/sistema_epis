# Estratégia da API

## Padrão de rotas
A API deve seguir padrão REST com recursos nomeados no plural, rotas estáveis e sem verbos desnecessários.
Base recomendada: `/api/v1`

Quando a operação representar ação de negócio e não apenas CRUD, usar sub-recursos ou rotas de comando curtas, por exemplo:
- `POST /api/v1/entregas/{id}/confirmar`
- `POST /api/v1/solicitacoes-troca/{id}/aprovar`
- `POST /api/v1/sync/operacoes`

## Exemplos de Contratos da API (Endpoints Críticos)

Para guiar os desenvolvedores Front-end/Mobile e Back-end, abaixo os contratos detalhados para as integrações nucleares.

### 1. Registrar uma Entrega de EPI (Operação de Negócio)
Representa o ato do almoxarife repassar o equipamento ao colaborador com as evidências de aceite.

**`POST /api/v1/entregas`**

**Request:**
```json
{
  "colaboradorId": "5f8a0d24-3b1a-4c8d-9b8e-1f2a3c4d5e6f",
  "unidadeOperacionalId": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
  "dataEntregaFisica": "2026-03-10T14:30:00Z",
  "itens": [
    {
      "epiId": "botina-seguranca-ca1234",
      "loteId": "lote-2025-a1",
      "quantidade": 1,
      "motivo": "PRIMEIRA_ENTREGA"
    },
    {
      "epiId": "luva-vaqueta-ca9999",
      "loteId": "lote-2026-02",
      "quantidade": 2,
      "motivo": "SUBSTITUICAO_DESGASTE"
    }
  ],
  "assinaturaDigital": {
    "tipo": "BIOMETRIA_FACIAL",
    "tokenValidacao": "eyJhbGciOiJIUzI1NiIsInR5c...",
    "fotoCapturaUrl": "https://storage.empresa.com/evidencias/foto_123.jpg"
  }
}
```

**Response (201 Created):**
```json
{
  "entregaId": "e8d9c0b1-a2f3-4e5d-6c7b-8a9f0e1d2c3b",
  "status": "CONCLUIDA",
  "itensProcessados": [
    {
      "epiId": "botina-seguranca-ca1234",
      "quantidadeDeducaoEstoque": 1,
      "dataProximaTrocaEstimada": "2026-09-10T00:00:00Z" // +180 dias de durabilidade padrão
    }
  ],
  "pendenciasGeradas": []
}
```

### 2. Consulta Consolidada de Saldo de Estoque
`GET /api/v1/estoques?unidadeId=1a2b3c4d...&epiId=botina-seguranca-ca1234`

**Response (200 OK):**
```json
{
  "epiId": "botina-seguranca-ca1234",
  "unidadeId": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
  "resumoGlobal": {
    "saldoTotalDisponivel": 150,
    "saldoReservado": 10
  },
  "lotesDisponiveis": [
    {
      "loteId": "lote-2025-a1",
      "dataVencimentoCA": "2028-01-01",
      "saldoLote": 100,
      "statusLote": "VIGENTE"
    },
    {
      "loteId": "lote-2026-02",
      "dataVencimentoCA": "2029-06-15",
      "saldoLote": 50,
      "statusLote": "VIGENTE"
    }
  ]
}
```

### 3. Sincronização Mobile/Offline
`POST /api/v1/sync/operacoes`
Utilizado para processamentos retidos no app sem internet de forma idempotente.
```json
{
  "client_operation_id": "84313f01-uuid...",
  "tipo_operacao": "ENTREGA_CONJUNTO",
  "payload": {
     "colaborador_id": "uuid...",
     "itens": [ { "epi_id": "...", "lote_id": "...", "quantidade": 2 } ],
     "evidencia_assinatura_base64": "..."
  }
}
```

### 4. Auditoria (Recurso Admin)
`GET /api/v1/auditoria?entidade=estoque&entidadeId={id}`
Permitindo que telas de RH acompanhem toda mutação feita num determinado registro, lendo diretamente da tabela transversal de `audit_log` via paginação.
