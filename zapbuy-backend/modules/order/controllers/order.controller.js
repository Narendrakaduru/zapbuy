const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Product = require('../../product/models/product.model');
const logToService = require('../../log/utils/logToService');

// Create order (user only)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      await logToService('ORDER', 'WARN', 'Order creation failed: No items', { userId: req.user?._id });
      return res.status(400).json({ error: 'Order must have at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        await logToService('ORDER', 'WARN', 'Product not found while creating order', {
          userId: req.user._id,
          productId: item.product,
        });
        return res.status(404).json({ error: `Product not found: ${item.product}` });
      }

      const priceAtPurchase = product.price - ((product.price * product.discount) / 100);
      totalAmount += priceAtPurchase * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        priceAtPurchase,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    await logToService('ORDER', 'INFO', 'Order created successfully', {
      userId: req.user._id,
      orderId: order._id,
    });

    res.status(201).json(order);
  } catch (err) {
    await logToService('ORDER', 'ERROR', 'Error creating order', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get all orders of logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    await logToService('ORDER', 'INFO', 'Fetched user orders', { userId: req.user._id });
    res.json(orders);
  } catch (err) {
    await logToService('ORDER', 'ERROR', 'Error fetching user orders', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) {
      await logToService('ORDER', 'WARN', 'Order not found by ID', {
        userId: req.user._id,
        orderId: req.params.id,
      });
      return res.status(404).json({ error: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
    if (!isOwner && !isAdmin) {
      await logToService('ORDER', 'WARN', 'Unauthorized access attempt to order', {
        userId: req.user._id,
        orderId: order._id,
      });
      return res.status(403).json({ error: 'Unauthorized access to order' });
    }

    await logToService('ORDER', 'INFO', 'Fetched order by ID', {
      userId: req.user._id,
      orderId: order._id,
    });

    res.json(order);
  } catch (err) {
    await logToService('ORDER', 'ERROR', 'Error fetching order by ID', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user').populate('items.product');
    await logToService('ORDER', 'INFO', 'Admin fetched all orders', { adminId: req.user._id });
    res.json(orders);
  } catch (err) {
    await logToService('ORDER', 'ERROR', 'Error fetching all orders', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Update delivery status of a specific product in order
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { productId, status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      await logToService('ORDER', 'WARN', 'Order not found for delivery status update', {
        orderId: req.params.id,
        userId: req.user._id,
      });
      return res.status(404).json({ error: 'Order not found' });
    }

    const item = order.items.find(i => i.product.toString() === productId);
    if (!item) {
      await logToService('ORDER', 'WARN', 'Product not found in order for status update', {
        orderId: req.params.id,
        productId,
      });
      return res.status(404).json({ error: 'Product not found in order' });
    }

    item.status = status;
    await order.save();

    await logToService('ORDER', 'INFO', 'Delivery status updated', {
      userId: req.user._id,
      orderId: order._id,
      productId,
      status,
    });

    res.json({ message: 'Delivery status updated', order });
  } catch (err) {
    await logToService('ORDER', 'ERROR', 'Error updating delivery status', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      await logToService('ORDER', 'WARN', 'Order not found for payment status update', {
        orderId: req.params.id,
        userId: req.user._id,
      });
      return res.status(404).json({ error: 'Order not found' });
    }

    order.paymentStatus = status;
    await order.save();

    await logToService('ORDER', 'INFO', 'Payment status updated', {
      userId: req.user._id,
      orderId: order._id,
      status,
    });

    res.json({ message: 'Payment status updated', order });
  } catch (err) {
    await logToService('ORDER', 'ERROR', 'Error updating payment status', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Cancel order (admin or user)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      await logToService('ORDER', 'WARN', 'Order not found for cancellation', {
        orderId: req.params.id,
        userId: req.user._id,
      });
      return res.status(404).json({ error: 'Order not found' });
    }

    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);
    if (!isOwner && !isAdmin) {
      await logToService('ORDER', 'WARN', 'Unauthorized order cancellation attempt', {
        userId: req.user._id,
        orderId: order._id,
      });
      return res.status(403).json({ error: 'Unauthorized to cancel this order' });
    }

    await Order.findByIdAndDelete(req.params.id);

    await logToService('ORDER', 'INFO', 'Order cancelled', {
      userId: req.user._id,
      orderId: req.params.id,
    });

    res.json({ message: 'Order cancelled successfully' });
  } catch (err) {
    await logToService('ORDER', 'ERROR', 'Error cancelling order', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};
