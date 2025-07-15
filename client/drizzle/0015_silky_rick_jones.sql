PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`last_update` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_servers`("id", "name", "last_update") SELECT "id", "name", "last_update" FROM `servers`;--> statement-breakpoint
DROP TABLE `servers`;--> statement-breakpoint
ALTER TABLE `__new_servers` RENAME TO `servers`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `servers_id_unique` ON `servers` (`id`);