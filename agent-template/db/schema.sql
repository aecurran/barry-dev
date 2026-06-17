-- Per-family container SQLite database
-- Each family's OpenClaw container has its own copy of this database.
-- This is the single source of truth for all family-specific data.

-- Family settings and identity
CREATE TABLE IF NOT EXISTS family_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
-- Pre-populated keys: family_name, agent_name, timezone

-- Family members
CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('parent', 'child', 'other')),
  age INTEGER,
  telegram_id TEXT UNIQUE,
  email TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Lists
CREATE TABLE IF NOT EXISTS lists (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'custom' CHECK (type IN ('groceries', 'house', 'kids_wants', 'custom')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- List items
CREATE TABLE IF NOT EXISTS list_items (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  list_id TEXT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  added_by TEXT,
  checked INTEGER NOT NULL DEFAULT 0,
  checked_at TEXT,
  checked_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Email addresses for this family
CREATE TABLE IF NOT EXISTS email_addresses (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  address TEXT NOT NULL UNIQUE,
  address_type TEXT NOT NULL CHECK (address_type IN ('friendly', 'slug')),
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Email sender allowlist
CREATE TABLE IF NOT EXISTS email_sender_allowlist (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  email_or_domain TEXT NOT NULL UNIQUE,
  label TEXT,
  added_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_list_items_list_id ON list_items(list_id);
CREATE INDEX IF NOT EXISTS idx_list_items_checked ON list_items(checked);
CREATE INDEX IF NOT EXISTS idx_family_members_telegram_id ON family_members(telegram_id);
