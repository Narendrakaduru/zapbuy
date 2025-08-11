const Product = require('../models/product.model');
const User = require('../../user/models/user.model');

exports.canEditOrDelete = (req, res, next) => {
  const user = req.user;
  const product = req.product;

  const isOwner = product.createdBy.toString() === user.id;
  const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(user.role);

  // Allow edit if owner or admin
  if (req.method === 'PUT' && (isOwner || isAdmin)) return next();

  // Allow delete only if admin
  if (req.method === 'DELETE' && isAdmin) return next();

  return res.status(403).json({ error: 'Forbidden: You do not have permission' });
};

exports.loadProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    req.product = product;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.loadProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    req.product = product;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};