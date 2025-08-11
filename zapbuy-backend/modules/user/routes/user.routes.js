const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');


// Auth routes FIRST (so they don't get matched by :id)
// router.post('/request-verification', userController.requestVerification);
router.post('/send-code', userController.sendEmailVerificationCode);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/logout', protect, userController.logoutUser);
router.get('/me', protect, userController.getCurrentUser);
router.patch('/change-password', protect, userController.changePassword);

// Admin-only
router.get('/', protect, authorizeRoles('SUPER_ADMIN'), userController.getAllUsers);
router.delete('/:id', protect, authorizeRoles('SUPER_ADMIN'), userController.deleteUser);

// CRUD by ID
router.get('/:id', protect, userController.getUserById);
router.put('/:id', protect, authorizeRoles('SUPER_ADMIN'), userController.updateUser);

router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password/:token', userController.resetPassword);


module.exports = router;
