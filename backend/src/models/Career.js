const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  id: {
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
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    required: true
  },
  estimatedTime: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  xpReward: {
    type: Number,
    required: true
  },
  brief: String,
  requirements: [String],
  deliverables: [String]
});

const RoadmapStepSchema = new mongoose.Schema({
  id: {
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
  skills: [{
    type: String
  }],
  projects: [ProjectSchema],
  estimatedTime: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    required: true
  }
});

const CareerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Design', 'Marketing', 'Business', 'Healthcare', 'Finance', 'Education', 'Other']
  },
  difficulty: {
    type: String,
    enum: ['Beginner-Friendly', 'Intermediate', 'Advanced'],
    required: true
  },
  averageSalary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  jobGrowth: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  roadmap: [{
    type: String,
    required: true
  }],
  detailedRoadmap: [RoadmapStepSchema],
  totalXp: {
    type: Number,
    required: true
  },
  // Career statistics
  popularity: {
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
  // SEO and display
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  // Learning resources
  resources: {
    books: [{
      title: String,
      author: String,
      isbn: String,
      description: String
    }],
    courses: [{
      title: String,
      platform: String,
      url: String,
      duration: String,
      difficulty: String
    }],
    tools: [{
      name: String,
      description: String,
      url: String
    }]
  }
}, {
  timestamps: true
});

// Index for search functionality
CareerSchema.index({
  name: 'text',
  description: 'text',
  skills: 'text',
  tags: 'text'
});

// Virtual for formatted salary
CareerSchema.virtual('formattedSalary').get(function() {
  if (!this.averageSalary.min || !this.averageSalary.max) {
    return null;
  }
  return `$${this.averageSalary.min.toLocaleString()} - $${this.averageSalary.max.toLocaleString()}`;
});

// Method to calculate match percentage based on quiz answers
CareerSchema.methods.calculateMatchPercentage = function(quizAnswers) {
  // This is a simplified matching algorithm
  // In a real application, this would be more sophisticated
  let matchScore = 0;
  const totalQuestions = Object.keys(quizAnswers).length;
  
  // Example matching logic based on career characteristics
  const careerTraits = {
    'data-scientist': { analytical: 5, technical: 5, creative: 3, social: 2 },
    'ux-designer': { analytical: 3, technical: 3, creative: 5, social: 4 },
    'software-engineer': { analytical: 4, technical: 5, creative: 3, social: 2 },
    'digital-marketing': { analytical: 3, technical: 2, creative: 4, social: 5 },
    'cybersecurity-analyst': { analytical: 5, technical: 5, creative: 2, social: 2 },
    'product-manager': { analytical: 4, technical: 3, creative: 4, social: 5 }
  };

  const traits = careerTraits[this.id] || { analytical: 3, technical: 3, creative: 3, social: 3 };
  
  // Calculate match based on quiz answers and career traits
  Object.values(quizAnswers).forEach(answer => {
    matchScore += answer;
  });

  // Normalize to percentage
  const maxPossibleScore = totalQuestions * 5;
  const percentage = Math.round((matchScore / maxPossibleScore) * 100);
  
  // Adjust based on career traits
  const traitAdjustment = Math.round((traits.analytical + traits.technical + traits.creative + traits.social) / 4 * 10);
  
  return Math.min(100, Math.max(0, percentage + traitAdjustment));
};

// Static method to get careers by category
CareerSchema.statics.getByCategory = function(category) {
  return this.find({ category, active: true }).sort({ popularity: -1 });
};

// Static method to search careers
CareerSchema.statics.search = function(query) {
  return this.find({
    $and: [
      { active: true },
      {
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { skills: { $in: [new RegExp(query, 'i')] } },
          { tags: { $in: [new RegExp(query, 'i')] } }
        ]
      }
    ]
  }).sort({ popularity: -1 });
};

module.exports = mongoose.model('Career', CareerSchema); 