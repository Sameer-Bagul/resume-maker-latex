# ResumeCraft - API to UI Mapping Documentation

## Overview
This document maps all backend API endpoints to their corresponding frontend UI components and user interactions in the ResumeCraft application.

---

## Authentication APIs

### 1. POST `/api/auth/register`
**Backend:** `server/controllers/auth.controller.ts` → `register()`
**Frontend:** 
- `client/src/components/auth-dialog.tsx` - Registration form in modal
- `client/src/pages/landing.tsx` - "Get Started" buttons trigger registration modal
- `client/src/hooks/useAuth.ts` - `registerAsync()` function
**Purpose:** Register a new user account
**Request Body:**
```typescript
{
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```
**Response:** JWT token + user object
**UI Flow:** 
1. User clicks "Get Started" button on landing page
2. Registration modal opens with form fields
3. User fills: firstName, lastName, email, password
4. Form validated with Zod schema
5. POST /api/auth/register called via `registerAsync()`
6. JWT token stored, user redirected to dashboard

---

### 2. POST `/api/auth/login`
**Backend:** `server/controllers/auth.controller.ts` → `login()`
**Frontend:** 
- `client/src/components/auth-dialog.tsx` - Login form in modal
- `client/src/pages/landing.tsx` - "Log In" button triggers login modal
- `client/src/hooks/useAuth.ts` - `loginAsync()` function
**Purpose:** Authenticate existing user
**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```
**Response:** JWT token + user object
**UI Flow:** 
1. User clicks "Log In" button on landing page
2. Login modal opens with email/password fields
3. User enters credentials
4. Form validated with Zod schema
5. POST /api/auth/login called via `loginAsync()`
6. JWT token stored, user redirected to dashboard

---

### 3. GET `/api/auth/user`
**Backend:** `server/controllers/auth.controller.ts` → `getCurrentUser()`
**Frontend:** 
- `client/src/hooks/useAuth.ts` - Hook that fetches current user
- Used in `client/src/App.tsx` to determine routing
- Used in `client/src/pages/dashboard.tsx`
- Used in `client/src/features/auth/hooks/useGuardedRoute.ts`
**Purpose:** Get current authenticated user information
**Response:** User object
**UI Flow:** App initialization → Checks if user is authenticated → Routes to Dashboard or Landing

---

### 4. POST `/api/auth/logout`
**Backend:** `server/controllers/auth.controller.ts` → `logout()`
**Frontend:** 
- `client/src/features/resume/components/DashboardHeader.tsx` - Logout button in header
**Purpose:** Log out current user
**UI Flow:** Dashboard → User clicks logout button → Redirects to landing page

---

## Resume Management APIs

### 5. GET `/api/resumes/current`
**Backend:** `server/controllers/resume.controller.ts` → `getCurrentResume()`
**Frontend:**
- `client/src/pages/dashboard.tsx` - Fetches user's most recent resume
- `client/src/pages/preview.tsx` - Displays resume for preview/download
**Purpose:** Get the user's most recently updated resume
**Request:** Requires authentication (JWT)
**Response:** Resume object
**UI Flow:** 
- Dashboard page load → Fetches current resume → Populates form fields
- Preview page load → Fetches current resume → Displays preview

---

### 6. GET `/api/resumes`
**Backend:** `server/controllers/resume.controller.ts` → `getAllResumes()`
**Frontend:** Not currently used in UI (future feature: resume list/history)
**Purpose:** Get all resumes for authenticated user
**Response:** Array of resume objects
**Potential UI:** Future "My Resumes" page to view/manage multiple resumes

---

### 7. GET `/api/resumes/:id`
**Backend:** `server/controllers/resume.controller.ts` → `getResumeById()`
**Frontend:** Not currently used in UI (current app focuses on single resume)
**Purpose:** Get a specific resume by ID
**Response:** Resume object
**Potential UI:** Future feature to edit specific resume from list

---

### 8. POST `/api/resumes`
**Backend:** `server/controllers/resume.controller.ts` → `createResume()`
**Frontend:**
- `client/src/pages/dashboard.tsx` - saveResumeMutation when no resume exists
**Purpose:** Create a new resume
**Request Body:** Resume data (validated by insertResumeSchema)
```typescript
{
  title?: string;
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: Skill[];
  education?: Education[];
  projects?: Project[];
  experience?: Experience[];
  achievements?: string[];
  // ... and more fields
}
```
**Response:** Created resume object
**UI Flow:** Dashboard → User fills form → Clicks Save → Creates new resume

---

### 9. PATCH `/api/resumes/:id`
**Backend:** `server/controllers/resume.controller.ts` → `updateResume()`
**Frontend:**
- `client/src/pages/dashboard.tsx` - saveResumeMutation when resume exists
- All step forms (PersonalDetailsForm, SkillsForm, etc.) → onSave → triggers update
**Purpose:** Update existing resume
**Request Body:** Partial resume data (validated by updateResumeSchema)
**Response:** Updated resume object
**UI Flow:** 
- Dashboard → User modifies any section → Clicks Save → Updates resume
- Auto-save on navigation between steps

---

### 10. DELETE `/api/resumes/:id`
**Backend:** `server/controllers/resume.controller.ts` → `deleteResume()`
**Frontend:** Not currently used in UI (future feature)
**Purpose:** Delete a resume
**Response:** 204 No Content
**Potential UI:** Future "Delete Resume" button in resume list

---

### 11. POST `/api/resumes/download`
**Backend:** `server/controllers/resume.controller.ts` → `downloadResume()`
**Frontend:**
- `client/src/pages/preview.tsx` - downloadMutation triggered by Download button
**Purpose:** Generate and download resume as PDF
**Request Body:**
```typescript
{
  resumeId: string;
}
```
**Response:** PDF file (binary)
**UI Flow:** Preview page → User clicks "Download PDF" → Downloads resume.pdf

---

## Frontend Pages & Components

### Landing Page (`client/src/pages/landing.tsx`)
**APIs Used:**
- None directly (public page)
- Opens `AuthDialog` component which calls authentication APIs
**Actions:**
- "Log In" button → Opens login modal (`AuthDialog` in login mode)
- "Get Started" buttons → Opens registration modal (`AuthDialog` in register mode)
- "See Examples" button → Placeholder for future feature

### Auth Dialog (`client/src/components/auth-dialog.tsx`)
**APIs Used:**
- `POST /api/auth/login` - Login form submission
- `POST /api/auth/register` - Registration form submission
**Features:**
- Modal dialog with login/register forms
- Switch between login and register modes
- Form validation using Zod + react-hook-form
- Real-time error display
- Loading states during API calls
- Success notifications
- Auto-redirect to dashboard on success

---

### Dashboard Page (`client/src/pages/dashboard.tsx`)
**APIs Used:**
- `GET /api/auth/user` - Verify authentication
- `GET /api/resumes/current` - Load existing resume
- `POST /api/resumes` - Create new resume
- `PATCH /api/resumes/:id` - Update existing resume

**Components:**
1. **DashboardHeader**
   - Shows user info
   - Logout button → `POST /api/auth/logout`

2. **DashboardProgressBar**
   - Shows current step and progress

3. **StepNavigator**
   - Navigate between 8 resume steps

4. **Resume Step Forms** (dynamically rendered):
   - PersonalDetailsForm (Step 1)
   - SkillsForm (Step 2)
   - EducationForm (Step 3)
   - ProjectsForm (Step 4)
   - ExperienceForm (Step 5)
   - AchievementsForm (Step 6)
   - PhotoSocialForm (Step 7)
   - TemplateSelector (Step 8)

Each form component:
- Loads data from `GET /api/resumes/current`
- Saves data via `POST` or `PATCH /api/resumes/:id`

---

### Preview Page (`client/src/pages/preview.tsx`)
**APIs Used:**
- `GET /api/auth/user` - Verify authentication
- `GET /api/resumes/current` - Load resume data
- `POST /api/resumes/download` - Download PDF

**Actions:**
- Displays formatted resume preview
- "Download PDF" button → Generates and downloads PDF
- "Back to Dashboard" button → Navigate to dashboard

---

## Resume Data Flow

### Creating a Resume (First Time User):
```
1. User lands on Dashboard
2. Dashboard fetches GET /api/resumes/current (returns 404)
3. User fills out Step 1 (Personal Details)
4. User clicks Save → POST /api/resumes (creates new resume)
5. User continues to Step 2-8, each Save → PATCH /api/resumes/:id
6. User clicks Preview → Redirects to Preview page
7. Preview page → GET /api/resumes/current → Displays resume
8. User clicks Download → POST /api/resumes/download → Downloads PDF
```

### Editing Existing Resume:
```
1. User lands on Dashboard
2. Dashboard → GET /api/resumes/current (returns existing resume)
3. Form fields auto-populate with existing data
4. User modifies any section
5. User clicks Save → PATCH /api/resumes/:id (updates resume)
6. Process repeats for any step
```

---

## Resume Form Steps

### Step 1: Personal Details (`PersonalDetailsForm`)
**Fields:** fullName, jobTitle, email, phone, location, summary
**API:** PATCH `/api/resumes/:id` with personal details

### Step 2: Skills (`SkillsForm`)
**Fields:** skills array (name, category, level)
**API:** PATCH `/api/resumes/:id` with skills

### Step 3: Education (`EducationForm`)
**Fields:** education array (institution, degree, field, dates, gpa)
**API:** PATCH `/api/resumes/:id` with education

### Step 4: Projects (`ProjectsForm`)
**Fields:** projects array (title, description, techStack, dates, urls)
**API:** PATCH `/api/resumes/:id` with projects

### Step 5: Experience (`ExperienceForm`)
**Fields:** experience array (company, position, dates, responsibilities)
**API:** PATCH `/api/resumes/:id` with experience

### Step 6: Achievements (`AchievementsForm`)
**Fields:** achievements array (string[])
**API:** PATCH `/api/resumes/:id` with achievements

### Step 7: Photo & Social (`PhotoSocialForm`)
**Fields:** photoUrl, githubUrl, linkedinUrl, youtubeUrl, portfolioUrl
**API:** PATCH `/api/resumes/:id` with social links

### Step 8: Template Selection (`TemplateSelector`)
**Fields:** templateId (modern, classic, minimal, executive)
**API:** PATCH `/api/resumes/:id` with templateId

---

## Data Validation

All API requests are validated using Zod schemas defined in `shared/schema.ts`:

- **insertResumeSchema** - Validates data when creating a resume
- **updateResumeSchema** - Validates data when updating a resume
- **skillSchema, educationSchema, projectSchema, experienceSchema** - Validate nested structures

Frontend forms also use Zod validation via `react-hook-form` with `zodResolver`.

---

## Authentication Flow

### User Registration Flow:
```
1. User visits landing page (no JWT)
2. User clicks "Get Started" button
3. AuthDialog modal opens in register mode
4. User fills registration form:
   - First Name
   - Last Name  
   - Email
   - Password (min 6 characters)
