# 🚀 Edunova Backend# Edunova Backend



A robust MERN-based backend API for Edunova, powered by Google Gemini AI for intelligent roadmap generation and Perplexity AI for enhanced learning assistance.This is the MERN-based backend API for Edunova, using Google Gemini AI for intelligent roadmap generation.



## ✨ Features## Quick Start



- 🤖 **AI-Powered Services**1. Install dependencies:

  - Google Gemini AI for roadmap generation

  - Perplexity AI for chatbot responses```powershell

  - Intelligent learning path recommendationscd C:\Users\yoges\Desktop\Projects\Edunova\EdunovaBackend

  npm install

- 🔐 **Authentication & Security**```

  - JWT-based authentication

  - Secure password hashing with bcrypt2. Create a `.env` file in `EdunovaBackend` containing:

  - Protected routes with middleware

  ```env

- 📚 **Core Functionality**GEMINI_API_KEY=your_gemini_api_key

  - Personalized learning roadmap generationMONGODB_URI=mongodb://localhost:27017/edunova

  - Interactive chatbot with conversation historyJWT_SECRET=your_jwt_secret

  - Progress tracking with checklistsPORT=3000

  - Placement preparation resources```

  - User management system

3. Run the backend:

- 💾 **Database**

  - MongoDB with Mongoose ODM```powershell

  - Efficient data modelingnpm start

  - Cloud-ready with MongoDB Atlas```



## 🛠️ Tech Stack## Features

- Pure Node.js/Express backend with MongoDB

- **Node.js** - Runtime environment- Google Gemini AI integration for roadmap generation

- **Express.js** - Web framework- Generates structured learning paths with YouTube videos and hands-on projects

- **MongoDB** - NoSQL database- User authentication with JWT

- **Mongoose** - MongoDB ODM- Roadmap history and feedback system

- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Google Gemini AI** - AI-powered features
- **Perplexity AI** - Enhanced chatbot
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Google Gemini API key
- Perplexity API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EdunovaBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edunova?retryWrites=true&w=majority
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_change_in_production
   
   # API Keys
   GEMINI_API_KEY=your_gemini_api_key
   PERPLEXITY_API_KEY=your_perplexity_api_key
   
   # Server Configuration
   PORT=5000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:5000`

## 📦 Available Scripts

- `npm start` - Start the server (production)
- `npm run dev` - Start with nodemon (development)

## 📁 Project Structure

```
EdunovaBackend/
├── config/
│   └── database.js         # MongoDB connection
├── controllers/
│   ├── chatbotController.js    # Chatbot logic
│   ├── checklistController.js  # Checklist management
│   ├── placementController.js  # Placement prep
│   ├── roadmapController.js    # Roadmap generation
│   └── userController.js       # User authentication
├── middleware/
│   ├── auth.js             # JWT authentication
│   └── optionalAuth.js     # Optional auth for mixed routes
├── models/
│   ├── Chat.js            # Chat conversation schema
│   ├── Checklist.js       # Checklist schema
│   ├── Placement.js       # Placement resource schema
│   ├── Roadmap.js         # Roadmap schema
│   └── User.js            # User schema
├── routes/
│   ├── chatbotRoutes.js   # Chatbot endpoints
│   ├── checklistRoutes.js # Checklist endpoints
│   ├── placementRoutes.js # Placement endpoints
│   ├── roadmapRoutes.js   # Roadmap endpoints
│   └── userRoutes.js      # Auth endpoints
├── services/
│   ├── checklistService.js    # Checklist business logic
│   ├── geminiService.js       # Gemini AI integration
│   ├── perplexityService.js   # Perplexity AI integration
│   └── userService.js         # User business logic
├── .env                   # Environment variables (not committed)
├── .gitignore
├── package.json
└── server.js              # Entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/user/signup` - Register new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get user profile (protected)

### Roadmap
- `POST /api/roadmap/generate` - Generate AI roadmap (protected)
- `GET /api/roadmap/history` - Get user's roadmaps (protected)
- `GET /api/roadmap/:id` - Get specific roadmap (protected)
- `POST /api/roadmap/:id/feedback` - Submit roadmap feedback (protected)

### Chatbot
- `POST /api/chatbot/ask` - Ask chatbot a question (optional auth)
- `GET /api/chatbot/history` - Get chat history (protected)

