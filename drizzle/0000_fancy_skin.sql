CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`price` numeric NOT NULL,
	`available` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `available_index` ON `products` (`available`);