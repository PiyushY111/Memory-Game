# Memory Game Backend

A Node.js/Express backend for the Memory Game with JWT authentication and MongoDB database.

## Features

- JWT-based authentication
- User registration and login
- Password hashing with bcrypt
- Score management and leaderboard
- MongoDB database with Mongoose ODM
- Input validation with express-validator
- Security middleware (helmet, rate limiting)
- CORS support

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/memory-game
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

3. Start MongoDB:
   - Local: Make sure MongoDB is running on your machine
   - Cloud: Use MongoDB Atlas or similar service

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your config).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Scores
- `POST /api/scores` - Save a new score (protected)
- `GET /api/scores/leaderboard` - Get leaderboard scores
- `GET /api/scores/user` - Get user's scores (protected)
- `GET /api/scores/user/best` - Get user's best scores by level (protected)

### Health Check
- `GET /api/health` - Server health check

## Database Schema

### User Model
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  displayName: String (auto-generated from email),
  createdAt: Date,
  lastLogin: Date
}
```

### Score Model
```javascript
{
  userId: ObjectId (ref: User),
  displayName: String,
  score: Number,
  level: String,
  moves: Number,
  misses: Number,
  timestamp: Date
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting (100 requests per 15 minutes per IP)
- CORS protection
- Helmet security headers

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRE` | JWT token expiration | 7d |
| `NODE_ENV` | Environment mode | development |

## Frontend Integration

Update your frontend environment variables:
```env
VITE_API_URL=http://localhost:5000/api
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Set up proper CORS origins
4. Use a production MongoDB instance
5. Set up proper logging and monitoring
6. Use HTTPS in production

## Error Handling

The API returns consistent error responses:
```javascript
{
  success: false,
  message: "Error description",
  errors: [] // Validation errors if any
}
```

## License

MIT 