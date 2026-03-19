# Plan Rule — Panduan Implementasi Task 18

Dokumen ini menjelaskan detail implementasi untuk setiap subtask di Task 18 (Code Quality & Architecture Improvements).

---

## Konteks

Task 18 adalah refactor pass setelah semua fitur selesai (Task 1–17). Tujuannya:
- Menghilangkan duplikasi type definitions
- Mengekstrak logic stateful ke custom hooks
- Membuat API layer yang konsisten dengan React Query
- Mempermudah testing dan maintenance ke depan

Stack yang digunakan: Next.js 14 (App Router), TypeScript, React Query (`@tanstack/react-query`), Sonner (toast).

---

## 18.1 — `features/cms/types/course.types.ts`

Buat file baru. Pindahkan dan konsolidasikan semua course-related types dari berbagai file:

```ts
// Dari features/cms/components/student/CourseCard.tsx
export interface CourseCardCourse {
  id: string
  title: string
  description: string | null
  category: string
  difficulty: string | null
  status: string
  sectionCount?: number
  lessonCount?: number
}

// Dari features/cms/components/creator/dashboard/CourseListItem.tsx
export interface CreatorCourse {
  id: string
  title: string
  status: string
  category: string
  difficulty: string | null
  enrollmentCount?: number
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface EnrolledCourse {
  id: string
  course: CourseCardCourse
  enrolledAt: string | Date
  completed: boolean
  progress: number
}

export interface CourseFormData {
  title: string
  description: string
  category: string
  difficulty: 'Pemula' | 'Menengah' | 'Mahir'
  status: 'DRAFT' | 'PUBLISHED'
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface CourseCatalogParams {
  page?: number
  limit?: number
  category?: string
  difficulty?: string
  search?: string
}
```

> Catatan: `CreatorStats` tetap di `DashboardStats.tsx` karena sudah di-export dari sana dan dipakai luas. Cukup re-export dari `course.types.ts` jika perlu.

---

## 18.2 — `features/cms/types/index.ts`

Tambah re-export di bawah export yang sudah ada:

```ts
export type {
  CourseCardCourse,
  CreatorCourse,
  EnrolledCourse,
  CourseFormData,
  Pagination,
  CourseCatalogParams,
} from './course.types'
```

---

## 18.3 — `features/cms/api/course.api.ts`

Buat query/mutation functions untuk React Query. Jangan buat hooks di sini — hanya pure async functions yang bisa di-compose.

```ts
import type {
  CourseCardCourse,
  CreatorCourse,
  EnrolledCourse,
  CourseFormData,
  Pagination,
  CourseCatalogParams,
} from '../types/course.types'

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface CourseCatalogResponse {
  courses: (CourseCardCourse & { enrolled?: boolean })[]
  pagination: Pagination
}

export interface CreatorCoursesResponse {
  courses: CreatorCourse[]
  stats: {
    totalCourses: number
    publishedCourses: number
    draftCourses: number
  }
}

export interface MyCoursesResponse {
  enrollments: EnrolledCourse[]
}

// ─── Query functions (read) ───────────────────────────────────────────────────

export async function getCourses(params: CourseCatalogParams = {}): Promise<CourseCatalogResponse> {
  const query = new URLSearchParams()
  if (params.page)       query.set('page',       String(params.page))
  if (params.limit)      query.set('limit',      String(params.limit))
  if (params.category)   query.set('category',   params.category)
  if (params.difficulty) query.set('difficulty', params.difficulty)
  if (params.search)     query.set('search',     params.search)

  const res = await fetch(`/api/courses?${query.toString()}`)
  if (!res.ok) throw new Error('Gagal memuat katalog kursus')
  return res.json()
}

export async function getMyCourses(): Promise<MyCoursesResponse> {
  const res = await fetch('/api/courses/my-courses')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Gagal memuat kursus saya')
  return res.json()
}

export async function getCreatorCourses(): Promise<CreatorCoursesResponse> {
  const res = await fetch('/api/creator/courses')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Gagal memuat data creator')
  return res.json()
}

// ─── Mutation functions (write) ───────────────────────────────────────────────

export async function enrollCourse(courseId: string): Promise<{ enrolled: boolean }> {
  const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 403) throw new Error('DRAFT')
  if (res.status === 409) throw new Error('ALREADY_ENROLLED')
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? 'Gagal mendaftar ke kursus')
  }
  return { enrolled: true }
}

export async function togglePublish(courseId: string): Promise<{ status: string }> {
  const res = await fetch(`/api/creator/courses/${courseId}/publish`, { method: 'PUT' })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 403) throw new Error('FORBIDDEN')
  if (!res.ok) throw new Error('Gagal mengubah status kursus')
  const data = await res.json()
  return { status: data.course.status }
}

export async function createCourse(payload: CourseFormData): Promise<CreatorCourse> {
  const res = await fetch('/api/creator/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 400) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? 'Data tidak valid')
  }
  if (!res.ok) throw new Error('Gagal membuat kursus')
  const data = await res.json()
  return data.course
}
```

