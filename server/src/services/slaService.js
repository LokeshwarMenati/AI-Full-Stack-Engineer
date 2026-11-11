import { Grievance } from '../models/Grievance.js';
import { GRIEVANCE_STATUSES } from '../config/constants.js';

let slaTimer = null;

export const checkOverdueGrievances = async (io = null) => {
  try {
    const now = new Date();
    const overdueGrievances = await Grievance.find({
      status: { $ne: GRIEVANCE_STATUSES.RESOLVED },
      slaDeadline: { $lt: now },
      isOverdue: { $ne: true }
    }).populate('department assignedOfficer');

    let updatedCount = 0;
    for (const g of overdueGrievances) {
      g.isOverdue = true;
      await g.save();
      updatedCount++;

      if (io) {
        io.to('cmo_admins').emit('sla_breach_alert', {
          referenceNumber: g.referenceNumber,
          district: g.district,
          priority: g.priority,
          deadline: g.slaDeadline,
          message: `SLA Deadline Breached for Grievance ${g.referenceNumber} (${g.district}). Immediate administrative action recommended.`
        });
      }
    }

    if (updatedCount > 0) {
      console.log(`[SLA Monitor] Flagged ${updatedCount} grievances as overdue.`);
    }

    return updatedCount;
  } catch (err) {
    console.error('[SLA Monitor] Error running SLA check:', err.message);
  }
};

export const startSlaBackgroundWorker = (io, intervalMs = 600000) => {
  // Run initial check
  checkOverdueGrievances(io);

  // Run periodic background job
  slaTimer = setInterval(() => {
    checkOverdueGrievances(io);
  }, intervalMs);

  if (slaTimer.unref) {
    slaTimer.unref();
  }

  console.log('[SLA Worker] Automated SLA background monitor started.');
};

