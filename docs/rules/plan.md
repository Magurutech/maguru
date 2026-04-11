# Plan: E2E Tests Task 14 & 15 — Content Management

**Dibuat:** 2026-04-11  
**Scope:** Task 14 (Creator Workflow) + Task 15 (Student Learn Workflow)  
**File target:**
- `__tests__/playwright/content/creator/manage-course.spec.ts`
- `__tests__/playwright/content/student/learn.spec.ts`

---

## Ringkasan Situasi

### Yang Sudah Ada
- Playwright sudah dikonfigurasi di `playwright.config.ts` dengan Clerk testing
- Pattern auth: `clerk.signIn()` dari `@clerk/testing/playwright`
- Test users: `testUsers.creatorUser` dan `testUsers.regularUser` di `fixtures/test-users.ts`
- Helper: `waitForPageLoad()` di `utils/test-helpers.ts`
- Existing spec: `__tests__/playwright/course/creator/manage-course.spec.ts` (sudah ada, tapi scope berbeda — publish toggle, back button)
- **Task 14 & 15 butuh file baru** di `__tests__/playwright/content/`

### Data-testid yang Sudah Ada (Tidak Perlu Ditambah)

**ManageSidebar.tsx** — sudah lengkap:
- `data-testid="add-section-btn"` — tombol Tambah Seksi
- `data-testid="inline-section-input"` — input inline seksi baru
- `data-testid="section-item-${id}"` — item seksi
- `data-testid="section-toggle-${id}"` — toggle expand/collapse
- `data-testid="section-menu-btn-${id}"` — tombol ⋯ seksi
- `data-testid="section-edit-btn-${id}"` — Edit di dropdown
- `data-testid="section-add-lesson-btn-${id}"` — Tambah Pelajaran di dropdown
- `data-testid="section-delete-btn-${id}"` — Hapus Seksi di dropdown
- `data-testid="section-edit-input-${id}"` — input edit inline seksi
- `data-testid="lesson-item-${id}"` — item lesson
- `data-testid="lesson-menu-btn-${id}"` — tombol ⋯ lesson
- `data-testid="lesson-edit-btn-${id}"` — Edit lesson
- `data-testid="lesson-delete-btn-${id}"` — Hapus lesson
- `data-testid="sidebar-overview-btn"` — Overview Kursus

**ManageContent.tsx** — sudah ada:
- `data-testid="lesson-title-input"` — input judul lesson
- `data-testid="course-overview-panel"` — panel overview

**ManageHeader.tsx** — sudah ada:
- `data-testid="publish-toggle-btn"` — tombol Publish/Unpublish
- `data-testid="back-to-courses-btn"` — tombol kembali

**CourseNavigation.tsx** — sudah ada:
- `data-testid="nav-section-${id}"` — section di sidebar student
- `data-testid="nav-lesson-${id}"` — lesson di sidebar student
- `data-testid="lesson-completed-${id}"` — checkmark selesai

**LessonViewer.tsx** — sudah ada:
- `data-testid="lesson-title"` — judul lesson

**LessonNavigation.tsx** — sudah ada:
- `data-testid="prev-lesson-btn"` — tombol sebelumnya
- `data-testid="next-lesson-btn"` — tombol berikutnya

**ProgressBar.tsx** — sudah ada:
- `data-testid="progress-bar-container"`
- `data-testid="progress-percentage"`
- `data-testid="progress-count"`
- `data-testid="progress-bar-fill"`

---

## Yang Perlu Ditambahkan (data-testid baru)

Setelah review semua komponen, ada beberapa yang masih kurang untuk E2E:

### 1. ManageDialogs.tsx — Dialog konfirmasi hapus seksi/lesson
Perlu dicek dan ditambahkan:
- `data-testid="delete-section-dialog"` — dialog konfirmasi hapus seksi
- `data-testid="delete-section-confirm-btn"` — tombol "Ya, Hapus"
- `data-testid="delete-section-cancel-btn"` — tombol "Batal"
- `data-testid="delete-lesson-dialog"` — dialog konfirmasi hapus lesson
- `data-testid="delete-lesson-confirm-btn"` — tombol konfirmasi hapus lesson

