# Unit Test Plan - TSK-47: Backend CRUD Kursus

## 1. Identifikasi Dokumen

- **Judul Dokumen:** Unit Test Plan - TSK-47 Backend CRUD Kursus
- **Identifikasi Versi dan Tanggal:**
  - Versi: 1.0
  - Tanggal: 2024-12-19
- **Author:** [Nama Tester/Developer]
- **Reviewer:** [Nama Reviewer]

## 2. Pendahuluan

- **Tujuan:**  
  Mendokumentasikan rencana unit testing untuk implementasi backend CRUD kursus (TSK-47) menggunakan pendekatan TDD (Test-Driven Development) dan menerapkan prinsip Designing for Failure.

- **Ruang Lingkup:**  
  Unit testing akan mencakup komponen/fungsi berikut:
  - CourseService (business logic layer)
  - CourseAdapter (data access layer)
  - TypeScript types dan interfaces
  - Utility functions (courseUtils)
  - Zod validation schemas

- **Referensi:**
  - Task TSK-47: [Link ke task-tsk-47.md]
  - Result TSK-47: [Link ke result-tsk-47.md]
  - Test Instructions: [Link ke test-instruction.mdc]

## 3. Prinsip Testing

### 3.1 TDD Approach

- **Siklus**: Red (gagal) → Green (implementasi minimal) → Refactor (optimasi)
- **Struktur**: AAA (Arrange, Act, Assert)
- **Coverage Target**: Minimal 80% code coverage

### 3.2 Designing for Failure

- **Error Handling**: Test semua skenario error dan edge cases
- **Graceful Degradation**: Pastikan sistem tetap berfungsi meski ada kegagalan parsial
- **Safe Default State**: Test dengan data invalid atau missing

## 4. Unit Test Categories

### 4.1 CourseService Tests

#### 4.1.1 createCourse.test.ts

**Test Cases:**

- ✅ **should create course successfully with valid data**
  - Memverifikasi course berhasil dibuat dengan data valid
  - Memastikan semua field tersimpan dengan benar
  - Memastikan timestamps (createdAt, updatedAt) terisi otomatis

- ✅ **should handle database connection error**
  - Memverifikasi error handling saat database tidak tersedia
  - Memastikan error dilempar dengan pesan yang jelas
  - Test dengan Prisma client mock yang throw error

- ✅ **should validate required fields before creation**
  - Test dengan title kosong → expect validation error
  - Test dengan description kosong → expect validation error
  - Test dengan creatorId kosong → expect validation error


#### 4.1.2 getCourses.test.ts

**Test Cases:**

- ✅ **should return paginated courses list**
  - Memverifikasi pagination berfungsi dengan benar
  - Test dengan berbagai kombinasi page dan limit
  - Memastikan total count dan totalPages dihitung dengan benar

- ✅ **should handle empty database**
  - Test ketika tidak ada course di database
  - Memastikan return empty array dengan pagination info yang benar
  - Memverifikasi tidak ada error thrown

- ✅ **should filter by creatorId correctly**
  - Test mengambil courses berdasarkan creatorId
  - Memverifikasi hanya courses milik creator tersebut yang dikembalikan
  - Test dengan creatorId yang tidak ada courses

- ✅ **should handle invalid pagination parameters**
  - Test dengan page < 1 → expect default to page 1
  - Test dengan limit > 50 → expect default to limit 50
  - Test dengan limit < 1 → expect default to limit 10

#### 4.1.3 getCourseById.test.ts

**Test Cases:**

- ✅ **should return course by valid ID**
  - Memverifikasi course ditemukan dengan ID yang valid
  - Memastikan semua field course dikembalikan dengan benar
  - Test dengan berbagai ID format

- ✅ **should return null for non-existent ID**
  - Test dengan ID yang tidak ada di database
  - Memastikan return null bukan error
  - Test dengan ID format invalid

- ✅ **should handle database query error**
  - Mock Prisma untuk throw error
  - Memverifikasi error handling yang proper
  - Memastikan error tidak crash aplikasi

#### 4.1.4 updateCourse.test.ts

**Test Cases:**

- ✅ **should update course successfully**
  - Memverifikasi course berhasil diupdate
  - Memastikan updatedAt timestamp berubah
  - Test dengan partial update (hanya beberapa field)

- ✅ **should reject update for non-owner**
  - Test update course milik creator lain
  - Memverifikasi authorization check berfungsi
  - Memastikan error message yang jelas

- ✅ **should handle course not found**
  - Test update course dengan ID yang tidak ada
  - Memverifikasi error handling yang proper
  - Memastikan tidak ada perubahan di database

