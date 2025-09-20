const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Action = require('../models/Action');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@ecoimpact.com',
    password: 'Admin123!',
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true,
    totalPoints: 5000,
    location: {
      country: 'United States',
      city: 'San Francisco',
      region: 'California'
    }
  },
  {
    username: 'ecowarrior1',
    email: 'sahebjot@example.com',
    password: 'Password123!',
    firstName: 'Sahebjot',
    lastName: 'Singh',
    totalPoints: 2450,
    location: {
      country: 'India',
      city: 'Mumbai',
      region: 'Maharashtra'
    }
  },
  {
    username: 'planetguardian',
    email: 'amish@example.com',
    password: 'Password123!',
    firstName: 'Amish',
    lastName: 'Patel',
    totalPoints: 3200,
    location: {
      country: 'India',
      city: 'Delhi',
      region: 'Delhi'
    }
  },
  {
    username: 'greenchampion',
    email: 'krish@example.com',
    password: 'Password123!',
    firstName: 'Krish',
    lastName: 'Sharma',
    totalPoints: 1890,
    location: {
      country: 'India',
      city: 'Bangalore',
      region: 'Karnataka'
    }
  },
  {
    username: 'sustainableSam',
    email: 'afreen@example.com',
    password: 'Password123!',
    firstName: 'Afreen',
    lastName: 'Khan',
    totalPoints: 1250,
    location: {
      country: 'India',
      city: 'Chennai',
      region: 'Tamil Nadu'
    }
  },
  {
    username: 'recycle_king',
    email: 'kishan@example.com',
    password: 'Password123!',
    firstName: 'Kishan',
    lastName: 'Gupta',
    totalPoints: 980,
    location: {
      country: 'India',
      city: 'Kolkata',
      region: 'West Bengal'
    }
  },
  {
    username: 'eco_alice',
    email: 'abhinav@example.com',
    password: 'Password123!',
    firstName: 'Abhinav',
    lastName: 'Verma',
    totalPoints: 750,
    location: {
      country: 'India',
      city: 'Pune',
      region: 'Maharashtra'
    }
  },
  {
    username: 'green_bob',
    email: 'raj@example.com',
    password: 'Password123!',
    firstName: 'Raj',
    lastName: 'Kumar',
    totalPoints: 540,
    location: {
      country: 'India',
      city: 'Hyderabad',
      region: 'Telangana'
    }
  }
];

