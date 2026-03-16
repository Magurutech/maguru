# Course Discovery & Enrollment - Feature Overview

**Date:** 2026-03-15
**Status:** 🔄 In Planning (Sprint 2b)
**Priority:** 🔴 Critical (Blocks Student & Creator User Experience)
**Dependencies:** Course Content Management V2 (Tasks 1-11 Complete - 207/207 tests)

---

## 📋 Executive Summary

**Objective:** Implement complete Course Discovery flow for both Student and Creator experiences, enabling:
- Students to browse, discover, and enroll in courses
- Creators to list their courses and create new course content
- Direct enrollment workflow (no approval required)

**Scope:** Complete Course Discovery & Enrollment system (Opsi B: Full Features)

**Approach:** Direct implementation with minimal Quick Start flow (Draft & Publish)

---

## 🎯 User Stories

### Student Stories

#### S1 - Browse Courses
**As a** Student
**I want** to browse all available courses with filters
**So that** I can discover courses that match my interests

**Acceptance Criteria:**
1. Student can view list of all published courses
2. Student can filter courses by category and difficulty
3. Student can search courses by title
4. Course cards display: title, description preview, category, difficulty, enrollment status
5. Student sees "Enroll" button if not enrolled, "Continue Learning" if enrolled
6. Responsive design works on mobile, tablet, and desktop

---

#### S2 - Enroll to Course
**As a** Student
**I want** to enroll in a course with one click
**So that** I can start learning immediately

**Acceptance Criteria:**
1. Student can enroll by clicking "Enroll" button on course card
2. Enrollment creates Enrollment record in database
3. Enrollment status is updated immediately
4. Student is redirected to course learn page after successful enrollment
5. Student cannot enroll twice for the same course
6. Error handling for invalid enrollment attempts (409 duplicate, 401 unauthorized)

---

#### S3 - My Courses Dashboard
**As a** Student
**I want** to see all my enrolled courses in one place
**So that** I can track my learning progress and resume

**Acceptance Criteria:**
1. Student can view list of enrolled courses
2. Each course card shows progress percentage
3. "Resume Learning" button redirects to last completed lesson
4. Course list is filtered to only show enrolled courses
5. Student can re-enroll if course is republished

---

### Creator Stories

#### C1 - List Own Courses
**As a** Creator
**I want** to see all my courses in the dashboard
**So that** I can quickly access and manage my content

**Acceptance Criteria:**
1. Creator can view all courses owned by them
2. Dashboard shows stats: total courses, published, draft
3. Each course card shows: title, description, status, last updated
4. "Manage" button redirects to course management page
5. "Publish" button allows toggling course status
6. Empty state shows message if no courses exist

---

#### C2 - Create New Course (Quick Start)
**As a** Creator
**I want** to create a new course with minimal fields
**So that** I can quickly start building content

**Acceptance Criteria:**
1. Creator can click "Create Course" button
2. Course Creation Form has minimal fields (Title, Description, Category, Difficulty, Status)
3. Form validates required fields before submission
4. Creating a course with "Draft" status immediately creates course in database
5. Creating a course with "Published" status immediately makes course visible in catalog
6. Creator is redirected to course management page after creation
7. Form has loading state during submission
8. Validation errors displayed inline with helpful messages

---

## 🏗️ Architecture Overview

### System Architecture

