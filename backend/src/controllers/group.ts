import { Request, Response, NextFunction } from 'express';
import Group from '../models/Group.js';
import GroupMessage from '../models/GroupMessage.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadFile } from '../services/storage.js';

export const createGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { name, wilaya, description } = req.body;
    const file = req.file;

    let coverPhoto = '';
    if (file) {
      const path = `groups/${Date.now()}_${file.originalname}`;
      coverPhoto = await uploadFile('media', path, file.buffer, file.mimetype);
    }

    const group = await Group.create({
      name,
      wilaya,
      coverPhoto,
      description,
      createdBy: userId,
      members: [userId],
      admins: [userId],
    });

    sendSuccess(res, group, 'Group created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { wilaya } = req.query;
    const query: any = {};

    if (wilaya) {
      query.wilaya = wilaya;
    }

    const groups = await Group.find(query)
      .select('name wilaya coverPhoto description members')
      .sort({ name: 1 });

    sendSuccess(res, groups, 'Groups retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getGroupById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('members', 'fullName email avatarUrl university wilaya')
      .populate('admins', 'fullName email avatarUrl')
      .populate('pinnedRide');

    if (!group) {
      sendError(res, 'Group not found', 404);
      return;
    }

    sendSuccess(res, group, 'Group details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const joinGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      sendError(res, 'Group not found', 404);
      return;
    }

    if (group.members.some((id) => id.toString() === userId)) {
      sendError(res, 'You are already a member of this group', 400);
      return;
    }

    group.members.push(userId as any);
    await group.save();

    sendSuccess(res, group, 'Joined group successfully');
  } catch (error) {
    next(error);
  }
};

export const leaveGroup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupId = req.params.id;

    const group = await Group.findById(groupId);
    if (!group) {
      sendError(res, 'Group not found', 404);
      return;
    }

    if (!group.members.some((id) => id.toString() === userId)) {
      sendError(res, 'You are not a member of this group', 400);
      return;
    }

    group.members = group.members.filter((id) => id.toString() !== userId);
    group.admins = group.admins.filter((id) => id.toString() !== userId);

    await group.save();

    sendSuccess(res, null, 'Left group successfully');
  } catch (error) {
    next(error);
  }
};

export const sendGroupMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const groupId = req.params.id;
    const { content } = req.body;
    const file = req.file;

    const group = await Group.findById(groupId);
    if (!group) {
      sendError(res, 'Group not found', 404);
      return;
    }

    if (!group.members.some((id) => id.toString() === userId)) {
      sendError(res, 'Must be a group member to send messages', 403);
      return;
    }

    let mediaUrl = '';
    if (file) {
      const path = `group-messages/${groupId}/${Date.now()}_${file.originalname}`;
      mediaUrl = await uploadFile('media', path, file.buffer, file.mimetype);
    }

    const message = await GroupMessage.create({
      groupId,
      senderId: userId,
      content,
      mediaUrl,
      reactions: [],
    });

    sendSuccess(res, message, 'Message sent successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getGroupMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const groupId = req.params.id;
    const { limit = 50, skip = 0 } = req.query;

    const group = await Group.findById(groupId);
    if (!group) {
      sendError(res, 'Group not found', 404);
      return;
    }

    const messages = await GroupMessage.find({ groupId })
      .populate('senderId', 'fullName email avatarUrl')
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    sendSuccess(res, messages, 'Group messages retrieved successfully');
  } catch (error) {
    next(error);
  }
};
