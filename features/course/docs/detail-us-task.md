
### 1. **Course Catalog Page** (`app/courses/page.tsx`)

**Deskripsi:**
Halaman utama katalog kursus yang menampilkan grid course cards dengan filter dan search functionality. Halaman ini menjadi entry point utama bagi siswa untuk menelusuri dan mendaftar ke kursus yang tersedia.

**Layout Structure:**

```
┌─────────────────────────────────────┐
│ Header Section                      │
│ ┌─────────────────────────────────┐ │
│ │ Search Bar + Filter Controls    │ │
│ │ [Search Input] [Category Dropdown] │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Main Content Area                   │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ Card 1  │ │ Card 2  │ │ Card 3  │ │
│ │         │ │         │ │         │ │
│ └─────────┘ └─────────┘ └─────────┘ │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐ │
│ │ Card 4  │ │ Card 5  │ │ Card 6  │ │
│ │         │ │         │ │         │ │
│ └─────────┘ └─────────┘ └─────────┘ │
├─────────────────────────────────────┤
│ Pagination Section                  │
│ [Previous] [1] [2] [3] [Next]      │
└─────────────────────────────────────┘
```

**Key Features:**

- Responsive grid layout (1 column mobile, 2-4 columns desktop)
- Search bar dengan debouncing (300ms delay)
- Category filter dropdown dengan custom styling
- Loading skeleton untuk course cards
- Empty state dengan ilustrasi ketika tidak ada kursus
- Pagination untuk navigasi antar halaman

**Components yang Akan Dibuat:**

#### 1.1 **CourseCatalogHeader** (`features/course/components/course-catalog/CourseCatalogHeader.tsx`)

**Props:**

```typescript
interface CourseCatalogHeaderProps {
  searchQuery: string
  selectedCategory: string
  categories: string[]
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onClearFilters: () => void
}
```

**Design Elements:**

- Glass panel background dengan backdrop-blur
- Search input dengan search icon dan clear button
- Category dropdown dengan custom styling
- Clear filters button dengan hover effect
- Responsive layout untuk mobile (stacked) dan desktop (inline)

**States:**

- **Default**: Search input focused, dropdown closed
- **Search Active**: Input with value, clear button visible
- **Filter Active**: Dropdown open, selected category highlighted
- **Loading**: Disabled state dengan spinner

#### 1.2 **CourseCatalogGrid** (`features/course/components/course-catalog/CourseCatalogGrid.tsx`)

**Props:**

```typescript
interface CourseCatalogGridProps {
  courses: Course[]
  isLoading: boolean
  onEnroll: (courseId: string) => void
  onViewDetails: (courseId: string) => void
}
```

**Design Elements:**

- CSS Grid layout dengan responsive breakpoints
- Gap spacing yang konsisten (1rem mobile, 1.5rem desktop)
- Skeleton loading state dengan shimmer effect
- Empty state dengan ilustrasi dan call-to-action
- Intersection Observer untuk lazy loading

**Grid Configuration:**

- **Mobile (320px-768px)**: 1 column, gap 1rem
- **Tablet (768px-1024px)**: 2 columns, gap 1.25rem
- **Desktop (1024px+)**: 3-4 columns, gap 1.5rem

#### 1.3 **CourseCatalogCard** (`features/course/components/course-catalog/CourseCatalogCard.tsx`)

**Props:**

```typescript
interface CourseCatalogCardProps {
  course: Course
  isEnrolled: boolean
  onEnroll: () => void
  onViewDetails: () => void
}
```

**Design Elements:**

- Glass panel background dengan subtle shadow
- Course thumbnail dengan fallback image dan aspect ratio 16:9
- Enrollment status badge (Available/Enrolled) dengan color coding
- Hover effects dengan scale transform (1.02) dan shadow elevation
- Ancient fantasy border motif dengan subtle pattern
- Rating display dengan star icons
- Creator name dengan avatar placeholder

**Card Layout:**

```
┌─────────────────────────────────┐
│ [Thumbnail Image]               │
│ ┌─────────────────────────────┐ │
│ │ [Status Badge] [Rating]     │ │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [Course Title]                  │
│ [Course Description]            │
│ ┌─────────────────────────────┐ │
│ │ [Creator] [Students] [Lessons] │
│ └─────────────────────────────┘ │
├─────────────────────────────────┤
│ [Enrollment Button]             │
└─────────────────────────────────┘
```

**States:**

- **Default**: Card dengan hover effect
- **Hover**: Scale transform dan shadow elevation
- **Enrolled**: Green badge dan disabled enrollment button
- **Loading**: Skeleton state dengan shimmer

#### 1.4 **CourseSearchFilter** (`features/course/components/course-catalog/CourseSearchFilter.tsx`)

**Props:**

```typescript
interface CourseSearchFilterProps {
  searchQuery: string
  selectedCategory: string
  categories: string[]
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onClearFilters: () => void
  isLoading: boolean
}
```

**Design Elements:**

- Search input dengan search icon dan clear button
- Category dropdown dengan custom styling
- Clear filters button dengan hover effect
- Loading state dengan spinner
- Responsive layout untuk mobile dan desktop

**Features:**

- Search debouncing (300ms delay)
- Category filter dengan "All Categories" option
- Clear filters functionality
- Loading state untuk search results
- Keyboard navigation support