5. Form validation (Zod schema)
6. POST /api/auth/register
7. Server creates user with hashed password
8. Server returns JWT token + user object
9. Frontend stores JWT token
10. User automatically redirected to Dashboard
```

### User Login Flow:
```
1. User visits landing page (no JWT)
2. User clicks "Log In" button
3. AuthDialog modal opens in login mode
4. User enters email and password
5. Form validation (Zod schema)
6. POST /api/auth/login
7. Server verifies credentials
8. Server returns JWT token + user object
9. Frontend stores JWT token
10. User automatically redirected to Dashboard
```

### App Initialization Flow:
```
User Visit → Check for JWT token →
  If valid → GET /api/auth/user → 
    Success → Route to Dashboard
    Error 401 → Remove token → Route to Landing Page
  If no token → Route to Landing Page
```

**Protected Routes:**
- `/` (Dashboard) - Requires authentication
- `/preview` - Requires authentication

**Public Routes:**
- `/` (Landing) - When not authenticated

---

## Database Schema

**MongoDB Collections:**
1. **users** - User accounts
   - email, password (hashed), firstName, lastName, profileImageUrl

2. **resumes** - Resume data
   - userId (reference to user)
   - All resume fields (personal, skills, education, etc.)
   - templateId
   - createdAt, updatedAt

---

## PDF Generation

**API:** `POST /api/resumes/download`
**Implementation:** `server/pdf-generator.ts`
**Library:** PDFKit
**Process:**
1. Fetch resume data
2. Apply selected template formatting
3. Generate PDF buffer
4. Return as downloadable file

---

## Authentication Middleware

**File:** `server/middleware/auth.middleware.ts`
**Function:** `isAuthenticated`
**Purpose:** Protects all resume endpoints
**Process:**
1. Extract JWT from Authorization header
2. Verify token with JWT_SECRET
3. Attach user to request object
4. Allow request to proceed or return 401

---

## Current Application State

✅ **Working:**
- MongoDB connected successfully
- Server running on port 5000
- Vite dev server connected
- Landing page loads correctly
- All API endpoints defined and mapped to UI
- JWT authentication implemented
- PDF generation configured

📝 **Note:**
- The application uses MongoDB (not the in-memory storage suggested in dev guidelines)
- All form components are properly wired to their respective APIs
- Real-time preview functionality is ready
- Template selection system is in place

---

## Future Enhancements (Not Yet Implemented)

1. Resume list/history page (`GET /api/resumes`)
2. Delete resume functionality (`DELETE /api/resumes/:id`)
3. Multiple resume support (edit specific resume by ID)
4. Resume sharing/export features
5. Template preview gallery
6. Real-time collaboration

---

## Quick Reference

**Authentication:**
- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`
- Get User: `GET /api/auth/user`
- Logout: `POST /api/auth/logout`

**Resume Operations:**
- Get Current: `GET /api/resumes/current`
- Get All: `GET /api/resumes`
- Get One: `GET /api/resumes/:id`
- Create: `POST /api/resumes`
- Update: `PATCH /api/resumes/:id`
- Delete: `DELETE /api/resumes/:id`
- Download PDF: `POST /api/resumes/download`

**Frontend Pages:**
- Landing: `/` (unauthenticated)
- Dashboard: `/` (authenticated)
- Preview: `/preview` (authenticated)

---

*Last Updated: November 15, 2025*
*Application Status: ✅ Fully Operational*
