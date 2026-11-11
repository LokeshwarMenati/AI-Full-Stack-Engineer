import express from 'express';
import {
  getAssignedGrievances,
  addInvestigationRemarks,
  submitActionReport
} from '../controllers/officerController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Strict RBAC: Officers or CMO Administrators
router.use(protect);
router.use(authorize(ROLES.OFFICER, ROLES.CMO_ADMIN));

router.get('/assigned', getAssignedGrievances);
router.post('/investigation', addInvestigationRemarks);
router.post('/action-report', submitActionReport);

export default router;
