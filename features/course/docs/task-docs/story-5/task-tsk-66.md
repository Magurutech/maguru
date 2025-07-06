# Task TSK-66: E2E Test Case untuk Pembuatan Kursus

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Batasan dan Penyederhanaan](#batasan-dan-penyederhanaan)
3. [Spesifikasi Teknis](#spesifikasi-teknis)
4. [Implementasi Teknis](#implementasi-teknis)
5. [Test Plan](#test-plan)
6. [Pertanyaan untuk Diklarifikasi](#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

Task ini berfokus pada implementasi End-to-End (E2E) testing menggunakan Playwright untuk memvalidasi complete user journey dalam fitur pengelolaan kursus. Testing akan menggunakan pendekatan BDD (Behavior-Driven Development) dengan format Given-When-Then untuk memastikan fitur bekerja sesuai ekspektasi dari perspektif end user.

**Nilai Bisnis**: E2E testing memastikan integrasi yang seamless antara frontend, backend, database, dan autentikasi, memberikan confidence bahwa fitur bekerja optimal dari perspektif pengguna nyata.

**Konteks dalam Sprint**: Task ini merupakan tahap testing terakhir yang bergantung pada completion semua task sebelumnya (TSK-46, TSK-47, TSK-48, TSK-49) dan memberikan validasi final sebelum release.

## Batasan dan Penyederhanaan

1. **Test Scope**:
   - Fokus pada happy path dan critical error scenarios
   - Test hanya untuk role creator dan admin
   - Tidak mencakup performance testing (dilakukan terpisah)

2. **Browser Coverage**:
   - Testing hanya pada Chromium browser
   - Tidak testing Firefox dan WebKit
   - Tidak testing mobile browsers secara terpisah

3. **Test Environment**:
   - Test menggunakan staging environment atau local development
   - Mock external services yang tidak stable
   - Tidak test production environment

4. **Data Management**:
   - Clean test data setelah setiap test run
   - Tidak test dengan production data
   - Menggunakan deterministic test data

## Spesifikasi Teknis

### Test Architecture

```
__tests__/
└── playwright/
    ├── course/
    │   ├── course-creation.spec.ts     # Test pembuatan kursus
    │   ├── course-management.spec.ts   # Test edit/delete kursus
    │   ├── course-authorization.spec.ts # Test role-based access
    │   └── course-search-filter.spec.ts # Test search dan filter
    ├── fixtures/
    │   ├── course-test-data.ts            # Test data factories
    │   └── course-test-users.ts           # Test user data
    └── utils/
        ├── course-helpers.ts              # Course-specific helpers
        └── auth-helpers.ts                # Authentication helpers
```

### Test Scenarios Matrix

| User Story                    | Creator | Admin    | User | Expected Result                                        |
| ----------------------------- | ------- | -------- | ---- | ------------------------------------------------------ |
| Access course management page | ✅      | ✅       | ❌   | Creator/Admin: Success, User: Redirect to unauthorized |
| Create new course             | ✅      | ✅       | ❌   | Creator/Admin: Success, User: Cannot access            |
| View own courses              | ✅      | ✅ (all) | ❌   | Creator: Own only, Admin: All courses                  |
| Edit own course               | ✅      | ✅ (all) | ❌   | Creator: Own only, Admin: Any course                   |
| Delete own course             | ✅      | ✅ (all) | ❌   | Creator: Own only, Admin: Any course                   |

### Detailed Test Scenarios

#### Course Creation Flow

1. **Happy Path - Creator Creates Course**
   - Creator login dan akses course management page
   - Creator klik "Create New Course" button
   - Creator isi form dengan data valid (title, description, thumbnail)
   - Creator submit form
   - Course berhasil dibuat dan muncul di list
   - Redirect ke course list dengan success message

2. **Happy Path - Admin Creates Course**
   - Admin login dan akses course management page
   - Admin dapat membuat course seperti creator
   - Course tersimpan dengan admin sebagai owner

3. **Validation Error Scenarios**
   - Empty title field → Error message displayed
   - Title terlalu pendek (< 3 karakter) → Error message
   - Empty description → Error message
   - Invalid thumbnail format → Error message

4. **Network Error Scenarios**
   - Server error saat submit → Error message dengan retry option
   - Network timeout → Timeout error message
   - Database connection error → Server error message

#### Course Management Flow

1. **Edit Course - Creator**
   - Creator akses course list
   - Creator klik edit button pada course sendiri
   - Form pre-filled dengan data existing
   - Creator update data dan submit
   - Course berhasil diupdate

2. **Edit Course - Admin**
   - Admin dapat edit course milik creator lain
   - Admin dapat edit course milik sendiri

3. **Delete Course - Creator**
   - Creator klik delete button pada course sendiri
   - Confirmation dialog muncul
   - Creator confirm deletion
   - Course berhasil dihapus dari list

4. **Delete Course - Admin**
   - Admin dapat delete course milik creator lain
   - Admin dapat delete course milik sendiri

#### Authorization Flow

1. **Unauthorized Access**
   - User tanpa role creator/admin akses course management
   - Redirect ke unauthorized page
   - Error message displayed

2. **Session Expired**
   - User dengan session expired akses course management
   - Redirect ke login page
   - Error message tentang session expired

#### Search and Filter Flow

1. **Search Functionality**
   - User input search term
   - Course list filtered berdasarkan search term
   - Empty state displayed jika tidak ada hasil

2. **Filter by Status**
   - User filter berdasarkan draft/published status
   - Course list filtered sesuai status
   - Filter state maintained saat navigation

### BDD Test Structure

```typescript
// Format test menggunakan Given-When-Then
test.describe('Course Management - Creator Flow', () => {
  test('should create new course successfully', async ({ page }) => {
    // Given: Creator is logged in and on course management page
    // When: Creator fills course form and submits
    // Then: Course is created and appears in list
  })
})
```

## Implementasi Teknis

### E2E Test Implementation

#### Course Creation Tests

```typescript
/**
 * E2E Test: Course Creation Flow
 *
 * Test complete user journey untuk membuat kursus baru dari login hingga
 * kursus muncul di daftar.
 */

// __tests__/playwright/e2e/course/course-creation.spec.ts
```

#### Course Management Tests

```typescript
/**
 * E2E Test: Course Management (Edit/Delete)
 *
 * Test editing dan deleting kursus existing.
 */

// __tests__/playwright/e2e/course/course-management.spec.ts
```

## Test Plan

### Test Execution Strategy

#### 1. Local Development

- Run tests terhadap local development server
- Fast feedback untuk developer
- Debugging dengan headed mode

#### 2. CI/CD Pipeline

- Run tests pada setiap PR
- Use headless mode untuk performance
- Generate artifacts (screenshots, videos) untuk failures

#### 3. Staging Environment

- Comprehensive test suite sebelum production release
- Cross-browser testing
- Performance validation

### Test Data Management

**Setup Strategy**:

- Clean database sebelum setiap test suite
- Create fresh test data untuk setiap test
- Isolate test data antar parallel tests

**Cleanup Strategy**:

- Automatic cleanup setelah test completion
- Manual cleanup untuk interrupted tests
- Separate test database untuk isolation

### Browser Testing Strategy

**Browser Coverage**:

- Chromium browser only (primary development)

**Test Matrix**:

- Full test suite pada Chromium
- Tidak testing Firefox dan WebKit
- Focus pada functional testing di Chromium

### Performance Validation

**Metrics to Monitor**:

- Page load times < 3 seconds
- Form submission response < 2 seconds
- Navigation transitions < 1 second

**Implementation**:

```typescript
test('Course creation performance', async ({ page }) => {
  const startTime = Date.now()

  await page.goto('/creator/course-manage/create')

  const loadTime = Date.now() - startTime
  expect(loadTime).toBeLessThan(3000)
})
```

## Pertanyaan untuk Diklarifikasi

1. **Test Environment**: Apakah testing dilakukan terhadap local development server atau dedicated staging environment?

2. **Test Data Isolation**: Bagaimana strategi untuk memastikan test data tidak interfere dengan development data?

3. **Browser Matrix**: Apakah perlu testing pada browser versi yang lebih lama atau fokus pada browser modern saja?

4. **Mobile Testing**: Apakah perlu responsive testing pada mobile viewports atau akan dilakukan terpisah?

5. **Error Scenarios**: Seberapa comprehensive error scenario testing yang diperlukan (network failures, server errors)?

6. **Performance Baselines**: Apakah ada performance baseline yang sudah ditetapkan atau perlu diestablish dari testing ini?

7. **Parallel Execution**: Apakah test bisa dijalankan parallel atau harus sequential karena shared resources?

8. **Visual Testing**: Apakah perlu visual regression testing atau functional testing sudah cukup?

## Referensi

- [Playwright Testing Framework](https://playwright.dev/docs/intro)
- [BDD Testing Best Practices](https://cucumber.io/docs/bdd/)
- [E2E Testing Strategy](https://martinfowler.com/articles/practical-test-pyramid.html)
- Existing E2E test patterns di codebase Maguru
