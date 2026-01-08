ALTER TABLE `colaboradores` ADD `cpf` varchar(14);--> statement-breakpoint
ALTER TABLE `colaboradores` ADD `email` varchar(320);--> statement-breakpoint
ALTER TABLE `colaboradores` ADD `telefone` varchar(20);--> statement-breakpoint
ALTER TABLE `colaboradores` ADD `fotoUrl` text;--> statement-breakpoint
ALTER TABLE `empresas` ADD `segmento` varchar(100);--> statement-breakpoint
ALTER TABLE `colaboradores` ADD CONSTRAINT `colaboradores_cpf_unique` UNIQUE(`cpf`);