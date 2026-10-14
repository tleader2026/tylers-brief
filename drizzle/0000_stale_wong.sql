CREATE TABLE `history` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`value` text NOT NULL,
	`observed` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`domain` text NOT NULL,
	`provider` text NOT NULL,
	`value` text NOT NULL,
	`retrieved` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`provider` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workspace` (
	`user` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated` text NOT NULL
);
