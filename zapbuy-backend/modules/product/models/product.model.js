const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  images:      [{ type: String }],
  discount:    { type: Number, default: 0 }, // percentage
  stock:       { type: Number, default: 0 },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments:    [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
