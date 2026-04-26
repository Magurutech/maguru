# System Flow Report — Task 17: Performance Optimization
**Dibuat:** 2026-04-11  
**Scope:** features/cms + app/api (CMS routes)  
**Tujuan:** Analisis file-file yang terlibat sebelum mengerjakan Task 17

---

## 1. Arsitektur Sistem CMS

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                           │
├──────────────────────────┬──────────────────────────────────────┤
│   CREATOR (Manage Page)  │        STUDENT (Learn Page)          │
│                          │                                      │
│  ManageContext.tsx        │  LearnContext.tsx                    │
│  ├── useCourseManage     │  ├── useCourseLearn                  │
│  ├── useLessonHandlers   │  ├── useLessonLearn                  │
│  ├── useSectionHandlers  │  └── useProgressHandlers             │
│  ├── useManageView       │                                      │
│  └── useReorderHandlers  │  Components:                         │
│                          │  ├── LessonViewer.tsx                │
│  Components:             │  ├── CourseNavigation.tsx            │
│  ├── ManageSidebar.tsx   │  ├── LessonNavigation.tsx            │
│  ├── ManageContent.tsx   │  └── ProgressBar.tsx                 │
│  ├── ManageHeader.tsx    │                                      │
│  └── ManageDialogs.tsx   │                                      │
└──────────────────────────┴──────────────────────────────────────┘
            │                              │
            ▼                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│  app/api/courses/[slug]/sections/route.ts                       │
│  app/api/courses/[slug]/sections/[sectionId]/route.ts           │
│  app/api/courses/[slug]/sections/[sectionId]/lessons/route.ts   │
│  app/api/courses/[slug]/sections/[sectionId]/lessons/[id]/route │
│  app/api/progress/course/[slug]/route.ts                        │
│  app/api/progress/lesson/[lessonId]/complete/route.ts           │
│  app/api/creator/courses/[slug]/publish/route.ts                │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  features/cms/services/                                         │
│  ├── course.service.ts       → getCourseBySlug, checkOwnership  │
│  ├── section.service.ts      → CRUD sections + JOIN queries     │
│  ├── lesson.service.ts       → CRUD lessons + content preview   │
│  ├── progress.service.ts     → markComplete, getCourseProgress  │
│  ├── authorization.service.ts → Clerk auth checks               │
│  ├── creator-course.service.ts → Creator dashboard queries      │
│  └── enrollment.service.ts   → Student enrollment               │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER (Prisma)                        │
├─────────────────────────────────────────────────────────────────┤
│  Tables: courses, sections, lessons, lesson_progress,           │
│          course_completions, users, enrollments                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. File List — Terkait Task 17

### 2.1 Service Layer (Backend Logic)

| File                                             | Fungsi                           | Relevansi Task 17                                     |                                                     |
| --------------------------------------------------| ----------------------------------| -------------------------------------------------------| -----------------------------------------------------|
| `f-----                                          | ---/services/section.service.ts` | CRUD sections, JOIN queries                           | ✅ 17.1 — sudah pakai `relationLoadStrategy: 'join'` |
| --------s/cms/services/lesson.service.ts`        | CRUD lessons, content preview    | ✅ 17.1 — sudah pakai `select` fields                  |                                                     |
| `featur--------   ices/progress.service.ts`      | Mark complete, course progress   | ⚠️ 17.1 — `getCourseProgress` masih 3 queries terpisah |                                                     |
| `fe       cms/services/course.service.ts`        | Course lookup, ownership check   | ✅ Sudah optimal                                       |                                                     |
| `f        cms/services/authorization.service.ts` | Auth checks                      | ✅ Tidak perlu diubah                                  |                                                     |

### 2        outes

| File     | Endpoint                            | Relevansi Task 17   |                                        |
| ----------| -------------------------------------| ---------------------| ----------------------------------------|
| `a       | i/courses/[slug]/sections/route.ts` | GET/POST sections   | ✅ Sudah optimal (pakai service)        |
| `app/    | i/progress/course/[slug]/route.ts`  | GET course progress | ⚠️ 17.1 — service-nya masih 3 queries   |
| `app/api | esson/[lessonId]/complete/route.ts` | POST mark complete  | ⚠️ 17.1 — trigger 2 extra count queries |

###           t & Hooks (Frontend)

| File | Fungsi                                    | Relevansi Task 17         |                                               |
| ------| -------------------------------------------| ---------------------------| -----------------------------------------------|
|      | cms/context/creator/ManageContext.tsx`    | State management creator  | ⚠️ 17.3 — banyak state, bisa memoize           |
| `fe  | ms/context/student/LearnContext.tsx`      | State management student  | ✅ Sudah cukup lean                            |
| `f   | hooks/manage/useCourseManage.ts`          | Fetch course + sections   | ⚠️ 17.2 — 2 fetch terpisah (course + sections) |
| `fea | s/hooks/learn/useCourseLearn.ts`          | Fetch sections + progress | ⚠️ 17.2 — 3 fetch paralel, bisa dikurangi      |
|      | cms/hooks/learn/useLessonLearn.ts`        | Fetch lesson content      | ⚠️ 17.2 — fetch per-lesson saat klik           |
|      | s/cms/hooks/learn/useProgressHandlers.ts` | Mark complete handler     | ✅ Sudah lean                                  |

