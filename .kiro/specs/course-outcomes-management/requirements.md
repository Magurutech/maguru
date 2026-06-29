# Requirements Document

**Feature:** Course Outcomes Management  
**Feature Name:** course-outcomes-management  
**Version:** 2.0.0 (Simplified)
**Date Updated:** 29 Juni 2026

---

## Introduction

This document specifies the requirements for the Course Outcomes Management feature. The feature migrates from mock data to real database for course learning outcomes and creator profiles, eliminating dependency on `CourseDetailMock.ts`.

**Key Changes from v1.0:**

- No separate `course_outcomes` table — outcomes stored as `String[]` array on `courses` table (PostgreSQL native)
- No stored stats — creator stats calculated dynamically via Prisma aggregation on each GET
- 5 API endpoints instead of 10 (simplified scope)
- Estimated effort reduced from 45 hours to ~17 hours

**Goals:**

1. Implement **Learning Outcomes** — `String[]` array field on existing `courses` table
2. Implement **Creator Profile** — New `creator_profiles` table with dynamic stats (no stored counts)
3. Integrate **Course Detail** — Real data on student-facing page

---

## Glossary

| Term                      | Definition                                                                                                 |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Outcome**               | A specific skill or knowledge point students will learn in a course (e.g., "Menguasai React fundamentals") |
| **Creator Profile**       | Personal and professional information of a course creator (name, title, bio, social links)                 |
| **Stats**                 | Calculated metrics: average rating, total students, total courses (never stored, computed on read)         |
| **Course Detail Page**    | Public-facing page showing course information to prospective students (`app/course/[slug]/page.tsx`)       |
| **Course Overview Panel** | Creator dashboard panel for editing course metadata (title, description, outcomes)                         |
| **Upsert**                | Database operation that either creates a new record or updates existing one based on unique constraint     |
| **XSS**                   | Cross-site scripting attack; text sanitization removes malicious scripts from user input                   |

---

## Requirements

### Business Requirements

#### BR.1: Learning Outcomes Per Course

**Requirement:** Creator can manage learning outcomes for their course

**User Story:** As a course creator, I want to manage learning outcomes for my course so that students can see what they'll learn before enrolling.

**Acceptance Criteria:**

- Creator can add/edit/delete/reorder learning outcomes in Course Overview panel
- Outcomes are saved as an ordered list per course
- Max 8 outcomes per course enforced
- Each outcome is 15-255 characters
- Empty state prompts creator to add outcomes
- Outcomes display on public course detail page
- Data comes from database — no mock fallback

---

#### BR.2: Creator Profile Management

**Requirement:** Creator can fill their profile information

**User Story:** As a course creator, I want to fill my profile so students can see my background and expertise.

**Acceptance Criteria:**

- Creator can access a profile editor from the dashboard
- Can update: Name, Title, Bio, Experience, Avatar URL, Social Links
- Profile displays on course detail page (instructor section)
- Stats (rating, students, courses) are calculated automatically — no manual entry
- Profile is optional — empty state shown if not filled
- First-time creators see a prompt to complete their profile

---

#### BR.3: Course Detail Real Data Integration

**Requirement:** Student-facing course detail shows real data

**User Story:** As a student, I want to see real creator information and learning outcomes on the course detail page.

**Acceptance Criteria:**

- Course detail shows outcomes from database
- Course detail shows real instructor profile
- No mock data fallback for outcomes and instructor
- Graceful empty state when data is missing
- Page performance unaffected (outcomes come with course row, no extra query)

---

### Functional Requirements

#### FR.1: Learning Outcomes Data Model

**Storage:** Native `String[]` array on the existing `courses` table (PostgreSQL `text[]`).

```
courses.outcomes  String[]   // array of up to 8 strings
```

**Constraints:**

- Max 8 items (validated at API layer)
- Each item: 15-255 characters
- No leading/trailing whitespace
- Array index = display order (no separate order field needed)
- Cascade delete is automatic (part of courses row — no extra migration)

---

#### FR.2: Creator Profile Data Model

**Storage:** New `creator_profiles` table.

```
creator_profiles {
  id          String   PK
  userId      String   unique  // Clerk user ID
  name        String?          // max 100 chars
  title       String?          // max 100 chars
  bio         String?          // max 500 chars
  experience  String?          // max 1000 chars
  avatarUrl   String?          // valid HTTPS URL
  socialLinks Json?            // { linkedin, github, portfolio, twitter }
  createdAt   DateTime
  updatedAt   DateTime

  // NO stored rating/studentsCount/coursesCount
  // Stats are calculated dynamically via Prisma aggregation
}
```

**Constraints:**

- All fields except `userId` are optional
- Stats are calculated on read (Prisma `_count`, `_avg`) — never stored
- Social link URLs must be valid HTTP(S)
- Text fields sanitized against XSS

---

#### FR.3: Learning Outcomes Editor Component

**Location:** Course Overview Card → left column, **above** Description Editor

**Behavior:**

- Full array managed in local component state
- Add / inline-edit / delete / reorder (up/down buttons)
- One `PATCH /api/courses/[slug]` call saves the final array on every change
- Character counter per item (15-255)
- Item counter badge `(n/8)`
- Empty state CTA: "Tambahkan apa yang akan siswa pelajari"

---

#### FR.4: Creator Profile Editor

**Location:** Creator Dashboard → new `/creator/profile` page

**Behavior:**

- Form with all optional fields
- Stats section read-only (loaded from server aggregation)
- `PUT /api/creator/profile` uses Prisma upsert — no POST/PUT split
- Success toast on save
- Cancel to discard changes

