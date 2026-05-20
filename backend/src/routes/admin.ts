import { Router } from 'express';
import * as adminController from '../controllers/admin.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';

const router = Router();

// Protect all admin routes with authentication and admin-only role check
router.use(authenticate, isAdmin);

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/ban', adminController.banUser);
router.patch('/users/:id/unban', adminController.unbanUser);
router.patch('/users/:id/verify-host', adminController.verifyHost);

router.get('/rides', adminController.getRides);
router.get('/payments', adminController.getPayments);

export default router;
