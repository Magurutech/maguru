# Course Management System (CMS)

Dokumentasi fitur untuk sistem manajemen konten kursus Maguru.

**Status:** In Development  
**Current Sprint:** Sprint 2 - Content First  
**Last Updated:** 2026-03-07

---

## 📋 Ringkasan

CMS memungkinkan creator membuat, mengedit, dan mempublikasikan kursus dengan struktur pembelajaran yang terorganisir.

### Arsitektur Saat Ini (Sprint 2)
- **Database (Prisma + Supabase)** → Semua data (metadata + content)
- **Content Storage** → JSON field di database dengan versioning metadata
- **Editor** → Tiptap rich markdown editor

### Arsitektur Future (Sprint 3+)
- **GitHub Repository** → Optional backup dan version control
- **Supabase** → Primary storage untuk performance
- **Hybrid Approach** → Best of both worlds

---

## 🏗️ Arsitektur Sistem

### Sprint 2 Architecture (Current)

```
┌─────────────────────────────────────────────────┐
│    Course Management Architecture (Sprint 2)  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────────┐         ┌──────────────┐      │
│  │  Frontend  │────────▶│  API Routes  │      │
│  │  (Next.js) │         │  (Next.js)   │      │
│  └────────────┘         └──────────────┘      │
│       │                        │               │
│       │                        ▼               │
│       │              ┌──────────────────┐     │
│       │              │  Prisma Client   │     │
│       │              └──────────────────┘     │
│       │                        │               │
│       ▼                        ▼               │
│  ┌─────────────────────────────────────┐      │
│  │     Database (Supabase/PostgreSQL)  │      │
│  │  ┌─────────────────────────────┐    │      │
│  │  │ Course, Section, Lesson     │    │      │
│  │  │ LessonProgress, Completion  │    │      │
│  │  │ Content (JSON with metadata)│    │      │
│  │  └─────────────────────────────┘    │      │
│  └─────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

### Future Architecture (Sprint 3+)

```
┌─────────────────────────────────────────────────┐
│    Course Management Architecture (Future)    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌────────────┐         ┌──────────────┐      │
│  │  Frontend  │────────▶│  API Routes  │      │
│  │  (Next.js) │         │  (Next.js)   │      │
│  └────────────┘         └──────────────┘      │
│                                │               │
│                    ┌───────────┴───────────┐   │
│                    ▼                       ▼   │
│         ┌──────────────────┐    ┌──────────────┐
│         │  Prisma Client   │    │ GitHub API   │
│         └──────────────────┘    └──────────────┘
│                    │                       │   │
│                    ▼                       ▼   │
│         ┌──────────────────┐    ┌──────────────┐
│         │    Supabase      │    │ GitHub Repo  │
│         │  (Primary Store) │    │  (Backup &   │
│         │                  │    │   Versioning)│
│         └──────────────────┘    └──────────────┘
└─────────────────────────────────────────────────┘
```

---

## 🎯 Gambaran Besar Fitur

### ✅ Sprint 2: Content First (Current Implementation)

#### 1. Course Structure Management
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Creator dapat membuat struktur hierarki course dengan sections dan lessons.

**Komponen yang Dibangun:**
- Section CRUD (Create, Read, Update, Delete)
- Lesson CRUD dengan markdown content
- Integer-based ordering (up/down buttons)
- Database schema: Course → Section → Lesson

**Fitur:**
- Create section dengan title dan description
- Create lesson dengan title dan markdown content
- Reorder sections dan lessons (up/down)
- Delete sections dan lessons
- View section/lesson list

---

#### 2. Markdown Editor dengan Preview
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Rich markdown editor untuk menulis materi pembelajaran.

**Komponen yang Dibangun:**
- Tiptap editor integration
- Minimal toolbar (Bold, Italic, Headings, Lists, Links, Code)
- Real-time preview panel
- JSON content storage dengan metadata

**Fitur:**
- Rich text editing dengan toolbar
- Markdown shortcuts support
- Live preview rendering
- Auto-save (future)
- Version metadata tracking

---

#### 3. Student Learn Page
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Interface untuk siswa membaca konten dan track progress.

**Komponen yang Dibangun:**
- Section navigation sidebar
- Lesson content viewer
- Progress tracking UI
- "Mark as Complete" button

**Fitur:**
- Browse sections dan lessons
- Read markdown content dengan syntax highlighting
- Mark lesson as complete (manual)
- View course completion percentage
- Resume from last lesson

---

#### 4. Progress Tracking System
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Sistem pelacakan kemajuan belajar siswa.

**Komponen yang Dibangun:**
- LessonProgress model (per lesson per user)
- CourseCompletion model (per course per user)
- Progress calculation logic
- Persistent storage di database

**Fitur:**
- Track lesson completion status
- Calculate course completion percentage
- Persist progress across sessions
- Resume learning from last position

---

### 🔄 Sprint 3+: Advanced Features (Planned)

#### 5. Quiz Builder & Assessment
**Status:** 🔜 Planned (Sprint 3)

**Deskripsi:** Interface untuk membuat dan mengelola quiz.

**Komponen yang Akan Dibangun:**
- Multiple choice question builder
- Quiz scoring engine
- AI feedback integration (LangServe)
- Quiz progress tracking

**Fitur:**
- Create quiz dengan multiple questions
- Set passing threshold (default 70%)
- Automatic scoring
- AI-powered feedback
- Review flow untuk failed quizzes

---

#### 6. Video Content Support
**Status:** 🔜 Planned (Sprint 3+)

**Deskripsi:** Support untuk video content dalam lessons.

**Komponen yang Akan Dibangun:**
- Video upload interface
- Video player dengan controls
- Video progress tracking
- Subtitle support

**Fitur:**
- Upload video files
- Embed video URLs (YouTube, Vimeo)
- Track video watch progress
- Video playback controls
- Subtitle/caption support

---

#### 7. GitHub Integration
**Status:** 🔜 Planned (Sprint 4+)

**Deskripsi:** Integrasi dengan GitHub untuk version control dan backup.

**Komponen yang Akan Dibangun:**
- GitHub API integration
- Auto-commit on save
- Pull request workflow
- Webhook handlers

**Fitur:**
- Auto-sync content to GitHub
- Version control untuk content
- Backup dan restore
- Collaborative editing support

---

#### 8. Publish & Review Workflow
**Status:** 🔜 Planned (Sprint 4+)

**Deskripsi:** Workflow publikasi dengan review dan approval.

**Komponen yang Akan Dibangun:**
- Submit for review interface
- Admin review dashboard
- Approval/rejection workflow
- Status tracking

**Fitur:**
- Submit course for review
- Admin can review and approve
- Status: Draft, Pending Review, Published
- Notification system

---

## 📊 Implementation Status

### Sprint 2 Progress

| Feature | Status | Progress |
|---------|--------|----------|
| Database Schema | 🔄 In Progress | 0% |
| API Routes | ⏳ Not Started | 0% |
| Creator Dashboard Update | ⏳ Not Started | 0% |
| Student Learn Page | ⏳ Not Started | 0% |
| Tiptap Editor | ⏳ Not Started | 0% |
| Progress Tracking | ⏳ Not Started | 0% |

### Future Sprints

| Feature | Sprint | Status |
|---------|--------|--------|
| Quiz System | Sprint 3 | 🔜 Planned |
| Video Content | Sprint 3+ | 🔜 Planned |
| GitHub Integration | Sprint 4+ | 🔜 Planned |
| Publish Workflow | Sprint 4+ | 🔜 Planned |
| Drag-drop Reordering | Sprint 4+ | 🔜 Planned |
| Image Upload | Sprint 4+ | 🔜 Planned |

---

## 🎨 UI/UX Guidelines

### Dashboard Layout
```
- Card-based course list dengan filter (difficulty, status)
- Quick actions: Create course, View details
- Stats summary: Total courses, Published, Drafts
- Responsive: Stack cards pada mobile
```

### Editor Layout
```
- 3-column layout: Structure | Editor | Preview
- Structure panel: Drag-drop sections/items
- Editor panel: Full-screen markdown editor
- Preview panel: Sticky right panel
- Split-view untuk wide screen
```

### Keyboard Shortcuts
```
- Ctrl+S: Save & sync ke GitHub
- Ctrl+P: Preview toggle
- Ctrl+/: Command palette
- Ctrl+K: Insert link
- Ctrl+I: Insert image
```

---

## 🚀 API Endpoints

### Sprint 2: Implemented Endpoints

#### Course Structure Management
```
GET    /api/courses/[slug]/sections
       - List semua sections dalam course
       - Response: Array of sections dengan order

