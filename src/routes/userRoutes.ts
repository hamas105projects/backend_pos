import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { registerSchema, loginSchema, updateUserSchema, changePasswordSchema } from '../validations/userValidation';

const router = Router();

// Public routes
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);

// Protected routes (authenticated)
router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, validate(updateUserSchema), userController.updateProfile);
router.post('/change-password', authenticate, validate(changePasswordSchema), userController.changePassword);

// Admin only routes
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin'), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);

export default router;