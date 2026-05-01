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
