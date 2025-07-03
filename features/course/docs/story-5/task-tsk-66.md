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
   - Primary testing pada Chromium
   - Cross-browser testing pada Firefox dan WebKit untuk critical paths
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
    ├── e2e/
    │   └── course/
    │       ├── course-creation.spec.ts     # Test pembuatan kursus
    │       ├── course-management.spec.ts   # Test edit/delete kursus
    │       └── course-authorization.spec.ts # Test role-based access
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
import { test, expect } from '@playwright/test'
import { loginAsCreator, loginAsAdmin, loginAsUser } from '../../utils/auth-helpers'
import { createTestCourse, cleanupTestCourses } from '../../utils/course-helpers'

test.describe('Course Creation', () => {
  test.beforeEach(async ({ page }) => {
    await cleanupTestCourses()
  })

  test.afterEach(async ({ page }) => {
    await cleanupTestCourses()
  })

  test('Creator should be able to create new course successfully', async ({ page }) => {
    // Given: Creator is authenticated and on course management page
    await loginAsCreator(page)
    await page.goto('/creator/course-manage')

    // Verify page loads correctly
    await expect(page.locator('h1')).toContainText('Kelola Kursus')
    await expect(page.locator('[data-testid="create-course-btn"]')).toBeVisible()

    // When: Creator clicks create course button
    await page.click('[data-testid="create-course-btn"]')

    // Verify navigation to create form
    await expect(page).toHaveURL('/creator/course-manage/create')
    await expect(page.locator('h1')).toContainText('Buat Kursus Baru')

    // When: Creator fills course information
    await page.fill('[data-testid="course-title"]', 'E2E Test Course')
    await page.fill('[data-testid="course-description"]', 'Deskripsi kursus untuk E2E testing')

    // Add module and lesson
    await page.click('[data-testid="add-module-btn"]')
    await page.fill('[data-testid="module-title-0"]', 'Module 1: Introduction')

    await page.click('[data-testid="add-lesson-btn-0"]')
    await page.fill('[data-testid="lesson-title-0-0"]', 'Lesson 1: Getting Started')

    // When: Creator submits the form
    await page.click('[data-testid="save-course-btn"]')

    // Then: Course should be created successfully
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Kursus berhasil dibuat',
    )

    // Then: Should redirect to course list
    await expect(page).toHaveURL('/creator/course-manage')

    // Then: New course should appear in the list
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      'E2E Test Course',
    )
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      'Deskripsi kursus untuk E2E testing',
    )

    // Verify module and lesson count
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      '1 Modul, 1 Pelajaran',
    )
  })

  test('Creator should see validation errors for invalid course data', async ({ page }) => {
    // Given: Creator is on create course page
    await loginAsCreator(page)
    await page.goto('/creator/course-manage/create')

    // When: Creator submits empty form
    await page.click('[data-testid="save-course-btn"]')

    // Then: Should show validation errors
    await expect(page.locator('[data-testid="title-error"]')).toContainText(
      'Judul kursus harus diisi',
    )
    await expect(page.locator('[data-testid="description-error"]')).toContainText(
      'Deskripsi harus diisi',
    )

    // Then: Should not navigate away from form
    await expect(page).toHaveURL('/creator/course-manage/create')
  })

  test('Creator should be able to cancel course creation', async ({ page }) => {
    // Given: Creator is on create course page with partial data
    await loginAsCreator(page)
    await page.goto('/creator/course-manage/create')

    await page.fill('[data-testid="course-title"]', 'Cancelled Course')

    // When: Creator clicks cancel
    await page.click('[data-testid="cancel-btn"]')

    // Then: Should return to course list without creating course
    await expect(page).toHaveURL('/creator/course-manage')
    await expect(page.locator('[data-testid="course-list"]')).not.toContainText('Cancelled Course')
  })

  test('Admin should be able to create course', async ({ page }) => {
    // Given: Admin is authenticated
    await loginAsAdmin(page)
    await page.goto('/creator/course-manage')

    // When: Admin creates a course (same flow as creator)
    await page.click('[data-testid="create-course-btn"]')
    await page.fill('[data-testid="course-title"]', 'Admin Test Course')
    await page.fill('[data-testid="course-description"]', 'Course created by admin')

    await page.click('[data-testid="add-module-btn"]')
    await page.fill('[data-testid="module-title-0"]', 'Admin Module')

    await page.click('[data-testid="add-lesson-btn-0"]')
    await page.fill('[data-testid="lesson-title-0-0"]', 'Admin Lesson')

    await page.click('[data-testid="save-course-btn"]')

    // Then: Course should be created successfully
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      'Admin Test Course',
    )
  })
})
```

#### Course Management Tests

```typescript
/**
 * E2E Test: Course Management (Edit/Delete)
 *
 * Test editing dan deleting kursus existing.
 */

