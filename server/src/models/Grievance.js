import mongoose from 'mongoose';
import { GRIEVANCE_STATUSES, PRIORITIES, KERALA_DISTRICTS, SLA_HOURS } from '../config/constants.js';

const grievanceSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    district: {
      type: String,
      required: true,
      enum: KERALA_DISTRICTS,
      index: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      default: null,
      index: true
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'Medium',
      index: true
    },
    status: {
      type: String,
      enum: Object.values(GRIEVANCE_STATUSES),
      default: GRIEVANCE_STATUSES.SUBMITTED,
      index: true
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    aiAnalysis: {
      suggestedDepartment: { type: String, default: '' },
      suggestedCategory: { type: String, default: '' },
      priority: { type: String, default: 'Medium' },
      summary: { type: String, default: '' },
      reasoning: { type: String, default: '' },
      confidence: { type: Number, default: 0.85 },
      duplicateWarning: { type: Boolean, default: false },
      similarReferenceIds: [{ type: String }]
    },
    slaDeadline: {
      type: Date,
      index: true
    },
    isEscalated: {
      type: Boolean,
      default: false
    },
    escalationRemarks: {
      type: String,
      default: ''
    },
    cmoRemarks: {
      type: String,
      default: ''
    },
    officerRemarks: {
      type: String,
      default: ''
    },
    actionTakenReport: {
      summary: { type: String, default: '' },
      actionsDetails: { type: String, default: '' },
      submittedAt: { type: Date, default: null },
      submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reviewedByCmo: { type: Boolean, default: false },
      cmoReviewNotes: { type: String, default: '' }
    },
    resolutionDetails: {
      resolvedAt: { type: Date, default: null },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      notes: { type: String, default: '' }
    },
    reopenedDetails: {
      reopenedAt: { type: Date, default: null },
      reopenedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      reason: { type: String, default: '' }
    },
    attachments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attachment'
      }
    ],
    hasFeedback: {
      type: Boolean,
      default: false
    },
    feedback: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CitizenFeedback',
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Virtual for isOverdue
grievanceSchema.virtual('isOverdue').get(function () {
  if (this.status === GRIEVANCE_STATUSES.RESOLVED) return false;
  if (!this.slaDeadline) return false;
  return new Date() > this.slaDeadline;
});

// Configure JSON output to include virtuals
grievanceSchema.set('toJSON', { virtuals: true });
grievanceSchema.set('toObject', { virtuals: true });

// Pre-save to compute SLA deadline if not set
grievanceSchema.pre('save', function (next) {
  if (!this.slaDeadline) {
    const hours = SLA_HOURS[this.priority] || 96;
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + hours);
    this.slaDeadline = deadline;
  }
  next();
});

export const Grievance = mongoose.model('Grievance', grievanceSchema);

