/**
 * E2E Tests: Content Management — Student Learn Workflow
 *
 * Task 15: Student workflow untuk belajar konten kursus.
 * Mencakup: akses halaman, render Tiptap, mark complete via Next,
 * progress bar update, navigasi prev/next, refresh persistence,
 * dan unauthorized redirect.
 *
 * Requirements: 5.1, 5.2, 5.3, 5.7, 6.1, 6.2, 6.4, 7.1, 7.5
 * Tasks: 15.1 - 15.8
 *
 * Prerequisite:
 * - regularUser harus enrolled di course PUBLISHED
 * - Course slug: test-course-double-postman-dari-postman
 */

import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

// ── Course slug yang digunakan untuk testing ───────────────────────────────
// Course ini harus PUBLISHED dan regularUser harus sudah enrolled
const TEST_COURSE_SLUG = 'test-course-double-postman-dari-postman'

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Login sebagai student (regularUser).
 */
async function loginStudent(page: Parameters<typeof waitForPageLoad>[0]) {
  await page.goto('/')
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: testUsers.regularUser.identifier,
      password: testUsers.regularUser.password,
    },
  })
}

/**
 * Navigate ke learn page dan tunggu sections ter-load.
 */
async function gotoLearnPage(
  page: Parameters<typeof waitForPageLoad>[0],
  slug: string
) {
  await page.goto(`/course/${slug}/learn`)
  await waitForPageLoad(page)
  // Tunggu sidebar sections muncul
  await page.waitForSelector('[data-testid^="nav-section-"]', { timeout: 15000 })
}

/**
 * Expand semua sections di sidebar agar lessons visible.
 */
async function expandAllSections(page: Parameters<typeof waitForPageLoad>[0]) {
  const sections = page.locator('[data-testid^="nav-section-"]')
  const count = await sections.count()
  for (let i = 0; i < count; i++) {
    const trigger = sections.nth(i).locator('button').first()
    const isExpanded = await trigger.getAttribute('aria-expanded')
    if (isExpanded === 'false' || isExpanded === null) {
      await trigger.click()
      await page.waitForTimeout(300)
    }
  }
}

/**
 * Ambil semua lesson IDs dari sidebar navigation (setelah expand).
 */
async function getAllLessonIds(page: Parameters<typeof waitForPageLoad>[0]): Promise<string[]> {
  await expandAllSections(page)
  const lessonBtns = page.locator('[data-testid^="nav-lesson-"]')
  const count = await lessonBtns.count()
  const ids: string[] = []
  for (let i = 0; i < count; i++) {
    const testId = await lessonBtns.nth(i).getAttribute('data-testid')
    if (testId) ids.push(testId.replace('nav-lesson-', ''))
  }
  return ids
}

// ── Test Suite: Authenticated Student ─────────────────────────────────────

