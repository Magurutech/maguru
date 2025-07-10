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

Task TSK-52 fokus pada implementasi frontend untuk fitur pendaftaran kursus yang memungkinkan siswa berinteraksi dengan sistem enrollment melalui UI yang intuitif dan responsif. Implementasi ini akan membangun di atas komponen course management yang sudah ada dengan menambahkan enrollment functionality.

Frontend akan menggunakan React Query untuk state management, custom hooks untuk business logic, dan komponen UI yang konsisten dengan tema Maguru. Implementasi ini akan memastikan user experience yang smooth dengan proper loading states, error handling, dan feedback yang jelas.

## Perbandingan dengan Referensi

| Komponen         | Referensi (Coursera, Udemy)        | Project Maguru                                |
| ---------------- | ---------------------------------- | --------------------------------------------- |
| State Management | Redux, Zustand, React Query        | React Query + Custom Hooks                    |
| Enrollment Flow  | Multi-step wizard atau one-click   | One-click dengan confirmation dialog          |
| Loading States   | Skeleton loaders, spinners         | Skeleton loaders dengan ancient fantasy theme |
| Error Handling   | Toast notifications, inline errors | Toast notifications dengan custom styling     |
| UI Components    | Material-UI, Ant Design            | Shadcn/ui + custom components                 |

## Batasan dan Penyederhanaan Implementasi

### 1. **Component Scope**:

- Menggunakan existing course components sebagai base
- Menambahkan enrollment functionality tanpa refactor besar
- Tidak membuat design system baru

### 2. **State Management**:

- React Query untuk server state (enrollment data)
- Custom hooks untuk business logic
- Local state untuk UI interactions
- Tidak menggunakan Redux untuk simplicity

### 3. **User Flow**:

- One-click enrollment dengan confirmation
- Tidak ada multi-step enrollment process
- Tidak ada course preview sebelum enrollment

### 4. **Error Handling**:

- Toast notifications untuk feedback
- Inline error messages untuk forms
- Graceful fallbacks untuk network errors

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
```

### Component Architecture

```
features/course/
├── components/
│   ├── enrollment/
│   │   ├── EnrollmentButton.tsx
│   │   ├── EnrollmentDialog.tsx
│   │   └── EnrollmentStatus.tsx
│   └── course-catalog/
│       ├── CourseCatalogCard.tsx
│       ├── CourseCatalogGrid.tsx
│       └── CourseCatalogFilter.tsx
├── hooks/
│   ├── useEnrollment.ts
│   └── useEnrollmentStatus.ts
├── adapters/
│   └── enrollmentAdapter.ts
└── types/
    └── enrollment.ts
```

### Flow Pengguna

#### Enrollment Process:

1. User melihat course card dengan enrollment button
2. User mengklik "Daftar" button
3. EnrollmentDialog muncul dengan course details
4. User mengkonfirmasi enrollment
5. Loading state ditampilkan
6. Success/error feedback ditampilkan
7. Course card update dengan enrollment status

## Implementasi Teknis

### 1. **Enrollment Hooks**

#### useEnrollment Hook

```typescript
export function useEnrollment() {
  const queryClient = useQueryClient()

  // Enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => EnrollmentAdapter.enrollCourse(courseId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      return data
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
  })
}
```

### 2. **Enrollment Components**

#### EnrollmentButton Component

- Conditional rendering berdasarkan enrollment status
- Loading state saat enrollment process
- Error handling dengan retry mechanism
- Accessibility support

#### EnrollmentDialog Component

- Confirmation dialog dengan course details
- Form validation dan error display
- Responsive design untuk mobile
- Keyboard navigation support

### 3. **Enrollment Adapter**

#### enrollmentAdapter.ts

```typescript
export class EnrollmentAdapter {
  static async enrollCourse(courseId: string): Promise<EnrollmentResponse> {
    // API call implementation
  }

  static async getEnrollmentStatus(courseId: string): Promise<EnrollmentStatusResponse> {
    // API call implementation
  }

  static async getUserEnrollments(): Promise<EnrollmentListResponse> {
    // API call implementation
  }
}
```

### 4. **State Management Strategy**

#### React Query Configuration

- Optimistic updates untuk enrollment
- Background refetch untuk enrollment status
- Cache invalidation strategy
- Error retry configuration

#### Local State Management

- Dialog open/close state
- Form validation state
- Loading states untuk UI interactions
- Error state management

## Peningkatan UX

### Visual Feedback

- **Loading States**: Skeleton loaders dengan ancient fantasy theme
- **Success Feedback**: Toast notifications dengan custom styling
- **Error Feedback**: Inline error messages dengan clear actions
- **Status Indicators**: Visual cues untuk enrollment status

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

## Test Plan

### Unit Tests

- Enrollment hooks functionality
- Component rendering dan interactions
- Adapter API calls
- State management logic

### Integration Tests

- Enrollment flow end-to-end
- API integration testing
- Error handling scenarios
- Loading state management

### E2E Tests

- Complete enrollment process
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
- [ ] Unit tests dan integration tests berhasil
- [ ] Performance optimization diimplementasikan

## Estimasi Effort

**Total: 6 jam**

- Component development: 2 jam
- Hook implementation: 1.5 jam
- Adapter development: 1 jam
- Testing dan refinement: 1.5 jam

## Dependencies

- TSK-50: Desain UI untuk katalog kursus
- TSK-51: Backend untuk pendaftaran kursus
- React Query setup (✅ Complete)
- Existing UI components dan theme system
- Clerk authentication integration (✅ Complete)
