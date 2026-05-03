# Implementation Plan: Tiptap Editor Improvement

**Feature Name:** Tiptap Editor Improvement  
**Created:** 2026-05-01  
**Status:** Ready for Implementation  
**Version:** 2.0

---

## Overview

Implementasi dibagi 3 fase sesuai prioritas. Setiap feature akan langsung ditest (Unit → API → E2E) sebelum lanjut ke feature berikutnya.

**Testing Strategy:** Implement → Unit Test → API Test → E2E Test → Verify

**Prerequisite:** Buat bucket `lesson-images` di Supabase dashboard (public bucket) sebelum memulai Phase 1.

---

## Tasks

### Phase 1: Critical Fixes (P0)

---

#### Feature 1: Version Tracking Fix

**Research Needed:**
- [ ] Baca dokumentasi lesson API endpoint (PUT `/api/lessons/:id`)
- [ ] Review `lesson.service.ts` untuk memahami server-side version increment logic
- [ ] Cek struktur `LessonContent` interface di codebase

**Implementation:**
- [ ] 1.1 Implementasi version tracking fix
  - Hapus hardcoded `version: 1` dari `handleSave` di `ManageContent.tsx`
  - Untuk CREATE: kirim `version: 1` (sudah benar)
  - Untuk UPDATE: server di `lesson.service.ts` sudah handle increment — tidak perlu perubahan server
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

**Testing:**
- [ ] 1.2 Unit Test: Test version increment logic
  - Mock lesson API response dengan version N
  - Verify client mengirim version yang benar
  - Test CREATE mengirim version: 1
  - Test UPDATE server response mengembalikan version N+1

- [ ] 1.3 API Test (Postman): Test lesson update endpoint
  - Test POST `/api/lessons` → verify version = 1
  - Test PUT `/api/lessons/:id` → verify version increment dari N ke N+1
  - Test response structure contains correct version number
  - Export collection ke `docs/api/lesson-version.postman.json`

- [ ] 1.4 E2E Test (Playwright): Test version tracking flow
  - Test: Create new lesson → verify version = 1 di UI
  - Test: Edit existing lesson → save → verify version increment di response
  - Test: Multiple saves → verify version increments correctly
  - File: `__tests__/e2e/lesson-version-tracking.spec.ts`

**Verification:**
- [ ] 1.5 Manual verification
  - Buat lesson baru, cek version = 1 di network tab
  - Edit lesson, save, cek version increment di response
  - Refresh page, verify version persisted correctly

---

#### Feature 2: Unsaved Changes Warning

**Research Needed:**
- [ ] Baca dokumentasi React `beforeunload` event handling
- [ ] Review Tiptap editor events documentation (editor.on('update'))
- [ ] Cek implementasi existing dialog components di shadcn/ui

**Implementation:**
- [ ] 2.1 Buat hook `features/cms/hooks/manage/useUnsavedChanges.ts`
  - Track `isDirty` state dengan `editor.on('update')` event
  - Compare `JSON.stringify(editor.getJSON())` vs `JSON.stringify(initialContent)`
  - Compare `title` vs `initialTitle`
  - Implementasi `beforeunload` event handler
  - Export `isDirty` dan `resetDirty()`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 2.8_

- [ ] 2.2 Integrasikan hook ke `LessonEditorPanel` di `ManageContent.tsx`
  - Panggil `useUnsavedChanges` dengan editor, title, initialTitle, initialContent
  - Tampilkan `•` dot indicator di dekat save button saat `isDirty === true`
  - Panggil `resetDirty()` setelah save sukses dan setelah cancel
  - Tambahkan konfirmasi dialog saat navigasi ke lesson lain dengan dirty state
  - _Requirements: 2.6, 2.9_

**Testing:**
- [ ] 2.3 Unit Test: Test useUnsavedChanges hook
  - Test dirty = true saat content berubah
  - Test dirty = false setelah reset
  - Test dirty = false saat content kembali ke initial (undo)
  - Test beforeunload handler terpasang saat dirty = true
  - **Property 2: Dirty State Round-trip**
  - **Validates: Requirements 2.7, 2.8**
  - File: `__tests__/unit/hooks/useUnsavedChanges.test.ts`

- [ ] 2.4 Unit Test: Test LessonEditorPanel integration
  - Test dot indicator muncul saat isDirty = true
  - Test dot indicator hilang setelah save
  - Test resetDirty dipanggil setelah cancel
  - File: `__tests__/unit/components/LessonEditorPanel.test.tsx`