> Catatan: Semua fungsi di sini adalah pure async — tidak ada `useState`, `useEffect`, atau React hooks. Ini memudahkan composability dan testing.

---

## 18.4 — `features/cms/hooks/useCreatorCourses.ts`

Wrap `getCreatorCourses` dengan React Query. Hook ini menggantikan pola `useState` + `useEffect` + `fetchCourses` yang ada di `app/creator/page.tsx`.

```ts
'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getCreatorCourses } from '../api/course.api'

export const CREATOR_COURSES_KEY = ['creator', 'courses'] as const

export function useCreatorCourses() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: CREATOR_COURSES_KEY,
    queryFn: getCreatorCourses,
    staleTime: 30_000, // 30 detik — data creator tidak perlu real-time
  })

  function refresh() {
    queryClient.invalidateQueries({ queryKey: CREATOR_COURSES_KEY })
  }

  return {
    courses: query.data?.courses ?? [],
    stats: query.data?.stats ?? { totalCourses: 0, publishedCourses: 0, draftCourses: 0 },
    isLoading: query.isLoading,
    isError: query.isError,
    refresh,
  }
}
```

> Catatan: `refresh()` dipakai setelah toggle publish atau create course agar list ter-update tanpa full page reload.

---

## 18.5 — `features/cms/hooks/useCourseCatalogFilters.ts`

Ekstrak debounce + URL params logic dari `CourseFilters.tsx`. Hook ini mengembalikan state dan handlers yang siap dipakai oleh komponen.

```ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export interface CatalogFilters {
  search: string
  category: string
  difficulty: string
}

export interface UseCourseCatalogFiltersReturn {
  filters: CatalogFilters
  hasFilters: boolean
  setSearch: (value: string) => void
  setCategory: (value: string | null) => void
  setDifficulty: (value: string | null) => void
  clearAll: () => void
}

export function useCourseCatalogFilters(): UseCourseCatalogFiltersReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearchState] = useState(searchParams.get('search') ?? '')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isMountedRef = useRef(false)
  const searchParamsRef = useRef(searchParams)

  useEffect(() => {
    searchParamsRef.current = searchParams
  })

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParamsRef.current.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value)
        else params.delete(key)
      })
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname]
  )

  // Debounced search — skip on mount
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateParams({ search: search || null })
    }, 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  function setSearch(value: string) {
    setSearchState(value)
  }

  function setCategory(value: string | null) {
    updateParams({ category: value })
  }

  function setDifficulty(value: string | null) {
    updateParams({ difficulty: value })
  }

  function clearAll() {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setSearchState('')
    router.push(pathname)
  }

  const category = searchParams.get('category') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''
  const hasFilters = !!(search || category || difficulty)

  return {
    filters: { search, category, difficulty },
    hasFilters,
    setSearch,
    setCategory,
    setDifficulty,
    clearAll,
  }
}
```

---

## 18.6 — `features/cms/hooks/useEnrollment.ts`

Ekstrak enroll POST + toast + redirect dari `EnrollButton.tsx`.

