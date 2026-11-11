import { Grievance } from '../models/Grievance.js';
import { GrievanceHistory } from '../models/GrievanceHistory.js';
import { Department } from '../models/Department.js';
import { Attachment } from '../models/Attachment.js';
import { generateReferenceNumber } from '../services/referenceIdService.js';
import { analyzeComplaint } from '../services/geminiService.js';
import { createNotification } from '../services/notificationService.js';
import { logAuditEvent } from '../services/auditService.js';
import { GRIEVANCE_STATUSES, VALID_STATUS_TRANSITIONS, ROLES } from '../config/constants.js';

export const createGrievance = async (req, res, next) => {
  try {
    const { district, category, subject, description, priority = 'Medium', departmentId } = req.body;

    if (!district || !category || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: 'District, Category, Subject, and Description are required'
      });
    }

    // 1. Generate unique reference ID (e.g., KGR-2026-000101)
    const referenceNumber = await generateReferenceNumber();

    // 2. Perform AI analysis
    const aiResult = await analyzeComplaint({
      subject,
      description,
      district
    });

    // 3. Resolve department: user specified, or AI suggested
    let department = null;
    if (departmentId) {
      department = await Department.findById(departmentId);
    }
    if (!department && aiResult.suggestedDepartment) {
      department = await Department.findOne({
        name: { $regex: new RegExp(`^${aiResult.suggestedDepartment}$`, 'i') }
      });
    }

    // Optional supporting attachment handling
    const attachmentIds = [];
    if (req.file) {
      const att = await Attachment.create({
        uploadedBy: req.user._id,
        fileName: req.file.originalname,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        filePath: req.file.path,
        isPrivate: true
      });
      attachmentIds.push(att._id);
    }

    // 4. Create Grievance
    const grievance = await Grievance.create({
      referenceNumber,
      citizen: req.user._id,
      district,
      department: department ? department._id : null,
      category,
      subject,
      description,
      priority: priority || aiResult.priority || 'Medium',
      status: GRIEVANCE_STATUSES.SUBMITTED,
      aiAnalysis: aiResult,
      attachments: attachmentIds
    });

    if (attachmentIds.length > 0) {
      await Attachment.updateMany({ _id: { $in: attachmentIds } }, { grievance: grievance._id });
    }

    // 5. Create immutable history record
    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus: null,
      newStatus: GRIEVANCE_STATUSES.SUBMITTED,
      responsibleUser: req.user._id,
      actionType: 'SUBMITTED',
      remarks: 'Citizen submitted grievance through the portal.'
    });

    // 6. Notify citizen & CMO
    await createNotification({
      recipientId: req.user._id,
      title: 'Grievance Submitted Successfully',
      message: `Your grievance ${referenceNumber} has been received. CMO officers will review it shortly.`,
      type: 'INFO',
      grievanceId: grievance._id
    });

    // 7. Audit log
    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'SUBMIT_GRIEVANCE',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: { referenceNumber, district, priority: grievance.priority }
    });

    res.status(201).json({
      success: true,
      message: 'Grievance submitted successfully',
      grievance
    });
  } catch (error) {
    next(error);
  }
};

export const getGrievances = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, district, department, search, priority } = req.query;
    const query = {};

    // Role-based scoping
    if (req.user.role === ROLES.CITIZEN) {
      query.citizen = req.user._id;
    } else if (req.user.role === ROLES.OFFICER) {
      if (!req.user.department) {
        return res.status(200).json({ success: true, count: 0, totalPages: 0, grievances: [] });
      }
      query.department = req.user.department._id || req.user.department;
    }

    // Apply filters
    if (status) query.status = status;
    if (district) query.district = district;
    if (department) query.department = department;
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
        .populate('department', 'name code')
        .populate('assignedOfficer', 'name designation')
        .sort({ createdAt: -1 })
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

