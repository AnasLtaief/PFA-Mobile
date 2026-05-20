import { Router } from 'express';
import * as reportController from '../controllers/report.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { uploadMultiple } from '../middleware/upload.js';
import { createReportSchema, resolveReportSchema } from '../validators/social.js';

const router = Router();

router.use(authenticate);

// User endpoints
router.post('/', uploadMultiple('evidence', 5), validate(createReportSchema, 'body'), reportController.createReport);

// Admin endpoints
router.get('/', isAdmin, reportController.getReports);
router.patch('/:id', isAdmin, validate(resolveReportSchema, 'body'), reportController.updateReportStatus);

export default router;
