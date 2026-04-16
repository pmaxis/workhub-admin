import { apiClient } from '@/shared/api/client';
import type { AdminAuditLogLevel, PaginatedAdminAuditLogs } from '@/features/admin-audit-logs/model/types';

function toQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === '') continue;
    sp.set(key, String(value));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

export type AdminAuditLogsQuery = {
  page?: number;
  limit?: number;
  level?: AdminAuditLogLevel;
  source?: string;
};

export const adminAuditLogsApi = {
  getPage: (query: AdminAuditLogsQuery = {}) =>
    apiClient.get<PaginatedAdminAuditLogs>(`/admin/audit-logs${toQuery(query)}`),
};
