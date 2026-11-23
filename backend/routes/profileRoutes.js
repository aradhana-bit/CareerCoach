import { Router } from 'express';
import { getMyProfile, saveMyProfile } from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = Router();
router.use(protect);
router.get('/me', getMyProfile);
router.put('/me', saveMyProfile);
export default router;
