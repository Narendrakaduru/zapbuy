// models/order.model.js
const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PENDING',
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING',
  },
  shippingAddress: {
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
