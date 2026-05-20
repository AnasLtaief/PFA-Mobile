import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message.js';
import GroupMessage from '../models/GroupMessage.js';

interface SocketUser {
  userId: string;
  role: string;
}

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Adjust to specific Client URLs in production
      methods: ['GET', 'POST'],
    },
  });

  // Track online users: Map<userId, socketId>
  const onlineUsers = new Map<string, string>();

  // Authentication Middleware for Socket.io
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers['authorization'];
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      const tokenString = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
      const decoded = jwt.verify(tokenString, process.env.JWT_SECRET!) as SocketUser;

      (socket as any).user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user as SocketUser;
    console.log(`User connected to socket: ${user.userId} (${socket.id})`);

    // Register user to online tracking
    onlineUsers.set(user.userId, socket.id);
    socket.join(`user_${user.userId}`); // Join private personal room

    // join_room (e.g. chat conversation room or group chat room)
    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    // leave_room
    socket.on('leave_room', (roomId: string) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    // send_message (Direct Message or Group Message)
    socket.on('send_message', async (data: {
      roomId: string; // can be group id or DM conversation identifier
      content: string;
      mediaUrl?: string;
      receiverId?: string; // present if direct message
      isGroup?: boolean;
    }) => {
      try {
        const { roomId, content, mediaUrl, receiverId, isGroup } = data;

        if (isGroup) {
          // Save group message
          const groupMsg = await GroupMessage.create({
            groupId: roomId,
            senderId: user.userId,
            content,
            mediaUrl: mediaUrl || '',
            reactions: [],
          });

          const populatedMsg = await GroupMessage.findById(groupMsg._id).populate('senderId', 'fullName email avatarUrl');

          // Broadcast group message to the group room
          io.to(roomId).emit('receive_message', {
            isGroup: true,
            roomId,
            message: populatedMsg,
          });
        } else {
          // Save direct message
          const msg = await Message.create({
            senderId: user.userId,
            receiverId: receiverId!,
            content,
            mediaUrl: mediaUrl || '',
            isRead: false,
          });

          // Send to sender's room and receiver's private room
          io.to(roomId).emit('receive_message', {
            isGroup: false,
            roomId,
            message: msg,
          });

          // Also notify receiver if they are in their personal room but not in the chat room
          const receiverSocketId = onlineUsers.get(receiverId!);
          if (receiverSocketId) {
            io.to(`user_${receiverId}`).emit('new_notification', {
              type: 'NEW_MESSAGE',
              title: 'Nouveau message 💬',
              body: content.length > 50 ? `${content.substring(0, 50)}...` : content,
              data: {
                senderId: user.userId,
                messageId: msg._id.toString(),
              },
            });
          }
        }
      } catch (error) {
        console.error('Error handling send_message in socket:', error);
      }
    });

    // typing
    socket.on('typing', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('typing', {
        roomId: data.roomId,
        userId: user.userId,
      });
    });

    // stop_typing
    socket.on('stop_typing', (data: { roomId: string }) => {
      socket.to(data.roomId).emit('stop_typing', {
        roomId: data.roomId,
        userId: user.userId,
      });
    });

    // ride_status_update
    socket.on('ride_status_update', (data: { rideId: string; status: string }) => {
      io.to(`ride_${data.rideId}`).emit('ride_status_update', data);
    });

    // story_viewed
    socket.on('story_viewed', (data: { storyId: string; storyOwnerId: string }) => {
      io.to(`user_${data.storyOwnerId}`).emit('story_viewed', {
        storyId: data.storyId,
        viewerId: user.userId,
      });
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(user.userId);
      console.log(`User disconnected from socket: ${user.userId}`);
    });
  });

  return io;
};