- [ ] 2.5 E2E Test (Playwright): Test unsaved changes warning
  - Test: Edit content → refresh browser → verify browser warning muncul
  - Test: Edit content → navigate away → verify custom dialog muncul
  - Test: Edit content → save → navigate away → verify no warning
  - Test: Edit content → cancel → verify isDirty reset
  - File: `__tests__/e2e/unsaved-changes-warning.spec.ts`

**Verification:**
- [ ] 2.6 Manual verification
  - Edit lesson content, cek dot indicator muncul
  - Try refresh browser, cek browser warning
  - Try navigate ke lesson lain, cek custom dialog
  - Save lesson, verify dot indicator hilang

---

#### Feature 3: Image Upload

**Research Needed:**
- [ ] Baca dokumentasi Supabase Storage API (upload, getPublicUrl)
- [ ] Review dokumentasi `@tiptap/extension-image`
- [ ] Cek best practices file upload validation (MIME type, file size)
- [ ] Review existing `supabaseStorage` client di `lib/supabase.ts`

**Implementation:**
- [ ] 3.1 Buat `lib/tiptap/image-upload.ts`
  - Implementasi `uploadLessonImage(file: File): Promise<string>`
  - Validasi MIME type: jpeg, png, gif, webp
  - Validasi file size: max 5MB
  - Upload ke Supabase bucket `lesson-images` menggunakan `supabaseStorage` dari `lib/supabase.ts`
  - Return public URL
  - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7, 3.8, 3.10, 3.12, 3.13_

- [ ] 3.2 Aktifkan `@tiptap/extension-image` di editor extensions
  - Install `@tiptap/extension-image` jika belum ada: `yarn add @tiptap/extension-image`
  - Tambahkan `Image.configure({ inline: false, allowBase64: false })` ke extensions di `LessonEditorPanel`
  - Tambahkan Image extension ke viewer extensions juga (untuk render gambar di viewer)
  - _Requirements: 3.1_

- [ ] 3.3 Tambahkan `ImageUploadButton` ke `EditorToolbar.tsx`
  - Buat komponen `ImageUploadButton` dengan hidden file input
  - Tampilkan loading spinner saat upload berlangsung
  - Panggil `editor.chain().focus().setImage({ src: url }).run()` setelah upload sukses
  - Tampilkan toast error jika upload gagal
  - _Requirements: 3.2, 3.3, 3.9, 3.11_

- [ ] 3.4 Tambahkan paste image support
  - Tambahkan `editorProps.handlePaste` untuk intercept paste event dengan image file
  - Panggil `uploadLessonImage` dan insert image node
  - _Requirements: 3.14_

**Testing:**
- [ ] 3.5 Unit Test: Test uploadLessonImage validation
  - Test validasi file size > 5MB ditolak
  - Test validasi MIME type tidak valid ditolak
  - Test validasi MIME type valid diterima
  - Test error message dalam bahasa Indonesia
  - Mock `supabaseStorage` untuk test tanpa network
  - **Property 3: Image Validation — Size**
  - **Property 4: Image Validation — Type**
  - **Validates: Requirements 3.4, 3.5, 3.6, 3.7**
  - File: `__tests__/unit/lib/image-upload.test.ts`

- [ ] 3.6 Unit Test: Test ImageUploadButton component
  - Test file input opens saat button clicked
  - Test loading state saat upload
  - Test error toast muncul saat upload gagal
  - Test image inserted ke editor setelah upload sukses
  - File: `__tests__/unit/components/ImageUploadButton.test.tsx`

- [ ] 3.7 API Test (Postman): Test Supabase Storage upload
  - Test upload valid image → verify public URL returned
  - Test upload file > 5MB → verify error
  - Test upload invalid MIME type → verify error
  - Test get public URL dari uploaded image
  - Export collection ke `docs/api/supabase-storage.postman.json`

- [ ] 3.8 E2E Test (Playwright): Test image upload flow
  - Test: Click image button → select valid image → verify image muncul di editor
  - Test: Upload image > 5MB → verify error toast
  - Test: Upload invalid format → verify error toast
  - Test: Paste image dari clipboard → verify image muncul
  - Test: Save lesson dengan image → reload → verify image persisted
  - File: `__tests__/e2e/image-upload.spec.ts`

**Verification:**
- [ ] 3.9 Manual verification
  - Upload gambar valid, cek muncul di editor
  - Upload gambar > 5MB, cek error message
  - Upload format tidak valid, cek error message
  - Paste gambar dari clipboard, cek berhasil
  - Save lesson, reload, cek gambar masih ada