### 2. ManageContent.tsx — Tombol Save/Create lesson
Perlu ditambahkan:
- `data-testid="lesson-save-btn"` — tombol Create/Save di LessonEditorPanel

### 3. app/(learn)/course/[slug]/learn/page.tsx — Main content area
Perlu ditambahkan:
- `data-testid="learn-page"` — root container halaman learn
- `data-testid="lesson-area"` — area konten lesson utama
- `data-testid="lesson-loading"` — skeleton loading state
- `data-testid="lesson-error"` — error state lesson

---

## Urutan Pengerjaan

```
Phase 1: Tambah data-testid yang kurang
  ├── ManageDialogs.tsx (delete confirmations)
  ├── ManageContent.tsx (save button)
  └── learn/page.tsx (lesson area, loading, error)

Phase 2: Buat test file Task 14 (Creator)
  └── __tests__/playwright/content/creator/manage-course.spec.ts

Phase 3: Buat test file Task 15 (Student)
  └── __tests__/playwright/content/student/learn.spec.ts
```

---

## Detail Task 14: Creator Workflow

**File:** `__tests__/playwright/content/creator/manage-course.spec.ts`

**Prerequisite:** Creator user (`creatorUser`) harus punya minimal 1 course dengan:
- Minimal 1 section yang sudah ada
- Minimal 2 lessons di section tersebut

**Test Cases:**

### 14.2 — Akses halaman manage dengan auth creator
```
GIVEN: login sebagai creator
WHEN: navigate ke /creator/courses/[slug]/manage
THEN: halaman tampil (tidak redirect ke /sign-in)
      sidebar tampil dengan daftar seksi
      header tampil dengan judul course
```

### 14.3 — Buat seksi baru
```
GIVEN: di halaman manage
WHEN: klik add-section-btn
      ketik judul seksi di inline-section-input
      tekan Enter
THEN: seksi baru muncul di sidebar
      tidak ada error
```

### 14.4 — Buat lesson baru dengan Tiptap content
```
GIVEN: ada seksi di sidebar
WHEN: klik section-menu-btn → section-add-lesson-btn
      isi lesson-title-input
      klik di area editor dan ketik konten
      klik lesson-save-btn (Create)
THEN: lesson tersimpan
      view berpindah ke lesson viewer
      lesson muncul di sidebar
```

### 14.5 — Edit lesson → version increment
```
GIVEN: ada lesson di sidebar
WHEN: klik lesson-menu-btn → lesson-edit-btn
      ubah konten di editor
      klik lesson-save-btn (Save)
THEN: view berpindah ke lesson viewer
      konten berubah sesuai edit
```

### 14.6 — Reorder section via drag and drop
```
GIVEN: ada minimal 2 seksi
WHEN: drag section-item ke posisi berbeda
THEN: urutan seksi berubah di sidebar
      (verifikasi via DOM order)
```

### 14.7 — Delete section → cascade delete lessons
```
GIVEN: ada seksi dengan minimal 1 lesson
WHEN: klik section-menu-btn → section-delete-btn
      dialog konfirmasi muncul
      klik delete-section-confirm-btn
THEN: seksi hilang dari sidebar
      lessons di dalam seksi juga hilang
```

### 14.8 — Akses tanpa auth → redirect /sign-in
```
GIVEN: tidak ada session (clear cookies)
WHEN: navigate ke /creator/courses/[slug]/manage
THEN: redirect ke /sign-in
```

---

## Detail Task 15: Student Learn Workflow

**File:** `__tests__/playwright/content/student/learn.spec.ts`

**Prerequisite:** 
- Student user (`regularUser`) harus enrolled di course yang sama
- Course harus PUBLISHED dengan minimal 2 sections, masing-masing 2+ lessons

**Test Cases:**

### 15.2 — Akses halaman learn dengan auth student enrolled
```
GIVEN: login sebagai student yang enrolled
WHEN: navigate ke /course/[slug]/learn
THEN: halaman tampil (tidak redirect)
      sidebar tampil dengan daftar seksi
      progress bar tampil
```

### 15.3 — Klik lesson → konten Tiptap ter-render
```
GIVEN: di halaman learn, ada lesson di sidebar
WHEN: klik nav-lesson-[id]
THEN: lesson-title tampil di area konten
      konten Tiptap ter-render (bukan raw JSON)
      lesson-area visible
```