```ts
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { enrollCourse } from '../api/course.api'

export interface UseEnrollmentOptions {
  courseId: string
  courseTitle: string
  initialEnrolled?: boolean
}

export function useEnrollment({ courseId, courseTitle, initialEnrolled = false }: UseEnrollmentOptions) {
  const router = useRouter()
  const [enrolled, setEnrolled] = useState(initialEnrolled)
  const [enrolling, setEnrolling] = useState(false)

  async function handleEnroll() {
    setEnrolling(true)
    try {
      await enrollCourse(courseId)
      setEnrolled(true)
      toast.success(`Berhasil mendaftar ke "${courseTitle}"`)
      setTimeout(() => {
        router.push(`/course/${courseId}/learn`)
      }, 800)
    } catch (err) {
      const message = err instanceof Error ? err.message : ''
      if (message === 'UNAUTHORIZED') {
        toast.error('Silakan login terlebih dahulu')
        router.push('/sign-in')
      } else if (message === 'ALREADY_ENROLLED') {
        setEnrolled(true)
        router.push(`/course/${courseId}/learn`)
      } else {
        toast.error(message || 'Gagal mendaftar ke kursus')
      }
    } finally {
      setEnrolling(false)
    }
  }

  return { enrolled, enrolling, handleEnroll }
}
```

---

## 18.7 — `features/cms/hooks/index.ts`

Barrel export semua hooks baru:

```ts
export { useCreatorCourses, CREATOR_COURSES_KEY } from './useCreatorCourses'
export type { UseCourseCatalogFiltersReturn, CatalogFilters } from './useCourseCatalogFilters'
export { useCourseCatalogFilters } from './useCourseCatalogFilters'
export { useEnrollment } from './useEnrollment'
export type { UseEnrollmentOptions } from './useEnrollment'
```

---

## 18.8 — Refactor `app/creator/page.tsx`

Ganti `useState` + `useEffect` + `fetchCourses` dengan `useCreatorCourses`. Hapus interface `DashboardStats` lokal yang duplikat.

Perubahan utama:
1. Hapus `interface DashboardStats { ... }` lokal (duplikat dengan `CreatorStats` dari dashboard)
2. Hapus `const [courses, setCourses]`, `const [stats, setStats]`, `const [loadingCourses, setLoadingCourses]`
3. Hapus fungsi `fetchCourses` dan `useEffect` yang memanggilnya
4. Tambah import `useCreatorCourses` dari `@/features/cms/hooks`
5. Gunakan destructuring dari hook

```ts
// Sebelum
import { useEffect, useState } from 'react'
// ...
interface DashboardStats { totalCourses: number; publishedCourses: number; draftCourses: number }
// ...
const [courses, setCourses] = useState<CreatorCourse[]>([])
const [stats, setStats] = useState<DashboardStats>({ ... })
const [loadingCourses, setLoadingCourses] = useState(false)
async function fetchCourses() { ... }
useEffect(() => { fetchCourses() }, [isLoaded, roleLoading, role])

// Sesudah
import { useCreatorCourses } from '@/features/cms/hooks'
// ...
const { courses, stats, isLoading: loadingCourses } = useCreatorCourses()
```

> Catatan: `useEffect` dan `useState` import bisa dihapus jika tidak dipakai lagi setelah refactor ini.

---

## 18.9 — Refactor `features/cms/components/student/learn/CourseFilters.tsx`

Ganti semua state dan logic internal dengan `useCourseCatalogFilters`.

```tsx
// Sebelum: ~30 baris state + logic
const router = useRouter()
const pathname = usePathname()
const searchParams = useSearchParams()
const [searchValue, setSearchValue] = useState(...)
const debounceRef = useRef(...)
// ... dst

// Sesudah: 1 baris
const { filters, hasFilters, setSearch, setCategory, setDifficulty, clearAll } = useCourseCatalogFilters()
```

Komponen hanya perlu meng-import hook dan meneruskan nilai ke JSX. Semua import `useRouter`, `usePathname`, `useSearchParams`, `useCallback`, `useEffect`, `useRef`, `useState` bisa dihapus dari file ini.