```
┌──────────────────────────────────────────────────────┐
│  COURSE DISCOVERY SYSTEM                             │
├──────────────────────────────────────────────────────┤
│                                                       │
│  FRONTEND (Student)                                  │
│  ┌──────────────┐     ┌──────────────┐              │
│  │ Course       │     │ Course       │              │
│  │ Catalog      │     │ Detail       │              │
│  │ Page         │────▶│ Page         │              │
│  │ (/courses)   │     │ (/courses/   │              │
│  └──────────────┘     │  [slug])     │              │
│       │               └──────────────┘              │
│       │                  │                          │
│       ▼                  ▼                          │
│  ┌──────────────┐     ┌──────────────┐              │
│  │ My Courses   │     │ Learn        │              │
│  │ Page         │     │ Page          │              │
│  │ (/my-courses)│     │ (/courses/   │              │
│  └──────────────┘     │  [slug]/learn)│              │
│                       └──────────────┘              │
│                                                       │
│  FRONTEND (Creator)                                  │
│  ┌──────────────┐     ┌──────────────┐              │
│  │ Creator      │     │ Course       │              │
│  │ Dashboard    │────▶│ Creation     │              │
│  │ (/creator)   │     │ Page         │              │
│  └──────────────┘     │ (/creator/   │              │
│                       │  courses/create)│           │
│                       └──────────────┘              │
│                                                       │
│  BACKEND API                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ Public APIs:                                   │   │
│  │ - GET /api/courses              │   │
│  │ - GET /api/courses/[slug]       │   │
│  │ - POST /api/courses/[slug]/enroll │   │
│  │ - GET /api/courses/my-courses   │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │ Creator APIs:                                  │   │
│  │ - GET /api/creator/courses        │   │
│  │ - POST /api/creator/courses          │   │
│  │ - GET /api/creator/courses/[slug]   │   │
│  │ - PUT /api/creator/courses/[slug]/publish │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
│  DATABASE (Prisma + Supabase)                         │
│  ┌──────────────────────────────────────────────┐   │
│  │ Existing: Course, Section, Lesson,            │   │
│  │          LessonProgress, CourseCompletion     │   │
│  │                                                       │
│  │ NEW:                                              │   │
│  │ - Enrollment (per user per course)              │   │
│  │ - Course metadata (category, difficulty)        │   │
│  └──────────────────────────────────────────────┘   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### New Tables

#### Enrollment Model

```prisma
model Enrollment {
  id          String   @id @default(uuid())
  userId      String
  courseId    String
  enrolledAt  DateTime @default(now())
  completed   Boolean  @default(false)
  completedAt DateTime?

  // Relations
  user        User     @relation(fields: [userId], references: [id])
  course      Course   @relation(fields: [courseId], references: [id])

  @@unique([userId, courseId]) // Student cannot enroll twice
  @@index([userId])
  @@index([courseId])
  @@map("enrollments")
}
```

**Field Descriptions:**
- `id`: Unique enrollment identifier (UUID)
- `userId`: Reference to User model (Clerk user ID)
- `courseId`: Reference to Course model
- `enrolledAt`: Timestamp when student enrolled
- `completed`: Flag indicating if course is completed
- `completedAt`: Timestamp when course was marked as completed

**Constraints:**
- Unique constraint on (userId, courseId) prevents duplicate enrollments
- Indexes on userId and courseId for query performance

---

#### Updated Course Model

```prisma
model Course {
  id          String   @id @default(uuid())
  title       String
  description String?
  thumbnail   String?
  duration    String?
  category    String?
  difficulty  String?
  status      String   @default("DRAFT") // DRAFT | PUBLISHED

  // Metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  sections    Section[]
  enrollments Enrollment[]
  progress    CourseCompletion[]

  @@index([status])
  @@index([category])
  @@index([difficulty])
  @@index([createdAt])
  @@map("courses")
}
```

**New Fields:**
- `thumbnail`: URL to course thumbnail image (optional, for future use)
- `duration`: Course duration string (e.g., "2 hours", "5 hours") (optional, for future use)
- `category`: Course category (e.g., "Programming", "Design", "Business") (optional)
- `difficulty`: Difficulty level (e.g., "Beginner", "Intermediate", "Advanced") (optional)
- `status`: Course status (DRAFT or PUBLISHED) - Controls visibility in catalog

**Indexes:**
- Status index for filtering published courses
- Category and difficulty indexes for filtering
- CreatedAt index for sorting by newest

---

### Database Migration

**File:** `prisma/migrations/[timestamp]_add_course_discovery.sql`

```sql
-- Create Enrollment table
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course_id VARCHAR(255) NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,

  UNIQUE(user_id, course_id),
  INDEX idx_enrollments_user_id (user_id),
  INDEX idx_enrollments_course_id (course_id)
);

-- Add new fields to courses table
ALTER TABLE courses
ADD COLUMN thumbnail TEXT,
ADD COLUMN duration TEXT,
ADD COLUMN category TEXT,
ADD COLUMN difficulty TEXT,
ADD COLUMN status VARCHAR(50) DEFAULT 'DRAFT';

-- Add indexes to courses table
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_difficulty ON courses(difficulty);
CREATE INDEX idx_courses_created_at ON courses(created_at);

