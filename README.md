# 🌱 EcoImpact - Environmental Impact Tracking Web Application

A comprehensive full-stack web application for tracking and gamifying eco-friendly actions, built with the MERN stack (MongoDB, Express.js, React, Node.js).

![EcoImpact Logo](https://img.shields.io/badge/EcoImpact-🌱-green?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg?style=for-the-badge)

## 🌟 Features

### 🔐 **User Authentication & Security**
- Secure email/username sign-up and login
- JWT-based authentication with token expiration
- Password hashing with bcrypt
- Rate limiting for security
- Account management and password reset

### 📊 **Dashboard & Analytics**
- Personalized dashboard with impact overview
- Real-time eco-friendly points tracking
- Environmental impact statistics (CO2 saved, water saved, etc.)
- Progress charts and visualizations
- Achievement system with badges

### 🎯 **Points & Gamification**
- Comprehensive points system for eco-friendly actions
- 10 different action categories (Recycling, Energy Saving, etc.)
- Automatic impact calculations
- Level progression system (Beginner → Earth Hero)
- Achievement unlocks based on milestones

### 🏆 **Leaderboards & Competition**
- Global leaderboard rankings
- Regional/country-based leaderboards
- Category-specific leaderboards
- Monthly top performers
- User ranking and progress tracking

### 📱 **Action Management**
- Easy action recording with detailed forms
- Photo proof upload capability
- Action verification system
- Filtering and sorting options
- Action history and analytics

### 👤 **User Profiles**
- Comprehensive profile management
- Personal impact showcase
- Achievement galleries
- Profile picture upload
- Notification preferences

### 🛡️ **Admin Panel**
- User management dashboard
- Action verification workflow
- System analytics and metrics
- Content moderation tools
- Admin-only access controls

### 🎨 **Modern UI/UX**
- Material UI design system
- Responsive design for all devices
- Green/earth-friendly color palette
- Smooth animations and transitions
- Intuitive navigation

## 🛠️ Technology Stack

### **Backend**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### **Frontend**
- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Material UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Context API** - State management

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Concurrently** - Run scripts in parallel
- **Nodemon** - Development server

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ecoimpact.git
   cd ecoimpact
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install client and server dependencies**
   ```bash
   npm run install-all
   ```

4. **Environment Setup**

   **Server Environment** (`server/.env`):
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your configuration
   ```

   Required environment variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ecoimpact
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=30d
   CLIENT_URL=http://localhost:3000
   ```

   **Client Environment** (`client/.env`):
   ```bash
   cd client
   cp .env.example .env
   ```

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Database Setup**

   Start MongoDB and seed the database with sample data:
   ```bash
   cd server
   npm run seed
   ```

6. **Start the Application**

   **Development mode** (runs both client and server):
   ```bash
   npm run dev
   ```

   **Or run separately:**
   ```bash
   # Terminal 1 - Backend
   npm run server

   # Terminal 2 - Frontend
   npm run client
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api
   - Health Check: http://localhost:5000/health

## 🎮 Demo Credentials

### Admin Access
- **Email:** admin@ecoimpact.com
- **Password:** Admin123!

### Regular User
- **Email:** sarah@example.com
- **Password:** Password123!

## 📁 Project Structure

```
ecoimpact/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── .env.example
├── server/                # Node.js backend
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── uploads/          # File uploads
│   ├── utils/            # Utility functions
│   ├── server.js         # Entry point
│   ├── package.json
│   └── .env.example
├── package.json          # Root package.json
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `DELETE /api/auth/account` - Delete account

### Actions
- `GET /api/actions` - Get user actions
- `POST /api/actions` - Create new action
- `GET /api/actions/:id` - Get action details
- `PUT /api/actions/:id` - Update action
- `DELETE /api/actions/:id` - Delete action
- `GET /api/actions/impact/stats` - Get impact statistics

### Leaderboard
- `GET /api/leaderboard/global` - Global leaderboard
- `GET /api/leaderboard/regional` - Regional leaderboard
- `GET /api/leaderboard/monthly` - Monthly leaderboard
- `GET /api/leaderboard/category/:type` - Category leaderboard

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - Manage users
- `GET /api/admin/actions` - Manage actions
- `PUT /api/admin/actions/:id/verify` - Verify actions

## 🌱 Action Categories

1. **Recycling** - Plastic, paper, electronics recycling
2. **Energy Saving** - LED bulbs, efficient appliances
3. **Water Conservation** - Water-saving devices, usage reduction
4. **Sustainable Transportation** - Biking, public transport, EVs
5. **Green Purchase** - Organic, eco-friendly products
6. **Waste Reduction** - Reusing materials, minimizing waste
7. **Composting** - Organic waste composting
8. **Tree Planting** - Reforestation efforts
9. **Education/Awareness** - Teaching sustainability
10. **Other** - Custom eco-friendly actions

## 🏆 Achievement System

- **First Century** - 100 points
- **Eco Warrior** - 500 points
- **Green Champion** - 1,000 points
- **Planet Guardian** - 5,000 points
- **Earth Hero** - 10,000+ points

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client
npm run build

# Start production server
cd ../server
npm start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use secure MongoDB connection string
- Generate strong JWT secret
- Configure proper CORS origins
- Set up file upload storage (AWS S3 recommended)

### Recommended Platforms
- **Backend:** Heroku, DigitalOcean, AWS
- **Database:** MongoDB Atlas
- **Frontend:** Vercel, Netlify
- **Storage:** AWS S3, Cloudinary

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 TODO / Future Enhancements

- [ ] Complete registration form implementation
- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Social login (Google, Facebook)
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] Data export features
- [ ] Advanced analytics
- [ ] Team/organization features
- [ ] Carbon footprint calculator
- [ ] Integration with IoT devices
- [ ] Multi-language support

## 🐛 Known Issues

- Registration page is placeholder (login with demo credentials)
- File upload currently stores locally (production should use cloud storage)
- Real-time notifications not implemented yet

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email your-email@example.com or create an issue on GitHub.

## 🙏 Acknowledgments

- Icons by Material UI Icons
- Design inspiration from environmental organizations
- Sample data for demonstration purposes
- Open source community for amazing tools and libraries

---

**Built with ❤️ for the planet 🌍**

*Let's make environmental impact tracking fun and engaging!*
