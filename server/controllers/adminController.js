const User = require('../models/User');
const Action = require('../models/Action');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    if (status !== 'all') {
      query.isActive = status === 'active';
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
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
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user details (admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's actions summary
    const actionStats = await Action.aggregate([
      { $match: { user: user._id } },
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

    // Get recent actions
    const recentActions = await Action.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        user,
        stats: actionStats[0] || {
          totalActions: 0,
          totalPoints: 0,
          totalCO2Saved: 0,
          totalMoneySaved: 0,
          totalWaterSaved: 0,
          totalEnergySaved: 0,
          totalWasteReduced: 0
        },
        recentActions
      }
    });

  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user status (admin only)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const { isActive, isAdmin } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deactivating themselves
    if (req.user.id === user._id.toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    // Update status
    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }
    
    if (typeof isAdmin === 'boolean') {
      user.isAdmin = isAdmin;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all actions (admin only)
// @route   GET /api/admin/actions
// @access  Private/Admin
const getAllActions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const type = req.query.type || 'all';
    const verified = req.query.verified || 'all';
    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (type !== 'all') {
      query.type = type;
    }

    if (verified !== 'all') {
      query.isVerified = verified === 'true';
    }

    const actions = await Action.find(query)
      .populate('user', 'username firstName lastName email profilePicture')
      .populate('verifiedBy', 'username firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

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
    console.error('Get all actions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify action (admin only)
// @route   PUT /api/admin/actions/:id/verify
// @access  Private/Admin
const verifyAction = async (req, res) => {
  try {
    const { isVerified } = req.body;
    const action = await Action.findById(req.params.id).populate('user');

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    action.isVerified = isVerified;
    action.verifiedBy = isVerified ? req.user.id : null;
    action.verificationDate = isVerified ? new Date() : null;

    await action.save();

    res.json({
      success: true,
      message: `Action ${isVerified ? 'verified' : 'unverified'} successfully`,
      data: action
    });

  } catch (error) {
    console.error('Verify action error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete action (admin only)
// @route   DELETE /api/admin/actions/:id
// @access  Private/Admin
const deleteAction = async (req, res) => {
  try {
    const action = await Action.findById(req.params.id);

    if (!action) {
      return res.status(404).json({
        success: false,
        message: 'Action not found'
      });
    }

    // Update user's total points
    const user = await User.findById(action.user);
    if (user) {
      user.totalPoints = Math.max(0, user.totalPoints - action.points);
      user.updateLevel();
      await user.save();
    }

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

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    // User statistics
    const userStats = await User.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          active: [{ $match: { isActive: true } }, { $count: 'count' }],
          inactive: [{ $match: { isActive: false } }, { $count: 'count' }],
          admins: [{ $match: { isAdmin: true } }, { $count: 'count' }],
          newThisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
              }
            },
            { $count: 'count' }
          ]
        }
      }
    ]);

    // Action statistics
    const actionStats = await Action.aggregate([
      {
        $facet: {
          total: [{ $count: 'count' }],
          verified: [{ $match: { isVerified: true } }, { $count: 'count' }],
          unverified: [{ $match: { isVerified: false } }, { $count: 'count' }],
          thisMonth: [
            {
              $match: {
                createdAt: {
                  $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                }
              }
            },
            { $count: 'count' }
          ],
          byType: [
            {
              $group: {
                _id: '$type',
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ]);

    // Impact statistics
    const impactStats = await Action.aggregate([
      {
        $group: {
          _id: null,
          totalCO2Saved: { $sum: '$impact.co2Saved' },
          totalMoneySaved: { $sum: '$impact.moneySaved' },
          totalWaterSaved: { $sum: '$impact.waterSaved' },
          totalEnergySaved: { $sum: '$impact.energySaved' },
          totalWasteReduced: { $sum: '$impact.wasteReduced' }
        }
      }
    ]);

    // Monthly growth
    const monthlyGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          newUsers: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const formatCount = (arr) => arr[0]?.count || 0;

    res.json({
      success: true,
      data: {
        users: {
          total: formatCount(userStats[0].total),
          active: formatCount(userStats[0].active),
          inactive: formatCount(userStats[0].inactive),
          admins: formatCount(userStats[0].admins),
          newThisMonth: formatCount(userStats[0].newThisMonth)
        },
        actions: {
          total: formatCount(actionStats[0].total),
          verified: formatCount(actionStats[0].verified),
          unverified: formatCount(actionStats[0].unverified),
          thisMonth: formatCount(actionStats[0].thisMonth),
          byType: actionStats[0].byType
        },
        impact: impactStats[0] || {
          totalCO2Saved: 0,
          totalMoneySaved: 0,
          totalWaterSaved: 0,
          totalEnergySaved: 0,
          totalWasteReduced: 0
        },
        monthlyGrowth: monthlyGrowth.reverse()
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  updateUserStatus,
  getAllActions,
  verifyAction,
  deleteAction,
  getDashboardStats
};