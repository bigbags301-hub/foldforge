import {
  integer,
  sqliteTable,
  text,
  real,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/* ── Users ─────────────────────────────────────────────────────── */
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId").notNull().unique(),
  name: text("name"),
  email: text("email"),
  passwordHash: text("passwordHash"),
  loginMethod: text("loginMethod"),
  role: text("role", { enum: ["user", "admin"] }).default("user").notNull(),
  stripeCustomerId: text("stripeCustomerId"),
  suspended: integer("suspended", { mode: "boolean" }).default(false).notNull(),
  dataSourcePreference: text("dataSourcePreference", { enum: ["reference", "broker"] }).default("reference").notNull(),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
  lastSignedIn: text("lastSignedIn").default(sql`(datetime('now'))`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/* ── Subscriptions ─────────────────────────────────────────────── */
export const subscriptions = sqliteTable("subscriptions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  stripeSubscriptionId: text("stripeSubscriptionId").notNull().unique(),
  stripeCustomerId: text("stripeCustomerId").notNull(),
  stripePriceId: text("stripePriceId").notNull(),
  plan: text("plan", { enum: ["starter", "pro", "funded"] }).notNull(),
  status: text("status", { enum: ["active", "trialing", "past_due", "canceled", "unpaid", "incomplete"] }).default("active").notNull(),
  currentPeriodStart: text("currentPeriodStart"),
  currentPeriodEnd: text("currentPeriodEnd"),
  cancelAtPeriodEnd: integer("cancelAtPeriodEnd", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;

/* ── Licenses ──────────────────────────────────────────────────── */
export const licenses = sqliteTable("licenses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  subscriptionId: integer("subscriptionId"),
  licenseKey: text("licenseKey").notNull().unique(),
  plan: text("plan", { enum: ["starter", "pro", "funded"] }).notNull(),
  maxActivations: integer("maxActivations").default(1).notNull(),
  status: text("status", { enum: ["active", "suspended", "expired", "revoked"] }).default("active").notNull(),
  gracePeriodEnd: text("gracePeriodEnd"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
});

export type License = typeof licenses.$inferSelect;

/* ── Activations ───────────────────────────────────────────────── */
export const activations = sqliteTable("activations", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  licenseId: integer("licenseId").notNull(),
  accountNumber: text("accountNumber").notNull(),
  brokerServer: text("brokerServer").notNull(),
  platform: text("platform", { enum: ["MT4", "MT5"] }).notNull(),
  lastHeartbeat: text("lastHeartbeat"),
  activatedAt: text("activatedAt").default(sql`(datetime('now'))`).notNull(),
});

export type Activation = typeof activations.$inferSelect;

/* ── Files (Downloads Vault) ───────────────────────────────────── */
export const files = sqliteTable("files", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", { enum: ["ea", "indicator", "template", "documentation", "other"] }).default("other").notNull(),
  version: text("version").notNull(),
  changelog: text("changelog"),
  fileKey: text("fileKey").notNull(),
  fileUrl: text("fileUrl"),
  fileSize: integer("fileSize"),
  minPlan: text("minPlan", { enum: ["starter", "pro", "funded"] }).default("starter").notNull(),
  isPublic: integer("isPublic", { mode: "boolean" }).default(false).notNull(),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
});

export type FileRecord = typeof files.$inferSelect;

/* ── Download Logs ─────────────────────────────────────────────── */
export const downloadLogs = sqliteTable("download_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  fileId: integer("fileId").notNull(),
  downloadedAt: text("downloadedAt").default(sql`(datetime('now'))`).notNull(),
});

/* ── Support Tickets ───────────────────────────────────────────── */
export const tickets = sqliteTable("tickets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium").notNull(),
  adminReply: text("adminReply"),
  repliedAt: text("repliedAt"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
});

export type Ticket = typeof tickets.$inferSelect;

