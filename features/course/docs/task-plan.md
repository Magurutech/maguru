# Task Plan: Implementasi Layer Component TSK-52 - Enrollment UI Integration

## Daftar Isi

1. [Pendahuluan](mdc:#pendahuluan)
2. [Analisis Komponen](mdc:#analisis-komponen)
3. [Simplified Hybrid Data Strategy](mdc:#simplified-hybrid-data-strategy)
4. [Context-Based Integration Strategy](mdc:#context-based-integration-strategy)
5. [Implementation Plan](mdc:#implementation-plan)
6. [Testing Strategy](mdc:#testing-strategy)
7. [Success Criteria](mdc:#success-criteria)

## Pendahuluan

Task plan ini fokus pada implementasi Layer Component untuk enrollment functionality di course catalog page. Implementasi ini akan mengintegrasikan hooks yang sudah diimplementasi dan tested (useEnrollment, useEnrollmentStatus, useCourseManagement) dengan UI components yang ada menggunakan **context-based approach** untuk menghilangkan props drilling dan **simplified hybrid data strategy** untuk data enrichment.

### Status Implementasi Saat Ini

- ✅ **Hooks Layer**: 100% implemented dan tested
  - useEnrollment: 8 unit tests + 8 integration tests ✅
  - useEnrollmentStatus: 7 unit tests + 12 integration tests ✅
  - useCourseManagement: 25 unit tests + 14 integration tests ✅
- ✅ **Context Layer**: 100% implemented
  - courseContext: enrollment dialog, search/filter state management ✅
- ❌ **UI Components Layer**: Belum diimplementasi (menggunakan props drilling)
- ❌ **Page Integration**: Belum terintegrasi dengan hooks dan context

### Referensi Implementasi

- **Course Management Components**: CourseGrid.tsx, CourseCard.tsx, CourseSearchFilter.tsx (✅ Context-based)
- **Course Catalog Components**: CourseCardCatalog.tsx, CourseCatalogGrid.tsx, page.tsx (❌ Props drilling)
- **Data Strategy**: Simplified hybrid approach (useCourseManagement + mockData enrichment)

## Analisis Komponen

### 1. CourseCardCatalog.tsx (Priority: HIGH)

**Current Implementation (Props Drilling):**

```typescript
interface CourseCardProps {
  course: CourseCatalogItem
  onEnroll: (courseId: string) => void // ❌ Props drilling
  onWishlist: (courseId: string) => void // ❌ Props drilling
}

// Mock enrollment logic
const handleEnroll = async () => {
  if (course.enrolled) return
  setIsLoading(true)
  await new Promise((resolve) => setTimeout(resolve, 1500))
  onEnroll(course.id) // ❌ Props drilling
  setIsLoading(false)
}
```

**Required Changes (Context-Based + Simplified Hybrid):**

- ❌ Remove props drilling (onEnroll, onWishlist)
- ✅ Integrasi dengan useEnrollmentStatus untuk real enrollment status
- ✅ Integrasi dengan useCourseManagement.enrollCourseWithValidation (High-level hook)
- ✅ Integrasi courseContext untuk dialog management
- ✅ Simplified hybrid data enrichment (useCourseManagement + mockData)
- ✅ Replace mock logic dengan real API calls
- ✅ Add proper loading states dan error handling

**New Implementation (Context-Based + Simplified Hybrid):**

```typescript
interface CourseCardProps {
  course: CourseCatalogItem
  // ❌ No more props drilling
}

// Real enrollment integration
const { data: enrollmentStatus, isLoading: statusLoading } = useEnrollmentStatus(course.id)
const { enrollCourseWithValidation, isEnrolling, enrollmentError } = useCourseManagement()
const { openEnrollmentDialog, setEnrollmentLoading } = useCourseContext()

const handleEnroll = async () => {
  if (enrollmentStatus?.isEnrolled) return
  await enrollCourseWithValidation(course.id)
}
```

### 2. CourseCatalogGrid.tsx (Priority: HIGH)

**Current Implementation (Props Drilling):**

```typescript
interface CourseCatalogGridProps {
  courses: CourseCatalogItem[]
  loading: boolean
  onEnroll: (courseId: string) => void // ❌ Props drilling
  onWishlist: (courseId: string) => void // ❌ Props drilling
  hasActiveFilters: boolean
  onClearFilters: () => void // ❌ Props drilling
}
```

**Required Changes (Context-Based + Simplified Hybrid):**

- ❌ Remove props drilling (courses, loading, onEnroll, onWishlist, hasActiveFilters, onClearFilters)
- ✅ Integrasi dengan useCourseManagement untuk course data management
- ✅ Integrasi courseContext untuk UI state management
- ✅ Simplified hybrid data enrichment (useCourseManagement + mockData)
- ✅ Real enrollment operations dengan error handling
- ✅ Loading states untuk grid operations

**New Implementation (Context-Based + Simplified Hybrid):**

```typescript
// No props needed - all from context and hooks
export function CourseCatalogGrid() {
  const { courses, isLoading, error } = useCourseManagement()
  const { hasActiveFilters, clearFilters } = useCourseContext()

  // Simplified hybrid data enrichment
  const enrichedCourses = useMemo(() => {
    return courses.map((course) => {
      const mockCourse = mockCoursesCatalog.find((mock) => mock.id === course.id)
      return {
        // Real data dari backend
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        category: course.category,
        creator: course.creatorId, // atau dari user service
        rating: course.rating,
        students: course.students,

        // Mock data untuk missing fields
        price: mockCourse?.price || 0,
        longDescription: mockCourse?.longDescription || course.description,
        curriculum: mockCourse?.curriculum || [],
        duration: mockCourse?.duration || '2 hours',

        // User-specific data (akan dihandle oleh enrollment hooks)
        enrolled: false, // akan diupdate oleh useEnrollmentStatus
        wishlist: false, // akan diupdate oleh wishlist hooks
      }
    })
  }, [courses])

  // Component logic here
}
```

### 3. page.tsx (Priority: HIGH)

**Current Implementation (Props Drilling):**

```typescript
// Mock data dan state management dengan props drilling
const [courses, setCourses] = useState<CourseCatalogItem[]>([])
const [loading, setLoading] = useState(true)
const [searchQuery, setSearchQuery] = useState('')
const [selectedCategory, setSelectedCategory] = useState('All')

// Props drilling ke semua components
<CourseCatalogHeader
  searchQuery={searchQuery}
  sortBy={sortBy}
  onSearchChange={setSearchQuery}
  onSortChange={setSortBy}
  hasActiveFilters={hasActiveFilters}
  onClearFilters={clearFilters}
/>

<CourseCatalogGrid
  courses={filteredAndSortedCourses}
  loading={loading}
  onEnroll={handleEnroll}
  onWishlist={handleWishlist}
  hasActiveFilters={hasActiveFilters}
  onClearFilters={clearFilters}
/>
```

**Required Changes (Context-Based + Simplified Hybrid):**

- ❌ Remove all local state management (courses, loading, search, filters)
- ❌ Remove all props drilling
- ✅ Integrasi dengan useCourseManagement untuk real data fetching
- ✅ Integrasi courseContext untuk UI state management
- ✅ Simplified hybrid data enrichment (useCourseManagement + mockData)
- ✅ Simplify page.tsx - hanya render components tanpa props

**New Implementation (Context-Based + Simplified Hybrid):**

```typescript
// Clean page.tsx - no props drilling
export default function CourseCatalogPage() {
  return (
    <CourseContextProvider>
      <div className="min-h-screen bg-gradient-to-br from-[#F5EDE0] via-[#F0E6D6] to-[#EBE0CC]">
        <CourseCatalogBanner />
        <CourseCatalogPageHeader />
        <CourseCatalogHeader /> {/* No props */}
        <CategoryTabs /> {/* No props */}
        <ResultsCount /> {/* No props */}
        <CourseCatalogGrid /> {/* No props */}
        <LoadMoreButton /> {/* No props */}
      </div>
    </CourseContextProvider>
  )
}
```

### 4. CourseCatalogHeader.tsx (Priority: MEDIUM)

**Current Implementation (Props Drilling):**

```typescript
interface CourseCatalogHeaderProps {
  searchQuery: string
  sortBy: string
  sortOptions: { value: string; label: string }[]
  onSearchChange: (query: string) => void // ❌ Props drilling
  onSortChange: (sort: string) => void // ❌ Props drilling
  hasActiveFilters: boolean
  onClearFilters: () => void // ❌ Props drilling
}
```

**Required Changes (Context-Based + Simplified Hybrid):**

- ❌ Remove props drilling (searchQuery, sortBy, onSearchChange, onSortChange, hasActiveFilters, onClearFilters)
- ✅ Integrasi dengan useCourseManagement.searchCourses (High-level hook)
- ✅ Integrasi courseContext untuk search state management
- ✅ Implement debounced search
- ✅ Add loading states untuk search

**New Implementation (Context-Based + Simplified Hybrid):**

```typescript
// No props needed - all from context and hooks
export function CourseCatalogHeader() {
  const { searchCourses, isLoading: searchLoading } = useCourseManagement()
  const { searchQuery, setSearchQuery, sortBy, setSortBy, hasActiveFilters, clearFilters } =
    useCourseContext()

  // Component logic here
}
```

### 5. CategoryTabs.tsx (Priority: MEDIUM)

**Current Implementation (Props Drilling):**

```typescript
interface CategoryTabsProps {
  categories: string[]
  selectedCategory: string
  onSelect: (category: string) => void // ❌ Props drilling
}
```

**Required Changes (Context-Based + Simplified Hybrid):**

- ❌ Remove props drilling (categories, selectedCategory, onSelect)
- ✅ Integrasi dengan useCourseManagement.searchCourses
- ✅ Integrasi courseContext untuk category state
- ✅ Add loading states untuk category changes

**New Implementation (Context-Based + Simplified Hybrid):**

```typescript
// No props needed - all from context and hooks
export function CategoryTabs() {
  const { searchCourses } = useCourseManagement()
  const { selectedCategory, setSelectedCategory } = useCourseContext()

  // Component logic here
}
```

## Simplified Hybrid Data Strategy

### 1. **Data Source Strategy**

**✅ REAL DATA (useCourseManagement.ts):**

```typescript
// Data dari backend/database
{
  id: string
  title: string
  description: string
  thumbnail: string
  category: string
  creatorId: string
  rating: number
  students: number
  lessons: number
  status: string
  createdAt: Date
  updatedAt: Date
}
```

**✅ MOCK DATA (mockData.ts):**

```typescript
// Data untuk missing fields
{
  price: number
  longDescription: string
  curriculum: string[]
  duration: string
}
```

### 2. **Simplified Data Enrichment Pattern**

```typescript
// Di CourseCatalogGrid.tsx atau custom hook
const { courses, isLoading } = useCourseManagement() // Real data
const mockData = mockCoursesCatalog // Mock data

const enrichedCourses = useMemo(() => {
  return courses.map((course) => {
    const mockCourse = mockData.find((mock) => mock.id === course.id)
    return {
      // Real data dari backend
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      category: course.category,
      creator: course.creatorId, // atau dari user service
      rating: course.rating,
      students: course.students,

      // Mock data untuk missing fields
      price: mockCourse?.price || 0,
      longDescription: mockCourse?.longDescription || course.description,
      curriculum: mockCourse?.curriculum || [],
      duration: mockCourse?.duration || '2 hours',

      // User-specific data (akan dihandle oleh enrollment hooks)
      enrolled: false, // akan diupdate oleh useEnrollmentStatus
      wishlist: false, // akan diupdate oleh wishlist hooks
    }
  })
}, [courses])
```

### 3. **Benefits of Simplified Approach**

- **✅ Simpler Implementation** - tidak perlu complex transformers
- **✅ Real Data Priority** - data penting dari backend
- **✅ Mock Data Support** - untuk fields yang belum ada di backend
- **✅ Easy Maintenance** - mudah diupdate dan debug
- **✅ Progressive Enhancement** - bisa ganti mock data dengan real data secara bertahap
- **✅ No Complex Dependencies** - tidak perlu courseTransformers.ts

### 4. **Removed Complex Dependencies**

**❌ REMOVED:**

- `courseTransformers.ts` - terlalu kompleks
- Complex transformation logic
- Hybrid approach dengan multiple data sources

**✅ SIMPLIFIED:**

- Direct data mapping di component
- Simple mock data enrichment
- Clear separation of concerns

## Context-Based Integration Strategy

### 1. **Eliminate Props Drilling Pattern**

**❌ OLD PATTERN (Props Drilling):**

```
page.tsx → CourseCatalogHeader (searchQuery, onSearchChange, ...)
page.tsx → CourseCatalogGrid (courses, onEnroll, onWishlist, ...)
page.tsx → CategoryTabs (selectedCategory, onSelect, ...)
```

**✅ NEW PATTERN (Context-Based):**

```
page.tsx → CourseCatalogHeader (no props)
page.tsx → CourseCatalogGrid (no props)
page.tsx → CategoryTabs (no props)

All components use:
- useCourseManagement() for business logic
- useCourseContext() for UI state
- Simplified hybrid data enrichment
```

### 2. **Layer Component → High-Level Hooks Only**

**✅ CORRECT ARCHITECTURE:**

#### **A. useCourseManagement Integration (High-Level Hook)**

```typescript
// Di semua components
const {
  courses,
  isLoading,
  error,
  searchCourses,
  enrollCourseWithValidation,
  clearFilters: clearFiltersFromHook,
} = useCourseManagement()
```

#### **B. useEnrollmentStatus Integration (Low-Level Hook - OK untuk status checking)**

```typescript
// Di CourseCardCatalog.tsx
const { data: enrollmentStatus, isLoading: statusLoading } = useEnrollmentStatus(course.id)
```

### 3. **Layer Component → Feature Context Integration**

#### **A. courseContext Integration**

```typescript
// Di semua components
const {
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  hasActiveFilters,
  clearFilters,
  openEnrollmentDialog,
  enrollmentDialog,
  setEnrollmentLoading,
} = useCourseContext()
```

#### **B. Search/Filter State Management**

```typescript
// Di CourseCatalogHeader.tsx
const handleSearchChange = (query: string) => {
  setSearchQuery(query) // Context state
  // searchCourses will be called via useEffect in useCourseManagement
}
```

### 4. **Removed Low-Level Hook Integration**

**❌ REMOVED FROM LAYER COMPONENT:**

- `useEnrollment` - Low-level hook, seharusnya hanya digunakan oleh high-level hooks
- `useCourse` - Low-level hook, seharusnya hanya digunakan oleh high-level hooks

**✅ CORRECT FLOW:**

```
Layer Component → High-Level Hooks (useCourseManagement) → Low-Level Hooks (useEnrollment, useCourse)
Layer Component → Feature Context (courseContext) → UI State Management
Layer Component → Simplified Hybrid Data (useCourseManagement + mockData)
```

## Implementation Plan (Context-Based + Simplified Hybrid)

### Phase 1: Core Enrollment Integration (Priority: HIGH)

#### 1.1 Update CourseCardCatalog.tsx

**Tasks:**

- [ ] ❌ Remove props drilling (onEnroll, onWishlist)
- [ ] ✅ Integrasi useEnrollmentStatus hook (OK - read-only operation)
- [ ] ✅ Integrasi useCourseManagement.enrollCourseWithValidation (High-level hook)
- [ ] ✅ Integrasi courseContext untuk dialog management
- [ ] ✅ Simplified hybrid data enrichment (useCourseManagement + mockData)
- [ ] ✅ Update enrollment button logic
- [ ] ✅ Add loading states dan error handling
- [ ] ✅ Add success feedback dengan toast
- [ ] ✅ Update enrollment status display

**Estimated Time:** 2 hours

#### 1.2 Update CourseCatalogGrid.tsx

**Tasks:**

- [ ] ❌ Remove props drilling (courses, loading, onEnroll, onWishlist, hasActiveFilters, onClearFilters)
- [ ] ✅ Integrasi useCourseManagement hook (High-level hook)
- [ ] ✅ Integrasi courseContext untuk UI state management
- [ ] ✅ Simplified hybrid data enrichment (useCourseManagement + mockData)
- [ ] ✅ Update enrollment handler melalui useCourseManagement
- [ ] ✅ Add error handling untuk enrollment operations
- [ ] ✅ Add loading states untuk grid operations

**Estimated Time:** 1.5 hours

### Phase 2: Search dan Filter Integration (Priority: MEDIUM)

#### 2.1 Update CourseCatalogHeader.tsx

**Tasks:**

- [ ] ❌ Remove props drilling (searchQuery, sortBy, onSearchChange, onSortChange, hasActiveFilters, onClearFilters)
- [ ] ✅ Integrasi useCourseManagement.searchCourses (High-level hook)
- [ ] ✅ Integrasi courseContext untuk search state management
- [ ] ✅ Implement debounced search
- [ ] ✅ Add loading states untuk search
- [ ] ✅ Add error handling untuk search failures
- [ ] ✅ Update sort functionality

**Estimated Time:** 1.5 hours

#### 2.2 Update CategoryTabs.tsx

**Tasks:**

- [ ] ❌ Remove props drilling (categories, selectedCategory, onSelect)
- [ ] ✅ Integrasi dengan useCourseManagement.searchCourses
- [ ] ✅ Integrasi courseContext untuk category state
- [ ] ✅ Add loading states untuk category changes
- [ ] ✅ Update category selection logic

**Estimated Time:** 1 hour

### Phase 3: Cleanup page.tsx (Priority: HIGH)

#### 3.1 Simplify page.tsx

**Tasks:**

- [ ] ❌ Remove all local state management (courses, loading, search, filters)
- [ ] ❌ Remove all props drilling
- [ ] ❌ Remove mock data loading dengan setTimeout
- [ ] ✅ Integrasi dengan useCourseManagement untuk data fetching dan operations
- [ ] ✅ Integrasi courseContext untuk UI state management
- [ ] ✅ Simplified hybrid data enrichment (useCourseManagement + mockData)
- [ ] ✅ Simplify page.tsx - hanya render components tanpa props
- [ ] ✅ Add proper error boundaries

**Estimated Time:** 1 hour

### Phase 4: Context Integration (Priority: MEDIUM)

#### 4.1 Update courseContext.tsx

**Tasks:**

- [ ] ✅ Enrollment dialog state management (already implemented)
- [ ] ✅ Search/filter state management (already implemented)
- [ ] ✅ Loading states management (already implemented)
- [ ] ✅ Form state management (already implemented)

**Estimated Time:** 0 hours (already implemented)

#### 4.2 Update mockData.ts

**Tasks:**

- [ ] ✅ Add enrollment status data (already implemented)
- [ ] ✅ Update course data consistency (already implemented)
- [ ] ✅ Add user context data (already implemented)

**Estimated Time:** 0 hours (already implemented)

### Phase 5: Error Handling dan UX Improvements (Priority: LOW)

#### 5.1 Add Error Boundaries

**Tasks:**

- [ ] Add error boundary untuk enrollment components
- [ ] Add fallback UI untuk error states
- [ ] Add retry mechanisms

**Estimated Time:** 1 hour

#### 5.2 Add Loading States

**Tasks:**

- [ ] Add skeleton loaders untuk enrollment
- [ ] Add loading spinners untuk operations
- [ ] Add progress indicators

**Estimated Time:** 1 hour

## Testing Strategy (Updated)

### 1. E2E Tests

**File Structure:**

```
__tests__/playwright/course/user/
└── course-catalog.spec.ts              # 8 core E2E tests
```

**Test Coverage:**

- Page loading dan initial state
- Course display dan information
- Enrollment functionality (success & error)
- Search dan filter functionality
- Quick view modal
- Responsive design

## Architecture Compliance Summary

### ✅ CORRECT ARCHITECTURE:

1. **Layer Component → High-Level Hooks Only:**
   - `useCourseManagement` untuk business logic
   - `useEnrollmentStatus` untuk read-only status checking

2. **Layer Component → Feature Context:**
   - `courseContext` untuk UI state management
   - Dialog state, search state, loading state

3. **No Direct Low-Level Hook Access:**
   - ❌ `useEnrollment` (Low-level) - hanya via useCourseManagement
   - ❌ `useCourse` (Low-level) - hanya via useCourseManagement

4. **No Props Drilling:**
   - ❌ Remove all props drilling patterns
   - ✅ Use context-based state management
   - ✅ Follow course-management pattern

5. **Simplified Hybrid Data Strategy:**
   - ✅ Real data dari useCourseManagement
   - ✅ Mock data enrichment dari mockData.ts
   - ❌ No complex courseTransformers.ts

6. **Testing Strategy:**
   - ✅ Unit tests co-location
   - ✅ Integration tests di `__tests__/integration/course/features/`
   - ✅ E2E tests di `__tests__/playwright/course/user/`

### 🎯 RESULT:

**Layer Component Architecture Compliant** dengan `architecture.mdc`:

- Presentation Layer hanya berinteraksi dengan Application/Business Logic Layer (High-Level Hooks)
- Feature Context untuk cross-component state management
- No props drilling - clean component interfaces
- Simplified hybrid data strategy - easy to maintain
- Proper separation of concerns
- Maintainable dan testable code structure
- Consistent dengan course-management pattern

## List Komponen Course Catalog

### Core Components (Priority: HIGH)

1. **CourseCardCatalog.tsx** - Main course card dengan enrollment functionality
2. **CourseCatalogGrid.tsx** - Grid layout untuk course cards
3. **page.tsx** - Main page component (perlu cleanup)

### Search & Filter Components (Priority: MEDIUM)

4. **CourseCatalogHeader.tsx** - Search dan sort functionality
5. **CategoryTabs.tsx** - Category filtering
6. **ResultsCount.tsx** - Display result count

### UI Components (Priority: LOW)

7. **CourseCardSkeleton.tsx** - Loading skeleton
8. **EmptyStateIllustration.tsx** - Empty state display
9. **LoadMoreButton.tsx** - Load more functionality
10. **CourseCatalogBanner.tsx** - Banner component
11. **CourseCatalogPageHeader.tsx** - Page header

## File Referensi

### Implementation Examples

- **course-management/page.tsx** - Clean page implementation tanpa props drilling
- **course-management/CourseCard.tsx** - Context-based component pattern
- **course-management/CourseGrid.tsx** - Context-based grid pattern
- **course-management/CourseSearchFilter.tsx** - Context-based search pattern

### Documentation

- **task-tsk-52.md** - Original task specification
- **result-tsk-52.md** - Implementation results
- **courseContext.tsx** - Context implementation
- **useCourseManagement.ts** - High-level hook implementation

### Data Strategy

- **mockData.ts** - Mock data untuk enrichment
- **useCourseManagement.ts** - Real data dari backend
- **Simplified hybrid approach** - Real data + mock data enrichment

### Architecture

- **architecture.mdc** - Arsitektur guidelines
- **task-plan.md** - This document
