import { Router } from 'express';
import { usageReport } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
const router = Router();
router.get('/usage', protect, adminOnly, usageReport);
export default router;
