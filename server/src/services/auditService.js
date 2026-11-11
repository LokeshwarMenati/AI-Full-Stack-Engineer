import { AuditLog } from '../models/AuditLog.js';

export const logAuditEvent = async ({
  user = null,
  userRole = 'ANONYMOUS',
  action,
  targetResource,
  targetId = null,
  req = null,
  details = {}
}) => {
  try {
    const ipAddress = req?.headers['x-forwarded-for'] || req?.socket?.remoteAddress || '';
    const userAgent = req?.headers['user-agent'] || '';

    await AuditLog.create({
      user: user?._id || user || null,
      userRole: userRole || user?.role || 'ANONYMOUS',
      action,
      targetResource,
      targetId: targetId ? String(targetId) : null,
      ipAddress,
      userAgent,
      details
    });
  } catch (err) {
    console.error('[AuditLog] Error recording audit event:', err.message);
  }
};

