CREATE TABLE `network` (
	`server_id` integer NOT NULL,
	`upload_sec` integer NOT NULL,
	`download_sec` integer NOT NULL,
	`upload_all` integer NOT NULL,
	`download_all` integer NOT NULL,
	`date` integer DEFAULT (unixepoch()) NOT NULL
);
