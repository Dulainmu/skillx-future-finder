const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|zip|rar|txt|js|ts|jsx|tsx|html|css|json/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only specific file types are allowed'));
    }
  }
});

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      careerId, 
      difficulty, 
      search, 
      page = 1, 
      limit = 12,
      sortBy = 'title',
      sortOrder = 'asc'
    } = req.query;

    // Build query
    let query = { active: true };

    if (careerId) {
      query.careerId = careerId;
    }

    if (difficulty && difficulty !== 'All') {
      query.difficulty = difficulty;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
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
    const projects = await Project.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      data: {
        projects: projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          estimatedTime: project.estimatedTime,
          xpReward: project.xpReward,
          skills: project.skills,
          careerId: project.careerId,
          moduleId: project.moduleId,
          averageScore: project.averageScore,
          completionRate: project.completionRate,
          featured: project.featured,
          tags: project.tags
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalProjects: total,
          hasNextPage: skip + projects.length < total,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching projects'
    });
  }
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id, active: true });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: {
        project: {
          id: project.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          estimatedTime: project.estimatedTime,
          xpReward: project.xpReward,
          skills: project.skills,
          careerId: project.careerId,
          moduleId: project.moduleId,
          brief: project.brief,
          requirements: project.requirements,
          deliverables: project.deliverables,
          learningObjectives: project.learningObjectives,
          resources: project.resources,
          hints: project.hints,
          averageScore: project.averageScore,
          completionRate: project.completionRate,
          averageCompletionTime: project.averageCompletionTime,
          prerequisites: project.prerequisites,
          tags: project.tags,
          featured: project.featured
        }
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching project'
    });
  }
});

// @desc    Submit project
// @route   POST /api/projects/:id/submit
// @access  Private
router.post('/:id/submit', protect, upload.array('files', 5), [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('githubUrl')
    .optional()
    .isURL()
    .withMessage('GitHub URL must be a valid URL'),
  body('demoUrl')
    .optional()
    .isURL()
    .withMessage('Demo URL must be a valid URL')
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

    const projectId = req.params.id;
    const { title, description, githubUrl, demoUrl } = req.body;

    // Check if project exists
    const project = await Project.findOne({ id: projectId, active: true });
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check if user has already submitted this project
    const existingSubmission = project.submissions.find(
      sub => sub.student.toString() === req.user._id.toString()
    );

    if (existingSubmission) {
      return res.status(400).json({
        success: false,
        error: 'You have already submitted this project'
      });
    }

    // Process uploaded files
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype
    })) : [];

    // Create submission
    const submission = {
      student: req.user._id,
      projectId: projectId,
      title,
      description,
      files,
      githubUrl,
      demoUrl,
      status: 'submitted',
      submittedAt: new Date()
    };

    // Add submission to project
    project.submissions.push(submission);
    await project.save();

    res.status(201).json({
      success: true,
      message: 'Project submitted successfully',
      data: {
        submission: {
          id: submission._id,
          title: submission.title,
          status: submission.status,
          submittedAt: submission.submittedAt
        }
      }
    });
  } catch (error) {
    console.error('Submit project error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while submitting project'
    });
  }
});

