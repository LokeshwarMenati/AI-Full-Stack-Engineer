import { Grievance } from '../models/Grievance.js';

export const generateReferenceNumber = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `KGR-${currentYear}-`;

  // Find latest grievance for the current year
  const latestGrievance = await Grievance.findOne({
    referenceNumber: { $regex: `^${prefix}` }
  })
    .sort({ createdAt: -1 })
    .select('referenceNumber')
    .lean();

  let nextSequence = 100001;

  if (latestGrievance && latestGrievance.referenceNumber) {
    const parts = latestGrievance.referenceNumber.split('-');
    if (parts.length === 3) {
      const parsedNum = parseInt(parts[2], 10);
      if (!isNaN(parsedNum)) {
        nextSequence = parsedNum + 1;
      }
    }
  }

  // Double check uniqueness loop in case of concurrent writes
  let candidate = `${prefix}${String(nextSequence).padStart(6, '0')}`;
  let exists = await Grievance.exists({ referenceNumber: candidate });
  while (exists) {
    nextSequence++;
    candidate = `${prefix}${String(nextSequence).padStart(6, '0')}`;
    exists = await Grievance.exists({ referenceNumber: candidate });
  }

  return candidate;
};
