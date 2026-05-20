import { Request, Response, NextFunction } from 'express';
import Report from '../models/Report.js';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { uploadFile } from '../services/storage.js';

export const createReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reporterId = req.user?.userId;
    const { reportedUserId, rideId, reason, description } = req.body;
    const files = req.files as Express.Multer.File[];

    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      sendError(res, 'Reported user not found', 404);
      return;
    }

    const evidencePhotos: string[] = [];
    if (files && files.length > 0) {
      for (const file of files) {
        const path = `reports/${reporterId}_${reportedUserId}/${Date.now()}_${file.originalname}`;
        const photoUrl = await uploadFile('media', path, file.buffer, file.mimetype);
        evidencePhotos.push(photoUrl);
      }
    }

    const report = await Report.create({
      reporterId,
      reportedUserId,
      rideId,
      reason,
      description,
      evidencePhotos,
      status: 'PENDING',
    });

    sendSuccess(res, report, 'Report submitted successfully. Admins will review it.', 201);
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const reports = await Report.find(query)
      .populate('reporterId', 'fullName email avatarUrl university')
      .populate('reportedUserId', 'fullName email avatarUrl university')
      .sort({ createdAt: -1 });

    sendSuccess(res, reports, 'Reports retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    const reportId = req.params.id;
    const { status, adminNote } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      sendError(res, 'Report not found', 404);
      return;
    }

    report.status = status;
    report.adminNote = adminNote;
    report.resolvedBy = adminId as any;

    await report.save();

    sendSuccess(res, report, 'Report updated successfully');
  } catch (error) {
    next(error);
  }
};
