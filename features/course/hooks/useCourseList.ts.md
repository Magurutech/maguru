# useCourseList Hook

## Deskripsi

Hook untuk mengelola data daftar kursus dengan fungsi filtering dan sorting terintegrasi. Hook ini mengikuti arsitektur feature-first yang disederhanakan untuk manajemen state yang terpusat.

## Tanda Tangan

```typescript
function useCourseList(): {
  courses: CourseListItem[]
  loading: boolean
  error: string | null
  totalCourses: number
  hasCourses: boolean
  coursesWithProgress: number
  refetch: () => Promise<void>
  getCoursesFilteredAndSorted: (
    searchTerm: string,
    selectedLevel: string,
    sortBy: string
  ) => CourseListItem[]
}
```

## Penggunaan

```typescript
// Di dalam komponen course listing
function CourseListingPage() {
  const {
    courses,
    loading,
    error,
    getCoursesFilteredAndSorted,
    totalCourses,
    hasCourses
  } = useCourseList()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [sortBy, setSortBy] = useState('title')

  // Gunakan useMemo untuk performansi optimal
  const filteredCourses = useMemo(() => {
    return getCoursesFilteredAndSorted(searchTerm, selectedLevel, sortBy)
  }, [getCoursesFilteredAndSorted, searchTerm, selectedLevel, sortBy])

  if (loading) return <CourseGridSkeleton />
  if (error) return <ErrorDisplay error={error} />

  return (
    <div>
      <div className="mb-4">
        Total: {totalCourses} kursus, {coursesWithProgress} dengan progress
      </div>
      <CourseGrid courses={filteredCourses} />
    </div>
  )
}
```

## Fitur

- **Centralized State Management**: Semua logic data kursus terpusat di satu hook
- **Progress Integration**: Otomatis merge progress data dengan course data
- **Error Handling**: Built-in error state dan recovery mechanism
- **Filtering & Sorting**: Fungsi terintegrasi untuk filtering dan sorting
- **Performance Optimized**: Menggunakan useMemo untuk expensive calculations
- **Refetch Capability**: Dapat refresh data saat dibutuhkan

## State Management

### Data Flow
1. **API Layer** → `getCourses()` dan `getAllCourseProgress()`
2. **Hook Layer** → `useCourseList()` mengelola state dan business logic
3. **Component Layer** → Komponen mengkonsumsi hook untuk UI rendering

### Internal State
- `courses[]`: Array CourseListItem dengan progress data
- `loading`: Boolean untuk loading state
- `error`: String atau null untuk error handling

## Optimasi Performansi

- **Memoization**: Expensive calculations di-cache menggunakan useMemo
- **Selective Updates**: Hanya re-render saat dependencies berubah
- **Debounced Loading**: Mencegah multiple API calls
- **Lazy Evaluation**: Filtering dan sorting hanya saat dibutuhkan

## Error Handling

Hook menyediakan error handling yang graceful:
- Network errors → Error state dengan pesan yang jelas
- Storage errors → Continue tanpa progress data
- Invalid data → Fallback ke empty array