-- Set default status for existing courses
UPDATE courses SET status = 'PUBLISHED' WHERE sections IS NOT NULL;
```

**Post-Migration Verification:**
```sql
-- Verify Enrollment table created
SELECT table_name FROM information_schema.tables WHERE table_name = 'enrollments';

-- Verify new columns added to courses
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'courses';

-- Verify indexes created
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'courses' OR tablename = 'enrollments';
```

---

## 🔌 API Endpoints

### Public Endpoints

#### 1. GET /api/courses

**Description:** Retrieve list of published courses with optional filters

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Items per page (default: 12, max: 50)
- `category` (optional): Filter by course category
- `difficulty` (optional): Filter by difficulty level
- `search` (optional): Search in course title and description

**Success Response (200 OK):**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Course Title",
      "description": "Course description preview...",
      "thumbnail": "https://...",
      "category": "Programming",
      "difficulty": "Beginner",
      "status": "PUBLISHED",
      "sectionCount": 3,
      "lessonCount": 15,
      "createdAt": "2026-03-01T00:00:00.000Z",
      "enrolled": false,
      "enrolledAt": null
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid query parameters
- `500 Internal Server Error`: Database error

---

#### 2. GET /api/courses/[slug]

**Description:** Retrieve detailed information about a specific course

**Path Parameters:**
- `slug`: Course slug (URL-friendly identifier)

**Success Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Course Title",
  "description": "Full course description...",
  "slug": "course-slug",
  "thumbnail": "https://...",
  "duration": "5 hours",
  "category": "Programming",
  "difficulty": "Intermediate",
  "status": "PUBLISHED",
  "sectionCount": 5,
  "lessonCount": 20,
  "creator": {
    "id": "clerk_user_id",
    "name": "Creator Name"
  },
  "enrolled": false,
  "enrolledAt": null,
  "createdAt": "2026-03-01T00:00:00.000Z",
  "updatedAt": "2026-03-15T00:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found`: Course not found
- `500 Internal Server Error`: Database error

---

#### 3. POST /api/courses/[slug]/enroll

**Description:** Student enrolls in a course (Direct Enrollment)

**Path Parameters:**
- `slug`: Course slug

