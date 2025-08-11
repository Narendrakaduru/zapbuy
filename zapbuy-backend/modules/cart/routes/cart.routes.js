const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../../product/middlewares/auth.middleware');

router.use(authenticate); // protect all routes

router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/', cartController.updateQuantity);
router.delete('/:productId', cartController.removeItem);
router.delete('/', cartController.clearCart);

module.exports = router;
