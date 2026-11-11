import { generateImageCaptcha, verifyImageCaptcha } from '../services/captchaService.js';

export const getImageCaptcha = (req, res) => {
  const { challengeId, svg } = generateImageCaptcha();
  res.status(200).json({
    success: true,
    challengeId,
    svg
  });
};

export const verifyCaptcha = (req, res) => {
  const { challengeId, answer } = req.body;
  const result = verifyImageCaptcha(challengeId, answer);
  if (!result.valid) {
    return res.status(400).json({
      success: false,
      message: result.message
    });
  }

  res.status(200).json({
    success: true,
    message: 'CAPTCHA verified successfully'
  });
};
