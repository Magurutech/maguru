# Course Outcomes Management - Design

**Feature Name:** course-outcomes-management  
**Version:** 2.0.0 (Simplified)
**Date Updated:** 29 Juni 2026  
**Change:** Simplified per evaluation — no extra tables, dynamic stats

---

## 🏛️ System Architecture

### Data Flow Diagram

```
Creator Side:                          Student Side:
┌───────────────────────┐              ┌──────────────────────┐
│ CourseOverview Panel  │              │ Course Detail Page   │
│ - Outcomes Editor     │              │ - Outcomes Display   │
│ - Description Editor  │              │ - Instructor Card    │
└──────────┬────────────┘              └──────────┬───────────┘
           │                                      │
           │ PUT /api/courses/[slug]              │ GET /api/courses/[slug]
           │ { outcomes: string[] }               │ + GET /api/courses/[slug]/creator
           │                                      │
           ▼                                      ▼
┌─────────────────────────────────────────────────────────────┐
│  API LAYER (Next.js Route Handlers)                          │
│                                                              │
│  PUT  /api/courses/[slug]           (update title/desc/outcomes)
│  GET  /api/courses/[slug]/creator   (public creator info)   │
│  GET  /api/creator/profile          (own profile, authed)   │
│  PUT  /api/creator/profile          (upsert own profile)    │
│  GET  /api/creator/profile/[userId] (public profile)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  DATABASE (Prisma + PostgreSQL)                              │
│                                                              │
│  courses table (existing):          creator_profiles table: │
│  + outcomes  String[]  ← NEW ONLY   - id (PK)              │
│    (native Postgres array)           - userId (unique)       │
│                                      - name, title, bio     │
│                                      - experience           │
│                                      - avatarUrl            │
│                                      - socialLinks (Json)   │
│                                      NO stored stats ←lean  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Database Schema

### 1. Extend `courses` Table (ADD ONE COLUMN)

No new table needed. Add `outcomes` directly to existing `courses` model.

```prisma
// prisma/schema.prisma — Add to existing model courses
model courses {
  id          String        @id
  slug        String        @unique @db.VarChar(150)
  title       String        @db.VarChar(100)
  description String
  outcomes    String[]      // ← NEW: array of outcome strings
  thumbnail   String?       @db.VarChar(255)
  status      CourseStatus  @default(DRAFT)
  students    Int           @default(0)
  lessons     Int           @default(0)
  duration    String        @default("0 jam")
  rating      Float         @default(0.0)
  category    String        @db.VarChar(50)
  difficulty  String?       @db.VarChar(50)
  creatorId   String        @db.VarChar(255)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime
  enrollments enrollments[]
  sections    sections[]

  @@index([status])
  @@index([category])
  @@index([difficulty])
}
```

**Key Design Decisions:**

- PostgreSQL native `text[]` array — no join, no cascade, no migration complexity
- Frontend manages full array in local state (add/edit/delete/reorder)
- Single `PUT /api/courses/[slug]` to save the final array
- Max 8 items enforced at API layer (validate `outcomes.length <= 8`)

---

### 2. New `creator_profiles` Table

```prisma
model creator_profiles {
  id          String   @id @default(cuid())
  userId      String   @unique @db.VarChar(255)   // Clerk user ID
  name        String?  @db.VarChar(100)
  title       String?  @db.VarChar(100)
  bio         String?  @db.Text
  experience  String?  @db.Text
  avatarUrl   String?  @db.VarChar(500)
  socialLinks Json?    // { linkedin, github, portfolio, twitter }
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // NO stored rating/studentsCount/coursesCount
  // → calculated on-the-fly via Prisma aggregation
}
```

**Key Design Decisions:**

- No stored `rating`, `studentsCount`, `coursesCount` — prevents data drift
- Stats aggregated live via Prisma `_count` and `_avg` on each GET profile call
- Short-lived memory cache (60s) added at API layer to prevent N+1 on course detail
- JSON for social links: flexible, no extra table needed

---

## 🛣️ API Route Design

### Simplified Endpoints (5 total, down from 10)

#### 1. `PUT /api/courses/[slug]` — Update course incl. outcomes

Extend the **existing** PATCH handler. Already handles `title` and `description`.
Just add `outcomes` to the accepted fields.

```
Request:
  PUT /api/courses/react-fundamentals
  Authorization: Bearer token (course owner)
  Content-Type: application/json

{
  "outcomes": [
    "Menguasai konsep dasar React",
    "Membangun component reusable",
    "Mengintegrasikan REST API"
  ]
}