// @desc    Get user's project submissions
// @route   GET /api/projects/submissions
// @access  Private
router.get('/submissions', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Build query
    let query = { 'submissions.student': req.user._id };

    if (status) {
      query['submissions.status'] = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const projects = await Project.find(query)
      .populate('submissions.student', 'name email')
      .sort({ 'submissions.submittedAt': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Extract submissions for the current user
    const submissions = [];
    projects.forEach(project => {
      const userSubmissions = project.submissions.filter(
        sub => sub.student._id.toString() === req.user._id.toString()
      );
      userSubmissions.forEach(sub => {
        submissions.push({
          id: sub._id,
          projectId: project.id,
          projectTitle: project.title,
          title: sub.title,
          status: sub.status,
          submittedAt: sub.submittedAt,
          reviewedAt: sub.reviewedAt,
          score: sub.score,
          xpAwarded: sub.xpAwarded
        });
      });
    });

    res.json({
      success: true,
      data: {
        submissions: submissions.slice(0, parseInt(limit)),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(submissions.length / parseInt(limit)),
          totalSubmissions: submissions.length,
          hasNextPage: skip + parseInt(limit) < submissions.length,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching submissions'
    });
  }
});

// @desc    Get specific submission
// @route   GET /api/projects/submissions/:id
// @access  Private
router.get('/submissions/:id', protect, async (req, res) => {
  try {
    const project = await Project.findOne({
      'submissions._id': req.params.id,
      'submissions.student': req.user._id
    }).populate('submissions.student', 'name email');

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    const submission = project.submissions.find(
      sub => sub._id.toString() === req.params.id
    );

    res.json({
      success: true,
      data: {
        submission: {
          id: submission._id,
          projectId: project.id,
          projectTitle: project.title,
          title: submission.title,
          description: submission.description,
          files: submission.files,
          githubUrl: submission.githubUrl,
          demoUrl: submission.demoUrl,
          status: submission.status,
          submittedAt: submission.submittedAt,
          reviewedAt: submission.reviewedAt,
          score: submission.score,
          feedback: submission.feedback,
          xpAwarded: submission.xpAwarded,
          qualityMetrics: submission.qualityMetrics
        }
      }
    });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching submission'
    });
  }
});

// @desc    Review project submission (mentor only)
// @route   PUT /api/projects/submissions/:id/review
// @access  Private/Mentor
router.put('/submissions/:id/review', protect, authorize('mentor', 'admin'), [
  body('status')
    .isIn(['approved', 'rejected', 'needs-revision'])
    .withMessage('Status must be approved, rejected, or needs-revision'),
  body('score')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('feedback')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Feedback cannot be more than 2000 characters'),
  body('mentorNotes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mentor notes cannot be more than 1000 characters'),
  body('qualityMetrics.codeQuality')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Code quality must be between 1 and 5'),
  body('qualityMetrics.documentation')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Documentation must be between 1 and 5'),
  body('qualityMetrics.creativity')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Creativity must be between 1 and 5'),
  body('qualityMetrics.problemSolving')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Problem solving must be between 1 and 5')
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

    const { status, score, feedback, mentorNotes, qualityMetrics } = req.body;

    // Find project with submission
    const project = await Project.findOne({
      'submissions._id': req.params.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Find and update submission
    const submission = project.submissions.id(req.params.id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    submission.status = status;
    submission.reviewedBy = req.user._id;
    submission.reviewedAt = new Date();
    submission.score = score;
    submission.feedback = feedback;
    submission.mentorNotes = mentorNotes;
    submission.qualityMetrics = qualityMetrics;

    // Award XP if approved
    if (status === 'approved' && score >= 70) {
      submission.xpAwarded = project.xpReward;
      
      // Add XP to user
      const user = await User.findById(submission.student);
      if (user) {
        await user.addXp(project.xpReward);
      }
    }

    await project.save();

    res.json({
      success: true,
      message: 'Submission reviewed successfully',
      data: {
        submission: {
          id: submission._id,
          status: submission.status,
          score: submission.score,
          xpAwarded: submission.xpAwarded,
          reviewedAt: submission.reviewedAt
        }
      }
    });
  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while reviewing submission'
    });
  }
});

// @desc    Get projects by career
// @route   GET /api/projects/career/:careerId
// @access  Public
router.get('/career/:careerId', async (req, res) => {
  try {
    const projects = await Project.find({
      careerId: req.params.careerId,
      active: true
    }).sort({ difficulty: 1, title: 1 });

    res.json({
      success: true,
      data: {
        projects: projects.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          difficulty: project.difficulty,
          estimatedTime: project.estimatedTime,
          xpReward: project.xpReward,
          skills: project.skills,
          averageScore: project.averageScore,
          completionRate: project.completionRate
        }))
      }
    });
  } catch (error) {
    console.error('Get projects by career error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching projects'
    });
  }
});

module.exports = router; 