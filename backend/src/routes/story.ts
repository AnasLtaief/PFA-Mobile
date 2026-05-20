import { Router } from 'express';
import * as storyController from '../controllers/story.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { createStorySchema } from '../validators/social.js';

const router = Router();

router.use(authenticate);

router.post('/', uploadSingle('media'), validate(createStorySchema, 'body'), storyController.createStory);
router.get('/', storyController.getStories);
router.post('/:id/view', storyController.viewStory);
router.delete('/:id', storyController.deleteStory);

export default router;