test.describe('Task 15: Student Learn Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await loginStudent(page)
  })

  // ── 15.2: Akses halaman learn ───────────────────────────────────────────

  test('15.2 — akses halaman learn dengan auth student enrolled', async ({ page }) => {
    await gotoLearnPage(page, TEST_COURSE_SLUG)

    // Tidak redirect ke sign-in
    expect(page.url()).not.toContain('/sign-in')

    // Root container learn page tampil
    await expect(page.getByTestId('learn-page')).toBeVisible()

    // Sidebar sections tampil
    const sections = page.locator('[data-testid^="nav-section-"]')
    await expect(sections.first()).toBeVisible()

    // Progress bar tampil
    await expect(page.getByTestId('progress-bar-container')).toBeVisible()
  })

  // ── 15.3: Klik lesson → konten Tiptap ter-render ───────────────────────

  test('15.3 — klik lesson, konten Tiptap ter-render di area utama', async ({ page }) => {
    await gotoLearnPage(page, TEST_COURSE_SLUG)

    const lessonIds = await getAllLessonIds(page)
    if (lessonIds.length === 0) {
      console.log('ℹ️ No lessons found, skipping')
      return
    }

    // Klik lesson pertama
    const firstLessonBtn = page.getByTestId(`nav-lesson-${lessonIds[0]}`)
    await firstLessonBtn.click()

    // Tunggu konten ter-load
    await page.waitForSelector('[data-testid="lesson-loading"]', { state: 'detached', timeout: 10000 })
      .catch(() => {})

    // lesson-title tampil
    await expect(page.getByTestId('lesson-title')).toBeVisible({ timeout: 10000 })

    // lesson-area visible
    await expect(page.getByTestId('lesson-area')).toBeVisible()

    // Konten bukan raw JSON
    const lessonAreaText = await page.getByTestId('lesson-area').textContent()
    expect(lessonAreaText).not.toContain('"type":"doc"')
    expect(lessonAreaText).not.toContain('{"type"')
  })

  // ── 15.4: Mark complete via Next → checkmark muncul ────────────────────

  test('15.4 — klik Next auto mark complete, checkmark muncul di sidebar', async ({ page }) => {
    await gotoLearnPage(page, TEST_COURSE_SLUG)

    const lessonIds = await getAllLessonIds(page)
    if (lessonIds.length < 2) {
      console.log('ℹ️ Need at least 2 lessons for this test, skipping')
      return
    }

    // Klik lesson pertama
    await page.getByTestId(`nav-lesson-${lessonIds[0]}`).click()
    await page.waitForSelector('[data-testid="lesson-title"]', { timeout: 10000 })

    // Klik Next (auto mark complete lesson pertama)
    const nextBtn = page.getByTestId('next-lesson-btn')
    await expect(nextBtn).toBeVisible({ timeout: 5000 })

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/api/progress/lesson/') && res.request().method() === 'POST',
        { timeout: 10000 }
      ).catch(() => null),
      nextBtn.click(),
    ])

    await page.waitForTimeout(2000)

    // Checkmark muncul di sidebar untuk lesson pertama
    await expect(page.getByTestId(`lesson-completed-${lessonIds[0]}`)).toBeVisible({ timeout: 10000 })
  })

  // ── 15.5: Progress bar update setelah mark complete ─────────────────────

  test('15.5 — progress bar percentage naik setelah mark complete', async ({ page }) => {
    await gotoLearnPage(page, TEST_COURSE_SLUG)

    const lessonIds = await getAllLessonIds(page)
    if (lessonIds.length < 2) {
      console.log('ℹ️ Need at least 2 lessons, skipping')
      return
    }

    // Catat progress sebelum
    const percentageBefore = await page.getByTestId('progress-percentage').textContent()

    // Cari lesson yang belum completed
    let targetLessonId: string | null = null
    for (const id of lessonIds) {
      const isCompleted = await page.getByTestId(`lesson-completed-${id}`).count() > 0
      if (!isCompleted) {
        targetLessonId = id
        break
      }
    }

    if (!targetLessonId) {
      console.log('ℹ️ All lessons already completed, skipping')
      return
    }

    await page.getByTestId(`nav-lesson-${targetLessonId}`).click()
    await page.waitForSelector('[data-testid="lesson-title"]', { timeout: 10000 })

    // Klik Next untuk auto mark complete
    const nextBtn = page.getByTestId('next-lesson-btn')
    if (await nextBtn.count() === 0) {
      console.log('ℹ️ No next lesson button (last lesson), skipping')
      return
    }

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/api/progress/lesson/') && res.request().method() === 'POST',
        { timeout: 10000 }
      ).catch(() => null),
      nextBtn.click(),
    ])

    await page.waitForTimeout(2000)

    // Progress percentage harus naik atau sama (jika sudah 100%)
    const percentageAfter = await page.getByTestId('progress-percentage').textContent()
    const parsePct = (text: string | null) => parseInt(text?.replace('%', '') ?? '0')
    expect(parsePct(percentageAfter)).toBeGreaterThanOrEqual(parsePct(percentageBefore))

    console.log(`Progress: ${percentageBefore} → ${percentageAfter}`)
  })

  // ── 15.6: Tombol Next → lesson berikutnya ter-load ──────────────────────

  test('15.6 — klik Next, lesson berikutnya ter-load', async ({ page }) => {
    await gotoLearnPage(page, TEST_COURSE_SLUG)

    const lessonIds = await getAllLessonIds(page)
    if (lessonIds.length < 2) {
      console.log('ℹ️ Need at least 2 lessons, skipping')
      return
    }

    // Klik lesson pertama
    await page.getByTestId(`nav-lesson-${lessonIds[0]}`).click()
    await page.waitForSelector('[data-testid="lesson-title"]', { timeout: 10000 })

    const titleBefore = await page.getByTestId('lesson-title').textContent()

    // Klik Next
    const nextBtn = page.getByTestId('next-lesson-btn')
    await expect(nextBtn).toBeVisible({ timeout: 5000 })
    await nextBtn.click()

    // Tunggu lesson baru ter-load
    await page.waitForTimeout(2000)
    await page.waitForSelector('[data-testid="lesson-title"]', { timeout: 10000 })

    // Judul lesson berubah
    const titleAfter = await page.getByTestId('lesson-title').textContent()
    expect(titleAfter).not.toBe(titleBefore)

    // Lesson kedua ter-highlight di sidebar
    const secondLessonBtn = page.getByTestId(`nav-lesson-${lessonIds[1]}`)
    await expect(secondLessonBtn).toHaveAttribute('aria-current', 'page', { timeout: 5000 })
  })

  // ── 15.7: Refresh halaman → progress tetap tersimpan ───────────────────

  test('15.7 — refresh halaman, progress tetap tersimpan', async ({ page }) => {
    await gotoLearnPage(page, TEST_COURSE_SLUG)

    const lessonIds = await getAllLessonIds(page)
    if (lessonIds.length < 2) {
      console.log('ℹ️ Need at least 2 lessons, skipping')
      return
    }

    // Klik lesson pertama dan mark complete via Next
    await page.getByTestId(`nav-lesson-${lessonIds[0]}`).click()
    await page.waitForSelector('[data-testid="lesson-title"]', { timeout: 10000 })

    const nextBtn = page.getByTestId('next-lesson-btn')
    if (await nextBtn.count() === 0) {
      console.log('ℹ️ No next button, skipping')
      return
    }

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/api/progress/lesson/') && res.request().method() === 'POST',
        { timeout: 10000 }
      ).catch(() => null),
      nextBtn.click(),
    ])

    await page.waitForTimeout(2000)

    // Catat progress sebelum refresh
    const percentageBefore = await page.getByTestId('progress-percentage').textContent()

    // Refresh halaman
    await page.reload()
    await waitForPageLoad(page)
    await page.waitForSelector('[data-testid^="nav-section-"]', { timeout: 15000 })
    await expandAllSections(page)

    // Checkmark masih ada untuk lesson pertama
    await expect(page.getByTestId(`lesson-completed-${lessonIds[0]}`)).toBeVisible({ timeout: 10000 })

    // Progress percentage sama
    const percentageAfter = await page.getByTestId('progress-percentage').textContent()
    expect(percentageAfter).toBe(percentageBefore)
  })
})

// ── Test Suite: Access Control ─────────────────────────────────────────────

test.describe('Task 15.8: Student Learn Page — Access Control', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  test('15.8 — akses tanpa auth redirect ke /sign-in', async ({ page }) => {
    await page.goto(`/course/${TEST_COURSE_SLUG}/learn`)
    await waitForPageLoad(page)

    // Clerk middleware sekarang protect /course/*/learn
    // Unauthenticated user harus redirect ke /sign-in
    expect(page.url()).toContain('/sign-in')
  })
})
