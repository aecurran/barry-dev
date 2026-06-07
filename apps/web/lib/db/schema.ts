import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ─── Families ───────────────────────────────────────────────────────

export const families = pgTable('families', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  agentName: varchar('agent_name', { length: 100 }).notNull().default('Barry'),
  timezone: varchar('timezone', { length: 50 }).notNull().default('Australia/Melbourne'),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ─── Family Members ─────────────────────────────────────────────────

export const familyMembers = pgTable('family_members', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id')
    .notNull()
    .references(() => families.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  age: integer('age'),
  telegramId: varchar('telegram_id', { length: 100 }).unique(),
  email: varchar('email', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Lists ──────────────────────────────────────────────────────────

export const lists = pgTable('lists', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id')
    .notNull()
    .references(() => families.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull().default('custom'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── List Items ─────────────────────────────────────────────────────

export const listItems = pgTable('list_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  listId: uuid('list_id')
    .notNull()
    .references(() => lists.id, { onDelete: 'cascade' }),
  text: text('text').notNull(),
  addedBy: varchar('added_by', { length: 255 }),
  checked: boolean('checked').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
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

// ─── Email Addresses ────────────────────────────────────────────────

export const emailAddresses = pgTable('email_addresses', {
  id: uuid('id').primaryKey().defaultRandom(),
  familyId: uuid('family_id')
    .notNull()
    .references(() => families.id, { onDelete: 'cascade' }),
  address: varchar('address', { length: 255 }).notNull().unique(),
  addressType: varchar('address_type', { length: 20 }).notNull(),
  providerId: varchar('provider_id', { length: 255 }),
  status: varchar('status', { length: 20 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

// ─── Email Sender Allowlist ─────────────────────────────────────────

export const emailSenderAllowlist = pgTable(
  'email_sender_allowlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    familyId: uuid('family_id')
      .notNull()
      .references(() => families.id, { onDelete: 'cascade' }),
    emailOrDomain: varchar('email_or_domain', { length: 255 }).notNull(),
    label: varchar('label', { length: 255 }),
    addedBy: varchar('added_by', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  },
  (table) => [
    uniqueIndex('email_sender_allowlist_family_email_idx').on(table.familyId, table.emailOrDomain),
  ],
);
