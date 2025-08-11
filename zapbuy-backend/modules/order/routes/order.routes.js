// routes/order.routes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateDeliveryStatus,
  updatePaymentStatus,
  cancelOrder,
} = require('../controllers/order.controller');
const { authenticate } = require('../../product/middlewares/auth.middleware');
const { authorizeRoles } = require('../../user/middlewares/role.middleware');

// User routes
router.post('/', authenticate, createOrder);
router.get('/my', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);
router.delete('/:id', authenticate, cancelOrder);

// Admin routes
router.get('/', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), getAllOrders);
router.patch('/:id/status', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updateDeliveryStatus);
router.patch('/:id/payment', authenticate, authorizeRoles('ADMIN', 'SUPER_ADMIN'), updatePaymentStatus);

module.exports = router;
