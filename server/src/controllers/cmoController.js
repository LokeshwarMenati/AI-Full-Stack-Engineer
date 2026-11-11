import mongoose from 'mongoose';
import { Grievance } from '../models/Grievance.js';
import { GrievanceHistory } from '../models/GrievanceHistory.js';
import { DepartmentAssignment } from '../models/DepartmentAssignment.js';
import { User } from '../models/User.js';
import { Department } from '../models/Department.js';
import { createNotification } from '../services/notificationService.js';
import { logAuditEvent } from '../services/auditService.js';
import { GRIEVANCE_STATUSES, ROLES } from '../config/constants.js';

export const getStatistics = async (req, res, next) => {
  try {
    const now = new Date();

    // 1. Status & Overview counts aggregation
    const statusCountsAgg = await Grievance.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusMap = {
      Submitted: 0,
      'Under Review': 0,
      'In Progress': 0,
      Resolved: 0,
      Reopened: 0
    };

    let totalGrievances = 0;
    statusCountsAgg.forEach((item) => {
      if (item._id && statusMap.hasOwnProperty(item._id)) {
        statusMap[item._id] = item.count;
      }
      totalGrievances += item.count;
    });

    // 2. Overdue count (where deadline passed and status is not Resolved)
    const overdueCount = await Grievance.countDocuments({
      status: { $ne: GRIEVANCE_STATUSES.RESOLVED },
      slaDeadline: { $lt: now }
    });

    // 3. District-wise aggregation
    const districtWise = await Grievance.aggregate([
      {
        $group: {
          _id: '$district',
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', GRIEVANCE_STATUSES.RESOLVED] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          district: '$_id',
          count: 1,
          resolved: 1,
          pending: { $subtract: ['$count', '$resolved'] },
          _id: 0
        }
      }
    ]);

    // 4. Department-wise aggregation
    const departmentWise = await Grievance.aggregate([
      {
        $lookup: {
          from: 'departments',
          localField: 'department',
          foreignField: '_id',
          as: 'dept'
        }
      },
      {
        $unwind: {
          path: '$dept',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: { $ifNull: ['$dept.name', 'Unassigned'] },
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', GRIEVANCE_STATUSES.RESOLVED] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      {
        $project: {
          department: '$_id',
          count: 1,
          resolved: 1,
          pending: { $subtract: ['$count', '$resolved'] },
          _id: 0
        }
      }
    ]);

    // 5. Priority distribution
    const priorityDistribution = await Grievance.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          priority: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // 6. Category distribution
    const categoryDistribution = await Grievance.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
      {
        $project: {
          category: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]);

    // 7. Monthly trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const monthlyTrends = await Grievance.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          submitted: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', GRIEVANCE_STATUSES.RESOLVED] }, 1, 0] }
          }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedTrends = monthlyTrends.map((t) => ({
      month: `${monthNames[t._id.month - 1]} ${t._id.year}`,
      submitted: t.submitted,
      resolved: t.resolved
    }));

    // Resolution rate calculation
    const resolutionRate = totalGrievances > 0
      ? Math.round((statusMap.Resolved / totalGrievances) * 100)
      : 0;

    res.status(200).json({
      success: true,
      statistics: {
        totalGrievances,
        submitted: statusMap.Submitted,
        underReview: statusMap['Under Review'],
        inProgress: statusMap['In Progress'],
        resolved: statusMap.Resolved,
        reopened: statusMap.Reopened,
        overdueCount,
        resolutionRate,
        districtWise,
        departmentWise,
        priorityDistribution,
        categoryDistribution,
        monthlyTrends: formattedTrends
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCmoGrievances = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      district,
      department,
      category,
      priority,
      status,
      isOverdue,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { referenceNumber: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }
    if (district) query.district = district;
    if (department) query.department = department;
    if (category) query.category = category;
    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (isOverdue === 'true') {
      query.status = { $ne: GRIEVANCE_STATUSES.RESOLVED };
      query.slaDeadline = { $lt: new Date() };
    }

    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
    const skip = (Number(page) - 1) * Number(limit);

    const [grievances, total] = await Promise.all([
      Grievance.find(query)
        .populate('citizen', 'name email mobileNumber')
        .populate('department', 'name code')
        .populate('assignedOfficer', 'name designation email')
        .sort(sort)
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

export const assignGrievance = async (req, res, next) => {
  try {
    const { grievanceId, departmentId, officerId, instructions, cmoRemarks } = req.body;

    if (!grievanceId || !departmentId) {
      return res.status(400).json({
        success: false,
        message: 'Grievance ID and Department ID are required'
      });
    }

    const [grievance, department] = await Promise.all([
      Grievance.findById(grievanceId),
      Department.findById(departmentId)
    ]);

    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }
    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    let officer = null;
    if (officerId) {
      officer = await User.findById(officerId);
    }

    const previousStatus = grievance.status;
    const newStatus = officer ? GRIEVANCE_STATUSES.IN_PROGRESS : GRIEVANCE_STATUSES.UNDER_REVIEW;

    grievance.department = department._id;
    if (officer) grievance.assignedOfficer = officer._id;
    if (cmoRemarks) grievance.cmoRemarks = cmoRemarks;
    grievance.status = newStatus;

    await grievance.save();

    // Create Department Assignment Record
    await DepartmentAssignment.create({
      grievance: grievance._id,
      department: department._id,
      assignedBy: req.user._id,
      assignedOfficer: officer ? officer._id : null,
      instructions: instructions || 'Please investigate and furnish action-taken report.'
    });

    // Record History
    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus,
      newStatus,
      responsibleUser: req.user._id,
      actionType: officer ? 'OFFICER_ASSIGNED' : 'DEPARTMENT_ASSIGNED',
      remarks: `Assigned to ${department.name}${officer ? ` (${officer.name})` : ''}. ${instructions || ''}`
    });

    // Notify assigned officer if present
    if (officer) {
      await createNotification({
        recipientId: officer._id,
        title: 'New Grievance Assigned',
        message: `Grievance ${grievance.referenceNumber} has been assigned to you. Instructions: ${instructions || 'Review immediately.'}`,
        type: 'ASSIGNMENT',
        grievanceId: grievance._id
      });
    }

    // Notify citizen
    await createNotification({
      recipientId: grievance.citizen,
      title: 'Department Assigned',
      message: `Your grievance ${grievance.referenceNumber} has been assigned to ${department.name}. Status: ${newStatus}`,
      type: 'STATUS_CHANGE',
      grievanceId: grievance._id
    });

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'ASSIGN_DEPARTMENT',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: {
        department: department.name,
        officer: officer?.name || null,
        instructions
      }
    });

    res.status(200).json({
      success: true,
      message: 'Grievance assigned successfully',
      grievance
    });
  } catch (error) {
    next(error);
  }
};

export const escalateGrievance = async (req, res, next) => {
  try {
    const { grievanceId, escalationRemarks } = req.body;

    const grievance = await Grievance.findById(grievanceId).populate('department assignedOfficer');
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    grievance.isEscalated = true;
    grievance.priority = 'Urgent';
    grievance.escalationRemarks = escalationRemarks || 'Escalated by Chief Minister’s Office for priority redressal.';
    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus: grievance.status,
      newStatus: grievance.status,
      responsibleUser: req.user._id,
      actionType: 'ESCALATED',
      remarks: `Escalated by CMO: ${grievance.escalationRemarks}`
    });

    if (grievance.assignedOfficer) {
      await createNotification({
        recipientId: grievance.assignedOfficer._id,
        title: 'URGENT: Grievance Escalated by CMO',
        message: `Grievance ${grievance.referenceNumber} has been escalated by the CMO. Expedited action required.`,
        type: 'SLA_BREACH',
        grievanceId: grievance._id
      });
    }

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'ESCALATE_GRIEVANCE',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: { escalationRemarks }
    });

    res.status(200).json({
      success: true,
      message: 'Grievance escalated successfully',
      grievance
    });
  } catch (error) {
    next(error);
  }
};

