const { validationResult } = require('express-validator');
const Action = require('../models/Action');
const User = require('../models/User');

// @desc    Create new action
// @route   POST /api/actions
// @access  Private
const createAction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type, title, description, points, impact, location, tags, quantity = 1 } = req.body;

    // Create action
    const action = new Action({
      user: req.user.id,
      type,
      title,
      description,
      points,
      location,
      tags: tags || []
    });

    // Handle proof image if uploaded
    if (req.file) {
      action.proofImage = `/uploads/${req.file.filename}`;
    }

    // Calculate impact if not provided
    if (!impact) {
      action.calculateImpact(quantity);
    } else {
      action.impact = impact;
    }

    await action.save();

    // Update user's total points and level
    const user = await User.findById(req.user.id);
    user.totalPoints += action.points;
    user.updateLevel();

    // Check for new achievements
    const newAchievements = checkForAchievements(user);
    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
    }

    await user.save();

    // Populate user info for response
    await action.populate('user', 'username firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Action created successfully',
      data: {
        action,
        newAchievements,
        userLevel: user.level,
        totalPoints: user.totalPoints
      }
    });

  } catch (error) {
    console.error('Create action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all actions for current user
// @route   GET /api/actions
// @access  Private
const getUserActions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const type = req.query.type;
    const sortBy = req.query.sortBy || 'date';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Build query
    const query = { user: req.user.id };
    if (type && type !== 'all') {
      query.type = type;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder;

    const actions = await Action.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user', 'username firstName lastName profilePicture');

    const total = await Action.countDocuments(query);

    res.json({
      success: true,
      data: {
        actions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user actions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get action by ID
// @route   GET /api/actions/:id
// @access  Private
const getAction = async (req, res) => {
  try {
    const action = await Action.findById(req.params.id)
      .populate('user', 'username firstName lastName profilePicture')
      .populate('verifiedBy', 'username firstName lastName');

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    // Check if user owns this action or is admin
    if (action.user._id.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this action'
      });
    }

    res.json({
      success: true,
      data: action
    });

  } catch (error) {
    console.error('Get action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update action
// @route   PUT /api/actions/:id
// @access  Private
const updateAction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const action = await Action.findById(req.params.id);

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    // Check if user owns this action
    if (action.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this action'
      });
    }

    // Don't allow updating verified actions
    if (action.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update verified actions'
      });
    }

    const { title, description, location, tags } = req.body;

    // Update allowed fields
    if (title) action.title = title;
    if (description) action.description = description;
    if (location) action.location = location;
    if (tags) action.tags = tags;

    await action.save();

    res.json({
      success: true,
      message: 'Action updated successfully',
      data: action
    });

  } catch (error) {
    console.error('Update action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete action
// @route   DELETE /api/actions/:id
// @access  Private
const deleteAction = async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    // Check if user owns this action or is admin
    if (action.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this action'
      });
    }

    // Update user's total points
    const user = await User.findById(action.user);
    user.totalPoints = Math.max(0, user.totalPoints - action.points);
    user.updateLevel();
    await user.save();

    await Action.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Action deleted successfully'
    });

  } catch (error) {
    console.error('Delete action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user's impact statistics
// @route   GET /api/actions/impact/stats
// @access  Private
const getImpactStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await Action.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalActions: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          totalCO2Saved: { $sum: '$impact.co2Saved' },
          totalMoneySaved: { $sum: '$impact.moneySaved' },
          totalWaterSaved: { $sum: '$impact.waterSaved' },
          totalEnergySaved: { $sum: '$impact.energySaved' },
          totalWasteReduced: { $sum: '$impact.wasteReduced' }
        }
      }
    ]);

    // Get actions by type
    const actionsByType = await Action.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          points: { $sum: '$points' }
        }
      }
    ]);

    // Get monthly progress
    const monthlyProgress = await Action.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          actions: { $sum: 1 },
          points: { $sum: '$points' },
          co2Saved: { $sum: '$impact.co2Saved' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const result = {
      totalStats: stats[0] || {
        totalActions: 0,
        totalPoints: 0,
        totalCO2Saved: 0,
        totalMoneySaved: 0,
        totalWaterSaved: 0,
        totalEnergySaved: 0,
        totalWasteReduced: 0
      },
      actionsByType,
      monthlyProgress: monthlyProgress.reverse()
    };

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Get impact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get action types with base points
// @route   GET /api/actions/types
// @access  Private
const getActionTypes = async (req, res) => {
  try {
    const actionTypes = Action.getActionTypes();

    res.json({
      success: true,
      data: actionTypes
    });

  } catch (error) {
    console.error('Get action types error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to check for achievements
const checkForAchievements = (user) => {
  const achievements = [];
  const existingAchievements = user.achievements.map(a => a.name);

  // Points-based achievements
  if (user.totalPoints >= 100 && !existingAchievements.includes('First Century')) {
    achievements.push({
      name: 'First Century',
      description: 'Earned your first 100 eco points!',
      icon: '🏆'
    });
  }

  if (user.totalPoints >= 500 && !existingAchievements.includes('Eco Warrior')) {
    achievements.push({
      name: 'Eco Warrior',
      description: 'Reached 500 eco points - you\'re making a difference!',
      icon: '⚔️'
    });
  }

  if (user.totalPoints >= 1000 && !existingAchievements.includes('Green Champion')) {
    achievements.push({
      name: 'Green Champion',
      description: 'Amazing! You\'ve earned 1000 eco points!',
      icon: '🏅'
    });
  }

  if (user.totalPoints >= 5000 && !existingAchievements.includes('Planet Guardian')) {
    achievements.push({
      name: 'Planet Guardian',
      description: 'Incredible! 5000 eco points - you\'re a true planet guardian!',
      icon: '🌍'
    });
  }

  return achievements;
};

module.exports = {
  createAction,
  getUserActions,
  getAction,
  updateAction,
  deleteAction,
  getImpactStats,
  getActionTypes
};