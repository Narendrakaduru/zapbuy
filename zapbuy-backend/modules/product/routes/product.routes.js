const express = require('express');
const router = express.Router();
const multer  = require('multer');

const storage = multer.diskStorage({
     destination: function (req, file, cb) {
        return cb(null, './public/images/uploads')
      },
      filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
      }
});

const upload = multer({ storage: storage })



const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addComment,
  likeProduct,
  unlikeProduct,
  getCategories
} = require('../controllers/product.controller');

const { authenticate } = require('../middlewares/auth.middleware');
const { canEditOrDelete, loadProduct } = require('../middlewares/product.middleware');

// Public Route: Get all products
router.get('/', getAllProducts);

// 🟢 Declare static route first
router.get('/category', getCategories);

// Public Route: Get product By Id
router.get('/:id', getProductById);



// Protected Route: Create a product
router.post('/', authenticate, upload.array('images', 6), createProduct);

// Load product before routes that require :id
router.param('id', loadProduct);

// Protected Route: Update product (owner or ADMIN/SUPER_ADMIN)
router.put('/:id', authenticate, canEditOrDelete, upload.array('images', 6), updateProduct);

// Protected Route: Delete product (ADMIN/SUPER_ADMIN only)
router.delete('/:id', authenticate, canEditOrDelete, deleteProduct);

// Protected Route: Add a comment
router.post('/:id/comment', authenticate, addComment);

// Protected Route: Like a product
router.post('/:id/like', authenticate, likeProduct);

// Protected Route: Unlike a product
router.post('/:id/unlike', authenticate, unlikeProduct);

module.exports = router;
