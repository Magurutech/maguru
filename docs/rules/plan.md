# Plan: Refactor Student Learn Page

## Update: UX Improvements (2026-04-10)

### Fitur yang Sudah Ada
✅ **Expand/Collapse Sidebar** — sudah diimplementasikan di `CourseNavigation.tsx`:
- State `sidebarOpen` dengan toggle button
- Transisi smooth dengan `transition-all duration-300`
- Icon `PanelLeftClose` / `PanelLeftOpen` dari lucide-react
- Width berubah dari `w-72` (expanded) ke `w-12` (collapsed)

### Masalah yang Perlu Diperbaiki

**Issue 1: Warna Selection Lesson Terlalu Gelap**
Saat ini lesson yang aktif menggunakan:
```tsx
bg-merah-100 text-merah-700 font-semibold
```

Masalah:
- `text-merah-700` terlalu gelap untuk background `bg-merah-100`
- Tidak konsisten dengan design system Maguru (beige/warm palette)
- Kontras kurang optimal untuk readability

**Solusi:**
Gunakan warna yang lebih soft dan konsisten:
```tsx
// Active state
bg-merah-50 text-merah-600 font-medium border-l-2 border-merah-500

// Hover state (non-active)
hover:bg-beige-100 hover:text-beige-900
```

Ini memberikan:
- Background lebih terang (`merah-50` vs `merah-100`)
- Text lebih readable (`merah-600` vs `merah-700`)
- Border accent untuk visual hierarchy
- Font weight lebih subtle (`medium` vs `semibold`)

---

# Plan: Refactor Student Learn Page

## Analisis

### Pola Creator (yang sudah bekerja)

Creator page menggunakan arsitektur berlapis:

```
CourseManagePage
└── ManageProvider (Context)
    ├── useCourseManage     → fetch course + sections (metadata only)
    ├── useLessonHandlers   → lazy fetch lessons per section (on expand)
    ├── useSectionHandlers  → CRUD sections
    ├── useManageView       → ActiveView state (overview | section | lesson | lesson-editor)
    └── useReorderHandlers  → drag-drop reorder
```

**Pola kunci:**
- Sections di-fetch sekali saat mount (hanya metadata: id, title, order, lessonCount)
- Lessons di-fetch **lazy** — hanya saat section di-expand (`toggleSection`)
- Lessons disimpan di `lessonsMap: Record<sectionId, ManagedLesson[]>`
- View state dikelola via `ActiveView` union type
- Semua state + handlers di Context, page hanya render komponen

### Bug di Student Learn Page (saat ini)

**Bug 1 — Sections API tidak mengembalikan lessons**
`GET /api/courses/[slug]/sections` hanya mengembalikan `lessonCount` (angka), bukan array lessons.
Page langsung akses `section.lessons.map(...)` → selalu `undefined`.

**Bug 2 — Progress API shape mismatch**
`GET /api/progress/course/[slug]` mengembalikan `completedLessons` sebagai **number** (count).
Page memperlakukannya sebagai **array of IDs** → `.includes(lesson.id)` dan `.length` selalu salah.
Semua lesson tampil sebagai belum selesai meski sudah diselesaikan.

**Bug 3 — Tidak ada endpoint untuk fetch per-lesson progress**
Untuk tahu lesson mana yang sudah selesai, perlu endpoint yang mengembalikan list lesson IDs yang completed.
Saat ini tidak ada — progress API hanya mengembalikan aggregate count.

**Bug 4 — Infinite loop risk di useEffect**
`lessonId` ada di dependency array `fetchCourseData`, tapi `router.replace` di dalam effect mengubah URL
yang mengubah `lessonId` → bisa trigger re-fetch loop.

**Bug 5 — Error state menimpa seluruh halaman**
Jika fetch lesson gagal (bukan fetch course), `setError` mengganti seluruh halaman dengan error screen.
Seharusnya error lesson hanya tampil di area konten, sidebar tetap bisa digunakan.

---

## Rencana Refactor

### Pendekatan: Ikuti pola creator

Buat `LearnProvider` + hooks yang mirip dengan creator, dengan penyesuaian untuk kebutuhan student.

### Struktur Target

```
LearnPage
└── LearnProvider (Context)
    ├── useCourseLearn      → fetch course + sections (metadata only)
    ├── useLessonLearn      → lazy fetch lessons per section + progress per lesson
    ├── useLearnView        → ActiveLesson state (lessonId | null)
    └── useProgressHandlers → mark complete, update progress state
```

### File yang Perlu Dibuat/Diubah

```
features/cms/
├── context/
│   └── student/
│       └── LearnContext.tsx          ← baru
├── hooks/
│   └── learn/
│       ├── index.ts                  ← baru
│       ├── useCourseLearn.ts         ← baru (mirip useCourseManage)
│       ├── useLessonLearn.ts         ← baru (mirip useLessonHandlers)
│       └── useProgressHandlers.ts   ← baru
└── components/
    └── student/
        └── (komponen existing tetap, tidak perlu diubah)

app/course/[slug]/learn/
└── page.tsx                          ← refactor (thin orchestrator)
```

