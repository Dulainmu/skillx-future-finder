const express = require('express');
const { protect, optionalAuth } = require('../middleware/auth');
const Career = require('../models/Career');
const User = require('../models/User');

const router = express.Router();

// @desc    Get career recommendations for user
// @route   GET /api/recommendations
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.quizCompleted || !user.quizAnswers || Object.keys(user.quizAnswers).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please complete the quiz first to get personalized recommendations'
      });
    }

    // Convert quiz answers to the format expected by the recommendation algorithm
    const answers = Object.entries(user.quizAnswers).map(([questionId, score]) => ({
      questionId: parseInt(questionId),
      score,
      category: getCategoryForQuestion(parseInt(questionId))
    }));

    // Get all active careers
    const careers = await Career.find({ active: true });

    // Calculate match percentages for each career
    const recommendations = careers.map(career => {
      const matchPercentage = career.calculateMatchPercentage(user.quizAnswers);
      return {
        id: career.id,
        name: career.name,
        description: career.description,
        matchPercentage,
        averageSalary: career.averageSalary,
        jobGrowth: career.jobGrowth,
        difficulty: career.difficulty,
        skills: career.skills,
        roadmap: career.roadmap,
        totalXp: career.totalXp,
        category: career.category
      };
    });

    // Sort by match percentage and return top recommendations
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 6);

    res.json({
      success: true,
      data: {
        recommendations: sortedRecommendations,
        totalCareers: careers.length,
        userProfile: {
          totalXp: user.totalXp,
          level: user.level,
          hasStartedCareer: user.hasStartedCareer,
          currentCareer: user.currentCareer
        }
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching recommendations'
    });
  }
});

// @desc    Get recommendations based on quiz answers (for non-authenticated users)
// @route   POST /api/recommendations/calculate
// @access  Public
router.post('/calculate', async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Quiz answers are required'
      });
    }

    // Convert answers to the format expected by the recommendation algorithm
    const quizAnswersMap = {};
    answers.forEach(answer => {
      quizAnswersMap[answer.questionId] = answer.score;
    });

    // Get all active careers
    const careers = await Career.find({ active: true });

    // Calculate match percentages for each career
    const recommendations = careers.map(career => {
      const matchPercentage = career.calculateMatchPercentage(quizAnswersMap);
      return {
        id: career.id,
        name: career.name,
        description: career.description,
        matchPercentage,
        averageSalary: career.averageSalary,
        jobGrowth: career.jobGrowth,
        difficulty: career.difficulty,
        skills: career.skills,
        roadmap: career.roadmap,
        totalXp: career.totalXp,
        category: career.category
      };
    });

    // Sort by match percentage and return top recommendations
    const sortedRecommendations = recommendations
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 6);

    res.json({
      success: true,
      data: {
        recommendations: sortedRecommendations,
        totalCareers: careers.length
      }
    });
  } catch (error) {
    console.error('Calculate recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while calculating recommendations'
    });
  }
});

// @desc    Get all careers (for browsing)
// @route   GET /api/recommendations/careers
// @access  Public
router.get('/careers', async (req, res) => {
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
          featured: career.featured
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

// @desc    Get career categories
// @route   GET /api/recommendations/categories
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

// @desc    Get career by ID
// @route   GET /api/recommendations/careers/:id
// @access  Public
router.get('/careers/:id', async (req, res) => {
  try {
    const career = await Career.findOne({ id: req.params.id, active: true });

    if (!career) {
      return res.status(404).json({
        success: false,
        error: 'Career not found'
      });
    }

    // If user is authenticated, calculate their match percentage
    let matchPercentage = null;
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user.quizCompleted && user.quizAnswers) {
        matchPercentage = career.calculateMatchPercentage(user.quizAnswers);
      }
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
        },
        matchPercentage
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

// Helper function to get category for a question ID
function getCategoryForQuestion(questionId) {
  const questionCategories = {
    1: 'motivation',
    2: 'teamwork',
    3: 'lifestyle',
    4: 'leadership',
    5: 'risk-tolerance',
    6: 'analytical',
    7: 'creativity',
    8: 'helping',
    9: 'stress-management',
    10: 'work-style',
    11: 'security',
    12: 'growth'
  };
  return questionCategories[questionId] || 'general';
}

module.exports = router; 