// __tests__/playwright/e2e/course/course-management.spec.ts
test.describe('Course Management', () => {
  let testCourseId: string

  test.beforeEach(async ({ page }) => {
    await cleanupTestCourses()
    // Create test course for manipulation
    testCourseId = await createTestCourse({
      title: 'Test Course for Management',
      description: 'Course for testing edit/delete operations',
    })
  })

  test('Creator should be able to edit own course', async ({ page }) => {
    // Given: Creator has an existing course
    await loginAsCreator(page)
    await page.goto('/creator/course-manage')

    // Verify course exists
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      'Test Course for Management',
    )

    // When: Creator clicks edit button
    await page.click('[data-testid="edit-course-btn"]')

    // Then: Should navigate to edit form with pre-filled data
    await expect(page).toHaveURL(`/creator/course-manage/edit/${testCourseId}`)
    await expect(page.locator('[data-testid="course-title"]')).toHaveValue(
      'Test Course for Management',
    )

    // When: Creator updates course information
    await page.fill('[data-testid="course-title"]', 'Updated Test Course')
    await page.fill('[data-testid="course-description"]', 'Updated description for testing')

    await page.click('[data-testid="update-course-btn"]')

    // Then: Course should be updated successfully
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Kursus berhasil diperbarui',
    )
    await expect(page).toHaveURL('/creator/course-manage')

    // Then: Updated information should be reflected in course list
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      'Updated Test Course',
    )
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      'Updated description for testing',
    )
  })

  test('Creator should be able to delete own course with confirmation', async ({ page }) => {
    // Given: Creator has an existing course
    await loginAsCreator(page)
    await page.goto('/creator/course-manage')

    // When: Creator clicks delete button
    await page.click('[data-testid="delete-course-btn"]')

    // Then: Confirmation modal should appear
    await expect(page.locator('[data-testid="delete-confirmation-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="confirmation-message"]')).toContainText(
      'Yakin ingin menghapus kursus',
    )

    // When: Creator confirms deletion
    await page.click('[data-testid="confirm-delete-btn"]')

    // Then: Course should be deleted
    await expect(page.locator('[data-testid="success-message"]')).toContainText(
      'Kursus berhasil dihapus',
    )

    // Then: Course should no longer appear in list
    await expect(page.locator('[data-testid="course-list"]')).not.toContainText(
      'Test Course for Management',
    )
  })

  test('Creator should be able to cancel course deletion', async ({ page }) => {
    // Given: Creator has an existing course
    await loginAsCreator(page)
    await page.goto('/creator/course-manage')

    // When: Creator clicks delete but cancels
    await page.click('[data-testid="delete-course-btn"]')
    await page.click('[data-testid="cancel-delete-btn"]')

    // Then: Modal should close and course should remain
    await expect(page.locator('[data-testid="delete-confirmation-modal"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="course-card"]').first()).toContainText(
      'Test Course for Management',
    )
  })
})
```

#### Authorization Tests

```typescript
/**
 * E2E Test: Role-Based Authorization
 *
 * Test access control untuk berbagai role user.
 */