---

#### Feature 4: Auto-save to localStorage

---

#### Feature 4: Auto-save to localStorage

**Research Needed:**
- [ ] Review React debounce patterns (lodash.debounce atau custom hook)
- [ ] Baca dokumentasi localStorage API
- [ ] Review shadcn/ui Alert/Dialog components untuk restore prompt

**Implementation:**
- [ ] 4.1 Buat hook `features/cms/hooks/manage/useAutoSave.ts`
  - Implementasi debounced auto-save dengan delay 10 detik
  - Save `{ title, content, savedAt }` ke `localStorage['lesson-draft-{lessonId}']`
  - Export `lastAutoSave`, `clearDraft()`
  - Hanya trigger jika `isDirty === true` dan `lessonId` ada
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.9, 4.12_

- [ ] 4.2 Implementasi draft restore di `LessonEditorPanel`
  - Saat editor dibuka (edit mode), cek localStorage untuk draft
  - Jika draft ada dan `draft.savedAt > lesson.lastEdit`, tampilkan restore prompt
  - Tombol "Pulihkan": load draft content ke editor
  - Tombol "Abaikan": hapus draft, load server content
  - _Requirements: 4.6, 4.7, 4.8, 4.9_

- [ ] 4.3 Tampilkan auto-save indicator
  - Tampilkan "Draft tersimpan" text kecil setelah auto-save berhasil
  - Fade out setelah 3 detik
  - Hapus draft dari localStorage saat manual save sukses
  - _Requirements: 4.10, 4.11_

**Testing:**
- [ ] 4.4 Unit Test: Test useAutoSave hook
  - Test draft tersimpan ke localStorage setelah delay 10 detik
  - Test draft tidak tersimpan jika isDirty = false
  - Test clearDraft menghapus dari localStorage
  - Test debounce reset saat ada perubahan baru
  - Test auto-save tidak trigger jika content tidak berubah
  - File: `__tests__/unit/hooks/useAutoSave.test.ts`

- [ ] 4.5 Unit Test: Test draft restore logic
  - Test restore prompt muncul saat draft lebih baru dari server
  - Test restore prompt tidak muncul saat draft lebih lama
  - Test "Pulihkan" load draft content
  - Test "Abaikan" hapus draft dan load server content
  - File: `__tests__/unit/components/DraftRestore.test.tsx`

- [ ] 4.6 E2E Test (Playwright): Test auto-save flow
  - Test: Edit content → wait 10s → verify "Draft tersimpan" muncul
  - Test: Edit content → wait 10s → close browser → reopen → verify restore prompt
  - Test: Restore draft → verify content loaded correctly
  - Test: Discard draft → verify server content loaded
  - Test: Manual save → verify draft cleared dari localStorage
  - File: `__tests__/e2e/auto-save.spec.ts`

**Verification:**
- [ ] 4.7 Manual verification
  - Edit lesson, tunggu 10 detik, cek "Draft tersimpan" muncul
  - Close browser, reopen, cek restore prompt
  - Pulihkan draft, verify content correct
  - Abaikan draft, verify server content loaded
  - Manual save, cek draft cleared

---

#### Checkpoint Phase 1

- [ ] 5.1 Run all Phase 1 tests
  - `yarn jest --testPathPattern="version-tracking|unsaved-changes|image-upload|auto-save"`
  - Pastikan semua unit tests passing
  - Pastikan semua E2E tests passing

- [ ] 5.2 Manual verification checklist
  - ✅ Version tracking: Create lesson → version = 1, Edit → version increment
  - ✅ Unsaved changes: Edit → navigate → warning muncul
  - ✅ Image upload: Upload gambar → muncul di editor
  - ✅ Auto-save: Edit → wait 10s → draft tersimpan

- [ ] 5.3 Code quality check
  - `yarn tsc --noEmit` → no TypeScript errors
  - `yarn lint` → no lint errors
  - Review code coverage untuk Phase 1 features

- [ ] 5.4 User acceptance
  - Tanya user jika ada pertanyaan atau feedback
  - Demo Phase 1 features ke user
  - Confirm sebelum lanjut ke Phase 2

---

### Phase 2: Performance & UX (P1)

---

#### Feature 5: Component Memoization

**Research Needed:**
- [ ] Review React.memo documentation dan best practices
- [ ] Baca tentang React re-render optimization
- [ ] Review React DevTools Profiler untuk measure performance

