const mongoose = require('mongoose');

const ProjectSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String
  }],
  githubUrl: String,
  demoUrl: String,
  status: {
    type: String,
    enum: ['submitted', 'under-review', 'approved', 'rejected', 'needs-revision'],
    default: 'submitted'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    maxlength: [2000, 'Feedback cannot be more than 2000 characters']
  },
  mentorNotes: {
    type: String,
    maxlength: [1000, 'Mentor notes cannot be more than 1000 characters']
  },
  xpAwarded: {
    type: Number,
    default: 0
  },
  // Revision tracking
  revisionRequested: {
    type: Boolean,
    default: false
  },
  revisionNotes: String,
  resubmittedAt: Date,
  // Quality metrics
  qualityMetrics: {
    codeQuality: {
      type: Number,
      min: 1,
      max: 5
    },
    documentation: {
      type: Number,
      min: 1,
      max: 5
    },
    creativity: {
      type: Number,
      min: 1,
      max: 5
    },
    problemSolving: {
      type: Number,
      min: 1,
      max: 5
    }
  }
}, {
  timestamps: true
});

const ProjectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  careerId: {
    type: String,
    required: true
  },
  moduleId: {
    type: String,
    required: true
  },
  // Project details
  brief: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  deliverables: [{
    type: String,
    required: true
  }],
  // Learning objectives
  learningObjectives: [{
    type: String,
    required: true
  }],
  // Resources and hints
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['documentation', 'video', 'article', 'tutorial']
    }
  }],
  hints: [String],
  // Project statistics
  submissions: [ProjectSubmissionSchema],
  averageScore: {
    type: Number,
    default: 0
  },
  completionRate: {
    type: Number,
    default: 0
  },
  averageCompletionTime: {
    type: Number, // in days
    default: 0
  },
  // Project status
  active: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  // Prerequisites
  prerequisites: [{
    type: String
  }],
  // Tags for search
  tags: [String]
}, {
  timestamps: true
});

// Index for search functionality
ProjectSchema.index({
  title: 'text',
  description: 'text',
  skills: 'text',
  tags: 'text'
});

// Virtual for submission count
ProjectSchema.virtual('submissionCount').get(function() {
  return this.submissions.length;
});

// Virtual for active submissions
ProjectSchema.virtual('activeSubmissions').get(function() {
  return this.submissions.filter(sub => 
    ['submitted', 'under-review'].includes(sub.status)
  );
});

// Method to calculate average score
ProjectSchema.methods.calculateAverageScore = function() {
  const scoredSubmissions = this.submissions.filter(sub => sub.score !== undefined);
  if (scoredSubmissions.length === 0) return 0;
  
  const totalScore = scoredSubmissions.reduce((sum, sub) => sum + sub.score, 0);
  return Math.round(totalScore / scoredSubmissions.length);
};

// Method to calculate completion rate
ProjectSchema.methods.calculateCompletionRate = function() {
  if (this.submissions.length === 0) return 0;
  
  const completedSubmissions = this.submissions.filter(sub => 
    ['approved'].includes(sub.status)
  );
  
  return Math.round((completedSubmissions.length / this.submissions.length) * 100);
};

// Static method to get projects by career
ProjectSchema.statics.getByCareer = function(careerId) {
  return this.find({ careerId, active: true }).sort({ difficulty: 1 });
};

// Static method to get projects by difficulty
ProjectSchema.statics.getByDifficulty = function(difficulty) {
  return this.find({ difficulty, active: true }).sort({ title: 1 });
};

// Static method to search projects
ProjectSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { active: true },
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { skills: { $in: [new RegExp(query, 'i')] } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ featured: -1, title: 1 });
};

// Pre-save middleware to update statistics
ProjectSchema.pre('save', function(next) {
  if (this.submissions && this.submissions.length > 0) {
    this.averageScore = this.calculateAverageScore();
    this.completionRate = this.calculateCompletionRate();
  }
  next();
});

module.exports = mongoose.model('Project', ProjectSchema); 