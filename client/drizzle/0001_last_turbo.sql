CREATE TABLE `cpu_name` (
	`id` integer NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cpu_name_id_unique` ON `cpu_name` (`id`);