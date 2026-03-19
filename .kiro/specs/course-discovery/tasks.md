# Implementation Tasks: Course Discovery & Enrollment

**Feature:** Course Discovery & Enrollment
**Sprint:** Sprint 2b
**Created:** 2026-03-16
**Status:** Ready for Implementation

---

## Task Overview

| Task | Title | Priority | Status |
|------|-------|----------|--------|
| 1 | Database Migration | 🔴 Critical | ✅ Done |
| 2 | GET /api/courses (Public Catalog API) | 🔴 Critical | ✅ Done |
| 3 | POST /api/courses/[slug]/enroll | 🔴 Critical | ✅ Done |
| 4 | GET /api/courses/my-courses | 🔴 Critical | ✅ Done |
| 5 | POST /api/creator/courses (Create Course) | 🔴 Critical | ✅ Done |
| 6 | PUT /api/creator/courses/[slug]/publish | 🟡 High | ✅ Done |
| 7 | CourseCard Component | 🔴 Critical | ✅ Done |
| 8 | Course Catalog Page (/course) | 🔴 Critical | ✅ Done |
| 9 | My Courses Page (/student/courses) | 🟡 High | ✅ Done |
| 10 | CourseCreationForm Component | 🟡 High | ✅ Done |
| 11 | Course Creation Page (/creator/courses/create) | 🟡 High | ✅ Done |
| 12 | Update Creator Dashboard (real data + stats) | 🟡 High | ✅ Done |
| 13 | Enhance GET /api/creator/courses (stats) | 🟡 High | ✅ Done |
| 14 | API Testing — Student Course (Postman) | 🟢 Medium | ✅ Done |
| 15 | API Testing — Creator Course (Postman) | 🟢 Medium | ✅ Done |
| 16 | E2E Tests — Student Pages | 🟢 Medium | ✅ Done |
| 17 | E2E Tests — Creator Pages | 🟢 Medium | ✅ Done |

---

## Task 1: Database Migration

**Requirements:** 9.1, 9.2, 9.3, 9.4, 9.5, 9.6

### Subtasks

- [x] 1.1 Tambah field `difficulty String? @db.VarChar(50)` ke model `courses` di `prisma/schema.prisma`
- [x] 1.2 Tambah field `completed Boolean @default(false)` ke model `enrollments` di `prisma/schema.prisma`
- [x] 1.3 Tambah field `completedAt DateTime?` ke model `enrollments` di `prisma/schema.prisma`
- [x] 1.4 Tambah index `@@index([status])`, `@@index([category])`, `@@index([difficulty])` ke model `courses`
- [x] 1.5 Tambah index `@@index([userId])`, `@@index([courseId])` ke model `enrollments`
- [x] 1.6 Jalankan `npx prisma migrate dev --name add_course_discovery_fields`
- [x] 1.7 Jalankan `npx prisma generate` untuk update TypeScript types

**Files:**
- `prisma/schema.prisma`

**Verification:**
- Schema compile tanpa error
- Migration file terbuat di `prisma/migrations/`
- Prisma client ter-generate dengan types baru

---

## Task 2: GET /api/courses (Public Catalog API)

**Requirements:** 7.1, 7.2, 7.3, 7.4, 7.5

### Subtasks

- [x] 2.1 Buat file `app/api/courses/route.ts`
- [x] 2.2 Implementasi GET handler dengan query params: `page`, `limit`, `category`, `difficulty`, `search`
- [x] 2.3 Filter hanya courses dengan `status: 'PUBLISHED'`
- [x] 2.4 Implementasi pagination (default: page=1, limit=12, max limit=50)
- [x] 2.5 Implementasi search: filter `title` atau `description` contains search term (case-insensitive)
- [x] 2.6 Include `_count` untuk sections dan lessons
- [x] 2.7 Jika user authenticated (via `currentUser()`), include field `enrolled: boolean` per course
- [x] 2.8 Return response shape: `{ courses: [], pagination: { page, limit, total, totalPages } }`

**Files:**
- `app/api/courses/route.ts` (buat baru — file yang ada adalah `[slug]/route.ts`)

**Note:** File `app/api/courses/[slug]/route.ts` sudah ada, jangan diubah di task ini.

---

## Task 3: POST /api/courses/[slug]/enroll

**Requirements:** 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8

### Subtasks

