# Bug Analysis: Section Kedua Menampilkan 0/0 Lessons

**Date**: 2026-04-10  
**Issue**: Section pertama menampilkan lessons (1/7), tetapi section kedua dan seterusnya menampilkan (0/0)  
**Status**: 🔴 Critical - Data tidak ter-load untuk section selain yang pertama

---

## Problem Description

Dari screenshot dan manual test 2.2, terlihat:
- Section "Berkenalan Dengan Python" menampilkan 1/7 (ada 7 lessons)
- Section "Pengenalan Variable" menampilkan 0/0 (seharusnya ada lessons)

Dari log error yang diberikan:
```
GET /api/progress/course/test-course-double-postman-dari-postman/lessons 200 in 785ms
GET /api/courses/test-course-double-postman-dari-postman/sections/4b2637a9-1133-4612-a0a6-5863d37a840d/lessons 200 in 910ms
```

Hanya ada **1 request** ke `/sections/[sectionId]/lessons`, padahal ada 2 sections.

---

## Root Cause Analysis

### 1. Data Flow

**File Flow:**
```
app/course/[slug]/learn/page.tsx
  ↓ (uses)
features/cms/context/student/LearnContext.tsx
  ↓ (uses)
features/cms/hooks/learn/useLessonLearn.ts
  ↓ (calls API)
app/api/courses/[slug]/sections/[sectionId]/lessons/route.ts
```

### 2. Problem: Lazy Loading Logic

Di `useLessonLearn.ts`, lessons hanya di-fetch ketika section di-**expand**:

```typescript
const toggleSection = useCallback(
  async (sectionId: string) => {
    const next = new Set(expandedSections)
    if (next.has(sectionId)) {
      next.delete(sectionId)  // Collapse
    } else {
      next.add(sectionId)      // Expand
      if (!lessonsMap[sectionId]) {  // ← Fetch hanya jika belum ada
        try {
          const lessons = await fetchLessons(sectionId)
          setLessonsMap((prev) => ({ ...prev, [sectionId]: lessons }))
        } catch {
          toast.error('Gagal memuat pelajaran')
        }
      }
    }
    setExpandedSections(next)
  },
  [expandedSections, lessonsMap, fetchLessons]
)
```

### 3. Problem: Initial State

Di `CourseNavigation.tsx`, **semua sections di-expand by default**:

```typescript
const [openSections, setOpenSections] = useState<Set<string>>(
  () => new Set(sections.map((s) => s.id))  // ← Semua section di-expand
)
```

**TETAPI**, di `useLessonLearn.ts`, `expandedSections` dimulai **kosong**:

```typescript
const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())  // ← Kosong!
```

### 4. Problem: State Disconnect

Ada **2 state terpisah** yang tidak sinkron:
1. `openSections` di `CourseNavigation` (UI state - untuk expand/collapse visual)
2. `expandedSections` di `useLessonLearn` (data state - untuk fetch lessons)

Ketika user membuka halaman:
- `CourseNavigation` menampilkan semua sections sebagai "expanded" (UI terbuka)
- Tetapi `useLessonLearn` tidak tahu bahwa sections sudah "expanded"
- Lessons tidak di-fetch karena `toggleSection` tidak dipanggil

### 5. Auto-Load Logic

Di `LearnContext.tsx`, ada logic untuk auto-load lesson pertama:

```typescript
useEffect(() => {
  if (loading || sections.length === 0) return

  if (initialLessonId) {
    // Try each section until we find the one containing the lesson
    const tryFindLesson = async () => {
      for (const section of sections) {
        try {
          const res = await fetch(
            `/api/courses/${courseSlug}/sections/${section.id}/lessons`
          )
          // ...
        } catch {
          // continue to next section
        }
      }
    }
    tryFindLesson()
  } else {
    // No lesson in URL — auto-select first lesson of first section
    expandAndSelect(sections[0].id)  // ← Hanya section pertama!
  }
}, [loading, sections.length === 0 ? 0 : 1])
```

Ini hanya memanggil `expandAndSelect(sections[0].id)`, jadi **hanya section pertama yang di-fetch**.

---

## Why This Happens

1. **Initial load**: `expandAndSelect` hanya dipanggil untuk `sections[0]`
2. **UI shows all expanded**: `CourseNavigation` menampilkan semua sections terbuka
3. **Data not loaded**: Lessons untuk section 2+ tidak di-fetch
4. **User sees 0/0**: `lessonsMap[sectionId]` undefined → `section.lessons.length = 0`

---

## Solution Options

### Option 1: Auto-expand All Sections on Load (Recommended)

**Pros**: 
- User langsung melihat semua lessons
- Konsisten dengan UI (semua sections terbuka)
- Lebih baik untuk UX

**Cons**:
- Multiple API calls on initial load
- Sedikit lebih lambat jika banyak sections

**Implementation**:
```typescript
// In LearnContext.tsx useEffect
useEffect(() => {
  if (loading || sections.length === 0) return

  // Expand all sections on initial load
  const expandAll = async () => {
    for (const section of sections) {
      await expandAndSelect(section.id)
    }
    
    // Then select first lesson
    if (initialLessonId) {
      // find and select
    } else {
      await selectLesson(sections[0].lessons[0].id, sections[0].id)
    }
  }
  
  expandAll()
}, [loading, sections.length === 0 ? 0 : 1])
```

### Option 2: Collapse All Sections by Default

**Pros**:
- Lazy loading works as designed
- Faster initial load

