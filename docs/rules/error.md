<<<<<<< HEAD
# Analisis Creator Tiptap Editor: Section & Lesson Management

**Tanggal:** 2026-04-29  
**Fokus:** Tiptap Rich-Text Editor untuk Creator dengan Section & Lesson Management  
**Status:** Phase 1 Complete - Analisis untuk Improvement

---

## 1. Arsitektur Saat Ini

### 1.1 Struktur Komponen

```
ManageProvider (Context API)
├── ManageHeader (Header + Publish button)
├── ManageSidebar (Section/Lesson tree navigation)
│   ├── SortableSectionItem (DnD section)
│   └── SortableLessonItem (DnD lesson)
├── ManageContent (Main content area)
│   ├── CourseOverview (Course description editor)
│   ├── LessonEditorPanel (Tiptap editor - CREATE/EDIT)
│   └── LessonViewerPanel (Tiptap viewer - READ)
└── ManageDialogs (Confirmation dialogs)
```

### 1.2 State Management

**ManageContext** mengelola 15+ state dan 20+ handler:
- Course data (course, sections, lessonsMap)
- UI state (activeView, expandedSections, publishing)
- Form state (sectionFormOpen, editingSection, isAddingSection)
- Delete confirmation (pendingDeleteSectionId, pendingDeleteLesson)

**Custom Hooks** (separation of concerns):
- `useCourseManage` - Course data fetching & publish
- `useLessonHandlers` - Lesson CRUD operations
- `useSectionHandlers` - Section CRUD operations
- `useManageView` - Active view state
- `useReorderHandlers` - DnD reordering

---

## 2. Tiptap Editor Implementation

### 2.1 Extensions yang Digunakan

**Core Extensions:**
```typescript
StarterKit.configure({
  link: { openOnClick: false, enableClickSelection: true }
})
```

**Additional Extensions:**
- `TextAlign` - Perataan teks (left, center, right, justify)
- `Highlight` - Highlight dengan multicolor
- `Typography` - Smart typography (quotes, dashes, ellipsis)
- `Superscript` / `Subscript` - Pangkat dan indeks
- `Selection` - Selection management

**Custom Extensions:**
- `HeadingShortcuts` - Keyboard shortcuts (Mod+Shift+1/2/3 untuk H1/H2/H3)
- `SaveShortcut` - Keyboard shortcut (Mod+Enter untuk save)

### 2.2 Editor Modes

**1. LessonEditorPanel (Editable)**
- Mode: CREATE atau EDIT lesson
- Editable: `true`
- Features:
  - Full toolbar (EditorToolbar component)
  - Title input field
  - Auto-save shortcut (Cmd+Enter)
  - Split button: Save | ∨ Cancel
  - Sticky toolbar header

**2. LessonViewerPanel (Read-only)**
- Mode: VIEW lesson
- Editable: `false`
- Features:
  - Same extensions as editor (WYSIWYG consistency)
  - Edit button to switch to editor mode
  - No toolbar

**3. DescriptionEditor (Inline)**
- Mode: EDIT course description
- Editable: `true`
- Features:
  - Minimal editor (StarterKit only)
  - Inline editing with Save/Cancel buttons

### 2.3 Content Storage Format

**LessonContent Structure:**
```typescript
{
  content: JSONContent,      // Tiptap JSON (native format)
  version: number,           // Always 1 (not incremented)
  lastEdit: string          // ISO 8601 timestamp
}
```

**Storage Flow:**
```
Editor → editor.getJSON() → LessonContent → API → Prisma (Json field)
```

---

## 3. Issues & Improvement Areas

### 3.1 High Priority Issues

#### ❌ **Version Not Incremented**
```typescript
// Current: version always 1
const content = { 
  content: editor.getJSON(), 
  version: 1,  // ← HARDCODED
  lastEdit: new Date().toISOString() 
}
```
**Impact:** Version tracking tidak berfungsi  
**Fix:** Fetch current version, increment on save

#### ❌ **No Unsaved Changes Warning**
**Impact:** User bisa kehilangan perubahan saat navigasi  
**Fix:** Implementasi `beforeunload` event + dirty state tracking

#### ❌ **No Auto-save**
**Impact:** User bisa kehilangan pekerjaan jika crash/close  
**Fix:** Implementasi auto-save ke localStorage atau backend (debounced)

#### ❌ **Image Upload Disabled**
**Impact:** Creator tidak bisa upload gambar  
**Fix:** Aktifkan `ImageUploadNode` + tambahkan button ke toolbar

### 3.2 Medium Priority Issues

