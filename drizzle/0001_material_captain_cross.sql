CREATE TABLE `avaliacoesCampo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`empresaId` int NOT NULL,
	`local` varchar(255) NOT NULL,
	`dataAvaliacao` timestamp NOT NULL,
	`tecnicoResponsavelId` int NOT NULL,
	`observacoesGerais` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `avaliacoesCampo_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `colaboradores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`empresaId` int NOT NULL,
	`nome` varchar(255) NOT NULL,
	`funcao` varchar(100) NOT NULL,
	`setor` varchar(100) NOT NULL,
	`dataAdmissao` timestamp NOT NULL,
	`dataDemissao` timestamp,
	`status` enum('ativo','inativo') NOT NULL DEFAULT 'ativo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `colaboradores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `empresas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`razaoSocial` varchar(255) NOT NULL,
	`cnpj` varchar(18) NOT NULL,
	`grauRisco` int NOT NULL,
	`endereco` text,
	`municipio` varchar(100),
	`uf` varchar(2),
	`cep` varchar(10),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `empresas_id` PRIMARY KEY(`id`),
	CONSTRAINT `empresas_cnpj_unique` UNIQUE(`cnpj`)
);
--> statement-breakpoint
CREATE TABLE `epis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tipoEpiId` int NOT NULL,
	`sku` varchar(100) NOT NULL,
	`dataCompra` timestamp NOT NULL,
	`dataValidade` timestamp NOT NULL,
	`status` enum('disponivel','em_uso','vencido','descartado') NOT NULL DEFAULT 'disponivel',
	`colaboradorAtualId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `epis_id` PRIMARY KEY(`id`),
	CONSTRAINT `epis_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `movimentacoes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`epiId` int NOT NULL,
	`colaboradorId` int NOT NULL,
	`tipo` enum('emprestimo','troca','devolucao') NOT NULL,
	`motivo` text,
	`dataMovimentacao` timestamp NOT NULL DEFAULT (now()),
	`usuarioResponsavelId` int NOT NULL,
	`assinaturaUrl` text,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `movimentacoes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `setoresAvaliados` (
	`id` int AUTO_INCREMENT NOT NULL,
	`avaliacaoCampoId` int NOT NULL,
	`nomeSetor` varchar(255) NOT NULL,
	`funcoesCargos` text NOT NULL,
	`nomeServidor` varchar(255),
	`riscosFisicos` text,
	`riscosQuimicos` text,
	`riscosBiologicos` text,
	`observacoes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `setoresAvaliados_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tiposEpi` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nome` varchar(255) NOT NULL,
	`categoria` varchar(100) NOT NULL,
	`ca` varchar(50) NOT NULL,
	`fabricante` varchar(255),
	`orientacoesUso` text,
	`vidaUtilPadrao` int NOT NULL,
	`observacoesTecnicas` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tiposEpi_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','tecnico_seguranca','almoxarife','colaborador') NOT NULL DEFAULT 'colaborador';--> statement-breakpoint
ALTER TABLE `users` ADD `colaboradorId` int;