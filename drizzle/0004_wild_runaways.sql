DROP TABLE `setoresAvaliados`;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `setor` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `status` enum('pendente','em_andamento','concluida') DEFAULT 'pendente' NOT NULL;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `riscosFisicos` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `riscosQuimicos` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `riscosBiologicos` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `riscosErgonomicos` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `riscosAcidentes` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `observacoesTecnicas` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `episRecomendados` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` ADD `medidasControle` text;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` DROP COLUMN `local`;--> statement-breakpoint
ALTER TABLE `avaliacoesCampo` DROP COLUMN `observacoesGerais`;