Response (200):
{
  "id": "course-123",
  "slug": "react-fundamentals",
  "title": "React Fundamentals",
  "outcomes": [
    "Menguasai konsep dasar React",
    "Membangun component reusable",
    "Mengintegrasikan REST API"
  ],
  ...
}

Validation errors (400):
{
  "error": "Maximum 8 outcomes allowed",
  "code": "VALIDATION_ERROR"
}
{
  "error": "Each outcome must be 15-255 characters",
  "code": "VALIDATION_ERROR"
}
```

Note: existing `GET /api/courses/[slug]` already returns course data.
Add `outcomes` to the SELECT query to expose it.

---

#### 2. `GET /api/courses/[slug]/creator` — Creator info for course

New public endpoint. Returns creator profile + live-calculated stats.

```
Request:
  GET /api/courses/react-fundamentals/creator

Response (200):
{
  "name": "Wira Kusuma",
  "title": "Senior Software Engineer",
  "bio": "Passionate about building...",
  "avatarUrl": "https://example.com/avatar.jpg",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/wira",
    "github": "https://github.com/wira"
  },
  "stats": {
    "rating": 4.8,         // avg from courses.rating
    "studentsCount": 1420, // sum of enrollments for this creator
    "coursesCount": 5      // count of published courses
  }
}

Response (200, no profile set):
{
  "name": null,
  "title": null,
  "bio": null,
  "avatarUrl": null,
  "socialLinks": null,
  "stats": { "rating": 0, "studentsCount": 0, "coursesCount": 0 }
}
```

Implementation (Prisma aggregation):

```typescript
// In API handler — no stored stats needed
const [profile, stats] = await Promise.all([
  prisma.creator_profiles.findUnique({ where: { userId: course.creatorId } }),
  prisma.courses.aggregate({
    where: { creatorId: course.creatorId, status: 'PUBLISHED' },
    _avg: { rating: true },
    _count: { id: true },
  }),
  prisma.enrollments.count({
    where: { courses: { creatorId: course.creatorId } },
  }),
])
```

---

#### 3. `GET /api/creator/profile` — Own profile (authenticated)

```
Request:
  GET /api/creator/profile
  Authorization: Bearer token

Response (200):
{
  "id": "prof-1",
  "userId": "user-123",
  "name": "Wira Kusuma",
  "title": "Senior Software Engineer",
  "bio": "...",
  "experience": "...",
  "avatarUrl": "...",
  "socialLinks": { ... },
  "stats": {
    "rating": 4.8,
    "studentsCount": 1420,
    "coursesCount": 5
  }
}

Response (200, profile not created yet):
{ "profile": null }
```

---

#### 4. `PUT /api/creator/profile` — Upsert own profile

Single endpoint handles both create and update (upsert).

```
Request:
  PUT /api/creator/profile
  Authorization: Bearer token

{
  "name": "Wira Kusuma",
  "title": "Senior Software Engineer",
  "bio": "Passionate about building...",
  "experience": "10+ years in software development",
  "avatarUrl": "https://example.com/avatar.jpg",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/wira",
    "github": "https://github.com/wira"
  }
}

Response (200):
{
  "id": "prof-1",
  "userId": "user-123",
  "name": "Wira Kusuma",
  ...
}
```

Implementation:

```typescript
// Prisma upsert — handles both POST and PUT in one call
await prisma.creator_profiles.upsert({
  where: { userId },
  create: { userId, ...sanitizedData },
  update: { ...sanitizedData, updatedAt: new Date() },
})
```

---

#### 5. `GET /api/creator/profile/[userId]` — Public profile

```
Request:
  GET /api/creator/profile/user-123