export const getGrievanceById = async (req, res, next) => {
  try {
    const grievance = await Grievance.findById(req.params.id)
      .populate('citizen', 'name email mobileNumber')
      .populate('department')
      .populate('assignedOfficer', 'name designation email')
      .populate('feedback');

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    // Authorization checks
    if (req.user.role === ROLES.CITIZEN && String(grievance.citizen._id) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: You do not own this grievance' });
    }

    if (req.user.role === ROLES.OFFICER) {
      const officerDept = req.user.department?._id || req.user.department;
      if (!grievance.department || String(grievance.department._id) !== String(officerDept)) {
        return res.status(403).json({ success: false, message: 'Unauthorized: Grievance not assigned to your department' });
      }
    }

    // Fetch timeline history
    const history = await GrievanceHistory.find({ grievance: grievance._id })
      .populate('responsibleUser', 'name role designation')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      grievance,
      history
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Public & citizen tracking endpoint
 * Masks citizen private data for anonymous or non-owner viewers
 */
export const trackGrievance = async (req, res, next) => {
  try {
    const { referenceNumber } = req.params;

    const grievance = await Grievance.findOne({
      referenceNumber: referenceNumber.trim().toUpperCase()
    })
      .populate('department', 'name code description')
      .populate('assignedOfficer', 'designation')
      .populate('citizen', 'name email')
      .populate('feedback');

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: 'No grievance found with the provided reference number'
      });
    }

    const history = await GrievanceHistory.find({ grievance: grievance._id })
      .select('newStatus actionType remarks createdAt')
      .sort({ createdAt: 1 });

    // Privacy masking: Check if requester is the citizen owner or administrative staff
    const isOwnerOrStaff = req.user && (
      req.user.role === ROLES.CMO_ADMIN ||
      String(req.user._id) === String(grievance.citizen?._id)
    );

    const safeCitizen = isOwnerOrStaff
      ? { name: grievance.citizen?.name, email: grievance.citizen?.email }
      : { name: grievance.citizen?.name ? `${grievance.citizen.name.charAt(0)}***` : 'Citizen', email: '***@***.***' };

    res.status(200).json({
      success: true,
      trackingData: {
        referenceNumber: grievance.referenceNumber,
        subject: grievance.subject,
        district: grievance.district,
        category: grievance.category,
        status: grievance.status,
        department: grievance.department ? grievance.department.name : 'Awaiting Department Assignment',
        submissionDate: grievance.createdAt,
        slaDeadline: grievance.slaDeadline,
        isOverdue: grievance.isOverdue,
        cmoRemarks: grievance.cmoRemarks || null,
        officerRemarks: grievance.officerRemarks || null,
        actionTakenSummary: grievance.actionTakenReport?.summary || null,
        resolutionDetails: grievance.resolutionDetails?.notes ? {
          resolvedAt: grievance.resolutionDetails.resolvedAt,
          notes: grievance.resolutionDetails.notes
        } : null,
        reopenedDetails: grievance.reopenedDetails?.reopenedAt ? {
          reopenedAt: grievance.reopenedDetails.reopenedAt,
          reason: grievance.reopenedDetails.reason
        } : null,
        timeline: history,
        citizen: safeCitizen,
        hasFeedback: grievance.hasFeedback,
        feedback: grievance.feedback
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newStatus, remarks } = req.body;

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    const currentStatus = grievance.status;

    // Validate permitted transition
    const allowedNext = VALID_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowedNext.includes(newStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from '${currentStatus}' to '${newStatus}'. Allowed: ${allowedNext.join(', ')}`
      });
    }

    // Role verification
    if (newStatus === GRIEVANCE_STATUSES.RESOLVED && req.user.role !== ROLES.CMO_ADMIN) {
      return res.status(403).json({
        success: false,
        message: 'Only CMO Administrators can approve final grievance resolution.'
      });
    }

    grievance.status = newStatus;
    if (newStatus === GRIEVANCE_STATUSES.RESOLVED) {
      grievance.resolutionDetails = {
        resolvedAt: new Date(),
        resolvedBy: req.user._id,
        notes: remarks || 'Grievance resolved following department action report.'
      };
    }

    await grievance.save();

    // Record immutable history
    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus: currentStatus,
      newStatus,
      responsibleUser: req.user._id,
      actionType: newStatus === GRIEVANCE_STATUSES.RESOLVED ? 'RESOLVED' : 'STATUS_CHANGED',
      remarks: remarks || `Status updated to ${newStatus}`
    });

    // Notify citizen
    await createNotification({
      recipientId: grievance.citizen,
      title: `Grievance Status: ${newStatus}`,
      message: `Your grievance ${grievance.referenceNumber} status has moved to ${newStatus}. ${remarks || ''}`,
      type: 'STATUS_CHANGE',
      grievanceId: grievance._id
    });

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'UPDATE_STATUS',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: { previousStatus: currentStatus, newStatus, remarks }
    });

    res.status(200).json({
      success: true,
      message: `Status transitioned to ${newStatus}`,
      grievance
    });
  } catch (error) {
    next(error);
  }
};

export const reopenGrievance = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a clear reason for reopening the grievance (minimum 10 characters)'
      });
    }

    const grievance = await Grievance.findById(id);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    // Must be grievance owner or CMO
    const isOwner = String(grievance.citizen) === String(req.user._id);
    const isCmo = req.user.role === ROLES.CMO_ADMIN;

    if (!isOwner && !isCmo) {
      return res.status(403).json({
        success: false,
        message: 'Only the citizen owner or CMO can reopen this grievance'
      });
    }

    if (grievance.status !== GRIEVANCE_STATUSES.RESOLVED) {
      return res.status(400).json({
        success: false,
        message: 'Only resolved grievances can be reopened'
      });
    }

    const previousStatus = grievance.status;
    grievance.status = GRIEVANCE_STATUSES.REOPENED;
    grievance.reopenedDetails = {
      reopenedAt: new Date(),
      reopenedBy: req.user._id,
      reason
    };

    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus,
      newStatus: GRIEVANCE_STATUSES.REOPENED,
      responsibleUser: req.user._id,
      actionType: 'REOPENED',
      remarks: `Reopened by citizen with reason: ${reason}`
    });

    // Notify CMO
    await createNotification({
      recipientId: grievance.citizen,
      title: 'Grievance Reopened',
      message: `Grievance ${grievance.referenceNumber} has been reopened for reinvestigation.`,
      type: 'STATUS_CHANGE',
      grievanceId: grievance._id
    });

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'REOPEN_GRIEVANCE',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: { reason }
    });

    res.status(200).json({
      success: true,
      message: 'Grievance reopened successfully',
      grievance
    });
  } catch (error) {
    next(error);
  }
};

