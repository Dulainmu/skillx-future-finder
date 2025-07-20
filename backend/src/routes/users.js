const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          phone: user.phone,
          totalXp: user.totalXp,
          level: user.level,
          hasStartedCareer: user.hasStartedCareer,
          currentCareer: user.currentCareer,
          quizCompleted: user.quizCompleted,
          completedModules: user.completedModules,
          completedProjects: user.completedProjects,
          preferences: user.preferences,
          lastActive: user.lastActive,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching profile'
    });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot be more than 500 characters'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot be more than 100 characters'),
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot be more than 20 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, bio, location, phone } = req.body;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio, location, phone },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          phone: user.phone,
          totalXp: user.totalXp,
          level: user.level,
          hasStartedCareer: user.hasStartedCareer,
          currentCareer: user.currentCareer
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during profile update'
    });
  }
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', protect, [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('Email notifications must be a boolean'),
  body('notifications.achievements')
    .optional()
    .isBoolean()
    .withMessage('Achievement notifications must be a boolean'),
  body('notifications.weeklyReports')
    .optional()
    .isBoolean()
    .withMessage('Weekly reports must be a boolean'),
  body('privacy.publicProfile')
    .optional()
    .isBoolean()
    .withMessage('Public profile must be a boolean'),
  body('privacy.showAchievements')
    .optional()
    .isBoolean()
    .withMessage('Show achievements must be a boolean')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { notifications, privacy } = req.body;

    // Update user preferences
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: { notifications, privacy } },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during preferences update'
    });
  }
});

// @desc    Start a career path
// @route   POST /api/users/start-career
// @access  Private
router.post('/start-career', protect, [
  body('careerId')
    .notEmpty()
    .withMessage('Career ID is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { careerId } = req.body;

    // Verify career exists
    const Career = require('../models/Career');
    const career = await Career.findOne({ id: careerId, active: true });
    
    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        currentCareer: careerId,
        hasStartedCareer: true
      },
      { new: true }
    );

    res.json({
      success: true,
      message: `Started career path: ${career.name}`,
      data: {
        user: {
          id: user._id,
          currentCareer: user.currentCareer,
          hasStartedCareer: user.hasStartedCareer,
          totalXp: user.totalXp,
          level: user.level
        },
        career: {
          id: career.id,
          name: career.name,
          description: career.description,
          totalXp: career.totalXp
        }
      }
    });
  } catch (error) {
    console.error('Start career error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while starting career'
    });
  }
});

// @desc    Reset career path
// @route   DELETE /api/users/career
// @access  Private
router.delete('/career', protect, async (req, res) => {
  try {
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        currentCareer: null,
        hasStartedCareer: false
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Career path reset successfully',
      data: {
        user: {
          id: user._id,
          currentCareer: user.currentCareer,
          hasStartedCareer: user.hasStartedCareer
        }
      }
    });
  } catch (error) {
    console.error('Reset career error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while resetting career'
    });
  }
});

// @desc    Add XP to user
// @route   POST /api/users/xp
// @access  Private
router.post('/xp', protect, [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('XP amount must be a positive integer'),
  body('reason')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Reason cannot be more than 100 characters')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { amount, reason } = req.body;

    // Add XP to user
    const user = await User.findById(req.user._id);
    await user.addXp(amount);

    res.json({
      success: true,
      message: `Earned ${amount} XP${reason ? ` for ${reason}` : ''}`,
      data: {
        user: {
          id: user._id,
          totalXp: user.totalXp,
          level: user.level
        }
      }
    });
  } catch (error) {
    console.error('Add XP error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while adding XP'
    });
  }
});

// @desc    Get user progress summary
// @route   GET /api/users/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const progressSummary = user.getProgressSummary();

    res.json({
      success: true,
      data: {
        progress: progressSummary,
        achievements: {
          totalXp: user.totalXp >= 1000,
          level5: user.level >= 5,
          firstProject: user.completedProjects.length >= 1,
          quizMaster: user.quizCompleted
        }
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching progress'
    });
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { 
      role, 
      page = 1, 
      limit = 20,
      search 
    } = req.query;

    // Build query
    let query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          totalXp: user.totalXp,
          level: user.level,
          hasStartedCareer: user.hasStartedCareer,
          currentCareer: user.currentCareer,
          lastActive: user.lastActive,
          createdAt: user.createdAt
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalUsers: total,
          hasNextPage: skip + users.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users'
    });
  }
});

// @desc    Get user by ID (admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          phone: user.phone,
          totalXp: user.totalXp,
          level: user.level,
          hasStartedCareer: user.hasStartedCareer,
          currentCareer: user.currentCareer,
          quizCompleted: user.quizCompleted,
          completedModules: user.completedModules,
          completedProjects: user.completedProjects,
          preferences: user.preferences,
          lastActive: user.lastActive,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user'
    });
  }
});

module.exports = router; 