Response (200):
{
  "name": "Wira Kusuma",
  "title": "Senior Software Engineer",
  "bio": "...",
  "avatarUrl": "...",
  "socialLinks": { ... },
  "stats": { "rating": 4.8, "studentsCount": 1420, "coursesCount": 5 }
}
```

---

## 🎨 Component Architecture

### LearningOutcomesEditor

**Location:** `features/cms/components/creator/manage/panels/LearningOutcomesEditor.tsx`

**Props:**

```typescript
interface LearningOutcomesEditorProps {
  courseSlug: string
  initialOutcomes: string[] // simple string[], not CourseOutcome[]
}
```

**State Model (pure local):**

```typescript
// All edits happen locally — one PUT to save final array
const [outcomes, setOutcomes] = useState<string[]>(initialOutcomes)
const [draft, setDraft] = useState('') // new item being typed
const [editIdx, setEditIdx] = useState<number | null>(null)
const [isSaving, setIsSaving] = useState(false)
```

**Operations (no per-item API calls):**

- Add: `setOutcomes([...outcomes, draft.trim()])` → PUT full array
- Edit: update index in local array → PUT full array
- Delete: filter out index → PUT full array
- Reorder: swap indices → PUT full array

**Save function:**

```typescript
async function saveOutcomes(next: string[]) {
  setIsSaving(true)
  await fetch(`/api/courses/${courseSlug}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ outcomes: next }),
  })
  setIsSaving(false)
}
```

**UI:**

```
┌─────────────────────────────────────────────┐
│ Yang Akan Anda Pelajari                     │
├─────────────────────────────────────────────┤
│ [↕] Menguasai React fundamentals  [✎][✕]   │
│ [↕] Membangun reusable component  [✎][✕]   │
│ [↕] Integrasi API REST           [✎][✕]    │
│                                              │
│ [+ Tambah Outcome]           (3/8)          │
└─────────────────────────────────────────────┘
```

---

### CreatorProfileEditor

**Location:** `features/creator-dashboard/components/CreatorProfileEditor.tsx`

**Props:**

```typescript
interface CreatorProfileEditorProps {
  initialProfile?: CreatorProfile | null
}
```

**State:**

```typescript
const [form, setForm] = useState({
  name: '',
  title: '',
  bio: '',
  experience: '',
  avatarUrl: '',
  socialLinks: { linkedin: '', github: '', portfolio: '', twitter: '' },
})
const [stats, setStats] = useState({ rating: 0, studentsCount: 0, coursesCount: 0 })
```

**Save:** `PUT /api/creator/profile` (upsert)

**Stats:** fetched from `GET /api/creator/profile`, calculated server-side via aggregation

---

### Course Overview Panel — Layout Change

**New Layout (left column):**

```
Left (col-span-7):
  ┌───────────────────────┐
  │ LearningOutcomesEditor│  ← NEW (above description)
  └───────────────────────┘
  ┌───────────────────────┐
  │ DescriptionEditor     │  ← existing
  └───────────────────────┘
```

Right column (col-span-5) stats + AI advisor remain unchanged.

---

## 🔒 Authorization

| Operation                          | Auth               | Ownership           |
| ---------------------------------- | ------------------ | ------------------- |
| Update outcomes (via PATCH course) | ✅                 | course creator only |
| View outcomes                      | Public (published) | —                   |
| GET creator profile (public)       | None               | —                   |
| PUT creator profile                | ✅                 | own profile only    |
| GET own creator profile            | ✅                 | —                   |

---

## 📊 Performance

### Stats Aggregation

Live Prisma aggregation is fast for small-to-medium scale:

```typescript
// Typical creator has < 20 courses, < 5000 students
// Query completes < 50ms with proper indexes
const [avgRating, courseCount, studentCount] = await Promise.all([
  prisma.courses.aggregate({
    where: { creatorId, status: 'PUBLISHED' },
    _avg: { rating: true },
    _count: { id: true },
  }),
  prisma.enrollments.count({
    where: { courses: { creatorId } },
  }),
])
```

**When to add cache:** If course detail page load shows > 200ms for stats,
add a 60-second in-memory cache (simple `Map<userId, {data, expires}>`).
Do NOT add caching prematurely — YAGNI.

### Course Data with Outcomes

`GET /api/courses/[slug]` already returns course row.
Adding `outcomes` to SELECT adds zero extra queries (single row, native array column).

---

## 🧪 Testing Strategy

### What to Test

**API:**

- `PATCH /api/courses/[slug]` saves `outcomes` array correctly
- Validates max 8 items, each 15-255 chars
- Authorization: only course owner can update
- `GET /api/courses/[slug]` returns `outcomes` in response
- `PUT /api/creator/profile` upserts correctly
- `GET /api/courses/[slug]/creator` returns live stats

**Components:**

- LearningOutcomesEditor: add/edit/delete/reorder updates local state
- LearningOutcomesEditor: calls PUT with correct final array
- CreatorProfileEditor: form submission triggers PUT

**E2E:**

- Creator adds outcomes → student sees on course detail
- Creator saves profile → course detail shows real instructor info

---

**Document Version:** 2.0.0  
**Updated:** 29 Juni 2026  
**Status:** Simplified & Ready for Implementation
