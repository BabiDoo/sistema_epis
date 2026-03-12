# Arquitetura do Sistema

## 1. Estilo Arquitetural
A arquitetura recomendada é um **Monólito Modular**. Essa abordagem foi escolhida pela forte necessidade de transações atômicas cruzadas (Estoque + Entrega + Auditoria) nesta fase inicial, mas mantendo o isolamento lógico necessário para futura extração em microsserviços.

## 2. Estrutura de Módulos (Bounded Contexts)
O código fonte será organizado prioritariamente por domínios, seguindo a árvore abaixo:
- **core/**
  - **auth:** Autenticação, senhas e tokens.
  - **usuarios:** Gestão de usuários do sistema e perfis de acesso.
  - **organizacao:** Unidades, áreas, setores e cargos.
- **colaboradores:** Dados do trabalhador e seus documentos/status.
- **epis:** Catálogo de EPIs, categorias e atributos técnicos.
- **estoque:** Controle de lotes, agregação de saldos de estoque e histórico de movimentações.
- **entregas:** Agregação raiz de entregas, itens entregues, trocas e devoluções.
- **alertas:** Motor de vencimentos e notificações.
- **aso:** Saúde ocupacional associada ao trabalhador.
- **auditoria:** Módulo transversal para compliance.
- **anexos:** Módulo genérico para links de storage (fotos, PDFs, assinaturas).
- **integracoes:** Adapters de comunicação externa (ERP, planilhas).

## 3. Estrutura de Camadas (Fluxo Interno)
Dentro de cada módulo, adotamos isolamento em camadas claras:
- `domain/`: Entities, Value Objects e domain rules (Invariantes).
- `application/`: Use cases, Services (orquestração) e Validators.
- `infrastructure/`: Repositories (ORM), Database mappings, external services clients e Jobs.
- `api/`: Controllers, DTOs de I/O, Middlewares de validação.

## 4. Fluxos Críticos Detalhados

**Fluxo de Entrada de Estoque:**
1. Usuário registra nova nota/lote via requisição.
2. Sistema cria registro do lote (se inexistente).
3. Sistema ajusta (add) o `saldo_disponivel` na entidade `estoque`.
4. Sistema gera uma registro de `movimentacao_estoque` do tipo `ENTRADA`.
5. Sistema registra log global na tabela `audit_log`.

**Fluxo Principal de Entrega de EPI:**
1. Usuário solicita uma entrega (passando Colaborador, Itens e Lotes).
2. O domínio valida invariantes: saldo disponível no lote, lotes não vencidos, ausência de bloqueios ativos para o colaborador.
3. Se válido, cria raiz da `entrega`.
4. Cria registros associados na tabela `item_entrega` (guardando `data_proxima_troca`).
5. Desconta saldo iterando na entidade de `estoque` (deduz de `saldo_disponivel`).
6. Grava evento em `movimentacao_estoque` com tipo `ENTREGA`.
7. Grava dados da Evidência (assinatura física ou digital) utilizando módulo de Anexos.
8. Persiste todas asserções anteriores em uma única transação no Banco (UnitOfWork).
9. Módulo de Alertas é notificado (assíncrono) para agendar o próximo aviso de troca.
10. Insere rastreabilidade padrão em `audit_log`.

**Fluxo Offline (Sync):**
1. App Mobile coleta operação sem rede, cria localmente gerando um `client_operation_id` em formato UUID.
2. Ao restabelecer rede, App posta carga predefinida no endpoint genérico de sincronização offline da API.
3. Backend valida se `operacao_offline.client_operation_id` já existe (Constraints de UNIQUE).
4. Se já existir, ignora duplicidade (Idempotência).
5. Se novo, grava registro na tabela `operacao_offline` e converte o payload para executar os casos de uso nativos (ex: Fluxo Principal de Entrega).
6. Registra sucesso ou falha na tabela para eventual retentativa.

**Fluxo de Cadastro de Colaborador:**
1. Usuário envia os dados do colaborador (incluindo chaves para Unidade, Área, Setor e Cargo).
2. O sistema verifica a existência de todos os recursos informados.
3. O sistema valida se a Área informada pertence à Unidade informada.
4. O sistema valida se o Setor informado pertence à Área informada.
5. Se o vínculo com `UsuarioId` for fornecido, valida se o usuário existe no sistema.
6. Se todas as invariantes de hierarquia forem satisfeitas, o registro é persistido.
7. Em caso de falha na hierarquia, retorna `400 Bad Request` com a descrição do erro de negócio.

**Fluxo de Importação Excel (Dados Mestres):**
1. API recebe arquivo `.xlsx` via `multipart/form-data`.
2. Application orquestra a leitura da primeira aba através do adapter de infraestrutura.
3. Valida cabeçalhos obrigatórios.
4. Para cada linha:
    - Valida dados básicos do colaborador.
    - Resolve Unidade, Área, Setor e Cargo: busca existente por nome ou cria novo registro (Auto-provisionamento).
    - Cria o Colaborador associado à hierarquia resolvida.
    - **Estratégia Create Only (v1):** Se a `Matricula` já existir no sistema, a linha deve ser marcada como erro. Não haverá atualização (update) automática de registros existentes nesta fase.
5. Devolve DTO de resumo com estatísticas e logs de erro por linha.
**Fluxo de Upload de Anexo Genérico:**
1. API recebe arquivo via `multipart/form-data` e metadados (`EntidadeTipo`, `EntidadeId`, `TipoAnexo`).
2. Valida regras de negócio (tamanho, mimetypes permitidos).
3. Salva arquivo fisicamente no storage configurado (Local V1).
4. Persiste metadados na tabela `anexo` associando ao "dono" genérico.
5. Retorna URL de acesso ou ID do recurso.

## 5. Estratégia de Storage de Arquivos (v2)
Para garantir agilidade no MVP sem comprometer o design final:
- **Interface de Storage**: O domínio e a aplicação dependem de uma interface `IStorageService`.
- **Implementação Local (V1)**: Gravação em disco no servidor com caminho relativo armazenado no banco. Facilita o desenvolvimento e validação ponta a ponta.
- **Implementação Cloud (V2+)**: Futura implementação de `IStorageService` para Azure Blob Storage ou Amazon S3, bastando trocar a injeção de dependência na infraestrutura.