- [x] 3.1 Buat file `app/api/courses/[slug]/enroll/route.ts`
- [x] 3.2 Implementasi POST handler dengan auth check via `currentUser()`
- [x] 3.3 Return 401 jika user tidak authenticated
- [x] 3.4 Fetch course by ID (slug = course ID), return 404 jika tidak ada
- [x] 3.5 Return 403 jika course status adalah DRAFT
- [x] 3.6 Check existing enrollment, return 409 dengan message "Anda sudah terdaftar di kursus ini" jika sudah ada
- [x] 3.7 Buat enrollment record: `prisma.enrollment.create({ data: { userId, courseId, enrolledAt: new Date() } })`
- [x] 3.8 Return 201 dengan enrollment data

**Files:**
- `app/api/courses/[slug]/enroll/route.ts` (buat baru)

---

## Task 4: GET /api/courses/my-courses

**Requirements:** 3.1, 3.2, 3.6, 7.7, 7.8

### Subtasks

- [x] 4.1 Buat file `app/api/courses/my-courses/route.ts`
- [x] 4.2 Implementasi GET handler dengan auth check, return 401 jika tidak authenticated
- [x] 4.3 Fetch semua enrollments untuk userId dengan include course data
- [x] 4.4 Untuk setiap enrollment, hitung completion percentage dari `lesson_progress` vs total lessons
- [x] 4.5 Return response: `{ enrollments: [{ id, course: {...}, enrolledAt, completed, progress }] }`

**Files:**
- `app/api/courses/my-courses/route.ts` (buat baru)

**Note:** Perlu query `lesson_progress` count per course untuk hitung progress percentage.

---

## Task 5: POST /api/creator/courses (Create Course)

**Requirements:** 5.3, 5.4, 5.6, 5.7, 5.8, 5.9, 8.3, 8.4, 8.7, 8.8

### Subtasks

- [x] 5.1 Tambah POST handler ke file `app/api/creator/courses/route.ts` yang sudah ada
- [x] 5.2 Auth check via `currentUser()`, return 401 jika tidak authenticated
- [x] 5.3 Parse request body: `{ title, description, category, difficulty, status }`
- [x] 5.4 Validasi required fields: title, description, category, difficulty, status — return 400 jika ada yang kosong
- [x] 5.5 Validasi title max 100 chars
- [x] 5.6 Validasi difficulty hanya "Pemula", "Menengah", atau "Mahir"
- [x] 5.7 Validasi status hanya "DRAFT" atau "PUBLISHED"
- [x] 5.8 Buat course: `prisma.course.create({ data: { id: uuid(), title, description, category, difficulty, status, creatorId: user.id, updatedAt: new Date() } })`
- [x] 5.9 Return 201 dengan course data yang baru dibuat

**Files:**
- `app/api/creator/courses/route.ts` (tambah POST handler)

---

## Task 6: PUT /api/creator/courses/[slug]/publish

**Requirements:** 6.1, 6.2, 6.5, 8.5, 8.6

### Subtasks

- [x] 6.1 Buat file `app/api/creator/courses/[slug]/publish/route.ts`
- [x] 6.2 Implementasi PUT handler dengan auth check, return 401 jika tidak authenticated
- [x] 6.3 Fetch course by ID, return 404 jika tidak ada
- [x] 6.4 Verifikasi ownership: `course.creatorId === user.id`, return 403 jika bukan owner
- [x] 6.5 Toggle status: jika DRAFT → PUBLISHED, jika PUBLISHED → DRAFT
- [x] 6.6 Update course: `prisma.course.update({ where: { id }, data: { status: newStatus, updatedAt: new Date() } })`
- [x] 6.7 Return 200 dengan `{ course: { id, title, status } }`

**Files:**
- `app/api/creator/courses/[slug]/publish/route.ts` (buat baru)

---

## Task 7: CourseCard Component

**Requirements:** 1.5, 1.6, 1.7, 4.2

### Subtasks

- [x] 7.1 Buat folder `features/course/components/` jika belum ada
- [x] 7.2 Buat file `features/course/components/CourseCard.tsx`
- [x] 7.3 Implementasi props: `course`, `enrolled`, `onEnroll`, `showManage`
- [x] 7.4 Tampilkan: title, description preview (truncate 150 chars), category badge, difficulty badge
- [x] 7.5 Jika `enrolled=true`: tampilkan "Lanjut Belajar" button (link ke learn page)
- [x] 7.6 Jika `enrolled=false`: tampilkan "Daftar Sekarang" button yang trigger `onEnroll`
- [x] 7.7 Jika `showManage=true`: tampilkan "Manage" button (untuk creator view)
- [x] 7.8 Gunakan Tailwind classes yang konsisten dengan design system yang ada (beige/merah/hijau/kuning)

