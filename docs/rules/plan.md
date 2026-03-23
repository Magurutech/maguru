# Testing Plan: Course Content Management V2

**Feature:** Course Content Management  
**Sprint:** Sprint 2 — Content First  
**Tasks:** 13 (Postman), 14 (E2E Creator), 15 (E2E Student), 16 (Manual Docs)  
**Created:** 2026-03-19

---

## Overview

Testing dilakukan sebelum performance optimization (Task 17) untuk memastikan semua API dan user workflow berfungsi dengan benar. Tiga lapisan testing:

1. **Postman Collections** — API contract testing per endpoint group
2. **Playwright E2E** — User workflow testing (Creator + Student)
3. **Manual Test Doc** — Checklist untuk QA manual

---

## Task 13: Postman Collections

### File Structure

```
docs/api/content-management/
├── sections.postman_collection.json
├── lessons.postman_collection.json
└── progress.postman_collection.json
```

### 13.1 sections.postman_collection.json

Collection variables:
- `baseUrl` = `http://localhost:3000`
- `courseSlug` = slug kursus yang ada di DB
- `sectionId` = ID section (diisi dari response POST)
- `authToken` = Clerk session token creator

Requests:

| Method                                 | Endpoint                                             | Expected                              | Notes                                 |                                                    |
| ----------------------------------------| ------------------------------------------------------| ---------------------------------------| ---------------------------------------| ----------------------------------------------------|
| POST                                   | i/courses/{{courseSlug}}/sections`                   | 201                                   | body: `{ title, description, order }` |                                                    |
| GET                                    | courses/{{courseSlug}}/sections`                     | 200                                   | response: array ordered by `order`    |                                                    |
|                                        | api/courses/{{courseSlug}}/sections/{{sectionId}}`   | 200                                   | body: `{ title }`                     |                                                    |
| DEL                                    | `/api/courses/{{courseSlug}}/sections/{{sectionId}}` | 200                                   | response: `{ deletedLessons: N }`     |                                                    |
| POS                                    | pi/courses/{{courseSlug}}/sections`                  | 401                                   | tanpa Authorization header            |                                                    |
| POST                                   | rses/{{courseSlug}}/sections`                        | 403                                   | auth sebagai user bukan owner         |                                                    |
|                                        | pi/courses/{{courseSlug}}/sections/nonexistent-id`   | 404                                   | section tidak ada                     |                                                    |
| `/api/courses/{{courseSlug}}/sections` | 409                                                  | order yang sudah dipakai section lain |                                       |                                                    |
|                                        |                                                      |                                       |                                       | script untuk POST (set `sectionId` dari response): |
```jav
pm.test("Section created", () => {
  pm.response.to.have.status(201)
  const json = pm.response.json()
  pm.collectionVariables.set("sectionId", json.id)
})
```

### 13.2 lessons.postman_collection.json

Collection variables:
- `baseUrl`, `courseSlug`, `sectionId`, `lessonId`, `authToken`

Valid Tiptap JSON body (dipakai di semua lesson requests):
```json
{
  "title": "Intro to TypeScript",
  "order": 1,
  "content": {
    "type": "doc",
    "version": 1,
    "lastEdit": "2026-03-19T00:00:00.000Z",
    "content": [
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Hello world" }]
      }
    ]
  }
}
```

Requests:

