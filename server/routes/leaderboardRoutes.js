const express = require('express');
const {
  getGlobalLeaderboard,
  getRegionalLeaderboard,
  getCategoryLeaderboard,
  getMonthlyLeaderboard,
  getLeaderboardStats
} = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Leaderboard routes
router.get('/global', getGlobalLeaderboard);
router.get('/regional', getRegionalLeaderboard);
router.get('/category/:type', getCategoryLeaderboard);
router.get('/monthly', getMonthlyLeaderboard);
router.get('/stats', getLeaderboardStats);

module.exports = router;