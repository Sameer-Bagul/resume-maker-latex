# ResumeCraft - ATS-Optimized Resume Builder (MERN Stack)

## Overview
ResumeCraft is a professional resume builder application that helps users create ATS-optimized resumes with multiple templates. The application provides real-time preview and PDF export capabilities.

**Current State**: Fully converted to MERN stack (MongoDB, Express, React, Node.js) with JWT authentication.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Backend**: Express.js + TypeScript
- **Database**: MongoDB Atlas with Mongoose ODM
- **PDF Generation**: PDFKit
- **Authentication**: JWT-based (email/password)

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/  # UI components (shadcn/ui)
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
├── server/              # Backend Express server
│   ├── index.ts        # Main server entry
│   ├── routes.ts       # API routes
│   ├── db.ts           # MongoDB connection
│   ├── auth.ts         # JWT authentication
│   ├── storage.ts      # Data access layer
│   └── pdf-generator.ts # PDF generation logic
├── shared/              # Shared types and schemas
│   └── schema.ts       # Mongoose models and schemas
└── attached_assets/     # Static assets
```

### Database Schema (Mongoose)
- **users**: User accounts with hashed passwords
  - email, password, firstName, lastName, profileImageUrl
- **resumes**: Resume data with embedded documents:
  - Personal details
  - Skills (array)
  - Education (array)
  - Projects (array)
  - Experience (array)
  - Achievements (array)
  - Social links

## Setup Instructions

### 1. MongoDB Atlas Setup

#### Create a Free MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (select the free tier)
4. Wait for cluster creation (takes 1-3 minutes)

#### Get Connection String
1. Click "Connect" on your cluster
2. Select "Connect your application"
3. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
4. Replace `<password>` with your actual password
5. Add your database name after `.net/` (e.g., `resumecraft`)

#### Configure Network Access
1. In Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0) for development
4. For production, add only your server's IP address

### 2. Environment Variables

Set the following environment variable in Replit:
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumecraft?retryWrites=true&w=majority
```

Optional environment variables:
```bash
JWT_SECRET=your-custom-secret-key  # Defaults to a dev secret if not set
PORT=5000                           # Default port
NODE_ENV=development                # or production
```

### 3. Local Ubuntu Development

#### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account OR local MongoDB installation

#### Installation Steps
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in the root directory:
   ```bash
   # Copy from .env.local.example
   cp .env.local.example .env
   ```

4. Edit `.env` and add your MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://your-connection-string
   JWT_SECRET=your-secret-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser to `http://localhost:5000`

#### Using Local MongoDB (Alternative)
If you prefer to run MongoDB locally on Ubuntu:

1. Install MongoDB:
   ```bash
   sudo apt-get update
   sudo apt-get install mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

2. Use local connection string in `.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/resumecraft
   ```

## Authentication

### JWT Authentication Flow
1. **Register**: POST to `/api/auth/register` with email, password, firstName, lastName
2. **Login**: POST to `/api/auth/login` with email and password
3. **Token**: Store JWT token in localStorage
4. **Authenticated Requests**: Include token in Authorization header: `Bearer <token>`

### Frontend Auth Usage
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  const handleLogin = async () => {
    await login({ email: 'user@example.com', password: 'password' });
  };
  
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }
  
  return <div>Welcome {user.email}</div>;
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (authenticated)
- `POST /api/auth/logout` - Logout user

### Resumes (All require authentication)
- `GET /api/resumes` - Get all user's resumes
- `GET /api/resumes/current` - Get most recent resume
- `GET /api/resumes/:id` - Get specific resume
- `POST /api/resumes` - Create new resume
- `PATCH /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/download` - Download resume as PDF

## Configuration

### Environment Variables
- `MONGODB_URI`: MongoDB connection string (REQUIRED)
- `JWT_SECRET`: Secret key for JWT tokens (defaults to dev key)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

### Ports
- **Frontend/Backend**: Port 5000 (unified server)
- **Vite Dev**: Port 5173 (internal, proxied through Express)

### Vite Configuration
- Host: `0.0.0.0` (required for Replit proxy)
- Allowed hosts: `true` (required for Replit iframe)
- Port: 5173 (internal)

## Recent Changes

### 2025-11-15: MERN Stack Conversion
- **Converted from PostgreSQL to MongoDB Atlas**
  - Replaced Drizzle ORM with Mongoose ODM
  - Migrated all database schemas to Mongoose models
  - Updated all queries to use Mongoose API
- **Replaced Replit Auth with JWT Authentication**
  - Implemented email/password authentication
  - Added JWT token generation and validation
  - Updated frontend to use localStorage for tokens
- **Added MongoDB connection management**
  - Connection pooling configuration
  - Graceful shutdown handling
  - Error handling and retry logic
- **Updated frontend authentication**
  - New useAuth hook with login/register/logout
  - Token-based API requests
  - Auth state management with React Query
- **Created environment configuration**
  - .env.example for MongoDB Atlas setup
  - .env.local.example for local development
  - Environment variable documentation

### 2025-11-15: Initial Replit Setup
- Installed all npm dependencies
- Configured Vite to allow all hosts for Replit proxy compatibility
- Set up development workflow
- Verified application is running successfully

## Features
- Professional resume templates
- Real-time preview
- ATS optimization
- PDF export
- Multiple sections: Personal details, Skills, Education, Projects, Experience, Achievements
- Social media links integration
- Dark mode support
- Responsive design
- JWT-based authentication
- MongoDB Atlas cloud database

## Development

### Running the Application
```bash
npm run dev
```

### Building for Production
```bash
npm run build      # Build both frontend and backend
npm start          # Run production server
```

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB Atlas cluster is running
- Check that your IP address is whitelisted in Atlas Network Access
- Verify connection string is correct (including password)
- Check that database user has proper permissions

### Authentication Issues
- Clear localStorage if experiencing token issues
- Ensure JWT_SECRET is set in production
- Check that requests include Authorization header

### Local Development
- MongoDB must be running locally if not using Atlas
- Port 5000 must be available
- Node.js version 18+ required

## Production Deployment

### Deployment Configuration
- Deployment type: Autoscale (stateless)
- Build command: `npm run build`
- Run command: `npm start`
- Environment variables: MONGODB_URI, JWT_SECRET

### Security Checklist
- ✅ Use strong JWT_SECRET in production
- ✅ Enable HTTPS
- ✅ Restrict MongoDB Atlas IP whitelist to server IP
- ✅ Use strong database passwords
- ✅ Enable MongoDB authentication
- ✅ Set secure cookie options in production
- ✅ Implement rate limiting (future enhancement)

## Notes
- Application uses a unified server on port 5000 serving both API and frontend
- Vite dev server runs in middleware mode during development
- Database schema uses Mongoose ODM with MongoDB
- JWT tokens expire after 7 days
- Passwords are hashed using bcrypt with 10 salt rounds
- All API requests require Bearer token in Authorization header (except auth endpoints)