**Implementation:**
- [ ] 5.1 Memoize sortable components
  - Wrap `SortableSectionItem` dengan `React.memo` di `ManageSidebar.tsx`
  - Wrap `SortableLessonItem` dengan `React.memo` di `ManageSidebar.tsx`
  - Wrap `EditorToolbar` dengan `React.memo` di `EditorToolbar.tsx`
  - _Requirements: 6.1, 6.2, 6.5_

**Testing:**
- [ ] 5.2 Unit Test: Test memoization behavior
  - Test SortableSectionItem tidak re-render saat props unchanged
  - Test SortableLessonItem tidak re-render saat props unchanged
  - Test EditorToolbar tidak re-render saat editor state unchanged
  - Use React Testing Library dengan custom render counter
  - File: `__tests__/unit/components/memoization.test.tsx`

- [ ] 5.3 Performance Test: Measure re-render reduction
  - Benchmark DnD operations sebelum dan sesudah memoization
  - Measure render count dengan React DevTools Profiler
  - Document performance improvement di test file
  - File: `__tests__/performance/component-memoization.test.ts`

- [ ] 5.4 E2E Test (Playwright): Test DnD performance
  - Test: Drag section → verify smooth animation
  - Test: Drag lesson → verify no lag
  - Test: Multiple rapid drags → verify performance stable
  - File: `__tests__/e2e/dnd-performance.spec.ts`

**Verification:**
- [ ] 5.5 Manual verification
  - Open React DevTools Profiler
  - Perform DnD operations, measure re-renders
  - Compare before/after memoization
  - Verify smoother DnD experience

---

#### Feature 6: Keyboard Shortcut Hints

**Research Needed:**
- [ ] Review shadcn/ui Tooltip component documentation
- [ ] Baca tentang cross-platform keyboard detection (Mac vs Windows)
- [ ] Review Tiptap keyboard shortcuts documentation

**Implementation:**
- [ ] 6.1 Buat `lib/utils/keyboard.ts` dengan fungsi `getModKey()`
  - Return `'Cmd'` untuk Mac, `'Ctrl'` untuk Windows/Linux
  - Gunakan `navigator.platform` untuk deteksi OS
  - Handle SSR case (window undefined)
  - _Requirements: 7.2_

- [ ] 6.2 Tambahkan tooltips ke `EditorToolbar.tsx`
  - Wrap setiap toolbar button group dengan `TooltipProvider` dari shadcn/ui
  - Tambahkan tooltip untuk Bold, Italic, Code, Link, H1/H2/H3, Save
  - Gunakan `getModKey()` untuk menampilkan modifier key yang tepat
  - Set `delayDuration={300}` pada TooltipProvider
  - _Requirements: 7.1, 7.3, 7.4, 7.5, 7.6, 7.7_

**Testing:**
- [ ] 6.3 Unit Test: Test getModKey utility
  - Test return 'Cmd' untuk Mac platform
  - Test return 'Ctrl' untuk Windows platform
  - Test return 'Ctrl' saat window undefined (SSR)
  - Mock navigator.platform untuk testing
  - File: `__tests__/unit/lib/keyboard.test.ts`

- [ ] 6.4 Unit Test: Test toolbar tooltips
  - Test tooltip muncul saat hover button
  - Test tooltip content correct (action + shortcut)
  - Test tooltip delay 300ms
  - Test tooltip untuk semua buttons (Bold, Italic, etc)
  - File: `__tests__/unit/components/EditorToolbar.test.tsx`

- [ ] 6.5 E2E Test (Playwright): Test keyboard shortcuts
  - Test: Hover Bold button → verify tooltip "Bold (Ctrl+B)"
  - Test: Press Ctrl+B → verify text bold
  - Test: Hover H1 button → verify tooltip "Heading 1 (Ctrl+Shift+1)"
  - Test: Press Ctrl+Shift+1 → verify heading applied
  - Test: All documented shortcuts work correctly
  - File: `__tests__/e2e/keyboard-shortcuts.spec.ts`

**Verification:**
- [ ] 6.6 Manual verification
  - Hover semua toolbar buttons, cek tooltips muncul
  - Test semua keyboard shortcuts berfungsi
  - Test di Mac dan Windows (jika available)

---

#### Feature 7: Link Behavior Enhancement

**Research Needed:**
- [ ] Review Tiptap editorProps.handleDOMEvents documentation
- [ ] Baca tentang link handling best practices di rich text editors
- [ ] Review CSS tooltip implementation patterns

