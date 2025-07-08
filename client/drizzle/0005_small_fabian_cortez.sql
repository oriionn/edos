ALTER TABLE `cpu_name` RENAME COLUMN "id" TO "server_id";--> statement-breakpoint
DROP INDEX `cpu_name_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `cpu_name_server_id_unique` ON `cpu_name` (`server_id`);