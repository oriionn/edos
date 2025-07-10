CREATE TABLE `memory` (
	`server_id` integer NOT NULL,
	`free_hard` integer NOT NULL,
	`total_hard` integer NOT NULL,
	`free_swap` integer NOT NULL,
	`total_swap` integer NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL
);
