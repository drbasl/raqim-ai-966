CREATE TABLE `templateRatings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` varchar(100) NOT NULL,
	`userId` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `templateRatings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templateUsage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`templateId` varchar(100) NOT NULL,
	`usageCount` int NOT NULL DEFAULT 0,
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `templateUsage_id` PRIMARY KEY(`id`),
	CONSTRAINT `templateUsage_templateId_unique` UNIQUE(`templateId`)
);
