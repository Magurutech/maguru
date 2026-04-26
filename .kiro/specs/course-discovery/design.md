# Design Document: Course Discovery & Enrollment

**Feature Name:** Course Discovery & Enrollment
**Sprint:** Sprint 2b
**Created:** 2026-03-16
**Version:** 1.0

---

## Architecture Overview

```
Student Flow:
  /course              → CourseCatalogPage (browse + filter)
  /course/[slug]       → CourseDetailPage (detail + enroll button)
  /student/courses     → MyCoursesPage (enrolled courses)

Creator Flow:
  /creator             → CreatorDashboardPage (updated, real data)
  /creator/courses/create → CourseCreationPage (quick start form)

API (Public):
  GET  /api/courses                    → list published courses
  GET  /api/courses/[slug]             → course detail by ID
  POST /api/courses/[slug]/enroll      → direct enrollment
  GET  /api/courses/my-courses         → student's enrolled courses

API (Creator):
  GET  /api/creator/courses            → creator's courses (existing, enhanced)
  POST /api/creator/courses            → create new course
  PUT  /api/creator/courses/[slug]/publish → toggle publish status
```

---

## Database Changes

### 1. Tambah field `difficulty` ke `courses`

Schema saat ini sudah punya `category` tapi belum ada `difficulty`.

```prisma
model courses {
  // ... existing fields ...
  difficulty  String?       @db.VarChar(50)   // NEW: "Pemula" | "Menengah" | "Mahir"
}
```

### 2. Tambah field `completed` dan `completedAt` ke `enrollments`

Schema saat ini `enrollments` hanya punya `id`, `userId`, `courseId`, `enrolledAt`.

```prisma
model enrollments {
  // ... existing fields ...
  completed   Boolean   @default(false)   // NEW
  completedAt DateTime?                   // NEW
}
```

### Migration

```bash
npx prisma migrate dev --name add_course_discovery_fields
```

---

## API Design

### GET /api/courses

**File:** `app/api/courses/route.ts`

```typescript
// Query params: page, limit, category, difficulty, search
// Returns: { courses: CourseCard[], pagination: Pagination }
// Auth: optional (enrolled status included if authenticated)
```

Response shape:
```json
{
  "courses": [{
    "id": "uuid",
    "title": "string",
    "description": "string (preview 150 chars)",
    "category": "string",
    "difficulty": "string",
    "status": "PUBLISHED",
    "sectionCount": 3,
    "lessonCount": 12,
    "enrolled": false
  }],
  "pagination": { "page": 1, "limit": 12, "total": 45, "totalPages": 4 }
}
```

### POST /api/courses/[slug]/enroll

**File:** `app/api/courses/[slug]/enroll/route.ts`

```typescript
// Auth: required (401 if not authenticated)
// Returns 409 if already enrolled
// Returns 403 if course is DRAFT
// Returns 201 with enrollment data on success
```

### GET /api/courses/my-courses

**File:** `app/api/courses/my-courses/route.ts`

```typescript
// Auth: required (401 if not authenticated)
// Returns all enrollments with course data + completion percentage
```

### POST /api/creator/courses

**File:** `app/api/creator/courses/route.ts` (tambah POST handler)

```typescript
// Auth: required, Creator/Admin role
// Body: { title, description, category, difficulty, status }
// Returns 201 with created course
```

### PUT /api/creator/courses/[slug]/publish

**File:** `app/api/creator/courses/[slug]/publish/route.ts`

```typescript
// Auth: required, must own the course
// Toggles status DRAFT ↔ PUBLISHED
// Returns updated course
```

---

## Component Design

### CourseCard

**File:** `features/course/components/CourseCard.tsx`

```typescript
interface CourseCardProps {
  course: {
    id: string
    title: string
    description: string | null
    category: string
    difficulty: string | null
    status: string
    sectionCount?: number
    lessonCount?: number
  }
  enrolled?: boolean
  onEnroll?: () => void
  showManage?: boolean  // untuk creator view
}
```

### CourseCreationForm

**File:** `features/creator/components/CourseCreationForm.tsx`

```typescript
interface CourseFormData {
  title: string
  description: string
  category: string
  difficulty: 'Pemula' | 'Menengah' | 'Mahir'
  status: 'DRAFT' | 'PUBLISHED'
}
```

---

## Pages

### app/course/page.tsx
- Server component dengan searchParams untuk filter
- Fetch dari `/api/courses` dengan query params
- Render grid CourseCard components
- Filter sidebar: category, difficulty
- Search input dengan debounce

### app/course/[slug]/page.tsx
- Server component
- Fetch course detail dari `/api/courses/[slug]`
- Tampilkan info lengkap + enroll button
- Enroll button adalah client component

### app/student/courses/page.tsx
- Server component dengan auth check
- Fetch dari `/api/courses/my-courses`
- Grid enrolled course cards dengan progress

### app/creator/courses/create/page.tsx
- Client component
- Render CourseCreationForm
- Redirect ke `/creator/courses/[id]/manage` setelah sukses

---

## Correctness Properties

1. **Enrollment Uniqueness**: Database unique constraint `@@unique([userId, courseId])` mencegah double enrollment
2. **Visibility Control**: Query catalog selalu filter `status: 'PUBLISHED'` — DRAFT tidak pernah muncul di catalog
3. **Ownership Verification**: Creator API selalu filter `creatorId: user.id` — creator tidak bisa lihat/edit kursus orang lain
4. **Auth Boundary**: Semua mutation endpoint (enroll, create, publish) require Clerk auth
5. **Cascade Delete**: `onDelete: Cascade` di enrollments memastikan data bersih saat course dihapus

---

**Document Version:** 1.0
**Last Updated:** 2026-03-16