| Method                                                    | Endpoint                  | Expected                       | Notes            |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    |             |     |            |       |     |             |
| -----------------------------------------------------------| ---------------------------| --------------------------------| ------------------| -----| -----| -----| ---------------------------------------------------------| -----| -------------------| ----------------------| -----| -------------------------| -----------------------| -----| ------------------------------------| -------------| -----| ------------| -------| -----| -------------|
| POST                                                      |                           |                                |                  |     |     |     | /courses/{{courseSlug}}/sections/{{sectionId}}/lessons` | 201 | valid Tiptap JSON |                      |     |                         |                       |     |                                    |             |     |            |       |     |             |
| pi/courses/{{courseSlug}}/sections/{{sectionId}}/lessons` | 200                       | list dengan content preview    |                  |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    |             |     |            |       |     |             |
| ./lessons/{{lessonId}}`                                   | 200                       | full content + section info    |                  |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    |             |     |            |       |     |             |
| PUT                                                       |                           |                                |                  |     |     |     |                                                         |     |                   | essons/{{lessonId}}` | 200 | version harus increment |                       |     |                                    |             |     |            |       |     |             |
| DELE                                                      |                           |                                |                  |     |     |     |                                                         |     |                   |                      |     |                         | lessons/{{lessonId}}` | 200 | response: `{ deletedProgress: N }` |             |     |            |       |     |             |
| ./lessons`                                                | 400                       | content.type bukan "doc"       |                  |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    |             |     |            |       |     |             |
| `.../lessons`                                             | 400                       | content.version missing atau 0 |                  |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    |             |     |            |       |     |             |
| POST                                                      |                           |                                |                  |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    | ../lessons` | 401 | tanpa auth |       |     |             |
| POST                                                      |                           |                                |                  |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    |             |     |            | sons` | 403 | bukan owner |
| T                                                         | `.../lessons/nonexistent` | 404                            | lesson tidak ada |     |     |     |                                                         |     |                   |                      |     |                         |                       |     |                                    |             |     |            |       |     |             |

Testk version increment:
```javascript
pm.test("Version incremented", () => {
  const before = pm.collectionVariables.get("lessonVersion")
  const after = pm.response.json().content.version
  pm.expect(after).to.equal(Number(before) + 1)
})
```

### 13.3 progress.postman_collection.json

Collection variables:
- `baseUrl`, `courseSlug`, `lessonId`, `authToken` (student token)

Requests:

| Method                                    | Endpoint | Expected                           | Notes |     |     |     |                                 |     |                                                  |                             |     |                          |                                        |     |            |                               |     |            |
| -------------------------------------------| ----------| ------------------------------------| -------| -----| -----| -----| ---------------------------------| -----| --------------------------------------------------| -----------------------------| -----| --------------------------| ----------------------------------------| -----| ------------| -------------------------------| -----| ------------|
| pi/progress/lesson/{{lessonId}}/complete` | 200      | `{ completed: true, completedAt }` |       |     |     |     |                                 |     |                                                  |                             |     |                          |                                        |     |            |                               |     |            |
| GET                                       |          |                                    |       |     |     |     | progress/course/{{courseSlug}}` | 200 | `{ percentage, completedLessons, totalLessons }` |                             |     |                          |                                        |     |            |                               |     |            |
| GET                                       |          |                                    |       |     |     |     |                                 |     |                                                  | ogress/lesson/{{lessonId}}` | 200 | `{ completed: boolean }` |                                        |     |            |                               |     |            |
| POS                                       |          |                                    |       |     |     |     |                                 |     |                                                  |                             |     |                          | progress/lesson/{{lessonId}}/complete` | 401 | tanpa auth |                               |     |            |
| GET                                       |          |                                    |       |     |     |     |                                 |     |                                                  |                             |     |                          |                                        |     |            | ogress/course/{{courseSlug}}` | 401 | tanpa auth |

---Task 14: E2E Tests — Creator Workflow

### File

`__tests__/playwright/content/creator/manage-course.spec.ts`

### Setup Pattern

Ikuti pola yang sama dengan `course-list.spec.ts` — gunakan `clerk.signIn()` dari `@clerk/testing/playwright` dan `waitForPageLoad()` dari utils.

```typescript
import { test, expect } from '@playwright/test'
import { clerk } from '@clerk/testing/playwright'
import { testUsers } from '../../fixtures/test-users'
import { waitForPageLoad } from '../../utils/test-helpers'

const MANAGE_URL = /\/creator\/courses\/.+\/manage/

