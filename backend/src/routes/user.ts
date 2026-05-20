import { Router } from 'express';
import * as userController from '../controllers/user.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import {
  updateProfileSchema,
  friendRequestResponseSchema,
  searchUsersSchema,
} from '../validators/user.js';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getMe);
router.patch('/me', validate(updateProfileSchema, 'body'), userController.updateMe);
router.post('/me/avatar', uploadSingle('avatar'), userController.uploadAvatar);
router.delete('/me', userController.deleteMe);

router.get('/friends', userController.getFriends);
router.get('/search', validate(searchUsersSchema, 'query'), userController.searchUsers);

router.get('/:id', userController.getUserById);
router.post('/friend-request/:id', userController.sendFriendRequest);
router.patch('/friend-request/:id/respond', validate(friendRequestResponseSchema, 'body'), userController.respondFriendRequest);

export default router;
