# Modelagem Relacional do Banco de Dados (PostgreSQL)

O banco segue diretrizes de normalização forte para garantir consistência e performance em fluxos transacionais.

## Tabelas Principais

**1. Módulo de Estoque (Reestruturação)**
O saldo vira uma visão concreta gerida via concorrência otimista e auditada por movimentações estritas.

- `estoque`: id, unidade_id, local_id, epi_id, lote_id, saldo_disponivel (int), saldo_reservado (int), saldo_em_transito (int).
- `movimentacao_estoque`: id, tipo_operacao (ENTRADA, SAIDA, TRANSFERENCIA, AJUSTE, ENTREGA, DEVOLUCAO), origem, destino, lote_id, quantidade, usuario_responsavel_id, data_momento.

**2. Módulo de Entregas (Desacoplamento)**
Separamos os metadados da entrega da rastreabilidade individual do equipamento entregue para viabilizar cálculo de depreciação e ciclo individual de trocas.

- `entrega`: id, colaborador_id, unidade_id, data_entrega, status, usuario_responsavel_id.
- `item_entrega`: id, entrega_id, epi_id, lote_id, quantidade, data_proxima_troca (date).

**3. Módulo de Anexos (Novo - Genérico)**
Para suporte universal a evidências e uploads de arquivos.

- `anexo`: id, tipo (ASSINATURA, FOTO_ENTREGA, DOCUMENTO_RG, COMPROVANTE_ASO), url_storage, entidade_tipo (string discriminadora), entidade_id (UUID), usuario_id, data_criacao.

**4. Módulos Transversais e Offline (Novos)**
Tabelas desenhadas para garantir a consistência das invariantes de rastreabilidade completa.

- `audit_log`: id, entidade (ex: "estoque"), entidade_id, acao (UPDATE, DELETE, CREATE), dados_anteriores (JSONB), dados_novos (JSONB), usuario_id, data_hr, ip.
- `operacao_offline`: id, client_operation_id (UNIQUE UUID - chave de idempotência), tipo_operacao, payload_original (JSONB), status_processamento (PENDENTE, COMPLETADO, ERRO), data_recebimento, erro_descritivo.

## Índices, Constraints Críticas e Integridade do Banco

Para blindar as regras de negócio intrínsecas ao domínio no nível do banco de dados (impedindo anomalias de corrida ou by-pass), os seguintes artefatos devem existir fisicamente no banco relacional:

### Constraints Essenciais (Integridade Física)
1. **Verificação de Saldo Positivo (`CHECK CONSTRAINT`)**
   Na tabela `estoque`, o campo `saldo_disponivel` não pode ser negativo. Isso garante que *race conditions* na API não farão o estoque ficar inconsistente (Exceção de BD lançada em caso de violação).
   `ALTER TABLE estoque ADD CONSTRAINT chk_saldo_positivo CHECK (saldo_disponivel >= 0);`

2. **Garantia de Idempotência Offline (`UNIQUE CONSTRAINT`)**
   Na tabela `operacao_offline`, garantir que um evento enviado re-enviado por oscilação de rede não gere dupla dedução no estoque.
   `ALTER TABLE operacao_offline ADD CONSTRAINT unq_client_op_id UNIQUE (client_operation_id);`

3. **Duplicidade de Cadastro de EPI (`UNIQUE CONSTRAINT`)**
   `ALTER TABLE epi ADD CONSTRAINT unq_ca_fabricante UNIQUE (ca, fabricante);`

4. **Vínculo Físico Mandatório (`FOREIGN KEYS ON DELETE RESTRICT`)**
   Registros transacionais (Entregas e Movimentações) **jamais** podem ter chaves estrangeiras com `CASCADE`. A exclusão de um EPI ou Colaborador deve estar restrita e proibida se existirem históricos atrelados a ele.

### Estratégia de Versionamento e Migrations
O banco será gerenciado por versões usando ferramentas de migração puras (Ex: Entity Framework Core Migrations, Flyway ou Liquibase).
- Versões incrementais (`V1__Init.sql`, `V2__AddIndicesEstoque.sql`).
- Proibição absoluta de alteração direta de *schemas* e tabelas no ambiente de produção.
- Todas as restrições acima descritas (`CHECK`, `UNIQUE`, `Índices de Performance`) farão parte obrigatória dos scripts de migração que a equipe de dev criará.
