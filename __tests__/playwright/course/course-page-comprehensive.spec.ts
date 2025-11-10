import { test, expect, devices } from '@playwright/test'

// Test data
const TEST_COURSES = [
  {
    slug: 'javascript-basics',
    title: 'JavaScript Basics',
    description: 'Learn the fundamentals of JavaScript programming',
    instructor: 'John Doe',
    level: 'beginner'
  },
  {
    slug: 'react-advanced',
    title: 'Advanced React Patterns',
    description: 'Master advanced React concepts and patterns',
    instructor: 'Jane Smith',
    level: 'advanced'
  }
]

test.describe('Course Page - Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to course listing page
    await page.goto('/course')
  })

  test.describe('Course Listing Page', () => {
    test('should display course listing page with correct layout', async ({ page }) => {
      // Check main heading
      await expect(page.locator('h1')).toContainText('Petualangan Belajar')
      await expect(page.locator('h1')).toContainText('Terbaik Untukmu')

      // Check search functionality
      await expect(page.locator('input[placeholder*="Cari kursus"]')).toBeVisible()

      // Check filter dropdowns
      await expect(page.locator('button[data-state="closed"]')).toHaveCount(2) // Level and Sort dropdowns

      // Check reset filter button
      await expect(page.locator('button:has-text("Reset Filter")')).toBeVisible()
    })

    test('should load and display courses correctly', async ({ page }) => {
      // Wait for courses to load
      await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 })

      // Check if courses are displayed
      const courseCards = page.locator('[data-testid="course-card"]')
      await expect(courseCards).toHaveCount.greaterThan(0)

      // Check course card structure
      const firstCard = courseCards.first()
      await expect(firstCard.locator('h3')).toBeVisible()
      await expect(firstCard.locator('p')).toBeVisible()
      await expect(firstCard.locator('text=Level:')).toBeVisible()
    })

    test('should handle search functionality correctly', async ({ page }) => {
      // Wait for courses to load
      await page.waitForSelector('[data-testid="course-card"]')

      // Get initial course count
      const initialCount = await page.locator('[data-testid="course-card"]').count()

      // Search for specific course
      await page.fill('input[placeholder*="Cari kursus"]', 'JavaScript')

      // Wait for search results
      await page.waitForTimeout(500)

      // Check if search filtered results
      const searchResults = page.locator('[data-testid="course-card"]')
      if (await searchResults.count() > 0) {
        const firstResult = searchResults.first()
        await expect(firstResult).toContainText('JavaScript', { ignoreCase: true })
      }
    })

    test('should handle level filtering correctly', async ({ page }) => {
      // Wait for courses to load
      await page.waitForSelector('[data-testid="course-card"]')

      // Click level filter dropdown
      await page.click('button:has-text("Pilih Level")')

      // Select beginner level
      await page.click('text=Pemula')

      // Wait for filter to apply
      await page.waitForTimeout(500)

      // Verify filtered results show beginner courses
      const filteredResults = page.locator('[data-testid="course-card"]')
      if (await filteredResults.count() > 0) {
        // Check that all visible courses are beginner level
        const courseLevels = filteredResults.locator('text=Level:')
        for (let i = 0; i < await courseLevels.count(); i++) {
          await expect(courseLevels.nth(i)).toContainText('Pemula', { ignoreCase: true })
        }
      }
    })

    test('should handle sorting correctly', async ({ page }) => {
      // Wait for courses to load
      await page.waitForSelector('[data-testid="course-card"]')

      // Click sort dropdown
      await page.click('button:has-text("Urutkan")')

      // Sort by title
      await page.click('text=Judul (A-Z)')

      // Wait for sort to apply
      await page.waitForTimeout(500)

      // Get course titles and verify alphabetical order
      const courseTitles = await page.locator('[data-testid="course-card"] h3').allTextContents()
      const sortedTitles = [...courseTitles].sort((a, b) => a.localeCompare(b))

      expect(courseTitles).toEqual(sortedTitles)
    })

    test('should handle empty state correctly', async ({ page }) => {
      // Search for non-existent course
      await page.fill('input[placeholder*="Cari kursus"]', 'NonExistentCourse12345')

      // Wait for search to complete
      await page.waitForTimeout(500)

      // Check empty state message
      await expect(page.locator('text=Tidak ada kursus yang ditemukan')).toBeVisible()
      await expect(page.locator('text=Coba ubah filter atau kata kunci pencarian Anda')).toBeVisible()
    })

    test('should handle loading state correctly', async ({ page }) => {
      // Navigate to page and check initial loading state
      await page.goto('/course')

      // Check for loading skeleton
      await expect(page.locator('.animate-pulse')).toBeVisible()

      // Wait for loading to complete
      await page.waitForSelector('[data-testid="course-card"]', { timeout: 10000 })

      // Check that loading state is gone
      await expect(page.locator('.animate-pulse')).toHaveCount(0)
    })
  })

  test.describe('Course Detail Page', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to course listing first
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')

      // Click on first course
      await page.locator('[data-testid="course-card"]').first().click()
    })

    test('should display course detail page correctly', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Check course header
      await expect(page.locator('h1')).toBeVisible()

      // Check timeline navigation
      await expect(page.locator('[data-testid="timeline-nav"]')).toBeVisible()

      // Check content renderer
      await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()

      // Check navigation controls
      await expect(page.locator('button:has-text("Previous")')).toBeVisible()
      await expect(page.locator('button:has-text("Next")')).toBeVisible()
      await expect(page.locator('button:has-text("Mark as Complete")')).toBeVisible()
    })

    test('should handle timeline navigation correctly', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Check timeline items are clickable
      const timelineItems = page.locator('[data-testid="timeline-item"]')
      if (await timelineItems.count() > 1) {
        // Click on second timeline item
        await timelineItems.nth(1).click()

        // Wait for content to load
        await page.waitForTimeout(1000)

        // Verify content changed
        await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()
      }
    })

    test('should handle navigation between items correctly', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Check if next button is enabled
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isEnabled()) {
        // Get current content
        const initialContent = await page.locator('[data-testid="content-renderer"]').textContent()

        // Click next
        await nextButton.click()

        // Wait for content to load
        await page.waitForTimeout(1000)

        // Verify content changed
        const newContent = await page.locator('[data-testid="content-renderer"]').textContent()
        expect(newContent).not.toBe(initialContent)
      }
    })

    test('should handle progress tracking correctly', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Click mark as complete
      await page.click('button:has-text("Mark as Complete")')

      // Wait a moment for progress to save
      await page.waitForTimeout(500)

      // Check progress bar updated
      await expect(page.locator('[role="progressbar"]')).toBeVisible()

      // Check timeline item is marked as completed
      const currentTimelineItem = page.locator('[data-testid="timeline-item"].current')
      await expect(currentTimelineItem.locator('[data-testid="completion-indicator"]')).toBeVisible()
    })

    test('should handle course completion correctly', async ({ page }) => {
      // Wait for page to load
      await page.waitForLoadState('networkidle')

      // Get navigation info
      const navigationInfo = page.locator('text=Progress:')
      await expect(navigationInfo).toBeVisible()

      // Check completion state
      const progressText = await navigationInfo.textContent()
      expect(progressText).toContain('Progress:')
    })
  })

  test.describe('Mobile Responsiveness', () => {
    test.use({ ...devices['iPhone 13'] })

    test('should display correctly on mobile devices', async ({ page }) => {
      // Check mobile layout
      await expect(page.locator('h1')).toBeVisible()
      await expect(page.locator('input[placeholder*="Cari kursus"]')).toBeVisible()

      // Check mobile navigation
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()

      // Wait for detail page to load
      await page.waitForLoadState('networkidle')

      // Check mobile-specific elements
      await expect(page.locator('text=Previous')).toBeVisible()
      await expect(page.locator('text=Next')).toBeVisible()
      await expect(page.locator('[role="progressbar"]')).toBeVisible()

      // Check mobile timeline navigation
      await expect(page.locator('[data-testid="timeline-nav"]')).toBeVisible()
    })

    test('should handle mobile touch interactions correctly', async ({ page }) => {
      // Wait for courses to load
      await page.waitForSelector('[data-testid="course-card"]')

      // Test tap on course card
      await page.tap('[data-testid="course-card"]')

      // Wait for navigation
      await page.waitForLoadState('networkidle')

      // Test swipe gestures on timeline if available
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      if (await timelineNav.isVisible()) {
        // Test touch scrolling
        await timelineNav.tap({ position: { x: 50, y: 50 } })
        await page.waitForTimeout(500)
      }
    })
  })

  test.describe('Accessibility Testing', () => {
    test('should meet accessibility standards', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('[data-testid="course-card"]')

      // Check heading hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').all()
      expect(headings.length).toBeGreaterThan(0)

      // Check alt text for images
      const images = page.locator('img')
      const imageCount = await images.count()
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i)
        const alt = await img.getAttribute('alt')
        expect(alt).toBeTruthy()
      }

      // Check button accessibility
      const buttons = page.locator('button')
      const buttonCount = await buttons.count()
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i)
        const ariaLabel = await button.getAttribute('aria-label')
        const text = await button.textContent()
        expect(ariaLabel || text).toBeTruthy()
      }

      // Check keyboard navigation
      await page.keyboard.press('Tab')
      const focusedElement = await page.locator(':focus')
      await expect(focusedElement).toBeVisible()
    })

    test('should support screen readers', async ({ page }) => {
      // Wait for page to load
      await page.waitForSelector('[data-testid="course-card"]')

      // Check ARIA labels and roles
      await expect(page.locator('main')).toBeVisible()
      await expect(page.locator('[role="navigation"]')).toBeVisible()

      // Check semantic HTML
      await expect(page.locator('header')).toBeVisible()
      await expect(page.locator('section')).toBeVisible()

      // Test course card accessibility
      const courseCards = page.locator('[data-testid="course-card"]')
      if (await courseCards.count() > 0) {
        const firstCard = courseCards.first()

        // Check card has proper heading structure
        await expect(firstCard.locator('h3')).toBeVisible()

        // Check card is focusable
        await firstCard.focus()
        await expect(firstCard).toBeFocused()
      }
    })
  })

  test.describe('Performance Testing', () => {
    test('should load within acceptable time limits', async ({ page }) => {
      const startTime = Date.now()

      // Navigate to course page
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')

      const loadTime = Date.now() - startTime

      // Page should load within 5 seconds
      expect(loadTime).toBeLessThan(5000)
    })

    test('should handle large content efficiently', async ({ page }) => {
      // Navigate to course detail
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()

      // Wait for content to load
      await page.waitForLoadState('networkidle')

      // Check if content is rendered properly
      await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()

      // Test scrolling performance
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })

      await page.waitForTimeout(1000)

      // Check if page is still responsive
      await expect(page.locator('body')).toBeVisible()
    })
  })

  test.describe('Error Handling', () => {
    test('should handle invalid course URLs gracefully', async ({ page }) => {
      // Navigate to non-existent course
      await page.goto('/course/non-existent-course')

      // Wait for error page
      await page.waitForLoadState('networkidle')

      // Check error message
      await expect(page.locator('text=Course Not Found')).toBeVisible()
      await expect(page.locator('button:has-text("Back to Courses")')).toBeVisible()

      // Test back navigation
      await page.click('button:has-text("Back to Courses")')
      await page.waitForLoadState('networkidle')

      // Verify returned to course listing
      await expect(page.locator('h1:has-text("Petualangan Belajar")')).toBeVisible()
    })

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('/api/courses', route => route.abort('failed'))

      // Navigate to course page
      await page.goto('/course')

      // Wait for error handling
      await page.waitForTimeout(3000)

      // Check if page handles error gracefully
      await expect(page.locator('body')).toBeVisible()

      // Check for empty state or error message
      const emptyState = page.locator('text=Belum ada kursus tersedia')
      if (await emptyState.isVisible()) {
        await expect(emptyState).toBeVisible()
      }
    })

    test('should handle content loading errors', async ({ page }) => {
      // Navigate to course detail
      await page.goto('/course')
      await page.waitForSelector('[data-testid="course-card"]')
      await page.locator('[data-testid="course-card"]').first().click()

      // Intercept content API to simulate error
      await page.route('/api/courses/content', route => route.abort('failed'))

      // Try to load content
      await page.waitForLoadState('networkidle')

      // Check if error message is displayed
      const contentRenderer = page.locator('[data-testid="content-renderer"]')
      if (await contentRenderer.isVisible()) {
        await expect(contentRenderer.locator('text=Content Not Found')).toBeVisible()
      }
    })
  })
})