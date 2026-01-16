# Sistema de Controle de EPIs - TODO

## 1. Modelo de Dados e Schema do Banco
- [x] Criar tabela de empresas
- [x] Criar tabela de colaboradores
- [x] Criar tabela de tipos de EPI
- [x] Criar tabela de EPIs individuais (SKU)
- [x] Criar tabela de movimentações
- [x] Criar tabela de avaliações de campo
- [x] Criar tabela de setores avaliados
- [x] Criar tabela de assinaturas digitais
- [x] Atualizar tabela de usuários com perfis de acesso

## 2. Sistema de Autenticação e Perfis de Acesso
- [x] Implementar enum de perfis (admin, tecnico_seguranca, almoxarife, colaborador)
- [x] Criar middleware de autorização por perfil
- [x] Implementar verificação de permissões no backend

## 3. Cadastros Básicos
- [ ] CRUD de empresas (razão social, CNPJ, grau de risco, endereço)
- [ ] CRUD de colaboradores (dados funcionais, função, setor, admissão)
- [ ] CRUD de usuários do sistema
- [ ] Interface de listagem e formulários

## 4. Gestão de EPIs
- [ ] CRUD de tipos de EPI (nome, categoria, CA, fabricante, orientações, vida útil)
- [ ] CRUD de EPIs individuais com SKU único
- [ ] Controle de status (Disponível, Em Uso, Vencido, Descartado)
- [ ] Interface de gestão de estoque

## 5. Fluxo de Movimentação de EPIs
- [ ] Implementar empréstimo de EPI com assinatura digital
- [ ] Implementar troca de EPI com registro de motivo
- [ ] Implementar devolução de EPI
- [ ] Atualização automática de status
- [ ] Componente de assinatura digital via canvas

## 6. Prontuário Digital do Colaborador
- [ ] Visualização de dados cadastrais
- [ ] Listagem de EPIs ativos
- [ ] Histórico completo de movimentações
- [ ] Exportação de prontuário em PDF

## 7. Módulo de Avaliação de Campo
- [ ] Cadastro de avaliações (empresa, local, data, responsável)
- [ ] Avaliação por setor com riscos (físicos, químicos, biológicos)
- [ ] Campo de observações técnicas
- [ ] Histórico de avaliações

## 8. Sistema de Alertas
- [ ] Alerta de vencimento próximo
- [ ] Alerta de EPIs vencidos
- [ ] Painel de irregularidades
- [ ] Relatório de colaboradores com EPIs vencidos

## 9. Dashboard Administrativo
- [x] Visão geral de EPIs (em uso, vencidos, disponíveis)
- [x] Colaboradores por setor
- [x] Últimas movimentações
- [x] Gráficos e estatísticas

## 10. Módulo de Relatórios
- [ ] Relatório de EPIs por colaborador
- [ ] Relatório de EPIs vencidos por setor
- [ ] Relatório de avaliações de campo
- [ ] Histórico de ações do sistema
- [ ] Exportação em PDF
- [ ] Exportação em Excel

## 11. Interface e UX
- [x] Design profissional para sistema corporativo
- [x] Layout com header e navegação
- [x] Navegação por perfil de acesso
- [ ] Responsividade mobile
- [x] Estados de loading e erro


## 12. Fluxo de Onboarding e Cadastro Inicial
- [x] Página de cadastro inicial da empresa após landing page
- [x] Formulário com razão social, CNPJ, segmento, endereço completo
- [ ] Validação de CNPJ
- [x] Redirecionamento automático para dashboard após cadastro

## 13. Gestão Completa de Colaboradores
- [x] Upload de foto do colaborador (base64)
- [x] Campos completos: nome, CPF, telefone, email, função, setor
- [x] Data de admissão e demissão
- [ ] Validação de CPF
- [x] Tabela com busca e filtros
- [x] Formulário de criação e edição
- [x] Visualização detalhada do colaborador

## 14. Sistema de Convite e Acesso para Colaboradores
- [ ] Gerar convite de acesso ao cadastrar colaborador
- [ ] Enviar link de acesso por email
- [ ] Colaborador cria senha no primeiro acesso
- [ ] Vinculação automática do usuário ao colaborador
- [ ] Permissões de acesso para gestão de EPIs e avaliações