**Implementation:**
- [ ] 7.1 Implementasi Ctrl+Click link behavior
  - Tambahkan `editorProps.handleDOMEvents.click` ke editor config di `LessonEditorPanel`
  - Detect `event.ctrlKey || event.metaKey` saat klik pada elemen `<a>`
  - Buka link di tab baru dengan `window.open(..., '_blank', 'noopener,noreferrer')`
  - Tambahkan CSS tooltip "Ctrl+Click untuk membuka" saat hover link di editor
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

**Testing:**
- [ ] 7.2 Unit Test: Test link click handler
  - Test regular click → cursor placed for editing
  - Test Ctrl+Click → window.open called
  - Test Cmd+Click (Mac) → window.open called
  - Mock window.open untuk testing
  - File: `__tests__/unit/components/LinkBehavior.test.tsx`

- [ ] 7.3 E2E Test (Playwright): Test link interaction
  - Test: Regular click link → cursor placed, link not opened
  - Test: Ctrl+Click link → new tab opened
  - Test: Hover link → tooltip "Ctrl+Click untuk membuka" muncul
  - Test: Edit link text → verify editable
  - File: `__tests__/e2e/link-behavior.spec.ts`

**Verification:**
- [ ] 7.4 Manual verification
  - Insert link di editor
  - Regular click → verify cursor placed
  - Ctrl+Click → verify link opened di new tab
  - Hover link → verify tooltip muncul

---

#### Checkpoint Phase 2

- [ ] 8.1 Run all Phase 2 tests
  - `yarn jest --testPathPattern="memoization|keyboard|link-behavior"`
  - Pastikan semua unit tests passing
  - Pastikan semua E2E tests passing

- [ ] 8.2 Manual verification checklist
  - ✅ Memoization: DnD lebih smooth, less re-renders
  - ✅ Keyboard shortcuts: Tooltips muncul, shortcuts work
  - ✅ Link behavior: Ctrl+Click opens link

- [ ] 8.3 Performance metrics
  - Document re-render reduction percentage
  - Measure DnD operation time improvement
  - Compare before/after metrics

- [ ] 8.4 User acceptance
  - Tanya user jika ada pertanyaan atau feedback
  - Demo Phase 2 features ke user
  - Confirm sebelum lanjut ke Phase 3

---

### Phase 3: Code Quality (P2)

---

#### Feature 8: Extension Centralization
---

#### Feature 8: Extension Centralization

**Research Needed:**
- [ ] Review semua Tiptap extensions yang digunakan di codebase
- [ ] Audit usage dari Selection extension (grep codebase)
- [ ] Review Typography extension features dan benefits

**Implementation:**
- [ ] 8.1 Buat `lib/tiptap/extensions.ts`
  - Export `commonExtensions` (StarterKit, TextAlign, Highlight, Typography, Superscript, Subscript)
  - Export `createEditorExtensions(saveRef)` factory function (+ Image, HeadingShortcuts, SaveShortcut)
  - Export `viewerExtensions` (commonExtensions + Image untuk render)
  - Export `descriptionExtensions` (StarterKit only)
  - Hapus `Selection` extension (tidak digunakan)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 10.1, 10.2_

- [ ] 8.2 Update semua editor components untuk import dari `lib/tiptap/extensions.ts`
  - Update `LessonEditorPanel` di `ManageContent.tsx`
  - Update `LessonViewerPanel` di `ManageContent.tsx`
  - Update `DescriptionEditor` di `ManageContent.tsx`
  - Hapus inline extension definitions dari semua komponen
  - _Requirements: 9.6, 9.7, 9.8_

**Testing:**
- [ ] 8.3 Unit Test: Test extension configurations
  - Test commonExtensions contains correct extensions
  - Test createEditorExtensions returns correct array
  - Test viewerExtensions includes Image for rendering
  - Test descriptionExtensions minimal (StarterKit only)
  - File: `__tests__/unit/lib/extensions.test.ts`

- [ ] 8.4 Unit Test: Test editor instances use centralized extensions
  - Test LessonEditorPanel uses createEditorExtensions
  - Test LessonViewerPanel uses viewerExtensions
  - Test DescriptionEditor uses descriptionExtensions
  - Verify no inline extension definitions remain
  - File: `__tests__/unit/components/editor-extensions.test.tsx`

- [ ] 8.5 E2E Test (Playwright): Test all extensions work
  - Test: Bold, Italic, Code formatting work
  - Test: Headings (H1, H2, H3) work
  - Test: Text alignment work
  - Test: Highlight work
  - Test: Superscript, Subscript work
  - Test: Image rendering di viewer
  - File: `__tests__/e2e/editor-extensions.spec.ts`

