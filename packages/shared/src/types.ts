export interface Family {
  id: string;
  name: string;
  agentName: string;
  timezone: string;
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface FamilyMember {
  id: string;
  familyId: string;
  name: string;
  role: 'parent' | 'child' | 'other';
  age: number | null;
  telegramId: string | null;
  email: string | null;
  createdAt: Date;
}

export interface List {
  id: string;
  familyId: string;
  name: string;
  type: 'groceries' | 'house' | 'kids_wants' | 'custom';
  createdAt: Date;
}

export interface ListItem {
  id: string;
  listId: string;
  text: string;
  addedBy: string | null;
  checked: boolean;
  createdAt: Date;
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

export interface EmailAddress {
  id: string;
  familyId: string;
  address: string;
  addressType: 'friendly' | 'slug';
  providerId: string | null;
  status: string;
  createdAt: Date;
}

export interface EmailSenderAllowlistEntry {
  id: string;
  familyId: string;
  emailOrDomain: string;
  label: string | null;
  addedBy: string | null;
  createdAt: Date;
}
