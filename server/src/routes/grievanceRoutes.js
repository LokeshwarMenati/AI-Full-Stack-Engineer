import express from 'express';
import {
  createGrievance,
  getGrievances,
  getGrievanceById,
  trackGrievance,
  updateStatus,
  reopenGrievance
} from '../controllers/grievanceController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public / Citizen tracking (does not strictly require token, but checks if present)
router.get('/track/:referenceNumber', trackGrievance);

// Authenticated routes
router.use(protect);

router.post('/', createGrievance);
router.get('/', getGrievances);
router.get('/:id', getGrievanceById);
router.patch('/:id/status', updateStatus);
router.post('/:id/reopen', reopenGrievance);

export default router;
