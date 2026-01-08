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
