# Task TSK-67: Menulis Test Case E2E untuk Pendaftaran Kursus

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

Task TSK-67 fokus pada implementasi End-to-End (E2E) testing untuk fitur pendaftaran kursus menggunakan Playwright. E2E testing ini akan memvalidasi complete user journey dari login hingga berhasil mendaftar ke kursus, termasuk berbagai skenario error dan edge cases yang mungkin terjadi dalam environment production.

Testing ini akan mengikuti pendekatan BDD (Behavior-Driven Development) dengan format Given-When-Then, memastikan bahwa fitur enrollment berfungsi dengan baik dari perspektif pengguna akhir dan memenuhi semua acceptance criteria yang telah didefinisikan.

## Perbandingan dengan Referensi

| Testing Aspect  | Referensi (Industry Standard) | Project Maguru                   |
| --------------- | ----------------------------- | -------------------------------- |
| E2E Framework   | Playwright, Cypress, Selenium | Playwright dengan TypeScript     |
| Test Structure  | BDD (Given-When-Then)         | BDD dengan Playwright            |
| Authentication  | Real auth atau mocked auth    | Clerk authentication integration |
| Test Data       | Fixtures, factories, seeding  | Test data fixtures dengan Clerk  |
| Browser Support | Cross-browser testing         | Chromium, Firefox, WebKit        |

## Batasan dan Penyederhanaan Implementasi

### 1. **Test Scope**:

- Fokus pada enrollment flow utama
- Tidak mencakup performance testing yang kompleks
- Tidak ada visual regression testing

### 2. **Authentication Strategy**:

- Menggunakan Clerk test mode
- Pre-authenticated test users
- Tidak ada real OAuth flow testing

### 3. **Test Environment**:

- Local development environment
- Test database dengan seeded data
- Mocked external services jika diperlukan

### 4. **Browser Coverage**:

- Primary: Chromium (fastest execution)
- Secondary: Firefox dan WebKit (basic validation)
- Tidak ada legacy browser support

## Spesifikasi Teknis

### Test Structure

```
__tests__/playwright/
├── course/
│   ├── enrollment.spec.ts
│   ├── enrollment-error.spec.ts
│   └── enrollment-auth.spec.ts
├── fixtures/
│   ├── course-test-data.ts
│   └── enrollment-test-data.ts
└── utils/
    ├── enrollment-helpers.ts
    └── auth-helpers.ts
```

### Test Data Fixtures

```typescript
// course-test-data.ts
export const testCourse = {
  id: 'test-course-123',
  title: 'E2E Test Course',
  description: 'Course untuk testing enrollment flow',
  status: 'PUBLISHED',
  category: 'teknologi',
  creatorId: 'test-creator-123',
}

// enrollment-test-data.ts
export const testUser = {
  email: 'test-student@example.com',
  password: 'testpassword123',
  role: 'user',
}
```

### Test Scenarios

#### Happy Path Scenarios

1. **Successful Enrollment Flow**
   - User login → Browse catalog → Select course → Enroll → Confirmation

2. **Enrollment Status Check**
   - User login → Check enrollment status → Verify UI updates

#### Error Scenarios

1. **Duplicate Enrollment**
   - User tries to enroll in already enrolled course

2. **Authentication Required**
   - Unauthenticated user tries to enroll

3. **Course Not Found**
   - User tries to enroll in non-existent course

4. **Network Errors**
   - API failures during enrollment process

## Implementasi Teknis

