import { Router } from 'express';
import * as groupController from '../controllers/group.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { createGroupSchema, createGroupMessageSchema } from '../validators/social.js';

const router = Router();

router.use(authenticate);

router.post('/', uploadSingle('cover'), validate(createGroupSchema, 'body'), groupController.createGroup);
router.get('/', groupController.getGroups);

router.get('/:id', groupController.getGroupById);
router.post('/:id/join', groupController.joinGroup);
router.post('/:id/leave', groupController.leaveGroup);

router.post('/:id/message', uploadSingle('media'), validate(createGroupMessageSchema, 'body'), groupController.sendGroupMessage);
router.get('/:id/messages', groupController.getGroupMessages);

export default router;
