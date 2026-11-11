import mongoose from 'mongoose';

const contactEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['NEW', 'IN_REVIEW', 'RESOLVED'],
      default: 'NEW'
    }
  },
  {
    timestamps: true
  }
);

export const ContactEnquiry = mongoose.model('ContactEnquiry', contactEnquirySchema);