**Cons**:
- User harus manually expand setiap section
- Worse UX

**Implementation**:
```typescript
// In CourseNavigation.tsx
const [openSections, setOpenSections] = useState<Set<string>>(
  () => new Set()  // ← Start collapsed
)
```

### Option 3: Sync UI State with Data State

**Pros**:
- Single source of truth
- No state disconnect

**Cons**:
- Requires refactoring
- More complex

**Implementation**:
- Pass `expandedSections` and `toggleSection` from context to `CourseNavigation`
- Remove local `openSections` state
- Use context state for both UI and data

---

## Recommended Fix

**Use Option 3** (Sync states) - This is the cleanest solution and prevents future bugs.

### Changes Required:

1. **LearnContext.tsx**: Pass `expandedSections` and `toggleSection` to page
2. **learn/page.tsx**: Pass these props to `CourseNavigation`
3. **CourseNavigation.tsx**: Remove local `openSections` state, use props instead
4. **Initial load**: Auto-expand first section only (or all if desired)

---

## API Route Analysis

### Current API Routes

From `lessons.postman.json`:
```
POST   /api/courses/[slug]/sections/[sectionId]/lessons
GET    /api/courses/[slug]/sections/[sectionId]/lessons
GET    /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
PUT    /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
```

### Missing Route?

From error log, ada request ke:
```
GET /api/progress/course/test-course-double-postman-dari-postman/lessons
```

Ini adalah route untuk **progress**, bukan untuk **lessons list**. Route ini kemungkinan:
- `/api/progress/course/[slug]/lessons` - Get all lesson progress for a course

**This is correct** - tidak ada masalah dengan API routes. Yang bermasalah adalah **client-side logic** yang tidak memanggil API untuk semua sections.

---

## Debug Logging Recommendations

Add these logs to track the issue:

### 1. In `useLessonLearn.ts` - `toggleSection`:
```typescript
const toggleSection = useCallback(
  async (sectionId: string) => {
    console.log('[toggleSection] Called for:', sectionId)
    console.log('[toggleSection] Current expandedSections:', Array.from(expandedSections))
    console.log('[toggleSection] Current lessonsMap keys:', Object.keys(lessonsMap))
    
    const next = new Set(expandedSections)
    if (next.has(sectionId)) {
      console.log('[toggleSection] Collapsing section:', sectionId)
      next.delete(sectionId)
    } else {
      console.log('[toggleSection] Expanding section:', sectionId)
      next.add(sectionId)
      if (!lessonsMap[sectionId]) {
        console.log('[toggleSection] Fetching lessons for:', sectionId)
        try {
          const lessons = await fetchLessons(sectionId)
          console.log('[toggleSection] Fetched lessons:', lessons.length)
          setLessonsMap((prev) => ({ ...prev, [sectionId]: lessons }))
        } catch (err) {
          console.error('[toggleSection] Error fetching lessons:', err)
          toast.error('Gagal memuat pelajaran')
        }
      } else {
        console.log('[toggleSection] Lessons already cached for:', sectionId)
      }
    }
    setExpandedSections(next)
  },
  [expandedSections, lessonsMap, fetchLessons]
)
```

### 2. In `LearnContext.tsx` - useEffect:
```typescript
useEffect(() => {
  console.log('[LearnContext] useEffect triggered')
  console.log('[LearnContext] loading:', loading)
  console.log('[LearnContext] sections.length:', sections.length)
  
  if (loading || sections.length === 0) return

  console.log('[LearnContext] Sections:', sections.map(s => ({ id: s.id, title: s.title })))
  
  if (initialLessonId) {
    console.log('[LearnContext] Initial lesson ID provided:', initialLessonId)
    // ...
  } else {
    console.log('[LearnContext] No initial lesson, expanding first section')
    expandAndSelect(sections[0].id)
  }
}, [loading, sections.length === 0 ? 0 : 1])
```

### 3. In `CourseNavigation.tsx` - render:
```typescript
{sections.map((section) => {
  const isOpen = openSections.has(section.id)
  const completedCount = section.lessons.filter((l) => l.completed).length
  
  console.log('[CourseNavigation] Rendering section:', {
    id: section.id,
    title: section.title,
    isOpen,
    lessonsCount: section.lessons.length,
    completedCount
  })
  
  // ...
})}
```

---

## Testing Steps

After implementing fix:

1. Clear browser cache and localStorage
2. Open `/course/[slug]/learn`
3. Check console logs:
   - Should see `[toggleSection]` called for each section
   - Should see API calls to `/sections/[sectionId]/lessons` for each section
   - Should see lessons loaded in `lessonsMap`
4. Verify UI:
   - All sections show correct lesson count (e.g., 7/7, 2/2)
   - Clicking section expands/collapses correctly
   - Lessons are visible when expanded

---

## Related Files

**Context & Hooks:**
- `features/cms/context/student/LearnContext.tsx`
- `features/cms/hooks/learn/useLessonLearn.ts`
- `features/cms/hooks/learn/useCourseLearn.ts`

**Components:**
- `app/course/[slug]/learn/page.tsx`
- `features/cms/components/student/CourseNavigation.tsx`

**API Routes:**
- `app/api/courses/[slug]/sections/[sectionId]/lessons/route.ts`
- `app/api/progress/course/[slug]/lessons/route.ts` (for progress data)

**Services:**
- `features/cms/services/lesson.service.ts`
- `features/cms/services/section.service.ts`