export const reviewActionReport = async (req, res, next) => {
  try {
    const { grievanceId, decision, cmoReviewNotes } = req.body;

    if (!['APPROVE', 'REQUEST_REINVESTIGATION'].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be either 'APPROVE' or 'REQUEST_REINVESTIGATION'"
      });
    }

    const grievance = await Grievance.findById(grievanceId);
    if (!grievance) {
      return res.status(404).json({ success: false, message: 'Grievance not found' });
    }

    const previousStatus = grievance.status;
    let newStatus = previousStatus;

    if (decision === 'APPROVE') {
      newStatus = GRIEVANCE_STATUSES.RESOLVED;
      grievance.status = newStatus;
      grievance.actionTakenReport.reviewedByCmo = true;
      grievance.actionTakenReport.cmoReviewNotes = cmoReviewNotes || 'Action report approved by CMO.';
      grievance.resolutionDetails = {
        resolvedAt: new Date(),
        resolvedBy: req.user._id,
        notes: cmoReviewNotes || grievance.actionTakenReport.summary || 'Redressal approved.'
      };
    } else {
      newStatus = GRIEVANCE_STATUSES.IN_PROGRESS;
      grievance.status = newStatus;
      grievance.actionTakenReport.reviewedByCmo = false;
      grievance.actionTakenReport.cmoReviewNotes = cmoReviewNotes || 'Further field investigation required by CMO.';
    }

    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      previousStatus,
      newStatus,
      responsibleUser: req.user._id,
      actionType: decision === 'APPROVE' ? 'CMO_REPORT_APPROVED' : 'CMO_INVESTIGATION_REQUESTED',
      remarks: cmoReviewNotes || `CMO Review: ${decision}`
    });

    // Notify citizen if approved
    if (decision === 'APPROVE') {
      await createNotification({
        recipientId: grievance.citizen,
        title: 'Grievance Resolved',
        message: `Your grievance ${grievance.referenceNumber} has been resolved. You can now provide your valuable feedback.`,
        type: 'STATUS_CHANGE',
        grievanceId: grievance._id
      });
    }

    // Notify officer
    if (grievance.assignedOfficer) {
      await createNotification({
        recipientId: grievance.assignedOfficer,
        title: decision === 'APPROVE' ? 'Report Approved by CMO' : 'Reinvestigation Requested by CMO',
        message: `Grievance ${grievance.referenceNumber} report review: ${cmoReviewNotes || decision}`,
        type: 'ACTION_REQUIRED',
        grievanceId: grievance._id
      });
    }

    await logAuditEvent({
      user: req.user._id,
      userRole: req.user.role,
      action: 'REVIEW_REPORT',
      targetResource: 'Grievance',
      targetId: grievance._id,
      req,
      details: { decision, cmoReviewNotes }
    });

    res.status(200).json({
      success: true,
      message: `Action report reviewed successfully (${decision})`,
      grievance
    });
  } catch (error) {
    next(error);
  }
};

