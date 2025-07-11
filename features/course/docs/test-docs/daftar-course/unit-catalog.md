# Unit Test Plan - TSK-51: Backend Enrollment Service & TSK-52: Frontend Enrollment Components

## 1. Identifikasi Dokumen

- **Judul Dokumen:** Unit Test Plan - TSK-51 Backend Enrollment Service & TSK-52 Frontend Enrollment Components
- **Identifikasi Versi dan Tanggal:**
  - Versi: 4.0
  - Tanggal: 2024-12-19
  - **Status:** 🔄 IN PROGRESS (Backend ✅ COMPLETED, Frontend 📋 PLANNED)
- **Author:** AI Assistant
- **Reviewer:** -

## 2. Pendahuluan

- **Tujuan:**  
  Mendokumentasikan rencana unit testing untuk implementasi backend enrollment service (TSK-51) dan frontend enrollment hooks (TSK-52) menggunakan pendekatan TDD (Test-Driven Development)

- **Scope:**  
  Unit testing untuk layer hooks dan services, dengan fokus pada business logic, error handling, dan React Query integration

- **Pendekatan:**  
  TDD (Test-Driven Development) dengan coverage minimal 80% dan implementasi designing for failure patterns

## 3. Struktur Unit Test

### 3.1 Frontend Layer (TSK-52)

#### 3.1.1 Low-Level Hooks (Data Access Layer)

**File:** `features/course/hooks/useEnrollment.test.ts`

**Coverage:**

- ✅ Enrollment creation dengan berbagai skenario
- ✅ Enrollment status checking
- ✅ Enrollment listing dengan pagination
- ✅ Error handling dan retry logic
- ✅ Loading states management
- ✅ React Query integration
- ✅ Designing for failure patterns

**Test Cases:**

```typescript
describe('useEnrollment Hook (Low-Level)', () => {
  describe('createEnrollment', () => {
    test('should create enrollment successfully')
    test('should handle duplicate enrollment error')
    test('should handle course not found error')
    test('should handle network error with retry')
    test('should handle authentication error')
    test('should show loading state during enrollment')
    test('should handle timeout error')
    test('should handle validation error')
    test('should invalidate related queries on success')
  })

  describe('checkEnrollmentStatus', () => {
    test('should check enrollment status successfully')
    test('should handle not enrolled status')
    test('should handle course not found error')
    test('should refetch on window focus')
    test('should handle network error with retry')
  })

  describe('getEnrollments', () => {
    test('should fetch enrollments with pagination')
    test('should handle empty enrollments list')
    test('should handle network error')
    test('should handle authentication error')
    test('should show loading state')
  })

  describe('Error Handling & Retry Logic', () => {
    test('should retry failed requests with exponential backoff')
    test('should handle timeout errors gracefully')
    test('should handle rate limiting errors')
  })

  describe('Data Transformation', () => {
    test('should transform enrollment data correctly')
    test('should handle malformed response data')
  })

  describe('React Query Integration', () => {
    test('should use correct query keys')
    test('should handle query invalidation')
  })

  describe('Designing for Failure Patterns', () => {
    test('should handle graceful degradation on partial failures')
    test('should provide safe default values')
    test('should handle circuit breaker pattern')
  })
})
```

#### 3.1.2 High-Level Hooks (Business Logic Layer)

**File:** `features/course/hooks/useEnrollmentStatus.test.ts`

**Coverage:**

- ✅ Enrollment status management
- ✅ Business logic untuk enrollment workflows
- ✅ Integration dengan low-level hooks
- ✅ UI state management
- ✅ Error handling dan fallback strategies
- ✅ React Query integration
- ✅ Designing for failure patterns

**Test Cases:**

```typescript
describe('useEnrollmentStatus Hook (High-Level)', () => {
  describe('enrollment status management', () => {
    test('should return enrolled status when user is enrolled')
    test('should return not enrolled status when user is not enrolled')
    test('should handle loading state')
    test('should handle error state')
  })

  describe('enrollment actions', () => {
    test('should handle enrollment creation successfully')
    test('should handle enrollment creation error')
    test('should handle enrollment creation loading state')
  })

  describe('business logic', () => {
    test('should prevent enrollment when already enrolled')
    test('should allow enrollment when not enrolled')
    test('should show loading text during enrollment')
  })

  describe('error handling and fallback', () => {
    test('should provide fallback values on error')
    test('should handle partial data gracefully')
  })

  describe('data transformation', () => {
    test('should format enrollment date correctly')
    test('should handle invalid date gracefully')
  })

  describe('retry and refresh', () => {
    test('should provide retry functionality')
    test('should handle retry loading state')
  })

  describe('React Query Integration', () => {
    test('should use correct query key structure')
    test('should handle query invalidation on enrollment success')
  })

  describe('Designing for Failure Patterns', () => {
    test('should handle graceful degradation on partial failures')
    test('should provide safe default values')
    test('should handle circuit breaker pattern')
  })
})
```

