const { body } = require('express-validator');

// User registration validation
const validateRegister = [
  body('username')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('firstName')
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must be less than 50 characters')
    .trim(),
  
  body('lastName')
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must be less than 50 characters')
    .trim(),
  
  body('location.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country name must be less than 100 characters'),
  
  body('location.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City name must be less than 100 characters'),
  
  body('location.region')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Region name must be less than 100 characters')
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .trim(),
  
  body('lastName')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .trim(),
  
  body('location.country')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Country name must be less than 100 characters'),
  
  body('location.city')
    .optional()
    .isLength({ max: 100 })
    .withMessage('City name must be less than 100 characters'),
  
  body('location.region')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Region name must be less than 100 characters'),
  
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notification setting must be a boolean'),
  
  body('notifications.achievements')
    .optional()
    .isBoolean()
    .withMessage('Achievement notification setting must be a boolean'),
  
  body('notifications.leaderboard')
    .optional()
    .isBoolean()
    .withMessage('Leaderboard notification setting must be a boolean')
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    })
];

// Action creation validation
const validateCreateAction = [
  body('type')
    .isIn([
      'Recycling',
      'Energy Saving',
      'Water Conservation',
      'Sustainable Transportation',
      'Green Purchase',
      'Waste Reduction',
      'Composting',
      'Tree Planting',
      'Education/Awareness',
      'Other'
    ])
    .withMessage('Invalid action type'),
  
  body('title')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .trim(),
  
  body('points')
    .isInt({ min: 1, max: 1000 })
    .withMessage('Points must be between 1 and 1000'),
  
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters'),
  
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100')
];

// Action update validation
const validateUpdateAction = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters')
    .trim(),
  
  body('location')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters')
    .trim(),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Each tag must be less than 50 characters')
];

// Admin user status update validation
const validateUserStatusUpdate = [
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('isAdmin')
    .optional()
    .isBoolean()
    .withMessage('isAdmin must be a boolean')
];

// Admin action verification validation
const validateActionVerification = [
  body('isVerified')
    .isBoolean()
    .withMessage('isVerified must be a boolean')
];

// Account deletion validation
const validateAccountDeletion = [
  body('password')
    .notEmpty()
    .withMessage('Password is required to delete account')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateCreateAction,
  validateUpdateAction,
  validateUserStatusUpdate,
  validateActionVerification,
  validateAccountDeletion
};