---

## 18.10 — Refactor `features/cms/components/student/learn/EnrollButton.tsx`

Ganti state + handler internal dengan `useEnrollment`.

```tsx
// Sebelum
const router = useRouter()
const [enrolled, setEnrolled] = useState(initialEnrolled)
const [enrolling, setEnrolling] = useState(false)
async function handleEnroll() { ... fetch ... toast ... router.push ... }

// Sesudah
const { enrolled, enrolling, handleEnroll } = useEnrollment({
  courseId: course.id,
  courseTitle: course.title,
  initialEnrolled,
})
```

Import `useRouter`, `useState`, `toast`, dan `fetch` logic bisa dihapus dari file ini.

---

## 18.11 — `features/cms/components/student/index.ts`

Buat barrel export untuk semua student components:

```ts
export { CourseCard } from './CourseCard'
export type { CourseCardCourse } from './CourseCard'
export { CourseNavigation } from './CourseNavigation'
export { LessonNavigation } from './LessonNavigation'
export { LessonViewer } from './LessonViewer'
export { ProgressBar } from './ProgressBar'
export { EnrollableCourseCard } from './learn/EnrollButton'
export { CourseFilters } from './learn/CourseFilters'
export { CoursePagination } from './learn/CoursePagination'
```

---

## 18.12 — Unify `DashboardStats` type

Interface `DashboardStats` di `app/creator/page.tsx` adalah duplikat dari `CreatorStats` di `features/cms/components/creator/dashboard/DashboardStats.tsx`.

Setelah task 18.8 selesai (menggunakan `useCreatorCourses`), interface lokal ini tidak lagi dibutuhkan karena `stats` sudah bertipe `CreatorStats` dari hook. Pastikan tidak ada referensi ke interface lokal yang tersisa.

Verifikasi: jalankan `tsc --noEmit` — tidak boleh ada error terkait type mismatch antara `stats` dari hook dan props `DashboardStats` component.

---

## 18.13 — Update import paths

Setelah semua types dipindah ke `course.types.ts`, update import di file-file berikut:

| File | Import lama | Import baru |
|------|-------------|-------------|
| `features/cms/components/student/learn/EnrollButton.tsx` | `import type { CourseCardCourse } from '../CourseCard'` | `import type { CourseCardCourse } from '@/features/cms/types'` |
| `app/course/page.tsx` | import langsung dari component | `import type { ... } from '@/features/cms/types'` |
| `app/student/courses/page.tsx` | import langsung dari component | `import type { EnrolledCourse } from '@/features/cms/types'` |
| `features/cms/components/creator/CourseCreationForm.tsx` | interface lokal `CourseFormData` | `import type { CourseFormData } from '@/features/cms/types'` |

> Catatan: Gunakan `@/features/cms/types` (via `index.ts`) bukan path langsung ke `course.types.ts` agar konsisten.

---

## Urutan Eksekusi Task 18

```
18.1 → 18.2   (types dulu, jadi fondasi)
18.3           (api layer, depends on types)
18.4 → 18.7   (hooks, depends on api)
18.8           (refactor creator page, depends on 18.4)
18.9           (refactor CourseFilters, depends on 18.5)
18.10          (refactor EnrollButton, depends on 18.6)
18.11          (barrel export, depends on 18.9 + 18.10)
18.12          (cleanup types, depends on 18.8)
18.13          (update imports, depends on semua di atas)
18.14          (hapus CourseFormData lokal, depends on 18.1)
18.15          (reconcile CreatorCourse, depends on 18.1)
18.16          (refactor course catalog page, depends on 18.1 + 18.3)
```

Setiap subtask bisa diverifikasi dengan `tsc --noEmit` sebelum lanjut ke subtask berikutnya.

---

## 18.14 — Hapus `CourseFormData` lokal di `CourseCreationForm.tsx`

File `features/cms/components/creator/CourseCreationForm.tsx` mendefinisikan interface `CourseFormData` sendiri. Setelah 18.1 selesai, interface ini sudah ada di `course.types.ts`.