**Files:**
- `features/course/components/CourseCard.tsx` (buat baru)

---

## Task 8: Course Catalog Page (/course)

**Requirements:** 1.1, 1.2, 1.3, 1.4, 1.8, 1.9, 1.10

### Subtasks

- [x] 8.1 Buat file `app/course/page.tsx` sebagai server component
- [x] 8.2 Baca searchParams: `page`, `category`, `difficulty`, `search`
- [x] 8.3 Fetch data dari `/api/courses` dengan query params yang sesuai
- [x] 8.4 Render grid CourseCard (3 kolom desktop, 2 tablet, 1 mobile)
- [x] 8.5 Buat filter sidebar/bar: dropdown category, dropdown difficulty
- [x] 8.6 Buat search input (client component dengan debounce 300ms, update URL params)
- [x] 8.7 Implementasi pagination controls (prev/next, page numbers)
- [x] 8.8 Implementasi empty state jika tidak ada courses
- [x] 8.9 Enroll action: client component yang call POST /api/courses/[slug]/enroll lalu refresh

**Files:**
- `app/course/page.tsx` (buat baru)
- `app/course/CourseFilters.tsx` (client component untuk filter + search)

---

## Task 9: My Courses Page (/student/courses)

**Requirements:** 3.1, 3.2, 3.3, 3.4, 3.5

### Subtasks

- [x] 9.1 Buat file `app/student/courses/page.tsx` sebagai server component
- [x] 9.2 Auth check: redirect ke `/sign-in` jika tidak authenticated
- [x] 9.3 Fetch data dari `/api/courses/my-courses`
- [x] 9.4 Render grid enrolled CourseCard dengan progress percentage
- [x] 9.5 Tampilkan progress bar per course card
- [x] 9.6 Implementasi empty state dengan link ke `/course`

**Files:**
- `app/student/courses/page.tsx` (buat baru)

---

## Task 10: CourseCreationForm Component

**Requirements:** 5.1, 5.2, 5.6, 5.7, 5.8, 5.9, 5.10

### Subtasks

- [x] 10.1 Buat folder `features/creator/components/` jika belum ada
- [x] 10.2 Buat file `features/creator/components/CourseCreationForm.tsx` sebagai client component
- [x] 10.3 Implementasi form fields: title (text input), description (textarea), category (text input), difficulty (select: Pemula/Menengah/Mahir), status (select: DRAFT/PUBLISHED)
- [x] 10.4 Implementasi client-side validation sebelum submit
- [x] 10.5 Implementasi submit handler: POST ke `/api/creator/courses`
- [x] 10.6 Tampilkan loading state pada submit button saat submitting
- [x] 10.7 Tampilkan inline error messages untuk validation errors
- [x] 10.8 Pada sukses: call `onSuccess(course)` callback
- [x] 10.9 Gunakan komponen UI yang sudah ada (`Button`, `Input`, dll dari `@/components/ui`)

**Files:**
- `features/creator/components/CourseCreationForm.tsx` (buat baru)

---

## Task 11: Course Creation Page (/creator/courses/create)

**Requirements:** 5.1, 5.5

### Subtasks

- [x] 11.1 Buat file `app/creator/courses/create/page.tsx`
- [x] 11.2 Auth check: redirect jika tidak authenticated atau bukan creator
- [x] 11.3 Render `CourseCreationForm` component
- [x] 11.4 Pada `onSuccess`: redirect ke `/creator/courses/[id]/manage`

**Files:**
- `app/creator/courses/create/page.tsx` (buat baru)

---

## Task 12: Update Creator Dashboard

**Requirements:** 4.1, 4.2, 4.3, 4.4, 4.5

### Subtasks

- [x] 12.1 Update `app/creator/page.tsx`: tambah "Buat Kursus Baru" button yang link ke `/creator/courses/create`
- [x] 12.2 Update stats display untuk gunakan data real dari API (totalCourses, publishedCourses, draftCourses)
- [x] 12.3 Tambah publish/unpublish toggle button di setiap course card di dashboard
- [x] 12.4 Toggle button call PUT `/api/creator/courses/[id]/publish` lalu refresh course list
- [x] 12.5 Update empty state untuk tampilkan "Buat Kursus Pertama" CTA

**Files:**
- `app/creator/page.tsx` (update existing)

---

