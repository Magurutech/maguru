# Task TSK-50: Desain UI untuk Katalog Kursus

## Daftar Isi

1. [Pendahuluan](mdc:#pendahuluan)
2. [Design System & Theme](mdc:#design-system--theme)
3. [Pages yang Akan Dibuat](mdc:#pages-yang-akan-dibuat)
4. [User Flow & Interaction](mdc:#user-flow--interaction)
5. [Responsive Design](mdc:#responsive-design)
6. [Accessibility & Performance](mdc:#accessibility--performance)
7. [Acceptance Criteria](mdc:#acceptance-criteria)

## Pendahuluan

Task TSK-50 fokus pada implementasi UI/UX untuk halaman katalog kursus yang memungkinkan siswa menelusuri dan mendaftar ke kursus yang tersedia. Implementasi ini akan mengikuti design system Maguru dengan tema Ancient Fantasy Asia, menggunakan palet warna yang sudah didefinisikan dan komponen Shadcn/ui sebagai foundation.

Halaman katalog kursus akan menjadi entry point utama bagi siswa untuk menemukan dan mendaftar ke kursus, dengan pengalaman yang immersive, whimsical, dan sesuai dengan brand Maguru.

## Design System & Theme

### Color Palette (Mengikuti theme-instruksi.mdc)

**Primary Colors:**

- **Merah Aksi 500** (#FF4D4D) - Tombol "Daftar" dan aksi utama
- **Kuning-Orange 400** (#FFB148) - Highlight dan elemen dekoratif
- **Hijau Alam 400** (#70CE98) - Status "Sudah Terdaftar"

**Background Colors:**

- **Beige 50** (#F5EDE0) - Background utama
- **Beige 100** (#F2EADC) - Card background
- **Beige 200** (#E8D9C6) - Section background

**Text Colors:**

- **Beige 900** (#7B5B2C) - Text utama
- **Beige 700** (#8A6D42) - Text sekunder

### Typography

- **Font Family**: Inter (sans-serif) untuk keterbacaan optimal
- **Heading**: Font weight 600-700 untuk hierarchy yang jelas
- **Body Text**: Font weight 400-500 untuk konten utama

### Visual Elements

- **Glass Panel Effect**: Subtle backdrop-blur dengan border transparan
- **Ancient Fantasy Motifs**: Border dekoratif dengan elemen budaya Indonesia
- **Whimsical Icons**: Custom icons dengan tema cartoonish
- **Smooth Transitions**: CSS transitions untuk state changes

## Pages yang Akan Dibuat

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

### 2. **Course Detail Page** (`app/courses/[id]/page.tsx`)

**Deskripsi:**
Halaman detail kursus dengan informasi lengkap dan tombol enrollment yang prominent. Halaman ini memberikan overview komprehensif tentang kursus sebelum siswa memutuskan untuk mendaftar.

**Layout Structure:**

```
┌─────────────────────────────────────┐
│ Course Hero Section                 │
│ ┌─────────────┐ ┌─────────────────┐ │
│ │ Thumbnail   │ │ Title + Creator │ │
│ │ (16:9)      │ │ Rating + Stats  │ │
│ │             │ │ Category + Date │ │
│ └─────────────┘ └─────────────────┘ │
├─────────────────────────────────────┤
│ Enrollment CTA Section              │
│ ┌─────────────────────────────────┐ │
│ │ [Daftar Sekarang] Button       │ │
│ │ [Status: Available/Enrolled]    │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Course Information Tabs            │
│ [Overview] [Lessons] [Reviews]     │
├─────────────────────────────────────┤
│ Tab Content Area                   │
│ ┌─────────────────────────────────┐ │
│ │ Course Description              │ │
│ │ What you'll learn               │ │
│ │ Requirements                    │ │
│ │ Target audience                 │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Key Features:**

- Hero section dengan course thumbnail dan metadata
- Prominent enrollment CTA button
- Tabbed interface untuk course information
- Responsive design untuk semua device sizes
- Loading states dan error handling
- Breadcrumb navigation

**Components yang Akan Dibuat:**

#### 2.1 **CourseHeroSection** (`features/course/components/course-detail/CourseHeroSection.tsx`)

**Props:**

```typescript
interface CourseHeroSectionProps {
  course: Course
  creator: {
    name: string
    avatar?: string
  }
}
```

**Design Elements:**

- Large course thumbnail dengan aspect ratio 16:9
- Glass panel overlay untuk text readability
- Course title dengan typography hierarchy
- Creator information dengan avatar
- Rating display dengan star icons
- Course statistics (students, lessons, duration)
- Category badge dengan color coding

**Layout:**

```
┌─────────────────────────────────────┐
│ [Course Thumbnail Background]       │
│ ┌─────────────────────────────────┐ │
│ │ [Glass Panel Overlay]           │ │
│ │ [Course Title]                  │ │
│ │ [Creator Info] [Rating]         │ │
│ │ [Stats: Students, Lessons, Duration] │
│ │ [Category Badge]                │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

#### 2.2 **EnrollmentCTA** (`features/course/components/course-detail/EnrollmentCTA.tsx`)

**Props:**

```typescript
interface EnrollmentCTAProps {
  course: Course
  isEnrolled: boolean
  onEnroll: () => void
  isLoading: boolean
}
```

**Design Elements:**

- Large CTA button dengan prominent styling
- Status indicator (Available/Enrolled)
- Loading state dengan spinner
- Success feedback dengan toast notification
- Glass panel background dengan subtle shadow

**Button States:**

- **Available**: Merah Aksi 500 (#FF4D4D) dengan text "Daftar Sekarang"
- **Enrolled**: Hijau Alam 400 (#70CE98) dengan text "Sudah Terdaftar"
- **Loading**: Disabled state dengan spinner animation
- **Hover**: Scale effect (1.02) dan color transition

#### 2.3 **CourseTabs** (`features/course/components/course-detail/CourseTabs.tsx`)

**Props:**

```typescript
interface CourseTabsProps {
  activeTab: 'overview' | 'lessons' | 'reviews'
  onTabChange: (tab: string) => void
  course: Course
}
```

**Design Elements:**

- Tab navigation dengan active state indicator
- Smooth transitions antara tab content
- Responsive design untuk mobile (dropdown) dan desktop (tabs)
- Glass panel styling untuk tab container

**Tab Content:**

- **Overview**: Course description, learning outcomes, requirements
- **Lessons**: List of lessons dengan preview
- **Reviews**: Student reviews dan ratings

#### 2.4 **EnrollmentDialog** (`features/course/components/enrollment/EnrollmentDialog.tsx`)

**Props:**

```typescript
interface EnrollmentDialogProps {
  course: Course
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading: boolean
}
```

**Design Elements:**

- Modal dengan backdrop blur effect
- Course preview dengan thumbnail dan key information
- Confirmation message dengan clear call-to-action
- Action buttons (Batal/Konfirmasi) dengan proper styling
- Keyboard navigation support (Escape to close, Enter to confirm)

**Dialog Layout:**

```
┌─────────────────────────────────────┐
│ [Backdrop Blur]                     │
│ ┌─────────────────────────────────┐ │
│ │ [Course Preview]                │ │
│ │ [Thumbnail] [Title] [Creator]   │ │
│ ├─────────────────────────────────┤ │
│ │ [Confirmation Message]          │ │
│ │ "Anda akan mendaftar ke kursus  │ │
│ │  ini. Lanjutkan?"               │ │
│ ├─────────────────────────────────┤ │
│ │ [Batal] [Konfirmasi] Buttons    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## User Flow & Interaction

### 1. **Browse Catalog Flow**

```
User enters /courses
    ↓
Loading skeleton displayed
    ↓
Course grid rendered with cards
    ↓
User can scroll and browse
    ↓
Hover effects on cards
    ↓
Click card to view details
```

### 2. **Enrollment Flow**

```
User clicks "Daftar" button
    ↓
EnrollmentDialog opens
    ↓
Course details displayed
    ↓
User confirms enrollment
    ↓
Loading state on button
    ↓
Success feedback (toast)
    ↓
Card updates to "Sudah Terdaftar"
```

### 3. **Search & Filter Flow**

```
User types in search box
    ↓
Debounced search (300ms)
    ↓
Results update in real-time
    ↓
User selects category filter
    ↓
Grid re-renders with filtered results
```

## Responsive Design

### Mobile (320px - 768px)

- **Grid**: 1 column layout dengan full-width cards
- **Search**: Full-width input dengan stacked layout
- **Filter**: Dropdown dengan mobile-friendly touch targets
- **Buttons**: Minimum 44px height untuk touch accessibility
- **Dialog**: Full-screen modal dengan swipe-to-close

### Tablet (768px - 1024px)

- **Grid**: 2 columns layout dengan optimized spacing
- **Search**: Inline layout dengan filter dropdown
- **Dialog**: Centered modal dengan max-width constraint
- **Tabs**: Horizontal tab navigation

### Desktop (1024px+)

- **Grid**: 3-4 columns layout dengan hover effects
- **Search**: Sidebar layout option dengan advanced filters
- **Dialog**: Larger modal dengan more detailed information
- **Tabs**: Full tab navigation dengan content preview

## Accessibility & Performance

### Accessibility Features

- **ARIA Labels**: Proper labeling untuk semua interactive elements
- **Keyboard Navigation**: Full keyboard support untuk enrollment flow
- **Focus Management**: Clear focus indicators dan logical tab order
- **Screen Reader**: Semantic HTML dan descriptive text
- **Color Contrast**: WCAG 2.1 AA compliance dengan color palette

### Performance Optimizations

- **Image Optimization**: Next.js Image component dengan lazy loading
- **Code Splitting**: Dynamic imports untuk heavy components
- **Memoization**: React.memo untuk expensive components
- **Debouncing**: Search input debouncing untuk performance
- **Skeleton Loading**: Perceived performance improvement

## Acceptance Criteria

### Visual Design

- [ ] Course cards menggunakan glass panel effect dengan tema Ancient Fantasy Asia
- [ ] Color palette mengikuti theme-instruksi.mdc (Merah Aksi, Kuning-Orange, Hijau Alam, Beige)
- [ ] Typography konsisten dengan Inter font family
- [ ] Hover effects dan transitions smooth dan responsif
- [ ] Loading states dan skeleton screens diimplementasikan

### Component Functionality

- [ ] CourseCatalogHeader berfungsi dengan search dan filter
- [ ] CourseCatalogGrid menampilkan responsive grid layout
- [ ] CourseCatalogCard menampilkan informasi lengkap dengan enrollment status
- [ ] CourseHeroSection menampilkan course metadata dengan glass panel
- [ ] EnrollmentCTA memiliki states yang jelas (Available/Enrolled/Loading)
- [ ] CourseTabs berfungsi dengan smooth transitions
- [ ] EnrollmentDialog menampilkan confirmation dengan course details

### User Experience

- [ ] Enrollment flow intuitif dengan clear feedback
- [ ] Search dan filter berfungsi dengan real-time updates
- [ ] Responsive design bekerja optimal di semua device sizes
- [ ] Loading states memberikan feedback yang jelas
- [ ] Error states ditangani dengan graceful fallbacks

### Technical Requirements

- [ ] Components menggunakan Shadcn/ui sebagai foundation
- [ ] Custom styling mengikuti design system Maguru
- [ ] Accessibility requirements terpenuhi (WCAG 2.1 AA)
- [ ] Performance optimizations diimplementasikan
- [ ] Cross-browser compatibility validated

## Estimasi Effort

**Total: 12 jam**

- Design system implementation: 2 jam
- Page components development: 6 jam
- Responsive design: 2 jam
- Testing dan refinement: 2 jam

## Dependencies

- Existing Course types dari `features/course/types/index.ts`
- Shadcn/ui component library
- Tailwind CSS dengan custom theme
- React Query untuk data fetching
- Clerk authentication integration
