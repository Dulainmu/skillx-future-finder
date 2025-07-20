const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const Career = require('../models/Career');

const router = express.Router();

// @desc    Get all careers
// @route   GET /api/careers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      difficulty, 
      search, 
      page = 1, 
      limit = 12,
      sortBy = 'popularity',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { active: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const careers = await Career.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Career.countDocuments(query);

    res.json({
      success: true,
      data: {
        careers: careers.map(career => ({
          id: career.id,
          name: career.name,
          description: career.description,
          category: career.category,
          difficulty: career.difficulty,
          averageSalary: career.averageSalary,
          jobGrowth: career.jobGrowth,
          skills: career.skills,
          totalXp: career.totalXp,
          popularity: career.popularity,
          completionRate: career.completionRate,
          featured: career.featured,
          tags: career.tags
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalCareers: total,
          hasNextPage: skip + careers.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get careers error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching careers'
    });
  }
});

// @desc    Get career by ID
// @route   GET /api/careers/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const career = await Career.findOne({ id: req.params.id, active: true });

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    res.json({
      success: true,
      data: {
        career: {
          id: career.id,
          name: career.name,
          description: career.description,
          category: career.category,
          difficulty: career.difficulty,
          averageSalary: career.averageSalary,
          jobGrowth: career.jobGrowth,
          skills: career.skills,
          roadmap: career.roadmap,
          detailedRoadmap: career.detailedRoadmap,
          totalXp: career.totalXp,
          popularity: career.popularity,
          completionRate: career.completionRate,
          averageCompletionTime: career.averageCompletionTime,
          resources: career.resources,
          tags: career.tags,
          featured: career.featured
        }
      }
    });
  } catch (error) {
    console.error('Get career error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching career'
    });
  }
});

// @desc    Get career roadmap
// @route   GET /api/careers/:id/roadmap
// @access  Public
router.get('/:id/roadmap', async (req, res) => {
  try {
    const career = await Career.findOne({ id: req.params.id, active: true });

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    res.json({
      success: true,
      data: {
        roadmap: career.detailedRoadmap,
        totalSteps: career.detailedRoadmap.length,
        totalXp: career.totalXp
      }
    });
  } catch (error) {
    console.error('Get roadmap error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching roadmap'
    });
  }
});

// @desc    Get career categories
// @route   GET /api/careers/categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    const categories = await Career.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          careers: {
            $push: {
              id: '$id',
              name: '$name',
              difficulty: '$difficulty'
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        categories: categories.map(cat => ({
          name: cat._id,
          count: cat.count,
          careers: cat.careers.slice(0, 5) // Show first 5 careers per category
        }))
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching categories'
    });
  }
});

// @desc    Search careers
// @route   GET /api/careers/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const careers = await Career.search(q).limit(parseInt(limit));

    res.json({
      success: true,
      data: {
        careers: careers.map(career => ({
          id: career.id,
          name: career.name,
          description: career.description,
          category: career.category,
          difficulty: career.difficulty,
          skills: career.skills,
          totalXp: career.totalXp
        }))
      }
    });
  } catch (error) {
    console.error('Search careers error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while searching careers'
    });
  }
});

// @desc    Get featured careers
// @route   GET /api/careers/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const careers = await Career.find({ featured: true, active: true })
      .sort({ popularity: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        careers: careers.map(career => ({
          id: career.id,
          name: career.name,
          description: career.description,
          category: career.category,
          difficulty: career.difficulty,
          averageSalary: career.averageSalary,
          jobGrowth: career.jobGrowth,
          skills: career.skills,
          totalXp: career.totalXp,
          popularity: career.popularity
        }))
      }
    });
  } catch (error) {
    console.error('Get featured careers error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching featured careers'
    });
  }
});

// @desc    Create career (admin only)
// @route   POST /api/careers
// @access  Private/Admin
router.post('/', protect, authorize('admin'), [
  body('id')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Career ID must be between 3 and 50 characters'),
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Career name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .isIn(['Technology', 'Design', 'Marketing', 'Business', 'Healthcare', 'Finance', 'Education', 'Other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .isIn(['Beginner-Friendly', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty level'),
  body('jobGrowth')
    .trim()
    .notEmpty()
    .withMessage('Job growth is required'),
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  body('totalXp')
    .isInt({ min: 1 })
    .withMessage('Total XP must be a positive integer')
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

    const {
      id,
      name,
      description,
      category,
      difficulty,
      averageSalary,
      jobGrowth,
      skills,
      roadmap,
      detailedRoadmap,
      totalXp,
      resources,
      tags
    } = req.body;

    // Check if career ID already exists
    const existingCareer = await Career.findOne({ id });
    if (existingCareer) {
      return res.status(400).json({
        success: false,
        error: 'Career with this ID already exists'
      });
    }

    // Create career
    const career = await Career.create({
      id,
      name,
      description,
      category,
      difficulty,
      averageSalary,
      jobGrowth,
      skills,
      roadmap,
      detailedRoadmap,
      totalXp,
      resources,
      tags
    });

    res.status(201).json({
      success: true,
      message: 'Career created successfully',
      data: {
        career: {
          id: career.id,
          name: career.name,
          description: career.description,
          category: career.category,
          difficulty: career.difficulty,
          totalXp: career.totalXp
        }
      }
    });
  } catch (error) {
    console.error('Create career error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating career'
    });
  }
});

// @desc    Update career (admin only)
// @route   PUT /api/careers/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Career name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('category')
    .optional()
    .isIn(['Technology', 'Design', 'Marketing', 'Business', 'Healthcare', 'Finance', 'Education', 'Other'])
    .withMessage('Invalid category'),
  body('difficulty')
    .optional()
    .isIn(['Beginner-Friendly', 'Intermediate', 'Advanced'])
    .withMessage('Invalid difficulty level')
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

    const career = await Career.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    res.json({
      success: true,
      message: 'Career updated successfully',
      data: {
        career: {
          id: career.id,
          name: career.name,
          description: career.description,
          category: career.category,
          difficulty: career.difficulty,
          totalXp: career.totalXp
        }
      }
    });
  } catch (error) {
    console.error('Update career error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating career'
    });
  }
});

// @desc    Delete career (admin only)
// @route   DELETE /api/careers/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const career = await Career.findOneAndUpdate(
      { id: req.params.id },
      { active: false },
      { new: true }
    );

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    res.json({
      success: true,
      message: 'Career deactivated successfully'
    });
  } catch (error) {
    console.error('Delete career error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting career'
    });
  }
});

module.exports = router; 