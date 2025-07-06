/**
 * E2E Test: Course Search and Filter Functionality
 *
 * Test fitur pencarian dan filter untuk course management.
 * Mencakup berbagai skenario search dan filter.
 */

import { test, expect } from '@playwright/test'
import { loginWithRole } from '../utils/role-test-helpers'
import { createCourseHelpers } from '../utils/course-helpers'
import { waitForPageLoad } from '../utils/test-helpers'

test.describe('Course Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login dan navigate ke course management
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
    await page.goto('/creator/course-manage')
  })

  test('should filter courses by search term', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User enters search term in search box
    await courseHelpers.searchCourses('JavaScript')

    // Then: Course list is filtered based on search term
    await courseHelpers.verifyCourseCount(1)
    await expect(page.locator('[data-testid="course-title"]')).toContainText('JavaScript')
  })

  test('should show empty state when no search results', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User searches for non-existent course
    await courseHelpers.searchCourses('NonExistentCourse')

    // Then: Empty state message is displayed
    await courseHelpers.verifyEmptyState()
    await expect(page.locator('[data-testid="empty-state-message"]')).toContainText(
      'No courses found',
    )
  })

  test('should clear search results when search is cleared', async ({ page }) => {
    // Given: User has active search results
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.searchCourses('JavaScript')
    await courseHelpers.verifyCourseCount(1)

    // When: User clears search input
    await courseHelpers.clearSearchAndFilter()

    // Then: All courses are displayed again
    await courseHelpers.verifyCourseCount(5) // Assuming 5 total courses
  })

  test('should search by course title', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User searches by partial title
    await courseHelpers.searchCourses('React')

    // Then: Courses with "React" in title are displayed
    const courseCards = page.locator('[data-testid="course-card"]')
    await expect(courseCards).toHaveCount(2) // Assuming 2 React courses

    for (let i = 0; i < (await courseCards.count()); i++) {
      await expect(courseCards.nth(i).locator('[data-testid="course-title"]')).toContainText(
        'React',
      )
    }
  })

  test('should search by course description', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User searches by description keyword
    await courseHelpers.searchCourses('beginner')

    // Then: Courses with "beginner" in description are displayed
    await courseHelpers.verifyCourseCount(3) // Assuming 3 beginner courses
  })

  test('should handle case-insensitive search', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User searches with different cases
    await courseHelpers.searchCourses('javascript')

    // Then: Courses are found regardless of case
    await courseHelpers.verifyCourseCount(1)
    await expect(page.locator('[data-testid="course-title"]')).toContainText('JavaScript')
  })
})

test.describe('Course Filter Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login dan navigate ke course management
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
    await page.goto('/creator/course-manage')
  })

  test('should filter by draft status', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User selects "Draft" filter
    await courseHelpers.filterCoursesByStatus('draft')

    // Then: Only draft courses are displayed
    await courseHelpers.verifyCourseCount(2) // Assuming 2 draft courses

    const courseCards = page.locator('[data-testid="course-card"]')
    for (let i = 0; i < (await courseCards.count()); i++) {
      await expect(courseCards.nth(i).locator('[data-testid="course-status"]')).toContainText(
        'Draft',
      )
    }
  })

  test('should filter by published status', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User selects "Published" filter
    await courseHelpers.filterCoursesByStatus('published')

    // Then: Only published courses are displayed
    await courseHelpers.verifyCourseCount(3) // Assuming 3 published courses

    const courseCards = page.locator('[data-testid="course-card"]')
    for (let i = 0; i < (await courseCards.count()); i++) {
      await expect(courseCards.nth(i).locator('[data-testid="course-status"]')).toContainText(
        'Published',
      )
    }
  })

  test('should show all courses when no filter is applied', async ({ page }) => {
    // Given: User has active filter applied
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.filterCoursesByStatus('draft')
    await courseHelpers.verifyCourseCount(2)

    // When: User clears filter
    await courseHelpers.clearSearchAndFilter()

    // Then: All courses are displayed
    await courseHelpers.verifyCourseCount(5) // All 5 courses
  })

  test('should maintain filter state during navigation', async ({ page }) => {
    // Given: User has active filter applied
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.filterCoursesByStatus('draft')
    await courseHelpers.verifyCourseCount(2)

    // When: User navigates away and returns
    await page.goto('/dashboard')
    await page.goto('/creator/course-manage')

    // Then: Filter state is maintained
    await courseHelpers.verifyCourseCount(2)
    await expect(page.locator('[data-testid="active-filter"]')).toContainText('Draft')
  })

  test('should combine search and filter', async ({ page }) => {
    // Given: User is on course list page
    const courseHelpers = createCourseHelpers(page)
    await expect(page.locator('[data-testid="course-list"]')).toBeVisible()

    // When: User applies both search and filter
    await courseHelpers.searchCourses('React')
    await courseHelpers.filterCoursesByStatus('published')

    // Then: Results are filtered by both search and status
    await courseHelpers.verifyCourseCount(1) // 1 published React course

    const courseCards = page.locator('[data-testid="course-card"]')
    await expect(courseCards.first().locator('[data-testid="course-title"]')).toContainText('React')
    await expect(courseCards.first().locator('[data-testid="course-status"]')).toContainText(
      'Published',
    )
  })
})

test.describe('Course Search and Filter - Performance', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Login dan navigate ke course management
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
    await page.goto('/creator/course-manage')
  })

  test('should have fast search response time', async ({ page }) => {
    // Given: Course list has many courses
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.verifyCourseCount(5)

    // When: User performs search operation
    await courseHelpers.verifyPerformance(
      () => courseHelpers.searchCourses('JavaScript'),
      1000, // Less than 1 second
    )
  })

  test('should have fast filter response time', async ({ page }) => {
    // Given: Course list has many courses
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.verifyCourseCount(5)

    // When: User performs filter operation
    await courseHelpers.verifyPerformance(
      () => courseHelpers.filterCoursesByStatus('draft'),
      1000, // Less than 1 second
    )
  })

  test('should handle large dataset efficiently', async ({ page }) => {
    // Given: Course list has many courses (simulated)
    const courseHelpers = createCourseHelpers(page)
    // TODO: Setup test data with many courses

    // When: User performs search on large dataset
    await courseHelpers.verifyPerformance(
      () => courseHelpers.searchCourses('test'),
      2000, // Less than 2 seconds for large dataset
    )
  })
})
 