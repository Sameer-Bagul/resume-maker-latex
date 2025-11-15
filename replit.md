# ResumeCraft - ATS-Optimized Resume Builder

## Overview
ResumeCraft is a professional resume builder application that helps users create ATS-optimized resumes with multiple templates. The application provides real-time preview and PDF export capabilities.

**Current State**: Fully configured and running on Replit with database provisioned.

## Project Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Tailwind CSS + shadcn/ui components
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **PDF Generation**: PDFKit
- **Authentication**: Passport.js (ready for Replit Auth integration)

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
│   ├── db.ts           # Database connection
│   ├── pdf-generator.ts # PDF generation logic
│   └── storage.ts      # File storage utilities
├── shared/              # Shared types and schemas
│   └── schema.ts       # Drizzle database schema
└── attached_assets/     # Static assets
```

### Database Schema
- **users**: User accounts (Replit Auth compatible)
- **sessions**: Session storage for authentication
- **resumes**: Resume data with sections:
  - Personal details
  - Skills
  - Education
  - Projects
  - Experience
  - Achievements
  - Social links

## Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (auto-provisioned)
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

### 2025-11-15: Initial Replit Setup
- Installed all npm dependencies
- Configured Vite to allow all hosts for Replit proxy compatibility
- Pushed database schema to PostgreSQL
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

## Development

### Running the Application
```bash
npm run dev
```

### Database Operations
```bash
npm run db:push    # Push schema changes to database
```

### Building for Production
```bash
npm run build      # Build both frontend and backend
npm start          # Run production server
```

## Notes
- Application uses a unified server on port 5000 serving both API and frontend
- Vite dev server runs in middleware mode during development
- Database schema uses Drizzle ORM with PostgreSQL
- Ready for Replit Auth integration (users/sessions tables configured)
