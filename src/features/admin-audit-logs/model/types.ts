export type AdminAuditLogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export type AdminAuditLogActor = {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
};

export type AdminAuditLog = {
  id: string;
  level: AdminAuditLogLevel;
  source: string;
  message: string;
  context: Record<string, unknown> | null;
  createdAt: string;
  actor: AdminAuditLogActor | null;
};

export type PaginatedAdminAuditLogs = {
  data: AdminAuditLog[];
  total: number;
  page: number;
  limit: number;
};
