import { test, expect } from '@playwright/test'
import { loginWithRole } from '../utils/role-test-helpers'
import { createCourseHelpers } from '../utils/course-helpers'
import { waitForPageLoad } from '../utils/test-helpers'

test.describe('Course Search & Filter', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
    await page.context().clearPermissions()
    await page.goto('/')
    try {
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    } catch {}
    await loginWithRole(page, 'creator')
    await waitForPageLoad(page)
    // Buat beberapa course untuk testing
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()
    await courseHelpers.createCourse({
      title: 'Searchable Course 1',
      description: 'Desc 1',
      category: 'matematika',
    })
    await courseHelpers.createCourse({
      title: 'Searchable Course 2',
      description: 'Desc 2',
      category: 'matematika',
    })
    await courseHelpers.createCourse({
      title: 'Unique Course X',
      description: 'Desc X',
      category: 'matematika',
    })
  })

  test('should filter course by title (positive)', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'Unique Course X')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="course-list"]')).toContainText('Unique Course X')
    await expect(page.locator('[data-testid="course-list"]')).not.toContainText(
      'Searchable Course 1',
    )
  })

  test('should show empty state for unmatched search', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'Nonexistent Course')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible()
  })

  test('should clear search and show all courses', async ({ page }) => {
    await page.fill('[data-testid="search-input"]', 'Unique Course X')
    await page.waitForTimeout(1000)
    await page.fill('[data-testid="search-input"]', '')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="course-list"]')).toContainText('Searchable Course 1')
    await expect(page.locator('[data-testid="course-list"]')).toContainText('Unique Course X')
  })

  test('should filter by status Draft', async ({ page }) => {
    await page.click('[data-testid="filter-dropdown"]')
    await page.click('[data-testid="filter-draft"]')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="course-list"]')).toContainText('Searchable Course 1')
  })

  test('should filter by status Published (empty)', async ({ page }) => {
    await page.click('[data-testid="filter-dropdown"]')
    await page.click('[data-testid="filter-published"]')
    await page.waitForTimeout(1000)
    await expect(page.locator('[data-testid="empty-state"]')).toBeVisible()
  })

  test('should clear filter and show all courses', async ({ page }) => {
    const courseHelpers = createCourseHelpers(page)
    await courseHelpers.navigateToCourseManagement()

    // Buat dua course unik
    const courseTitle1 = `Searchable Course 1 ${Date.now()}`
    const courseTitle2 = `Unique Course X ${Date.now()}`
    await courseHelpers.createCourse({
      title: courseTitle1,
      description: 'desc 1',
      category: 'matematika',
    })
    await courseHelpers.createCourse({
      title: courseTitle2,
      description: 'desc 2',
      category: 'matematika',
    })

    // Debug: Pastikan kedua course muncul sebelum filter/clear
    await expect(page.locator('[data-testid="course-list"]')).toContainText(courseTitle1)
    await expect(page.locator('[data-testid="course-list"]')).toContainText(courseTitle2)

    // Filter draft
    await page.click('[data-testid="filter-dropdown"]')
    await page.click('[data-testid="filter-draft"]')
    await page.waitForTimeout(1000)
    // Clear filter
    await page.click('[data-testid="clear-filter-button"]')
    await page.waitForTimeout(1000)
    // Tunggu sampai kedua course muncul
    await expect(page.locator('[data-testid="course-list"]')).toContainText(courseTitle1)
    await expect(page.locator('[data-testid="course-list"]')).toContainText(courseTitle2)
  })
})