POST   /api/courses/[slug]/sections
       - Create section baru
       - Body: { title, description, order }
       - Response: Created section object

PUT    /api/courses/[slug]/sections/[sectionId]
       - Update section (title, description, order)
       - Body: { title?, description?, order? }
       - Response: Updated section object

DELETE /api/courses/[slug]/sections/[sectionId]
       - Hapus section dan semua lessons di dalamnya
       - Response: Success message
```

#### Lesson Management
```
GET    /api/courses/[slug]/sections/[sectionId]/lessons
       - List semua lessons dalam section
       - Response: Array of lessons dengan order

POST   /api/courses/[slug]/sections/[sectionId]/lessons
       - Create lesson baru
       - Body: { title, content: { markdown, version, lastEdit }, order }
       - Response: Created lesson object

GET    /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
       - Get lesson detail dengan content
       - Response: Lesson object dengan full content

PUT    /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
       - Update lesson (title, content, order)
       - Body: { title?, content?, order? }
       - Response: Updated lesson object

DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
       - Hapus lesson
       - Response: Success message
```

#### Progress Tracking
```
POST   /api/progress/lesson/[lessonId]/complete
       - Mark lesson sebagai complete
       - Body: { userId } (dari auth)
       - Response: Updated progress object

GET    /api/progress/course/[slug]
       - Get course completion untuk user
       - Response: { percentage, completedLessons, totalLessons, completed }

