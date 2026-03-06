# Course Management System (CMS)

Dokumentasi fitur untuk sistem manajemen konten kursus Maguru.

---

## 📋 Ringkasan

CMS memungkinkan creator membuat, mengedit, dan mempublikasikan kursus. Menggunakan arsitektur hibrid:
- **GitHub Repository** → Content (markdown, quiz, assets)
- **Supabase** → Metadata, published status

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────┐
│         Course Management Architecture       │
├─────────────────────────────────────────────┤
│                                         │
│  ┌────────────┐  ┌──────────┐      │
│  │ Frontend   │  │  API Layer │      │
│  │ (Creator   │  │  (Supabase│      │
│  │  Dashboard)│  │  + GitHub)│      │
│  └────────────┘  └──────────┘      │
│        │              │               │      │
│        ▼              ▼               ▼      │
│  ┌────────────────────────────────┐       │
│  │     Data Layer (Hybrid)      │       │
│  │  ┌──────────────┐          │       │
│  │  │ Supabase     │          │       │
│  │  │ - Metadata   │          │       │
│  │  └──────────────┘          │       │
│  │  ┌──────────────┐          │       │
│  │  │ GitHub Repo  │          │       │
│  │  │ - Content     │          │       │
│  │  └──────────────┘          │       │
│  └────────────────────────────────┘       │
└─────────────────────────────────────────┘
```

---

## 🎯 Gambaran Besar Fitur

### 1. Course Creation & Management
**Deskripsi:** Creator dapat membuat course baru dengan metadata dasar (judul, deskripsi, difficulty) dan mengelola struktur konten (sections & items).

**Komponen Utama:**
- Course metadata form (title, description, difficulty, duration)
- Course structure editor (manage sections, items)
- Real-time preview konten
- Save & sync ke GitHub repository

---

### 2. Section & Item Management
**Deskripsi:** Struktur konten dibagi menjadi sections (Theory/Practice/Quiz) dan items (material pembelajaran).

**Komponen Utama:**
- CRUD sections (add, edit, delete, reorder)
- CRUD items (add, edit, delete, reorder)
- Content type support: Markdown, Video, Code, Quiz
- Drag-drop untuk reordering

---

### 3. Markdown Editor dengan Preview
**Deskripsi:** Editor markdown untuk menulis materi pembelajaran dengan preview real-time.

**Komponen Utama:**
- Markdown editor dengan syntax highlighting
- Live preview untuk melihat hasil render
- Toolbar formatting (bold, italic, code blocks, links, images)
- Auto-save ke local storage

---

### 4. Quiz Builder
**Deskripsi:** Interface untuk membuat dan mengelola pertanyaan quiz.

**Komponen Utama:**
- Multiple choice question builder
- Code completion question builder
- Question bank management
- Score per question
- Explanation untuk setiap jawaban

---

### 5. GitHub Integration
**Deskripsi:** Integrasi otomatis dengan GitHub repository untuk version control dan content storage.

**Komponen Utama:**
- Auto-commit saat save
- Pull request untuk review
- Branch management (main, develop)
- Webhook untuk auto-sync perubahan

---

### 6. Publish & Review Workflow
**Deskripsi:** Workflow publikasi dengan review dan approval dari admin.

**Komponen Utama:**
- Submit untuk review
- Pull request management
- Admin review interface
- Publish/unpublish controls
- Status tracking (draft, pending review, published)

---

### 7. Role-Based Access Control
**Deskripsi:** Akses berbeda berdasarkan role user (creator, admin, student).

**Komponen Utama:**
- Creator: Create, edit, publish courses
- Admin: Review, approve, manage all courses
- Student: View published courses only (read-only)

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

### Course Management
```
GET    /api/cms/courses           - List semua course (filter by creator, published)
POST   /api/cms/courses           - Create course baru
GET    /api/cms/courses/[slug]    - Get course detail dengan structure
PUT    /api/cms/courses/[slug]    - Update course metadata
DELETE /api/cms/courses/[slug]    - Hapus course
POST   /api/cms/courses/[slug]/publish   - Publish course (create PR)
POST   /api/cms/courses/[slug]/unpublish - Unpublish course
```

### Section Management
```
POST   /api/cms/sections          - Create section baru
GET    /api/cms/sections?course_id=UUID - List sections dalam course
PUT    /api/cms/sections/[id]      - Update section
DELETE /api/cms/sections/[id]      - Hapus section
POST   /api/cms/items/move          - Reorder items antar sections
```

### Item Management
```
POST   /api/cms/items              - Create item baru
GET    /api/cms/items?section_id=UUID - List items dalam section
PUT    /api/cms/items/[id]          - Update item
DELETE /api/cms/items/[id]          - Hapus item
POST   /api/cms/items/[id]/content  - Update content markdown
```

### Quiz Management
```
POST   /api/cms/quizzes            - Create quiz dengan questions
GET    /api/cms/quizzes/[id]         - Get quiz dengan questions
PUT    /api/cms/quizzes/[id]         - Update quiz
DELETE /api/cms/quizzes/[id]         - Hapus quiz
POST   /api/cms/quizzes/[id]/questions - Tambah pertanyaan ke quiz
PUT    /api/cms/quizzes/[id]/questions - Update pertanyaan
DELETE /api/cms/quizzes/[id]/questions - Hapus pertanyaan
```

### GitHub Integration
```
POST   /api/cms/github/sync         - Manual sync ke GitHub
GET    /api/cms/github/status       - Cek status GitHub connection
POST   /api/cms/github/webhook     - GitHub webhook handler
POST   /api/cms/github/commit      - Manual commit & push
GET    /api/cms/github/branches    - List branches dalam repo
POST   /api/cms/github/branch      - Create/switch branch
```

---

## 🔗 GitHub Integration

### Repository Structure
```
maguru-course-content/
├── courses/
│   ├── [course-slug]/
│   │   ├── section-01/
│   │   │   ├── item-01.md (theory)
│   │   │   ├── item-02.md (practice)
│   │   │   └── item-03.json (quiz)
│   │   ├── section-02/
│   │   └── assets/
│   └── README.md
```

### Webhook Events
```
push → Update last_commit_hash → Refresh content
pull_request → Update status → Notify creator
merge → is_published = true → Notify users
```

### Content Fetching (Student)
```
1. Fetch metadata dari Supabase
2. Construct GitHub raw URLs berdasarkan structure
3. Fetch content files (parallel requests)
4. Cache di browser (ETag headers)
5. Render untuk siswa
```

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

### Phase 1: Setup
- [ ] Buat GitHub organization `maguru-course-content`
- [ ] Setup Supabase schema (courses, sections, items, quizzes, course_locks)
- [ ] Create GitHub App untuk webhook
- [ ] Environment variables setup

### Phase 2: Backend API
- [ ] Course management endpoints
- [ ] Section management endpoints
- [ ] Item management endpoints
- [ ] Quiz management endpoints
- [ ] GitHub integration endpoints
- [ ] Webhook handler
- [ ] Error handling middleware

### Phase 3: Frontend Components
- [ ] Creator dashboard layout
- [ ] Course form component
- [ ] Section manager component
- [ ] Item manager component
- [ ] Markdown editor dengan preview
- [ ] Quiz builder component
- [ ] Publish controls component

### Phase 4: Testing
- [ ] Integration testing (Supabase + GitHub)
- [ ] E2E testing untuk creator workflow
- [ ] E2E testing untuk student access
- [ ] Performance testing (content loading)

---

## 📚 Referensi

### Internal
- Project Requirements: `docs/rules/project.md`
- Architecture Overview: `CLAUDE.md`
- LangServe Integration: `features/langserve/api.ts`

### External
- GitHub REST API: https://docs.github.com/en/rest
- Supabase Docs: https://supabase.com/docs
- Markdown Guide: https://www.markdownguide.org/

---

**Dokumentasi dibuat**: 2026-03-06
**Versi**: 1.0
**Status**: Ready untuk Implementasi
