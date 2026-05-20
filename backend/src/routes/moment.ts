import { Router } from 'express';
import * as momentController from '../controllers/moment.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import { createMomentSchema } from '../validators/social.js';

const router = Router();

router.use(authenticate);

router.post('/', uploadSingle('media'), validate(createMomentSchema, 'body'), momentController.createMoment);
router.get('/ride/:rideId', momentController.getMomentsByRide);
router.post('/:id/like', momentController.toggleLikeMoment);
router.delete('/:id', momentController.deleteMoment);

export default router;
