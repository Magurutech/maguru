# Task Plan: Migrasi CRUD Course ke React Query

## Tujuan

- Migrasi seluruh operasi CRUD (Create, Read, Update, Delete) course di Maguru ke arsitektur React Query (TanStack Query) untuk state management, data fetching, dan cache.
- Meningkatkan konsistensi, performa, dan UX pada fitur manajemen course.

---

## Checklist Task

### 1. **Validasi Dependency**

- [x] Pastikan `@tanstack/react-query` sudah terinstall di `package.json`.
- [x] Jika belum, tambahkan dependency dan setup provider di root app.
  - ✅ **SUDAH DIUPDATE** - Menambahkan QueryClientProvider di `lib/providers.tsx` (Client Component)
  - ✅ **SUDAH DIKONFIGURASI** - QueryClient dengan default options yang optimal
  - ✅ **SUDAH DIPERBAIKI** - Mengatasi Server Component serialization error

### 2. **Update Layer Adapter**

- [ ] `features/course/adapters/courseAdapter.ts`
  - Refactor semua method agar return value dan error handling kompatibel dengan React Query (promise-based, tidak mengelola state lokal sendiri).

### 3. **Update Hooks Layer**

- [ ] `features/course/hooks/useCourse.ts`
  - Refactor menjadi custom hooks React Query: `useCourse`
  - Hilangkan state manual, gunakan cache/query/mutation dari React Query.
    \*Note = tidak perlu melakukan refactor silahkan update langsung di file Hooks Layer yang telah ada ().
- [ ] `features/course/hooks/useCourseManagement.ts`
  - Orkestrasi business logic dengan hooks React Query, handle invalidation dan feedback.

### 4. **Update Context (Jika Perlu)**

- [x] `features/course/contexts/courseContext.tsx`
  - ✅ **TIDAK PERLU UPDATE** - Context sudah mengelola client state murni (dialog, form, search/filter)
  - Tidak ada server state atau API calls yang perlu dimigrasikan ke React Query

### 5. **Update Komponen**

- [x] `features/course/components/course-manage/CreateCourseDialog.tsx`
  - ✅ **TIDAK PERLU UPDATE** - Sudah menggunakan hooks dengan benar
- [x] `features/course/components/course-manage/EditCourseDialog.tsx`
  - ✅ **TIDAK PERLU UPDATE** - Sudah menggunakan hooks dengan benar
- [x] `features/course/components/course-manage/DeleteCourseDialog.tsx`
  - ✅ **TIDAK PERLU UPDATE** - Sudah menggunakan hooks dengan benar
- [x] `features/course/components/course-manage/CourseGrid.tsx`
  - ✅ **SUDAH DIUPDATE** - Menghapus manual data loading, menggunakan React Query data
- [x] `features/course/components/course-manage/CourseCard.tsx`
  - ✅ **TIDAK PERLU UPDATE** - Sudah menggunakan hooks dengan benar
- [x] `features/course/components/course-manage/CourseSearchFilter.tsx`
  - ✅ **TIDAK PERLU UPDATE** - Sudah menggunakan context dengan benar
  - **KESIMPULAN**: Semua komponen sudah menggunakan arsitektur yang benar

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

## Debugging CRUD Issues

### Masalah yang Ditemukan:

1. **Create Course**: Error handling tidak konsisten, data validation kurang ketat
2. **Delete Course**: Error handling tidak konsisten, logging tidak cukup detail
3. **Edit Course**: Berfungsi dengan baik (sebagai referensi)

### Solusi yang Diterapkan:

1. **Enhanced Logging**: Menambahkan console.log di setiap layer untuk tracking
2. **Better Error Handling**: Memperbaiki error propagation dari adapter ke UI
3. **Data Validation**: Memperbaiki validasi data di CreateCourseDialog
4. **FormData Debugging**: Menambahkan logging untuk FormData contents

### Testing Instructions:

1. Buka browser developer tools (F12)
2. Buka tab Console
3. Coba create course baru
4. Coba delete course yang ada
5. Perhatikan log messages untuk identifikasi masalah

## Konfigurasi React Query

### QueryClient Configuration (lib/providers.tsx)

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  // Create a client - harus di dalam Client Component
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute - data dianggap fresh selama 1 menit
            gcTime: 10 * 60 * 1000, // 10 minutes - cache disimpan selama 10 menit
            retry: 1, // Retry 1 kali jika gagal
            refetchOnWindowFocus: false, // Tidak refetch saat window focus
          },
          mutations: {
            retry: 1, // Retry 1 kali untuk mutations
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

### Provider Setup di Layout

```typescript
// app/layout.tsx
import { Providers } from '../lib/providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <Providers>
          {/* App providers dan components */}
        </Providers>
      </body>
    </html>
  )
}
```

---

## Validasi Dependency

- [ ] Cek `@tanstack/react-query` di `package.json` (install jika belum ada).
