const express = require('express');
const {
  createAction,
  getUserActions,
  getAction,
  updateAction,
  deleteAction,
  getImpactStats,
  getActionTypes
} = require('../controllers/actionController');
const { protect } = require('../middleware/auth');
const { uploadSingle } = require('../middleware/upload');
const {
  validateCreateAction,
  validateUpdateAction
} = require('../middleware/validation');

const router = express.Router();

// All routes are protected
router.use(protect);

// Action CRUD operations
router.route('/')
  .get(getUserActions)
  .post(uploadSingle('proofImage'), validateCreateAction, createAction);

router.route('/:id')
  .get(getAction)
  .put(validateUpdateAction, updateAction)
  .delete(deleteAction);

// Additional routes
router.get('/impact/stats', getImpactStats);
router.get('/types/all', getActionTypes);

module.exports = router;