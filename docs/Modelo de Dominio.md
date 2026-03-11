# Modelo de Domínio (Domain Model)

Este documento define os agregados principais do sistema, suas fronteiras transacionais e relacionamentos lógicos, abstraindo a infraestrutura do banco de dados.

## 1. Domínio: Catálogo de EPIs
Entidade raiz focada na definição do que é o equipamento de proteção.

- **EPI (Agregado Raiz)**
  - Atributos base: `id`, `nome`, `ca (Certificado de Aprovação)`, `validade_ca`, `fabricante`, `dias_durabilidade_padrao`.
  - Relacionamentos:
    - `Categoria` (1:1) - Define a classificação (Ex: Proteção Auditiva, Proteção Respiratória).
    - `Atributos Técnicos` (1:N) - Objetos de valor para tamanhos, cores ou características sensíveis.
  - Comportamentos/Regras:
    - Um EPI não pode ser cadastrado ou ativado sem um CA válido.
    - Se o CA expirar, alertas preventivos são disparados e a entrega passa a ter restrições dependendo da política da empresa.

## 2. Domínio: Estoque e Lotes
Gerencia a quantidade física e a rastreabilidade dos ativos operacionais.

- **Estoque (Agregado Raiz)**
  - O Estoque consolida a relação de disponibilidade por Unidade Organizacional, EPI e Lote específico.
  - Atributos da visão de saldo consolidado: `saldo_disponivel`, `saldo_reservado`, `saldo_em_transito`.
  - Relacionamentos:
    - `EPI` (Refência)
    - `Unidade` (Referência)
    - `Lote` (1:1) - Objeto contendo `data_fabricacao` e `data_vencimento`.
  - Comportamentos/Regras:
    - Concorrência: A dedução do `saldo_disponivel` exige concorrência otimista (ex: version checking ou lock) para evitar entregas fantasmas.
    - Não pode registrar movimentações retroativas para lotes fechados ou inexistentes.

## 3. Domínio: Operação de Entrega e Troca
Orquestra o ato de fornecer o equipamento ao colaborador e registrar o compromisso legal.

- **Entrega (Agregado Raiz)**
  - Atributos base: `id`, `data_entrega`, `status_entrega` (PENDENTE_ASSINATURA, CONCLUIDA, CANCELADA).
  - Relacionamentos:
    - `Colaborador` (Referência)
    - `Itens da Entrega` (1:N) - Componente interno que liga o `EPI` entregue, o `Lote` exato do qual foi retirado, a quantidade enviada e o cálculo de `data_proxima_troca`.
    - `Evidência` (1:N) - Links protegidos para as assinaturas (físicas scan ou biometria/token digital).
  - Comportamentos/Regras:
    - Validação de entrega: Uma `Entrega` só muda para `CONCLUIDA` se a `Evidência` legal for anexada (obrigatório para NR-6).
    - Agendamento: Ao concluir a entrega, o domínio emite um evento de domínio (`EntregaConcluidaEvent`) para notificar o Módulo de Alertas da `data_proxima_troca`.

## 4. Domínio: Plano de Troca e Devolução
Garante a economia circular do EPI e o ciclo regulatório.

- **Devolução / Troca**
  - Quando um item atinge a `data_proxima_troca` e um novo EPI da mesma categoria for solicitado, o sistema exige uma inspeção da obrigatoriedade de devolução (dependendo da Categoria do EPI - ex: cintos de segurança, respiradores caros).
  - Comportamento: Se a devolução é obrigatória e não ocorre no ato da troca, um `AlertaDePendencia` é anexado ao perfil do Colaborador.