**Verification:**
- [ ] 8.6 Manual verification
  - Test semua formatting options di editor
  - Verify viewer render semua content correctly
  - Check bundle size reduction (if any)
  - Grep codebase untuk inline extension definitions (should be 0)

---

#### Feature 9: DRY Utilities

**Research Needed:**
- [ ] Audit semua occurrences dari difficulty color logic (grep "BEGINNER|INTERMEDIATE|ADVANCED")
- [ ] Audit semua error handling patterns (grep "instanceof Error")
- [ ] Review Tailwind CSS class naming conventions

**Implementation:**
- [ ] 9.1 Buat `lib/utils/course-helpers.ts`
  - Export `getDifficultyColor(difficulty: string): string`
  - Export `getErrorMessage(error: unknown, fallback: string): string`
  - _Requirements: 11.1, 11.2, 11.4, 11.5_

- [ ] 9.2 Refactor difficulty color usage
  - Update `CourseCard` untuk gunakan `getDifficultyColor`
  - Update `CourseOverviewHero` untuk gunakan `getDifficultyColor`
  - Update `CourseListItem` untuk gunakan `getDifficultyColor`
  - _Requirements: 11.3_

- [ ] 9.3 Refactor error toast pattern
  - Cari semua `err instanceof Error ? err.message : 'Gagal...'` pattern (15+ occurrences)
  - Replace dengan `getErrorMessage(err, 'Gagal...')`
  - _Requirements: 11.6_

**Testing:**
- [ ] 9.4 Unit Test: Test course-helpers utilities
  - Test getDifficultyColor untuk semua difficulty values (BEGINNER, INTERMEDIATE, ADVANCED)
  - Test getDifficultyColor untuk unknown value (fallback)
  - Test getErrorMessage dengan Error instance
  - Test getErrorMessage dengan non-Error value (string, object, null)
  - File: `__tests__/unit/lib/course-helpers.test.ts`

- [ ] 9.5 Unit Test: Test refactored components
  - Test CourseCard uses getDifficultyColor correctly
  - Test CourseOverviewHero uses getDifficultyColor correctly
  - Test CourseListItem uses getDifficultyColor correctly
  - Test error handlers use getErrorMessage correctly
  - File: `__tests__/unit/components/course-components.test.tsx`

- [ ] 9.6 E2E Test (Playwright): Test difficulty colors display
  - Test: Course dengan BEGINNER → verify green color
  - Test: Course dengan INTERMEDIATE → verify yellow color
  - Test: Course dengan ADVANCED → verify red color
  - File: `__tests__/e2e/difficulty-colors.spec.ts`

**Verification:**
- [ ] 9.7 Manual verification
  - Check semua course cards display correct colors
  - Trigger error scenarios, verify error messages correct
  - Grep codebase untuk old patterns (should be 0)

---

#### Feature 10: ManageContent Split

**Research Needed:**
- [ ] Review ManageContent.tsx current structure (~400 lines)
- [ ] Identify all sub-components dan their dependencies
- [ ] Plan component extraction order (dependencies first)

**Implementation:**
- [ ] 10.1 Extract `DescriptionEditor` ke `features/cms/components/creator/manage/DescriptionEditor.tsx`
  - Pindahkan kode DescriptionEditor function dari ManageContent.tsx
  - Pastikan semua imports terbawa
  - Tambahkan `useEffect` cleanup untuk `editor?.destroy()`
  - _Requirements: 13.4, 15.3, 15.4, 15.5_

- [ ] 10.2 Extract `LessonViewerPanel` ke `features/cms/components/creator/manage/LessonViewerPanel.tsx`
  - Pindahkan kode LessonViewerPanel function
  - Tambahkan `React.memo` wrapper
  - Tambahkan `useEffect` cleanup untuk `editor?.destroy()`
  - _Requirements: 13.3, 6.4, 15.2_

- [ ] 10.3 Extract `LessonEditorPanel` ke `features/cms/components/creator/manage/LessonEditorPanel.tsx`
  - Pindahkan kode LessonEditorPanel function
  - Integrasikan `useUnsavedChanges` dan `useAutoSave` hooks
  - Gunakan `createEditorExtensions` dari `lib/tiptap/extensions.ts`
  - Tambahkan `React.memo` wrapper
  - Tambahkan `useEffect` cleanup untuk `editor?.destroy()`
  - _Requirements: 13.2, 6.3, 15.1_

