# Task TSK-49: Unit Test dan Integration Test untuk Pembuatan Kursus

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Batasan dan Penyederhanaan](#batasan-dan-penyederhanaan)
3. [Spesifikasi Teknis](#spesifikasi-teknis)
4. [Implementasi Teknis](#implementasi-teknis)
5. [Test Plan](#test-plan)
6. [Pertanyaan untuk Diklarifikasi](#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

Task ini berfokus pada implementasi comprehensive testing untuk fitur CRUD kursus yang mencakup unit tests untuk komponen individual dan integration tests untuk alur kerja end-to-end. Testing akan menggunakan strategi TDD (Test-Driven Development) untuk memastikan kualitas kode dan mencegah regresi.

**Nilai Bisnis**: Testing yang komprehensif mengurangi risiko bug di production, mempercepat development cycle, dan meningkatkan confidence dalam melakukan perubahan kode.

**Konteks dalam Sprint**: Task ini bergantung pada implementasi backend CRUD (TSK-47) dan integrasi autentikasi (TSK-48), serta menjadi prasyarat untuk E2E testing (TSK-66).

## Batasan dan Penyederhanaan

1. **Test Coverage**:
   - Target minimum 80% code coverage
   - Focus pada business logic critical paths
   - Tidak testing third-party library internals

2. **Test Scope**:
   - Unit tests untuk services, utilities, dan validation
   - Integration tests untuk API endpoints dengan database
   - Tidak mencakup frontend component testing (akan dilakukan terpisah)

3. **Test Environment**:
   - Menggunakan test database terpisah
   - Mock external dependencies (Clerk API)
   - Tidak testing production integrations

4. **Performance Testing**:
   - Basic performance assertions (response time < 1s)
   - Tidak ada load testing atau stress testing
   - Memory leak detection untuk heavy operations

## Spesifikasi Teknis

### Test Architecture

```
features/course/
├── services/
│   ├── courseService.ts
│   └── courseService.test.ts        # Unit tests
├── __tests__/
│   ├── __mocks__/
│   │   ├── clerk-mocks.ts          # Clerk SDK mocks
│   │   └── prisma-mocks.ts         # Prisma mocks
│   └── integration/
│       ├── course-crud.test.ts     # API integration tests
│       └── course-auth.test.ts     # Auth integration tests
└── types/
    ├── course.types.ts
    └── course.types.test.ts         # Type validation tests
```

### Test Categories

#### 1. Unit Tests

- **Services**: CourseService business logic
- **Validation**: Zod schema validation
- **Utilities**: Helper functions
- **Types**: TypeScript interfaces validation

#### 2. Integration Tests

- **API Endpoints**: Full request/response cycle
- **Database Operations**: Prisma integration
- **Authentication Flow**: Clerk middleware integration
- **Error Handling**: Error propagation dan formatting

### Test Data Strategy

```typescript
// Test data factories
interface CourseTestData {
  valid: {
    minimal: CreateCourseRequest
    complete: CreateCourseRequest
    withMultipleModules: CreateCourseRequest
  }
  invalid: {
    emptyTitle: Partial<CreateCourseRequest>
    longTitle: Partial<CreateCourseRequest>
    noModules: Partial<CreateCourseRequest>
    invalidModules: Partial<CreateCourseRequest>
  }
}
```

## Implementasi Teknis

### Unit Test Implementation

#### Course Service Tests

```typescript
/**
 * Unit Test: CourseService
 *
 * Test business logic untuk operasi CRUD kursus tanpa dependencies external.
 * Menggunakan mock Prisma untuk isolasi testing.
 */

// features/course/services/courseService.test.ts
import { CourseService } from './courseService'
import { prismaMock } from '../__tests__/__mocks__/prisma-mocks'

describe('CourseService', () => {
  let courseService: CourseService

  beforeEach(() => {
    courseService = new CourseService()
    jest.clearAllMocks()
  })

  describe('createCourse', () => {
    it('should create course with modules and lessons successfully', async () => {
      // Arrange
      const courseData = {
        title: 'Test Course',
        description: 'Test Description',
        modules: [
          {
            title: 'Module 1',
            lessons: [{ title: 'Lesson 1' }, { title: 'Lesson 2' }],
          },
        ],
      }

      const expectedCourse = {
        id: 'course-id',
        title: 'Test Course',
        description: 'Test Description',
        creatorId: 'user-id',
        modules: [
          /* ... */
        ],
      }

      prismaMock.$transaction.mockResolvedValueOnce(expectedCourse)

      // Act
      const result = await courseService.createCourse(courseData, 'user-id')

      // Assert
      expect(result).toEqual(expectedCourse)
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1)
    })

    it('should throw error when creating course with invalid data', async () => {
      // Arrange
      const invalidData = { title: '', description: '', modules: [] }

      // Act & Assert
      await expect(courseService.createCourse(invalidData, 'user-id')).rejects.toThrow(
        'Validation failed',
      )
    })
  })

  describe('getCoursesByCreator', () => {
    it('should return paginated courses for creator', async () => {
      // Test implementation...
    })

    it('should return empty array when creator has no courses', async () => {
      // Test implementation...
    })
  })

  // Additional test cases for update, delete, etc.
})
```

#### Validation Tests

```typescript
/**
 * Unit Test: Course Validation
 *
 * Test Zod schema validation untuk memastikan data integrity.
 */

// features/course/types/course.types.test.ts
import { CourseSchema, ModuleSchema, LessonSchema } from './course.types'

describe('Course Validation Schemas', () => {
  describe('CourseSchema', () => {
    it('should validate valid course data', () => {
      const validCourse = {
        title: 'Valid Course',
        description: 'Valid description',
        modules: [
          {
            title: 'Module 1',
            lessons: [{ title: 'Lesson 1' }],
          },
        ],
      }

      const result = CourseSchema.safeParse(validCourse)
      expect(result.success).toBe(true)
    })

    it('should reject course with empty title', () => {
      const invalidCourse = {
        title: '',
        description: 'Valid description',
        modules: [],
      }

      const result = CourseSchema.safeParse(invalidCourse)
      expect(result.success).toBe(false)
      expect(result.error?.issues[0].message).toContain('Judul kursus harus diisi')
    })

    // Additional validation test cases...
  })
})
```

### Integration Test Implementation

#### API Endpoint Tests

```typescript
/**
 * Integration Test: Course API Endpoints
 *
 * Test full API request/response cycle dengan database integration.
 * Menggunakan test database dan mock authentication.
 */

// features/course/__tests__/integration/course-crud.test.ts
import { testApiHandler } from 'next-test-api-route-handler'
import handler from '@/app/api/courses/route'
import { cleanupTestDb, createTestUser } from '../__mocks__/test-helpers'

describe('/api/courses', () => {
  let testUser: any

  beforeEach(async () => {
    await cleanupTestDb()
    testUser = await createTestUser({ role: 'creator' })
  })

  afterEach(async () => {
    await cleanupTestDb()
  })

  describe('POST /api/courses', () => {
    it('should create new course successfully', async () => {
      const courseData = {
        title: 'Integration Test Course',
        description: 'Test Description',
        modules: [
          {
            title: 'Test Module',
            lessons: [{ title: 'Test Lesson' }],
          },
        ],
      }

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${testUser.token}`,
            },
            body: JSON.stringify(courseData),
          })

          expect(response.status).toBe(201)

          const data = await response.json()
          expect(data.success).toBe(true)
          expect(data.data.title).toBe(courseData.title)
          expect(data.data.modules).toHaveLength(1)
          expect(data.data.modules[0].lessons).toHaveLength(1)
        },
      })
    })

    it('should reject request without authentication', async () => {
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({}),
          })

          expect(response.status).toBe(401)

          const data = await response.json()
          expect(data.success).toBe(false)
          expect(data.error).toContain('Authentication required')
        },
      })
    })

    it('should reject request from user role', async () => {
      const userWithUserRole = await createTestUser({ role: 'user' })

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userWithUserRole.token}`,
            },
            body: JSON.stringify({}),
          })

          expect(response.status).toBe(403)

          const data = await response.json()
          expect(data.success).toBe(false)
          expect(data.error).toContain('Access denied')
        },
      })
    })
  })

  describe('GET /api/courses', () => {
    it('should return creator courses with pagination', async () => {
      // Create test courses
      await createTestCourses(testUser.id, 3)

      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const response = await fetch({
            method: 'GET',
            headers: {
              Authorization: `Bearer ${testUser.token}`,
            },
          })

          expect(response.status).toBe(200)

          const data = await response.json()
          expect(data.success).toBe(true)
          expect(data.data.courses).toHaveLength(3)
          expect(data.data.pagination.total).toBe(3)
        },
      })
    })
  })

  // Additional endpoint tests...
})
```

#### Authentication Integration Tests

```typescript
/**
 * Integration Test: Authentication & Authorization
 *
 * Test middleware integration dengan Clerk dan role-based access.
 */

// features/course/__tests__/integration/course-auth.test.ts
describe('Course Authentication & Authorization', () => {
  describe('Role-based Access Control', () => {
    it('should allow creator to access own courses', async () => {
      // Test implementation...
    })

    it('should prevent creator from accessing other creator courses', async () => {
      // Test implementation...
    })

    it('should allow admin to access all courses', async () => {
      // Test implementation...
    })
  })

  describe('Session Management', () => {
    it('should handle expired tokens gracefully', async () => {
      // Test implementation...
    })

    it('should validate token format', async () => {
      // Test implementation...
    })
  })
})
```

### Mock Implementation

#### Clerk SDK Mocks

```typescript
// features/course/__tests__/__mocks__/clerk-mocks.ts
export const mockClerkAuth = {
  userId: 'test-user-id',
  sessionId: 'test-session-id',
}

export const mockClerkUser = {
  id: 'test-user-id',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  publicMetadata: { role: 'creator' },
}

jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(() => mockClerkAuth),
  clerkClient: {
    users: {
      getUser: jest.fn().mockResolvedValue(mockClerkUser),
    },
  },
}))
```

#### Database Test Helpers

```typescript
// features/course/__tests__/__mocks__/test-helpers.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.TEST_DATABASE_URL } },
})

export async function cleanupTestDb() {
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()
}

export async function createTestUser(userData: Partial<User> = {}) {
  return await prisma.user.create({
    data: {
      id: 'test-user-' + Date.now(),
      email: 'test@example.com',
      role: 'creator',
      ...userData,
    },
  })
}

export async function createTestCourses(creatorId: string, count: number) {
  const courses = []
  for (let i = 0; i < count; i++) {
    const course = await prisma.course.create({
      data: {
        title: `Test Course ${i + 1}`,
        description: `Description ${i + 1}`,
        creatorId,
      },
    })
    courses.push(course)
  }
  return courses
}
```

## Test Plan

### Test Execution Strategy

#### 1. Development Phase

- Run unit tests on every code change (watch mode)
- Pre-commit hooks untuk menjalankan affected tests
- Continuous feedback loop

#### 2. CI/CD Pipeline

- All tests must pass before merge
- Generate coverage reports
- Performance regression detection

#### 3. Test Categories Execution

**Unit Tests** (Fast - < 100ms per test):

- Run in isolation
- No database dependencies
- Mock all external services

**Integration Tests** (Medium - < 5s per test):

- Use test database
- Real database transactions
- Mock external APIs only

### Coverage Metrics

**Target Coverage by Component**:

- Services: 90%
- API Routes: 85%
- Validation Logic: 95%
- Utils/Helpers: 80%
- **Overall Target: 80%**

### Performance Benchmarks

**Unit Tests**:

- Total suite execution < 30 seconds
- Individual test < 100ms

**Integration Tests**:

- Total suite execution < 2 minutes
- API endpoint tests < 5 seconds each
- Database operations < 1 second each

### Test Reports

**Generated Artifacts**:

- Jest coverage report (HTML + JSON)
- Test execution timing report
- Failed test artifacts and logs
- Performance regression report

## Pertanyaan untuk Diklarifikasi

1. **Test Database**: Apakah perlu setup test database yang identik dengan production atau simplified schema sudah cukup?

2. **Mock Strategy**: Seberapa detail mock yang diperlukan untuk Clerk API? Apakah perlu mock response yang realistis untuk semua scenarios?

3. **Performance Benchmarks**: Apakah ada specific performance requirements yang perlu di-test (response time, memory usage)?

4. **Test Data Management**: Bagaimana strategy untuk test data cleanup? Auto cleanup atau manual per test?

5. **CI/CD Integration**: Apakah perlu parallel test execution atau sequential sudah cukup untuk pipeline?

6. **Error Scenarios**: Seberapa comprehensive error scenario testing yang diperlukan? Termasuk network failures, database timeouts?

7. **Test Environment**: Apakah perlu test environment yang mirror production (database version, Node.js version)?

8. **Snapshot Testing**: Apakah perlu snapshot testing untuk API responses atau structure testing sudah cukup?

## Referensi

- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [Next.js API Testing](https://nextjs.org/docs/testing)
- [Prisma Testing Guide](https://www.prisma.io/docs/guides/testing)
- [TDD Best Practices](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- Existing testing patterns di codebase Maguru