### 3.2 Backend Layer (TSK-51) - ✅ COMPLETED

#### 3.2.1 Enrollment Service

**File:** `features/course/services/enrollmentService.test.ts`

**Status:** ✅ COMPLETED
**Coverage:** 95%

**Test Cases:**

```typescript
describe('EnrollmentService', () => {
  describe('createEnrollment', () => {
    test('should create enrollment successfully')
    test('should handle duplicate enrollment')
    test('should handle course not found')
    test('should handle user not found')
    test('should validate course availability')
  })

  describe('getEnrollmentStatus', () => {
    test('should return enrolled status')
    test('should return not enrolled status')
    test('should handle invalid course ID')
  })

  describe('getEnrollments', () => {
    test('should return user enrollments with pagination')
    test('should handle empty enrollments')
    test('should handle invalid user ID')
  })

  describe('Error Handling', () => {
    test('should handle database connection errors')
    test('should handle validation errors')
    test('should handle authorization errors')
  })
})
```

## 4. Designing for Failure Implementation

### 4.1 Error Handling Patterns

#### 4.1.1 Retry Logic

```typescript
// Implementasi retry dengan exponential backoff
const retryWithBackoff = async (fn: () => Promise<any>, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

#### 4.1.2 Graceful Degradation

```typescript
// Fallback values untuk partial failures
const getEnrollmentStatus = async (courseId: string) => {
  try {
    const response = await api.getEnrollmentStatus(courseId)
    return {
      success: true,
      isEnrolled: response.isEnrolled,
      enrollmentDate: response.enrollmentDate || null,
    }
  } catch (error) {
    return {
      success: false,
      isEnrolled: false, // Safe default
      enrollmentDate: null,
      error: error.message,
    }
  }
}
```

#### 4.1.3 Circuit Breaker Pattern

```typescript
// Circuit breaker untuk mencegah cascade failures
class CircuitBreaker {
  private failures = 0
  private lastFailureTime = 0
  private readonly threshold = 3
  private readonly timeout = 60000

