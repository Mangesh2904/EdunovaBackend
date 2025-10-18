# Edunova Backend API

This is the backend API for the Edunova learning platform, built with Node.js, Express, MongoDB, and Google Gemini AI.

## Features

- **User Authentication**: JWT-based authentication with signup and login
- **AI Chatbot**: Powered by Google Gemini AI for interactive learning
- **Learning Roadmaps**: Generate personalized learning paths for any topic
- **Placement Preparation**: Company-specific interview questions and study materials
- **Checklist Management**: Track your learning progress
- **Chat & Roadmap History**: Save and retrieve past interactions

## Tech Stack

- **Node.js** & **Express.js**: Server framework
- **MongoDB** & **Mongoose**: Database
- **Google Gemini AI**: AI-powered content generation
- **JWT**: Authentication
- **bcryptjs**: Password hashing

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or MongoDB Atlas account)
- [Google Gemini API Key](https://makersuite.google.com/app/apikey)

## Installation

1. **Navigate to the backend directory:**
   ```bash
   cd google-b-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy the `.env.example` file to `.env`:
     ```bash
     copy .env.example .env
     ```
   - Edit `.env` and fill in your actual values:
     ```env
     MONGODB_URI=mongodb://localhost:27017/edunova
     JWT_SECRET=your_strong_jwt_secret_here
     GEMINI_API_KEY=your_gemini_api_key_here
     PORT=5000
     ```

4. **Get your Google Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the key and paste it in your `.env` file

5. **Start MongoDB:**
   - If using local MongoDB:
     ```bash
     mongod
     ```
   - Or use MongoDB Atlas connection string in `.env`

## Running the Server

### Development Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env` file).

## API Endpoints

### Authentication
- `POST /api/user/signup` - Create a new user account
- `POST /api/user/login` - Login and receive JWT token

### Chatbot
- `POST /api/chatbot/ask` - Ask a question to the AI chatbot (optional auth)
- `GET /api/chatbot/history` - Get chat history (requires auth)

### Roadmap
- `POST /api/roadmap/generate` - Generate a learning roadmap (optional auth)
- `GET /api/roadmap/history` - Get roadmap history (requires auth)

### Placement Preparation
- `POST /api/placement/generate` - Generate placement prep content (optional auth)
- `GET /api/placement/history` - Get placement history (requires auth)

### Checklist
- `GET /api/checklist` - Get user's checklist items (requires auth)
- `POST /api/checklist/add` - Add item to checklist (requires auth)
- `PATCH /api/checklist/:id` - Update checklist item (requires auth)
- `DELETE /api/checklist/:id` - Delete checklist item (requires auth)

## Project Structure

```
google-b-main/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── chatbotController.js # Chatbot logic
│   ├── checklistController.js
│   ├── placementController.js
│   ├── roadmapController.js
│   └── userController.js    # Auth logic
├── middleware/
│   ├── auth.js              # JWT authentication
│   └── optionalAuth.js      # Optional authentication
├── models/
│   ├── Chat.js              # Chat schema
│   ├── Checklist.js
│   ├── Placement.js
│   ├── Roadmap.js
│   └── User.js              # User schema
├── routes/
│   ├── chatbotRoutes.js
│   ├── checklistRoutes.js
│   ├── placementRoutes.js
│   ├── roadmapRoutes.js
│   └── userRoutes.js
├── services/
│   ├── geminiService.js     # Google Gemini AI integration
│   ├── checklistService.js
│   └── userService.js
├── .env                     # Environment variables (create this)
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/edunova` |
| `JWT_SECRET` | Secret key for JWT tokens | `your_secret_key` |
| `GEMINI_API_KEY` | Google Gemini API key | `AIzaSy...` |
| `PORT` | Server port | `5000` |

## Testing the API

You can test the API using tools like:
- [Postman](https://www.postman.com/)
- [Thunder Client](https://www.thunderclient.com/) (VS Code extension)
- [cURL](https://curl.se/)

### Example Request (Login)
```bash
curl -X POST http://localhost:5000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourpassword"}'
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check if the connection string in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

### Gemini API Errors
- Verify your API key is valid
- Check your API quota/limits
- Ensure you have internet connectivity

### Port Already in Use
- Change the `PORT` in `.env` to a different value
- Or stop the process using port 5000:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

ISC

## Support

For issues and questions, please create an issue on the repository.
