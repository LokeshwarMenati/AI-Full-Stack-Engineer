import mongoose from 'mongoose';

const citizenFeedbackSchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Grievance',
      required: true,
      unique: true,
      index: true
    },
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    feedbackText: {
      type: String,
      required: true,
      trim: true
    },
    timelinessRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    },
    officerBehaviorRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5
    }
  },
  {
    timestamps: true
  }
);

export const CitizenFeedback = mongoose.model('CitizenFeedback', citizenFeedbackSchema);