- [ ] 10.4 Extract `CourseOverview` ke `features/cms/components/creator/manage/CourseOverview.tsx`
  - Pindahkan kode CourseOverview function
  - _Requirements: 13.1_

- [ ] 10.5 Refactor `ManageContent.tsx` menjadi orchestrator
  - Import semua komponen yang sudah di-extract
  - Render berdasarkan `activeView.type`
  - Target: kurang dari 100 baris
  - _Requirements: 13.5, 13.6_

**Testing:**
- [ ] 10.6 Unit Test: Test extracted components
  - Test DescriptionEditor renders correctly
  - Test LessonViewerPanel renders correctly
  - Test LessonEditorPanel renders correctly
  - Test CourseOverview renders correctly
  - Test editor cleanup called on unmount
  - File: `__tests__/unit/components/manage/*.test.tsx`

- [ ] 10.7 Unit Test: Test ManageContent orchestrator
  - Test correct component rendered based on activeView
  - Test props passed correctly to child components
  - Test ManageContent < 100 lines
  - File: `__tests__/unit/components/ManageContent.test.tsx`

- [ ] 10.8 E2E Test (Playwright): Test all views work after split
  - Test: Navigate to Course Overview → verify renders
  - Test: Navigate to Lesson Editor → verify renders
  - Test: Navigate to Lesson Viewer → verify renders
  - Test: Switch between views → verify no errors
  - File: `__tests__/e2e/manage-content-views.spec.ts`

**Verification:**
- [ ] 10.9 Manual verification
  - Navigate semua views di ManageContent
  - Verify functionality identical sebelum/sesudah split
  - Check ManageContent.tsx line count < 100
  - Run existing tests → verify all passing

---

#### Feature 11: Content Preview Generation

**Research Needed:**
- [ ] Review Tiptap JSONContent structure
- [ ] Understand node types (paragraph, heading, listItem, etc)
- [ ] Review current preview implementation di lesson.service.ts

**Implementation:**
- [ ] 11.1 Buat `lib/tiptap/preview.ts`
  - Export `generatePreview(content: JSONContent | null | undefined, maxLength?: number): string`
  - Traverse Tiptap JSON recursively untuk extract text
  - Tambahkan separator setelah block nodes (paragraph, heading)
  - Prefix listItem dengan `• `
  - Truncate ke maxLength dengan `...` suffix
  - Handle empty/null content
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [ ] 11.2 Gunakan `generatePreview` di lesson list API
  - Update `extractContentPreview` di `lesson.service.ts` atau API route
  - Replace implementasi saat ini dengan `generatePreview`
  - _Requirements: 14.8_

**Testing:**
- [ ] 11.3 Unit Test: Test generatePreview function
  - Test dengan paragraph nodes → verify text extracted
  - Test dengan heading nodes → verify text extracted dengan separator
  - Test dengan list nodes → verify `• ` prefix
  - Test truncation dengan maxLength → verify `...` appended
  - Test empty content → verify empty string returned
  - Test null/undefined content → verify empty string returned
  - **Property 5: Preview Text Extraction**
  - **Property 6: Preview Truncation**
  - **Validates: Requirements 14.3, 14.5, 14.6, 14.7**
  - File: `__tests__/unit/lib/preview.test.ts`

- [ ] 11.4 API Test (Postman): Test lesson list with preview
  - Test GET `/api/lessons` → verify preview field present
  - Test preview content matches generatePreview output
  - Test preview truncated correctly
  - Export collection ke `docs/api/lesson-preview.postman.json`

- [ ] 11.5 E2E Test (Playwright): Test preview in lesson list
  - Test: Create lesson dengan content → verify preview muncul di list
  - Test: Long content → verify preview truncated dengan `...`
  - Test: Content dengan list → verify `• ` prefix
  - File: `__tests__/e2e/lesson-preview.spec.ts`

**Verification:**
- [ ] 11.6 Manual verification
  - Create lesson dengan berbagai content types
  - Check lesson list, verify preview accurate
  - Verify truncation works correctly

---

#### Feature 12: Prop Drilling Reduction

**Research Needed:**
- [ ] Audit semua props yang diterima SortableSectionItem (count them)
- [ ] Identify section-related vs lesson-related props
- [ ] Review all call sites dari SortableSectionItem

**Implementation:**
- [ ] 12.1 Refactor SortableSectionItem props
  - Audit semua 20+ props yang diterima `SortableSectionItem`
  - Group section action props menjadi `sectionActions` object
  - Group lesson action props menjadi `lessonActions` object
  - Update semua call sites
  - Verifikasi functionality tidak berubah
  - Target: ≤10 props total
  - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

