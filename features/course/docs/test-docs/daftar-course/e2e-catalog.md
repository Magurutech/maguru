# E2E Test Plan - Course Catalog Page dengan Enrollment Functionality

## 1. Identifikasi Dokumen

- **Judul Dokumen:** E2E Test Plan - Course Catalog Page dengan Enrollment Functionality
- **Identifikasi Versi dan Tanggal:**
  - Versi: 2.0 (SIMPLIFIED)
  - Tanggal: 2025-01-10
  - **Status:** 📋 PLANNED
- **Author:** AI Assistant
- **Reviewer:** -
- **Referensi:** [instruksi-e2e.mdc](mdc:instruksi-e2e.mdc), [test-instruction.mdc](mdc:test-instruction.mdc)

## 2. Pendahuluan

E2E test plan ini fokus pada testing course catalog page dengan enrollment functionality yang terintegrasi dengan hooks yang sudah diimplementasi. **Mengikuti prinsip "test yang tidak terlalu kompleks"** dari test-instruction, test ini dibatasi pada 8 core test cases yang mencakup functionality utama.

### Scope Testing (Simplified)

- **Course Catalog Page**: `/course` route
- **Enrollment Functionality**: Real enrollment operations dengan hooks
- **Search & Filter**: Server-side search dan filtering
- **Core User Interactions**: Course browsing, enrollment, search
- **Error Scenarios**: Network failures, validation errors
- **Performance**: Page load time, search response time

### Test Environment

- **Browser**: Chromium (primary), Firefox, WebKit
- **Viewport**: Desktop (1920x1080), Mobile (375x667)
- **Network**: Fast 3G, Slow 3G
- **Authentication**: Authenticated user dengan role 'user' (via global.setup.ts)

## 3. Test Scenarios (Simplified - 8 Core Tests)

### 3.1 Page Loading dan Initial State

#### Test Case: TC-CATALOG-001 - Page Load Success

**Description**: Verify course catalog page loads successfully dengan real data

**Steps**:

1. Navigate to `/course`
2. Wait for page to load
3. Verify page title is displayed
4. Verify course catalog banner is shown
5. Verify course grid is displayed
6. Verify loading states are handled properly

**Expected Results**:

- Page loads within 3 seconds
- Course catalog banner is visible
- Course grid shows courses with proper layout
- No loading spinners after initial load
- Page is responsive on different screen sizes

### 3.2 Course Display dan Information

#### Test Case: TC-CATALOG-002 - Course Card Display

**Description**: Verify course cards display all required information

**Steps**:

1. Navigate to `/course`
2. Wait for courses to load
3. Verify course card elements:
   - Course thumbnail
   - Course title
   - Creator name
   - Category badge
   - Rating display
   - Student count
   - Duration
   - Price
   - Enrollment button

**Expected Results**:

- All course information is displayed correctly
- Course thumbnails load properly
- Rating stars are displayed
- Price formatting is correct
- Enrollment button is visible

### 3.3 Enrollment Functionality

#### Test Case: TC-CATALOG-003 - Successful Enrollment

**Description**: Verify user can successfully enroll in a course

**Steps**:

1. Navigate to `/course` as authenticated user
2. Find a course that user is not enrolled in
3. Click "Enroll Now" button
4. Wait for enrollment process
5. Verify enrollment success feedback
6. Verify course status changes to "Enrolled"

**Expected Results**:

- Enrollment button shows loading state
- Success toast notification appears
- Course status changes to "Enrolled"
- Button text changes to "Enrolled"

#### Test Case: TC-CATALOG-004 - Enrollment Error Handling

**Description**: Verify enrollment handles errors gracefully

**Steps**:

1. Mock enrollment API failure
2. Navigate to `/course` as authenticated user
3. Click "Enroll Now" button
4. Wait for error response
5. Verify error message is displayed
6. Verify retry mechanism works

**Expected Results**:

- Error message is displayed clearly
- Loading state is cleared
- Retry option is available
- User can attempt enrollment again

### 3.4 Search dan Filter Functionality

#### Test Case: TC-CATALOG-005 - Search Functionality

**Description**: Verify search functionality works with server-side search

**Steps**:

1. Navigate to `/course`
2. Type search query in search box
3. Wait for debounced search
4. Verify search results are displayed
5. Verify search query is highlighted
6. Clear search and verify all courses are shown

**Expected Results**:

- Search results appear within 1 second
- Search query is highlighted in results
- Results match search criteria
- Clear search shows all courses
- Search is debounced (no excessive API calls)

#### Test Case: TC-CATALOG-006 - Category Filter

**Description**: Verify category filtering works properly

**Steps**:

1. Navigate to `/course`
2. Click on category tab (e.g., "Martial Arts")
3. Verify filtered results are displayed
4. Verify category badge is highlighted
5. Switch to different category
6. Verify results update accordingly

**Expected Results**:

- Category filter works correctly
- Only courses from selected category are shown
- Category tab is highlighted
- Results update smoothly
- Clear filters option works

### 3.5 Quick View Modal

#### Test Case: TC-CATALOG-007 - Quick View Modal

**Description**: Verify quick view modal displays course details

**Steps**:

1. Navigate to `/course`
2. Click quick view button on course card
3. Verify modal opens
4. Verify course details are displayed:
   - Course title
   - Description
   - Instructor information
   - Curriculum
   - Price
   - Enrollment button
