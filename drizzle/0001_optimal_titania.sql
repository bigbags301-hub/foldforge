CREATE TABLE `activations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`licenseId` int NOT NULL,
	`accountNumber` varchar(64) NOT NULL,
	`brokerServer` varchar(256) NOT NULL,
	`platform` enum('MT4','MT5') NOT NULL,
	`lastHeartbeat` timestamp,
	`activatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `broker_ohlc` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`symbol` varchar(64) NOT NULL,
	`broker` varchar(256) NOT NULL,
	`timeframe` varchar(16) NOT NULL,
	`openTime` bigint NOT NULL,
	`open` double NOT NULL,
	`high` double NOT NULL,
	`low` double NOT NULL,
	`close` double NOT NULL,
	`volume` double,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `broker_ohlc_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `broker_spreads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`symbol` varchar(64) NOT NULL,
	`broker` varchar(256) NOT NULL,
	`spreadPoints` double NOT NULL,
	`sampledAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `broker_spreads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `broker_symbols` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`symbol` varchar(64) NOT NULL,
	`broker` varchar(256) NOT NULL,
	`description` text,
	`digits` int,
	`contractSize` double,
	`minLot` double,
	`maxLot` double,
	`lotStep` double,
	`tickSize` double,
	`tickValue` double,
	`swapLong` double,
	`swapShort` double,
	`marginRequired` double,
	`spreadTypical` double,
	`tradeMode` varchar(32),
	`lastSyncAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `broker_symbols_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `download_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fileId` int NOT NULL,
	`downloadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `download_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `feature_flags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`flagKey` varchar(128) NOT NULL,
	`flagValue` boolean NOT NULL DEFAULT false,
	`description` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `feature_flags_id` PRIMARY KEY(`id`),
	CONSTRAINT `feature_flags_flagKey_unique` UNIQUE(`flagKey`)
);
--> statement-breakpoint
CREATE TABLE `files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` text,
	`category` enum('ea','indicator','template','documentation','other') NOT NULL DEFAULT 'other',
	`version` varchar(32) NOT NULL,
	`changelog` text,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` varchar(1024),
	`fileSize` int,
	`minPlan` enum('starter','pro','funded') NOT NULL DEFAULT 'starter',
	`isPublic` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `licenses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subscriptionId` int,
	`licenseKey` varchar(64) NOT NULL,
	`plan` enum('starter','pro','funded') NOT NULL,
	`maxActivations` int NOT NULL DEFAULT 1,
	`status` enum('active','suspended','expired','revoked') NOT NULL DEFAULT 'active',
	`gracePeriodEnd` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `licenses_id` PRIMARY KEY(`id`),
	CONSTRAINT `licenses_licenseKey_unique` UNIQUE(`licenseKey`)
);
--> statement-breakpoint
CREATE TABLE `studio_runs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(256) NOT NULL,
	`status` enum('queued','running','completed','failed','cancelled') NOT NULL DEFAULT 'queued',
	`symbol` varchar(64) NOT NULL,
	`timeframe` varchar(16) NOT NULL,
	`dataSource` enum('reference','broker') NOT NULL DEFAULT 'reference',
	`parameters` json,
	`results` json,
	`metrics` json,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studio_runs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`stripeSubscriptionId` varchar(128) NOT NULL,
	`stripeCustomerId` varchar(128) NOT NULL,
	`stripePriceId` varchar(128) NOT NULL,
	`plan` enum('starter','pro','funded') NOT NULL,
	`status` enum('active','trialing','past_due','canceled','unpaid','incomplete') NOT NULL DEFAULT 'active',
	`currentPeriodStart` timestamp,
	`currentPeriodEnd` timestamp,
	`cancelAtPeriodEnd` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_stripeSubscriptionId_unique` UNIQUE(`stripeSubscriptionId`)
);
--> statement-breakpoint
CREATE TABLE `symbol_reference` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(64) NOT NULL,
	`displayName` varchar(128) NOT NULL,
	`category` enum('forex','metals','indices','crypto','commodities','bonds') NOT NULL,
	`baseCurrency` varchar(16),
	`quoteCurrency` varchar(16),
	`digits` int NOT NULL DEFAULT 5,
	`contractSize` double NOT NULL DEFAULT 100000,
	`minLot` double NOT NULL DEFAULT 0.01,
	`maxLot` double NOT NULL DEFAULT 100,
	`lotStep` double NOT NULL DEFAULT 0.01,
	`tickSize` double,
	`tickValue` double,
	`typicalSpread` double,
	`marginPercent` double,
	`swapLong` double,
	`swapShort` double,
	`tradingHours` text,
	`description` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `symbol_reference_id` PRIMARY KEY(`id`),
	CONSTRAINT `symbol_reference_symbol_unique` UNIQUE(`symbol`)
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`subject` varchar(256) NOT NULL,
	`message` text NOT NULL,
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`adminReply` text,
	`repliedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `stripeCustomerId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `suspended` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `dataSourcePreference` enum('reference','broker') DEFAULT 'reference' NOT NULL;