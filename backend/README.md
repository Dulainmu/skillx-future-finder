# SkillX Backend API

A comprehensive Node.js/Express backend API for the SkillX Future Finder platform, providing career discovery, personalized recommendations, and learning management features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Career Management**: Complete CRUD operations for career paths and roadmaps
- **Quiz System**: Personality assessment with intelligent career matching
- **Project Management**: Project submissions, reviews, and XP tracking
- **User Management**: User profiles, progress tracking, and preferences
- **File Upload**: Secure file upload for project submissions
- **Recommendations**: AI-powered career recommendations based on quiz results

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Validation**: Express-validator
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Morgan

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## 🚀 Installation

1. **Clone the repository and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/skillx_db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   CORS_ORIGIN=http://localhost:5173
   ```

4. **Start MongoDB** (if using local instance)
   ```bash
   mongod
   ```

5. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js              # Authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── models/
│   │   ├── User.js              # User model
│   │   ├── Career.js            # Career model
│   │   ├── Quiz.js              # Quiz model
│   │   └── Project.js           # Project model
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── quiz.js              # Quiz routes
│   │   ├── recommendations.js   # Recommendations routes
│   │   ├── users.js             # User management routes
│   │   ├── projects.js          # Project routes
│   │   └── careers.js           # Career routes
│   ├── scripts/
│   │   └── seed.js              # Database seeding
│   └── server.js                # Main server file
├── uploads/                     # File upload directory
├── package.json
├── env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password
- `POST /api/auth/logout` - User logout

### Quiz
- `GET /api/quiz/questions` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get quiz history
- `GET /api/quiz/progress` - Get quiz progress
- `DELETE /api/quiz/clear` - Clear quiz data

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `POST /api/recommendations/calculate` - Calculate recommendations
- `GET /api/recommendations/careers` - Browse all careers
- `GET /api/recommendations/categories` - Get career categories
- `GET /api/recommendations/careers/:id` - Get career details

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/preferences` - Update preferences
- `POST /api/users/start-career` - Start career path
- `DELETE /api/users/career` - Reset career path
- `POST /api/users/xp` - Add XP
- `GET /api/users/progress` - Get progress summary

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/:id/submit` - Submit project
- `GET /api/projects/submissions` - Get user submissions
- `PUT /api/projects/submissions/:id/review` - Review submission (mentor)

### Careers
- `GET /api/careers` - Get all careers
- `GET /api/careers/:id` - Get career details
- `GET /api/careers/:id/roadmap` - Get career roadmap
- `GET /api/careers/categories` - Get categories
- `GET /api/careers/search` - Search careers
- `GET /api/careers/featured` - Get featured careers

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 👥 User Roles

- **student**: Regular users who can take quizzes, get recommendations, and submit projects
- **mentor**: Can review project submissions and provide feedback
- **admin**: Full access to all features including career management

## 📊 Database Models

### User
- Basic info (name, email, password)
- Role-based access control
- Progress tracking (XP, level, completed modules/projects)
- Quiz data and preferences

### Career
- Career information and requirements
- Detailed learning roadmap
- Skills and prerequisites
- Statistics (popularity, completion rate)

### Quiz
- Questions with categories
- User submissions and personality profiles
- Career recommendations

### Project
- Project details and requirements
- User submissions with file uploads
- Review system for mentors

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CORS_ORIGIN=your-frontend-domain
```

### Build and Start
```bash
npm start
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run seed` - Seed database with initial data

### Code Style
- Use ES6+ features
- Follow RESTful API conventions
- Implement proper error handling
- Use async/await for database operations

## 🛡️ Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Express-validator
- **Password Hashing**: bcryptjs
- **JWT**: Secure authentication

## 📝 API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message",
  "details": [] // Validation errors (if any)
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository. 