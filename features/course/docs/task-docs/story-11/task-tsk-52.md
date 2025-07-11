# Task TSK-52: Implementasi Frontend untuk Pendaftaran Kursus

## Daftar Isi

1. [Pendahuluan](mdc:#pendahuluan)
2. [Perbandingan dengan Referensi](mdc:#perbandingan-dengan-referensi)
3. [Batasan dan Penyederhanaan](mdc:#batasan-dan-penyederhanaan)
4. [Spesifikasi Teknis](mdc:#spesifikasi-teknis)
5. [Implementasi Teknis](mdc:#implementasi-teknis)
6. [Peningkatan UX](mdc:#peningkatan-ux)
7. [Test Plan](mdc:#test-plan)
8. [Pertanyaan untuk Diklarifikasi](mdc:#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

Task TSK-52 fokus pada implementasi frontend untuk fitur pendaftaran kursus yang memungkinkan siswa berinteraksi dengan sistem enrollment melalui UI yang intuitif dan responsif. Implementasi ini akan membangun di atas komponen course management yang sudah ada dengan menambahkan enrollment functionality yang terintegrasi dengan course catalog dan course detail pages.

Frontend akan menggunakan React Query untuk state management, custom hooks untuk business logic, dan komponen UI yang konsisten dengan tema Maguru. Implementasi ini akan memastikan user experience yang smooth dengan proper loading states, error handling, dan feedback yang jelas, serta mengikuti arsitektur layered dan designing for failure patterns.

## Perbandingan dengan Referensi

| Komponen         | Referensi (Coursera, Udemy)        | Project Maguru                                |
| ---------------- | ---------------------------------- | --------------------------------------------- |
| State Management | Redux, Zustand, React Query        | React Query + Custom Hooks                    |
| Enrollment Flow  | Multi-step wizard atau one-click   | One-click dengan confirmation dialog          |
| Loading States   | Skeleton loaders, spinners         | Skeleton loaders dengan ancient fantasy theme |
| Error Handling   | Toast notifications, inline errors | Toast notifications dengan custom styling     |
| UI Components    | Material-UI, Ant Design            | Shadcn/ui + custom components                 |
| Course Detail    | Dedicated enrollment section       | Integrated enrollment CTA dan dialog          |

## Batasan dan Penyederhanaan Implementasi

### 1. **Component Scope**:

- Menggunakan existing course components sebagai base
- Menambahkan enrollment functionality tanpa refactor besar
- Tidak membuat design system baru
- **Integrasi dengan course detail page yang sudah ada**

### 2. **State Management**:

- React Query untuk server state (enrollment data)
- Custom hooks untuk business logic
- Local state untuk UI interactions
- Tidak menggunakan Redux untuk simplicity
- **Mengikuti hierarchical state management strategy**

### 3. **User Flow**:

- One-click enrollment dengan confirmation
- Tidak ada multi-step enrollment process
- Tidak ada course preview sebelum enrollment
- **Enrollment dari course catalog dan course detail page**

### 4. **Error Handling**:

- Toast notifications untuk feedback
- Inline error messages untuk forms
- Graceful fallbacks untuk network errors
- **Designing for failure patterns implementation**

## Spesifikasi Teknis

### Struktur Data

```typescript
interface EnrollmentData {
  id: string
  userId: string
  courseId: string
  enrolledAt: Date
  course?: Course
}

interface EnrollmentStatus {
  isEnrolled: boolean
  enrollmentDate?: Date
  courseId: string
}

interface EnrollmentRequest {
  courseId: string
}

// Integration dengan existing types
interface CourseCatalogItem {
  // ... existing fields
  enrolled: boolean
  enrollmentDate?: Date
}

interface CourseDetailView {
  // ... existing fields
  enrolled: boolean
  enrollmentDate?: Date
}
```

### Component Architecture

```
features/course/
├── components/
│   ├── enrollment/
│   │   ├── EnrollmentButton.tsx          # Reusable enrollment button
│   │   ├── EnrollmentDialog.tsx          # Confirmation dialog
│   │   └── EnrollmentStatus.tsx          # Status indicator
│   ├── course-catalog/
│   │   ├── CourseCard.tsx                # Update dengan enrollment
│   │   ├── CourseCatalogGrid.tsx         # Update dengan enrollment
│   │   └── CourseCatalogFilter.tsx       # Existing
│   └── course-detail/
│       ├── CourseDetailPage.tsx          # Update dengan enrollment
│       ├── EnrollmentCTA.tsx             # Update dengan real enrollment
│       ├── EnrollmentDialog.tsx          # Update dengan real enrollment
│       └── CourseSidebar.tsx             # Update dengan enrollment status
├── hooks/
│   ├── useEnrollment.ts                  # Enrollment operations
│   ├── useEnrollmentStatus.ts            # Status checking
│   └── useCourseManagement.ts            # Update existing hook
├── adapters/
│   └── enrollmentAdapter.ts              # API communication
└── types/
    └── enrollment.ts                     # Enrollment types
```

### Flow Pengguna

#### Enrollment Process dari Course Catalog:

1. User melihat course card dengan enrollment button
2. User mengklik "Daftar" button
3. EnrollmentDialog muncul dengan course details
4. User mengkonfirmasi enrollment
5. Loading state ditampilkan
6. Success/error feedback ditampilkan
7. Course card update dengan enrollment status

#### Enrollment Process dari Course Detail Page:

1. User melihat course detail page dengan enrollment CTA
2. User mengklik "Enroll Now" button
3. EnrollmentDialog muncul dengan course details
4. User mengkonfirmasi enrollment
5. Loading state ditampilkan
6. Success/error feedback ditampilkan
7. Course detail page update dengan enrollment status

## Implementasi Teknis

### 1. **Enrollment Hooks**

#### useEnrollment Hook

```typescript
export function useEnrollment() {
  const queryClient = useQueryClient()

  // Enrollment mutation dengan designing for failure
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => EnrollmentAdapter.enrollCourse(courseId),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment-status'] })
      return data
    },
    onError: (error) => {
      // Error handling dengan graceful fallback
      console.error('Enrollment failed:', error)
    },
  })

  return {
    enrollCourse: enrollMutation.mutate,
    isEnrolling: enrollMutation.isPending,
    error: enrollMutation.error,
  }
}
```

#### useEnrollmentStatus Hook

```typescript
export function useEnrollmentStatus(courseId: string) {
  return useQuery({
    queryKey: ['enrollment-status', courseId],
    queryFn: () => EnrollmentAdapter.getEnrollmentStatus(courseId),
    enabled: !!courseId,
    retry: 3, // Retry pattern
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  })
}
```

### 2. **Enrollment Components**

#### EnrollmentButton Component

- Conditional rendering berdasarkan enrollment status
- Loading state saat enrollment process
- Error handling dengan retry mechanism
- Accessibility support
- **Reusable untuk course catalog dan detail page**

#### EnrollmentDialog Component

- Confirmation dialog dengan course details
- Form validation dan error display
- Responsive design untuk mobile
- Keyboard navigation support
- **Designing for failure patterns**

### 3. **Integration dengan Existing Components**

#### Update CourseCard Component

- Integrasi dengan enrollment hooks
- Update enrollment status real-time
- Error handling dan loading states
- **Menggunakan semantic Tailwind classes**

#### Update CourseDetailPage Component

- Integrasi dengan enrollment hooks
- Update EnrollmentCTA dengan real enrollment
- Update CourseSidebar dengan enrollment status
- **Mengikuti arsitektur layered**

### 4. **State Management Strategy**

#### React Query Configuration

- Optimistic updates untuk enrollment
- Background refetch untuk enrollment status
- Cache invalidation strategy
- Error retry configuration
- **Designing for failure patterns**

#### Local State Management

- Dialog open/close state
- Form validation state
- Loading states untuk UI interactions
- Error state management
- **Mengikuti hierarchical state management**

### 5. **Designing for Failure Patterns**

#### Retry Pattern

- Exponential backoff untuk enrollment operations
- Circuit breaker pattern untuk API calls
- Retry logic dengan maximum attempts (3x)
- Graceful degradation untuk temporary failures

#### Timeout Handling

- AbortController untuk enrollment requests
- Request timeout configuration (30s default)
- Graceful timeout handling dengan user feedback
- Connection pooling untuk database operations

#### Graceful Fallback

- Fallback UI untuk enrollment failures
- Skeleton loading states untuk enrollment list
- Error boundaries untuk enrollment components
- Safe default state untuk partial failures

#### Safe Default State

- Default enrollment status handling
- Safe fallback values untuk failed operations
- Graceful degradation untuk partial failures
- Local caching untuk enrollment status

## Peningkatan UX

### Visual Feedback

- **Loading States**: Skeleton loaders dengan ancient fantasy theme
- **Success Feedback**: Toast notifications dengan custom styling
- **Error Feedback**: Inline error messages dengan clear actions
- **Status Indicators**: Visual cues untuk enrollment status
- **Semantic Tailwind classes untuk konsistensi**

### Interaction Design

- **Smooth Transitions**: CSS transitions untuk state changes
- **Hover Effects**: Subtle hover effects untuk interactive elements
- **Focus Management**: Proper focus handling untuk accessibility
- **Touch Optimization**: Mobile-friendly touch targets

### Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Memoization**: React.memo untuk expensive components
- **Debouncing**: Search input debouncing
- **Image Optimization**: Optimized course thumbnails
- **React Query caching untuk enrollment data**

## Test Plan

### Unit Tests

- Enrollment hooks functionality
- Component rendering dan interactions
- Adapter API calls
- State management logic
- **Designing for failure patterns testing**

### Integration Tests

- Enrollment flow end-to-end
- API integration testing
- Error handling scenarios
- Loading state management
- **Course catalog dan detail page integration**

### E2E Tests

- Complete enrollment process dari catalog
- Complete enrollment process dari detail page
- Error scenarios handling
- Mobile responsiveness
- Accessibility compliance

## Pertanyaan untuk Diklarifikasi

1. Apakah perlu real-time updates untuk enrollment status?
2. Apakah perlu offline support untuk enrollment actions?
3. Apakah perlu enrollment history page?
4. Apakah perlu bulk enrollment functionality?
5. Apakah perlu enrollment sharing atau social features?

## Acceptance Criteria

- [ ] EnrollmentButton component berfungsi dengan proper states
- [ ] EnrollmentDialog component menampilkan confirmation dengan course details
- [ ] useEnrollment hook mengelola enrollment operations dengan React Query
- [ ] useEnrollmentStatus hook mengecek enrollment status real-time
- [ ] enrollmentAdapter berkomunikasi dengan backend API
- [ ] Loading states dan error handling diimplementasikan
- [ ] Responsive design bekerja dengan baik di semua device
- [ ] Accessibility requirements terpenuhi (ARIA labels, keyboard navigation)
- [ ] **CourseCard component terintegrasi dengan enrollment functionality**
- [ ] **CourseDetailPage component terintegrasi dengan enrollment functionality**
- [ ] **Designing for failure patterns diimplementasi (retry, timeout, fallback)**
- [ ] **Semantic Tailwind classes digunakan untuk konsistensi**
- [ ] **Mengikuti arsitektur layered dan hierarchical state management**
- [ ] Unit tests dan integration tests berhasil
- [ ] Performance optimization diimplementasikan

## Estimasi Effort

**Total: 8 jam** _(Updated untuk include integration dan designing for failure)_

- Component development: 2.5 jam
- Hook implementation: 1.5 jam
- Adapter development: 1 jam
- **Integration dengan existing components: 1.5 jam**
- **Designing for failure patterns: 1.5 jam**
- Testing dan refinement: 1.5 jam

## Dependencies

- TSK-50: Desain UI untuk katalog kursus (✅ Complete)
- TSK-51: Backend untuk pendaftaran kursus (✅ Complete)
- React Query setup (✅ Complete)
- Existing UI components dan theme system (✅ Complete)
- Clerk authentication integration (✅ Complete)
- **Existing course detail page components (✅ Complete)**
- **Course transformation utilities (✅ Complete)**
