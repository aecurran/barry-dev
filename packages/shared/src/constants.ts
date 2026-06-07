export const DEFAULT_AGENT_NAME = 'Barry';
export const DEFAULT_TIMEZONE = 'Australia/Melbourne';

export const FAMILY_STATUS = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  CANCELLED: 'cancelled',
} as const;

export const MEMBER_ROLES = {
  PARENT: 'parent',
  CHILD: 'child',
  OTHER: 'other',
} as const;

export const LIST_TYPES = {
  GROCERIES: 'groceries',
  HOUSE: 'house',
  KIDS_WANTS: 'kids_wants',
  CUSTOM: 'custom',
} as const;

export const AGENT_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  STOPPED: 'stopped',
  ERROR: 'error',
} as const;

export const EMAIL_ADDRESS_TYPES = {
  FRIENDLY: 'friendly',
  SLUG: 'slug',
} as const;

export const GCP_REGION = 'australia-southeast1';
export const DEFAULT_VERTEX_MODEL = 'gemini-2.5-flash';
