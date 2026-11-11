import { CitizenFeedback } from '../models/CitizenFeedback.js';
import { Grievance } from '../models/Grievance.js';
import { GRIEVANCE_STATUSES } from '../config/constants.js';
import { logAuditEvent } from '../services/auditService.js';

export const submitFeedback = async (req, res, next) => {
  try {
    const { grievanceId, rating, feedbackText, timelinessRating = 5, officerBehaviorRating = 5 } = req.body;

    if (!grievanceId || !rating || !feedbackText) {
      return res.status(400).json({
        success: false,
        message: 'Grievance ID, rating (1-5), and feedback comments are required'
      });
    }

    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    // Must be the owner
    if (String(grievance.citizen) !== String(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Only the grievance owner can submit feedback'
      });
    }

    // Must be resolved
    if (grievance.status !== GRIEVANCE_STATUSES.RESOLVED) {
      return res.status(400).json({
        success: false,
        message: 'Feedback can only be submitted for resolved grievances'
      });
    }

    // Check if feedback already submitted
    const existing = await CitizenFeedback.findOne({ grievance: grievance._id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Feedback has already been submitted for this grievance'
      });
    }

    const feedback = await CitizenFeedback.create({
      grievance: grievance._id,
      citizen: req.user._id,
      rating: Number(rating),
      feedbackText,
      timelinessRating: Number(timelinessRating),
      officerBehaviorRating: Number(officerBehaviorRating)
    });

    grievance.hasFeedback = true;
    grievance.feedback = feedback._id;
    await grievance.save();

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'SUBMIT_FEEDBACK',
      targetResource: 'CitizenFeedback',
      targetId: feedback._id,
      req,
      details: { rating, grievance: grievance.referenceNumber }
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback!',
      feedback
    });
  } catch (error) {
    next(error);
  }
};

