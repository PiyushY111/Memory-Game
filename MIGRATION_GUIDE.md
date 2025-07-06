# Migration Guide: Firebase to Backend Authentication

This guide will help you migrate from Firebase authentication to a custom backend authentication system.

## What Changed

### Backend Setup
- **New**: Node.js/Express backend with JWT authentication
- **Replaced**: Firebase Authentication and Firestore
- **Database**: MongoDB with Mongoose ODM
- **Security**: bcrypt password hashing, JWT tokens

### Frontend Changes
- **New**: API service layer (`src/services/api.js`)
- **Updated**: AuthContext to use backend API
- **Removed**: Firebase SDK dependencies
- **Updated**: Error handling for backend responses

## Migration Steps

### 1. Backend Setup

1. **Install MongoDB** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install mongodb-community
   brew services start mongodb-community
   
   # Or use MongoDB Atlas (cloud)
   ```

2. **Set up the backend**:
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Edit backend/config.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/memory-game
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

4. **Start the backend**:
   ```bash
   npm run dev
   ```

### 2. Frontend Updates

1. **Remove Firebase dependencies**:
   ```bash
   npm uninstall firebase
   ```

2. **Add environment variable** (optional):
   ```bash
   # Create .env file in frontend root
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Update package.json** (remove Firebase):
   ```json
   {
     "dependencies": {
       // Remove "firebase": "^11.6.0"
     }
   }
   ```

### 3. File Changes

#### Files to Delete
- `src/firebase.js` (replaced by `src/services/api.js`)

#### Files Modified
- `src/contexts/AuthContext.jsx` - Updated to use backend API
- `src/Login.jsx` - Removed Google login, updated error handling
- `src/components/Leaderboard.jsx` - Updated to use backend API
- `src/components/Win.jsx` - Updated user ID reference
- `src/utils/scoreUtils.js` - Updated to use backend API

#### New Files
- `src/services/api.js` - API service layer
- `backend/` - Complete backend implementation

## Key Differences

### Authentication Flow

**Before (Firebase)**:
```javascript
// Firebase Auth
import { signInWithEmailAndPassword } from 'firebase/auth';
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const user = userCredential.user;
```

**After (Backend)**:
```javascript
// Backend API
import api from '../services/api';
const data = await api.login(email, password);
const user = data.user;
```

### User Object Structure

**Before (Firebase)**:
```javascript
{
  uid: "firebase-user-id",
  email: "user@example.com",
  displayName: "User Name"
}
```

**After (Backend)**:
```javascript
{
  id: "mongodb-object-id",
  email: "user@example.com",
  displayName: "User Name",
  createdAt: "2024-01-01T00:00:00.000Z",
  lastLogin: "2024-01-01T00:00:00.000Z"
}
```

### Score Storage

**Before (Firebase Firestore)**:
```javascript
// Firebase Firestore
import { collection, addDoc } from 'firebase/firestore';
await addDoc(collection(db, 'scores'), {
  userId: user.uid,
  username: user.displayName,
  score: 95,
  level: '4x4',
  moves: 20,
  misses: 2,
  timestamp: serverTimestamp()
});
```

**After (Backend)**:
```javascript
// Backend API
import api from '../services/api';
await api.saveScore(95, '4x4', 20, 2);
```

## Testing the Migration

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

2. **Test authentication**:
   - Register a new account
   - Login with the account
   - Check if user data persists after page refresh

3. **Test game functionality**:
   - Play a game and complete it
   - Check if scores are saved to the leaderboard
   - Verify leaderboard displays correctly

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS is configured for your frontend URL
   - Check if frontend is running on the expected port

2. **MongoDB Connection**:
   - Verify MongoDB is running
   - Check connection string in `config.env`

3. **JWT Token Issues**:
   - Ensure `JWT_SECRET` is set in backend config
   - Check token expiration settings

4. **User ID Mismatch**:
   - Update any remaining references from `user.uid` to `user.id`
   - Check leaderboard component for proper user identification

### Error Messages

**Firebase-style errors** → **Backend errors**:
- `auth/user-not-found` → `Invalid credentials`
- `auth/wrong-password` → `Invalid credentials`
- `auth/email-already-in-use` → `User already exists with this email`

## Production Deployment

1. **Backend**:
   - Deploy to your preferred hosting (Heroku, Railway, DigitalOcean, etc.)
   - Set up production MongoDB (MongoDB Atlas recommended)
   - Configure environment variables
   - Set up proper CORS origins

2. **Frontend**:
   - Update `VITE_API_URL` to point to your production backend
   - Deploy to your preferred hosting

3. **Security**:
   - Use strong JWT secrets
   - Enable HTTPS
   - Set up proper rate limiting
   - Configure CORS for production domains

## Rollback Plan

If you need to rollback to Firebase:

1. Restore Firebase dependencies:
   ```bash
   npm install firebase
   ```

2. Restore original files:
   - `src/firebase.js`
   - Original `src/contexts/AuthContext.jsx`
   - Original components using Firebase

3. Update environment variables to use Firebase config

## Support

If you encounter issues during migration:
1. Check the backend logs for errors
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check browser console for frontend errors 