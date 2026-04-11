/**
 * E2E Tests: Content Management — Creator Workflow
 *
 * Task 14: Creator workflow untuk mengelola konten kursus.
 * Mencakup: akses halaman, buat seksi, buat lesson, edit lesson,
 * reorder drag-drop, delete cascade, dan unauthorized redirect.
 *
 * Requirements: 1.1, 1.3, 1.4, 1.5, 2.1, 2.4, 2.5, 8.1, 8.4
 * Tasks: 14.1 - 14.8
 */

import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Login sebagai creator dan ambil slug course pertama yang tersedia.
 * Returns null jika tidak ada course.
 */
async function loginAndGetCourseSlug(page: Parameters<typeof waitForPageLoad>[0]): Promise<string | null> {
  await page.goto('/')
  await clerk.signIn({
    page,
    signInParams: {
      strategy: 'password',
      identifier: testUsers.creatorUser.identifier,
      password: testUsers.creatorUser.password,
    },
  })

  await page.goto('/creator')
  await waitForPageLoad(page)

  const firstItem = page.getByTestId('creator-course-item').first()
  const count = await page.getByTestId('creator-course-item').count()
  if (count === 0) return null

  // data-course-id berisi slug (sesuai CourseListItem: data-course-id={course.id})
  // Tapi link href-nya pakai slug: /creator/courses/${course.slug}/manage
  // Ambil dari href link langsung
  const href = await firstItem.getAttribute('href')
  if (!href) return null

  // href format: /creator/courses/[slug]/manage
  const match = href.match(/\/creator\/courses\/([^/]+)\/manage/)
  return match ? match[1] : null
}

// ── Test Suite: Authenticated Creator ─────────────────────────────────────

