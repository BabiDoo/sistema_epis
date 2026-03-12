# 1. Objetivo do sistema
O sistema de gestão de EPIs tem como objetivo central controlar, de ponta a ponta, o ciclo de vida dos equipamentos de proteção individual dentro de uma organização: cadastro, estoque por lote, distribuição, devolução, troca, validade, rastreabilidade, conformidade trabalhista e evidências de entrega.

Pelos documentos do cliente, o produto não é apenas um “estoque de EPIs”, mas uma plataforma operacional e de compliance, com entrega online e offline, autenticação forte da retirada, auditoria, gestão de ASO, treinamentos, avaliações de campo, checklists/OSS e integração com ERP e planilhas.

O problema de negócio resolvido é a falta de controle confiável sobre quem recebeu qual EPI, quando recebeu, sob qual autorização, com qual lote, em que condição de validade, se houve devolução na troca, se o colaborador estava apto documentalmente, e se a operação está aderente à NR-6, LGPD e rotinas corporativas.

O sistema também reduz risco operacional ao prever trocas, alertar vencimentos, bloquear entregas indevidas e manter histórico auditável.

# 2. Contexto analisado

## 2.1 O que foi entendido dos arquivos do cliente
Os materiais do cliente mostram um escopo corporativo amplo para gestão de EPIs com os seguintes pilares:
- Acesso online e offline;
- Planejamento de entrega baseado em durabilidade, solicitações, grupos de entrega e validade de lote;
- Autenticação da entrega por assinatura, senha, crachá, biometria digital e facial;
- Controle de estoque inclusive em trânsito;
- Entrada e saída com senha de liberação;
- Auditoria de atrasos;
- Reserva ou aprovação via ERP;
- Devolução obrigatória na troca;
- Bloqueio ou alerta por antecedência máxima;
- Transferência ou descarte quando o colaborador muda de área;
- Termo de autorização LGPD;
- Solicitação extraordinária de troca e notificação de uso indevido;
- Características técnicas do EPI como tamanho, cor e numeração;
- Gestão documental e gestão de treinamentos;
- Dashboards com histórico de fichas e pendências;
- Integração por Excel e API, hospedagem com backups diários em Azure.

O arquivo "SISTEMA" reforça módulos específicos de ASO com alertas de vencimento, treinamentos com emissão de certificado digital assinado pelo trabalhador, avaliação de campo de riscos (físicos/químicos/biológicos) com fotos, data/hora e assinatura, além de OSS (Ordem de Serviço de Segurança) para atividades críticas como solda, eletricidade, trabalho em altura e espaço confinado.

O formulário de vistoria evidencia um processo operacional real de visita técnica e levantamento ocupacional por setor, cargo e riscos, com observações por servidor. Isso sugere que o domínio de avaliação de campo/checklist não é opcional decorativo; ele se conecta diretamente à definição de riscos ocupacionais e possivelmente à recomendação/obrigatoriedade de entrega.

O arquivo "GESTÃO DE EPIS" descreve o caso de uso principal do produto: o ciclo da entrega e devolução para manter conformidade.

# 3. Mapeamento de Requisitos Funcionais (Core)

Módulo: Autenticação e Perfis
- RF-01: O sistema deve permitir login com e-mail e senha.
- RF-02: O sistema deve suportar perfis de acesso (ex: admin, almoxarife, colaborador, técnico de segurança).
- RF-03: O sistema deve restringir acesso e visibilidade de dados com base na unidade/área de atuação do usuário.

Módulo: Estrutura Organizacional Base
- RF-04: O sistema deve permitir o cadastro de Unidades.
- RF-05: O sistema deve permitir o cadastro de Áreas vinculadas às unidades.
- RF-06: O sistema deve permitir o cadastro de Setores vinculados às áreas.
- RF-07: O sistema deve permitir o cadastro de Cargos.
- RF-08: O sistema deve permitir o cadastro de Colaboradores vinculados a unidade, área, setor e cargo, garantindo a integridade hierárquica do vínculo.

Módulo: Catálogo de EPIs
- RF-09: O sistema deve permitir cadastrar categorias de EPI.
- RF-10: O sistema deve permitir cadastrar EPIs com nome, fabricante, foto, CA e validade do CA.
- RF-11: O sistema deve prever a durabilidade padrão (em dias) de cada EPI.
- RF-12: O sistema deve permitir definir numeração, tamanho, cor e outras características técnicas do EPI através de um modelo flexível de Atributos Técnicos (Chave/Valor).
    - As chaves devem ser normalizadas e os valores são de preenchimento obrigatório.

