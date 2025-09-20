const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  deleteAccount
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateAccountDeletion
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Private routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/change-password', protect, validatePasswordChange, changePassword);
router.post('/upload-avatar', protect, uploadSingle('avatar'), uploadAvatar);
router.delete('/account', protect, validateAccountDeletion, deleteAccount);

module.exports = router;