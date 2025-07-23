const mongoose = require('mongoose');

const QuizSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow anonymous submissions
  },
  sessionId: {
    type: String,
    required: true // For tracking anonymous users
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: {
    type: Map,
    of: Number,
    required: true
  },
  personalityProfile: {
    analytical: { type: Number, default: 0 },
    creative: { type: Number, default: 0 },
    people_oriented: { type: Number, default: 0 },
    detail_oriented: { type: Number, default: 0 },
    leadership: { type: Number, default: 0 },
    technical: { type: Number, default: 0 }
  },
  recommendations: [{
    career: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Career'
    },
    matchPercentage: Number,
    reasons: [String]
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient querying
QuizSubmissionSchema.index({ user: 1, completedAt: -1 });
QuizSubmissionSchema.index({ sessionId: 1, completedAt: -1 });

module.exports = mongoose.model('QuizSubmission', QuizSubmissionSchema);