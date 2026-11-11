import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';

import { connectDB } from './config/db.js';
import { swaggerDocument } from './config/swagger.js';
import { setSocketIOInstance } from './services/notificationService.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import captchaRoutes from './routes/captchaRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import cmoRoutes from './routes/cmoRoutes.js';
import officerRoutes from './routes/officerRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH'],
    credentials: true
  }
});

setSocketIOInstance(io);

io.on('connection', (socket) => {
  // Join user-specific notification room
  socket.on('join_user_room', (userId) => {
    if (userId) socket.join(`user_${userId}`);
  });

  // Join role-specific broadcast room
  socket.on('join_role_room', (role) => {
    if (role === 'cmo_admin') socket.join('cmo_admins');
    if (role === 'officer') socket.join('officers');
  });

  socket.on('disconnect', () => {
    // disconnected
  });
});

// Security & Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false // Allows inline scripts in swagger-ui
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global Rate Limiter
app.use('/api/', apiLimiter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    platform: 'JANASEVA AI – Public Grievance Platform',
    version: '1.0.0',
    disclaimer: 'Recruitment Prototype for WhiteMatrix Software Solutions evaluation. Fictional demonstration.',
    timestamp: new Date().toISOString()
  });
});

// Swagger API Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount REST Routes
app.use('/api/auth', authRoutes);
app.use('/api/captcha', captchaRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/cmo', cmoRoutes);
app.use('/api/officer', officerRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/notifications', notificationRoutes);

// Error Handler
app.use(errorHandler);

import { startSlaBackgroundWorker } from './services/slaService.js';

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`[Janaseva Server] Running on http://localhost:${PORT}`);
    console.log(`[Swagger Docs] Available on http://localhost:${PORT}/api/docs`);
    // Start automated SLA background monitor
    startSlaBackgroundWorker(io);
  });
};

// Only listen if not imported by tests
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, server };

