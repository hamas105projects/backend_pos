import { Router } from 'express';
import { reportController } from '../controllers/reportController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// All report routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.get('/monthly', reportController.getMonthlyReport);
router.get('/daily', reportController.getDailyReport);  // <-- TAMBAH INI

export default router;