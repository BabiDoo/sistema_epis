# MVP Recomendado e Fases de Implementação

## Objetivo do MVP
O MVP deve entregar valor real no núcleo operacional do sistema: controlar estoque por lote, registrar entrega de EPI com evidência, manter histórico auditável e sinalizar pendências/vencimentos básicos.
Isso cobre a dor principal mostrada nos documentos do cliente: operação online/offline, controle de estoque inclusive em trânsito, entrega com identificação, devolução na troca, termo de autorização LGPD, histórico de fichas, integração por planilha/API e visão gerencial mínima.

## Escopo Mínimo do MVP
- Autenticação e perfis básicos;
- Cadastro de unidades, áreas, setores, cargos e colaboradores;
- Cadastro de EPIs, categorias e atributos;
- Controle de lotes e saldo por estoque;
- Entrada, saída, transferência e ajuste de estoque;
- Entrega online de EPI com evidência simples;
- Devolução e geração de pendência;
- Histórico de entregas por colaborador;
- Alertas básicos de vencimento de lote/EPI/ASO;
- Auditoria das operações críticas;
- Importação inicial por Excel;
- Estrutura base para operação offline, mas com sync restrito ao fluxo de entrega.

## O Que Fica Fora do MVP
- Biometria facial/digital real completa (apenso à evidência simplificada inicial);
- ERP bidirecional completo;
- Dashboards avançados;
- Checklists/OSS completos;
- Treinamentos e avaliações de campo completos;
- Workflow sofisticado de aprovação.

## Resultado Esperado do MVP
Ao final do MVP, o cliente já consegue:
- Saber quem recebeu qual EPI, de qual lote e quando;
- Controlar saldo real e pendências;
- Rastrear devolução na troca;
- Receber alertas básicos;
- Ter evidência e histórico auditável.

---

## Roadmap por Fases

A estrutura abaixo reaproveita a boa prática: começar pela base técnica, depois banco, módulos core, processamento assíncrono e por fim refinamentos, mantendo evolução incremental e baixo acoplamento.

### Fase 1 — Fundação Técnica
**Objetivo:** Subir a base do sistema com arquitetura limpa, autenticação e infraestrutura mínima.
**Escopo:**
- Criar solução e projetos base (.NET/Outros);
- Configurar banco relacional (PostgreSQL) e migrations;
- Health check funcional;
- Autenticação JWT e autorização por perfil;
- Middlewares globais e tratamento global de erro;
- Logging estruturado e OpenAPI (Swagger).
**Entregáveis:** Solução compilando, API respondendo, login funcional e banco conectado.

### Fase 2 — Cadastros Base
**Objetivo:** Estruturar os dados mestres organizacionais e o catálogo de EPIs.
**Escopo:**
- Unidades, áreas, setores, cargos e colaboradores;
- Perfis e usuários associados;
- Categorias de EPI, Cadastro de EPI e atributos técnicos;
- Upload inicial de anexos genéricos;
- Importação simples por Excel para dados mestres.

### Fase 3 — Estoque e Movimentações
**Objetivo:** Motor estrito de controle físico de EPIs (saldos, concorrência e lotes).
**Escopo:**
- Entidade de lote e consolidação de saldos;
- Operações atômicas de movimentação (Entrada, Saída, Transferência, Ajuste);
- Validações críticas de estoque não-negativo;
- Tabela transversal de auditoria (`audit_log`) capturando movimentos.

### Fase 4 — Entregas, Trocas e Devoluções
**Objetivo:** O coração operacional do almoxarifado (Geração de evidência e dedução).
**Escopo:**
- Estruturação do agregado de Entrega (Colaborador + Itens);
- Assinatura/Evidência embutida no momento da entrega;
- Baixa no estoque associada à entrega do lote;
- Criação do fluxo de devoluções obrigatórias e pendências automáticas;
- Motor base para processamento de operações offline recebidas do App.

### Fase 5 — Alertas e Motor de Regras Assíncronas
**Objetivo:** Sistema agir proativamente para proteger colaborador e a organização.
**Escopo:**
- Notificações de expiração de CA;
- Próxima troca agendada por colaborador com base na durabilidade do EPI entregue;
- Notificações de pendências por devoluções faltantes;
- Relatório base de compliance da NR-6.

### Fase 6 — Saúde e Segurança do Trabalho Extensiva
**Objetivo:** Evoluir a plataforma de estoque logístico para um hub de segurança ocupacional.
**Escopo:**
- ASOs integrados ao bloqueio de EPIs;
- Treinamentos registrados (quem falta realizar NR-XX);
- Integrações sistêmicas (ERP completo bidirecional);
- Avaliações de risco em campo e Checklists dinâmicos no App.
