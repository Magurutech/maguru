(base) PS D:\.maguru\maguru> yarn test:e2e __tests__/playwright/course/creator/version-tracking.spec.ts
yarn run v1.22.22
$ cross-env NODE_ENV=test  playwright test __tests__/playwright/course/creator __tests__/playwright/course/creator/version-tracking.spec.ts
[dotenv@17.3.1] injecting env (17) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

Running 39 tests using 2 workers
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🤖 agentic secret storage: https://dotenvx.com/as2
[global setup] › __tests__\playwright\global.setup.ts:27:6 › global setup
🔐 Setting up Clerk testing token...
✅ Environment variables loaded successfully                                                                                                                                                                                                              
[dotenv@17.2.2] injecting env (10) from .env.local,.env -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild                                                                                                                          
✅ Clerk testing token initialized successfully
Assertion failed: !(handle->flags & UV_HANDLE
_CLOSING), file src\win\async.c, line 76                                                                                                                                                                                                                  

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 prevent building .env in docker: https://dotenvx.com/prebuild
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  override existing env vars with { override: true }                                                                                                                                           
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:33:13 › Creator Course List Page — Authenticated Creator › course grid shows cards when courses exist
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:20:13 › Creator Course List Page — Authenticated Creator › page loads with correct heading and stats
🔐 Auto-authenticated as creator
  1) [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:33:13 › Creator Course List Page — Authenticated Creator › course grid shows cards when courses exist 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-d440d-ws-cards-when-courses-exist-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-d440d-ws-cards-when-courses-exist-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-course-list-d440d-ws-cards-when-courses-exist-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:58:13 › Creator Course List Page — Authenticated Creator › "Buat Kursus Baru" button redirects to create page
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:46:13 › Creator Course List Page — Authenticated Creator › "Manage" button on card redirects to manage page
🔐 Auto-authenticated as creator
  2) [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:46:13 › Creator Course List Page — Authenticated Creator › "Manage" button on card redirects to manage page 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-0da19-rd-redirects-to-manage-page-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-course-list-0da19-rd-redirects-to-manage-page-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-course-list-0da19-rd-redirects-to-manage-page-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  write to custom object with { processEnv: myObject }
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:70:13 › Creator Course List Page — Authenticated Creator › back button redirects to /creator dashboard
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:23:20 › Course Creation Form — Validation › submitting empty form shows validation errors
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:43:20 › Course Creation Form — Validation › title exceeding 100 chars shows validation error
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:53:20 › Course Creation Form — Validation › title character counter updates correctly
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:61:20 › Course Creation Form — Validation › error clears when user starts typing
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:73:20 › Course Creation Form — Validation › submit button shows loading state during submission
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\create-course.spec.ts:103:20 › Course Creation Form — Validation › successful submission redirects to manage page
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:21:13 › Creator Dashboard — Authenticated Creator › dashboard shows stats with real data
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:38:13 › Creator Dashboard — Authenticated Creator › dashboard shows course list with enrollment count
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:62:13 › Creator Dashboard — Authenticated Creator › clicking course item redirects to manage page
🔐 Auto-authenticated as creator
  3) [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:38:13 › Creator Dashboard — Authenticated Creator › dashboard shows course list with enrollment count 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-db2c4--list-with-enrollment-count-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-db2c4--list-with-enrollment-count-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-dashboard-C-db2c4--list-with-enrollment-count-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
  4) [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:62:13 › Creator Dashboard — Authenticated Creator › clicking course item redirects to manage page 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-68d65-em-redirects-to-manage-page-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-dashboard-C-68d65-em-redirects-to-manage-page-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-dashboard-C-68d65-em-redirects-to-manage-page-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:76:13 › Creator Dashboard — Authenticated Creator › "Lihat Semua" button redirects to /creator/courses
🔐 Auto-authenticated as creator
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  write to custom object with { processEnv: myObject }
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:86:13 › Creator Dashboard — Authenticated Creator › "Buat Kursus Baru" button links to create page
🔐 Auto-authenticated as creator
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:26:14 › Task 14: Creator Content Management Workflow › 14.2 — akses halaman manage dengan auth creator
🔐 Auto-authenticated as creator
  5) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:26:14 › Task 14: Creator Content Management Workflow › 14.2 — akses halaman manage dengan auth creator 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-370e2--manage-dengan-auth-creator-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-370e2--manage-dengan-auth-creator-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-370e2--manage-dengan-auth-creator-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛡️ auth for agents: https://vestauth.com
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:49:14 › Task 14: Creator Content Management Workflow › 14.4 — buat lesson baru dengan Tiptap content
🔐 Auto-authenticated as creator
  6) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:49:14 › Task 14: Creator Content Management Workflow › 14.4 — buat lesson baru dengan Tiptap content 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-2c9c1--baru-dengan-Tiptap-content-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-2c9c1--baru-dengan-Tiptap-content-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-2c9c1--baru-dengan-Tiptap-content-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚡️ secrets for agents: https://dotenvx.com/as2
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:42:14 › Task 14: Creator Content Management Workflow › 14.3 — buat seksi baru muncul di sidebar
🔐 Auto-authenticated as creator
  7) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:42:14 › Task 14: Creator Content Management Workflow › 14.3 — buat seksi baru muncul di sidebar 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-094b7-eksi-baru-muncul-di-sidebar-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-094b7-eksi-baru-muncul-di-sidebar-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-094b7-eksi-baru-muncul-di-sidebar-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:89:14 › Task 14: Creator Content Management Workflow › 14.5 — edit lesson, konten berubah setelah save
