sidebar overview button shows course overview panel
course/creator/manage-course.spec.ts:97

Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected substring: "Overview Kursus"
Received string:    "Test Kursus 1775911112386PemrogramanPemulaDraft0 seksi · 0 pelajaranDeskripsiDeskripsi kursus test yang valid untuk E2E"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('main')
    9 × locator resolved to <main class="flex-1 overflow-y-auto p-8">…</main>
      - unexpected value "Test Kursus 1775911112386PemrogramanPemulaDraft0 seksi · 0 pelajaranDeskripsiDeskripsi kursus test yang valid untuk E2E"


  109 |
  110 |     // Main content should show overview
> 111 |     await expect(page.locator('main')).toContainText('Overview Kursus')
      |                                        ^
  112 |   })
  113 |
  114 |   test('+ Seksi button opens section creation dialog', async ({ page }) => {
    at D:\.maguru\maguru\__tests__\playwright\course\creator\manage-course.spec.ts:111:40



sidebar overview button shows course overview panel
course/creator/manage-course.spec.ts:97



Error: expect(locator).toContainText(expected) failed

Locator: locator('main')
Expected substring: "Overview Kursus"
Received string:    "Test Kursus 1775911112386PemrogramanPemulaDraft0 seksi · 0 pelajaranDeskripsiDeskripsi kursus test yang valid untuk E2E"
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('main')
    9 × locator resolved to <main class="flex-1 overflow-y-auto p-8">…</main>
      - unexpected value "Test Kursus 1775911112386PemrogramanPemulaDraft0 seksi · 0 pelajaranDeskripsiDeskripsi kursus test yang valid untuk E2E"


  109 |
  110 |     // Main content should show overview
> 111 |     await expect(page.locator('main')).toContainText('Overview Kursus')
      |                                        ^
  112 |   })
  113 |
  114 |   test('+ Seksi button opens section creation dialog', async ({ page }) => {
    at D:\.maguru\maguru\__tests__\playwright\course\creator\manage-course.spec.ts:111:40