import { Request, Response, NextFunction } from 'express';
import Message from '../models/Message.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadFile } from '../services/storage.js';

export const getConversations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Aggregate DM conversations by grouping senders and receivers
    // Find all messages involving current user
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    }).sort({ createdAt: -1 });

    const conversationMap = new Map<string, any>();

    for (const msg of messages) {
      const otherUserId = msg.senderId.toString() === userId ? msg.receiverId.toString() : msg.senderId.toString();
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, msg);
      }
    }

    const conversations: any[] = [];
    for (const [otherId, lastMsg] of conversationMap.entries()) {
      const otherUser = await User.findById(otherId).select('fullName email avatarUrl university isVerified isHost');
      if (otherUser) {
        // Calculate unread count
        const unreadCount = await Message.countDocuments({
          senderId: otherId,
          receiverId: userId,
          isRead: false,
        });

        conversations.push({
          otherUser,
          lastMessage: lastMsg,
          unreadCount,
        });
      }
    }

    sendSuccess(res, conversations, 'Conversations list retrieved');
  } catch (error) {
    next(error);
  }
};

export const getMessagesWithUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentUserId = req.user?.userId;
    const otherUserId = req.params.userId;
    const { limit = 50, skip = 0 } = req.query;

    // Mark messages from other user as read
    await Message.updateMany(
      { senderId: otherUserId, receiverId: currentUserId, isRead: false },
      { isRead: true }
    );

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    sendSuccess(res, messages, 'Message history retrieved');
  } catch (error) {
    next(error);
  }
};

export const sendDM = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const senderId = req.user?.userId;
    const receiverId = req.params.userId;
    const { content } = req.body;
    const file = req.file;

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      sendError(res, 'Receiver user not found', 404);
      return;
    }

    let mediaUrl = '';
    if (file) {
      const path = `dms/${senderId}_${receiverId}/${Date.now()}_${file.originalname}`;
      mediaUrl = await uploadFile('media', path, file.buffer, file.mimetype);
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      mediaUrl,
      isRead: false,
    });

    sendSuccess(res, message, 'DM message sent successfully', 201);
  } catch (error) {
    next(error);
  }
};
