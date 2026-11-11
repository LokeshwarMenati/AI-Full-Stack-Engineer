import express from 'express';
import { getImageCaptcha, verifyCaptcha } from '../controllers/captchaController.js';

const router = express.Router();

router.get('/image', getImageCaptcha);
router.post('/verify', verifyCaptcha);

export default router;

