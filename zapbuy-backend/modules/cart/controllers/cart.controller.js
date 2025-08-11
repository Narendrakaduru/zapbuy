const Cart = require('../models/cart.model');
const Product = require('../../product/models/product.model');
const logToService = require('../../log/utils/logToService');

// GET /api/cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    await logToService('CART', 'INFO', 'Fetched cart', { userId: req.user._id });
    res.json(cart || { user: req.user._id, items: [] });
  } catch (err) {
    await logToService('CART', 'ERROR', 'Error fetching cart', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// POST /api/cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      await logToService('CART', 'WARN', 'Product not found while adding to cart', { productId });
      return res.status(404).json({ error: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [{ product: productId, quantity }] });
    } else {
      const item = cart.items.find(i => i.product.toString() === productId);
      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    await logToService('CART', 'INFO', 'Added to cart', { userId: req.user._id, productId, quantity });
    res.status(200).json(cart);
  } catch (err) {
    await logToService('CART', 'ERROR', 'Error adding to cart', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/cart
exports.updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      await logToService('CART', 'WARN', 'Cart not found while updating quantity', { userId: req.user._id });
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find(i => i.product.toString() === productId);
    if (!item) {
      await logToService('CART', 'WARN', 'Product not in cart while updating quantity', { productId });
      return res.status(404).json({ error: 'Product not in cart' });
    }

    item.quantity = quantity;
    await cart.save();

    await logToService('CART', 'INFO', 'Updated item quantity in cart', { userId: req.user._id, productId, quantity });
    res.json(cart);
  } catch (err) {
    await logToService('CART', 'ERROR', 'Error updating quantity in cart', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart/:productId
exports.removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { items: { product: productId } } },
      { new: true }
    );

    await logToService('CART', 'INFO', 'Removed item from cart', { userId: req.user._id, productId });
    res.json(cart);
  } catch (err) {
    await logToService('CART', 'ERROR', 'Error removing item from cart', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    await logToService('CART', 'INFO', 'Cleared cart', { userId: req.user._id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    await logToService('CART', 'ERROR', 'Error clearing cart', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};
