const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    default: 'student'
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  phone: {
    type: String,
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  // Career tracking
  currentCareer: {
    type: String,
    default: null
  },
  hasStartedCareer: {
    type: Boolean,
    default: false
  },
  // Progress tracking
  totalXp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  // Quiz data
  quizAnswers: {
    type: Map,
    of: Number,
    default: {}
  },
  quizCompleted: {
    type: Boolean,
    default: false
  },
  // Learning progress
  completedModules: [{
    moduleId: String,
    completedAt: {
      type: Date,
      default: Date.now
    }
  }],
  completedProjects: [{
    projectId: String,
    completedAt: {
      type: Date,
      default: Date.now
    },
    score: Number,
    feedback: String
  }],
  // Preferences
  preferences: {
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      achievements: {
        type: Boolean,
        default: true
      },
      weeklyReports: {
        type: Boolean,
        default: true
      }
    },
    privacy: {
      publicProfile: {
        type: Boolean,
        default: false
      },
      showAchievements: {
        type: Boolean,
        default: true
      }
    }
  },
  // Timestamps
  lastActive: {
    type: Date,
    default: Date.now
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Calculate user level based on XP
UserSchema.methods.calculateLevel = function() {
  // Simple level calculation: every 500 XP = 1 level
  return Math.floor(this.totalXp / 500) + 1;
};

// Add XP and update level
UserSchema.methods.addXp = function(amount) {
  this.totalXp += amount;
  this.level = this.calculateLevel();
  return this.save();
};

// Get user progress summary
UserSchema.methods.getProgressSummary = function() {
  return {
    totalXp: this.totalXp,
    level: this.level,
    completedModules: this.completedModules.length,
    completedProjects: this.completedProjects.length,
    currentCareer: this.currentCareer,
    hasStartedCareer: this.hasStartedCareer
  };
};

module.exports = mongoose.model('User', UserSchema); 