### Checklist
- `POST /api/checklist/generate` - Generate checklist (protected)
- `GET /api/checklist/history` - Get user's checklists (protected)
- `GET /api/checklist/:id` - Get specific checklist (protected)
- `PUT /api/checklist/:id/item/:itemId` - Update checklist item (protected)

### Placement Prep
- `GET /api/placement/resources` - Get placement resources
- `POST /api/placement/resources` - Add resource (protected)

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIza...` |
| `PERPLEXITY_API_KEY` | Perplexity API key | `pplx-...` |
| `PORT` | Server port number | `5000` |

## 🚢 Deployment on Render

### Quick Deploy

1. **Push code to GitHub**

2. **Create Web Service on Render**
   - Go to [Render Dashboard](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your repository
   
3. **Configure Settings**
   - **Name**: `edunovabackend`
   - **Root Directory**: `EdunovaBackend` (if monorepo)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   
4. **Add Environment Variables**
   Add all variables from your `.env` file:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `PERPLEXITY_API_KEY`
   - `PORT` (optional, Render sets this automatically)

5. **Deploy!**
   - Click "Create Web Service"
   - Wait for deployment

### CORS Configuration

Update CORS to allow your frontend URL:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',           // Local development
    'https://your-frontend.onrender.com'  // Production frontend
  ],
  credentials: true,
}));
```

## 🔐 Authentication Flow

1. **Signup**
   - User provides email and password
   - Password is hashed with bcrypt
   - User document created in MongoDB
   - JWT token generated and returned

2. **Login**
   - User provides credentials
   - Password verified with bcrypt
   - JWT token generated and returned

3. **Protected Routes**
   - Client sends JWT in Authorization header
   - Middleware validates token
   - User ID extracted from token
   - Request proceeds if valid

## 🤖 AI Services

### Gemini Service
- Generates structured learning roadmaps
- Creates week-by-week learning plans
- Includes resources and project suggestions

### Perplexity Service
- Powers the chatbot functionality
- Provides intelligent responses
- Maintains conversation context

### Checklist Service
- Generates skill-based checklists
- Organizes learning tasks
- Tracks progress

## 💾 Database Models

### User
- Email, password (hashed)
- Name, profile information
- Created/updated timestamps

### Roadmap
- User reference
- Topic, duration, difficulty
- Structured weekly content
- Resources and projects
- Feedback

### Chat
- User reference (optional)
- Conversation messages
- Timestamps

### Checklist
- User reference
- Skill/topic
- Checklist items with status
- Progress tracking

### Placement
- Title, description
- Category (coding, aptitude, etc.)
- URL, tags
- User reference

## 🔧 Middleware

### auth.js
- Validates JWT tokens
- Extracts user ID
- Protects routes requiring authentication

### optionalAuth.js
- Allows both authenticated and guest access
- Useful for features like chatbot
- Provides user context when available

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas whitelist IPs
- Ensure database user has proper permissions

### API Key Errors
- Verify all API keys in `.env` are valid
- Check API quota/limits
- Ensure proper key permissions

### CORS Errors
- Update `origin` array in server.js
- Include all frontend URLs
- Verify `credentials: true` is set

### Authentication Issues
- Check JWT_SECRET is set
- Verify token format: `Bearer <token>`
- Ensure token hasn't expired

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## 🧪 Testing

Test endpoints using tools like:
- Postman
- Thunder Client (VS Code)
- cURL
- Frontend application

## 📈 Performance

- Efficient database queries with indexing
- Mongoose connection pooling
- Error handling and logging
- Rate limiting (can be added)

## 🔒 Security Best Practices

- ✅ Passwords hashed with bcrypt
- ✅ JWT for stateless authentication
- ✅ Environment variables for secrets
- ✅ CORS configured for specific origins
- ✅ Input validation
- ⚠️ Consider adding rate limiting
- ⚠️ Consider adding helmet for security headers

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. For any questions or issues, please contact the development team.

## 📧 Support

For support, please open an issue in the repository or contact the maintainers.

---

**Live API**: [https://edunovabackend.onrender.com](https://edunovabackend.onrender.com)  
**Frontend**: [https://edunova-frontend.onrender.com](https://edunova-frontend.onrender.com)

Made with ❤️ by the Edunova Team
