export interface AuditLogUser {
  id: string;
  email: string;
}

export interface AuditLog {
  id: string;
  action: string;
  description: string;
  createdAt: string;
  user: AuditLogUser;
  metadata?: any;
}
