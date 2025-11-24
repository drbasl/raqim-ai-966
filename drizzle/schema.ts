import { integer, pgEnum, pgTable, text, timestamp, varchar, index } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// Define enum for user role
export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
}, (table) => ({
  emailIdx: index("users_email_idx").on(table.email),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Saved prompts table - stores user's personal prompt library
 */
export const savedPrompts = pgTable("savedPrompts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  basePrompt: text("basePrompt").notNull(),
  enhancedPrompt: text("enhancedPrompt").notNull(),
  usageType: varchar("usageType", { length: 50 }).notNull(),
  tags: text("tags"), // JSON array of tags
  isFavorite: integer("isFavorite").default(0).notNull(), // 0 = false, 1 = true
  shareToken: varchar("shareToken", { length: 64 }).unique(), // Unique token for sharing
  isPublic: integer("isPublic").default(0).notNull(), // 0 = private, 1 = public
  shareCount: integer("shareCount").default(0).notNull(), // Number of times shared
  viewCount: integer("viewCount").default(0).notNull(), // Number of views on public link
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("savedPrompts_userId_idx").on(table.userId),
  shareTokenIdx: index("savedPrompts_shareToken_idx").on(table.shareToken),
}));

export type SavedPrompt = typeof savedPrompts.$inferSelect;
export type InsertSavedPrompt = typeof savedPrompts.$inferInsert;

/**
 * Popular prompts table - community shared prompts with ratings
 */
export const popularPrompts = pgTable("popularPrompts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  usageType: varchar("usageType", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  rating: integer("rating").default(0).notNull(), // Average rating * 10 (e.g., 45 = 4.5 stars)
  usageCount: integer("usageCount").default(0).notNull(),
  likesCount: integer("likesCount").default(0).notNull(),
  createdBy: integer("createdBy").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  categoryIdx: index("popularPrompts_category_idx").on(table.category),
  createdByIdx: index("popularPrompts_createdBy_idx").on(table.createdBy),
}));

export type PopularPrompt = typeof popularPrompts.$inferSelect;
export type InsertPopularPrompt = typeof popularPrompts.$inferInsert;

/**
 * Prompt ratings table - stores user ratings for popular prompts
 */
export const promptRatings = pgTable("promptRatings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  promptId: integer("promptId").notNull().references(() => popularPrompts.id, { onDelete: "cascade" }),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  promptIdIdx: index("promptRatings_promptId_idx").on(table.promptId),
  userIdIdx: index("promptRatings_userId_idx").on(table.userId),
}));

export type PromptRating = typeof promptRatings.$inferSelect;
export type InsertPromptRating = typeof promptRatings.$inferInsert;

/**
 * Activity log table - tracks all user activities
 */
export const activityLog = pgTable("activityLog", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 50 }).notNull(), // generate, save, delete, update, favorite
  entityType: varchar("entityType", { length: 50 }).notNull(), // prompt, template, etc.
  entityId: integer("entityId"), // ID of the related entity
  details: text("details"), // JSON with additional info
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("activityLog_userId_idx").on(table.userId),
  createdAtIdx: index("activityLog_createdAt_idx").on(table.createdAt),
}));

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;
/**
 * Worksheets table - stores generated educational worksheets
 */
export const worksheets = pgTable("worksheets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  generationMethod: varchar("generationMethod", { length: 50 }).notNull(), // text, file, title
  questionType: varchar("questionType", { length: 50 }).notNull(), // multiple_choice, short_answer, essay, true_false, fill_blank, mixed
  questionCount: integer("questionCount").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  gradeLevel: varchar("gradeLevel", { length: 50 }).notNull(),
  lessonTitle: varchar("lessonTitle", { length: 255 }).notNull(),
  teacherName: varchar("teacherName", { length: 255 }),
  schoolName: varchar("schoolName", { length: 255 }),
  content: text("content").notNull(), // Generated worksheet content
  sourceText: text("sourceText"), // Original text if method is 'text'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("worksheets_userId_idx").on(table.userId),
}));

export type Worksheet = typeof worksheets.$inferSelect;
export type InsertWorksheet = typeof worksheets.$inferInsert;

/**
 * Template ratings table - stores user ratings for templates
 */
export const templateRatings = pgTable("templateRatings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  templateId: varchar("templateId", { length: 100 }).notNull(), // template.id from TemplateLibrary
  userId: integer("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  templateIdIdx: index("templateRatings_templateId_idx").on(table.templateId),
  userIdIdx: index("templateRatings_userId_idx").on(table.userId),
}));

export type TemplateRating = typeof templateRatings.$inferSelect;
export type InsertTemplateRating = typeof templateRatings.$inferInsert;

/**
 * Template usage table - tracks template usage count
 */
export const templateUsage = pgTable("templateUsage", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  templateId: varchar("templateId", { length: 100 }).notNull().unique(), // template.id from TemplateLibrary
  usageCount: integer("usageCount").default(0).notNull(),
  lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, (table) => ({
  templateIdIdx: index("templateUsage_templateId_idx").on(table.templateId),
}));

export type TemplateUsage = typeof templateUsage.$inferSelect;
export type InsertTemplateUsage = typeof templateUsage.$inferInsert;