## 15. Melhorias no Schema do Banco
- [x] Adicionar campo 'segmento' na tabela empresas
- [x] Adicionar campo 'fotoUrl' na tabela colaboradores
- [x] Adicionar campo 'telefone' na tabela colaboradores
- [x] Adicionar campo 'cpf' na tabela colaboradores
- [x] Adicionar campo 'email' na tabela colaboradores


## 16. Cadastro de EPIs com Geração Automática de SKU
- [x] Formulário de cadastro de EPI com tipo, data de compra, período de vencimento
- [x] Campo de quantidade comprada
- [x] Geração automática de SKU único para cada unidade (ex: EPI-2024-00001)
- [x] Criar múltiplos EPIs individuais ao finalizar cadastro
- [x] Cada EPI individual com mesmo tipo, data de compra e vencimento
- [x] Status inicial "Disponível" para todos os EPIs criados
- [x] Cálculo automático de data de vencimento baseado no período

## 17. Gestão de Tipos de EPI
- [x] CRUD de tipos de EPI (capacete, luva, bota, etc.)
- [x] Campos: nome, categoria, CA (Certificado de Aprovação), fabricante
- [x] Orientações de uso e vida útil padrão

## 18. Listagem e Gestão de EPIs Individuais
- [x] Tabela de EPIs com SKU, tipo, status, data de compra, vencimento
- [x] Busca por SKU, tipo, status
- [x] Filtros por status (Disponível, Em Uso, Vencido, Descartado)
- [ ] Visualização detalhada de cada EPI individual
- [ ] Histórico de movimentações por SKU


## 19. Sistema de Ficha de EPI com Movimentações
- [x] Interface de ficha de EPI para colaboradores
- [x] Tipos de movimentação: Substituição, Entrega, Empréstimo, Perda, Dano
- [x] Seleção de EPI por SKU
- [x] Campo de data da movimentação
- [x] Campo de motivo/observações
- [x] Componente de assinatura digital via canvas touch
- [x] Salvar assinatura como imagem (base64)
- [x] Armazenar movimentação completa no banco de dados

## 20. Atualização Automática de Status dos EPIs
- [x] Entrega/Empréstimo: atualizar status para "Em Uso"
- [x] Devolução: atualizar status para "Disponível"
- [x] Perda/Dano: atualizar status para "Descartado"
- [x] Vincular EPI ao colaborador na movimentação
- [x] Desvincular EPI do colaborador na devolução

## 21. Prontuário Digital do Colaborador
- [x] Visualização de dados cadastrais do colaborador
- [x] Listagem de EPIs atualmente em uso
- [x] Histórico completo de movimentações
- [x] Exibição de assinaturas digitais
- [ ] Filtros por período e tipo de movimentação

## 22. Geração de Laudos em PDF
- [ ] Exportar prontuário completo em PDF
- [ ] Incluir dados do colaborador
- [ ] Incluir todas as movimentações com datas
- [ ] Incluir assinaturas digitais nas movimentações
- [ ] Relatório de movimentações por período para administradores
- [ ] Exportar lista de EPIs por colaborador em PDF

Obs: Interface preparada com botão de exportação, implementação da geração de PDF será feita na próxima etapa


## 23. Módulo de Avaliações de Campo
- [x] Atualizar schema com campos necessários para avaliações
- [x] Cadastro de avaliações de campo por setor
- [x] Identificação de riscos por categoria (Físicos, Químicos, Biológicos, Ergonômicos, Acidentes)
- [x] Campo de observações técnicas detalhadas
- [x] Recomendações de EPIs necessários
- [x] Medidas de controle sugeridas
- [x] Status da avaliação (Pendente, Em Andamento, Concluída)
- [x] Listagem de avaliações com filtros por setor, data, status
- [x] Visualização detalhada de cada avaliação
- [x] Histórico completo de avaliações por setor
- [x] Controle de acesso (apenas técnicos de segurança e admin)


## 24. Importação em Massa de Colaboradores via CSV
- [x] Endpoint de importação em lote (tRPC procedure)
- [x] Parser de CSV com suporte a colunas: Nome, CPF, Telefone, Email, Função, Setor, Data de Admissão
- [x] Validação de dados antes de importar
- [x] Verificação de CPF duplicado
- [x] Componente de upload de arquivo CSV
- [x] Preview dos dados a serem importados
- [x] Opção de revisar e confirmar importação
- [x] Importação em lote no banco de dados
- [x] Relatório de sucesso/erro com detalhes
- [x] Tratamento de erros com mensagens claras
- [x] Testes unitários para importação em massa
