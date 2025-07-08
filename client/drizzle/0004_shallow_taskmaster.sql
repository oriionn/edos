CREATE TABLE `disks` (
	`server_id` integer NOT NULL,
	`device` text NOT NULL,
	`name` text NOT NULL,
	`free_size` integer NOT NULL,
	`total_size` integer NOT NULL,
	`last_update` integer DEFAULT (unixepoch()) NOT NULL
);