## Task 13: Enhance GET /api/creator/courses

**Requirements:** 4.3, 8.1, 8.2

### Subtasks

- [x] 13.1 Update GET handler di `app/api/creator/courses/route.ts`
- [x] 13.2 Tambah `_count` untuk enrollments per course
- [x] 13.3 Tambah `difficulty` field ke response
- [x] 13.4 Hitung dan return stats: `{ totalCourses, publishedCourses, draftCourses }` di response
- [x] 13.5 Pastikan response tetap backward compatible dengan creator dashboard yang sudah ada

**Files:**
- `app/api/creator/courses/route.ts` (update existing GET handler)

---

## Task 14: API Testing — Student Course (Postman)

**Requirements:** 1.x, 2.x, 3.x, 7.x

### Subtasks

- [x] 14.1 Buat file `docs/api/student-course/student-course.postman_collection.json`
- [x] 14.2 Tambah request **GET /api/courses** — test catalog publik: status 200, response shape `{ courses, pagination }`, filter by category/difficulty/search
- [x] 14.3 Tambah request **GET /api/courses/[slug]** — test 200 (found) dan 404 (not found)
- [x] 14.4 Tambah request **POST /api/courses/[slug]/enroll** — test 201 (success), 401 (unauthenticated), 403 (course DRAFT), 409 (already enrolled)
- [x] 14.5 Tambah request **GET /api/courses/my-courses** — test 200 dengan enrollment data, 401 (unauthenticated)

**Files:**
- `docs/api/student-course/student-course.postman_collection.json` (buat baru)

--- 

## Task 15: API Testing — Creator Course (Postman)

**Requirements:** 4.x, 5.x, 6.x, 8.x

### Subtasks

- [x] 15.1 Buat file `docs/api/creator-course/creator-course.postman_collection.json`
- [x] 15.2 Tambah request **GET /api/creator/courses** — test 200 dengan stats `{ totalCourses, publishedCourses, draftCourses }` dan enrollment count per course
- [x] 15.3 Tambah request **POST /api/creator/courses** — test 201 (success), 400 (validation error: missing fields / invalid difficulty), 401 (unauthenticated)
- [x] 15.4 Tambah request **PUT /api/creator/courses/[slug]/publish** — test toggle DRAFT→PUBLISHED dan PUBLISHED→DRAFT, 403 (bukan owner), 401 (unauthenticated)

**Files:**
- `docs/api/creator-course/creator-course.postman_collection.json` (buat baru)

---

## Task 16: E2E Tests — Student Pages

**Requirements:** 1.x, 2.x, 3.x

### Subtasks

- [x] 16.1 Buat file `__tests__/playwright/course/student/catalog.spec.ts`
- [x] 16.2 Test: catalog page `/course` loads dengan course cards (unauthenticated)
- [x] 16.3 Test: filter by category/difficulty mengupdate URL params dan re-render cards
- [x] 16.4 Test: klik "Daftar Sekarang" tanpa auth → redirect ke `/sign-in`
- [x] 16.5 Buat file `__tests__/playwright/course/student/my-courses.spec.ts`
- [x] 16.6 Test: akses `/student/courses` tanpa auth → redirect ke `/sign-in`
- [x] 16.7 Test: akses `/student/courses` dengan auth → tampilkan enrolled courses (gunakan Clerk auth state)

**Files:**
- `__tests__/playwright/course/student/catalog.spec.ts` (buat baru)
- `__tests__/playwright/course/student/my-courses.spec.ts` (buat baru)

---

## Task 17: E2E Tests — Creator Pages

**Requirements:** 4.x, 5.x, 6.x

### Subtasks

- [x] 17.1 Buat file `__tests__/playwright/course/creator/dashboard.spec.ts`
- [x] 17.2 Test: creator dashboard `/creator` menampilkan stats (totalCourses, publishedCourses, draftCourses) dengan data real
- [x] 17.3 Test: creator dashboard menampilkan course list dengan enrollment count
- [x] 17.4 Buat file `__tests__/playwright/course/creator/create-course.spec.ts`
- [x] 17.5 Test: form validation — submit tanpa required fields menampilkan error messages
- [x] 17.6 Test: akses `/creator/courses/create` tanpa role creator → redirect atau 403

**Files:**
- `__tests__/playwright/course/creator/dashboard.spec.ts` (buat baru)
- `__tests__/playwright/course/creator/create-course.spec.ts` (buat baru)

---

## Task 18: Code Quality & Architecture Improvements