#### ⚠️ **God Component: ManageContent.tsx**
- **Size:** ~400 baris
- **Sub-components:** 4 komponen nested di 1 file
- **Impact:** Sulit maintain, test, dan debug
- **Fix:** Split ke file terpisah:
  - `CourseOverview.tsx`
  - `LessonEditorPanel.tsx`
  - `LessonViewerPanel.tsx`
  - `DescriptionEditor.tsx`

#### ⚠️ **Prop Drilling: SortableSectionItem**
- **Props:** 20+ props diterima
- **Impact:** Re-render berat, sulit maintain
- **Fix:** Group props atau gunakan context

#### ⚠️ **Missing Memoization**
- `SortableSectionItem` - tidak di-memo (DnD heavy)
- `SortableLessonItem` - tidak di-memo (DnD heavy)
- `CourseCard` - tidak di-memo (list re-render)
- **Fix:** Wrap dengan `React.memo`

### 3.3 Low Priority Issues

#### 📝 **DRY Violations**
- Difficulty color mapping duplikat di 3 file
- Error toast pattern `err instanceof Error ? err.message : 'Gagal...'` muncul 15+ kali
- **Fix:** Extract ke utility functions

#### 📝 **No UI Hints for Shortcuts**
- `HeadingShortcuts` (Mod+Shift+1/2/3) tidak ada hint di UI
- `SaveShortcut` (Mod+Enter) tidak ada hint di UI
- **Fix:** Tambahkan tooltip atau keyboard hint

#### 📝 **contentPreview Tidak Akurat**
- Hanya 200 char plain text
- **Fix:** Generate preview yang lebih baik (dengan struktur)

---

## 4. Tiptap Best Practices Compliance

### ✅ Yang Sudah Baik

1. **Modularisasi Editor**
   - Editor terisolasi dalam komponen terpisah
   - Toolbar terpisah dari logika editor
   - EditorContext digunakan untuk sharing editor instance

2. **Extension Structure**
   - Menggunakan `StarterKit` sebagai base
   - Custom extensions untuk fitur unik (HeadingShortcuts, SaveShortcut)
   - Konfigurasi terpusat

3. **Performance**
   - `immediatelyRender: false` untuk SSR optimization
   - Editor diisolasi dalam komponen terpisah

### ⚠️ Yang Perlu Diperbaiki

1. **Performance Optimization**
   - Belum ada `useEditorState` untuk optimasi re-render
   - Belum ada lazy loading untuk extensions berat
   - Missing memoization di sortable items

2. **UX Enhancement**
   - Tidak ada hint UI untuk keyboard shortcuts
   - Tidak ada unsaved changes warning
   - Link behavior (`openOnClick: false`) tidak dikomunikasikan

3. **Functionality Gaps**
   - Image upload tidak aktif
   - Version increment tidak berfungsi
   - Tidak ada auto-save
   - Tidak ada Draft/Publish system untuk lessons

---

## 5. Rekomendasi Prioritas

### Phase 1: Critical Fixes (1-2 hari)
1. ✅ Fix version increment logic
2. ✅ Implementasi unsaved changes warning
3. ✅ Aktifkan image upload
4. ✅ Implementasi auto-save (localStorage)

### Phase 2: Performance & UX (2-3 hari)
5. ✅ Memoize sortable components
6. ✅ Tambahkan keyboard shortcut hints
7. ✅ Implementasi `useEditorState` untuk optimasi
8. ✅ Extract DRY violations ke utilities

### Phase 3: Refactoring (3-4 hari)
9. ✅ Split ManageContent.tsx ke file terpisah
10. ✅ Refactor SortableSectionItem props (group atau context)
11. ✅ Improve contentPreview generation
12. ✅ Implementasi Draft/Publish system untuk lessons

---

## 6. Technical Debt Summary

| Kategori                            | Issue                         | Impact                  | Effort | Priority |     |
| -------------------------------------| -------------------------------| -------------------------| --------| ----------| -----|
| ----------                          | lity**                        | Version not incremented | High   | Low      | P0  |
| * -------                           | unsaved changes warning       | High                    | Medium | P0       |     |
| -*UX**                              | No auto-save                  | High                    | Medium | P0       |     |
| ------- onality**                   | Image upload disabled         | High                    | Low    | P0       |     |
| re**                                | God component (ManageContent) | Medium                  | High   | P1       |     |
| --------  nce**                     | Missing memoization           | Medium                  | Low    | P1       |     |
| **Ar     cture**                    | Prop drilling (20+ props)     | Medium                  | Medium | P1       |     |
| **       ality**                    | DRY violations                | Low                     | Low    | P2       |     |
| **       No keyboard shortcut hints | Low                           | Low                     | P2     |          |     |

