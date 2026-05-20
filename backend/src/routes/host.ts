import { Router } from 'express';
import * as hostController from '../controllers/host.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { uploadMultiple } from '../middleware/upload.js';
import {
  becomeHostSchema,
  createCarSchema,
  updateCarSchema,
} from '../validators/host.js';

const router = Router();

router.use(authenticate);

router.post('/become-host', validate(becomeHostSchema, 'body'), hostController.becomeHost);
router.post('/car', uploadMultiple('photos', 5), validate(createCarSchema, 'body'), hostController.createCar);
router.patch('/car', uploadMultiple('photos', 5), validate(updateCarSchema, 'body'), hostController.updateCar);
router.get('/car', hostController.getCar);

export default router;