5. Close modal

**Expected Results**:

- Modal opens smoothly
- All course details are displayed
- Modal is responsive
- Close button works
- Modal can be closed with Escape key

### 3.6 Responsive Design

#### Test Case: TC-CATALOG-008 - Mobile Responsiveness

**Description**: Verify course catalog works properly on mobile devices

**Steps**:

1. Set viewport to mobile size (375x667)
2. Navigate to `/course`
3. Verify layout is responsive
4. Test touch interactions
5. Verify search and filter work on mobile
6. Test enrollment flow on mobile

**Expected Results**:

- Layout adapts to mobile screen
- Touch interactions work properly
- Search and filter are accessible
- Enrollment flow works on mobile
- No horizontal scrolling

## 4. Test Implementation

### 4.1 Test File Structure

```
__tests__/playwright/course/user/
└── course-catalog.spec.ts          # Main course catalog tests (8 tests)
```

### 4.2 Test Data Setup

```typescript
// fixtures/course-test-data.ts
export const courseTestData = {
  courses: [
    {
      id: 'course-1',
      title: 'Ancient Martial Arts',
      creator: 'Master Chen',
      category: 'Martial Arts',
      price: 299,
      rating: 4.8,
      students: 1250,
      duration: '2 hours',
      enrolled: false,
    },
  ],
  users: {
    enrolledUser: {
      id: 'user-1',
      enrolledCourses: ['course-1'],
    },
    newUser: {
      id: 'user-2',
      enrolledCourses: [],
    },
  },
}
```

### 4.3 Test Utilities

```typescript
// utils/course-helpers.ts
export const courseHelpers = {
  async enrollInCourse(page: Page, courseId: string) {
    await page.click(`[data-testid="enroll-button-${courseId}"]`)
    await page.waitForSelector('[data-testid="enrollment-success"]')
  },

  async searchCourses(page: Page, query: string) {
    await page.fill('[data-testid="search-input"]', query)
    await page.waitForTimeout(500) // Wait for debounce
  },

  async filterByCategory(page: Page, category: string) {
    await page.click(`[data-testid="category-${category}"]`)
  },
}
```

## 5. Test Execution

### 5.1 Local Development

```bash
# Run course catalog E2E tests
yarn playwright test course/user/course-catalog.spec.ts

# Run with UI mode
yarn playwright test course/user/course-catalog.spec.ts --ui

# Run with headed mode
yarn playwright test course/user/course-catalog.spec.ts --headed
```

### 5.2 CI/CD Integration

```bash
# Run in CI environment
yarn playwright test course/user/course-catalog.spec.ts --project=chromium

# Run with trace for debugging
yarn playwright test course/user/course-catalog.spec.ts --trace on

# Generate report
yarn playwright show-report
```

## 6. Success Criteria

### 6.1 Functional Requirements

- [ ] All test cases pass (8/8 tests)
- [ ] Enrollment functionality works end-to-end
- [ ] Search and filter work correctly
- [ ] Responsive design works on mobile
- [ ] Error scenarios are handled gracefully

### 6.2 Performance Requirements

- [ ] Page load time < 3 seconds
- [ ] Search response time < 1 second
- [ ] Enrollment operation time < 2 seconds
- [ ] Smooth animations and transitions

### 6.3 UX Requirements

- [ ] Intuitive user interactions
- [ ] Clear loading states
- [ ] Helpful error messages
- [ ] Success feedback
- [ ] Accessibility compliance

## 7. Authentication Strategy

### 7.1 Global Setup Integration

**File**: `__tests__/playwright/global.setup.ts`

- **Status**: ✅ Already implemented
- **Authentication**: Role 'user' dengan Clerk
- **Storage**: Auth state saved to `.clerk/user.json`
- **Reuse**: Auth state di-reuse oleh semua tests

### 7.2 Test Implementation

```typescript
// course-catalog.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Course Catalog Page', () => {
  test.beforeEach(async ({ page }) => {
    // Auth state sudah di-load dari global.setup.ts
    // Tidak perlu clean storage karena menggunakan role 'user' yang konsisten
    await page.goto('/course')
  })

  // Test cases...
})
```

## 8. Monitoring dan Maintenance

### 8.1 Continuous Monitoring

- Regular E2E test runs
- Performance monitoring
- Error rate tracking
- User experience validation

### 8.2 Maintenance Strategy

- Update tests when UI changes
- Update test data when API changes
- Monitor test performance
- Add new test scenarios as needed

## 9. Conclusion

E2E test plan ini telah disederhanakan dari 19 test cases menjadi 8 core test cases yang fokus pada enrollment functionality utama. Pendekatan ini:

1. **Mengikuti test-instruction** - "buatlah test yang tidak terlalu kompleks"
2. **Fokus pada core functionality** - enrollment, search, filter
3. **Realistic user scenarios** - dengan browser environment
4. **Maintainable** - mudah di-maintain dan update
5. **Integrated dengan existing setup** - menggunakan global.setup.ts untuk authentication

Implementasi E2E tests ini akan memastikan bahwa enrollment functionality yang diintegrasikan dengan hooks bekerja dengan baik dalam environment yang realistic tanpa kompleksitas yang berlebihan.
