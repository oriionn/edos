CREATE TABLE `cpu_usage` (
	`server_id` integer NOT NULL,
	`usage` integer,
	`date` integer DEFAULT (unixepoch()) NOT NULL
);
