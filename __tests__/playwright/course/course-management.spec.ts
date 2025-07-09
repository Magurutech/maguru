/**
 * E2E Test: Course Management (Edit/Delete)
 *
 * Test editing dan deleting kursus existing. Mencakup berbagai role
 * dan skenario konfirmasi.
 */

import { test, expect } from '@playwright/test'
import { loginWithRole } from '../utils/role-test-helpers'
import { createCourseHelpers } from '../utils/course-helpers'
import { waitForPageLoad, takeScreenshot } from '../utils/test-helpers'

test.describe('Course Management - Edit Flow', () => {
  test.beforeEach(async ({ page }) => {
    // CRITICAL: Clean authentication state sebelum login
    await page.context().clearCookies()
    await page.context().clearPermissions()
    await page.goto('/')
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch {
      console.log('ℹ️ Could not clear localStorage (may be expected)')
    }
    // Setup: Login dan navigate ke course management
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
    // Buat course dummy via UI
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()
    await courseHelpers.createCourse({
      title: 'Dummy Course Title',
      description: 'Dummy description',
      category: 'matematika',
    })
  })

  test('should edit own course successfully', async ({ page }) => {
    // Given: Creator is on course list page
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()

    // When: Creator clicks edit button on own course
    await page.click('[data-testid="edit-course-button"]')

    // Then: Edit form opens with pre-filled data
    await expect(page.locator('[data-testid="course-title-input"]')).toHaveValue(
      'Dummy Course Title',
    )
    await expect(page.locator('[data-testid="course-description-input"]')).toHaveValue(
      'Dummy description',
    )
  })

  test('should update course successfully', async ({ page }) => {
    // Given: Creator is on course management page
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()

    // When: Creator clicks edit button and updates data
    await courseHelpers.editCourse('1', {
      title: 'Updated Course Title',
      description: 'Updated description',
    })

    // Then: Course is updated and changes are reflected
    await courseHelpers.verifySuccessMessage('Course updated successfully', 'Updated Course Title')
    await courseHelpers.verifyCourseExists('Updated Course Title')
    await takeScreenshot(page, 'course-update-success')
  })

  test('should allow admin to edit creator course', async ({ page }) => {
    // Given: Admin is on course list page
    await loginWithRole(page, 'admin')
    await waitForPageLoad(page)
    await page.goto('/creator/course-manage')

    // When: Admin clicks edit button on creator's course
    await page.click('[data-testid="edit-course-button"]')

    // Then: Edit form opens and admin can modify course
    await expect(page.locator('[data-testid="course-title-input"]')).toBeVisible()
    await expect(page.locator('[data-testid="course-description-input"]')).toBeVisible()
  })
})

test.describe('Course Management - Delete Flow', () => {
  test.beforeEach(async ({ page }) => {
    // CRITICAL: Clean authentication state sebelum login
    await page.context().clearCookies()
    await page.context().clearPermissions()
    await page.goto('/')
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch {
      console.log('ℹ️ Could not clear localStorage (may be expected)')
    }
    // Setup: Login dan navigate ke course management
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
    // Buat course dummy via UI
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()
    await courseHelpers.createCourse({
      title: 'Dummy Course Title',
      description: 'Dummy description',
      category: 'matematika',
    })
  })

  test('should show delete confirmation dialog', async ({ page }) => {
    // Given: User clicks delete button on course
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()
    await page.click('[data-testid="delete-course-button"]')

    // When: Confirmation dialog appears
    // Then: User can cancel or confirm deletion
    await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).toBeVisible()
    await expect(page.locator('[data-testid="confirm-delete-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="cancel-delete-button"]')).toBeVisible()
  })

  test('should delete course when confirmed', async ({ page }) => {
    // Given: Creator is on course list page
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()

    // Create a unique course title for this test
    const uniqueCourseTitle = `Test Course Delete ${Date.now()}`

    // Create a new course specifically for this test
    await courseHelpers.createCourse({
      title: uniqueCourseTitle,
      description: 'Course to be deleted',
      category: 'matematika',
    })

    // When: Creator clicks delete button and confirms
    await page.click('[data-testid="delete-course-button"]')
    await page.click('[data-testid="confirm-delete-button"]')

    // Then: Course is deleted from list
    await page.waitForTimeout(8000)
    await expect(page.locator('[data-testid="course-list"]')).not.toContainText(uniqueCourseTitle)
    await courseHelpers.verifySuccessMessage('Course deleted successfully', uniqueCourseTitle)
  })

  test('should cancel deletion when user cancels', async ({ page }) => {
    // Given: User clicks delete button on course
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()
    const courseTitle = await page.locator('[data-testid="course-title"]').first().textContent()

    // When: User cancels deletion
    await page.click('[data-testid="delete-course-button"]')
    await page.click('[data-testid="cancel-delete-button"]')

    // Then: Course remains in list
    if (courseTitle) {
      await expect(page.locator('[data-testid="course-list"]')).toContainText(courseTitle)
    }
    await expect(page.locator('[data-testid="delete-confirmation-dialog"]')).not.toBeVisible()
  })
})

test.describe('Course Management - Validation', () => {
  test.beforeEach(async ({ page }) => {
    // CRITICAL: Clean authentication state sebelum login
    await page.context().clearCookies()
    await page.context().clearPermissions()
    await page.goto('/')
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch {
      console.log('ℹ️ Could not clear localStorage (may be expected)')
    }
    // Setup: Login dan navigate ke course management
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
  })

  test('should preserve form data on validation error', async ({ page }) => {
    // Given: Creator is on course management page and opens edit dialog
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()
    await page.click('[data-testid="edit-course-button"]')

    // When: Creator enters invalid data and submits
    await page.fill('[data-testid="course-title-input"]', 'AB')
    await page.fill('[data-testid="course-description-input"]', 'Valid description')
    await page.click('[data-testid="submit-course-button"]')

    // Then: Form data is preserved
    await courseHelpers.verifyFormDataPreserved({
      title: 'AB',
      description: 'Valid description',
    })
  })
})