---          | ----------                    |                         |        |          |     | 7. Referensi

### Dokumentasi Terkait
- **Tiptap Core Concepts:** `docs/docs/tiptap/tiptap-core-concept.md`
- **Tiptap Research:** `docs/docs/tiptap/tiptap-editor-resarch.md`
- **Requirements:** `.kiro/specs/course-content-management-v2/requirements.md`
- **Tasks:** `.kiro/specs/course-content-management-v2/tasks.md`

### Komponen Utama
- **Context:** `features/cms/Context/creator/ManageContext.tsx`
- **Editor:** `features/cms/components/creator/manage/ManageContent.tsx`
- **Toolbar:** `features/cms/components/creator/EditorToolbar.tsx`
- **Sidebar:** `features/cms/components/creator/manage/ManageSidebar.tsx`

### API Endpoints
- `POST /api/courses/[slug]/sections/[sectionId]/lessons` - Create lesson
- `PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]` - Update lesson
- `GET /api/courses/_/sections/[sectionId]/lessons/[lessonId]` - Get lesson

---

**Next Steps:** Pilih phase untuk dikerjakan berdasarkan prioritas bisnis dan resource availability.
=======
(base) PS D:\.maguru\maguru> yarn test:e2e __tests__/playwright/course/creator/version-tracking.spec.ts
yarn run v1.22.22
$ cross-env NODE_ENV=test  playwright test __tests__/playwright/course/creator __tests__/playwright/course/creator/version-tracking.spec.ts
[dotenv@17.3.1] injecting env (17) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

Running 39 tests using 2 workers
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🤖 agentic secret storage: https://dotenvx.com/as2
[global setup] › __tests__\playwright\global.setup.ts:27:6 › global setup
🔐 Setting up Clerk testing token...
✅ Environment variables loaded successfully                                                                                                                                                                                                              
[dotenv@17.2.2] injecting env (10) from .env.local,.env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild                                                                                                                          
✅ Clerk testing token initialized successfully
Assertion failed: !(handle->flags & UV_HANDLE
_CLOSING), file src\win\async.c, line 76                                                                                                                                                                                                                  

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  override existing env vars with { override: true }                                                                                                                                           
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:33:13 › Creator Course List Page — Authenticated Creator › course grid shows cards when courses exist
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:20:13 › Creator Course List Page — Authenticated Creator › page loads with correct heading and stats
🔐 Auto-authenticated as creator
  1) [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:33:13 › Creator Course List Page — Authenticated Creator › course grid shows cards when courses exist 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-d440d-ws-cards-when-courses-exist-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-d440d-ws-cards-when-courses-exist-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-course-list-d440d-ws-cards-when-courses-exist-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:58:13 › Creator Course List Page — Authenticated Creator › "Buat Kursus Baru" button redirects to create page
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:46:13 › Creator Course List Page — Authenticated Creator › "Manage" button on card redirects to manage page
🔐 Auto-authenticated as creator
  2) [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:46:13 › Creator Course List Page — Authenticated Creator › "Manage" button on card redirects to manage page 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-0da19-rd-redirects-to-manage-page-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-0da19-rd-redirects-to-manage-page-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-course-list-0da19-rd-redirects-to-manage-page-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  write to custom object with { processEnv: myObject }
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:70:13 › Creator Course List Page — Authenticated Creator › back button redirects to /creator dashboard
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:23:20 › Course Creation Form — Validation › submitting empty form shows validation errors
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:43:20 › Course Creation Form — Validation › title exceeding 100 chars shows validation error
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:53:20 › Course Creation Form — Validation › title character counter updates correctly
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:61:20 › Course Creation Form — Validation › error clears when user starts typing
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:73:20 › Course Creation Form — Validation › submit button shows loading state during submission
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:103:20 › Course Creation Form — Validation › successful submission redirects to manage page
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:21:13 › Creator Dashboard — Authenticated Creator › dashboard shows stats with real data
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:38:13 › Creator Dashboard — Authenticated Creator › dashboard shows course list with enrollment count
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:62:13 › Creator Dashboard — Authenticated Creator › clicking course item redirects to manage page
🔐 Auto-authenticated as creator
  3) [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:38:13 › Creator Dashboard — Authenticated Creator › dashboard shows course list with enrollment count 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-db2c4--list-with-enrollment-count-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-db2c4--list-with-enrollment-count-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-dashboard-C-db2c4--list-with-enrollment-count-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
  4) [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:62:13 › Creator Dashboard — Authenticated Creator › clicking course item redirects to manage page 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-68d65-em-redirects-to-manage-page-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-68d65-em-redirects-to-manage-page-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-dashboard-C-68d65-em-redirects-to-manage-page-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:76:13 › Creator Dashboard — Authenticated Creator › "Lihat Semua" button redirects to /creator/courses
🔐 Auto-authenticated as creator
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  write to custom object with { processEnv: myObject }
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:86:13 › Creator Dashboard — Authenticated Creator › "Buat Kursus Baru" button links to create page
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:26:14 › Task 14: Creator Content Management Workflow › 14.2 — akses halaman manage dengan auth creator
🔐 Auto-authenticated as creator
  5) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:26:14 › Task 14: Creator Content Management Workflow › 14.2 — akses halaman manage dengan auth creator 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-370e2--manage-dengan-auth-creator-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-370e2--manage-dengan-auth-creator-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-370e2--manage-dengan-auth-creator-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛡️ auth for agents: https://vestauth.com
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:49:14 › Task 14: Creator Content Management Workflow › 14.4 — buat lesson baru dengan Tiptap content
🔐 Auto-authenticated as creator
  6) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:49:14 › Task 14: Creator Content Management Workflow › 14.4 — buat lesson baru dengan Tiptap content 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-2c9c1--baru-dengan-Tiptap-content-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-2c9c1--baru-dengan-Tiptap-content-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-2c9c1--baru-dengan-Tiptap-content-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:42:14 › Task 14: Creator Content Management Workflow › 14.3 — buat seksi baru muncul di sidebar