Módulo: Estoque
- RF-13: O sistema deve manter o saldo físico por lote, associando quantidade a uma data de vencimento.
- RF-14: O sistema deve rastrear estoques em trânsito e saldos bloqueados/reservados.
- RF-15: O fluxo de abastecimento de estoque deve rastrear origens e responsáveis.

Módulo: Entregas (Online/Offline)
- RF-16: Sistema suporta filas de requisições retidas no dispositivo móvel para posterior sincronização com nuvem.
- RF-17: Sistema valida autenticação presencial do colaborador (Assinatura, Senha ou Biometria).
- RF-18: Sistema gera o recibo estruturado da entrega compatível com FICHA NR-6.

Módulo: Integrações e Importação (Fase 2)
- RF-19: O sistema deve permitir a importação de colaboradores via arquivo Excel (.xlsx) através de um endpoint multipart/form-data.
- RF-20: O processo de importação deve realizar o provisionamento automático (Upsert) da estrutura organizacional (Unidade, Área, Setor e Cargo) com base nos nomes fornecidos na planilha.
- RF-21: O sistema deve validar os cabeçalhos esperados e a integridade de cada linha antes de processar o registro.
- RF-22: O sistema deve retornar um sumário detalhado da operação: total processado, sucesso, falhas e descrição detalhada de erros por linha.
- RF-23: O layout esperado da planilha deve conter as colunas: `NomeCompleto`, `Matricula`, `Cpf`, `Email`, `Unidade`, `Area`, `Setor`, `Cargo`.
- RF-24: Regras de obrigatoriedade na importação: `NomeCompleto`, `Matricula`, `Unidade`, `Area`, `Setor` e `Cargo` são campos obrigatórios. `Cpf` e `Email` são opcionais.

# 4. Invariantes de Domínio (Regras Críticas de Negócio)
Para garantir a integridade do sistema, as seguintes regras são absolutas e devem ser garantidas pelo backend:
- IN-01 (Consistência de Saldo): Não é possível registrar uma entrega de EPI sem saldo disponível no estoque para o respectivo lote e unidade.
- IN-02 (Validade): Não é permitido entregar ou movimentar lotes de EPI que estejam com a validade expirada ou CA vencido (configurável restrição dura vs alerta).
- IN-03 (Rastreabilidade de Estoque): Não é possível alterar, remover ou adicionar saldo de estoque sem gerar um registro correspondente na tabela de movimentação. Toda mutação de saldo gera uma entrada em `audit_log`.
- IN-04 (Devoluções): O sistema rastreia EPIs de "dupla troca" ou devolução obrigatória. A ausência de baixa do EPI antigo antes/durante a emissão de um novo gera um alerta de pendência para o colaborador e técnico responsável.
- IN-05 (Garantia Offline e Idempotência): Retentativas do app ou duplos-cliques na interface em momento de lentidão não podem causar dupla-dedução no saldo. Operações conflitantes são isoladas e enfileiradas.
- IN-06 (Integridade Hierárquica): É proibido o vínculo de um colaborador a uma Área ou Setor que não pertença à Unidade informada no momento do cadastro. O backend deve validar a árvore organizacional antes da persistência.

# 5. Política Universal de Anexos (v2)
- **Conceito**: Os anexos são genéricos e não pertencem rigidamente a uma única entidade. Eles usam o padrão `EntidadeTipo` + `EntidadeId` para flexibilidade (Ex: foto de EPI, assinatura de entrega, PDF de ASO).
- **Storage Estratégia**:
    - **V1 (Atual)**: Armazenamento em sistema de arquivos local (pasta configurável) com persistência de metadados no banco.
    - **Evolução**: Abstração total para migração transparente para Object Storage (Azure Blob/S3).
- **Requisitos Técnicos**:
    - Persistência obrigatória de: `TipoAnexo` (Enum), `UrlStorage` (Caminho relativo/URL), `NomeOriginal`, `ContentType` e `TamanhoBytes`.
    - Rastreabilidade: Opcionalmente vinculado ao `UsuarioId` que realizou o upload.
    - Validação: O sistema deve validar o tamanho e o tipo de arquivo antes do upload.
