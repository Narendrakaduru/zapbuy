const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  module: {
    type: String,
    enum: ['USER', 'PRODUCT', 'CART', 'ORDER', 'AUTH', 'REVIEW'],
    required: true,
  },
  severity: {
    type: String,
    enum: ['INFO', 'WARN', 'ERROR'],
    default: 'INFO',
  },
  message: {
    type: String,
    required: true,
  },
  meta: {
    type: mongoose.Schema.Types.Mixed, // Optional metadata (e.g., userId, orderId, etc.)
    default: {},
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Log', logSchema);