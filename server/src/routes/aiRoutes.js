import express from 'express';
import { analyzeGrievanceAi, checkDuplicates, summarizeText } from '../controllers/aiController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Allow public or authenticated AI analysis for instant pre-submission assistance
router.post('/analyze', analyzeGrievanceAi);
router.post('/duplicate-check', checkDuplicates);
router.post('/summarize', protect, summarizeText);

export default router;