### 15.4 — Klik "Tandai Selesai" via Next → checkmark muncul
```
GIVEN: ada lesson yang belum selesai
WHEN: klik next-lesson-btn (auto mark complete)
THEN: lesson sebelumnya: lesson-completed-[id] muncul di sidebar
      progress bar percentage naik
```

### 15.5 — Progress bar update setelah mark complete
```
GIVEN: catat progress-percentage sebelum
WHEN: klik next-lesson-btn
THEN: progress-percentage setelah > sebelum
      progress-count bertambah
```

### 15.6 — Tombol navigasi Next → lesson berikutnya ter-load
```
GIVEN: bukan lesson terakhir
WHEN: klik next-lesson-btn
THEN: lesson-title berubah ke lesson berikutnya
      lesson baru ter-highlight di sidebar
```

### 15.7 — Refresh halaman → progress tetap tersimpan
```
GIVEN: beberapa lesson sudah selesai
WHEN: page.reload()
THEN: checkmark masih ada di lesson yang sudah selesai
      progress-percentage sama seperti sebelum refresh
```

### 15.8 — Akses tanpa auth → redirect /sign-in
```
GIVEN: tidak ada session
WHEN: navigate ke /course/[slug]/learn
THEN: redirect ke /sign-in
```

---

## Catatan Teknis

### Auth Pattern (ikuti existing tests)
```typescript
await clerk.signIn({
  page,
  signInParams: {
    strategy: 'password',
    identifier: testUsers.creatorUser.identifier,
    password: testUsers.creatorUser.password,
  },
})
```

### Course Slug Strategy
- Gunakan slug dari course yang sudah ada di database test
- Ambil dari `data-course-id` attribute di creator dashboard (seperti existing manage-course.spec.ts)
- Atau hardcode slug yang diketahui ada di test environment

### Drag and Drop (Task 14.6)
- Gunakan Playwright `dragTo()` atau `mouse.move()` + `mouse.down()` + `mouse.up()`
- DnD Kit menggunakan PointerSensor dengan `activationConstraint: { distance: 5 }`
- Perlu simulate pointer events, bukan drag events

### Tiptap Editor Input (Task 14.4)
- Editor menggunakan `aria-label="Tulis konten pelajaran di sini."`
- Klik area editor dulu, lalu `keyboard.type()`
- Atau gunakan `page.locator('[aria-label="Tulis konten pelajaran di sini."]').fill()`

### Learn Page Route
- Route ada di `app/(learn)/course/[slug]/learn/page.tsx`
- URL: `/course/[slug]/learn`
- Bukan `/course/[slug]` (itu overview page)

---

## File yang Akan Dibuat/Dimodifikasi

| File | Action | Keterangan |
|------|--------|------------|
| `features/cms/components/creator/manage/ManageDialogs.tsx` | MODIFY | Tambah data-testid delete dialogs |
| `features/cms/components/creator/manage/ManageContent.tsx` | MODIFY | Tambah data-testid save button |
| `app/(learn)/course/[slug]/learn/page.tsx` | MODIFY | Tambah data-testid learn-page, lesson-area |
| `__tests__/playwright/content/creator/manage-course.spec.ts` | CREATE | Task 14 E2E tests |
| `__tests__/playwright/content/student/learn.spec.ts` | CREATE | Task 15 E2E tests |

---

## Estimasi

- Phase 1 (tambah testid): ~30 menit
- Phase 2 (Task 14 spec): ~1 jam
- Phase 3 (Task 15 spec): ~1 jam
- Total: ~2.5 jam

---

## Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| Course slug tidak diketahui di test env | Ambil dinamis dari creator dashboard seperti existing spec |
| Student belum enrolled di course | Tambah enrollment step di beforeEach atau gunakan course yang sudah enrolled |
| Drag and drop flaky | Gunakan `waitForTimeout` setelah drag, verifikasi via DOM order bukan visual |
| Tiptap editor tidak menerima keyboard input | Gunakan `click()` dulu pada editor area sebelum `type()` |
| Progress tidak update real-time | Gunakan `waitForResponse()` untuk tunggu API call selesai |
