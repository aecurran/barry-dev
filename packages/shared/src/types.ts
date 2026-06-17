// ─── Central Platform Types ───────────────────────────────────────
//
// These types cover the central PostgreSQL database only: accounts,
// container metadata, and usage logs.
//
// Family-specific types (FamilyMember, List, ListItem, EmailAddress,
// EmailSenderAllowlistEntry) are defined in the agent-template package
// and correspond to the per-container SQLite schema.
// ──────────────────────────────────────────────────────────────────

export interface Family {
  id: string;
  name: string;
  status: 'active' | 'suspended' | 'cancelled';
  subscriptionTier: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentInstance {
  id: string;
  familyId: string;
  containerId: string | null;
  status: 'pending' | 'running' | 'stopped' | 'error';
  port: number | null;
  createdAt: Date;
  lastHealthCheck: Date | null;
}

export interface UsageLog {
  id: string;
  familyId: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  timestamp: Date;
}
