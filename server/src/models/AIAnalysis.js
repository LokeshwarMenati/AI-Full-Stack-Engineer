import mongoose from 'mongoose';

const aiAnalysisSchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grievance',
      default: null,
      index: true
    },
    inputText: {
      type: String,
      required: true
    },
    suggestedDepartment: {
      type: String,
      default: ''
    },
    suggestedCategory: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      default: 'Medium'
    },
    summary: {
      type: String,
      default: ''
    },
    reasoning: {
      type: String,
      default: ''
    },
    confidence: {
      type: Number,
      default: 0.85
    },
    duplicateWarning: {
      type: Boolean,
      default: false
    },
    similarGrievances: [
      {
        referenceNumber: String,
        similarityScore: Number,
        subject: String
      }
    ],
    modelUsed: {
      type: String,
      default: 'gemini-1.5-flash'
    }
  },
  {
    timestamps: true
  }
);

export const AIAnalysis = mongoose.model('AIAnalysis', aiAnalysisSchema);