### API yang Perlu Ditambah/Diubah

**Tambah endpoint baru:**
```
GET /api/progress/course/[slug]/lessons
```
Mengembalikan list lesson IDs yang sudah completed oleh user:
```typescript
{ completedLessonIds: string[] }
```

Ini memungkinkan client tahu lesson mana yang sudah selesai tanpa fetch per-lesson.

**Alternatif (tanpa endpoint baru):**
Modifikasi `GET /api/courses/[slug]/sections/[sectionId]/lessons` untuk include progress
jika user authenticated — tapi ini lebih kompleks dan mengubah existing API.

→ **Pilih: tambah endpoint baru** (lebih clean, tidak breaking existing API)

---

## Implementation Steps

### Step 1: Tambah API endpoint progress lessons

**File:** `app/api/progress/course/[slug]/lessons/route.ts`

```typescript
GET /api/progress/course/[slug]/lessons
Response: { completedLessonIds: string[] }
```

Query: ambil semua `lesson_progress` where `userId = currentUser` AND `completed = true`
AND lesson belongs to course (via sections.courseId).

### Step 2: Buat `useCourseLearn` hook

**File:** `features/cms/hooks/learn/useCourseLearn.ts`

Mirip `useCourseManage` tapi:
- Fetch sections saja (tidak perlu course detail untuk student)
- Fetch `completedLessonIds` dari endpoint baru secara paralel
- Return: `sections`, `completedLessonIds`, `loading`, `error`

```typescript
export function useCourseLearn(courseSlug: string) {
  const [sections, setSections] = useState<LearnSection[]>([])
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set())
  const [progress, setProgress] = useState<CourseProgress>({ percentage: 0, completedLessons: 0, totalLessons: 0 })
  // ...
}
```

### Step 3: Buat `useLessonLearn` hook

**File:** `features/cms/hooks/learn/useLessonLearn.ts`

Mirip `useLessonHandlers` tapi:
- Lazy fetch lessons per section on expand (sama persis)
- Fetch full lesson content saat lesson diklik (bukan saat expand)
- `lessonsMap: Record<sectionId, LearnLesson[]>` — lesson list per section
- `currentLesson` — full lesson content yang sedang ditampilkan

```typescript
export function useLessonLearn({ courseSlug, completedLessonIds }) {
  const [lessonsMap, setLessonsMap] = useState<Record<string, LearnLesson[]>>({})
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [currentLesson, setCurrentLesson] = useState<FullLesson | null>(null)
  const [lessonLoading, setLessonLoading] = useState(false)
  // toggleSection → lazy fetch lessons
  // selectLesson → fetch full content
}
```

### Step 4: Buat `useProgressHandlers` hook

**File:** `features/cms/hooks/learn/useProgressHandlers.ts`

```typescript
export function useProgressHandlers({ courseSlug, setCompletedLessonIds, setProgress }) {
  const markComplete = async (lessonId: string) => {
    // POST /api/progress/lesson/[lessonId]/complete
    // Update completedLessonIds (Set)
    // Update progress state
  }
}
```

### Step 5: Buat `LearnContext`

**File:** `features/cms/context/student/LearnContext.tsx`

Compose semua hooks, expose via context. Mirip `ManageContext.tsx`.

### Step 6: Refactor `learn/page.tsx`

Jadikan thin orchestrator seperti `manage/page.tsx`:

```typescript
export default function LearnPage() {
  const params = useParams()
  return (
    <LearnProvider courseSlug={params.slug}>
      <LearnPageInner />
    </LearnProvider>
  )
}

function LearnPageInner() {
  const { loading, error } = useLearnContext()
  if (loading) return <LoadingSpinner />
  if (error) return <ErrorState />
  return (
    <SidebarProvider>
      <LearnSidebar />
      <LearnMain />
    </SidebarProvider>
  )
}
```

---

## Perbedaan Creator vs Student

| Aspek | Creator | Student |
|-------|---------|---------|
| Data utama | Course + Sections (metadata) | Sections + Progress |
| Lessons | Lazy fetch on expand | Lazy fetch on expand (sama) |
| Lesson content | Full content on edit | Full content on click |
| View state | overview / section / lesson / lesson-editor | lesson (lessonId) |
| Write operations | CRUD sections & lessons | Mark complete only |
| Progress | Tidak ada | completedLessonIds + percentage |

---

## Yang Tidak Perlu Diubah

- Semua komponen student (`CourseNavigation`, `LessonViewer`, `ProgressBar`, `LessonNavigation`) — sudah benar
- API sections, lessons, progress (kecuali tambah 1 endpoint baru)
- Creator page dan semua hooks-nya

---

## Estimasi

| Step | Effort |
|------|--------|
| Step 1: API endpoint baru | ~30 menit |
| Step 2-4: Hooks | ~1 jam |
| Step 5: Context | ~30 menit |
| Step 6: Refactor page | ~30 menit |
| **Total** | **~2.5 jam** |