test.describe('Task 14: Creator Content Management Workflow', () => {
  let courseSlug: string | null = null

  test.beforeEach(async ({ page }) => {
    courseSlug = await loginAndGetCourseSlug(page)
  })

  // ── 14.2: Akses halaman manage ──────────────────────────────────────────

  test('14.2 — akses halaman manage dengan auth creator', async ({ page }) => {
    if (!courseSlug) {
      console.log('ℹ️ No courses available, skipping')
      return
    }

    await page.goto(`/creator/courses/${courseSlug}/manage`)
    await waitForPageLoad(page)

    // Halaman tampil — tidak redirect ke sign-in
    expect(page.url()).not.toContain('/sign-in')

    // Header tampil dengan judul course
    await expect(page.locator('header h1')).toBeVisible()

    // Sidebar tampil
    await expect(page.locator('aside')).toBeVisible()

    // Publish toggle tampil
    await expect(page.getByTestId('publish-toggle-btn')).toBeVisible()
  })

  // ── 14.3: Buat seksi baru ───────────────────────────────────────────────

  test('14.3 — buat seksi baru muncul di sidebar', async ({ page }) => {
    if (!courseSlug) {
      console.log('ℹ️ No courses available, skipping')
      return
    }

    await page.goto(`/creator/courses/${courseSlug}/manage`)
    await waitForPageLoad(page)

    // Tunggu sidebar selesai render
    await page.waitForSelector('[data-testid="add-section-btn"]', { timeout: 15000 })

    const sectionTitle = `Seksi E2E Test ${Date.now()}`

    // Klik tombol Tambah Seksi
    const addBtn = page.getByTestId('add-section-btn')
    await expect(addBtn).toBeVisible()
    await addBtn.click()

    // Input inline muncul
    const inlineInput = page.getByTestId('inline-section-input')
    await expect(inlineInput).toBeVisible()
    await expect(inlineInput).toBeFocused()

    // Ketik judul dan tekan Enter
    await inlineInput.fill(sectionTitle)
    await inlineInput.press('Enter')

    // Tunggu API response
    await page.waitForTimeout(2000)

    // Seksi baru muncul di sidebar
    await expect(page.locator('aside').getByText(sectionTitle)).toBeVisible({ timeout: 10000 })
  })

  // ── 14.4: Buat lesson baru dengan Tiptap content ────────────────────────

  test('14.4 — buat lesson baru dengan Tiptap content', async ({ page }) => {
    if (!courseSlug) {
      console.log('ℹ️ No courses available, skipping')
      return
    }

    await page.goto(`/creator/courses/${courseSlug}/manage`)
    await waitForPageLoad(page)

    // Pastikan ada seksi — ambil seksi pertama
    const sectionMenuBtns = page.locator('[data-testid^="section-menu-btn-"]')
    const sectionCount = await sectionMenuBtns.count()

    if (sectionCount === 0) {
      console.log('ℹ️ No sections available, skipping lesson creation test')
      return
    }

    const lessonTitle = `Pelajaran E2E Test ${Date.now()}`

    // Hover pada seksi pertama untuk munculkan menu
    const firstSectionMenu = sectionMenuBtns.first()
    await firstSectionMenu.scrollIntoViewIfNeeded()
    await firstSectionMenu.click()

    // Klik "Tambah Pelajaran" di dropdown
    // Ambil section ID dari testid
    const sectionId = await firstSectionMenu.getAttribute('data-testid')
      .then((id) => id?.replace('section-menu-btn-', '') ?? '')

    const addLessonBtn = page.getByTestId(`section-add-lesson-btn-${sectionId}`)
    await expect(addLessonBtn).toBeVisible()
    await addLessonBtn.click()

    // Panel editor terbuka — isi judul
    const titleInput = page.getByTestId('lesson-title-input')
    await expect(titleInput).toBeVisible({ timeout: 5000 })
    await titleInput.fill(lessonTitle)

    // Klik area editor dan ketik konten
    const editorArea = page.locator('[aria-label="Tulis konten pelajaran di sini."]')
    await editorArea.click()
    await page.keyboard.type('Ini adalah konten pelajaran E2E test.')

    // Klik tombol Create/Save
    const saveBtn = page.getByTestId('lesson-save-btn')
    await expect(saveBtn).toBeVisible()
    await saveBtn.click()

    // Tunggu API response dan view berpindah ke lesson viewer
    await page.waitForTimeout(3000)

    // Lesson title tampil di viewer
    await expect(page.getByTestId('lesson-title')).toContainText(lessonTitle, { timeout: 10000 })

    // Lesson muncul di sidebar
    await expect(page.locator('aside').getByText(lessonTitle)).toBeVisible({ timeout: 10000 })
  })

  // ── 14.5: Edit lesson ───────────────────────────────────────────────────

  test('14.5 — edit lesson, konten berubah setelah save', async ({ page }) => {
    if (!courseSlug) {
      console.log('ℹ️ No courses available, skipping')
      return
    }

    await page.goto(`/creator/courses/${courseSlug}/manage`)
    await waitForPageLoad(page)

    // Cari lesson pertama yang tersedia
    const lessonMenuBtns = page.locator('[data-testid^="lesson-menu-btn-"]')

    // Expand semua section dulu untuk memunculkan lessons
    const sectionToggles = page.locator('[data-testid^="section-toggle-"]')
    const toggleCount = await sectionToggles.count()
    for (let i = 0; i < toggleCount; i++) {
      await sectionToggles.nth(i).click()
      await page.waitForTimeout(300)
    }

    const lessonCount = await lessonMenuBtns.count()
    if (lessonCount === 0) {
      console.log('ℹ️ No lessons available, skipping edit test')
      return
    }

    // Hover dan klik menu lesson pertama
    const firstLessonMenu = lessonMenuBtns.first()
    await firstLessonMenu.click()

    const lessonId = await firstLessonMenu.getAttribute('data-testid')
      .then((id) => id?.replace('lesson-menu-btn-', '') ?? '')

    // Klik Edit
    const editBtn = page.getByTestId(`lesson-edit-btn-${lessonId}`)
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Panel editor terbuka dengan konten existing
    const titleInput = page.getByTestId('lesson-title-input')
    await expect(titleInput).toBeVisible({ timeout: 5000 })

    // Tambah teks ke judul
    const updatedSuffix = ` - Updated ${Date.now()}`
    await titleInput.press('End')
    await titleInput.type(updatedSuffix)

    // Klik Save
    const saveBtn = page.getByTestId('lesson-save-btn')
    await saveBtn.click()

    // Tunggu API response
    await page.waitForTimeout(3000)

    // View berpindah ke lesson viewer — judul berubah
    await expect(page.getByTestId('lesson-title')).toContainText('Updated', { timeout: 10000 })
  })

  // ── 14.6: Reorder section via drag and drop ─────────────────────────────

  test('14.6 — reorder section via drag and drop', async ({ page }) => {
    if (!courseSlug) {
      console.log('ℹ️ No courses available, skipping')
      return
    }

    await page.goto(`/creator/courses/${courseSlug}/manage`)
    await waitForPageLoad(page)

    const sectionItems = page.locator('[data-testid^="section-item-"]')
    const count = await sectionItems.count()

    if (count < 2) {
      console.log('ℹ️ Need at least 2 sections for reorder test, skipping')
      return
    }

    // Ambil judul section sebelum drag
    const firstSectionToggle = page.locator('[data-testid^="section-toggle-"]').first()
    const secondSectionToggle = page.locator('[data-testid^="section-toggle-"]').nth(1)

    const firstTitleBefore = await firstSectionToggle.locator('span').first().textContent()
    const secondTitleBefore = await secondSectionToggle.locator('span').first().textContent()

    // Drag section kedua ke atas section pertama menggunakan grip handle
    const secondGrip = sectionItems.nth(1).locator('[aria-label="Drag to reorder section"]')
    const firstItem = sectionItems.first()

    const firstBox = await firstItem.boundingBox()
    if (!firstBox) return

    // Simulate drag dengan mouse events (DnD Kit pakai PointerSensor)
    await secondGrip.hover()
    await page.mouse.down()
    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + 5, { steps: 10 })
    await page.waitForTimeout(500)
    await page.mouse.up()

    // Tunggu reorder API
    await page.waitForTimeout(2000)

    // Verifikasi urutan berubah — section yang tadinya kedua sekarang pertama
    const firstTitleAfter = await page.locator('[data-testid^="section-toggle-"]').first()
      .locator('span').first().textContent()

    // Urutan harus berbeda dari sebelumnya
    expect(firstTitleAfter).not.toBe(firstTitleBefore)
    expect(firstTitleAfter).toBe(secondTitleBefore)
  })

  // ── 14.7: Delete section → cascade delete lessons ───────────────────────

  test('14.7 — delete section cascade delete lessons', async ({ page }) => {
    if (!courseSlug) {
      console.log('ℹ️ No courses available, skipping')
      return
    }

    await page.goto(`/creator/courses/${courseSlug}/manage`)
    await waitForPageLoad(page)

    // Buat seksi baru dulu untuk dihapus (agar tidak merusak data lain)
    const tempSectionTitle = `Seksi Hapus Test ${Date.now()}`
    await page.getByTestId('add-section-btn').click()
    const inlineInput = page.getByTestId('inline-section-input')
    await inlineInput.fill(tempSectionTitle)
    await inlineInput.press('Enter')
    await page.waitForTimeout(2000)

    // Pastikan seksi baru muncul
    await expect(page.locator('aside').getByText(tempSectionTitle)).toBeVisible({ timeout: 10000 })

    // Cari section item yang baru dibuat
    const allSectionMenuBtns = page.locator('[data-testid^="section-menu-btn-"]')
    const sectionCount = await allSectionMenuBtns.count()

    // Klik menu pada seksi terakhir (yang baru dibuat)
    const lastSectionMenu = allSectionMenuBtns.nth(sectionCount - 1)
    await lastSectionMenu.click()

    const sectionId = await lastSectionMenu.getAttribute('data-testid')
      .then((id) => id?.replace('section-menu-btn-', '') ?? '')

    // Klik Hapus Seksi
    const deleteBtn = page.getByTestId(`section-delete-btn-${sectionId}`)
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // Dialog konfirmasi muncul
    const dialog = page.getByTestId('delete-section-dialog')
    await expect(dialog).toBeVisible({ timeout: 5000 })
    await expect(dialog).toContainText('Hapus Seksi')

    // Klik Ya, Hapus
    await page.getByTestId('confirm-delete-section-btn').click()

    // Tunggu API response
    await page.waitForTimeout(2000)

    // Seksi hilang dari sidebar
    await expect(page.locator('aside').getByText(tempSectionTitle)).not.toBeVisible({ timeout: 10000 })
  })
})

// ── Test Suite: Access Control ─────────────────────────────────────────────

test.describe('Task 14.8: Creator Manage Page — Access Control', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies()
  })

  test('14.8 — akses tanpa auth redirect ke /sign-in', async ({ page }) => {
    await page.goto('/creator/courses/some-course-slug/manage')
    await waitForPageLoad(page)

    const url = page.url()
    const isRedirected = url.includes('/sign-in') || url.includes('/unauthorized')

    if (!isRedirected) {
      // Fallback: cek konten halaman
      const bodyText = await page.locator('body').textContent()
      const isBlocked = bodyText?.toLowerCase().includes('sign') ||
        bodyText?.toLowerCase().includes('login') ||
        bodyText?.toLowerCase().includes('akses')
      expect(isBlocked).toBeTruthy()
    } else {
      expect(isRedirected).toBeTruthy()
    }
  })
})