**Success Response (201 Created):**
```json
{
  "enrollment": {
    "id": "uuid",
    "userId": "clerk_user_id",
    "courseId": "course_uuid",
    "enrolledAt": "2026-03-15T00:00:00.000Z",
    "completed": false
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `404 Not Found`: Course not found
- `409 Conflict`: User already enrolled
- `500 Internal Server Error`: Database error

---

#### 4. GET /api/courses/my-courses

**Description:** Retrieve all courses enrolled by authenticated user

**Headers:**
- `Authorization: Bearer <clerk_token>`

**Success Response (200 OK):**
```json
{
  "enrollments": [
    {
      "id": "uuid",
      "course": {
        "id": "course_uuid",
        "title": "Course Title",
        "description": "Course description...",
        "thumbnail": "https://...",
        "category": "Programming",
        "difficulty": "Beginner",
        "status": "PUBLISHED"
      },
      "enrolledAt": "2026-03-01T00:00:00.000Z",
      "completed": false,
      "progress": 35
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Database error

---

### Creator Endpoints

#### 1. GET /api/creator/courses

**Description:** Retrieve all courses owned by authenticated creator

**Headers:**
- `Authorization: Bearer <clerk_token>`

**Success Response (200 OK):**
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Course Title",
      "slug": "course-slug",
      "description": "Course description...",
      "thumbnail": "https://...",
      "category": "Programming",
      "difficulty": "Beginner",
      "status": "PUBLISHED",
      "sectionCount": 3,
      "lessonCount": 12,
      "enrollmentCount": 45,
      "createdAt": "2026-03-01T00:00:00.000Z",
      "updatedAt": "2026-03-15T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalCourses": 3,
    "publishedCourses": 2,
    "draftCourses": 1
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User is not a creator
- `500 Internal Server Error`: Database error

---

#### 2. POST /api/creator/courses

**Description:** Create a new course (Quick Start minimal fields)

**Headers:**
- `Authorization: Bearer <clerk_token>`

**Request Body:**
```json
{
  "title": "Course Title",
  "description": "Course description...",
  "category": "Programming",
  "difficulty": "Beginner",
  "status": "DRAFT"
}
```

**Success Response (201 Created):**
```json
{
  "course": {
    "id": "uuid",
    "title": "Course Title",
    "slug": "course-slug",
    "description": "Course description...",
    "category": "Programming",
    "difficulty": "Beginner",
    "status": "DRAFT",
    "createdAt": "2026-03-15T00:00:00.000Z",
    "updatedAt": "2026-03-15T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User is not a creator
- `400 Bad Request`: Invalid form data
- `500 Internal Server Error`: Database error

---

#### 3. GET /api/creator/courses/[slug]

**Description:** Retrieve creator's course detail

**Path Parameters:**
- `slug`: Course slug

**Success Response (200 OK):**
```json
{
  "course": {
    "id": "uuid",
    "title": "Course Title",
    "slug": "course-slug",
    "description": "Course description...",
    "thumbnail": "https://...",
    "duration": "5 hours",
    "category": "Programming",
    "difficulty": "Beginner",
    "status": "PUBLISHED",
    "sectionCount": 5,
    "lessonCount": 20,
    "enrollmentCount": 45,
    "createdAt": "2026-03-01T00:00:00.000Z",
    "updatedAt": "2026-03-15T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own this course
- `404 Not Found`: Course not found
- `500 Internal Server Error`: Database error

---

#### 4. PUT /api/creator/courses/[slug]/publish

**Description:** Toggle course status between DRAFT and PUBLISHED

**Path Parameters:**
- `slug`: Course slug

**Success Response (200 OK):**
```json
{
  "course": {
    "id": "uuid",
    "title": "Course Title",
    "slug": "course-slug",
    "status": "PUBLISHED"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own this course
- `404 Not Found`: Course not found
- `500 Internal Server Error`: Database error

---

## 🎨 Component Architecture

### Student Components

#### CourseCatalogPage

**File:** `app/course/page.tsx`

**Features:**
- Course list with filters
- Pagination
- CourseCard components
- Responsive design

**Props:**
```typescript
interface CourseCatalogPageProps {
  page?: number
  limit?: number
  category?: string
  difficulty?: string
  search?: string
}
```

---

#### CourseCard

**File:** `features/course/components/CourseCard.tsx`

**Features:**
- Display course thumbnail
- Title, description preview
- Category and difficulty badges
- Status indicator (Draft/Published)
- Enroll/Continue Learning button
- Progress indicator if enrolled

**Props:**
```typescript
interface CourseCardProps {
  course: Course
  enrolled?: boolean
  progress?: number
  onEnroll?: () => void
}
```

---

#### MyCoursesPage

**File:** `app/student/courses/page.tsx`

**Features:**
- List enrolled courses
- Progress display per course
- Resume Learning button
- Empty state

**Props:**
```typescript
interface MyCoursesPageProps {
  userId: string
}
```

---

### Creator Components

#### CreatorDashboardPage (Updated)

**File:** `app/creator/page.tsx`

**Changes:**
- Replace placeholder API with real `/api/creator/courses`
- Add stats calculation
- Add "Create Course" button
- Real course list display

**Updated Props:**
```typescript
interface CreatorDashboardPageProps {
  userId: string
}
```

---

#### CourseCreationForm

**File:** `features/creator/components/CourseCreationForm.tsx`

**Features:**
- Minimal form fields (Quick Start)
- Form validation
- Real-time preview
- Loading state
- Success/error handling

**Props:**
```typescript
interface CourseCreationFormProps {
  onSuccess?: (course: Course) => void
  onCancel?: () => void
  isSubmitting?: boolean
}
```

**Form Fields:**
```typescript
interface CourseFormData {
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  status: 'DRAFT' | 'PUBLISHED'
}
```

---

## 📝 Implementation Plan

### Phase 1: Database & API Foundation (Priority 1)

**Tasks:**
1. Create database migration for Enrollment table
2. Extend Course model with new fields
3. Create Enrollment model service
4. Implement GET /api/courses (with filters)
5. Implement GET /api/courses/[slug]
6. Implement POST /api/courses/[slug]/enroll

**Estimated Time:** 2-3 days
**Priority:** 🔴 Critical

---

### Phase 2: Student Experience (Priority 1)

**Tasks:**
1. Create CourseCatalogPage
2. Create CourseCard component
3. Implement filtering and search
4. Implement pagination
5. Test enrollment flow end-to-end

**Estimated Time:** 2 days
**Priority:** 🔴 Critical

---

### Phase 3: Creator Experience (Priority 2)

**Tasks:**
1. Implement GET /api/creator/courses
2. Update CreatorDashboardPage
3. Create CourseCreationForm
4. Implement POST /api/creator/courses
5. Implement PUT /api/creator/courses/[slug]/publish

**Estimated Time:** 2-3 days
**Priority:** 🟡 High

---

### Phase 4: My Courses Page (Priority 3)

**Tasks:**
1. Create MyCoursesPage
2. Fetch enrolled courses via API
3. Display progress per course
4. Implement "Resume Learning" functionality

**Estimated Time:** 1 day
**Priority:** 🟢 Medium

---

## ✅ Validation Criteria

### Student Flow Validation
- [ ] Student can browse courses with filters
- [ ] Student can enroll in course successfully
- [ ] Student cannot enroll twice
- [ ] Student redirected to learn page after enrollment
- [ ] Course appears in catalog when published

### Creator Flow Validation
- [ ] Creator can see all own courses in dashboard
- [ ] Creator can create new course with minimal fields
- [ ] Course appears in creator dashboard immediately
- [ ] Creator can toggle course status (Draft/Published)

### Database Validation
- [ ] Enrollment records created correctly
- [ ] Unique constraint on (userId, courseId) enforced
- [ ] Course metadata stored correctly
- [ ] Enrollments persisted after page refresh

### API Validation
- [ ] GET /api/courses returns only published courses
- [ ] GET /api/creator/courses returns only creator's courses
- [ ] POST /api/courses/[slug]/enroll returns 409 for duplicate
- [ ] POST /api/courses/[slug]/enroll returns 401 for unauthenticated

---

## 🚀 Quick Start Guide (Creator)

### Creating First Course

1. **Navigate to Creator Dashboard:**
   ```
   http://localhost:3000/creator
   ```

2. **Click "Create Course":**
   - Button available in Quick Actions section

3. **Fill Form (Minimal):**
   ```
   Title: "Introduction to Programming"
   Description: "Learn programming basics..."
   Category: "Programming"
   Difficulty: "Beginner"
   Status: "DRAFT" (or "PUBLISHED")
   ```

4. **Click "Create Course":**
   - Course created immediately
   - Redirected to course management page

5. **Add Sections & Lessons:**
   - Use existing SectionList and LessonList components
   - Use Tiptap Editor for content

6. **Publish Course:**
   - Go to course settings
   - Toggle status to "PUBLISHED"
   - Course appears in catalog

---

## 📊 Success Metrics

### Functional Completeness
- 100% of Student enrollment flow working
- 100% of Creator course management flow working
- 100% of database operations correct

### User Experience
- Enrollment page load time < 500ms
- Course catalog filtering instant
- Form validation provides helpful feedback

### Code Quality
- All new API endpoints tested (unit + integration)
- All new components tested (component + E2E)
- No TypeScript errors
- No ESLint warnings

---

## 🎯 Next Steps

1. **Create Database Migration:**
   ```bash
   npx prisma migrate dev --name add_course_discovery
   ```

2. **Generate TypeScript Types:**
   ```bash
   npx prisma generate
   ```

3. **Implement API Endpoints:**
   - Start with public endpoints
   - Then creator endpoints
   - Add validation and error handling

4. **Build Frontend Components:**
   - CourseCatalogPage first
   - Then CourseCard
   - Then Creator dashboard

5. **Test End-to-End:**
   - Student: Browse → Enroll → Learn
   - Creator: List → Create → Publish → Manage

---

## 📚 References

- **Core CMS:** `.kiro/specs/course-content-management-v2/tasks.md` (Tasks 1-11 complete)
- **Requirements:** `.kiro/specs/course-content-management-v2/requirements.md`
- **Design:** `.kiro/specs/course-content-management-v2/design.md`
- **Implementation Summary:** `.kiro/specs/course-content-management-v2/IMPLEMENTATION_SUMMARY.md`

---

**Document Version:** 1.0
**Last Updated:** 2026-03-15
**Status:** Ready for Implementation
