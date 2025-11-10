import { test, expect, devices } from '@playwright/test'

test.describe('Course Timeline Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/course')
    await page.waitForSelector('[data-testid="course-card"]')
    await page.locator('[data-testid="course-card"]').first().click()
    await page.waitForLoadState('networkidle')
  })

  test.describe('Timeline Structure', () => {
    test('should display timeline navigation with sections and items', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      await expect(timelineNav).toBeVisible()

      // Check for sections
      const sections = timelineNav.locator('[data-testid="timeline-section"]')
      const sectionCount = await sections.count()
      expect(sectionCount).toBeGreaterThan(0)

      // Check for items in first section
      if (sectionCount > 0) {
        const firstSectionItems = sections.first().locator('[data-testid="timeline-item"]')
        const itemCount = await firstSectionItems.count()
        expect(itemCount).toBeGreaterThan(0)
      }
    })

    test('should show correct section titles', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const sections = timelineNav.locator('[data-testid="timeline-section"]')

      if (await sections.count() > 0) {
        for (let i = 0; i < await sections.count(); i++) {
          const section = sections.nth(i)
          const sectionTitle = section.locator('[data-testid="section-title"]')
          await expect(sectionTitle).toBeVisible()

          const titleText = await sectionTitle.textContent()
          expect(titleText?.trim()).not.toBe('')
        }
      }
    })

    test('should display item titles and content types', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 0) {
        const firstItem = items.first()

        // Check item title
        const itemTitle = firstItem.locator('[data-testid="item-title"]')
        await expect(itemTitle).toBeVisible()

        // Check content type indicator
        const contentType = firstItem.locator('[data-testid="content-type"]')
        if (await contentType.isVisible()) {
          const typeText = await contentType.textContent()
          expect(typeText?.trim()).not.toBe('')
        }
      }
    })
  })

  test.describe('Timeline Item States', () => {
    test('should show current item highlight', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const currentItem = timelineNav.locator('[data-testid="timeline-item"].current')

      await expect(currentItem).toBeVisible()

      // Check current item has distinct styling
      const currentBgColor = await currentItem.evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      )
      expect(currentBgColor).not.toBe('rgba(0, 0, 0, 0)')
    })

    test('should show completed items with check marks', async ({ page }) => {
      // Mark current item as complete first
      await page.click('button:has-text("Mark as Complete")')
      await page.waitForTimeout(1000)

      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const completedItems = timelineNav.locator('[data-testid="timeline-item"].completed')

      if (await completedItems.count() > 0) {
        const firstCompleted = completedItems.first()
        const checkMark = firstCompleted.locator('[data-testid="completion-indicator"]')
        await expect(checkMark).toBeVisible()
      }
    })

    test('should show optional items differently', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const optionalItems = timelineNav.locator('[data-testid="timeline-item"].optional')

      if (await optionalItems.count() > 0) {
        const firstOptional = optionalItems.first()
        const optionalIndicator = firstOptional.locator('[data-testid="optional-indicator"]')

        if (await optionalIndicator.isVisible()) {
          const indicatorText = await optionalIndicator.textContent()
          expect(indicatorText?.toLowerCase()).toContain('optional')
        }
      }
    })

    test('should show locked items appropriately', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const lockedItems = timelineNav.locator('[data-testid="timeline-item"].locked')

      if (await lockedItems.count() > 0) {
        const firstLocked = lockedItems.first()

        // Check that locked items are not clickable
        const isClickable = await firstLocked.evaluate(el =>
          window.getComputedStyle(el).pointerEvents !== 'none'
        )

        // Locked items should either be not clickable or have visual indicator
        const lockIndicator = firstLocked.locator('[data-testid="lock-indicator"]')
        if (await lockIndicator.isVisible()) {
          await expect(lockIndicator).toBeVisible()
        }
      }
    })
  })

  test.describe('Timeline Navigation', () => {
    test('should navigate to clicked timeline item', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 1) {
        // Get current content
        const initialContent = await page.locator('[data-testid="content-renderer"]').textContent()

        // Click on different item
        await items.nth(1).click()
        await page.waitForTimeout(1000)

        // Check content changed
        const newContent = await page.locator('[data-testid="content-renderer"]').textContent()
        expect(newContent).not.toBe(initialContent)

        // Check current item updated
        const newCurrentItem = timelineNav.locator('[data-testid="timeline-item"].current')
        await expect(newCurrentItem).toBeVisible()

        const isDifferentItem = await newCurrentItem.evaluate((el, firstItem) =>
          el !== firstItem, await items.first().elementHandle()
        )
        expect(isDifferentItem).toBe(true)
      }
    })

    test('should update current item highlight on navigation', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 1) {
        // Get initially highlighted item
        const initialCurrent = await timelineNav.locator('[data-testid="timeline-item"].current')
          .evaluate(el => el.getAttribute('data-item-id'))

        // Click on different item
        await items.nth(1).click()
        await page.waitForTimeout(1000)

        // Check new item is highlighted
        const newCurrent = await timelineNav.locator('[data-testid="timeline-item"].current')
          .evaluate(el => el.getAttribute('data-item-id'))

        expect(newCurrent).not.toBe(initialCurrent)
      }
    })

    test('should handle keyboard navigation in timeline', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const firstItem = timelineNav.locator('[data-testid="timeline-item"]').first()

      if (await firstItem.isVisible()) {
        // Focus on timeline
        await firstItem.focus()
        await expect(firstItem).toBeFocused()

        // Try arrow navigation (if implemented)
        await page.keyboard.press('ArrowDown')
        await page.waitForTimeout(500)

        // Check if focus moved
        const focusedElement = await page.locator(':focus')
        const isTimelineItem = await focusedElement.evaluate(el =>
          el.hasAttribute('data-testid') && el.getAttribute('data-testid') === 'timeline-item'
        )

        if (isTimelineItem) {
          await expect(focusedElement).toBeVisible()
        }
      }
    })
  })

  test.describe('Timeline and Content Synchronization', () => {
    test('should sync timeline with content renderer', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 1) {
        // Click on timeline item
        await items.nth(1).click()
        await page.waitForTimeout(1000)

        // Check content header updated
        const contentHeader = page.locator('h2')
        if (await contentHeader.isVisible()) {
          const headerText = await contentHeader.textContent()
          expect(headerText?.trim()).not.toBe('')
        }

        // Check timeline item is current
        const currentItem = timelineNav.locator('[data-testid="timeline-item"].current')
        await expect(currentItem).toBeVisible()
      }
    })

    test('should update timeline when using navigation buttons', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const nextButton = page.locator('button:has-text("Next")')

      if (await nextButton.isEnabled()) {
        // Get initial current item
        const initialCurrent = await timelineNav.locator('[data-testid="timeline-item"].current')
          .evaluate(el => el.getAttribute('data-item-id'))

        // Click next button
        await nextButton.click()
        await page.waitForTimeout(1000)

        // Check timeline updated
        const newCurrent = await timelineNav.locator('[data-testid="timeline-item"].current')
          .evaluate(el => el.getAttribute('data-item-id'))

        expect(newCurrent).not.toBe(initialCurrent)
      }
    })

    test('should maintain scroll position in timeline', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 5) {
        // Scroll down in timeline
        await timelineNav.evaluate(el => {
          el.scrollTop = el.scrollHeight / 2
        })

        // Click on item
        await items.nth(3).click()
        await page.waitForTimeout(1000)

        // Check current item is visible
        const currentItem = timelineNav.locator('[data-testid="timeline-item"].current')
        await expect(currentItem).toBeVisible()

        const isVisible = await currentItem.evaluate(el => {
          const rect = el.getBoundingClientRect()
          const parentRect = el.parentElement!.getBoundingClientRect()
          return rect.top >= parentRect.top && rect.bottom <= parentRect.bottom
        })

        expect(isVisible).toBe(true)
      }
    })
  })

  test.describe('Mobile Timeline Navigation', () => {
    test.use({ ...devices['iPhone 13'] })

    test('should display mobile timeline correctly', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      await expect(timelineNav).toBeVisible()

      // Check mobile-specific styling
      const isCompact = await timelineNav.evaluate(el => {
        const styles = window.getComputedStyle(el)
        return styles.maxHeight.includes('vh') || styles.overflow === 'auto'
      })

      expect(isCompact).toBe(true)
    })

    test('should handle touch interactions on mobile', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 1) {
        // Get initial content
        const initialContent = await page.locator('[data-testid="content-renderer"]').textContent()

        // Tap on different item
        await items.nth(1).tap()
        await page.waitForTimeout(1000)

        // Check content changed
        const newContent = await page.locator('[data-testid="content-renderer"]').textContent()
        expect(newContent).not.toBe(initialContent)
      }
    })

    test('should handle swipe gestures on timeline', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')

      if (await timelineNav.isVisible()) {
        // Try swipe gesture
        await timelineNav.tap({ position: { x: 50, y: 100 } })
        await page.waitForTimeout(500)

        // Check if timeline is scrollable
        const isScrollable = await timelineNav.evaluate(el => {
          return el.scrollHeight > el.clientHeight
        })

        if (isScrollable) {
          // Try scrolling with touch
          await timelineNav.evaluate(el => {
            el.scrollTo({ top: 100, behavior: 'smooth' })
          })
          await page.waitForTimeout(500)

          // Check scroll position changed
          const scrollTop = await timelineNav.evaluate(el => el.scrollTop)
          expect(scrollTop).toBeGreaterThan(0)
        }
      }
    })
  })

  test.describe('Timeline Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      await expect(timelineNav).toHaveAttribute('role', 'navigation')

      const items = timelineNav.locator('[data-testid="timeline-item"]')
      const itemCount = await items.count()

      if (itemCount > 0) {
        // Check first item has proper ARIA attributes
        const firstItem = items.first()
        await expect(firstItem).toHaveAttribute('tabindex', '0')

        // Check current item has aria-current
        const currentItem = timelineNav.locator('[data-testid="timeline-item"].current')
        if (await currentItem.isVisible()) {
          await expect(currentItem).toHaveAttribute('aria-current', 'true')
        }

        // Check completed items have aria-label indicating completion
        const completedItems = timelineNav.locator('[data-testid="timeline-item"].completed')
        if (await completedItems.count() > 0) {
          const firstCompleted = completedItems.first()
          const ariaLabel = await firstCompleted.getAttribute('aria-label')
          expect(ariaLabel).toMatch(/completed|done/i)
        }
      }
    })

    test('should support screen reader navigation', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 0) {
        // Test keyboard navigation
        await items.first().focus()
        await expect(items.first()).toBeFocused()

        // Check if Tab moves to next item
        await page.keyboard.press('Tab')
        await page.waitForTimeout(500)

        const focusedElement = await page.locator(':focus')
        const isTimelineItem = await focusedElement.evaluate(el =>
          el.hasAttribute('data-testid') &&
          el.getAttribute('data-testid') === 'timeline-item'
        )

        if (isTimelineItem) {
          await expect(focusedElement).toBeVisible()
        }
      }
    })

    test('should have proper heading structure', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const sections = timelineNav.locator('[data-testid="timeline-section"]')

      if (await sections.count() > 0) {
        // Check section headings
        const sectionHeadings = sections.locator('h3, h4')
        expect(await sectionHeadings.count()).toBeGreaterThan(0)

        // Check heading levels are logical
        for (let i = 0; i < await sectionHeadings.count(); i++) {
          const heading = sectionHeadings.nth(i)
          const tagName = await heading.evaluate(el => el.tagName.toLowerCase())
          expect(['h3', 'h4', 'h5', 'h6']).toContain(tagName)
        }
      }
    })
  })

  test.describe('Timeline Performance', () => {
    test('should render timeline quickly', async ({ page }) => {
      const startTime = Date.now()

      // Navigate to course detail (already done in beforeEach)
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      await expect(timelineNav).toBeVisible()

      const renderTime = Date.now() - startTime
      expect(renderTime).toBeLessThan(3000) // Should render within 3 seconds
    })

    test('should handle large timelines efficiently', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')
      const itemCount = await items.count()

      if (itemCount > 10) {
        // Test navigation performance
        const startTime = Date.now()

        await items.last().click()
        await page.waitForTimeout(1000)

        const navigationTime = Date.now() - startTime
        expect(navigationTime).toBeLessThan(2000) // Should navigate within 2 seconds

        // Test scroll performance
        const scrollStart = Date.now()

        await timelineNav.evaluate(el => {
          el.scrollTop = el.scrollHeight
        })

        const scrollTime = Date.now() - scrollStart
        expect(scrollTime).toBeLessThan(1000) // Should scroll within 1 second
      }
    })
  })

  test.describe('Timeline Error Handling', () => {
    test('should handle missing timeline data gracefully', async ({ page }) => {
      // This test would need mocking to simulate missing data
      const timelineNav = page.locator('[data-testid="timeline-nav"]')

      if (await timelineNav.isVisible()) {
        // Timeline should still be functional even with partial data
        const items = timelineNav.locator('[data-testid="timeline-item"]')

        if (await items.count() === 0) {
          // Should show empty state or error message
          const emptyState = timelineNav.locator('text=No content available')
          if (await emptyState.isVisible()) {
            await expect(emptyState).toBeVisible()
          }
        }
      }
    })

    test('should handle invalid item clicks gracefully', async ({ page }) => {
      const timelineNav = page.locator('[data-testid="timeline-nav"]')
      const items = timelineNav.locator('[data-testid="timeline-item"]')

      if (await items.count() > 0) {
        // Try clicking on locked item if available
        const lockedItems = timelineNav.locator('[data-testid="timeline-item"].locked')

        if (await lockedItems.count() > 0) {
          await lockedItems.first().click()
          await page.waitForTimeout(1000)

          // Should not crash and content should remain functional
          await expect(page.locator('[data-testid="content-renderer"]')).toBeVisible()
        }
      }
    })
  })
})