**Testing:**
- [ ] 12.2 Unit Test: Test SortableSectionItem with new props
  - Test sectionActions object passed correctly
  - Test lessonActions object passed correctly
  - Test all actions still work (add, edit, delete, reorder)
  - Test prop count ≤10
  - File: `__tests__/unit/components/SortableSectionItem.test.tsx`

- [ ] 12.3 E2E Test (Playwright): Test section/lesson actions
  - Test: Add section → verify works
  - Test: Edit section → verify works
  - Test: Delete section → verify works
  - Test: Reorder sections → verify works
  - Test: Add lesson to section → verify works
  - File: `__tests__/e2e/section-lesson-actions.spec.ts`

**Verification:**
- [ ] 12.4 Manual verification
  - Test semua section actions (add, edit, delete, reorder)
  - Test semua lesson actions
  - Verify functionality identical
  - Count props → verify ≤10

---

#### Final Checkpoint Phase 3

- [ ] 13.1 Run all Phase 3 tests
  - `yarn jest --testPathPattern="extensions|dry-utilities|manage-content|preview|prop-drilling"`
  - Pastikan semua unit tests passing
  - Pastikan semua E2E tests passing

- [ ] 13.2 Run full test suite
  - `yarn jest` → all tests passing
  - `yarn test:e2e` → all E2E tests passing
  - Check code coverage → target >80%

- [ ] 13.3 Code quality final check
  - `yarn tsc --noEmit` → no TypeScript errors
  - `yarn lint` → no lint errors
  - `yarn build` → build successful
  - Check bundle size → verify no significant increase

- [ ] 13.4 Manual verification checklist (All Phases)
  - ✅ Phase 1: Version tracking, Unsaved changes, Image upload, Auto-save
  - ✅ Phase 2: Memoization, Keyboard shortcuts, Link behavior
  - ✅ Phase 3: Extensions, DRY utilities, Component split, Preview, Props

- [ ] 13.5 Documentation
  - Update README dengan new features
  - Document API changes (jika ada)
  - Update Postman collections
  - Document breaking changes (jika ada)

- [ ] 13.6 User acceptance final
  - Demo semua features ke user
  - Collect feedback
  - Address any concerns
  - Get final approval

---

## Notes

- **Testing adalah WAJIB** — tidak ada optional tests
- Setiap feature harus complete (Implement → Unit Test → API Test → E2E Test) sebelum lanjut
- Research documentation SEBELUM implementasi untuk memastikan best practices
- Phase 1 harus selesai sebelum Phase 2, Phase 2 sebelum Phase 3
- Bucket `lesson-images` di Supabase harus dibuat manual sebelum Feature 3

## Testing Summary

| Feature | Unit Tests | API Tests | E2E Tests |
|---------|-----------|-----------|-----------|
| 1. Version Tracking | ✅ | ✅ | ✅ |
| 2. Unsaved Changes | ✅ | - | ✅ |
| 3. Image Upload | ✅ | ✅ | ✅ |
| 4. Auto-save | ✅ | - | ✅ |
| 5. Memoization | ✅ | - | ✅ |
| 6. Keyboard Shortcuts | ✅ | - | ✅ |
| 7. Link Behavior | ✅ | - | ✅ |
| 8. Extensions | ✅ | - | ✅ |
| 9. DRY Utilities | ✅ | - | ✅ |
| 10. Component Split | ✅ | - | ✅ |
| 11. Preview | ✅ | ✅ | ✅ |
| 12. Prop Drilling | ✅ | - | ✅ |

## Property-Based Tests Summary

| Property | Feature | Task | Requirement |
|----------|---------|------|-------------|
| Property 1: Version Increment | Version Tracking | 1.2 | 1.3 |
| Property 2: Dirty State Round-trip | Unsaved Changes | 2.3 | 2.7, 2.8 |
| Property 3: Image Validation — Size | Image Upload | 3.5 | 3.5, 3.6 |
| Property 4: Image Validation — Type | Image Upload | 3.5 | 3.4, 3.7 |
| Property 5: Preview Text Extraction | Preview | 11.3 | 14.3, 14.5 |
| Property 6: Preview Truncation | Preview | 11.3 | 14.6 |

---

**Document Version:** 2.0  
**Last Updated:** 2026-05-03  
**Status:** Ready for Implementation — Test-Driven Approach
