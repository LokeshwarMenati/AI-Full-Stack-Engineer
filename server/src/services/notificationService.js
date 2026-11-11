import { Notification } from '../models/Notification.js';

let ioInstance = null;

export const setSocketIOInstance = (io) => {
  ioInstance = io;
};

export const createNotification = async ({
  recipientId,
  title,
  message,
  type = 'INFO',
  grievanceId = null
}) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      title,
      message,
      type,
      grievance: grievanceId
    });

    if (ioInstance) {
      // Emit to recipient's personal room
      ioInstance.to(`user_${recipientId}`).emit('new_notification', notification);
      // If it's a CMO/Officer notification, also broadcast to their role room
      ioInstance.to('cmo_admins').emit('dashboard_update', { type, title, message });
    }

    return notification;
  } catch (err) {
    console.error('[Notification] Error creating notification:', err.message);
  }
};

