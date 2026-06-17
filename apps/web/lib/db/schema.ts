import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';

// ─── Central Platform Schema ───────────────────────────────────────
//
// This database holds platform-level data only: accounts, billing,
// container metadata, and usage logs.
//
// Family-specific data (lists, list items, family members, email
// addresses, email sender allowlist) lives in per-container SQLite
// databases inside each family's OpenClaw container.
// ────────────────────────────────────────────────────────────────────

// ─── Families ───────────────────────────────────────────────────────

export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  subscriptionTier: varchar('subscription_tier', { length: 50 }),
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }),
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Agent Instances ────────────────────────────────────────────────

export const agentInstances = pgTable('agent_instances', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id')
    .notNull()
    .unique()
    .references(() => families.id, { onDelete: 'cascade' }),
  containerId: varchar('container_id', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  port: integer('port'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastHealthCheck: timestamp('last_health_check', { withTimezone: true }),
});

// ─── Usage Logs ─────────────────────────────────────────────────────

export const usageLogs = pgTable('usage_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id')
    .notNull()
    .references(() => families.id),
  model: varchar('model', { length: 100 }).notNull(),
  inputTokens: integer('input_tokens').notNull(),
  outputTokens: integer('output_tokens').notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull().defaultNow(),
});
