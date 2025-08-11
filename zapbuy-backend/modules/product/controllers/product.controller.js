const Product = require('../models/product.model');
const logToService = require('../../log/utils/logToService');
const { error } = require('winston');

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, discount, stock } = req.body;

    const imagePaths = req.files?.map(file => {
      const normalizedPath = file.path.replace(/\\/g, '/');
      return `${BASE_URL}/${normalizedPath}`;
    });

    const product = await Product.create({
      name,
      description,
      price,
      category,
      discount,
      stock,
      images: imagePaths,
      createdBy: req.user.id
    });

    await logToService('PRODUCT', 'INFO', 'Product created', {
      productId: product._id,
      userId: req.user.id
    });

    res.status(201).json(product);
  } catch (err) {
    await logToService('PRODUCT', 'ERROR', 'Error creating product', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'role firstName lastName');
    const userId = req.user?._id?.toString() || 'Unknown';
    res.json(products);
  } catch (err) {
    await logToService('PRODUCT', 'ERROR', 'Error getting all products', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(req.params.id)
  .populate('comments.user', 'firstName lastName');
    if (!product) {
      await logToService('PRODUCT', 'WARN', 'Product not found by ID', { productId: id });
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    await logToService('PRODUCT', 'ERROR', 'Error fetching product by ID', { productId: id, error: error.message });
    res.status(500).json({ error: 'Server error' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      await logToService('PRODUCT', 'WARN', 'Product to update not found', { productId: req.params.id });
      return res.status(404).json({ error: 'Product not found' });
    }

    const isOwner = product.createdBy.toString() === req.user.id;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      await logToService('PRODUCT', 'WARN', 'Unauthorized product update attempt', {
        productId: product._id,
        userId: req.user.id
      });
      return res.status(403).json({ error: 'Forbidden: Not allowed to update this product' });
    }

    // Update fields from request body
    Object.assign(product, req.body);

    // If new files are uploaded, update image paths
    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(file => {
        const normalizedPath = file.path.replace(/\\/g, '/');
        return `${BASE_URL}/${normalizedPath}`;
      });
      product.images = imagePaths;
    }

    await product.save();

    await logToService('PRODUCT', 'INFO', 'Product updated', {
      productId: product._id,
      userId: req.user.id
    });

    res.json(product);
  } catch (err) {
    await logToService('PRODUCT', 'ERROR', 'Error updating product', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};


// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(req.user.role);

    if (!isAdmin) {
      await logToService('PRODUCT', 'WARN', 'Unauthorized product delete attempt', { userId: req.user.id });
      return res.status(403).json({ error: 'Only ADMIN or SUPER_ADMIN can delete products' });
    }

    await logToService('PRODUCT', 'INFO', 'Product deleted', { productId: req.product._id, userId: req.user.id });

    await req.product.deleteOne();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    await logToService('PRODUCT', 'ERROR', 'Error deleting product', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Add a comment to a product
exports.addComment = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment) return res.status(400).json({ error: 'Comment is required' });

    const product = await Product.findById(req.params.id);
    if (!product) {
      await logToService('PRODUCT', 'WARN', 'Add comment failed: Product not found', { productId: req.params.id });
      return res.status(404).json({ error: 'Product not found' });
    }

    const newComment = {
      user: req.user._id,
      comment,
    };

    product.comments.push(newComment);
    await product.save();

    await logToService('PRODUCT', 'INFO', 'Comment added to product', {
      productId: product._id,
      userId: req.user.id,
    });

    res.status(201).json({ message: 'Comment added successfully', comment: newComment });
  } catch (err) {
    await logToService('PRODUCT', 'ERROR', 'Error adding comment to product', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Like a product
exports.likeProduct = async (req, res) => {
  try {
    const product = req.product;

    if (!product.likes.includes(req.user.id)) {
      product.likes.push(req.user.id);
      product.likeCount = product.likes.length;
      await product.save();

      await logToService('PRODUCT', 'INFO', 'Product liked', {
        productId: product._id,
        userId: req.user.id,
      });
    }

    res.json({ message: 'Product liked', likeCount: product.likeCount });
  } catch (err) {
    await logToService('PRODUCT', 'ERROR', 'Error liking product', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// Unlike a product
exports.unlikeProduct = async (req, res) => {
  try {
    const product = req.product;
    const index = product.likes.indexOf(req.user.id);

    if (index > -1) {
      product.likes.splice(index, 1);
      product.likeCount = product.likes.length;
      await product.save();

      await logToService('PRODUCT', 'INFO', 'Product unliked', {
        productId: product._id,
        userId: req.user.id,
      });
    }

    res.json({ message: 'Product unliked', likeCount: product.likeCount });
  } catch (err) {
    await logToService('PRODUCT', 'ERROR', 'Error unliking product', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { category: { $ne: null } });
    res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};
