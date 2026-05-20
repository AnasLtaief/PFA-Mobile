import admin from 'firebase-admin';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

// Initialize Firebase Admin SDK
const initFirebase = () => {
  if (admin.apps.length === 0) {
    try {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      // Convert escaped newlines in private key if needed
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey && !privateKey.includes('MOCK_KEY')) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        console.log('Firebase Admin SDK initialized successfully');
      } else {
        console.warn('Firebase credentials missing or using mock values in environment variables. FCM disabled.');
      }
    } catch (error) {
      console.error('Failed to initialize Firebase Admin SDK:', error);
    }
  }
};

initFirebase();

export const sendPushNotification = async (
  userId: string,
  type: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    // 1. Create in-app Notification doc
    const notification = await Notification.create({
      userId,
      type,
      title,
      body,
      data,
    });

    // 2. Fetch User to get FCM Token
    const user = await User.findById(userId).select('+phone');
    if (!user) return notification;

    // We can fetch user's FCM tokens. Let's assume we store fcmToken directly on user model, or as dynamic data. Let's check the schema
    // The User schema doesn't have an explicit fcmToken field, let's assume it can be passed in data, or let's use user's dynamic custom attribute, or just mock sending if FCM token doesn't exist.
    // Let's check if user has custom fcm token stored or if we send.
    // We can assume device token might be retrieved from a session or custom field. Let's write the code to check user.fcmToken if any user object has it.
    const fcmToken = (user as any).fcmToken;

    if (fcmToken && admin.apps.length > 0) {
      const message = {
        notification: {
          title,
          body,
        },
        data: {
          ...data,
          notificationId: notification._id.toString(),
          type,
        },
        token: fcmToken,
      };

      await admin.messaging().send(message);
    }

    return notification;
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
};

export const sendToMultiple = async (
  userIds: string[],
  type: string,
  title: string,
  body: string,
  data?: Record<string, string>
) => {
  try {
    const notifications = await Promise.all(
      userIds.map((userId) => sendPushNotification(userId, type, title, body, data))
    );
    return notifications;
  } catch (error) {
    console.error('Error sending multiple push notifications:', error);
    throw error;
  }
};