---

#### FR.5: Learning Outcomes API

**Single endpoint change** — extend the existing `PATCH /api/courses/[slug]`:

| Method | Endpoint              | Purpose                                   |
| ------ | --------------------- | ----------------------------------------- |
| PATCH  | `/api/courses/[slug]` | Update title / description / **outcomes** |
| GET    | `/api/courses/[slug]` | Returns course including `outcomes[]`     |

The `PATCH` body accepts `{ outcomes: string[] }` in addition to `title`/`description`.
The `GET` response adds `outcomes` to the existing select.

No new route files needed for outcomes.

---

#### FR.6: Creator Profile API

| Method | Endpoint                        | Auth   | Purpose                        |
| ------ | ------------------------------- | ------ | ------------------------------ |
| GET    | `/api/creator/profile`          | ✅ own | Fetch own profile + live stats |
| PUT    | `/api/creator/profile`          | ✅ own | Upsert own profile             |
| GET    | `/api/creator/profile/[userId]` | None   | Public profile                 |
| GET    | `/api/courses/[slug]/creator`   | None   | Creator info for course detail |

Stats calculation example:

```typescript
const [agg, studentCount] = await Promise.all([
  prisma.courses.aggregate({
    where: { creatorId, status: 'PUBLISHED' },
    _avg: { rating: true },
    _count: { id: true },
  }),
  prisma.enrollments.count({ where: { courses: { creatorId } } }),
])
```

---

#### FR.7: Course Detail Page Updates

**Changes to:** `app/course/[slug]/page.tsx`

```typescript
// Parallel fetch — add outcomes + creator
const [course, sections, creator] = await Promise.all([
  fetchCourseDetail(slug), // already includes outcomes[]
  fetchCourseSections(slug), // existing
  fetchCourseCreator(slug), // NEW: GET /api/courses/[slug]/creator
])

// Remove:
// const mockData = getCourseDetailMock(slug, course.category)
```

- Pass `course.outcomes` to `UnifiedDescriptionSection`
- Pass `creator` to `PremiumSidebar` (replaces `mockData.instructor`)
- Remove `CourseDetailMock` import

---

### Technical Requirements

#### TR.1: Database Migration

Changes required:

1. `ALTER TABLE courses ADD COLUMN outcomes text[] DEFAULT '{}'`
   → Prisma migration: add `outcomes String[]` to courses model
2. `CREATE TABLE creator_profiles (...)` with fields from FR.2

No data migration needed — existing courses start with empty `outcomes` array.

---

#### TR.2: API Error Handling

Standard error shape:

```json
{ "error": "Human-readable message", "code": "SNAKE_CASE_CODE" }
```

Codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `INTERNAL_ERROR`

---

#### TR.3: Authorization

- Outcomes: only course `creatorId` can write (matches existing PATCH authorization)
- Creator profile: only own `userId` can write
- Read: public for published courses

---

#### TR.4: Validation

**Outcomes array:**

- `outcomes.length <= 8` → 400 VALIDATION_ERROR
- Each `outcome.trim().length >= 15 && <= 255` → 400 VALIDATION_ERROR
- Strip XSS (`<script>`, `javascript:`, `onclick=`)

**Profile fields:**

- `name`, `title`: 1-100 chars if present
- `bio`: 0-500 chars
- `experience`: 0-1000 chars
- `avatarUrl`, social URLs: must match `^https?://`

---

### UI/UX Requirements

#### UR.1: Learning Outcomes Editor

**Empty State:**

```
Yang Akan Anda Pelajari
Belum ada outcome. Klik untuk menambahkan poin pembelajaran.
[+ Tambah Outcome]
```

**Filled State:**

```
Yang Akan Anda Pelajari                    (3/8)
[↕] Menguasai React fundamentals  [✎][✕]
[↕] Membangun reusable component  [✎][✕]
[+ Tambah Outcome]
```

---

#### UR.2: Creator Profile

- Form: Name, Title, Bio, Experience, Avatar URL, Social Links
- Stats section (read-only): Rating ⭐ | Students | Courses
- [Simpan] button with loading spinner, [Batal] to discard

---

#### UR.3: Course Detail

- Show `outcomes[]` as checklist under "Yang Akan Anda Pelajari"
- Show instructor card with real profile data
- Empty state if no outcomes: section hidden (not shown empty)
- Empty state if no profile: show generic "Instruktur" placeholder

---

### MVP Acceptance Criteria

- [ ] Add `outcomes String[]` to Prisma `courses` model and migrate
- [ ] `PATCH /api/courses/[slug]` accepts and saves `outcomes`
- [ ] `GET /api/courses/[slug]` returns `outcomes`
- [ ] Create `creator_profiles` table and migrate
- [ ] `PUT /api/creator/profile` upserts profile
- [ ] `GET /api/courses/[slug]/creator` returns profile + live stats
- [ ] `LearningOutcomesEditor` component working in Course Overview panel
- [ ] `CreatorProfileEditor` component accessible from dashboard
- [ ] `CourseOverview.tsx` shows outcomes section above description
- [ ] `app/course/[slug]/page.tsx` uses real outcomes + real creator
- [ ] Mock data no longer used for outcomes or instructor

---

### Out of Scope

- Rich text editor for bio (plain textarea is enough)
- Profile photo upload (URL input only)
- Drag-drop reordering (up/down buttons are sufficient)
- AI-suggested outcomes
- Bulk import from CSV

---

**Document Version:** 2.0.0  
**Updated:** 29 Juni 2026  
**Status:** Simplified & Ready for Implementation
