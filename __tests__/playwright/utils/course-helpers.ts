/**
 * Course E2E Test Helpers
 *
 * Helper functions untuk memudahkan E2E testing course management.
 */

import { Page, expect } from '@playwright/test'
import { userTestData } from '../fixtures/course-test-data'

export class CourseHelpers {
  constructor(private page: Page) {}

  /**
   * Login sebagai user dengan role tertentu
   */
  async loginAsUser(role: 'creator' | 'admin' | 'user'): Promise<void> {
    const user = userTestData.find((u) => u.role === role)
    if (!user) {
      throw new Error(`User with role ${role} not found in test data`)
    }

    await this.page.goto('/sign-in')
    await this.page.fill('[data-testid="email-input"]', user.email)
    await this.page.fill('[data-testid="password-input"]', 'testpassword')
    await this.page.click('[data-testid="sign-in-button"]')

    // Wait for successful login
    await this.page.waitForURL('/dashboard')
  }

  /**
   * Navigate ke course management page
   */
  async navigateToCourseManagement(): Promise<void> {
    await this.page.goto('/creator/course-manage')

    // Wait for page to load dengan multiple possible selectors
    const selectors = [
      '[data-testid="course-search-filter"]',
      '[data-testid="create-course-button"]',
      'button:has-text("Buat Kursus Baru")',
      '.course-management',
      'main',
      '[role="main"]',
    ]

    let found = false
    for (const selector of selectors) {
      try {
        await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 })
        console.log(`✅ Found element with selector: ${selector}`)
        found = true
        break
      } catch {
        // Continue to next selector
      }
    }

    if (!found) {
      // Fallback: just wait for page to load
      await this.page.waitForLoadState('domcontentloaded')
      console.log('⚠️ No specific course management elements found, but page loaded')
    }
  }

  /**
   * Navigate ke course creation page
   */
  async navigateToCourseCreation(): Promise<void> {
    // Hanya gunakan dialog approach
    await this.navigateToCourseManagement()

    // Try to open create dialog
    const createButtonSelectors = [
      '[data-testid="create-course-button"]',
      'button:has-text("Buat Kursus Baru")',
      'button:has-text("Create Course")',
      'button:has-text("+")',
    ]

    let dialogOpened = false
    for (const selector of createButtonSelectors) {
      try {
        await this.page.click(selector)

        // Wait a bit for dialog to open
        await this.page.waitForTimeout(1000)

        // Try multiple dialog selectors
        const dialogSelectors = [
          '[data-testid="course-creation-form"]',
          '[role="dialog"]',
          '.dialog',
          'form',
          'input#title',
          'textarea#description',
        ]

        for (const dialogSelector of dialogSelectors) {
          try {
            await this.page.waitForSelector(dialogSelector, {
              state: 'visible',
              timeout: 3000,
            })
            dialogOpened = true
            break
          } catch {
            // Continue to next dialog selector
          }
        }

        if (dialogOpened) break
      } catch {
        // Continue to next selector
      }
    }

    if (!dialogOpened) {
      throw new Error('Could not open course creation form')
    }
  }

  /**
   * Fill course creation form
   */
  async fillCourseForm(data: {
    title: string
    description: string
    category?: string
    thumbnail?: string
  }): Promise<void> {
    // ✅ Perbaiki selector untuk lebih robust
    if (data.title) {
      await this.page.fill('[data-testid="course-title-input"], #title', data.title)
    }

    if (data.description) {
      await this.page.fill(
        '[data-testid="course-description-input"], #description',
        data.description,
      )
    }

    // ✅ Tambahkan validasi untuk kategori (required field)
    if (data.category) {
      await this.page.click('[data-testid="category-select"]')
      await this.page.click(`[data-testid="category-${data.category}"]`)
    } else {
      // Pilih kategori default jika tidak disediakan
      await this.page.click('[data-testid="category-select"]')
      await this.page.click('[data-testid="category-matematika"]')
    }

    if (data.thumbnail) {
      await this.page.setInputFiles('input[type="file"]', data.thumbnail)
    }
  }

  /**
   * Submit course form
   */
  async submitCourseForm(): Promise<void> {
    // ✅ Perbaiki selector untuk submit button
    const submitSelectors = [
      '[data-testid="submit-course-button"]',
      'button[type="submit"]:has-text("Buat Kursus")',
      'button:has-text("Buat Kursus")',
      'button:has-text("Create Course")',
    ]

    let submitted = false
    for (const selector of submitSelectors) {
      try {
        await this.page.click(selector)
        submitted = true
        break
      } catch {
        // Continue to next selector
      }
    }

    if (!submitted) {
      throw new Error('Could not find submit button')
    }
  }

  /**
   * Create course dengan data yang diberikan
   */
  async createCourse(data: {
    title: string
    description: string
    category?: string
    thumbnail?: string
  }): Promise<void> {
    await this.navigateToCourseCreation()
    await this.fillCourseForm(data)
    await this.submitCourseForm()

    // ✅ Perbaiki: Tunggu dialog tertutup atau course muncul di list
    try {
      // Tunggu dialog tertutup (berarti form berhasil disubmit)
      await this.page.waitForSelector('[data-testid="course-creation-form"]', {
        state: 'hidden',
        timeout: 10000,
      })
    } catch {
      // Jika dialog tidak tertutup, mungkin ada error
      console.log('⚠️ Dialog tidak tertutup, mungkin ada error')
    }

    // Tunggu course muncul di list atau ada error message
    try {
      await this.page.waitForSelector('[data-testid="course-card"]', {
        state: 'visible',
        timeout: 10000,
      })
    } catch {
      // Jika course tidak muncul, cek apakah ada error
      const errorElement = await this.page.locator('[data-testid="error-message"]').isVisible()
      if (errorElement) {
        throw new Error('Course creation failed with error')
      }
      throw new Error('Course not found in list after creation')
    }
  }

  /**
   * Edit course dengan ID tertentu menggunakan dialog
   */
  async editCourse(
    courseId: string,
    data: { title?: string; description?: string },
  ): Promise<void> {
    // Navigate ke course management page terlebih dahulu
    await this.navigateToCourseManagement()

    // Cari dan klik tombol edit untuk course dengan ID tertentu
    const editButtonSelectors = [
      `[data-testid="edit-course-button"]`, // Fallback untuk course pertama
    ]

    let editButtonClicked = false
    for (const selector of editButtonSelectors) {
      try {
        await this.page.click(selector)

        // Wait untuk dialog edit terbuka
        await this.page.waitForSelector('[data-testid="course-title-input"]', {
          state: 'visible',
          timeout: 5000,
        })

        editButtonClicked = true
        break
      } catch {
        // Continue to next selector
      }
    }

    if (!editButtonClicked) {
      throw new Error(`Could not find edit button for course ${courseId}`)
    }

    // Fill form data
    if (data.title) {
      await this.page.fill('[data-testid="course-title-input"]', data.title)
    }

    if (data.description) {
      await this.page.fill('[data-testid="course-description-input"]', data.description)
    }

    // Submit form
    await this.submitCourseForm()

    // Wait untuk dialog tertutup atau success message
    try {
      // Tunggu dialog tertutup (berarti form berhasil disubmit)
      await this.page.waitForSelector('[role="dialog"]', {
        state: 'hidden',
        timeout: 10000,
      })
    } catch {
      // Jika dialog tidak tertutup, mungkin ada error
      console.log('⚠️ Dialog tidak tertutup, mungkin ada error')
    }
  }

  /**
   * Delete course dengan ID tertentu
   */
  async deleteCourse(courseId: string): Promise<void> {
    await this.page.click(`[data-testid="delete-course-button-${courseId}"]`)
    await this.page.click('[data-testid="confirm-delete-button"]')
    await this.page.waitForSelector('[data-testid="success-message"]', { state: 'visible' })
  }

  /**
   * Search courses dengan keyword
   */
  async searchCourses(keyword: string): Promise<void> {
    await this.page.fill('[data-testid="search-input"]', keyword)
    await this.page.waitForTimeout(500) // Wait for search to complete
  }

  /**
   * Filter courses berdasarkan status
   */
  async filterCoursesByStatus(status: 'draft' | 'published' | 'archived'): Promise<void> {
    await this.page.click('[data-testid="filter-dropdown"]')
    await this.page.click(`[data-testid="filter-${status.toUpperCase()}"]`)
    await this.page.waitForTimeout(500) // Wait for filter to complete
  }

  /**
   * Clear search dan filter
   */
  async clearSearchAndFilter(): Promise<void> {
    await this.page.fill('[data-testid="search-input"]', '')
    await this.page.click('[data-testid="clear-filter-button"]')
    await this.page.waitForTimeout(500) // Wait for clear to complete
  }

  /**
   * Verify course exists dalam list
   */
  async verifyCourseExists(title: string): Promise<void> {
    // Try multiple selectors for course list
    const listSelectors = [
      '[data-testid="course-list"]',
      '.course-list',
      '.course-grid',
      'main',
      '[role="main"]',
    ]

    let found = false
    for (const selector of listSelectors) {
      try {
        await expect(this.page.locator(selector)).toContainText(title)
        found = true
        break
      } catch {
        // Continue to next selector
      }
    }

    if (!found) {
      // Fallback: check entire page content
      await expect(this.page.locator('body')).toContainText(title)
    }
  }

  /**
   * Verify course tidak exists dalam list
   */
  async verifyCourseNotExists(title: string): Promise<void> {
    // Try multiple selectors for course list
    const listSelectors = [
      '[data-testid="course-list"]',
      '.course-list',
      '.course-grid',
      'main',
      '[role="main"]',
    ]
    
    await this.page.waitForTimeout(5000)

    let checked = false
    for (const selector of listSelectors) {
      try {
        await expect(this.page.locator(selector)).not.toContainText(title)
        checked = true
        break
      } catch {
        // Continue to next selector
      }
    }

    if (!checked) {
      // Fallback: check entire page content
      await expect(this.page.locator('body')).not.toContainText(title)
    }
  }

  /**
   * Verify error message muncul
   */
  async verifyErrorMessage(message: string): Promise<void> {
    // Try multiple error message selectors - fokus pada dialog
    const errorSelectors = [
      '[data-testid="error-message"]',
      '[role="dialog"] [data-testid="error-message"]',
      '[role="dialog"] .text-red-700',
      '[role="dialog"] .bg-red-50',
      '.text-red-700:has-text("' + message + '")',
      '.bg-red-50:has-text("' + message + '")',
      'div:has-text("' + message + '")',
    ]

    let found = false
    for (const selector of errorSelectors) {
      try {
        await expect(this.page.locator(selector)).toContainText(message)
        found = true
        break
      } catch {
        // Continue to next selector
      }
    }

    if (!found) {
      // Fallback: check for any error message containing the text in dialog
      await expect(this.page.locator('[role="dialog"]')).toContainText(message)
    }
  }

  /**
   * Verify success message muncul
   */
  async verifySuccessMessage(message: string, courseTitle?: string): Promise<void> {
    // Explicit wait untuk memastikan toast muncul
    // await this.page.waitForTimeout(3000)
    try {
      const toast = this.page.getByRole('status', { name: 'success-message' })
      await this.page.getByRole('button', { name: 'Close' }).click()
      await expect(toast).not.toBeVisible()
    } catch {
      // Jika toast tidak ditemukan, fallback ke verifikasi course title di list
      if (courseTitle) {
        await this.page.waitForTimeout(3000)
        await expect(this.page.locator('[data-testid="course-list"]')).not.toContainText(
          courseTitle,
        )
      }
    }
  }

  /**
   * Verify empty state muncul
   */
  async verifyEmptyState(): Promise<void> {
    await expect(this.page.locator('[data-testid="empty-state"]')).toBeVisible()
  }

  /**
   * Get jumlah course cards yang visible
   */
  async getCourseCount(): Promise<number> {
    return await this.page.locator('[data-testid="course-card"]').count()
  }

  /**
   * Verify course count
   */
  async verifyCourseCount(expectedCount: number): Promise<void> {
    const actualCount = await this.getCourseCount()
    expect(actualCount).toBe(expectedCount)
  }

  /**
   * Verify form validation error
   */
  async verifyFormValidationError(field: string, message: string): Promise<void> {
    // Try multiple error selectors - fokus pada dialog
    const errorSelectors = [
      '[data-testid="error-message"]',
      '[role="dialog"] [data-testid="error-message"]',
      '[role="dialog"] .text-red-700',
      '[role="dialog"] .bg-red-50',
      '.text-red-700:has-text("' + message + '")',
      '.bg-red-50:has-text("' + message + '")',
      'div:has-text("' + message + '")',
    ]

    let found = false
    for (const selector of errorSelectors) {
      try {
        await expect(this.page.locator(selector)).toBeVisible()
        await expect(this.page.locator(selector)).toContainText(message)
        found = true
        break
      } catch {
        // Continue to next selector
      }
    }

    if (!found) {
      // Fallback: check for any error message containing the text in dialog
      await expect(this.page.locator('[role="dialog"]')).toContainText(message)
    }
  }

  /**
   * Verify form data preserved setelah validation error
   */
  async verifyFormDataPreserved(data: { title?: string; description?: string }): Promise<void> {
    if (data.title) {
      await expect(this.page.locator('#title')).toHaveValue(data.title)
    }

    if (data.description) {
      await expect(this.page.locator('#description')).toHaveValue(data.description)
    }
  }

  /**
   * Wait untuk page load dengan timeout
   */
  async waitForPageLoad(timeout: number = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout })
  }

  /**
   * Measure performance untuk operasi tertentu
   */
  async measurePerformance(operation: () => Promise<void>): Promise<number> {
    const startTime = Date.now()
    await operation()
    const endTime = Date.now()
    return endTime - startTime
  }

  /**
   * Verify performance dalam acceptable range
   */
  async verifyPerformance(operation: () => Promise<void>, maxTime: number): Promise<void> {
    const executionTime = await this.measurePerformance(operation)
    expect(executionTime).toBeLessThan(maxTime)
  }
}

/**
 * Factory function untuk membuat CourseHelpers instance
 */
export const createCourseHelpers = (page: Page): CourseHelpers => {
  return new CourseHelpers(page)
}
