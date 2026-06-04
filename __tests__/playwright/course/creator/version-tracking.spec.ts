/**
 * E2E Tests: Version Tracking Fix
 *
 * Feature 1: Version Tracking Fix
 * Tests untuk memastikan version increment bekerja dengan benar di UI
 *
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 * Property 1: Version Increment Monotonicity
 * 
 * REFACTORED: Now uses Playwright fixtures for auto setup/teardown
 */

import { expect } from '@playwright/test'
import { lessonTest } from '../../fixtures'
import { waitForPageLoad } from '../../utils/test-helpers'

// ── Test Suite ─────────────────────────────────────────────────────────────

lessonTest.describe('Feature 1: Version Tracking Fix', () => {
  lessonTest('1.1 — CREATE lesson should have version = 1', async ({ 
    page, 
    testCourse,
    testSection 
  }) => {
    // ✅ No manual login needed
    // ✅ testCourse and testSection already created via API
    
    await page.goto(`/creator/courses/${testCourse.slug}/manage`)
    await waitForPageLoad(page)

    // Wait for sidebar to load
    await page.waitForSelector('[data-testid="add-section-btn"]', { timeout: 15000 })

    // Click on the test section to expand it
    const sectionItem = page.locator(`[data-testid="section-item"]:has-text("${testSection.title}")`)
    await sectionItem.click()
    await page.waitForTimeout(500)

    // Click "Tambah Pelajaran" button
    await sectionItem.getByTestId('add-lesson-btn').click()
    await page.waitForTimeout(500)

    // Fill lesson form
    const lessonTitle = `Lesson Version Test ${Date.now()}`
    await page.fill('input[placeholder="Judul pelajaran"]', lessonTitle)

    // Type some content in editor
    const editorContent = page.locator('.tiptap.ProseMirror')
    await editorContent.click()
    await editorContent.fill('This is test content for version tracking')

    // Intercept the API request to check version
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/courses/') &&
        response.url().includes('/lessons') &&
        response.request().method() === 'POST'
    )

    // Save lesson
    await page.getByTestId('lesson-save-btn').click()

    // Wait for response and check version
    const response = await responsePromise
    const responseData = await response.json()

    // Verify: CREATE should return version = 1
    expect(responseData.content.version).toBe(1)
    console.log('✅ CREATE lesson version:', responseData.content.version)
  })

  lessonTest('1.2 — UPDATE lesson should increment version (1 → 2)', async ({ 
    page,
    testCourse,
    testLesson 
  }) => {
    // ✅ testLesson already created with version = 1
    
    await page.goto(`/creator/courses/${testCourse.slug}/manage`)
    await waitForPageLoad(page)

    // Wait for sidebar
    await page.waitForSelector('[data-testid="add-section-btn"]', { timeout: 15000 })

    // Find the test lesson in sidebar
    const lessonItem = page.locator(`[data-testid="lesson-item"]:has-text("${testLesson.title}")`)
    
    // Click lesson to open viewer
    await lessonItem.click()
    await page.waitForTimeout(1000)

    // Click edit button
    await page.getByTestId('lesson-edit-btn').click()
    await page.waitForTimeout(1000)

    // Modify content
    const editorContent = page.locator('.tiptap.ProseMirror')
    await editorContent.click()
    await editorContent.press('End')
    await editorContent.pressSequentially(' - Updated content')

    // Intercept the API request
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/courses/') &&
        response.url().includes('/lessons/') &&
        response.request().method() === 'PUT'
    )

    // Save lesson
    await page.getByTestId('lesson-save-btn').click()

    // Wait for response and check version
    const response = await responsePromise
    const responseData = await response.json()

    // Verify: UPDATE should increment version (1 → 2)
    expect(responseData.content.version).toBe(2)
    console.log('✅ UPDATE lesson version: 1 →', responseData.content.version)
  })

  lessonTest('1.3 — Multiple saves should increment version monotonically', async ({ 
    page,
    testCourse,
    testLesson 
  }) => {
    await page.goto(`/creator/courses/${testCourse.slug}/manage`)
    await waitForPageLoad(page)

    await page.waitForSelector('[data-testid="add-section-btn"]', { timeout: 15000 })

    // Find the test lesson
    const lessonItem = page.locator(`[data-testid="lesson-item"]:has-text("${testLesson.title}")`)

    // Open lesson editor
    await lessonItem.click()
    await page.waitForTimeout(1000)
    await page.getByTestId('lesson-edit-btn').click()
    await page.waitForTimeout(1000)

    const versions: number[] = []

    // Perform 3 saves and track versions
    for (let i = 0; i < 3; i++) {
      // Modify content
      const editorContent = page.locator('.tiptap.ProseMirror')
      await editorContent.click()
      await editorContent.press('End')
      await editorContent.pressSequentially(` - Edit ${i + 1}`)

      // Intercept response
      const responsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/courses/') &&
          response.url().includes('/lessons/') &&
          response.request().method() === 'PUT'
      )

      // Save
      await page.getByTestId('lesson-save-btn').click()
      await page.waitForTimeout(500)

      // Get version
      const response = await responsePromise
      const responseData = await response.json()
      versions.push(responseData.content.version)

      console.log(`Save ${i + 1} version:`, responseData.content.version)

      // Re-open editor for next save
      if (i < 2) {
        await page.getByTestId('lesson-edit-btn').click()
        await page.waitForTimeout(1000)
      }
    }

    // Verify: Versions should be monotonically increasing
    expect(versions[0]).toBeLessThan(versions[1])
    expect(versions[1]).toBeLessThan(versions[2])
    console.log('✅ Version progression:', versions)
  })

  lessonTest('1.4 — Version should persist after page reload', async ({ 
    page,
    testCourse,
    testLesson 
  }) => {
    await page.goto(`/creator/courses/${testCourse.slug}/manage`)
    await waitForPageLoad(page)

    await page.waitForSelector('[data-testid="add-section-btn"]', { timeout: 15000 })

    const lessonItem = page.locator(`[data-testid="lesson-item"]:has-text("${testLesson.title}")`)

    // Open lesson and get current version
    await lessonItem.click()
    await page.waitForTimeout(1000)

    // Intercept GET request to get current version
    const getResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/courses/') &&
        response.url().includes('/lessons/') &&
        response.request().method() === 'GET'
    )

    const getResponse = await getResponsePromise
    const initialData = await getResponse.json()
    const initialVersion = initialData.content.version

    console.log('Initial version:', initialVersion)

    // Edit and save
    await page.getByTestId('lesson-edit-btn').click()
    await page.waitForTimeout(1000)

    const editorContent = page.locator('.tiptap.ProseMirror')
    await editorContent.click()
    await editorContent.press('End')
    await editorContent.pressSequentially(' - Reload test')

    const putResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/courses/') &&
        response.url().includes('/lessons/') &&
        response.request().method() === 'PUT'
    )

    await page.getByTestId('lesson-save-btn').click()

    const putResponse = await putResponsePromise
    const updatedData = await putResponse.json()
    const updatedVersion = updatedData.content.version

    console.log('Updated version:', updatedVersion)

    // Reload page
    await page.reload()
    await waitForPageLoad(page)
    await page.waitForTimeout(1000)

    // Open same lesson again
    await lessonItem.click()
    await page.waitForTimeout(1000)

    // Get version after reload
    const reloadResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/courses/') &&
        response.url().includes('/lessons/') &&
        response.request().method() === 'GET'
    )

    const reloadResponse = await reloadResponsePromise
    const reloadData = await reloadResponse.json()
    const reloadVersion = reloadData.content.version

    console.log('Version after reload:', reloadVersion)

    // Verify: Version should persist
    expect(reloadVersion).toBe(updatedVersion)
    expect(reloadVersion).toBeGreaterThan(initialVersion)
  })
})
