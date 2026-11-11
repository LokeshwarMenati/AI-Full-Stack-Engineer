import express from 'express';
import {
  getStatistics,
  getCmoGrievances,
  assignGrievance,
  escalateGrievance,
  reviewActionReport
} from '../controllers/cmoController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { ROLES } from '../config/constants.js';

const router = express.Router();

// Strict RBAC: Only CMO Administrators
router.use(protect);
router.use(authorize(ROLES.CMO_ADMIN));

router.get('/statistics', getStatistics);
router.get('/grievances', getCmoGrievances);
router.post('/assign', assignGrievance);
router.post('/escalate', escalateGrievance);
router.post('/review-report', reviewActionReport);

export default router;