🔐 Auto-authenticated as creator
  8) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:89:14 › Task 14: Creator Content Management Workflow › 14.5 — edit lesson, konten berubah setelah save 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-229f7-konten-berubah-setelah-save-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-229f7-konten-berubah-setelah-save-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-229f7-konten-berubah-setelah-save-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:138:14 › Task 14: Creator Content Management Workflow › 14.6 — reorder section via drag and drop
🔐 Auto-authenticated as creator
  9) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:138:14 › Task 14: Creator Content Management Workflow › 14.6 — reorder section via drag and drop 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-a1d09-r-section-via-drag-and-drop-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-a1d09-r-section-via-drag-and-drop-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-a1d09-r-section-via-drag-and-drop-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  override existing env vars with { override: true }
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:190:14 › Task 14: Creator Content Management Workflow › 14.7 — delete section cascade delete lessons
🔐 Auto-authenticated as creator
  10) [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:190:14 › Task 14: Creator Content Management Workflow › 14.7 — delete section cascade delete lessons 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-09ee1-tion-cascade-delete-lessons-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-lesson-cour-09ee1-tion-cascade-delete-lessons-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-lesson-cour-09ee1-tion-cascade-delete-lessons-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:32:13 › Course Manage Page — Authenticated Creator › publish/unpublish toggle changes status without full reload
🔐 Auto-authenticated as creator
  11) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:32:13 › Course Manage Page — Authenticated Creator › publish/unpublish toggle changes status without full reload 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-c233e--status-without-full-reload-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-c233e--status-without-full-reload-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-c233e--status-without-full-reload-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:21:13 › Course Manage Page — Authenticated Creator › manage page header shows course info and publish button
🔐 Auto-authenticated as creator
  12) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:21:13 › Course Manage Page — Authenticated Creator › manage page header shows course info and publish button 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-6632b-rse-info-and-publish-button-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-6632b-rse-info-and-publish-button-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-6632b-rse-info-and-publish-button-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:55:13 › Course Manage Page — Authenticated Creator › sidebar overview button shows course overview panel
🔐 Auto-authenticated as creator
  13) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:55:13 › Course Manage Page — Authenticated Creator › sidebar overview button shows course overview panel 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-4a5f6-shows-course-overview-panel-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-4a5f6-shows-course-overview-panel-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-4a5f6-shows-course-overview-panel-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:68:13 › Course Manage Page — Authenticated Creator › + Seksi button opens section creation dialog
🔐 Auto-authenticated as creator
  14) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:68:13 › Course Manage Page — Authenticated Creator › + Seksi button opens section creation dialog 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-37dc8-ens-section-creation-dialog-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-37dc8-ens-section-creation-dialog-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-37dc8-ens-section-creation-dialog-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛠️  run anywhere with `dotenvx run -- yourcommand`
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:78:13 › Course Manage Page — Authenticated Creator › back button redirects to /creator/courses
🔐 Auto-authenticated as creator
  15) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:78:13 › Course Manage Page — Authenticated Creator › back button redirects to /creator/courses 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-b0888-edirects-to-creator-courses-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-b0888-edirects-to-creator-courses-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-b0888-edirects-to-creator-courses-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:88:13 › Course Manage Page — Authenticated Creator › section expand/collapse in sidebar
