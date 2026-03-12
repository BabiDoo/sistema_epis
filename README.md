# Sistema de Controle de EPIs (Equipamentos de Proteção Individual)

Um sistema corporativo completo para gestão e controle do ciclo de vida de EPIs dentro de empresas. O sistema permite o gerenciamento completo do estoque, rastreabilidade de equipamentos (via SKUs únicos), controle de validade e o registro avançado de movimentações com **assinatura digital**. 

O objetivo do projeto é substituir processos manuais e planilhas, mantendo o controle rigoroso sobre a entrega, troca, devolução e gestão de riscos, aumentando a conformidade com as normas de Segurança do Trabalho e protegendo os colaboradores de forma assertiva.

## 🚀 Principais Funcionalidades

- **Gestão de Perfil de Acesso & Onboarding:** Autenticação baseada em funções (Admin, Técnico de Segurança, Almoxarife, Colaborador) e capacidade de gerenciar os dados da empresa (segmento, CNPJ).
- **Prontuário Digital do Colaborador:** Ficha completa de cada funcionário, exibindo EPIs em uso, histórico de movimentações, admissão/demissão, documentos PDF e assinaturas das retiradas.
- **Controle de Estoque e SKUs:** Cadastro de cada unidade de EPI com SKU único, data de compra, data de vencimento e alertas de estoque.
- **Motor de Movimentações Avançado:** Registros de Substituição, Entrega, Empréstimo, Perda e Dano. Possibilidade de coletar assinaturas digitais via Canvas Touch no momento exato em que o EPI é entregue ou devolvido.
- **Módulo de Avaliações de Campo:** Ferramenta para Técnicos de Segurança cadastrarem laudos por setor da empresa, apontando os riscos (Físicos, Químicos, Biológicos, Ergonômicos) e as recomendações das necessidades de EPIs de cada setor.
- **Dashboards em Tempo Real:** Visão clara do índice de colaboradores por setor, EPIs vencidos, quantidade disponível em estoque e histórico de atividades recentes.

## 🛠️ Stack Tecnológica

O projeto foi construído utilizando um **Monorepo** combinando um ecossistema C#/.NET para a API de alto desempenho junto com uma arquitetura baseada em Node.js/React.

### Frontend
- **Framework & Libs:** React 19, Vite, TailwindCSS (v4+), Framer Motion, Radix UI.
- **Data Fetching:** tRPC e React Query (@tanstack/react-query).
- **Formulários:** React Hook Form integrado e validações Zod.
- **Componentes:** Componentes modernos utilizando shadcn/ui.

### Backend Integrado (C# .NET)
- Localizado no diretório `apps/api/`.
- **Framework:** .NET 8 (ASP.NET Core Web API).
- **Arquitetura Base:** DDD (Domain Driven Design) contendo Infraestrutura, Application, Domain e API.
- **Banco de Dados & ORM:** PostgreSQL utilizando Entity Framework Core, cuidando da lógica complexa de negócios.

### Suporte Node.js (Serviços e Ferramentas)
- Suporte backend auxiliar em Express com integração Drizzle ORM.
- Execução de scripts e tipagem unificada.

## 📁 Estrutura do Projeto

```bash
sistema_epis/
├── apps/               # Mono-repo (Aplicações integradas)
│   ├── api/            # Backend robusto em C# / .NET 8 e Entity Framework
├── server/             # Serviços do Node / Express e tRPC
├── drizzle/            # Migrações e configurações do Drizzle ORM do Node
├── package.json        # Dependências padronizadas (Frontend + Node)
└── todo.md             # Checklist e escopo completo do sistema
```

## ⚙️ Como Começar

### Pré-requisitos
- Node.js (v20+)
- PNPM (v10+)
- SDK do .NET 8
- PostgreSQL em execução

### Instalação (Pelo diretório raiz)

1. Clone o repositório e acesse a pasta.
2. Instale as dependências:
   ```bash
   pnpm install
   ```

3. Suba o banco de dados e aplique as migrações pelo Node (Drizzle):
   ```bash
   pnpm run db:push
   ```

4. Para executar o frontend (React) e backend (Node Server):
   ```bash
   pnpm run dev
   ```

5. Para rodar a API Principal em C#:
   Em um novo terminal, vá para a pasta da API e inicie a aplicação:
   ```bash
   cd apps/api
   dotnet run --project src/SistemaEpis.Api
   ```

A API principal estará disponível em `http://localhost:5204` (sujeito à configuração do `launchSettings.json`).

---

## 📚 Documentação e Arquitetura 

Este projeto foi desenhado sob forte padrão arquitetural para garantir manutenção e escalabilidade:

- **Clean Architecture & DDD:** O backend em C# isola estritamente Regras de Negócio (`Domain`), Casos de Uso (`Application`) e detalhes técnicos (`Infrastructure`).
- **Entity Framework Core Configurado:** Todo o mapeamento ORM e configurações do PostgreSQL estão centralizados de forma desacoplada no projeto de infraestrutura.
- **Swagger / OpenAPI:** A documentação interativa da API já se encontra configurada e mapeada!

**Para acessar a documentação da API (Swagger UI):**
Com o projeto `SistemaEpis.Api` rodando (veja a seção acima de Como Começar), abra o seu navegador e acesse:

👉 **`http://localhost:5204/docs`**

Aqui você poderá interagir com todos os endpoints mapeados, inspecionar contratos de Response/Request e validar os Schemas criados para as APIs do projeto.



---
*Este projeto foi concebido para entregar uma solução completa de ponta-a-ponta na gestão da Segurança do Trabalho corporativa.*
