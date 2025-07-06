/**
 * E2E Test: Course Creation Flow
 *
 * Test complete user journey untuk membuat kursus baru dari login hingga
 * kursus muncul di daftar. Menggunakan pendekatan BDD dengan format Given-When-Then.
 */

import { test, expect } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { loginWithRole } from '../utils/role-test-helpers'
import { createCourseHelpers } from '../utils/course-helpers'
import { waitForPageLoad, takeScreenshot } from '../utils/test-helpers'
import { invalidCourseData } from '../fixtures/course-test-data'

test.describe('Course Creation - Creator Flow', () => {
  test.beforeEach(async ({ page }) => {
    // CRITICAL: Clean authentication state sebelum login
    await setupClerkTestingToken({ page })
    await page.context().clearCookies()
    await page.context().clearPermissions()

    // Navigate to homepage first untuk avoid localStorage SecurityError
    await page.goto('/')

    // Clear localStorage setelah page loaded
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch {
      console.log('ℹ️ Could not clear localStorage (may be expected)')
    }

    // Setup: Login sebagai creator menggunakan role-test-helpers
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
  })

  test('should create new course successfully', async ({ page }) => {
    // Given: Creator is logged in and on course management page
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()

    // When: Creator creates course with valid data
    await courseHelpers.createCourse({
      title: 'Test Course Title',
      description: 'Test course description',
    })

    // Then: Course is created and appears in course list
    await courseHelpers.verifyCourseExists('Test Course Title')
    await courseHelpers.verifySuccessMessage('Course created successfully')
    await takeScreenshot(page, 'course-creation-success')
  })

  test('should show validation error for empty title', async ({ page }) => {
    // Given: Creator is on course creation form
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseCreation()

    // When: Creator submits form with empty title
    await courseHelpers.fillCourseForm(invalidCourseData.emptyTitle)
    await courseHelpers.submitCourseForm()

    // Then: Error message is displayed for title field
    await courseHelpers.verifyFormValidationError('title', 'Title is required')
  })

  test('should show validation error for short title', async ({ page }) => {
    // Given: Creator is on course creation form
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseCreation()

    // When: Creator submits form with title less than 3 characters
    await courseHelpers.fillCourseForm(invalidCourseData.shortTitle)
    await courseHelpers.submitCourseForm()

    // Then: Error message is displayed for title validation
    await courseHelpers.verifyFormValidationError('title', 'Title must be at least 3 characters')
  })

  test('should show validation error for empty description', async ({ page }) => {
    // Given: Creator is on course creation form
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseCreation()

    // When: Creator submits form with empty description
    await courseHelpers.fillCourseForm(invalidCourseData.emptyDescription)
    await courseHelpers.submitCourseForm()

    // Then: Error message is displayed for description field
    await courseHelpers.verifyFormValidationError('description', 'Description is required')
  })
})

test.describe('Course Creation - Admin Flow', () => {
  test.beforeEach(async ({ page }) => {
    // CRITICAL: Clean authentication state sebelum login
    await setupClerkTestingToken({ page })
    await page.context().clearCookies()
    await page.context().clearPermissions()

    // Navigate to homepage first untuk avoid localStorage SecurityError
    await page.goto('/')

    // Clear localStorage setelah page loaded
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch {
      console.log('ℹ️ Could not clear localStorage (may be expected)')
    }

    // Setup: Login sebagai admin menggunakan role-test-helpers
    await loginWithRole(page, 'admin')
    await waitForPageLoad(page)
  })

  test('should create course successfully as admin', async ({ page }) => {
    // Given: Admin is logged in and on course management page
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()

    // When: Admin creates course with valid data
    await courseHelpers.createCourse({
      title: 'Admin Course Title',
      description: 'Admin course description',
    })

    // Then: Course is created with admin as owner
    await courseHelpers.verifyCourseExists('Admin Course Title')
    await courseHelpers.verifySuccessMessage('Course created successfully')
    await takeScreenshot(page, 'admin-course-creation-success')
  })
})

test.describe('Course Creation - Error Scenarios', () => {
  test.beforeEach(async ({ page }) => {
    // CRITICAL: Clean authentication state sebelum login
    await setupClerkTestingToken({ page })
    await page.context().clearCookies()
    await page.context().clearPermissions()

    // Navigate to homepage first untuk avoid localStorage SecurityError
    await page.goto('/')

    // Clear localStorage setelah page loaded
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch {
      console.log('ℹ️ Could not clear localStorage (may be expected)')
    }

    // Setup: Login sebagai creator menggunakan role-test-helpers
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
  })

  test('should handle server error during submission', async ({ page }) => {
    // Given: Creator is on course creation form
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseCreation()

    // When: Server returns error during submission
    // TODO: Mock server error response using page.route()
    await page.route('/api/courses', (route) => {
      route.fulfill({ status: 500, body: 'Server Error' })
    })

    await courseHelpers.fillCourseForm({
      title: 'Test Course Title',
      description: 'Test description',
    })
    await courseHelpers.submitCourseForm()

    // Then: Error message with retry option is displayed
    await courseHelpers.verifyErrorMessage('Server error occurred')
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible()
  })

  test('should handle network timeout', async ({ page }) => {
    // Given: Creator is on course creation form
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseCreation()

    // When: Request times out during submission
    // TODO: Mock timeout response using page.route()
    await page.route('/api/courses', (route) => {
      route.abort('timedout')
    })

    await courseHelpers.fillCourseForm({
      title: 'Test Course Title',
      description: 'Test description',
    })
    await courseHelpers.submitCourseForm()

    // Then: Timeout error message is displayed
    await courseHelpers.verifyErrorMessage('Request timeout')
  })
})
