CREATE TABLE `uptime` (
	`server_id` integer NOT NULL,
	`uptime` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uptime_server_id_unique` ON `uptime` (`server_id`);