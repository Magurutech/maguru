# Bug Report: Student Learn Page

**Tanggal:** 2026-04-10  
**Scope:** Manual Testing Section 2.2 & 2.3  
**Environment:** http://localhost:3000/course/[slug]/learn

---

## 🔴 Critical Issues Found

### Issue 1: Section Kedua Tidak Menampilkan Lessons
**Severity:** 🔴 Critical  
**Status:** Root cause identified  
**Detail:** `docs/rules/bug-analysis-section-lessons.md`

**Symptoms:**
- Section 1 "Berkenalan Dengan Python" (1/7) ✅ Menampilkan 7 lessons
- Section 2 "Pengenalan Variable" (0/0) ❌ Kosong meski di-expand
- Section 3+ juga akan kosong jika di-expand manual

**Root Cause:**
State disconnect antara UI dan data fetching:
- `CourseNavigation` component: local state `openSections` (UI only)
- `LearnContext`: state `expandedSections` (triggers lazy loading)
- User klik section → UI expand tapi data tidak di-fetch

**Impact:**
- User tidak bisa akses lessons di section 2+
- Fitur core tidak berfungsi
- Blocking untuk deployment

**Solution:**
1. Pass `toggleSection` dari context ke `CourseNavigation` component
2. Hapus local state `openSections` di component
3. Use `expandedSections` dari props
4. Ensure `onSectionToggle` callback triggers data fetching

**Files to Modify:**
- `features/cms/components/student/CourseNavigation.tsx`
- `app/course/[slug]/learn/page.tsx`

---

### Issue 2: Tiptap Content Tidak Ter-render dengan Benar
**Severity:** 🔴 Critical  
**Status:** ✅ FIXED (2026-04-10)  
**Detail:** `docs/rules/tiptap-rendering-comparison.md`

**Problem:**
- Creator view: ✅ Rendering sempurna dengan formatting
- Student view: ❌ Plain text tanpa formatting (BEFORE FIX)
- Student view: ✅ Rendering sempurna dengan formatting (AFTER FIX)

**Root Cause:**
1. **Extensions mismatch** - Student hanya pakai StarterKit
2. **CSS missing** - Tidak ada node styles
3. **Class mismatch** - Different styling approach

**Solution Implemented:**
✅ Added Tiptap extensions (TextAlign, Highlight, Typography, Superscript, Subscript, Selection)
✅ Added SCSS imports (6 node styles + simple-editor.scss)
✅ Updated editor class to `simple-editor`
✅ Updated EditorContent className
✅ Achieved WYSIWYG consistency with creator

**Files Modified:**
- ✅ `features/cms/components/student/LessonViewer.tsx`

**Testing Required:**
- [ ] Headings ter-render dengan ukuran berbeda
- [ ] Bold/italic ter-render dengan benar
- [ ] Code blocks ter-render dengan background
- [ ] Lists ter-render dengan bullets/numbers
- [ ] Text alignment ter-render
- [ ] Highlighted text ter-render
- [ ] Visual hierarchy jelas
- [ ] No console errors

---

## 🟡 Medium Priority Issues

### Issue 3: Warna Selection Lesson Terlalu Gelap
**Severity:** 🟡 Medium  
**Status:** Identified  
**Detail:** `docs/rules/plan.md` (UX Improvements section)

**Problem:**
- Active lesson: `bg-merah-100 text-merah-700 font-semibold`
- Text terlalu gelap untuk background
- Kontras kurang optimal

**Solution:**
```tsx
// Active state
bg-merah-50 text-merah-600 font-medium border-l-2 border-merah-500

// Hover state (non-active)
hover:bg-beige-100 hover:text-beige-900
```

**Files to Modify:**
- `features/cms/components/student/CourseNavigation.tsx`

---

## ✅ Working Features

### Expand/Collapse Sidebar
**Status:** ✅ Already implemented  
**Detail:** `docs/rules/plan.md`

- State `sidebarOpen` dengan toggle button
- Smooth transition `transition-all duration-300`
- Icons `PanelLeftClose` / `PanelLeftOpen`
- Width: `w-72` (expanded) → `w-12` (collapsed)

No action needed.

---

## Testing Checklist

### After Fix Issue 1 (Section Lessons):
- [ ] Section 1 masih menampilkan lessons
- [ ] Section 2 menampilkan lessons saat di-expand
- [ ] Section 3+ juga menampilkan lessons
- [ ] Collapse section tidak hilangkan data
- [ ] Re-expand tidak fetch ulang (use cache)
- [ ] Loading state tampil saat fetch
- [ ] Error handling jika fetch gagal
- [ ] No console errors
- [ ] No infinite loops

### After Fix Issue 2 (Tiptap Rendering):
- [ ] Headings ter-render dengan ukuran berbeda
- [ ] Bold text ter-render bold
- [ ] Italic text ter-render italic
- [ ] Code blocks ter-render dengan background
- [ ] Inline code ter-render monospace
- [ ] Bullet lists ter-render dengan bullets
- [ ] Numbered lists ter-render dengan numbers
- [ ] Blockquotes ter-render dengan border
- [ ] Text alignment ter-render (left/center/right)
- [ ] Highlighted text ter-render dengan color
- [ ] Superscript/subscript ter-render
- [ ] Typography enhancements ter-render
- [ ] Visual hierarchy jelas
- [ ] No raw JSON visible
- [ ] No console errors
- [ ] Responsive di mobile

### After Fix Issue 3 (Color):
- [ ] Active lesson readable
- [ ] Hover state clear
- [ ] Border accent visible
- [ ] Consistent dengan design system

---

## Priority

1. **🔴 P0 (Blocker):** Issue 1 & 2 - Must fix before deployment
2. **🟡 P1 (High):** Issue 3 - Should fix before deployment
3. **✅ P2 (Done):** Sidebar expand/collapse - Already working

---

## Related Files

- Analysis: `docs/rules/bug-analysis-section-lessons.md`
- Comparison: `docs/rules/tiptap-rendering-comparison.md`
- Plan: `docs/rules/plan.md`
- Testing: `docs/testing/manual-test-content-management.md`