🔐 Auto-authenticated as creator
  16) [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:88:13 › Course Manage Page — Authenticated Creator › section expand/collapse in sidebar 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-9c72e--expand-collapse-in-sidebar-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-manage-cour-9c72e--expand-collapse-in-sidebar-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-manage-cour-9c72e--expand-collapse-in-sidebar-chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:20:13 › Feature 1: Version Tracking Fix › 1.1 — CREATE lesson should have version = 1
🔐 Auto-authenticated as creator
  17) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:20:13 › Feature 1: Version Tracking Fix › 1.1 — CREATE lesson should have version = 1 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-b7e69-esson-should-have-version-1-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-b7e69-esson-should-have-version-1-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-b7e69-esson-should-have-version-1-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:72:13 › Feature 1: Version Tracking Fix › 1.2 — UPDATE lesson should increment version (1 → 2)
🔐 Auto-authenticated as creator
  18) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:72:13 › Feature 1: Version Tracking Fix › 1.2 — UPDATE lesson should increment version (1 → 2) 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-f9dec-ld-increment-version-1-→-2--chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-f9dec-ld-increment-version-1-→-2--chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-f9dec-ld-increment-version-1-→-2--chromium\error-context.md

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:122:13 › Feature 1: Version Tracking Fix › 1.3 — Multiple saves should increment version monotonically
🔐 Auto-authenticated as creator
  19) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:122:13 › Feature 1: Version Tracking Fix › 1.3 — Multiple saves should increment version monotonically 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-7645d-ement-version-monotonically-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-7645d-ement-version-monotonically-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-7645d-ement-version-monotonically-chromium\error-context.md

[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:183:13 › Feature 1: Version Tracking Fix › 1.4 — Version should persist after page reload
🔐 Auto-authenticated as creator
  20) [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:183:13 › Feature 1: Version Tracking Fix › 1.4 — Version should persist after page reload 

    Error: Failed to create course: 405 -

       at utils\api-helpers.ts:122

      120 |   if (!response.ok()) {
      121 |     const error = await response.text()
    > 122 |     throw new Error(`Failed to create course: ${response.status()} - ${error}`)
          |           ^
      123 |   }
      124 |
      125 |   const course = await response.json()
        at createCourseViaAPI (D:\.maguru\maguru\__tests__\playwright\utils\api-helpers.ts:122:11)
        at Object.testCourse (D:\.maguru\maguru\__tests__\playwright\fixtures\course.fixture.ts:31:20)

    attachment #1: screenshot (image/png) ──────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-248b5-d-persist-after-page-reload-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────────────────────────
    services\test-results\course-creator-version-tra-248b5-d-persist-after-page-reload-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-version-tra-248b5-d-persist-after-page-reload-chromium\error-context.md

  20 failed
    [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:33:13 › Creator Course List Page — Authenticated Creator › course grid shows cards when courses exist 
    [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:46:13 › Creator Course List Page — Authenticated Creator › "Manage" button on card redirects to manage page
    [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:38:13 › Creator Dashboard — Authenticated Creator › dashboard shows course list with enrollment count
    [chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:62:13 › Creator Dashboard — Authenticated Creator › clicking course item redirects to manage page
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:26:14 › Task 14: Creator Content Management Workflow › 14.2 — akses halaman manage dengan auth creator
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:42:14 › Task 14: Creator Content Management Workflow › 14.3 — buat seksi baru muncul di sidebar
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:49:14 › Task 14: Creator Content Management Workflow › 14.4 — buat lesson baru dengan Tiptap content
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:89:14 › Task 14: Creator Content Management Workflow › 14.5 — edit lesson, konten berubah setelah save
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:138:14 › Task 14: Creator Content Management Workflow › 14.6 — reorder section via drag and drop
    [chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:190:14 › Task 14: Creator Content Management Workflow › 14.7 — delete section cascade delete lessons
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:21:13 › Course Manage Page — Authenticated Creator › manage page header shows course info and publish button
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:32:13 › Course Manage Page — Authenticated Creator › publish/unpublish toggle changes status without full reload
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:55:13 › Course Manage Page — Authenticated Creator › sidebar overview button shows course overview panel
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:68:13 › Course Manage Page — Authenticated Creator › + Seksi button opens section creation dialog
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:78:13 › Course Manage Page — Authenticated Creator › back button redirects to /creator/courses
    [chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:88:13 › Course Manage Page — Authenticated Creator › section expand/collapse in sidebar
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:20:13 › Feature 1: Version Tracking Fix › 1.1 — CREATE lesson should have version = 1
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:72:13 › Feature 1: Version Tracking Fix › 1.2 — UPDATE lesson should increment version (1 → 2)
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:122:13 › Feature 1: Version Tracking Fix › 1.3 — Multiple saves should increment version monotonically
    [chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:183:13 › Feature 1: Version Tracking Fix › 1.4 — Version should persist after page reload
  19 passed (4.6m)

  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