🔐 Auto-authenticated as creator
  7) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:42:14 › Task 14: Creator Content Management Workflow › 14.3 — buat seksi baru muncul di sidebar 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-094b7-eksi-baru-muncul-di-sidebar-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-094b7-eksi-baru-muncul-di-sidebar-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-094b7-eksi-baru-muncul-di-sidebar-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:89:14 › Task 14: Creator Content Management Workflow › 14.5 — edit lesson, konten berubah setelah save
🔐 Auto-authenticated as creator
  8) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:89:14 › Task 14: Creator Content Management Workflow › 14.5 — edit lesson, konten berubah setelah save 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-229f7-konten-berubah-setelah-save-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-229f7-konten-berubah-setelah-save-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-229f7-konten-berubah-setelah-save-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:138:14 › Task 14: Creator Content Management Workflow › 14.6 — reorder section via drag and drop
🔐 Auto-authenticated as creator
  9) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:138:14 › Task 14: Creator Content Management Workflow › 14.6 — reorder section via drag and drop 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-a1d09-r-section-via-drag-and-drop-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-a1d09-r-section-via-drag-and-drop-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-a1d09-r-section-via-drag-and-drop-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  override existing env vars with { override: true }
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:190:14 › Task 14: Creator Content Management Workflow › 14.7 — delete section cascade delete lessons
🔐 Auto-authenticated as creator
  10) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:190:14 › Task 14: Creator Content Management Workflow › 14.7 — delete section cascade delete lessons 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-09ee1-tion-cascade-delete-lessons-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-09ee1-tion-cascade-delete-lessons-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-09ee1-tion-cascade-delete-lessons-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:32:13 › Course Manage Page — Authenticated Creator › publish/unpublish toggle changes status without full reload
🔐 Auto-authenticated as creator
  11) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:32:13 › Course Manage Page — Authenticated Creator › publish/unpublish toggle changes status without full reload 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-c233e--status-without-full-reload-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-c233e--status-without-full-reload-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-c233e--status-without-full-reload-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:21:13 › Course Manage Page — Authenticated Creator › manage page header shows course info and publish button
🔐 Auto-authenticated as creator
  12) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:21:13 › Course Manage Page — Authenticated Creator › manage page header shows course info and publish button 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-6632b-rse-info-and-publish-button-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-6632b-rse-info-and-publish-button-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-6632b-rse-info-and-publish-button-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:55:13 › Course Manage Page — Authenticated Creator › sidebar overview button shows course overview panel
🔐 Auto-authenticated as creator
  13) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:55:13 › Course Manage Page — Authenticated Creator › sidebar overview button shows course overview panel 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-4a5f6-shows-course-overview-panel-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-4a5f6-shows-course-overview-panel-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-4a5f6-shows-course-overview-panel-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:68:13 › Course Manage Page — Authenticated Creator › + Seksi button opens section creation dialog
🔐 Auto-authenticated as creator
  14) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:68:13 › Course Manage Page — Authenticated Creator › + Seksi button opens section creation dialog 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-37dc8-ens-section-creation-dialog-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-37dc8-ens-section-creation-dialog-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-37dc8-ens-section-creation-dialog-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:78:13 › Course Manage Page — Authenticated Creator › back button redirects to /creator/courses