- ✅ **should validate data before update**
  - Test dengan title kosong → expect validation error
  - Test dengan description terlalu panjang → expect validation error
  - Test dengan category invalid → expect validation error

#### 4.1.5 deleteCourse.test.ts

**Test Cases:**

- ✅ **should delete course successfully**
  - Memverifikasi course berhasil dihapus
  - Memastikan course tidak ada lagi di database
  - Test hard delete (tidak ada soft delete)

- ✅ **should reject delete for non-owner**
  - Test delete course milik creator lain
  - Memverifikasi authorization check berfungsi
  - Memastikan course tidak terhapus

- ✅ **should handle course not found**
  - Test delete course dengan ID yang tidak ada
  - Memverifikasi error handling yang proper
  - Memastikan tidak ada error crash

#### 4.1.6 updateCourseStatus.test.ts

**Test Cases:**

- ✅ **should update status successfully**
  - Test update ke semua status valid (DRAFT, PUBLISHED)
  - Memverifikasi status berubah di database
  - Memastikan updatedAt timestamp berubah

- ✅ **should reject invalid status**
  - Test dengan status yang tidak valid
  - Memverifikasi validation error
  - Memastikan status tidak berubah

- ✅ **should reject status update for non-owner**
  - Test update status course milik creator lain
  - Memverifikasi authorization check
  - Memastikan status tidak berubah

### 4.2 CourseAdapter Tests

#### 4.2.1 courseAdapter.test.ts

**Test Cases:**

- ✅ **createCourseAdapter should make successful POST request**
  - Memverifikasi POST request ke `/api/courses` dengan data yang benar
  - Test dengan data valid → expect success response
  - Memverifikasi request headers dan body format

- ✅ **createCourseAdapter should handle network errors**
  - Simulasi network failure
  - Verifikasi error handling dan retry mechanism
  - Test dengan timeout scenarios

- ✅ **createCourseAdapter should handle API error responses**
  - Test dengan 400 Bad Request → expect validation error
  - Test dengan 401 Unauthorized → expect auth error
  - Test dengan 403 Forbidden → expect permission error
  - Test dengan 500 Internal Server Error → expect server error

- ✅ **getCoursesAdapter should make successful GET request**
  - Memverifikasi GET request ke `/api/courses` dengan query params
  - Test pagination parameters (page, limit)
  - Test filter parameters (creatorId, status)
  - Verifikasi response parsing

- ✅ **getCoursesAdapter should handle empty response**
  - Test ketika API return empty courses array
  - Verifikasi proper handling untuk no data
  - Test pagination info dengan empty results

- ✅ **getCourseByIdAdapter should make successful GET request**
  - Memverifikasi GET request ke `/api/courses/[id]`
  - Test dengan valid ID → expect course data
  - Test dengan invalid ID → expect 404 error

- ✅ **updateCourseAdapter should make successful PUT request**
  - Memverifikasi PUT request ke `/api/courses/[id]`
  - Test dengan data valid → expect updated course
  - Verifikasi request body format

- ✅ **updateCourseAdapter should handle partial update**
  - Test update hanya beberapa fields
  - Verifikasi tidak ada fields yang hilang
  - Test dengan empty optional fields

- ✅ **deleteCourseAdapter should make successful DELETE request**
  - Memverifikasi DELETE request ke `/api/courses/[id]`
  - Test dengan valid ID → expect success confirmation
  - Test dengan invalid ID → expect 404 error

- ✅ **updateCourseStatusAdapter should make successful PATCH request**
  - Memverifikasi PATCH request ke `/api/courses/[id]/status`
  - Test dengan status valid (DRAFT, PUBLISHED)
  - Verifikasi request body format


### 4.3 Utility Functions Tests

#### 4.3.1 courseUtils.test.ts

**Test Cases:**

- ✅ **getStatusColor should return correct CSS classes**
  - Test setiap status (DRAFT, PUBLISHED)
  - Memverifikasi return valid Tailwind classes
  - Test dengan invalid status → expect default color

- ✅ **getStatusText should return Indonesian text**
  - Test setiap status untuk text yang benar
  - Memverifikasi text dalam bahasa Indonesia
  - Test dengan invalid status → expect default text

- ✅ **filterCourses should filter correctly**
  - Test search by title → expect filtered results
  - Test search by description → expect filtered results
  - Test status filter → expect filtered results
  - Test combined search and status filter
  - Test empty search query → expect all results

- ✅ **filterCoursesByStatus should filter by status only**
  - Test filter by DRAFT → expect only draft courses
  - Test filter by PUBLISHED → expect only published courses
  - Test without status filter → expect all courses