// Sample actions data (will be populated after users are created)
const getSampleActions = (users) => [
  // Actions for Sarah (ecowarrior1)
  {
    user: users[1]._id,
    type: 'Recycling',
    title: 'Recycled 50 plastic bottles',
    description: 'Collected and properly recycled 50 plastic bottles from my neighborhood cleanup',
    points: 100,
    impact: {
      co2Saved: 25,
      wasteReduced: 50
    },
    tags: ['plastic', 'neighborhood', 'cleanup'],
    isVerified: true
  },
  {
    user: users[1]._id,
    type: 'Sustainable Transportation',
    title: 'Biked to work for a month',
    description: 'Used my bicycle instead of driving to work for 30 consecutive days',
    points: 200,
    impact: {
      co2Saved: 150,
      moneySaved: 60
    },
    tags: ['bike', 'commute', 'health'],
    isVerified: true
  },
  {
    user: users[1]._id,
    type: 'Energy Saving',
    title: 'Installed LED bulbs throughout home',
    description: 'Replaced all incandescent bulbs with energy-efficient LED bulbs',
    points: 150,
    impact: {
      co2Saved: 50,
      energySaved: 200,
      moneySaved: 25
    },
    tags: ['LED', 'energy', 'home'],
    isVerified: true
  },
  
  // Actions for Mike (planetguardian)
  {
    user: users[2]._id,
    type: 'Tree Planting',
    title: 'Planted 10 trees in local park',
    description: 'Volunteered with local environmental group to plant native trees',
    points: 300,
    impact: {
      co2Saved: 200
    },
    tags: ['trees', 'volunteer', 'native'],
    isVerified: true
  },
  {
    user: users[2]._id,
    type: 'Water Conservation',
    title: 'Installed rainwater harvesting system',
    description: 'Set up a 500-gallon rainwater collection system for garden irrigation',
    points: 250,
    impact: {
      waterSaved: 500,
      moneySaved: 30
    },
    tags: ['rainwater', 'garden', 'irrigation'],
    isVerified: true
  },
  {
    user: users[2]._id,
    type: 'Composting',
    title: 'Started home composting bin',
    description: 'Created a composting system for kitchen scraps and yard waste',
    points: 180,
    impact: {
      wasteReduced: 100,
      co2Saved: 30
    },
    tags: ['compost', 'organic', 'waste'],
    isVerified: true
  },
  
  // Actions for Emma (greenchampion)
  {
    user: users[3]._id,
    type: 'Green Purchase',
    title: 'Bought organic produce for 3 months',
    description: 'Exclusively purchased organic, locally-sourced produce',
    points: 120,
    impact: {
      co2Saved: 40
    },
    tags: ['organic', 'local', 'produce'],
    isVerified: true
  },
  {
    user: users[3]._id,
    type: 'Waste Reduction',
    title: 'Zero-waste grocery shopping',
    description: 'Used reusable bags and containers for all grocery shopping',
    points: 90,
    impact: {
      wasteReduced: 30,
      co2Saved: 15
    },
    tags: ['zero-waste', 'reusable', 'grocery'],
    isVerified: false
  },
  {
    user: users[3]._id,
    type: 'Education/Awareness',
    title: 'Organized neighborhood eco-workshop',
    description: 'Taught 20 neighbors about sustainable living practices',
    points: 80,
    tags: ['education', 'workshop', 'community'],
    isVerified: true
  },
  
  // Actions for Sam (sustainableSam)
  {
    user: users[4]._id,
    type: 'Energy Saving',
    title: 'Solar panel installation',
    description: 'Installed 5kW solar panel system on rooftop',
    points: 400,
    impact: {
      co2Saved: 300,
      energySaved: 500,
      moneySaved: 100
    },
    tags: ['solar', 'renewable', 'rooftop'],
    isVerified: true
  },
  {
    user: users[4]._id,
    type: 'Sustainable Transportation',
    title: 'Electric vehicle purchase',
    description: 'Replaced gas car with electric vehicle',
    points: 350,
    impact: {
      co2Saved: 500,
      moneySaved: 80
    },
    tags: ['electric', 'vehicle', 'clean'],
    isVerified: true
  },
  
  // Actions for David (recycle_king)
  {
    user: users[5]._id,
    type: 'Recycling',
    title: 'Electronics recycling drive',
    description: 'Organized community electronics recycling event',
    points: 200,
    impact: {
      wasteReduced: 200,
      co2Saved: 50
    },
    tags: ['electronics', 'community', 'event'],
    isVerified: true
  },
  {
    user: users[5]._id,
    type: 'Recycling',
    title: 'Monthly paper recycling',
    description: 'Consistently recycled all paper waste for 6 months',
    points: 120,
    impact: {
      wasteReduced: 80,
      co2Saved: 20
    },
    tags: ['paper', 'consistent', 'monthly'],
    isVerified: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Action.deleteMany({});

    // Create users
    console.log('Creating sample users...');
    const users = await User.create(sampleUsers);
    console.log(`Created ${users.length} users`);

    // Update user levels based on points
    for (let user of users) {
      user.updateLevel();
      await user.save();
    }

    // Create actions
    console.log('Creating sample actions...');
    const actions = await Action.create(getSampleActions(users));
    console.log(`Created ${actions.length} actions`);

    // Add achievements to users
    console.log('Adding achievements...');
    for (let user of users) {
      if (user.totalPoints >= 100) {
        user.achievements.push({
          name: 'First Century',
          description: 'Earned your first 100 eco points!',
          icon: '🏆'
        });
      }
      if (user.totalPoints >= 500) {
        user.achievements.push({
          name: 'Eco Warrior',
          description: 'Reached 500 eco points - you\'re making a difference!',
          icon: '⚔️'
        });
      }
      if (user.totalPoints >= 1000) {
        user.achievements.push({
          name: 'Green Champion',
          description: 'Amazing! You\'ve earned 1000 eco points!',
          icon: '🏅'
        });
      }
      if (user.totalPoints >= 5000) {
        user.achievements.push({
          name: 'Planet Guardian',
          description: 'Incredible! 5000 eco points - you\'re a true planet guardian!',
          icon: '🌍'
        });
      }
      await user.save();
    }

    console.log('\n🌱 Database seeded successfully!');
    console.log('\nSample Login Credentials:');
    console.log('Admin: admin@ecoimpact.com / Admin123!');
    console.log('User: sahebjot@example.com / Password123!');
    console.log('User: amish@example.com / Password123!');
    console.log('User: krish@example.com / Password123!');
    console.log('User: afreen@example.com / Password123!');
    console.log('User: kishan@example.com / Password123!');
    console.log('User: abhinav@example.com / Password123!');
    console.log('User: raj@example.com / Password123!');
    console.log('\n✨ Ready to test the application!');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };