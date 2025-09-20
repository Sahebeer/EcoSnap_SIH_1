const express = require('express');
const {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  getAllActions,
  verifyAction,
  deleteAction,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const {
  validateUserStatusUpdate,
  validateActionVerification
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected and admin only
router.use(protect);
router.use(admin);

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserDetails);
router.put('/users/:id/status', validateUserStatusUpdate, updateUserStatus);

// Action management
router.get('/actions', getAllActions);
router.put('/actions/:id/verify', validateActionVerification, verifyAction);
router.delete('/actions/:id', deleteAction);

module.exports = router;