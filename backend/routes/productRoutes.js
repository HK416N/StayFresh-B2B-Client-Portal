import express from 'express';
import * as controller from '../controllers/productController.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { requireStaff } from '../middleware/requireStaff.js';
import { validateProduct } from '../validators/productValidator.js';

const router = express.Router();

// shared route,  allproducts list for dashboard
router.get('/', verifyToken, controller.getAllProducts);

// Staff only, dashboard stats
router.get('/stats', verifyToken, requireStaff, controller.getStats);

// Staff only, one product, create, update, soft delete
router.get('/:id', verifyToken, requireStaff, controller.getProductById);
router.post('/', verifyToken, requireStaff, validateProduct, controller.createProduct);
router.put('/:id', verifyToken, requireStaff, validateProduct, controller.updateProduct);
router.delete('/:id', verifyToken, requireStaff, controller.softDeleteProduct);

export default router;