test.describe('Creator Manage Course — Authenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await clerk.signIn({
      page,
      signInParams: {
        strategy: 'password',
        identifier: testUsers.creatorUser.identifier,
        password: testUsers.creatorUser.password,
      },
    })
  })
  // ... tests
})
```

### Test Scenarios

**14.2 — Halaman manage tampil**
```typescript
test('manage page loads with section list', async ({ page }) => {
  await page.goto('/creator/courses')
  await waitForPageLoad(page)
  await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

  const manageBtn = page.getByTestId('manage-course-btn').first()
  const hasManage = await manageBtn.isVisible().catch(() => false)
  if (!hasManage) { console.log('ℹ️ No courses, skipping'); return }

  await manageBtn.click()
  await page.waitForURL(MANAGE_URL, { timeout: 10000 })
  await expect(page.locator('h1, h2')).toBeVisible()
})
```

**14.3 — Buat section baru**
```typescript
test('create new section appears in list', async ({ page }) => {
  await page.goto('/creator/courses')
  await waitForPageLoad(page)
  await page.waitForSelector('[data-testid="course-grid"], [data-testid="empty-state"]', { timeout: 15000 })

  const manageBtn = page.getByTestId('manage-course-btn').first()
  if (!await manageBtn.isVisible().catch(() => false)) { return }
  await manageBtn.click()
  await page.waitForURL(MANAGE_URL, { timeout: 10000 })

  const addSectionBtn = page.getByRole('button', { name: /\+ seksi|tambah seksi/i })
  await expect(addSectionBtn).toBeVisible({ timeout: 10000 })
  await addSectionBtn.click()

  await page.getByLabel(/judul seksi/i).fill('Seksi Test E2E')
  await page.getByLabel(/urutan/i).fill('99')
  await page.getByRole('button', { name: /simpan|buat/i }).click()

  await expect(page.locator('body')).toContainText('Seksi Test E2E', { timeout: 8000 })
})
```

**14.4 — Buat lesson dengan Tiptap content**
```typescript
test('create lesson saves with Tiptap content', async ({ page }) => {
  // Navigate to manage page (same setup as above)
  // ...

  const addLessonBtn = page.getByRole('button', { name: /\+ pelajaran|tambah pelajaran/i }).first()
  await expect(addLessonBtn).toBeVisible({ timeout: 10000 })
  await addLessonBtn.click()

  await page.getByLabel(/judul pelajaran/i).fill('Pelajaran Test E2E')
  // Tiptap editor — type into contenteditable
  const editor = page.locator('.ProseMirror').first()
  await editor.click()
  await editor.type('Konten pelajaran test')

  await page.getByRole('button', { name: /simpan/i }).click()
  await expect(page.locator('body')).toContainText('Pelajaran Test E2E', { timeout: 8000 })
})
```

**14.5 — Edit lesson, version increment**
```typescript
test('edit lesson content increments version', async ({ page }) => {
  // Navigate to manage page, click existing lesson edit button
  const editBtn = page.getByTestId('edit-lesson-btn').first()
  await expect(editBtn).toBeVisible({ timeout: 10000 })

  const versionBefore = await page.getByTestId('lesson-version').textContent()
  await editBtn.click()

  const editor = page.locator('.ProseMirror').first()
  await editor.click()
  await editor.press('Control+a')
  await editor.type('Konten yang diupdate')

  await page.getByRole('button', { name: /simpan/i }).click()
  await page.waitForTimeout(1000)

  const versionAfter = await page.getByTestId('lesson-version').textContent()
  expect(Number(versionAfter)).toBeGreaterThan(Number(versionBefore))
})
```

**14.6 — Reorder section**
```typescript
test('reorder section changes order in UI', async ({ page }) => {
  // Requires at least 2 sections
  const sections = page.getByTestId('section-item')
  const count = await sections.count()
  if (count < 2) { console.log('ℹ️ Need 2+ sections, skipping'); return }

  const firstTitle = await sections.first().getByTestId('section-title').textContent()
  await sections.first().getByTestId('move-down-btn').click()
  await page.waitForTimeout(500)

  const newFirstTitle = await sections.first().getByTestId('section-title').textContent()
  expect(newFirstTitle).not.toBe(firstTitle)
})
```

**14.7 — Delete section cascade**
```typescript
test('delete section removes it and its lessons', async ({ page }) => {
  const sections = page.getByTestId('section-item')
  const countBefore = await sections.count()
  if (countBefore === 0) { return }

  await sections.last().getByTestId('delete-section-btn').click()
  // Confirm dialog
  await page.getByRole('button', { name: /hapus|konfirmasi/i }).click()
  await page.waitForTimeout(1000)

  const countAfter = await page.getByTestId('section-item').count()
  expect(countAfter).toBe(countBefore - 1)
})
```

**14.8 — Unauthenticated redirect**
```typescript
test.describe('Creator Manage — Access Control', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('unauthenticated redirects to sign-in', async ({ page }) => {
    await page.goto('/creator/courses/test-slug/manage')
    await waitForPageLoad(page)
    await expect(page).toHaveURL(/sign-in/)
  })
})
```

---

## Task 15: E2E Tests — Student Learn Workflow

### File

`__tests__/playwright/content/student/learn.spec.ts`

### Setup Pattern

Sama dengan catalog.spec.ts — gunakan `clerk.signIn()` dengan `testUsers.regularUser`.

### Test Scenarios

**15.2 — Halaman learn tampil dengan sidebar**
```typescript
test('learn page loads with sidebar sections', async ({ page }) => {
  // Navigate to a course the student is enrolled in
  await page.goto('/student/courses')
  await waitForPageLoad(page)

  const learnBtn = page.getByRole('link', { name: /lanjut belajar/i }).first()
  const hasLearn = await learnBtn.isVisible().catch(() => false)
  if (!hasLearn) { console.log('ℹ️ No enrolled courses, skipping'); return }

  await learnBtn.click()
  await page.waitForURL(/\/learn/, { timeout: 10000 })

  // Sidebar visible
  await expect(page.getByTestId('course-navigation')).toBeVisible({ timeout: 10000 })
  // Progress bar visible
  await expect(page.getByTestId('progress-bar')).toBeVisible()
})
```

**15.3 — Klik lesson render Tiptap content**
```typescript
test('clicking lesson renders Tiptap content', async ({ page }) => {
  // (after navigating to learn page)
  const lessonLink = page.getByTestId('lesson-nav-item').first()
  const hasLesson = await lessonLink.isVisible().catch(() => false)
  if (!hasLesson) { return }

  await lessonLink.click()
  await page.waitForTimeout(1000)

  // Tiptap viewer renders content
  await expect(page.locator('.ProseMirror')).toBeVisible({ timeout: 8000 })
})
```

**15.4 — Mark complete, checkmark muncul**
```typescript
test('mark complete shows checkmark in sidebar', async ({ page }) => {
  const markCompleteBtn = page.getByRole('button', { name: /tandai selesai/i })
  const hasBtn = await markCompleteBtn.isVisible().catch(() => false)
  if (!hasBtn) { return }

  await markCompleteBtn.click()
  // Button should change to completed state
  await expect(page.getByTestId('lesson-completed-badge')).toBeVisible({ timeout: 8000 })
  // Checkmark in sidebar
  await expect(page.getByTestId('lesson-nav-item').first().getByTestId('completed-check')).toBeVisible()
})
```

**15.5 — Progress bar update**
```typescript
test('progress bar updates after mark complete', async ({ page }) => {
  const progressBar = page.getByTestId('progress-bar')
  const percentageBefore = await progressBar.getAttribute('aria-valuenow')

  const markCompleteBtn = page.getByRole('button', { name: /tandai selesai/i })
  if (!await markCompleteBtn.isVisible().catch(() => false)) { return }
  await markCompleteBtn.click()

  await page.waitForTimeout(1500)
  const percentageAfter = await progressBar.getAttribute('aria-valuenow')
  expect(Number(percentageAfter)).toBeGreaterThanOrEqual(Number(percentageBefore))
})
```

**15.6 — Navigasi next lesson**
```typescript
test('next lesson button loads next lesson', async ({ page }) => {
  const nextBtn = page.getByTestId('next-lesson-btn')
  const isEnabled = await nextBtn.isEnabled().catch(() => false)
  if (!isEnabled) { console.log('ℹ️ Already on last lesson, skipping'); return }

  const currentUrl = page.url()
  await nextBtn.click()
  await page.waitForTimeout(1000)

  expect(page.url()).not.toBe(currentUrl)
})
```

**15.7 — Progress persists setelah refresh**
```typescript
test('progress persists after page refresh', async ({ page }) => {
  // Mark a lesson complete first
  const markCompleteBtn = page.getByRole('button', { name: /tandai selesai/i })
  if (await markCompleteBtn.isVisible().catch(() => false)) {
    await markCompleteBtn.click()
    await page.waitForTimeout(1000)
  }

  await page.reload()
  await waitForPageLoad(page)

  // Completed badge should still be visible
  await expect(page.getByTestId('lesson-completed-badge')).toBeVisible({ timeout: 8000 })
})
```

**15.8 — Unauthenticated redirect**
```typescript
test.describe('Student Learn — Access Control', () => {
  test.use({ storageState: { cookies: [], origins: [] } })

  test('unauthenticated redirects to sign-in', async ({ page }) => {
    await page.goto('/course/test-slug/learn')
    await waitForPageLoad(page)
    await expect(page).toHaveURL(/sign-in/)
  })
})
```

---

## Task 16: Manual Test Documentation

### File

`docs/testing/manual-test-content-management.md`

### Structure (ikuti format `manual-test-course-discovery.md`)

```
# Manual Test Checklist: Course Content Management

