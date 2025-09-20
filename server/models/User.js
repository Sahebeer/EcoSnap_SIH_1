const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  profilePicture: {
    type: String,
    default: null
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  level: {
    type: String,
    enum: ['Beginner', 'Eco-Warrior', 'Green Champion', 'Planet Guardian', 'Earth Hero'],
    default: 'Beginner'
  },
  achievements: [{
    name: String,
    description: String,
    icon: String,
    dateEarned: {
      type: Date,
      default: Date.now
    }
  }],
  location: {
    country: String,
    city: String,
    region: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    achievements: {
      type: Boolean,
      default: true
    },
    leaderboard: {
      type: Boolean,
      default: true
    }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
userSchema.index({ totalPoints: -1 });
userSchema.index({ 'location.country': 1, totalPoints: -1 });
userSchema.index({ 'location.region': 1, totalPoints: -1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  // Hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to update user level based on points
userSchema.methods.updateLevel = function() {
  if (this.totalPoints >= 10000) {
    this.level = 'Earth Hero';
  } else if (this.totalPoints >= 5000) {
    this.level = 'Planet Guardian';
  } else if (this.totalPoints >= 2000) {
    this.level = 'Green Champion';
  } else if (this.totalPoints >= 500) {
    this.level = 'Eco-Warrior';
  } else {
    this.level = 'Beginner';
  }
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);