###         onents (Frontend Rendering)

| File | Fungsi                                          | Relevansi Task 17     |                                                     |     |
| ------| -------------------------------------------------| -----------------------| -----------------------------------------------------| -----|
|      | res/cms/components/student/LessonViewer.tsx`    | Render Tiptap content | ✅ 17.3 — sudah `shouldRerenderOnTransaction: false` |     |
| `fe  | res/cms/components/student/ProgressBar.tsx`     | Progress indicator    | ⚠️ 17.3 — kandidat `React.memo`                      |     |
| `fea | s/cms/components/student/CourseNavigation.tsx`  | Sidebar navigation    | ⚠️ 17.3 — render banyak items, kandidat `React.memo` |     |
| `    | ms/components/student/LessonNavigation.tsx`     | Prev/next buttons     | ✅ Sudah simple                                      |     |
|      | ms/components/creator/manage/ManageSidebar.tsx` | Creator sidebar       | ⚠️ 17.3 — DnD + banyak items, kandidat `useMemo`     |     |
| `fe  | components/creator/manage/ManageContent.tsx`    | Editor + viewer       | ⚠️ 17.3 — Tiptap editor berat, lazy load kandidat    |     |
|      |                                                 |                       |                                                     | --  |

##sis Query — Potensi N+1 & Optimasi

### 3.1 ✅ Sudah Dioptimasi

**`section.service.ts` — `getSectionsByCourseSlug()`**
```typescript
// Single JOIN query — course + sections + lesson count
prisma.courses.findUnique({
  where: { slug },
  relationLoadStrategy: 'join',  // ✅ Single SQL JOIN
  select: { sections: { include: { _count: { select: { lessons: true } } } } }
})
```

**`section.service.ts` — `getSectionsWithLessons()`**
```typescript
// Single JOIN query — course + sections + lessons (untuk student learn page)
prisma.courses.findUnique({
  where: { slug },
  relationLoadStrategy: 'join',  // ✅ Single SQL JOIN
  select: { sections: { lessons: { select: { id, title, order, content } } } }
})
```

**`lesson.service.ts` — `getLessonsBySectionWithValidation()`**
```typescript
// Single JOIN query — section + lessons
prisma.sections.findUnique({
  where: { id: sectionId },
  relationLoadStrategy: 'join',  // ✅ Single SQL JOIN
  select: { lessons: { select: { id, title, order, content } } }
})
```

### 3.2 ⚠️ Perlu Dioptimasi

**`progress.service.ts` — `getCourseProgress()` — 3 queries terpisah:**
```typescript
// Query 1: find course by slug
const course = await prisma.courses.findUnique({ where: { slug } })

// Query 2: count total lessons
const totalLessons = await prisma.lessons.count({
  where: { sections: { courseId: course.id } }
})

// Query 3: count completed lessons
const completedLessons = await prisma.lesson_progress.count({
  where: { userId, completed: true, lessons: { sections: { courseId: course.id } } }
})
```
**Fix:** Gunakan `Promise.all()` untuk query 2 & 3 secara paralel.

