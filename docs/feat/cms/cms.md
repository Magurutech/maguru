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
- **Content Storage** → Tiptap JSON format di database dengan versioning metadata
- **Editor** → Tiptap rich text editor (native JSON format)

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

#### 2. Tiptap Rich Text Editor dengan Preview
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Rich text editor untuk menulis materi pembelajaran dengan Tiptap JSON format.

**Komponen yang Dibangun:**
- Tiptap editor integration (native JSON format)
- Minimal toolbar (Bold, Italic, Headings, Lists, Links, Code)
- Real-time preview panel
- Tiptap JSON content storage dengan metadata

**Fitur:**
- Rich text editing dengan toolbar
- Markdown shortcuts support (Tiptap built-in)
- Live preview rendering (native Tiptap)
- Auto-save (future)
- Version metadata tracking
- Native JSON structure (no conversion needed)

---

#### 3. Student Learn Page
**Status:** ✅ In Development (Sprint 2)

**Deskripsi:** Interface untuk siswa membaca konten dan track progress.

**Komponen yang Dibangun:**
- Section navigation sidebar
- Lesson content viewer (Tiptap renderer)
- Progress tracking UI
- "Mark as Complete" button

**Fitur:**
- Browse sections dan lessons
- Read rich text content dengan syntax highlighting (Tiptap renderer)
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

#### 4. Confluence "Page versioning
**Status:**  In Development 

**Deskripsi:** Sistem pelacakan kemajuan belajar siswa.

**Fitur:**
- Creator buka editor → edit konten → klik "Simpan" → tersimpan sebagai draft
- Badge "DRAFT" muncul di sidebar → artinya ada perubahan yang belum dipublish ke student
- Creator klik "Publish" → draft_content dipromote ke published_content → badge hilang
- Student hanya melihat published_content
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





**Dokumentasi dibuat**: 2026-03-06  
**Terakhir diupdate**: 2026-03-07  
**Versi**: 2.0 (Updated for Sprint 2)  
**Status**: In Development - Sprint 2 Active
