import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { verifyImageCaptcha, verifyTurnstileToken } from '../services/captchaService.js';
import { logAuditEvent } from '../services/auditService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'janaseva_ai_prototype_jwt_secret_dev_key_2026_kerala', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      mobileNumber,
      password,
      confirmPassword,
      turnstileToken,
      captchaId,
      captchaAnswer
    } = req.body;

    // 1. Password validation
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // 2. Dual CAPTCHA Verification
    // Layer 1: Cloudflare Turnstile
    const turnstileCheck = await verifyTurnstileToken(turnstileToken, req.ip);
    if (!turnstileCheck.success) {
      return res.status(400).json({
        success: false,
        message: 'Cloudflare Turnstile verification failed. Please try again.'
      });
    }

    // Layer 2: Image CAPTCHA
    const captchaCheck = verifyImageCaptcha(captchaId, captchaAnswer);
    if (!captchaCheck.valid) {
      return res.status(400).json({
        success: false,
        message: captchaCheck.message || 'Image CAPTCHA verification failed'
      });
    }

    // 3. Check existing user
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    // 4. Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobileNumber,
      password,
      role: 'citizen'
    });

    const token = generateToken(user._id);

    await logAuditEvent({
      user: user._id,
      userRole: 'citizen',
      action: 'REGISTER',
      targetResource: 'User',
      targetId: user._id,
      req,
      details: { email: user.email }
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, turnstileToken, captchaId, captchaAnswer } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Dual CAPTCHA Verification:
    // Allow TEST bypass ONLY for the 3 designated demo accounts when using explicit demo bypass
    const isDemoAccount = ['citizen@janaseva.demo', 'cmo@janaseva.demo', 'officer@janaseva.demo'].includes((email || '').toLowerCase());
    const isDemoBypass = isDemoAccount && (captchaAnswer || '').toUpperCase() === 'TEST' && (captchaId === 'demo-bypass' || !captchaId);

    if (!isDemoBypass) {
      // Layer 1: Cloudflare Turnstile
      const turnstileCheck = await verifyTurnstileToken(turnstileToken, req.ip);
      if (!turnstileCheck.success) {
        return res.status(400).json({
          success: false,
          message: 'Cloudflare Turnstile verification failed'
        });
      }

      // Layer 2: Image CAPTCHA
      const captchaCheck = verifyImageCaptcha(captchaId, captchaAnswer);
      if (!captchaCheck.valid) {
        return res.status(400).json({
          success: false,
          message: captchaCheck.message || 'Image CAPTCHA verification failed'
        });
      }
    }

    // Find user with password included
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password').populate('department');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check account lockout
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const waitMinutes = Math.ceil((user.lockUntil - Date.now()) / 60000);
      return res.status(429).json({
        success: false,
        message: `Account is temporarily locked due to repeated failed login attempts. Please try again in ${waitMinutes} minutes.`
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins lock
      }
      await user.save();

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset failed login attempts
    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      user.lockUntil = null;
      await user.save();
    }

    const token = generateToken(user._id);

    await logAuditEvent({
      user: user._id,
      userRole: user.role,
      action: 'LOGIN',
      targetResource: 'User',
      targetId: user._id,
      req,
      details: { email: user.email, role: user.role }
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        department: user.department,
        designation: user.designation,
        isDemoAccount: user.isDemoAccount
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('department');
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  await logAuditEvent({
    user: req.user?._id,
    userRole: req.user?.role,
    action: 'LOGOUT',
    targetResource: 'User',
    targetId: req.user?._id,
    req
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

