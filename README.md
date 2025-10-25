# Focus - Productivity Hub

A modern productivity app with authentication, task management, study tracking, and more.

## Features

- 🔐 User Authentication (Login/Signup)
- 📊 Task Management
- ⏱️ Study Timer & Logs
- 📚 Syllabus Tracker
- 🎵 Background Music Integration
- 🌙 Dark Theme with Glassy UI

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:
   - `JWT_SECRET`: A strong secret for JWT tokens
   - `MONGODB_URI`: Your MongoDB connection string
   - `MONGODB_DB`: Database name (default: 'focus')

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. **Set up environment variables** in Vercel dashboard (Project Settings → Environment Variables):
   ```
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGODB_URI=your-mongodb-connection-string
   MONGODB_DB=focus
   ```
   ⚠️ **Important**: Use plain text values, not secret references like "@jwt-secret"

4. **Redeploy** the project
5. **Test** the health endpoint: `https://your-domain.vercel.app/api/health`

### Other Platforms

Make sure to set the environment variables in your deployment platform.

## Troubleshooting

### 404 Errors on Vercel
- **Check environment variables**: Ensure all variables are set in Vercel dashboard (not as secret references)
- **Verify API routes**: Visit `/api/health` to check if environment variables are loaded
- **Check build logs**: Look for TypeScript compilation errors in Vercel deployment logs

### Environment Variables Not Loading
- **Plain text only**: Use actual values, not `@secret-name` references
- **Case sensitive**: Ensure variable names match exactly (`JWT_SECRET`, not `jwt_secret`)
- **Redeploy**: After adding environment variables, trigger a new deployment

### Database Connection Issues
- **MongoDB URI format**: Use `mongodb+srv://` for MongoDB Atlas
- **Network access**: Ensure your MongoDB instance allows connections from Vercel's IP ranges
- **Database exists**: Verify the database name exists in your MongoDB instance

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Database**: MongoDB
- **Styling**: Tailwind CSS
- **Authentication**: JWT with jose library
- **UI**: React with modern glassmorphism design

## Configuration

### Next.js 15 Updates

This project uses Next.js 15 features including:
- **Async Route Parameters**: All dynamic API routes use async `params`
- **Modern JWT**: Uses the `jose` library for JWT operations
- **Server External Packages**: MongoDB configured as external package for server components

### Environment Variables

Required environment variables for deployment:
- `JWT_SECRET`: Secret key for JWT token signing
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB`: Database name (default: 'focus')

## API Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/user/me` - Get current user
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task
- Similar routes for study logs, syllabus, and backgrounds

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
