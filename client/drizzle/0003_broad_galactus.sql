PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cpu_usage` (
	`server_id` integer NOT NULL,
	`usage` real NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_cpu_usage`("server_id", "usage", "date") SELECT "server_id", "usage", "date" FROM `cpu_usage`;--> statement-breakpoint
DROP TABLE `cpu_usage`;--> statement-breakpoint
ALTER TABLE `__new_cpu_usage` RENAME TO `cpu_usage`;--> statement-breakpoint
PRAGMA foreign_keys=ON;