const User = require('../models/user.model');
const Token = require('../models/token.model');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/jwt');
const logToService = require('../../log/utils/logToService');
const sendResetEmail = require('../utils/sendResetEmail');
const EmailVerification = require('../models/emailVerificationToken.model');
const sendVerificationCode = require('../utils/sendVerificationCode');




// @desc    Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, code } = req.body;

    if (!firstName || !lastName || !email || !password || !code)
      return res.status(400).json({ error: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: 'Email already in use' });

    const verification = await EmailVerification.findOne({ email });
    if (!verification)
      return res.status(400).json({ error: 'No verification code sent' });

    if (verification.code !== code)
      return res.status(400).json({ error: 'Invalid verification code' });

    if (verification.expiresAt < new Date())
      return res.status(400).json({ error: 'Verification code expired' });

    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    await EmailVerification.deleteOne({ email });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
};


exports.sendEmailVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Email is required' });

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Upsert verification entry
    await EmailVerification.findOneAndUpdate(
      { email },
      { code, expiresAt },
      { upsert: true, new: true }
    );

    await sendVerificationCode(email, code);

    res.status(200).json({ message: 'Verification code sent to email' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send verification code' });
  }
};

// @desc    Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      await logToService('USER', 'WARN', 'Invalid login attempt', { email });
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    await logToService('USER', 'INFO', 'User logged in', { userId: user._id });

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (err) {
    await logToService('USER', 'ERROR', 'Login failed', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      await logToService('USER', 'WARN', 'User not found by ID', { userId: req.params.id });
      return res.status(404).json({ error: 'User not found' });
    }

    await logToService('USER', 'INFO', 'User retrieved by ID', { userId: req.params.id });
    res.json(user);
  } catch (err) {
    await logToService('USER', 'ERROR', 'Error fetching user by ID', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// @desc    Update user by ID
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      await logToService('USER', 'WARN', 'Password update attempted through wrong endpoint', { userId: req.params.id });
      return res.status(400).json({ error: 'Use password change endpoint instead' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      await logToService('USER', 'WARN', 'User update failed - not found', { userId: req.params.id });
      return res.status(404).json({ error: 'User not found' });
    }

    await logToService('USER', 'INFO', 'User updated', { userId: user._id, updates });
    res.json(user);
  } catch (err) {
    await logToService('USER', 'ERROR', 'User update error', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// @desc    Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      await logToService('USER', 'WARN', 'User delete failed - not found', { userId: req.params.id });
      return res.status(404).json({ error: 'User not found' });
    }

    await logToService('USER', 'INFO', 'User deleted', { userId: user._id });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    await logToService('USER', 'ERROR', 'User delete error', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// @desc    Change password
exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !(await user.comparePassword(oldPassword))) {
      await logToService('USER', 'WARN', 'Password change failed: incorrect old password', { userId });
      return res.status(401).json({ error: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    await logToService('USER', 'INFO', 'Password changed successfully', { userId });
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    await logToService('USER', 'ERROR', 'Error changing password', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get current logged-in user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      await logToService('USER', 'WARN', 'Current user not found', { userId: req.user.id });
      return res.status(404).json({ error: 'User not found' });
    }

    await logToService('USER', 'INFO', 'Fetched current user profile', { userId: req.user.id });
    res.json(user);
  } catch (err) {
    await logToService('USER', 'ERROR', 'Error getting current user', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get all users with pagination and search
exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const query = {
    $or: [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ]
  };

  try {
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const count = await User.countDocuments(query);

    await logToService('USER', 'INFO', 'Fetched all users', { total: count, page });

    res.json({
      total: count,
      page: Number(page),
      pageSize: users.length,
      users
    });
  } catch (err) {
    await logToService('USER', 'ERROR', 'Error fetching all users', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    // Optional: Add JWT to blacklist (in Redis or DB)
    await logToService('USER', 'INFO', 'User logged out', { userId: req.user.id });

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    await logToService('USER', 'ERROR', 'Logout error', { error: err.message });
    res.status(500).json({ error: err.message });
  }
};


// forgotPassword function
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');

    // 👇 THIS PART MUST EXIST HERE
    const tokenDoc = new Token({
      token: resetToken,
      user: user._id,
      type: 'RESET_PASSWORD',
      expiresAt: new Date(Date.now() + 1000 * 60 * 10), // 10 mins
    });

    await tokenDoc.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendResetEmail(user.email, resetLink);

    return res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('🔴 Forgot Password Error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const tokenDoc = await Token.findOne({
      token,
      type: 'RESET_PASSWORD',
      expiresAt: { $gt: new Date() },
    });

    if (!tokenDoc) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = await User.findById(tokenDoc.user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({ error: 'New password must be different from the old password' });
    }

    // Just set new password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save(); // password will be hashed here

    await Token.deleteOne({ _id: tokenDoc._id });

    return res.status(200).json({ message: 'Password has been reset successfully. Please login with your new password.' });
  } catch (error) {
    console.error('🔴 Reset Password Error:', error);
    return res.status(500).json({ error: 'Internal server error. Please try again later.' });
  }
};