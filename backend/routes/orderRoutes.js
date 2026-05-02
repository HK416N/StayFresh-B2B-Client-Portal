import express from 'express';
import * as controller from '../controllers/orderController.js';
import {verifyToken} from '../middleware/verifyToken.js';

const router = express.Router();

// both roles - view limited by controller
router.get('/', verifyToken, controller.getOrders);
router.get('/:id', verifyToken, controller.getOrderById);

// customer onlu
router.post('/', verifyToken, controller.placeOrder);

//status updates
router.patch('/:id/status',verifyToken, controller.updateOrderStatus);

export default router;
