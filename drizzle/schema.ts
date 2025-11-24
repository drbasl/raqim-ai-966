import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Saved prompts table - stores user's personal prompt library
 */
export const savedPrompts = mysqlTable("savedPrompts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  basePrompt: text("basePrompt").notNull(),
  enhancedPrompt: text("enhancedPrompt").notNull(),
  usageType: varchar("usageType", { length: 50 }).notNull(),
  tags: text("tags"), // JSON array of tags
  isFavorite: int("isFavorite").default(0).notNull(), // 0 = false, 1 = true
  shareToken: varchar("shareToken", { length: 64 }).unique(), // Unique token for sharing
  isPublic: int("isPublic").default(0).notNull(), // 0 = private, 1 = public
  shareCount: int("shareCount").default(0).notNull(), // Number of times shared
  viewCount: int("viewCount").default(0).notNull(), // Number of views on public link
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SavedPrompt = typeof savedPrompts.$inferSelect;
export type InsertSavedPrompt = typeof savedPrompts.$inferInsert;

/**
 * Popular prompts table - community shared prompts with ratings
 */
export const popularPrompts = mysqlTable("popularPrompts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  usageType: varchar("usageType", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  rating: int("rating").default(0).notNull(), // Average rating * 10 (e.g., 45 = 4.5 stars)
  usageCount: int("usageCount").default(0).notNull(),
  likesCount: int("likesCount").default(0).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PopularPrompt = typeof popularPrompts.$inferSelect;
export type InsertPopularPrompt = typeof popularPrompts.$inferInsert;

/**
 * Prompt ratings table - stores user ratings for popular prompts
 */
export const promptRatings = mysqlTable("promptRatings", {
  id: int("id").autoincrement().primaryKey(),
  promptId: int("promptId").notNull(),
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PromptRating = typeof promptRatings.$inferSelect;
export type InsertPromptRating = typeof promptRatings.$inferInsert;

/**
 * Activity log table - tracks all user activities
 */
export const activityLog = mysqlTable("activityLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 50 }).notNull(), // generate, save, delete, update, favorite
  entityType: varchar("entityType", { length: 50 }).notNull(), // prompt, template, etc.
  entityId: int("entityId"), // ID of the related entity
  details: text("details"), // JSON with additional info
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;
/**
 * Worksheets table - stores generated educational worksheets
 */
export const worksheets = mysqlTable("worksheets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  generationMethod: varchar("generationMethod", { length: 50 }).notNull(), // text, file, title
  questionType: varchar("questionType", { length: 50 }).notNull(), // multiple_choice, short_answer, essay, true_false, fill_blank, mixed
  questionCount: int("questionCount").notNull(),
  language: varchar("language", { length: 50 }).notNull(),
  gradeLevel: varchar("gradeLevel", { length: 50 }).notNull(),
  lessonTitle: varchar("lessonTitle", { length: 255 }).notNull(),
  teacherName: varchar("teacherName", { length: 255 }),
  schoolName: varchar("schoolName", { length: 255 }),
  content: text("content").notNull(), // Generated worksheet content
  sourceText: text("sourceText"), // Original text if method is 'text'
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Worksheet = typeof worksheets.$inferSelect;
export type InsertWorksheet = typeof worksheets.$inferInsert;

/**
 * Template ratings table - stores user ratings for templates
 */
export const templateRatings = mysqlTable("templateRatings", {
  id: int("id").autoincrement().primaryKey(),
  templateId: varchar("templateId", { length: 100 }).notNull(), // template.id from TemplateLibrary
  userId: int("userId").notNull(),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TemplateRating = typeof templateRatings.$inferSelect;
export type InsertTemplateRating = typeof templateRatings.$inferInsert;

/**
 * Template usage table - tracks template usage count
 */
export const templateUsage = mysqlTable("templateUsage", {
  id: int("id").autoincrement().primaryKey(),
  templateId: varchar("templateId", { length: 100 }).notNull().unique(), // template.id from TemplateLibrary
  usageCount: int("usageCount").default(0).notNull(),
  lastUsedAt: timestamp("lastUsedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TemplateUsage = typeof templateUsage.$inferSelect;
export type InsertTemplateUsage = typeof templateUsage.$inferInsert;