**Tujuan:** Refactor kode hasil implementasi Task 1–17 agar lebih maintainable, mengurangi duplikasi, dan mengikuti pola arsitektur yang konsisten.

### Subtasks

- [x] 18.1 Buat `features/cms/types/course.types.ts` — centralize semua course-related types: `CourseCardCourse`, `CreatorCourse`, `EnrolledCourse`, `CourseFormData`, `CreatorStats`, `Pagination`, `CourseCatalogParams`
- [x] 18.2 Update `features/cms/types/index.ts` — tambah re-export dari `course.types.ts`
- [x] 18.3 Buat `features/cms/api/course.api.ts` — React Query query/mutation functions: `getCourses`, `getMyCourses`, `getCreatorCourses`, `enrollCourse`, `togglePublish`, `createCourse`
- [x] 18.4 Buat `features/cms/hooks/useCreatorCourses.ts` — wrap React Query untuk data creator dashboard (menggantikan inline `fetchCourses` + `useState` + `useEffect` di `app/creator/page.tsx`)
- [x] 18.5 Buat `features/cms/hooks/useCourseCatalogFilters.ts` — encapsulate debounce + URL params logic dari `CourseFilters.tsx`
- [x] 18.6 Buat `features/cms/hooks/useEnrollment.ts` — encapsulate enroll POST + toast + redirect dari `EnrollButton.tsx`
- [x] 18.7 Buat `features/cms/hooks/index.ts` — barrel export semua hooks baru
- [x] 18.8 Refactor `app/creator/page.tsx` — gunakan `useCreatorCourses` hook, hapus interface `DashboardStats` lokal yang duplikat dengan `CreatorStats`
- [x] 18.9 Refactor `features/cms/components/student/learn/CourseFilters.tsx` — gunakan `useCourseCatalogFilters` hook
- [x] 18.10 Refactor `features/cms/components/student/learn/EnrollButton.tsx` — gunakan `useEnrollment` hook
- [x] 18.11 Buat `features/cms/components/student/index.ts` — barrel export semua student components
- [x] 18.12 Unify `DashboardStats` type — hapus interface lokal di `app/creator/page.tsx`, gunakan `CreatorStatask.ts` dari `features/cms/components/creator/dashboard`
- [x] 18.13 Update semua import paths yang terpengaruh oleh centralisasi types
- [x] 18.14 Hapus interface lokal `CourseFormData` di `features/cms/components/creator/CourseCreationForm.tsx`, ganti dengan import dari `@/features/cms/types`
- [x] 18.15 Reconcile `CreatorCourse` — sesuaikan shape di `course.types.ts` agar include field `slug` dan `sectionCount` yang ada di `CourseListItem.tsx`, lalu hapus interface lokal di `CourseListItem.tsx` dan import dari `@/features/cms/types`
- [x] 18.16 Refactor `app/course/page.tsx` — hapus inline types (`CourseItem`, `CoursesResponse`, `SearchParams`) dan fungsi `fetchCourses` lokal, gunakan types dari `@/features/cms/types`

**Files (baru):**
- `features/cms/types/course.types.ts`
- `features/cms/api/course.api.ts`
- `features/cms/hooks/useCreatorCourses.ts`
- `features/cms/hooks/useCourseCatalogFilters.ts`
- `features/cms/hooks/useEnrollment.ts`
- `features/cms/hooks/index.ts`
- `features/cms/components/student/index.ts`

**Files (diupdate):**
- `features/cms/types/index.ts`
- `app/creator/page.tsx`
- `features/cms/components/student/learn/CourseFilters.tsx`
- `features/cms/components/student/learn/EnrollButton.tsx`
- `features/cms/components/creator/CourseCreationForm.tsx`
- `features/cms/components/creator/dashboard/CourseListItem.tsx`
- `app/course/page.tsx`

---

## Implementation Order

```
Phase 1 (Foundation):
  Task 1 → Task 2 → Task 3 → Task 4

Phase 2 (Creator API):
  Task 5 → Task 6 → Task 13

Phase 3 (Components & Pages):
  Task 7 → Task 8 → Task 9

Phase 4 (Creator UI):
  Task 10 → Task 11 → Task 12

Phase 5 (Testing):
  Task 14 → Task 15 → Task 16 → Task 17

Phase 6 (Refactor):
  Task 18
```

---

**Document Version:** 1.3
**Last Updated:** 2026-03-19
**Total Tasks:** 18
**Total Subtasks:** 109
