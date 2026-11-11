import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    userRole: {
      type: String,
      default: 'ANONYMOUS'
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    targetResource: {
      type: String,
      required: true
    },
    targetId: {
      type: String,
      default: null
    },
    ipAddress: {
      type: String,
      default: ''
    },
    userAgent: {
      type: String,
      default: ''
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);