**`progress.service.ts` — `markLessonComplete()` — 2 extra queries:**
```typescript
// Query 1: find lesson + courseId
const lesson = await prisma.lessons.findUnique({ include: { sections: { select: { courseId } } } })

// Query 2: upsert lesson_progress
await prisma.lesson_progress.upsert(...)

// Query 3 + 4: updateCourseCompletion() → count total + count completed (sequential!)
await this.updateCourseCompletion(userId, courseId)
```
**Fix:** Parallelkan count queries di `updateCourseCompletion()`.

**`useCourseManage.ts` — 2 fetch terpisah (tidak paralel):**
```typescript
// Saat ini: sequential
const courseData = await fetchCourse()
const sectionsData = await fetchSections()
```
Sebenarnya sudah `Promise.all()` — ini sudah OK.

**`useCourseLearn.ts` — 3 fetch paralel tapi endpoint terpisah:**
```typescript
const [sectionsRes, progressRes, completedRes] = await Promise.all([
  fetch(`/api/courses/${courseSlug}/sections?include=lessons`),
  fetch(`/api/progress/course/${courseSlug}`),
  fetch(`/api/progress/course/${courseSlug}/lessons`),  // ← endpoint ini ada?
])
```
**Catatan:** `/api/progress/course/${courseSlug}/lessons` perlu dicek apakah endpoint ini exist.

---

## 4. Analisis Frontend — Potensi Optimasi

### 4.1 React.memo Candidates

| Component      | Alasan                               | Priority |     |     |     |         |                                                             |      |                           |                                  |        |
| ----------------| --------------------------------------| ----------| -----| -----| -----| ---------| -------------------------------------------------------------| ------| ---------------------------| ----------------------------------| --------|
| rogressBar`    | Pure component, props jarang berubah | High     |     |     |     |         |                                                             |      |                           |                                  |        |
| `CourseN       |                                      |          |     |     |     | gation` | Render list sections+lessons, re-render saat lesson dipilih | High |                           |                                  |        |
| sonNavigation` | Pure component prev/next             | Medium   |     |     |     |         |                                                             |      |                           |                                  |        |
| `So            |                                      |          |     |     |     |         |                                                             |      | ssonItem` (ManageSidebar) | Render per-lesson dalam DnD list | Medium |

### 4.2 seCallback Candidates

| Hook/Component                            | Alasan                | Priority |     |     |     |                              |                              |        |                       |                              |        |
| -------------------------------------------| -----------------------| ----------| -----| -----| -----| ------------------------------| ------------------------------| --------| -----------------------| ------------------------------| --------|
| `                                         |                       |          |     |     |     | Context` — `getAllLessons()` | Computed dari sections array | Medium |                       |                              |        |
| `Lea                                      |                       |          |     |     |     |                              |                              |        | ` — `getAllLessons()` | Computed dari sections array | Medium |
| eManage` — `fetchCourse`, `fetchSections` | Sudah `useCallback` ✅ | Done     |     |     |     |                              |                              |        |                       |                              |        |

### 4azy Loading Candidates

| Component                      | Alasan                                      | Priority |     |     |                       |                                            |      |                |                                    |        |
| --------------------------------| ---------------------------------------------| ----------| -----| -----| -----------------------| --------------------------------------------| ------| ----------------| ------------------------------------| --------|
| `M                             |                                             |          |     |     | .tsx` — Tiptap editor | Berat (~200KB), hanya dibutuhkan saat edit | High |                |                                    |        |
| sonViewer.tsx` — Tiptap viewer | Berat, hanya dibutuhkan saat lesson dipilih | Medium   |     |     |                       |                                            |      |                |                                    |        |
| `Manage                        |                                             |          |     |     |                       |                                            |      | tsx` — DnD kit | Library berat, hanya untuk creator | Medium |

---Prisma Schema — Index Status

Berdasarkan design.md, indexes yang seharusnya ada:

```prisma
model sections {
  @@index([courseId])        // ✅ Perlu verifikasi di schema.prisma
  @@unique([courseId, order]) // ✅ Perlu verifikasi
}

model lessons {
  @@index([sectionId])        // ✅ Perlu verifikasi
  @@unique([sectionId, order]) // ✅ Perlu verifikasi
}

model lesson_progress {
  @@index([userId])           // ✅ Perlu verifikasi
  @@index([lessonId])         // ✅ Perlu verifikasi
  @@unique([lessonId, userId]) // ✅ Perlu verifikasi
}

model course_completions {
  @@index([userId])           // ✅ Perlu verifikasi
  @@index([courseId])         // ✅ Perlu verifikasi
  @@unique([courseId, userId]) // ✅ Perlu verifikasi
}
```

---

## 6. Rencana Eksekusi Task 17

### Task 17.1 — Database Query Optimization
**Files yang akan diubah:**
- `features/cms/services/progress.service.ts`
  - `getCourseProgress()`: parallelkan count queries dengan `Promise.all()`
  - `updateCourseCompletion()`: parallelkan count queries dengan `Promise.all()`
- `prisma/schema.prisma`: verifikasi indexes sudah ada

### Task 17.2 — Client-Side Caching
**Files yang akan diubah:**
- `features/cms/hooks/learn/useCourseLearn.ts`: tambah simple cache/SWR pattern
- `features/cms/hooks/learn/useLessonLearn.ts`: cache lesson content yang sudah di-fetch
- `features/cms/hooks/manage/useCourseManage.ts`: cache sections data

### Task 17.3 — Tiptap Rendering Optimization
**Files yang akan diubah:**
- `features/cms/components/student/ProgressBar.tsx`: wrap dengan `React.memo`
- `features/cms/components/student/CourseNavigation.tsx`: wrap dengan `React.memo`
- `features/cms/components/student/LessonNavigation.tsx`: wrap dengan `React.memo`
- `features/cms/components/creator/manage/ManageContent.tsx`: lazy load Tiptap editor

---

## 7. Summary Prioritas

| Priority | Task                                                   | Impact         | Effort |     |     |     |                                                      |                    |     |     |                                               |                       |        |     |                                                 |                  |        |                                            |                  |          |                                   |            |      |
| ----------| --------------------------------------------------------| ----------------| --------| -----| -----| -----| ------------------------------------------------------| --------------------| -----| -----| -----------------------------------------------| -----------------------| --------| -----| -------------------------------------------------| ------------------| --------| --------------------------------------------| ------------------| ----------| -----------------------------------| ------------| ------|
| 🔴 H　　 |                                                        |                |        |     |     |     | 17.1 — Parallelkan count queries di progress.service | Response time -40% | Low |     |                                               |                       |        |     |                                                 |                  |        |                                            |                  |          |                                   |            |      |
| h　　　　| 17.3 — React.memo untuk ProgressBar + CourseNavigation | Re-render -60% | Low    |     |     |     |                                                      |                    |     |     |                                               |                       |        |     |                                                 |                  |        |                                            |                  |          |                                   |            |      |
| 🟡　　　　|                                                        |                |        |     |     |     |                                                      |                    |     | ium | 17.2 — Cache lesson content di useLessonLearn | Network requests -50% | Medium |     |                                                 |                  |        |                                            |                  |          |                                   |            |      |
| 🟡　　　　|                                                        |                |        |     |     |     |                                                      |                    |     |     |                                               |                       |        |     | 17.3 — Lazy load Tiptap editor di ManageContent | Bundle size -30% | Medium |                                            |                  |          |                                   |            |      |
| 🟢　　　　|                                                        |                |        |     |     |     |                                                      |                    |     |     |                                               |                       |        |     |                                                 |                  |        | 17.1 — Verifikasi indexes di schema.prisma | Query speed +20% | Very Low |                                   |            |      |
| 🟢 Low　　|                                                        |                |        |     |     |     |                                                      |                    |     |     |                                               |                       |        |     |                                                 |                  |        |                                            |                  |          | .4 — Performance tests (optional) | Monitoring | High |