### 1. **Playwright Test Configuration**

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './__tests__/playwright',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
})
```

### 2. **E2E Test Implementation**

#### Successful Enrollment Test

```typescript
test.describe('Course Enrollment', () => {
  test('should successfully enroll user to course', async ({ page }) => {
    // Given: User is logged in and course is available
    await page.goto('/sign-in')
    await page.fill('[data-testid="email"]', testUser.email)
    await page.fill('[data-testid="password"]', testUser.password)
    await page.click('[data-testid="sign-in-button"]')

    // When: User navigates to course catalog and enrolls
    await page.goto('/courses')
    await page.click(`[data-testid="enroll-button-${testCourse.id}"]`)
    await page.click('[data-testid="confirm-enrollment"]')

    // Then: Enrollment should be successful
    await expect(page.locator('[data-testid="enrollment-success"]')).toBeVisible()
    await expect(page.locator(`[data-testid="enrolled-status-${testCourse.id}"]`)).toBeVisible()
  })
})
```

#### Error Scenario Test

```typescript
test('should prevent duplicate enrollment', async ({ page }) => {
  // Given: User is already enrolled in course
  await loginUser(page, testUser)
  await enrollUserInCourse(page, testCourse.id)

  // When: User tries to enroll again
  await page.goto('/courses')
  await page.click(`[data-testid="enroll-button-${testCourse.id}"]`)

  // Then: Should show already enrolled message
  await expect(page.locator('[data-testid="already-enrolled-message"]')).toBeVisible()
})
```

### 3. **Test Helpers**

#### Authentication Helper

```typescript
// auth-helpers.ts
export async function loginUser(page: Page, user: TestUser) {
  await page.goto('/sign-in')
  await page.fill('[data-testid="email"]', user.email)
  await page.fill('[data-testid="password"]', user.password)
  await page.click('[data-testid="sign-in-button"]')
  await page.waitForURL('/dashboard')
}
```

#### Enrollment Helper

```typescript
// enrollment-helpers.ts
export async function enrollUserInCourse(page: Page, courseId: string) {
  await page.goto('/courses')
  await page.click(`[data-testid="enroll-button-${courseId}"]`)
  await page.click('[data-testid="confirm-enrollment"]')
  await page.waitForSelector('[data-testid="enrollment-success"]')
}
```

## Peningkatan UX

### Test Reliability

- **Stable Selectors**: Data-testid attributes untuk reliable element selection
- **Wait Strategies**: Proper waiting untuk async operations
- **Retry Logic**: Automatic retry untuk flaky tests
- **Cleanup**: Proper test data cleanup

### Test Performance

- **Parallel Execution**: Tests dapat dijalankan parallel
- **Fast Setup**: Quick test environment setup
- **Efficient Data**: Minimal test data requirements
- **Caching**: Browser cache optimization

### Test Maintainability

- **Page Object Model**: Organized test structure
- **Reusable Helpers**: Shared test utilities
- **Clear Documentation**: Test scenario descriptions
- **Version Control**: Test code review process

## Test Plan

### Test Scenarios Coverage

#### Authentication Scenarios

- [ ] User login dengan valid credentials
- [ ] User login dengan invalid credentials
- [ ] User logout dan session cleanup
- [ ] Unauthenticated user access restrictions

#### Enrollment Scenarios

- [ ] Successful course enrollment flow
- [ ] Duplicate enrollment prevention
- [ ] Enrollment status verification
- [ ] Course catalog browsing

#### Error Handling Scenarios

- [ ] Network error during enrollment
- [ ] Server error responses
- [ ] Invalid course ID handling
- [ ] Authentication timeout

#### UI/UX Scenarios

- [ ] Loading states during enrollment
- [ ] Success/error message display
- [ ] Responsive design validation
- [ ] Accessibility compliance

### Test Execution Strategy

- **Smoke Tests**: Critical path testing (5 minutes)
- **Full Suite**: Complete test coverage (15 minutes)
- **Regression Tests**: Previous bug fixes validation
- **Performance Tests**: Basic performance validation

## Pertanyaan untuk Diklarifikasi

1. Apakah perlu visual regression testing untuk UI components?
2. Apakah perlu cross-browser testing untuk semua browsers?
3. Apakah perlu mobile device testing?
4. Apakah perlu accessibility testing automation?
5. Apakah perlu performance testing dalam E2E suite?

## Acceptance Criteria

- [ ] E2E tests untuk successful enrollment flow berhasil
- [ ] E2E tests untuk error scenarios berhasil
- [ ] E2E tests untuk authentication scenarios berhasil
- [ ] Test execution time <15 menit untuk full suite
- [ ] Test reliability >95% (tidak ada flaky tests)
- [ ] Cross-browser compatibility validated
- [ ] Mobile responsiveness tested
- [ ] Accessibility compliance verified
- [ ] CI/CD pipeline integration berhasil
- [ ] Test documentation lengkap

## Estimasi Effort

**Total: 6 jam**

- Test scenario planning: 1 jam
- Test implementation: 3 jam
- Test helpers dan utilities: 1 jam
- CI/CD integration dan documentation: 1 jam

## Dependencies

- TSK-50: Desain UI untuk katalog kursus
- TSK-51: Backend untuk pendaftaran kursus
- TSK-52: Frontend untuk pendaftaran kursus
- TSK-53: Unit dan integration tests
- Playwright setup (✅ Complete)
- Clerk test mode configuration (✅ Complete)
- Test database setup
- CI/CD pipeline configuration