🔐 Auto-authenticated as creator
  15) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:78:13 › Course Manage Page — Authenticated Creator › back button redirects to /creator/courses 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-b0888-edirects-to-creator-courses-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-b0888-edirects-to-creator-courses-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-b0888-edirects-to-creator-courses-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:88:13 › Course Manage Page — Authenticated Creator › section expand/collapse in sidebar
🔐 Auto-authenticated as creator
  16) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:88:13 › Course Manage Page — Authenticated Creator › section expand/collapse in sidebar 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-9c72e--expand-collapse-in-sidebar-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-9c72e--expand-collapse-in-sidebar-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-9c72e--expand-collapse-in-sidebar-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:20:13 › Feature 1: Version Tracking Fix › 1.1 — CREATE lesson should have version = 1
🔐 Auto-authenticated as creator
  17) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:20:13 › Feature 1: Version Tracking Fix › 1.1 — CREATE lesson should have version = 1 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-b7e69-esson-should-have-version-1-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-b7e69-esson-should-have-version-1-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-b7e69-esson-should-have-version-1-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:72:13 › Feature 1: Version Tracking Fix › 1.2 — UPDATE lesson should increment version (1 → 2)
🔐 Auto-authenticated as creator
  18) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:72:13 › Feature 1: Version Tracking Fix › 1.2 — UPDATE lesson should increment version (1 → 2) 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-f9dec-ld-increment-version-1-→-2--chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-f9dec-ld-increment-version-1-→-2--chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-f9dec-ld-increment-version-1-→-2--chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:122:13 › Feature 1: Version Tracking Fix › 1.3 — Multiple saves should increment version monotonically
🔐 Auto-authenticated as creator
  19) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:122:13 › Feature 1: Version Tracking Fix › 1.3 — Multiple saves should increment version monotonically 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-7645d-ement-version-monotonically-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-7645d-ement-version-monotonically-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-7645d-ement-version-monotonically-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:183:13 › Feature 1: Version Tracking Fix › 1.4 — Version should persist after page reload
🔐 Auto-authenticated as creator
  20) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:183:13 › Feature 1: Version Tracking Fix › 1.4 — Version should persist after page reload 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-248b5-d-persist-after-page-reload-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-248b5-d-persist-after-page-reload-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-248b5-d-persist-after-page-reload-chromium\error-context.md

  20 failed
    [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:33:13 › Creator Course List Page — Authenticated Creator › course grid shows cards when courses exist 
    [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:46:13 › Creator Course List Page — Authenticated Creator › "Manage" button on card redirects to manage page
    [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:38:13 › Creator Dashboard — Authenticated Creator › dashboard shows course list with enrollment count
    [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:62:13 › Creator Dashboard — Authenticated Creator › clicking course item redirects to manage page
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:26:14 › Task 14: Creator Content Management Workflow › 14.2 — akses halaman manage dengan auth creator
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:42:14 › Task 14: Creator Content Management Workflow › 14.3 — buat seksi baru muncul di sidebar
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:49:14 › Task 14: Creator Content Management Workflow › 14.4 — buat lesson baru dengan Tiptap content
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:89:14 › Task 14: Creator Content Management Workflow › 14.5 — edit lesson, konten berubah setelah save
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:138:14 › Task 14: Creator Content Management Workflow › 14.6 — reorder section via drag and drop
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:190:14 › Task 14: Creator Content Management Workflow › 14.7 — delete section cascade delete lessons
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:21:13 › Course Manage Page — Authenticated Creator › manage page header shows course info and publish button
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:32:13 › Course Manage Page — Authenticated Creator › publish/unpublish toggle changes status without full reload
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:55:13 › Course Manage Page — Authenticated Creator › sidebar overview button shows course overview panel
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:68:13 › Course Manage Page — Authenticated Creator › + Seksi button opens section creation dialog
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:78:13 › Course Manage Page — Authenticated Creator › back button redirects to /creator/courses
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:88:13 › Course Manage Page — Authenticated Creator › section expand/collapse in sidebar
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:20:13 › Feature 1: Version Tracking Fix › 1.1 — CREATE lesson should have version = 1
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:72:13 › Feature 1: Version Tracking Fix › 1.2 — UPDATE lesson should increment version (1 → 2)
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:122:13 › Feature 1: Version Tracking Fix › 1.3 — Multiple saves should increment version monotonically
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:183:13 › Feature 1: Version Tracking Fix › 1.4 — Version should persist after page reload
  19 passed (4.6m)

  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
>>>>>>> 2ffc52065873df3d41d41658cf3a3f0da78f8ecd
