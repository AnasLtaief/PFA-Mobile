import { Router } from 'express';
import * as messageController from '../controllers/message.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { sendDMMessageSchema } from '../validators/social.js';

const router = Router();

router.use(authenticate);

router.get('/conversations', messageController.getConversations);
router.get('/:userId', messageController.getMessagesWithUser);
router.post('/:userId', uploadSingle('media'), validate(sendDMMessageSchema, 'body'), messageController.sendDM);

export default router;