  async execute(fn: () => Promise<any>) {
    if (this.isOpen()) {
      throw new Error('Circuit breaker is open')
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private isOpen() {
    return this.failures >= this.threshold && Date.now() - this.lastFailureTime < this.timeout
  }

  private onSuccess() {
    this.failures = 0
  }

  private onFailure() {
    this.failures++
    this.lastFailureTime = Date.now()
  }
}
```

### 4.2 Safe Default Values

#### 4.2.1 Enrollment Status Defaults

```typescript
const DEFAULT_ENROLLMENT_STATUS = {
  isEnrolled: false,
  enrollmentDate: null,
  canEnroll: true,
  enrollmentActionText: 'Daftar Sekarang',
  enrollmentActionVariant: 'default',
}
```

#### 4.2.2 Error State Defaults

```typescript
const ERROR_STATE_DEFAULTS = {
  isEnrolled: false,
  canEnroll: false,
  enrollmentDate: null,
  isError: true,
  error: 'Failed to load enrollment status',
}
```

## 5. React Query Integration

### 5.1 Query Keys Structure

```typescript
const ENROLLMENT_QUERY_KEYS = {
  status: (courseId: string) => ['enrollment', 'status', courseId],
  list: (params: EnrollmentListParams) => ['enrollment', 'list', params],
  user: (userId: string) => ['enrollment', 'user', userId],
}
```

### 5.2 Mutation Configuration

```typescript
const createEnrollmentMutation = {
  mutationFn: (data: CreateEnrollmentData) => EnrollmentAdapter.createEnrollment(data),
  onSuccess: (data, variables) => {
    // Invalidate related queries
    queryClient.invalidateQueries({
      queryKey: ENROLLMENT_QUERY_KEYS.status(variables.courseId),
    })
    queryClient.invalidateQueries({
      queryKey: ENROLLMENT_QUERY_KEYS.list({ page: 1, limit: 10 }),
    })
  },
  onError: (error) => {
    // Handle error globally
    console.error('Enrollment creation failed:', error)
  },
}
```

## 6. Test Data & Mocking Strategy

### 6.1 Mock Data Structure

```typescript
const mockEnrollment = {
  id: 'enrollment-1',
  userId: 'user-1',
  courseId: 'course-1',
  enrolledAt: new Date('2024-01-01'),
  course: {
    id: 'course-1',
    title: 'Test Course',
    description: 'Test Description',
    thumbnail: 'test-thumbnail.jpg',
    price: 0,
    instructor: 'Test Instructor',
    category: 'Test Category',
    rating: 4.5,
    studentsCount: 100,
    lessonsCount: 10,
    duration: '2 hours',
    level: 'Beginner',
    language: 'Indonesian',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
}
```

### 6.2 Mocking Strategy

```typescript
// Mock EnrollmentAdapter
jest.mock('../adapters/enrollmentAdapter', () => ({
  EnrollmentAdapter: {
    createEnrollment: jest.fn(),
    getEnrollmentStatus: jest.fn(),
    getEnrollments: jest.fn(),
  },
}))

// Mock low-level hook
jest.mock('./useEnrollment', () => ({
  useEnrollment: () => mockUseEnrollment,
}))
```

## 7. Quality Metrics & Acceptance Criteria

### 7.1 Code Coverage

- **Minimum Coverage:** 80%
- **Target Coverage:** 90%
- **Critical Paths:** 100%

### 7.2 Performance Metrics

- **Test Execution Time:** < 5 seconds per test suite
- **Memory Usage:** < 100MB per test run
- **Test Reliability:** 99.9% (no flaky tests)

### 7.3 Error Handling Coverage

- **Network Errors:** 100%
- **Validation Errors:** 100%
- **Authentication Errors:** 100%
- **Timeout Errors:** 100%
- **Partial Data Errors:** 100%

### 7.4 React Query Integration

- **Query Key Consistency:** 100%
- **Cache Invalidation:** 100%
- **Optimistic Updates:** 100%
- **Error Boundaries:** 100%

## 8. Implementation Status

### 8.1 Backend (TSK-51) - ✅ COMPLETED

- [x] EnrollmentService unit tests
- [x] Error handling patterns
- [x] Database integration tests
- [x] Validation tests
- [x] Authorization tests

### 8.2 Frontend (TSK-52) - 📋 PLANNED

- [x] useEnrollment.test.ts (Low-Level Hook)
- [x] useEnrollmentStatus.test.ts (High-Level Hook)
- [ ] React Query integration tests
- [ ] Error boundary tests
- [ ] Performance tests

## 9. Dependencies & Setup

### 9.1 Required Dependencies

```json
{
  "@testing-library/react": "^14.0.0",
  "@testing-library/jest-dom": "^6.0.0",
  "@tanstack/react-query": "^5.0.0",
  "jest": "^29.0.0",
  "jest-environment-jsdom": "^29.0.0"
}
```

### 9.2 Test Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/features/$1',
  },
  collectCoverageFrom: [
    'features/course/hooks/**/*.{ts,tsx}',
    'features/course/services/**/*.{ts,tsx}',
    '!**/*.test.{ts,tsx}',
    '!**/*.spec.{ts,tsx}',
  ],
}
```

## 10. Next Steps

### 10.1 Immediate Actions

1. ✅ Implement useEnrollment.test.ts
2. ✅ Implement useEnrollmentStatus.test.ts
3. 🔄 Review and refine test patterns
4. 🔄 Add integration tests for React Query
5. 🔄 Implement error boundary tests

### 10.2 Future Enhancements

1. Add performance benchmarking tests
2. Implement visual regression tests
3. Add accessibility testing
4. Implement contract testing
5. Add chaos engineering tests

## 11. Conclusion

Unit test plan ini telah disesuaikan dengan arsitektur Maguru dan mengimplementasikan designing for failure patterns. Fokus utama adalah pada:

1. **Layer-based testing** sesuai arsitektur 3-tier
2. **React Query integration** untuk server state management
3. **Error handling patterns** untuk resilience
4. **Business logic testing** untuk high-level hooks
5. **Data transformation testing** untuk consistency

Implementasi ini memastikan bahwa enrollment feature memiliki test coverage yang komprehensif dan dapat menangani berbagai skenario kegagalan dengan graceful degradation.
