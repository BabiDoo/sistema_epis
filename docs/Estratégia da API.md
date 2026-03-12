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

### 5. Gestão de Colaboradores
Endpoints focados no cadastro e vínculo de acesso.

**`POST /api/v1/colaboradores`**
Cria um novo colaborador validando a árvore organizacional (Unidade -> Área -> Setor).
- Retorna `201 Created` em sucesso.
- Retorna `400 Bad Request` se a hierarquia informada for inconsistente.

**`POST /api/v1/colaboradores/{id}/vincular-usuario`**
Ação específica para associar uma conta de login a um colaborador operacional.
- Payload: `{ "usuarioId": "GUID" }`

### 6. Gestão de Atributos Técnicos de EPI
Endpoints para gerenciar características flexíveis do catálogo.

**`GET /api/v1/epis/{epiId}/atributos`**
Retorna todos os atributos técnicos vinculados a um equipamento específico.

**`POST /api/v1/epis/{epiId}/atributos`**
Cria um novo atributo técnico (Ex: COR: Azul).
- Validação: Chave obrigatória, Valor obrigatório. A chave será normalizada para Maiúsculas.

**`PUT /api/v1/epis/atributos/{id}`**
Atualiza o valor ou a chave de um atributo existente.

**`DELETE /api/v1/epis/atributos/{id}`**
Remove um atributo técnico do catálogo do EPI.

### 7. Importação de Dados Mestres (Excel)
Endpoint para carga em massa de colaboradores com provisionamento organizacional.

**`POST /api/v1/integracoes/importar-colaboradores`**

**Request:** `multipart/form-data`
- `file`: Arquivo `.xlsx` (layout: `NomeCompleto`, `Matricula`, `Cpf`, `Email`, `Unidade`, `Area`, `Setor`, `Cargo`).

**Regras de Negócio (v1):**
- **Campos Obrigatórios:** `NomeCompleto`, `Matricula`, `Unidade`, `Area`, `Setor`, `Cargo`.
- **Estratégia Create Only:** Se a `Matricula` já existir, a linha falha.
- **Auto-provisionamento:** Cria Unidade/Área/Setor/Cargo se não existirem (busca por nome).

**Response (200 OK):**
```json
{
  "totalProcessado": 100,
  "sucesso": 95,
  "falhas": 5,
  "detalhesErros": [
    { "linha": 12, "erro": "Matrícula 12345 já cadastrada." },
    { "linha": 45, "erro": "Campo 'Cargo' é obrigatório." }
  ]
}
```

### 8. Gestão de Anexos (v2)
**`POST /api/v1/anexos`**
Upload de arquivo genérico.
- **Request (multipart/form-data):**
  - `file`: Arquivo físico.
  - `tipo`: Valor inteiro do `TipoAnexo`.
  - `entidadeTipo`: Nome da entidade (Ex: "COLABORADOR", "EPI").
  - `entidadeId`: Guid da entidade.
- **Response (201 Created):** Retorna o objeto `Anexo` com a URL gerada.

**`GET /api/v1/anexos/{entidadeTipo}/{entidadeId}`**
Lista anexos vinculados a um registro.
- **Response (200 OK):** Array de objetos `Anexo`.

---

---

---

## Protocolo de Validação Técnica

Uma implementação profissional exige validação coerente com o domínio. Siga este protocolo para garantir que a API responda corretamente e o banco persista os dados respeitando a hierarquia operacional.

### 1. Ordem de Teste (Dependência de Domínio)
Para validar o fluxo completo de cadastros base, execute os testes obrigatoriamente nesta sequência para respeitar as chaves estrangeiras:
1. **Unidade**: Criar a unidade operacional raiz.
2. **Área**: Criar a área vinculada à unidade.
3. **Setor**: Criar o setor vinculado à área.
4. **Cargo**: Criar o cargo vinculado ao setor.
5. **Colaborador**: Criar o colaborador vinculado ao cargo e unidade.

### 2. Execução da API
Navegue até a raiz do projeto e execute:
```bash
cd apps/api
dotnet run --project src/SistemaEpis.Api
```

### 3. Validação via Swagger UI
Acesse `http://localhost:5204/docs`:
- Realize o login para obter o **Token JWT**.
- Utilize o botão **Authorize** para injetar o token.
- Execute os endpoints de `POST` seguindo a ordem descrita no item 1.
- **Dica de Exercício**: Crie 1 Unidade, 1 Área, 2 Setores e 2 Cargos para validar a multiplicidade.

### 4. Validação de Persistência (PostgreSQL)
Confirme se os dados foram gravados corretamente e se os relacionamentos (GUIDs) estão íntegros:
```sql
SELECT * FROM unidades;
SELECT * FROM areas;
SELECT * FROM setores;
SELECT * FROM cargos;
SELECT * FROM colaboradores;
```

### 5. Critérios de Aceite (O que observar)
- **Persistência**: Registros devem aparecer nas tabelas correspondentes.
- **Integridade**: GUIDs devem ser gerados corretamente e as chaves estrangeiras devem coincidir.
- **Status Codes**: 
    - `201 Created` para sucesso.
    - `400 Bad Request` para payloads inválidos ou violação de regras de negócio.
    - `404 Not Found` para recursos inexistentes.

