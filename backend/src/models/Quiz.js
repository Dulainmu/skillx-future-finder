const mongoose = require('mongoose');

const QuizQuestionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['motivation', 'teamwork', 'lifestyle', 'leadership', 'risk-tolerance', 'analytical', 'creativity', 'helping', 'stress-management', 'work-style', 'security', 'growth']
  },
  weight: {
    type: Number,
    default: 1,
    min: 0,
    max: 2
  },
  active: {
    type: Boolean,
    default: true
  }
});

const QuizSubmissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [{
    questionId: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    category: {
      type: String,
      required: true
    }
  }],
  personalityProfile: {
    motivation: Number,
    teamwork: Number,
    lifestyle: Number,
    leadership: Number,
    riskTolerance: Number,
    analytical: Number,
    creativity: Number,
    helping: Number,
    stressManagement: Number,
    workStyle: Number,
    security: Number,
    growth: Number
  },
  recommendations: [{
    careerId: {
      type: String,
      required: true
    },
    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    reasoning: String
  }],
  completedAt: {
    type: Date,
    default: Date.now
  },
  version: {
    type: String,
    default: '1.0'
  }
});

const QuizSchema = new mongoose.Schema({
  questions: [QuizQuestionSchema],
  activeVersion: {
    type: String,
    default: '1.0'
  },
  settings: {
    minQuestions: {
      type: Number,
      default: 12
    },
    maxQuestions: {
      type: Number,
      default: 12
    },
    timeLimit: {
      type: Number, // in minutes, 0 for no limit
      default: 0
    },
    allowSkipping: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Static method to get active questions
QuizSchema.statics.getActiveQuestions = function() {
  return this.aggregate([
    { $unwind: '$questions' },
    { $match: { 'questions.active': true } },
    { $sort: { 'questions.id': 1 } },
    { $project: { _id: 0, question: '$questions' } }
  ]);
};

// Static method to calculate personality profile
QuizSchema.statics.calculatePersonalityProfile = function(answers) {
  const profile = {
    motivation: 0,
    teamwork: 0,
    lifestyle: 0,
    leadership: 0,
    riskTolerance: 0,
    analytical: 0,
    creativity: 0,
    helping: 0,
    stressManagement: 0,
    workStyle: 0,
    security: 0,
    growth: 0
  };

  const categoryCounts = {};

  answers.forEach(answer => {
    const category = answer.category;
    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }
    categoryCounts[category]++;
    
    // Map category names to profile properties
    const profileKey = category === 'risk-tolerance' ? 'riskTolerance' : 
                      category === 'stress-management' ? 'stressManagement' : 
                      category === 'work-style' ? 'workStyle' : category;
    
    if (profile[profileKey] !== undefined) {
      profile[profileKey] += answer.score;
    }
  });

  // Calculate averages
  Object.keys(profile).forEach(key => {
    const category = key === 'riskTolerance' ? 'risk-tolerance' : 
                    key === 'stressManagement' ? 'stress-management' : 
                    key === 'workStyle' ? 'work-style' : key;
    
    if (categoryCounts[category]) {
      profile[key] = Math.round((profile[key] / categoryCounts[category]) * 10) / 10;
    }
  });

  return profile;
};

// Static method to generate career recommendations
QuizSchema.statics.generateRecommendations = async function(personalityProfile, answers) {
  const Career = require('./Career');
  
  // Get all active careers
  const careers = await Career.find({ active: true });
  
  const recommendations = careers.map(career => {
    const matchPercentage = career.calculateMatchPercentage(
      answers.reduce((acc, answer) => {
        acc[answer.questionId] = answer.score;
        return acc;
      }, {})
    );

    return {
      careerId: career.id,
      matchPercentage,
      reasoning: this.generateReasoning(personalityProfile, career)
    };
  });

  // Sort by match percentage and return top recommendations
  return recommendations
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 6); // Return top 6 recommendations
};

// Static method to generate reasoning for recommendations
QuizSchema.statics.generateReasoning = function(profile, career) {
  const reasons = [];
  
  // Analyze personality traits against career requirements
  if (career.id === 'data-scientist') {
    if (profile.analytical > 4) reasons.push('Strong analytical thinking');
    if (profile.creativity > 3) reasons.push('Creative problem-solving skills');
  } else if (career.id === 'ux-designer') {
    if (profile.creativity > 4) reasons.push('High creativity');
    if (profile.helping > 3) reasons.push('User-focused mindset');
  } else if (career.id === 'software-engineer') {
    if (profile.analytical > 3) reasons.push('Logical thinking');
    if (profile.workStyle > 3) reasons.push('Structured approach to work');
  } else if (career.id === 'digital-marketing') {
    if (profile.creativity > 3) reasons.push('Creative thinking');
    if (profile.teamwork > 3) reasons.push('Collaborative nature');
  } else if (career.id === 'cybersecurity-analyst') {
    if (profile.analytical > 4) reasons.push('Strong analytical skills');
    if (profile.security > 3) reasons.push('Security-conscious mindset');
  } else if (career.id === 'product-manager') {
    if (profile.leadership > 3) reasons.push('Leadership potential');
    if (profile.teamwork > 3) reasons.push('Team collaboration skills');
  }

  return reasons.length > 0 ? reasons.join(', ') : 'Good overall match based on your responses';
};

module.exports = mongoose.model('Quiz', QuizSchema);
module.exports.QuizSubmission = mongoose.model('QuizSubmission', QuizSubmissionSchema); 