/* ── Broker Data (Symbol Specs) ────────────────────────────────── */
export const brokerSymbols = sqliteTable("broker_symbols", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  symbol: text("symbol").notNull(),
  broker: text("broker").notNull(),
  description: text("description"),
  digits: integer("digits"),
  contractSize: real("contractSize"),
  minLot: real("minLot"),
  maxLot: real("maxLot"),
  lotStep: real("lotStep"),
  tickSize: real("tickSize"),
  tickValue: real("tickValue"),
  swapLong: real("swapLong"),
  swapShort: real("swapShort"),
  marginRequired: real("marginRequired"),
  spreadTypical: real("spreadTypical"),
  tradeMode: text("tradeMode"),
  lastSyncAt: text("lastSyncAt").default(sql`(datetime('now'))`).notNull(),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
});

/* ── Broker OHLC Data ──────────────────────────────────────────── */
export const brokerOhlc = sqliteTable("broker_ohlc", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  symbol: text("symbol").notNull(),
  broker: text("broker").notNull(),
  timeframe: text("timeframe").notNull(),
  openTime: integer("openTime").notNull(),
  open: real("open").notNull(),
  high: real("high").notNull(),
  low: real("low").notNull(),
  close: real("close").notNull(),
  volume: real("volume"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
});

/* ── Broker Spread Samples ─────────────────────────────────────── */
export const brokerSpreads = sqliteTable("broker_spreads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  symbol: text("symbol").notNull(),
  broker: text("broker").notNull(),
  spreadPoints: real("spreadPoints").notNull(),
  sampledAt: text("sampledAt").default(sql`(datetime('now'))`).notNull(),
});

/* ── Reference Data Hub ────────────────────────────────────────── */
export const symbolReference = sqliteTable("symbol_reference", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  symbol: text("symbol").notNull().unique(),
  displayName: text("displayName").notNull(),
  category: text("category", { enum: ["forex", "metals", "indices", "crypto", "commodities", "bonds"] }).notNull(),
  baseCurrency: text("baseCurrency"),
  quoteCurrency: text("quoteCurrency"),
  digits: integer("digits").default(5).notNull(),
  contractSize: real("contractSize").default(100000).notNull(),
  minLot: real("minLot").default(0.01).notNull(),
  maxLot: real("maxLot").default(100).notNull(),
  lotStep: real("lotStep").default(0.01).notNull(),
  tickSize: real("tickSize"),
  tickValue: real("tickValue"),
  typicalSpread: real("typicalSpread"),
  marginPercent: real("marginPercent"),
  swapLong: real("swapLong"),
  swapShort: real("swapShort"),
  tradingHours: text("tradingHours"),
  description: text("description"),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
});

export type SymbolRef = typeof symbolReference.$inferSelect;

/* ── Studio Runs ───────────────────────────────────────────────── */
export const studioRuns = sqliteTable("studio_runs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  name: text("name").notNull(),
  runType: text("runType").default("backtest").notNull(),
  status: text("status", { enum: ["queued", "running", "completed", "failed", "cancelled"] }).default("queued").notNull(),
  symbol: text("symbol").notNull(),
  timeframe: text("timeframe").notNull(),
  dataSource: text("dataSource", { enum: ["reference", "broker"] }).default("reference").notNull(),
  parameters: text("parameters"),
  results: text("results"),
  metrics: text("metrics"),
  startedAt: text("startedAt"),
  completedAt: text("completedAt"),
  createdAt: text("createdAt").default(sql`(datetime('now'))`).notNull(),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
});

export type StudioRun = typeof studioRuns.$inferSelect;

/* ── Feature Flags ─────────────────────────────────────────────── */
export const featureFlags = sqliteTable("feature_flags", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("flagKey").notNull().unique(),
  value: integer("flagValue", { mode: "boolean" }).default(false).notNull(),
  description: text("description"),
  updatedAt: text("updatedAt").default(sql`(datetime('now'))`).notNull(),
});
