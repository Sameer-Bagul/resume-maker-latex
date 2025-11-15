# Local Development Setup - ResumeCraft MERN Stack

This guide will help you run the ResumeCraft application on your local Ubuntu machine.

## Prerequisites

- **Node.js 18+** installed
- **MongoDB** (either Atlas or local installation)
- **Git** (optional, for cloning)

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

You have two options:

#### Option A: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user:
   - Click "Database Access" → "Add New Database User"
   - Choose "Password" authentication
   - Remember the username and password
4. Configure network access:
   - Click "Network Access" → "Add IP Address"
   - For development: Select "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add only your server's IP
5. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Add your database name (e.g., `resumecraft`) after `.net/`

Example connection string:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/resumecraft?retryWrites=true&w=majority
```

#### Option B: Local MongoDB Installation

Install MongoDB on Ubuntu:

```bash
# Import MongoDB public GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

Your local connection string:
```
mongodb://localhost:27017/resumecraft
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.local.example .env
```

Edit `.env` and add your configuration:

```env
# MongoDB Connection String (REQUIRED)
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/resumecraft?retryWrites=true&w=majority

# OR for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/resumecraft

# JWT Secret (REQUIRED)
# Generate a strong random string for production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
```

**Important**: Replace the values with your actual MongoDB connection string and a secure JWT secret.

### 4. Start the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5000`

## Using the Application

### 1. Register a New Account

1. Open `http://localhost:5000` in your browser
2. Click "Get Started" or "Sign Up"
3. Fill in your email, password, and name
4. Click "Register"

### 2. Login

1. Enter your email and password
2. Click "Login"
3. You'll be redirected to the dashboard

### 3. Create a Resume

1. From the dashboard, click "Create New Resume"
2. Fill in your personal details
3. Add skills, education, experience, etc.
4. Preview your resume in real-time
5. Download as PDF when ready

## API Testing

You can test the API endpoints using curl or Postman:

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the returned `token` for authenticated requests.

### Get Current User

```bash
curl http://localhost:5000/api/auth/user \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Resume

```bash
curl -X POST http://localhost:5000/api/resumes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My Resume",
    "fullName": "John Doe",
    "email": "john@example.com",
    "jobTitle": "Software Engineer"
  }'
```

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoParseError: Invalid scheme`
- Solution: Ensure your `MONGODB_URI` starts with `mongodb://` or `mongodb+srv://`
- Check that you copied the complete connection string from Atlas

**Error**: `Authentication failed`
- Solution: Verify your MongoDB username and password are correct
- Make sure you URL-encoded special characters in the password

**Error**: `Connection timeout`
- Solution: Check your network access settings in MongoDB Atlas
- Ensure your IP is whitelisted (0.0.0.0/0 for development)

### Application Won't Start

**Error**: `MONGODB_URI must be set`
- Solution: Create a `.env` file and add your MongoDB connection string

**Error**: `Port 5000 is already in use`
- Solution: Change the `PORT` in `.env` to a different port (e.g., 3000)

**Error**: `Cannot find module`
- Solution: Run `npm install` to install all dependencies

### Authentication Issues

**Error**: `401 Unauthorized`
- Solution: Make sure you're including the `Authorization: Bearer <token>` header
- Check that your token hasn't expired (tokens last 7 days)
- Try logging in again to get a fresh token

**Error**: `Invalid email or password`
- Solution: Double-check your credentials
- Passwords are case-sensitive

## Development Tips

### Hot Reload

The development server uses hot reload, so changes to your code will automatically refresh the browser.

### Debugging

Enable detailed logging by setting:
```env
DEBUG=*
NODE_ENV=development
```

### Database GUI Tools

For easier database management, use:
- **MongoDB Compass** (official GUI): https://www.mongodb.com/products/compass
- **Studio 3T**: https://studio3t.com/
- **Robo 3T**: https://robomongo.org/

### Testing API with Postman

1. Import the API endpoints into Postman
2. Create an environment variable for your token
3. Set `Authorization` header to `Bearer {{token}}`

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Restrict MongoDB Atlas IP whitelist to your server's IP
4. Enable HTTPS
5. Use environment variables for all secrets
6. Run `npm run build` then `npm start`

## Common Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Check TypeScript types
npm run check
```

## Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check the MongoDB connection string format
5. Review the main `replit.md` file for additional documentation

## Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **PDF Generation**: PDFKit

Enjoy building resumes with ResumeCraft! 🚀
