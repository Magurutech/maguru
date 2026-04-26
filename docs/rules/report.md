# PR Report: feature/quiz-dashboard → develop

**Branch:** `feature/quiz-dashboard`
**Target:** `develop`
**Date:** 2026-04-26
**Sprint:** Sprint 2 (Content First) + Sprint 2b (Course Discovery)

---

## Ringkasan

Branch ini menyelesaikan dua spec utama:

1. **Course Content Management V2** (`.kiro/specs/course-content-management-v2`) — sistem manajemen konten kursus berbasis Tiptap JSON
2. **Course Discovery & Enrollment** (`.kiro/specs/course-discovery`) — fitur browse, enroll, dan manajemen kursus untuk student dan creator

---

## Yang Dikerjakan

### Spec 1: Course Content Management V2

**Backend**
- Database schema: `Section`, `Lesson`, `LessonProgress`, `CourseCompletion` dengan indexes dan cascade delete
- Service layer: `course.service`, `section.service`, `lesson.service`, `progress.service`, `authorization.service`
- API routes: sections CRUD, lessons CRUD, progress tracking (`/api/progress/lesson/[id]/complete`, `/api/progress/course/[slug]`)
- Tiptap JSON validation (manual validation, tanpa Zod dependency)

**Frontend**
- Creator: `LessonEditor`, `EditorToolbar`, `LessonPreview`, `SectionList`, `LessonList`, `SectionForm`, `LessonForm`
- Student: `LessonViewer`, `CourseNavigation`, `ProgressBar`, `LessonNavigation`
- Manage page: `/creator/courses/[slug]/manage` dengan Context API (`ManageContext`) + hooks modular
- Learn page: `/course/[slug]/learn` dengan sidebar navigation dan progress tracking

**Testing**
- 324 unit tests passing (services + components)
- Postman collections: sections, lessons, progress
- E2E Playwright: creator workflow, student learn workflow

---

### Spec 2: Course Discovery & Enrollment

**Backend**
- API: `GET /api/courses`, `GET /api/courses/[slug]`, `POST /api/courses/[slug]/enroll`
- API: `GET /api/courses/my-courses`, `POST /api/creator/courses`, `PUT /api/creator/courses/[slug]/publish`
- Database migration: tambah field `difficulty` ke `courses`, `completed`/`completedAt` ke `enrollments`

**Frontend**
- `CourseCard`, `CourseFilters` (debounce + URL params), `EnrollButton`
- Pages: `/course` (catalog), `/course/[slug]` (detail), `/student/courses` (my courses)
- Pages: `/creator/courses/create`, `/creator` dashboard (real data + stats)
- Hooks: `useCreatorCourses`, `useCourseCatalogFilters`, `useEnrollment`
- Types centralized: `features/cms/types/course.types.ts`

**Testing**
- Unit tests: `EnrollButton`, `CourseFilters`, `CourseNavigation`, `LessonViewer`, dll
- E2E: student catalog, my-courses, creator dashboard, create-course

---

### Refactor & Code Quality

- Migrasi routing dari ID ke slug di semua komponen dan API
- Manage page refactor: `ManageProvider` + modular hooks (`useSectionHandlers`, `useLessonHandlers`, `useReorderHandlers`)
- Centralisasi types di `features/cms/types/`
- Utility helpers: `difficulty-colors.ts`, `error-toast.ts`
- Fix `tiptap.test.ts` agar sesuai dengan implementasi validasi manual (tanpa Zod)

---

## Test Status

```
Unit Tests:  324/324 passed ✅
E2E Tests:   Playwright specs tersedia (jalankan manual)
Lint:        0 errors ✅
Type check:  0 errors ✅
```

