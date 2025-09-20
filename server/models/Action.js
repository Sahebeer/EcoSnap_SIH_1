const mongoose = require('mongoose');

const actionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Action type is required'],
    enum: [
      'Recycling',
      'Energy Saving',
      'Water Conservation',
      'Sustainable Transportation',
      'Green Purchase',
      'Waste Reduction',
      'Composting',
      'Tree Planting',
      'Education/Awareness',
      'Other'
    ]
  },
  title: {
    type: String,
    required: [true, 'Action title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Action description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  points: {
    type: Number,
    required: true,
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000 per action']
  },
  impact: {
    co2Saved: {
      type: Number,
      default: 0,
      min: 0 // kg of CO2 saved
    },
    moneySaved: {
      type: Number,
      default: 0,
      min: 0 // dollars saved
    },
    waterSaved: {
      type: Number,
      default: 0,
      min: 0 // liters of water saved
    },
    energySaved: {
      type: Number,
      default: 0,
      min: 0 // kWh saved
    },
    wasteReduced: {
      type: Number,
      default: 0,
      min: 0 // kg of waste reduced
    }
  },
  proofImage: {
    type: String,
    default: null
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  verificationDate: {
    type: Date,
    default: null
  },
  location: {
    type: String,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
actionSchema.index({ user: 1, date: -1 });
actionSchema.index({ type: 1, date: -1 });
actionSchema.index({ points: -1 });
actionSchema.index({ date: -1 });

// Static method to get predefined action types with default points
actionSchema.statics.getActionTypes = function() {
  return {
    'Recycling': {
      basePoints: 50,
      description: 'Recycling items like plastic, paper, glass, or electronics',
      impactMultipliers: {
        co2Saved: 0.5, // per item recycled
        wasteReduced: 1
      }
    },
    'Energy Saving': {
      basePoints: 75,
      description: 'Using energy-efficient appliances, LED bulbs, or reducing energy consumption',
      impactMultipliers: {
        co2Saved: 2,
        energySaved: 1,
        moneySaved: 0.1
      }
    },
    'Water Conservation': {
      basePoints: 60,
      description: 'Installing water-saving devices, fixing leaks, or reducing water usage',
      impactMultipliers: {
        waterSaved: 1,
        moneySaved: 0.005
      }
    },
    'Sustainable Transportation': {
      basePoints: 100,
      description: 'Walking, biking, public transport, carpooling, or electric vehicles',
      impactMultipliers: {
        co2Saved: 5,
        moneySaved: 0.2
      }
    },
    'Green Purchase': {
      basePoints: 80,
      description: 'Buying eco-friendly, organic, or locally sourced products',
      impactMultipliers: {
        co2Saved: 1
      }
    },
    'Waste Reduction': {
      basePoints: 70,
      description: 'Reducing single-use items, reusing materials, or minimizing waste',
      impactMultipliers: {
        wasteReduced: 1,
        co2Saved: 0.3
      }
    },
    'Composting': {
      basePoints: 90,
      description: 'Composting organic waste to reduce landfill impact',
      impactMultipliers: {
        wasteReduced: 2,
        co2Saved: 1
      }
    },
    'Tree Planting': {
      basePoints: 200,
      description: 'Planting trees or supporting reforestation efforts',
      impactMultipliers: {
        co2Saved: 20 // per tree planted (annual CO2 absorption)
      }
    },
    'Education/Awareness': {
      basePoints: 40,
      description: 'Teaching others about sustainability or participating in eco-education',
      impactMultipliers: {}
    },
    'Other': {
      basePoints: 50,
      description: 'Other eco-friendly actions not covered in the main categories',
      impactMultipliers: {}
    }
  };
};

// Method to calculate impact based on action type and quantity
actionSchema.methods.calculateImpact = function(quantity = 1) {
  const actionTypes = this.constructor.getActionTypes();
  const actionType = actionTypes[this.type];
  
  if (actionType && actionType.impactMultipliers) {
    const multipliers = actionType.impactMultipliers;
    
    this.impact.co2Saved = (multipliers.co2Saved || 0) * quantity;
    this.impact.moneySaved = (multipliers.moneySaved || 0) * quantity;
    this.impact.waterSaved = (multipliers.waterSaved || 0) * quantity;
    this.impact.energySaved = (multipliers.energySaved || 0) * quantity;
    this.impact.wasteReduced = (multipliers.wasteReduced || 0) * quantity;
  }
};

module.exports = mongoose.model('Action', actionSchema);