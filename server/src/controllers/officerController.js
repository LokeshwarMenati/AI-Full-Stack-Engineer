import { Grievance } from '../models/Grievance.js';
import { GrievanceHistory } from '../models/GrievanceHistory.js';
import { createNotification } from '../services/notificationService.js';
import { logAuditEvent } from '../services/auditService.js';
import { summarizeActionReport } from '../services/geminiService.js';
import { GRIEVANCE_STATUSES, ROLES } from '../config/constants.js';

export const getAssignedGrievances = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search, priority } = req.query;

    const officerDeptId = req.user.department?._id || req.user.department;
    if (!officerDeptId) {
      return res.status(400).json({
        success: false,
        message: 'Officer is not associated with any department.'
      });
    }

    const query = {
      department: officerDeptId
    };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [grievances, total] = await Promise.all([
      Grievance.find(query)
        .populate('citizen', 'name email mobileNumber')
        .populate('assignedOfficer', 'name designation')
        .sort({ priority: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Grievance.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: grievances.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      grievances
    });
  } catch (error) {
    next(error);
  }
};

export const addInvestigationRemarks = async (req, res, next) => {
  try {
    const { grievanceId, remarks } = req.body;

    if (!remarks || remarks.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Investigation remarks are required (minimum 5 characters)'
      });
    }

    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    // Security check: Department access
    const officerDeptId = String(req.user.department?._id || req.user.department);
    if (String(grievance.department) !== officerDeptId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Grievance does not belong to your department'
      });
    }

    const previousStatus = grievance.status;
    grievance.officerRemarks = remarks;
    grievance.assignedOfficer = req.user._id;

    if (grievance.status === GRIEVANCE_STATUSES.SUBMITTED || grievance.status === GRIEVANCE_STATUSES.UNDER_REVIEW) {
      grievance.status = GRIEVANCE_STATUSES.IN_PROGRESS;
    }

    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus,
      newStatus: grievance.status,
      responsibleUser: req.user._id,
      actionType: 'INVESTIGATION_STARTED',
      remarks: `Officer remarks updated: ${remarks}`
    });

    // Notify citizen
    await createNotification({
      recipientId: grievance.citizen,
      title: 'Investigation In Progress',
      message: `Officer ${req.user.name} has begun investigation on grievance ${grievance.referenceNumber}.`,
      type: 'STATUS_CHANGE',
      grievanceId: grievance._id
    });

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'ADD_INVESTIGATION_REMARKS',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: { remarks }
    });

    res.status(200).json({
      success: true,
      message: 'Investigation progress recorded successfully',
      grievance
    });
  } catch (error) {
    next(error);
  }
};

export const submitActionReport = async (req, res, next) => {
  try {
    const { grievanceId, summary, actionsDetails } = req.body;

    if (!summary || !actionsDetails) {
      return res.status(400).json({
        success: false,
        message: 'Summary and detailed action steps are required'
      });
    }

    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    const officerDeptId = String(req.user.department?._id || req.user.department);
    if (String(grievance.department) !== officerDeptId) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Grievance does not belong to your department'
      });
    }

    // AI generated executive summary for CMO
    const aiSummary = await summarizeActionReport(actionsDetails);

    grievance.actionTakenReport = {
      summary: summary || aiSummary,
      actionsDetails,
      submittedAt: new Date(),
      submittedBy: req.user._id,
      reviewedByCmo: false,
      cmoReviewNotes: ''
    };
    grievance.officerRemarks = summary;

    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus: grievance.status,
      newStatus: grievance.status,
      responsibleUser: req.user._id,
      actionType: 'ACTION_REPORT_SUBMITTED',
      remarks: `Action-taken report submitted by Officer ${req.user.name}. Awaiting CMO approval.`
    });

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'SUBMIT_ACTION_REPORT',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: { summary }
    });

    res.status(200).json({
      success: true,
      message: 'Action-Taken Report submitted successfully to CMO for approval',
      grievance
    });
  } catch (error) {
    next(error);
  }
};
