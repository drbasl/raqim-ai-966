CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "activityLog" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activityLog_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"action" varchar(50) NOT NULL,
	"entityType" varchar(50) NOT NULL,
	"entityId" integer,
	"details" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "popularPrompts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "popularPrompts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text,
	"prompt" text NOT NULL,
	"usageType" varchar(50) NOT NULL,
	"category" varchar(50) NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"likesCount" integer DEFAULT 0 NOT NULL,
	"createdBy" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promptRatings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "promptRatings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"promptId" integer NOT NULL,
	"userId" integer NOT NULL,
	"rating" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "savedPrompts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "savedPrompts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"basePrompt" text NOT NULL,
	"enhancedPrompt" text NOT NULL,
	"usageType" varchar(50) NOT NULL,
	"tags" text,
	"isFavorite" integer DEFAULT 0 NOT NULL,
	"shareToken" varchar(64),
	"isPublic" integer DEFAULT 0 NOT NULL,
	"shareCount" integer DEFAULT 0 NOT NULL,
	"viewCount" integer DEFAULT 0 NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "savedPrompts_shareToken_unique" UNIQUE("shareToken")
);
--> statement-breakpoint
CREATE TABLE "templateRatings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "templateRatings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"templateId" varchar(100) NOT NULL,
	"userId" integer NOT NULL,
	"rating" integer NOT NULL,
	"comment" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templateUsage" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "templateUsage_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"templateId" varchar(100) NOT NULL,
	"usageCount" integer DEFAULT 0 NOT NULL,
	"lastUsedAt" timestamp DEFAULT now() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "templateUsage_templateId_unique" UNIQUE("templateId")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
CREATE TABLE "worksheets" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "worksheets_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"generationMethod" varchar(50) NOT NULL,
	"questionType" varchar(50) NOT NULL,
	"questionCount" integer NOT NULL,
	"language" varchar(50) NOT NULL,
	"gradeLevel" varchar(50) NOT NULL,
	"lessonTitle" varchar(255) NOT NULL,
	"teacherName" varchar(255),
	"schoolName" varchar(255),
	"content" text NOT NULL,
	"sourceText" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "activityLog" ADD CONSTRAINT "activityLog_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "popularPrompts" ADD CONSTRAINT "popularPrompts_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promptRatings" ADD CONSTRAINT "promptRatings_promptId_popularPrompts_id_fk" FOREIGN KEY ("promptId") REFERENCES "public"."popularPrompts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promptRatings" ADD CONSTRAINT "promptRatings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "savedPrompts" ADD CONSTRAINT "savedPrompts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "templateRatings" ADD CONSTRAINT "templateRatings_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "worksheets" ADD CONSTRAINT "worksheets_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activityLog_userId_idx" ON "activityLog" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "activityLog_createdAt_idx" ON "activityLog" USING btree ("createdAt");--> statement-breakpoint
CREATE INDEX "popularPrompts_category_idx" ON "popularPrompts" USING btree ("category");--> statement-breakpoint
CREATE INDEX "popularPrompts_createdBy_idx" ON "popularPrompts" USING btree ("createdBy");--> statement-breakpoint
CREATE INDEX "promptRatings_promptId_idx" ON "promptRatings" USING btree ("promptId");--> statement-breakpoint
CREATE INDEX "promptRatings_userId_idx" ON "promptRatings" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "savedPrompts_userId_idx" ON "savedPrompts" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "savedPrompts_shareToken_idx" ON "savedPrompts" USING btree ("shareToken");--> statement-breakpoint
CREATE INDEX "templateRatings_templateId_idx" ON "templateRatings" USING btree ("templateId");--> statement-breakpoint
CREATE INDEX "templateRatings_userId_idx" ON "templateRatings" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "templateUsage_templateId_idx" ON "templateUsage" USING btree ("templateId");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "worksheets_userId_idx" ON "worksheets" USING btree ("userId");