// __tests__/playwright/e2e/course/course-authorization.spec.ts
test.describe('Course Authorization', () => {
  test('Regular user should not access course management', async ({ page }) => {
    // Given: Regular user is authenticated
    await loginAsUser(page)

    // When: User tries to access course management
    await page.goto('/creator/course-manage')

    // Then: Should be redirected to unauthorized page
    await expect(page).toHaveURL('/unauthorized')
    await expect(page.locator('h1')).toContainText('Access Denied')
    await expect(page.locator('[data-testid="error-message"]')).toContainText(
      'You do not have permission',
    )
  })

  test('Unauthenticated user should be redirected to sign-in', async ({ page }) => {
    // Given: No user is authenticated

    // When: User tries to access course management
    await page.goto('/creator/course-manage')

    // Then: Should be redirected to sign-in page
    await expect(page).toHaveURL('/sign-in')
  })

  test('Creator should only see own courses', async ({ page }) => {
    // Given: Multiple creators with different courses exist
    const creatorAId = await createTestUser({ role: 'creator', email: 'creator-a@test.com' })
    const creatorBId = await createTestUser({ role: 'creator', email: 'creator-b@test.com' })

    await createTestCourse({ title: 'Course A', creatorId: creatorAId })
    await createTestCourse({ title: 'Course B', creatorId: creatorBId })

    // When: Creator A logs in and views course list
    await loginAs(page, 'creator-a@test.com')
    await page.goto('/creator/course-manage')

    // Then: Should only see own courses
    await expect(page.locator('[data-testid="course-list"]')).toContainText('Course A')
    await expect(page.locator('[data-testid="course-list"]')).not.toContainText('Course B')
  })

  test('Admin should see all courses', async ({ page }) => {
    // Given: Multiple creators with different courses exist
    const creatorAId = await createTestUser({ role: 'creator', email: 'creator-a@test.com' })
    const creatorBId = await createTestUser({ role: 'creator', email: 'creator-b@test.com' })

    await createTestCourse({ title: 'Course A', creatorId: creatorAId })
    await createTestCourse({ title: 'Course B', creatorId: creatorBId })

    // When: Admin logs in and views course list
    await loginAsAdmin(page)
    await page.goto('/creator/course-manage')

    // Then: Should see all courses
    await expect(page.locator('[data-testid="course-list"]')).toContainText('Course A')
    await expect(page.locator('[data-testid="course-list"]')).toContainText('Course B')
  })
})
```

### Test Helpers Implementation

```typescript
// __tests__/playwright/utils/course-helpers.ts
import { Page } from '@playwright/test'

export async function createTestCourse(courseData: {
  title: string
  description: string
  creatorId?: string
}) {
  // API call to create test course
  const response = await fetch('/api/test/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(courseData),
  })

  const data = await response.json()
  return data.id
}

export async function cleanupTestCourses() {
  // API call to cleanup test data
  await fetch('/api/test/cleanup/courses', { method: 'DELETE' })
}

export async function waitForCourseListToLoad(page: Page) {
  await page.waitForSelector('[data-testid="course-list"]')
  await page.waitForLoadState('networkidle')
}

export async function fillCourseForm(
  page: Page,
  courseData: {
    title: string
    description: string
    modules: Array<{
      title: string
      lessons: Array<{ title: string }>
    }>
  },
) {
  await page.fill('[data-testid="course-title"]', courseData.title)
  await page.fill('[data-testid="course-description"]', courseData.description)

  for (let i = 0; i < courseData.modules.length; i++) {
    if (i > 0) {
      await page.click('[data-testid="add-module-btn"]')
    }

    await page.fill(`[data-testid="module-title-${i}"]`, courseData.modules[i].title)

    for (let j = 0; j < courseData.modules[i].lessons.length; j++) {
      if (j > 0) {
        await page.click(`[data-testid="add-lesson-btn-${i}"]`)
      }

      await page.fill(
        `[data-testid="lesson-title-${i}-${j}"]`,
        courseData.modules[i].lessons[j].title,
      )
    }
  }
}
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

### Cross-Browser Testing

**Primary Browsers**:

- Chromium (primary development)
- Firefox (cross-browser validation)
- WebKit (Safari compatibility)

**Test Matrix**:

- Full test suite pada Chromium
- Smoke tests pada Firefox dan WebKit
- Critical path tests pada semua browsers

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
