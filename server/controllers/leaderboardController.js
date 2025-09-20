const User = require('../models/User');
const Action = require('../models/Action');

// @desc    Get global leaderboard
// @route   GET /api/leaderboard/global
// @access  Private
const getGlobalLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const users = await User.find({ isActive: true })
      .select('username firstName lastName profilePicture totalPoints level location joinDate')
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({ isActive: true });

    // Get current user's rank
    let currentUserRank = null;
    if (req.user) {
      const higherRankedUsers = await User.countDocuments({
        isActive: true,
        totalPoints: { $gt: req.user.totalPoints }
      });
      currentUserRank = higherRankedUsers + 1;
    }

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: skip + index + 1
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        currentUserRank,
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
    console.error('Get global leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get regional leaderboard
// @route   GET /api/leaderboard/regional
// @access  Private
const getRegionalLeaderboard = async (req, res) => {
  try {
    const { country, region } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Build query based on location
    let locationQuery = { isActive: true };
    
    if (country) {
      locationQuery['location.country'] = country;
    }
    
    if (region) {
      locationQuery['location.region'] = region;
    }

    // If no location specified, use current user's location
    if (!country && !region && req.user.location) {
      locationQuery['location.country'] = req.user.location.country;
    }

    const users = await User.find(locationQuery)
      .select('username firstName lastName profilePicture totalPoints level location joinDate')
      .sort({ totalPoints: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(locationQuery);

    // Get current user's regional rank
    let currentUserRank = null;
    if (req.user) {
      const higherRankedUsers = await User.countDocuments({
        ...locationQuery,
        totalPoints: { $gt: req.user.totalPoints }
      });
      currentUserRank = higherRankedUsers + 1;
    }

    // Add rank to each user
    const leaderboard = users.map((user, index) => ({
      ...user.toObject(),
      rank: skip + index + 1
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        currentUserRank,
        location: { country, region },
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
    console.error('Get regional leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get leaderboard by category
// @route   GET /api/leaderboard/category/:type
// @access  Private
const getCategoryLeaderboard = async (req, res) => {
  try {
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    // Get users with most actions in this category
    const pipeline = [
      { $match: { type: type } },
      {
        $group: {
          _id: '$user',
          totalActions: { $sum: 1 },
          totalPoints: { $sum: '$points' },
          totalImpact: {
            $sum: {
              $add: [
                '$impact.co2Saved',
                '$impact.waterSaved',
                '$impact.energySaved',
                '$impact.wasteReduced'
              ]
            }
          }
        }
      },
      { $sort: { totalPoints: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.isActive': true
        }
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: '$user._id',
            username: '$user.username',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            profilePicture: '$user.profilePicture',
            level: '$user.level',
            location: '$user.location'
          },
          categoryStats: {
            totalActions: '$totalActions',
            totalPoints: '$totalPoints',
            totalImpact: '$totalImpact'
          }
        }
      }
    ];

    const results = await Action.aggregate(pipeline);

    // Add rank to each user
    const leaderboard = results.map((item, index) => ({
      ...item,
      rank: (page - 1) * limit + index + 1
    }));

    // Get total count for pagination
    const totalPipeline = [
      { $match: { type: type } },
      {
        $group: {
          _id: '$user'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.isActive': true
        }
      },
      { $count: 'total' }
    ];

    const totalResult = await Action.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        leaderboard,
        category: type,
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
    console.error('Get category leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get top performers this month
// @route   GET /api/leaderboard/monthly
// @access  Private
const getMonthlyLeaderboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const pipeline = [
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: '$user',
          monthlyPoints: { $sum: '$points' },
          monthlyActions: { $sum: 1 },
          monthlyImpact: {
            $sum: {
              $add: [
                '$impact.co2Saved',
                '$impact.waterSaved',
                '$impact.energySaved',
                '$impact.wasteReduced'
              ]
            }
          }
        }
      },
      { $sort: { monthlyPoints: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $match: {
          'user.isActive': true
        }
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: '$user._id',
            username: '$user.username',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            profilePicture: '$user.profilePicture',
            level: '$user.level',
            location: '$user.location'
          },
          monthlyStats: {
            points: '$monthlyPoints',
            actions: '$monthlyActions',
            impact: '$monthlyImpact'
          }
        }
      }
    ];

    const results = await Action.aggregate(pipeline);

    // Add rank to each user
    const leaderboard = results.map((item, index) => ({
      ...item,
      rank: index + 1
    }));

    res.json({
      success: true,
      data: {
        leaderboard,
        month: {
          start: startOfMonth,
          end: endOfMonth,
          name: now.toLocaleString('default', { month: 'long', year: 'numeric' })
        }
      }
    });

  } catch (error) {
    console.error('Get monthly leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get leaderboard statistics
// @route   GET /api/leaderboard/stats
// @access  Private
const getLeaderboardStats = async (req, res) => {
  try {
    // Global stats
    const globalStats = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalPoints: { $sum: '$totalPoints' },
          averagePoints: { $avg: '$totalPoints' }
        }
      }
    ]);

    // Level distribution
    const levelDistribution = await User.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);

    // Country distribution
    const countryDistribution = await User.aggregate([
      { $match: { isActive: true, 'location.country': { $exists: true, $ne: null } } },
      {
        $group: {
          _id: '$location.country',
          count: { $sum: 1 },
          totalPoints: { $sum: '$totalPoints' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        global: globalStats[0] || { totalUsers: 0, totalPoints: 0, averagePoints: 0 },
        levelDistribution,
        topCountries: countryDistribution
      }
    });

  } catch (error) {
    console.error('Get leaderboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getGlobalLeaderboard,
  getRegionalLeaderboard,
  getCategoryLeaderboard,
  getMonthlyLeaderboard,
  getLeaderboardStats
};