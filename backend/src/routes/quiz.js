const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, optionalAuth } = require('../middleware/auth');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

const router = express.Router();

// @desc    Get quiz questions
// @route   GET /api/quiz/questions
// @access  Public
router.get('/questions', async (req, res) => {
  try {
    // Get or create quiz with questions
    let quiz = await Quiz.findOne();
    
    if (!quiz) {
      // Create default quiz with questions
      quiz = await Quiz.create({
        questions: [
          {
            id: 1,
            question: "What motivates you most in a job?",
            category: "motivation"
          },
          {
            id: 2,
            question: "How do you prefer to work with others?",
            category: "teamwork"
          },
          {
            id: 3,
            question: "How important is work-life balance to you?",
            category: "lifestyle"
          },
          {
            id: 4,
            question: "Do you enjoy taking on leadership roles?",
            category: "leadership"
          },
          {
            id: 5,
            question: "How comfortable are you with taking risks?",
            category: "risk-tolerance"
          },
          {
            id: 6,
            question: "Do you prefer working with data and numbers?",
            category: "analytical"
          },
          {
            id: 7,
            question: "How important is creativity in your work?",
            category: "creativity"
          },
          {
            id: 8,
            question: "Do you enjoy helping and mentoring others?",
            category: "helping"
          },
          {
            id: 9,
            question: "How do you handle stressful situations?",
            category: "stress-management"
          },
          {
            id: 10,
            question: "Do you prefer routine or variety in your work?",
            category: "work-style"
          },
          {
            id: 11,
            question: "How important is job security to you?",
            category: "security"
          },
          {
            id: 12,
            question: "Do you enjoy continuous learning and development?",
            category: "growth"
          }
        ]
      });
    }

    const questions = quiz.questions.filter(q => q.active);

    res.json({
      success: true,
      data: {
        questions,
        totalQuestions: questions.length,
        settings: quiz.settings
      }
    });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching quiz questions'
    });
  }
});

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
// @access  Public (but user can be authenticated)
router.post('/submit', [
  body('answers')
    .isArray({ min: 1 })
    .withMessage('Answers must be an array with at least one answer'),
  body('answers.*.questionId')
    .isInt({ min: 1 })
    .withMessage('Question ID must be a positive integer'),
  body('answers.*.score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Score must be between 1 and 5'),
  body('answers.*.category')
    .isIn(['motivation', 'teamwork', 'lifestyle', 'leadership', 'risk-tolerance', 'analytical', 'creativity', 'helping', 'stress-management', 'work-style', 'security', 'growth'])
    .withMessage('Invalid category')
], optionalAuth, async (req, res) => {
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

    const { answers } = req.body;

    // Calculate personality profile
    const personalityProfile = Quiz.calculatePersonalityProfile(answers);

    // Generate career recommendations
    const recommendations = await Quiz.generateRecommendations(personalityProfile, answers);

    // If user is authenticated, save the submission
    if (req.user) {
      const quizSubmission = await Quiz.QuizSubmission.create({
        user: req.user._id,
        answers,
        personalityProfile,
        recommendations
      });

      // Update user's quiz data
      const quizAnswersMap = {};
      answers.forEach(answer => {
        quizAnswersMap[answer.questionId] = answer.score;
      });

      await User.findByIdAndUpdate(req.user._id, {
        quizAnswers: quizAnswersMap,
        quizCompleted: true
      });
    }

    // Get career details for recommendations
    const Career = require('../models/Career');
    const careerDetails = await Career.find({
      id: { $in: recommendations.map(r => r.careerId) }
    });

    // Combine recommendations with career details
    const recommendationsWithDetails = recommendations.map(rec => {
      const career = careerDetails.find(c => c.id === rec.careerId);
      return {
        ...rec,
        career: career ? {
          id: career.id,
          name: career.name,
          description: career.description,
          difficulty: career.difficulty,
          averageSalary: career.averageSalary,
          jobGrowth: career.jobGrowth,
          skills: career.skills,
          totalXp: career.totalXp
        } : null
      };
    });

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        personalityProfile,
        recommendations: recommendationsWithDetails,
        submissionId: req.user ? quizSubmission._id : null
      }
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during quiz submission'
    });
  }
});

// @desc    Get user's quiz history
// @route   GET /api/quiz/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const submissions = await Quiz.QuizSubmission.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        submissions: submissions.map(sub => ({
          id: sub._id,
          completedAt: sub.completedAt,
          personalityProfile: sub.personalityProfile,
          recommendations: sub.recommendations,
          version: sub.version
        }))
      }
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching quiz history'
    });
  }
});

// @desc    Get specific quiz submission
// @route   GET /api/quiz/submission/:id
// @access  Private
router.get('/submission/:id', protect, async (req, res) => {
  try {
    const submission = await Quiz.QuizSubmission.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Quiz submission not found'
      });
    }

    res.json({
      success: true,
      data: {
        submission: {
          id: submission._id,
          answers: submission.answers,
          personalityProfile: submission.personalityProfile,
          recommendations: submission.recommendations,
          completedAt: submission.completedAt,
          version: submission.version
        }
      }
    });
  } catch (error) {
    console.error('Get quiz submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching quiz submission'
    });
  }
});

// @desc    Get user's current quiz progress
// @route   GET /api/quiz/progress
// @access  Private
router.get('/progress', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        quizCompleted: user.quizCompleted,
        quizAnswers: user.quizAnswers,
        totalQuestions: Object.keys(user.quizAnswers || {}).length
      }
    });
  } catch (error) {
    console.error('Get quiz progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching quiz progress'
    });
  }
});

// @desc    Clear user's quiz data
// @route   DELETE /api/quiz/clear
// @access  Private
router.delete('/clear', protect, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      quizAnswers: {},
      quizCompleted: false
    });

    res.json({
      success: true,
      message: 'Quiz data cleared successfully'
    });
  } catch (error) {
    console.error('Clear quiz data error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while clearing quiz data'
    });
  }
});

module.exports = router; 