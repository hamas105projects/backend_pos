import { Router } from 'express';
import { productController } from '../controllers/productController';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { uploadSingle } from '../config/multer';

const router = Router();

// Public routes (anyone can view products)
router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/:id', productController.getProductById);

// Admin only routes (create, update, delete)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  uploadSingle,
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  uploadSingle,
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

export default router;