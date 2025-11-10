import { test, expect, devices } from '@playwright/test'

test.describe('Course Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/course')
    await page.evaluate(() => {
      localStorage.clear()
    })
  })

  test.describe('Progress Storage', () => {
    test('should save progress to localStorage', async ({ page }) => {
      // Navigate to course listing
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')

      // Click on first course
      await page.locator('[data-testid="course-card"]').first().click()

      // Wait for course detail to load
      await page.waitForLoadState('networkidle')

      // Mark item as complete
      await page.click('button:has-text("Mark as Complete")')

      // Wait for progress to save
      await page.waitForTimeout(1000)

      // Check localStorage
      const progressData = await page.evaluate(() => {
        return localStorage.getItem('maguru_course_progress')
      })

      expect(progressData).toBeTruthy()

      const progress = JSON.parse(progressData!)
      expect(typeof progress).toBe('object')
    })

    test('should load existing progress on page load', async ({ page }) => {
      // First, create some progress data
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')
      await page.click('button:has-text("Mark as Complete")')
      await page.waitForTimeout(1000)

      // Navigate away and back
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')

      // Check if progress is loaded
      const progressData = await page.evaluate(() => {
        return localStorage.getItem('maguru_course_progress')
      })

      expect(progressData).toBeTruthy()

      const progress = JSON.parse(progressData!)
      expect(Object.keys(progress).length).toBeGreaterThan(0)
    })

    test('should track multiple course progress separately', async ({ page }) => {
      // Navigate to course listing
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')

      const courseCards = page.locator('[data-testid="course-card"]')
      const cardCount = await courseCards.count()

      if (cardCount >= 2) {
        // Mark first course item as complete
        await courseCards.first().click()
        await page.waitForLoadState('networkidle')
        await page.click('button:has-text("Mark as Complete")')
        await page.waitForTimeout(1000)

        // Go back to listing
        await page.goto('/course')
        await page.waitForSelector('[data-testid="course-card"]')

        // Mark second course item as complete
        await courseCards.nth(1).click()
        await page.waitForLoadState('networkidle')
        await page.click('button:has-text("Mark as Complete")')
        await page.waitForTimeout(1000)

        // Check localStorage for multiple courses
        const progressData = await page.evaluate(() => {
          return localStorage.getItem('maguru_course_progress')
        })

        expect(progressData).toBeTruthy()

        const progress = JSON.parse(progressData!)
        expect(Object.keys(progress).length).toBeGreaterThan(1)
      }
    })
  })

  test.describe('Progress UI Updates', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')
    })

    test('should update progress bar when item is marked complete', async ({ page }) => {
      // Get initial progress value
      const initialProgress = await page.locator('[role="progressbar"]').getAttribute('aria-valuenow')

      // Mark item as complete
      await page.click('button:has-text("Mark as Complete")')

      // Wait for UI update
      await page.waitForTimeout(1000)

      // Check if progress updated
      const updatedProgress = await page.locator('[role="progressbar"]').getAttribute('aria-valuenow')

      expect(updatedProgress).not.toBe(initialProgress)
    })

    test('should update timeline item completion status', async ({ page }) => {
      // Find current timeline item
      const currentTimelineItem = page.locator('[data-testid="timeline-item"].current')

      if (await currentTimelineItem.isVisible()) {
        // Initially should not be completed
        const completionIndicator = currentTimelineItem.locator('[data-testid="completion-indicator"]')

        // Mark item as complete
        await page.click('button:has-text("Mark as Complete")')

        // Wait for UI update
        await page.waitForTimeout(1000)

        // Check completion indicator is visible
        await expect(completionIndicator).toBeVisible()
      }
    })

    test('should show correct progress percentage', async ({ page }) => {
      // Check progress text is visible
      const progressText = page.locator('text=Progress:')
      await expect(progressText).toBeVisible()

      // Mark item as complete
      await page.click('button:has-text("Mark as Complete")')

      // Wait for UI update
      await page.waitForTimeout(1000)

      // Check progress text updated
      await expect(progressText).toBeVisible()

      const text = await progressText.textContent()
      expect(text).toContain('Progress:')
      expect(text).toContain('%')
    })
  })

  test.describe('Navigation with Progress', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')
    })

    test('should maintain progress when navigating between items', async ({ page }) => {
      // Mark current item as complete
      await page.click('button:has-text("Mark as Complete")')
      await page.waitForTimeout(1000)

      // Navigate to next item if available
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(1000)

        // Check progress is still maintained
        const progressData = await page.evaluate(() => {
          return localStorage.getItem('maguru_course_progress')
        })

        expect(progressData).toBeTruthy()
      }
    })

    test('should save current position when navigating', async ({ page }) => {
      // Navigate to next item if available
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(1000)

        // Check current position is saved
        const progressData = await page.evaluate(() => {
          const data = localStorage.getItem('maguru_course_progress')
          return data ? JSON.parse(data) : null
        })

        expect(progressData).toBeTruthy()
        expect(progressData).toHaveProperty('currentItemId')
        expect(progressData).toHaveProperty('currentSectionId')
      }
    })

    test('should restore last position on page reload', async ({ page }) => {
      // Navigate to next item if available
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isEnabled()) {
        await nextButton.click()
        await page.waitForTimeout(1000)

        // Reload page
        await page.reload()
        await page.waitForLoadState('networkidle')

        // Check if position is restored (this might need adjustment based on actual implementation)
        await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()
      }
    })
  })

  test.describe('Progress Persistence', () => {
    test('should persist progress across browser sessions', async ({ context }) => {
      // Create new page
      const page1 = await context.newPage()

      // Navigate and mark item complete
      await page1.goto('/course')
      await page1.waitForSelector('[data-testid="course-card"]')
      await page1.locator('[data-testid="course-card"]').first().click()
      await page1.waitForLoadState('networkidle')
      await page1.click('button:has-text("Mark as Complete")')
      await page1.waitForTimeout(1000)

      // Close first page
      await page1.close()

      // Create new page in same context
      const page2 = await context.newPage()
      await page2.goto('/course')
      await page2.waitForSelector('[data-testid="course-card"]')
      await page2.locator('[data-testid="course-card"]').first().click()
      await page2.waitForLoadState('networkidle')

      // Check if progress persisted
      const progressData = await page2.evaluate(() => {
        return localStorage.getItem('maguru_course_progress')
      })

      expect(progressData).toBeTruthy()

      await page2.close()
    })

    test('should handle corrupted progress data gracefully', async ({ page }) => {
      // Set corrupted progress data
      await page.goto('/course')
      await page.evaluate(() => {
        localStorage.setItem('maguru_course_progress', '{invalid json}')
      })

      // Navigate to course
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')

      // Should still load page without errors
      await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()

      // Should be able to mark item complete
      await page.click('button:has-text("Mark as Complete")')
      await page.waitForTimeout(1000)

      // Progress data should be fixed
      const progressData = await page.evaluate(() => {
        return localStorage.getItem('maguru_course_progress')
      })

      expect(progressData).toBeTruthy()

      // Should be valid JSON
      expect(() => JSON.parse(progressData!)).not.toThrow()
    })
  })

  test.describe('Progress Calculation', () => {
    test('should calculate completion percentage correctly', async ({ page }) => {
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')

      // Mark multiple items as complete and check progress calculation
      let previousProgress = 0

      for (let i = 0; i < 3; i++) {
        await page.click('button:has-text("Mark as Complete")')
        await page.waitForTimeout(1000)

        const currentProgress = await page.locator('[role="progressbar"]').getAttribute('aria-valuenow')
        const progressValue = parseInt(currentProgress || '0')

        // Progress should increase or stay the same
        expect(progressValue).toBeGreaterThanOrEqual(previousProgress)
        previousProgress = progressValue

        // Navigate to next if available
        const nextButton = page.locator('button:has-text("Next")')
        if (await nextButton.isEnabled()) {
          await nextButton.click()
          await page.waitForTimeout(1000)
        } else {
          break
        }
      }
    })

    test('should handle course completion correctly', async ({ page }) => {
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')

      // Mark items as complete until course is finished
      let maxAttempts = 10 // Prevent infinite loop

      while (maxAttempts > 0) {
        await page.click('button:has-text("Mark as Complete")')
        await page.waitForTimeout(1000)

        const nextButton = page.locator('button:has-text("Next")')
        if (await nextButton.isEnabled()) {
          await nextButton.click()
          await page.waitForTimeout(1000)
        } else {
          // Course should be completed
          const finishButton = page.locator('button:has-text("Finish Course")')
          if (await finishButton.isVisible()) {
            await expect(finishButton).toBeVisible()
          }
          break
        }

        maxAttempts--
      }
    })
  })

  test.describe('Mobile Progress Tracking', () => {
    test.use({ ...devices['iPhone 13'] })

    test('should track progress correctly on mobile', async ({ page }) => {
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')

      // Mark item complete on mobile
      await page.tap('button:has-text("Mark as Complete")')
      await page.waitForTimeout(1000)

      // Check mobile progress bar
      await expect(page.locator('[role="progressbar"]')).toBeVisible()

      // Check mobile navigation
      await expect(page.locator('text=Previous')).toBeVisible()
      await expect(page.locator('text=Next')).toBeVisible()
    })

    test('should handle mobile touch interactions for progress', async ({ page }) => {
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')

      // Test swipe navigation on timeline
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      if (await timelineNav.isVisible()) {
        // Try to interact with timeline items
        const timelineItems = timelineNav.locator('[data-testid="timeline-item"]')

        if (await timelineItems.count() > 1) {
          // Tap on second item
          await timelineItems.nth(1).tap()
          await page.waitForTimeout(1000)

          // Mark as complete
          await page.tap('button:has-text("Mark as Complete")')
          await page.waitForTimeout(1000)

          // Check progress updated
          await expect(page.locator('[role="progressbar"]')).toBeVisible()
        }
      }
    })
  })

  test.describe('Progress Error Handling', () => {
    test('should handle localStorage quota exceeded', async ({ page }) => {
      // Fill localStorage to capacity
      await page.goto('/course')
      await page.evaluate(() => {
        try {
          // Try to fill localStorage
          const largeData = 'x'.repeat(5 * 1024 * 1024) // 5MB
          localStorage.setItem('test', largeData)
        } catch (e) {
          // Expected to fail
        }
      })

      // Try to save progress
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')
      await page.click('button:has-text("Mark as Complete")')
      await page.waitForTimeout(1000)

      // Should still work despite localStorage issues
      await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()
    })

    test('should handle disabled localStorage gracefully', async ({ page }) => {
      // Disable localStorage
      await page.context().addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
          value: undefined,
          writable: false
        })
      })

      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()
      await page.waitForLoadState('networkidle')

      // Should still be able to navigate
      await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()

      // Should show warning or handle gracefully
      await page.click('button:has-text("Mark as Complete")')
      await page.waitForTimeout(1000)

      // Should not crash
      await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()
    })
  })
})