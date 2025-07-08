# Task Plan: Migrasi CRUD Course ke React Query

## Tujuan

- Migrasi seluruh operasi CRUD (Create, Read, Update, Delete) course di Maguru ke arsitektur React Query (TanStack Query) untuk state management, data fetching, dan cache.
- Meningkatkan konsistensi, performa, dan UX pada fitur manajemen course.

---

## Checklist Task

### 1. **Validasi Dependency**

- [ ] Pastikan `@tanstack/react-query` sudah terinstall di `package.json`.
- [ ] Jika belum, tambahkan dependency dan setup provider di root app.

### 2. **Update Layer Adapter**

- [ ] `features/course/adapters/courseAdapter.ts`
  - Refactor semua method agar return value dan error handling kompatibel dengan React Query (promise-based, tidak mengelola state lokal sendiri).

### 3. **Update Hooks Layer**

- [ ] `features/course/hooks/useCourse.ts`
  - Refactor menjadi custom hooks React Query: `useCourse`
  - Hilangkan state manual, gunakan cache/query/mutation dari React Query.
    *Note = tidak perlu melakukan refactor silahkan update langsung di file Hooks Layer yang telah ada ().
- [ ] `features/course/hooks/useCourseManagement.ts`
  - Orkestrasi business logic dengan hooks React Query, handle invalidation dan feedback.

### 4. **Update Context (Jika Perlu)**

- [ ] `features/course/contexts/courseContext.tsx`
  - Pastikan context hanya untuk UI state, bukan data fetching.

### 5. **Update Komponen**

- [ ] `features/course/components/course-manage/CreateCourseDialog.tsx`
- [ ] `features/course/components/course-manage/EditCourseDialog.tsx`
- [ ] `features/course/components/course-manage/DeleteCourseDialog.tsx`
- [ ] `features/course/components/course-manage/CourseGrid.tsx`
- [ ] `features/course/components/course-manage/CourseCard.tsx`
- [ ] `features/course/components/course-manage/CourseSearchFilter.tsx`
  - Update semua komponen agar konsumsi data/mutasi via React Query hooks, bukan state manual.

### 6. **Testing & QA**

- [ ] Pastikan semua aksi CRUD (create, update, delete) langsung reflected di UI tanpa reload.
- [ ] Test error handling, loading state, dan cache invalidation.

### 7. **Dokumentasi**

- [ ] Update README dan dokumentasi arsitektur state management.

---

## Catatan

- React Query akan menggantikan state manual dan force refresh di seluruh flow CRUD course.
- Semua data fetching dan mutasi akan centralized di hooks React Query.
- Komponen hanya konsumsi data dari hooks, tidak perlu trigger refresh manual.

---

## Validasi Dependency

- [ ] Cek `@tanstack/react-query` di `package.json` (install jika belum ada).