GET    /api/progress/lesson/[lessonId]
       - Get lesson progress status untuk user
       - Response: { completed, completedAt }
```

### Sprint 3+: Planned Endpoints

#### Quiz Management (Sprint 3)
```
POST   /api/courses/[slug]/lessons/[lessonId]/quiz
       - Create quiz untuk lesson
       - Body: { title, threshold, questions[] }

GET    /api/quizzes/[quizId]
       - Get quiz dengan questions

POST   /api/quizzes/[quizId]/submit
       - Submit quiz answers
       - Body: { answers[] }
       - Response: { score, passed, feedback }
```

#### GitHub Integration (Sprint 4+)
```
POST   /api/cms/github/sync
       - Manual sync ke GitHub
       - Body: { courseId }

POST   /api/cms/github/webhook
       - GitHub webhook handler
       - Body: GitHub webhook payload

GET    /api/cms/github/status
       - Cek status GitHub connection
       - Response: { connected, lastSync, repo }
```

---

## 🔗 Data Storage

### Sprint 2: Database-First Approach

#### Content Storage Structure
```json
{
  "markdown": "# Heading\n\nContent here with **bold** and *italic*...",
  "version": 1,
  "lastEdit": "2026-03-07T10:00:00Z"
}
```

**Keuntungan:**
- Fast access (no external API calls)
- Simple implementation
- Easy to query and filter
- Built-in versioning metadata

**Database Schema (Prisma):**
```prisma
model Section {
  id          String   @id @default(uuid())
  courseId    String
  order       Int
  title       String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  course      Course   @relation(fields: [courseId], references: [id])
  lessons     Lesson[]
}

