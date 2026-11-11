import mongoose from 'mongoose';
import { GRIEVANCE_STATUSES } from '../config/constants.js';

const grievanceHistorySchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grievance',
      required: true,
      index: true
    },
    previousStatus: {
      type: String,
      enum: [...Object.values(GRIEVANCE_STATUSES), null],
      default: null
    },
    newStatus: {
      type: String,
      enum: Object.values(GRIEVANCE_STATUSES),
      required: true
    },
    responsibleUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    actionType: {
      type: String,
      required: true,
      enum: [
        'SUBMITTED',
        'STATUS_CHANGED',
        'CMO_REVIEW',
        'DEPARTMENT_ASSIGNED',
        'OFFICER_ASSIGNED',
        'INVESTIGATION_STARTED',
        'ACTION_REPORT_SUBMITTED',
        'CMO_REPORT_APPROVED',
        'CMO_INVESTIGATION_REQUESTED',
        'RESOLVED',
        'REOPENED',
        'ESCALATED'
      ]
    },
    remarks: {
      type: String,
      default: ''
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

export const GrievanceHistory = mongoose.model('GrievanceHistory', grievanceHistorySchema);