## Persiapan
- Aplikasi berjalan di http://localhost:3000
- DB memiliki minimal 1 course PUBLISHED dengan sections dan lessons
- Akun creator tersedia
- Akun student tersedia dan sudah enrolled ke course tersebut

## 1. Creator Workflow
### 1.1 Buat Section
### 1.2 Buat Lesson dengan Tiptap Content
### 1.3 Edit Lesson (version increment)
### 1.4 Reorder Section
### 1.5 Delete Section (cascade)

## 2. Student Workflow
### 2.1 Navigasi ke Lesson
### 2.2 Baca Konten Tiptap
### 2.3 Mark Complete
### 2.4 Progress Bar Update
### 2.5 Navigasi Prev/Next
### 2.6 Progress Persistence (refresh)

## 3. Authorization
### 3.1 Unauthenticated Access
### 3.2 Creator Akses Course Milik Orang Lain
### 3.3 Student Akses Creator Endpoint

## 4. Error Scenarios
### 4.1 Invalid Tiptap JSON
### 4.2 Duplicate Section Order
### 4.3 Section/Lesson Tidak Ada (404)
### 4.4 Server Error Handling

## Catatan Test
| No | Temuan | Severity | Status |
```

---

## Execution Order

```
Task 13 (Postman) — tidak ada dependency, bisa dikerjakan paralel
  └── 13.1 sections → 13.2 lessons → 13.3 progress

Task 14 (E2E Creator) — butuh app running + test user creator
  └── 14.1 setup file → 14.2-14.8 tests

Task 15 (E2E Student) — butuh app running + test user student enrolled
  └── 15.1 setup file → 15.2-15.8 tests

Task 16 (Manual Docs) — bisa dikerjakan kapan saja
  └── 16.1 buat file → 16.2-16.5 isi checklist
```

### Dependencies

- Task 14 & 15 butuh `__tests__/playwright/fixtures/test-users.ts` dan `__tests__/playwright/utils/test-helpers.ts` yang sudah ada
- Task 14 & 15 butuh `playwright.config.ts` yang sudah dikonfigurasi (sudah ada)
- Postman collections butuh server running di `http://localhost:3000`
- E2E tests butuh `CLERK_SECRET_KEY` dan test user credentials di `.env.test`

### Run Commands

```bash
# Run E2E tests (single run, no watch)
yarn playwright test __tests__/playwright/content/

# Run specific spec
yarn playwright test __tests__/playwright/content/creator/manage-course.spec.ts

# Run with UI
yarn playwright test --ui
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-19
