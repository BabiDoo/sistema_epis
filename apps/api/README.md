# Sistema EPIs

O Sistema EPIs é uma plataforma corporativa projetada para gerenciar a distribuição, estoque e auditoria de Equipamentos de Proteção Individual (EPIs). Este monorepo agrupa a API baseada em .NET e o projeto Frontend (em estruturação).

## Arquitetura e Tecnologias

A API do Sistema EPIs foi construída seguindo os princípios de **Clean Architecture**, dividindo responsabilidades nos seguintes módulos:

*   **API**: A camada de apresentação (Controllers, Configuração do WebHost, Middlewares Globais de Erro, Swagger/OpenAPI).
*   **Application**: A camada de casos de uso (Regras de negócio, Serviços, Contratos).
*   **Domain**: A camada de núcleo (Entidades, Interfaces de Repositório, Value Objects).
*   **Infrastructure**: A camada de dados e infraestrutura externa (Entity Framework Core, PostgreSQL, Autenticação JWT, Logging).

### Principais Bibliotecas Utilizadas:

*   `.NET 8`
*   `Entity Framework Core` (PostgreSQL via Npgsql)
*   `Microsoft.AspNetCore.Authentication.JwtBearer` (Autenticação JWT)
*   `Serilog` (Logging Estruturado)
*   `Swashbuckle.AspNetCore` (OpenAPI/Swagger)
*   `Docker` e `Docker Compose`

## Pré-requisitos

Para buildar e rodar o projeto localmente, certifique-se de ter os seguintes componentes instalados:

*   [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop) (para rodar o PostgreSQL em container local)
*   [Postman](https://www.postman.com/) ou a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) (opcional, para testes de requisições).

## Como Instalar e Rodar

### 1. Iniciar o Banco de Dados (PostgreSQL via Docker)

Na raiz do projeto (onde está o `docker-compose.yml`), execute:

```bash
docker compose up -d
```

Validando o Docker:
```bash
docker ps
```
Você deverá ver o `sistema_epis_postgres` executando na porta `5432`.

### 2. Rodar a API

Vá para o diretório da API (`apps/api`) e rode o seguinte comando para inicializar a aplicação no ambiente de desenvolvimento:

```bash
cd apps/api
ASPNETCORE_ENVIRONMENT=Development dotnet run --project src/SistemaEpis.Api
```

> **Aviso de Ambiente (Windows PowerShell)**: Se o comando acima der erro, tente declarar as variáveis separadamente:
> `$env:ASPNETCORE_ENVIRONMENT="Development"; dotnet run --project src/SistemaEpis.Api`

O framework executará automaticamente as _migrations_ pendentes (criando as tabelas) e inserirá os usuários padrão no banco (Seed Database).

### 3. Acessando a Documentação Oficial (Swagger UI)

Acesse no navegador:
**[http://localhost:5204/docs](http://localhost:5204/docs)**

## Autenticação (Fase 1)

O sistema possui autenticação JWT. Para testar endpoins protegidos, você precisa gerar o Token:

1.  A página `/docs` já expõe os endpoints abertos e protegidos.
2.  Procure a rota `POST /api/v1/Auth/login`.
3.  Utilize a seguinte credencial embutida (Seed Database):
    *   **Email**: `admin@sistemaepis.com`
    *   **Senha**: `123456`
4.  Copie o campo `token` da resposta.
5.  Clique no botão **Authorize** (topo da página), preencha o campo com `Bearer SEUTOKENAQUI` e divirta-se.

_Nota: No diretório `apps/api` você também conta com um arquivo `request.http` com queries prontas já configuradas para injetar o Token automaticamente caso prefira usar o VS Code REST Client._

## Status do Projeto

✅ **[Fase 1] Infraestrutura Base**: Banco, API, Health Check, Auth JWT, Swagger, Tratamento de erros, Serilog configurados e homologados!
⏳ **[Fase 2] A seguir**: Estrutura Organizacional e Módulo RH.