model Lesson {
  id          String   @id @default(uuid())
  sectionId   String
  order       Int
  title       String
  content     Json     // JSON dengan metadata
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  section     Section   @relation(fields: [sectionId], references: [id])
  progress    LessonProgress[]
}

model LessonProgress {
  id          String   @id @default(uuid())
  lessonId    String
  userId      String
  completed   Boolean  @default(false)
  completedAt DateTime?
  createdAt   DateTime @default(now())
  
  lesson      Lesson   @relation(fields: [lessonId], references: [id])
  
  @@unique([lessonId, userId])
}

model CourseCompletion {
  id           String   @id @default(uuid())
  courseId     String
  userId       String
  percentage   Float    @default(0)
  completed    Boolean  @default(false)
  completedAt  DateTime?
  createdAt    DateTime @default(now())
  
  @@unique([courseId, userId])
}
```

### Sprint 4+: Hybrid Approach (Planned)

#### GitHub Repository Structure
```
maguru-course-content/
├── courses/
│   ├── [course-slug]/
│   │   ├── metadata.json
│   │   ├── section-01/
│   │   │   ├── lesson-01.md
│   │   │   ├── lesson-02.md
│   │   │   └── quiz-01.json
│   │   ├── section-02/
│   │   └── assets/
│   │       ├── images/
│   │       └── videos/
│   └── README.md
```

**Workflow:**
1. Creator edits content di web editor
2. Content saved to database (primary)
3. Background job syncs to GitHub (backup)
4. GitHub webhook updates database on external changes

---

## 📝 Error Handling

### GitHub Errors
```
Token Invalid/Expired → Prompt generate new token
Repository Not Found → Redirect ke setup page
Commit Failed → Show error, allow retry
Rate Limit Exceeded → Queue request, retry with backoff
Merge Conflict → Show diff, allow manual resolve
```

### Concurrent Editing
```
Lock table di Supabase (course_locks):
- Acquire lock saat buka editor
- Show: "Sedang diedit oleh {user}" jika locked
- Release lock saat close/simpan
- Auto-release setelah 5 menit inactivity
```

---

## 🎯 Checklist Implementasi

### ✅ Sprint 2: Content First (In Progress)

#### Phase 1: Database Schema
- [ ] Buat Section model di Prisma schema
- [ ] Buat Lesson model di Prisma schema
- [ ] Buat LessonProgress model di Prisma schema
- [ ] Buat CourseCompletion model di Prisma schema
- [ ] Update Course model dengan Section relation
- [ ] Run Prisma migration
- [ ] Create seed script untuk testing data

#### Phase 2: Backend API
- [ ] Section CRUD endpoints
  - [ ] POST /api/courses/[slug]/sections
  - [ ] GET /api/courses/[slug]/sections
  - [ ] PUT /api/courses/[slug]/sections/[sectionId]
  - [ ] DELETE /api/courses/[slug]/sections/[sectionId]
- [ ] Lesson CRUD endpoints
  - [ ] POST /api/courses/[slug]/sections/[sectionId]/lessons
  - [ ] GET /api/courses/[slug]/sections/[sectionId]/lessons
  - [ ] GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
  - [ ] PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
  - [ ] DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
- [ ] Progress tracking endpoints
  - [ ] POST /api/progress/lesson/[lessonId]/complete
  - [ ] GET /api/progress/course/[slug]
  - [ ] GET /api/progress/lesson/[lessonId]

#### Phase 3: Frontend Components
- [ ] Creator Dashboard updates
  - [ ] Section list component
  - [ ] Section create/edit form
  - [ ] Lesson list component
  - [ ] Lesson create/edit form
  - [ ] Tiptap editor integration
  - [ ] Preview panel
  - [ ] Reorder up/down buttons
- [ ] Student Learn Page
  - [ ] Section navigation sidebar
  - [ ] Lesson content viewer
  - [ ] Markdown renderer dengan syntax highlighting
  - [ ] "Mark as Complete" button
  - [ ] Progress bar component
  - [ ] Course completion tracker

#### Phase 4: Testing & Polish
- [ ] Unit tests untuk API routes
- [ ] Integration tests untuk CRUD operations
- [ ] E2E tests untuk creator workflow
- [ ] E2E tests untuk student learning flow
- [ ] Performance testing
- [ ] UI/UX polish

---

### 🔜 Sprint 3: Quiz & Assessment (Planned)

#### Phase 1: Quiz System
- [ ] Quiz database schema
- [ ] QuizQuestion dan QuizAnswer models
- [ ] Quiz CRUD endpoints
- [ ] Quiz builder UI
- [ ] Quiz taking interface
- [ ] Scoring engine

#### Phase 2: AI Integration
- [ ] LangServe integration untuk feedback
- [ ] Hint system dengan cooldown
- [ ] Review flow untuk failed quizzes

---

### 🔜 Sprint 4+: Advanced Features (Planned)

#### Video Content
- [ ] Video upload support
- [ ] Video player integration
- [ ] Video progress tracking

#### GitHub Integration
- [ ] GitHub API setup
- [ ] Auto-sync workflow
- [ ] Webhook handlers
- [ ] Version control UI

#### Advanced Editor
- [ ] Image upload
- [ ] Table support
- [ ] Drag-drop reordering
- [ ] Collaborative editing

---

## 📚 Referensi

### Internal Documentation
- Sprint 2 Task List: `docs/task/sprint-2.md`
- Sprint 2 Description: `docs/rules/desc.md`
- Technical Decisions: `docs/rules/task.md`
- Project Requirements: `docs/rules/project.md`
- Architecture Overview: `CLAUDE.md`

### Sprint Planning
- Sprint 3 (Quiz): `docs/task/sprint-3.md`
- Quiz Feature Spec: `docs/feat/quiz.md`

### External Resources
- Prisma Documentation: https://www.prisma.io/docs
- Supabase Documentation: https://supabase.com/docs
- Tiptap Editor: https://tiptap.dev/
- Next.js App Router: https://nextjs.org/docs/app
- Markdown Guide: https://www.markdownguide.org/

---

## 📊 Development Timeline

| Sprint | Focus | Duration | Status |
|--------|-------|----------|--------|
| Sprint 1 | Foundation & Auth | 2 weeks | ✅ Completed |
| Sprint 2 | Content Structure | 3 weeks | 🔄 In Progress |
| Sprint 3 | Quiz & Assessment | 3 weeks | 🔜 Planned |
| Sprint 4 | Video & GitHub | 3 weeks | 🔜 Planned |
| Sprint 5 | Polish & Launch | 2 weeks | 🔜 Planned |

---

## 🎯 Success Metrics

### Sprint 2 Goals

**Creator Metrics:**
- Creator dapat membuat minimal 3 sections per course
- Creator dapat membuat minimal 10 lessons per course
- Editor response time < 100ms
- Content save success rate > 99%

**Student Metrics:**
- Student dapat navigate sections dengan mudah
- Lesson load time < 500ms
- Progress tracking accuracy 100%
- Progress persistence across sessions 100%

**Technical Metrics:**
- API response time < 200ms (p95)
- Database query performance < 50ms
- Zero data loss on content save
- Mobile responsive (100% features work on mobile)

---

## 🔄 Iterasi & Feedback

### Sprint 2 Learnings (To be updated)

**What Went Well:**
- TBD after Sprint 2 completion

**What Can Be Improved:**
- TBD after Sprint 2 completion

**Action Items:**
- TBD after Sprint 2 completion

---

**Dokumentasi dibuat**: 2026-03-06  
**Terakhir diupdate**: 2026-03-07  
**Versi**: 2.0 (Updated for Sprint 2)  
**Status**: In Development - Sprint 2 Active