Perubahan:
1. Hapus `interface CourseFormData { ... }` dari file ini
2. Tambah import: `import type { CourseFormData } from '@/features/cms/types'`

```ts
// Hapus ini:
interface CourseFormData {
  title: string
  description: string
  category: string
  difficulty: 'Pemula' | 'Menengah' | 'Mahir'
  status: 'DRAFT' | 'PUBLISHED'
}

// Ganti dengan:
import type { CourseFormData } from '@/features/cms/types'
```

> Catatan: `CreatedCourse` interface di file ini boleh tetap lokal karena hanya dipakai sebagai callback shape, bukan shared type.

---

## 18.15 — Reconcile `CreatorCourse` di `CourseListItem.tsx`

`CourseListItem.tsx` export `CreatorCourse` dengan shape yang lebih lengkap dari yang direncanakan di `course.types.ts`:

```ts
// Di CourseListItem.tsx (existing — lebih lengkap)
export interface CreatorCourse {
  id: string
  title: string
  slug: string           // ← ada di sini, tidak di course.types.ts
  description: string | null
  status: string
  category: string | null
  difficulty: string | null
  sectionCount: number   // ← ada di sini, tidak di course.types.ts
  enrollmentCount: number
  createdAt: string
  updatedAt: string
}
```

Solusi: update `course.types.ts` agar shape-nya match dengan yang sudah dipakai di codebase:

```ts
// Update di course.types.ts
export interface CreatorCourse {
  id: string
  title: string
  slug: string
  description: string | null
  status: string
  category: string | null
  difficulty: string | null
  sectionCount: number
  enrollmentCount: number
  createdAt: string | Date
  updatedAt: string | Date
}
```

Kemudian di `CourseListItem.tsx`:
1. Hapus `export interface CreatorCourse { ... }` lokal
2. Tambah import: `import type { CreatorCourse } from '@/features/cms/types'`
3. Update `dashboard/index.ts` — hapus `export type { CreatorCourse } from './CourseListItem'`, ganti dengan re-export dari types

```ts
// Di features/cms/components/creator/dashboard/index.ts
// Hapus:
export type { CreatorCourse } from './CourseListItem'
// Tambah (atau biarkan mengalir dari features/cms/types):
export type { CreatorCourse } from '@/features/cms/types'
```

> Catatan: Pastikan `app/creator/page.tsx` import `CreatorCourse` dari `@/features/cms/types` setelah ini, bukan dari dashboard index.

---

## 18.16 — Refactor `app/course/page.tsx`

File ini mendefinisikan 3 inline interfaces dan 1 fungsi fetch lokal yang seharusnya sudah ada di api layer setelah 18.1 dan 18.3 selesai.

**Hapus:**
```ts
// Hapus semua ini dari app/course/page.tsx
interface SearchParams { ... }
interface CourseItem { ... }
interface CoursesResponse { ... }
async function fetchCourses(params: SearchParams): Promise<CoursesResponse> { ... }
```

**Ganti dengan:**
```ts
import type { CourseCatalogParams } from '@/features/cms/types'
// CoursesResponse sudah ada di features/cms/api/course.api.ts sebagai CourseCatalogResponse
```

Karena `app/course/page.tsx` adalah server component, ia tidak bisa langsung pakai `getCourses` dari `course.api.ts` (yang menggunakan relative `/api/...` URL). Solusinya: tetap buat fungsi fetch lokal tapi gunakan types yang sudah terpusat:

```ts
import type { CourseCatalogParams, CourseCardCourse, Pagination } from '@/features/cms/types'

// Fungsi fetch tetap ada tapi tidak mendefinisikan types sendiri
async function fetchCourses(params: CourseCatalogParams): Promise<{
  courses: (CourseCardCourse & { enrolled?: boolean })[]
  pagination: Pagination
}> {
  // ... implementasi sama, hanya types yang berubah
}
```

> Catatan: Ini adalah trade-off yang disengaja — server components tidak bisa reuse client-side fetch functions karena URL harus absolute. Yang dihilangkan adalah duplikasi type definitions, bukan duplikasi fetch logic.
