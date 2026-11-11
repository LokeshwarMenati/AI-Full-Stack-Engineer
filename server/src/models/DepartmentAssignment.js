import mongoose from 'mongoose';

const departmentAssignmentSchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grievance',
      required: true,
      index: true
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
      required: true,
      index: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    instructions: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'REASSIGNED', 'COMPLETED'],
      default: 'ACTIVE'
    }
  },
  {
    timestamps: true
  }
);

export const DepartmentAssignment = mongoose.model('DepartmentAssignment', departmentAssignmentSchema);