- ✅ **formatDuration should format minutes correctly**
  - Test 60 minutes → expect "1 jam"
  - Test 90 minutes → expect "1 jam 30 menit"
  - Test 30 minutes → expect "30 menit"
  - Test 0 minutes → expect "0 menit"

- ✅ **formatRating should format rating correctly**
  - Test 4.8 → expect "4.8"
  - Test 5.0 → expect "5.0"
  - Test 0.0 → expect "0.0"
  - Test invalid rating → expect "0.0"

- ✅ **formatNumber should format with thousand separator**
  - Test 1000 → expect "1.000"
  - Test 10000 → expect "10.000"
  - Test 100000 → expect "100.000"
  - Test 0 → expect "0"

- ✅ **getThumbnailUrl should generate correct URL**
  - Test dengan path valid → expect full URL
  - Test dengan empty path → expect default image
  - Test dengan invalid path → expect default image

- ✅ **validateCourseData should validate correctly**
  - Test dengan data valid → expect isValid true
  - Test dengan title kosong → expect isValid false
  - Test dengan description kosong → expect isValid false
  - Test dengan category kosong → expect isValid false
  - Test dengan multiple errors → expect all errors in array


## 5. Test Implementation Strategy

### 5.1 Mocking Strategy

- **Prisma Client**: Mock untuk database operations
- **External Services**: Mock untuk Supabase Storage
- **Environment Variables**: Mock untuk config testing

### 5.2 Test Data Management

- **Test Database**: Gunakan test database terpisah
- **Fixtures**: Buat test data yang konsisten
- **Cleanup**: Reset database setelah setiap test

### 5.3 Error Simulation

- **Database Errors**: Simulasi connection error, constraint violation
- **Validation Errors**: Test dengan invalid data
- **Authorization Errors**: Test dengan unauthorized access

## 6. Test Execution Plan

### 6.1 Unit Test Scripts

```bash
# Run all unit tests
npm run test:unit

# Run specific service tests
npm run test:unit -- --testPathPattern="courseService"

# Run specific adapter tests
npm run test:unit -- --testPathPattern="courseAdapter"

# Run specific utility tests
npm run test:unit -- --testPathPattern="courseUtils"

# Run with coverage
npm run test:unit -- --coverage
```

### 6.2 Test Organization

```
features/course/course-manage
└── lib/
    ├── courseUtils.ts
    └── courseUtils.test.ts
├── services/
│   ├── courseService.ts
│   └── courseService.test.ts
├── adapters/
│   ├── courseAdapter.ts
│   └── courseAdapter.test.ts
├── types/
    ├── index.ts
    └── index.test.ts
```

## 7. Success Criteria

### 7.1 Coverage Requirements

- **Line Coverage**: ≥ 80%
- **Branch Coverage**: ≥ 75%
- **Function Coverage**: ≥ 85%

### 7.2 Quality Gates

- Semua test cases pass
- Tidak ada test yang flaky
- Error handling teruji dengan baik
- Performance test untuk utility functions

### 7.3 Documentation

- Test cases terdokumentasi dengan jelas
- Error scenarios tercakup
- Edge cases teridentifikasi dan ditest

## 8. Risk Assessment

### 8.1 Technical Risks

- **Database Mocking**: Kompleksitas mocking Prisma operations
- **Environment Setup**: Konsistensi test environment
- **Performance**: Test execution time untuk large datasets

### 8.2 Mitigation Strategies

- Gunakan Prisma test utilities
- Standardize test environment setup
- Implement test data factories
- Use parallel test execution

## 9. Timeline

### 9.1 Phase 1: Service Tests (2-3 days)

- CourseService CRUD operations
- Error handling scenarios
- Authorization tests

### 9.2 Phase 2: Adapter Tests (1-2 days)

- CourseAdapter HTTP operations
- Network error handling
- Response parsing tests

### 9.3 Phase 3: Types & Utils Tests (1-2 days)

- TypeScript interfaces validation
- Utility functions testing
- Edge cases coverage

### 9.4 Phase 4: Integration & Refinement (1 day)

- Cross-function integration
- Performance optimization
- Documentation review

## 10. Dependencies

### 10.1 Technical Dependencies

- Jest testing framework
- Prisma test utilities
- MSW untuk API mocking
- Test database setup

### 10.2 Team Dependencies

- Database schema finalization
- API endpoint implementation
- Authentication middleware setup

## 11. Success Metrics

### 11.1 Quantitative Metrics

- Test coverage ≥ 80%
- Test execution time < 30 seconds
- Zero flaky tests
- All error scenarios covered

### 11.2 Qualitative Metrics

- Code maintainability improved
- Bug detection early in development
- Developer confidence in refactoring
- Clear error messages for debugging
