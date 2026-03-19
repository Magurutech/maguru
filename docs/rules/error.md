(base) PS D:\.maguru\maguru> yarn test:e2e
yarn run v1.22.22
$ cross-env NODE_ENV=test  playwright test __tests__/playwright/course/creator/course-list.spec.ts
[dotenv@17.3.1] injecting env (17) from .env.test -- tip: ⚙️  override existing env vars with { override: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

Running 8 tests using 2 workers



[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
[1/8] [global setup] › __tests__\playwright\global.setup.ts:27:6 › global setup 
[global setup] › __tests__\playwright\global.setup.ts:27:6 › global setup
🔐 Setting up Clerk testing token...
✅ Environment variables loaded successfully
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🛡️ auth for agents: https://vestauth.com
[2/8] … Page — Authenticated Creator › page loads with correct heading and statsct with { processEnv: myObject }
[3/8] …Page — Authenticated Creator › course grid shows cards when courses exist
[4/8] … Authenticated Creator › "Manage" button on card redirects to manage page
[5/8] …uthenticated Creator › "Buat Kursus Baru" button redirects to create page
[6/8] …age — Authenticated Creator › empty state shows "Buat Kursus Pertama" CTA
[7/8] …age — Authenticated Creator › back button redirects to /creator dashboard
  1) [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:125:7 › Creator Course List Page — Authenticated Creator › back button redirects to /creator dashboard 

    Error: expect(locator).toBeVisible() failed

    Locator: getByTestId('back-to-dashboard-btn')
    Expected: visible
    Timeout: 5000ms
    Error: element(s) not found

    Call log:
      - Expect "toBeVisible" with timeout 5000ms
      - waiting for getByTestId('back-to-dashboard-btn')


      129 |
      130 |     const backBtn = page.getByTestId('back-to-dashboard-btn')       
    > 131 |     await expect(backBtn).toBeVisible()
          |                           ^
      132 |     await backBtn.click()
      133 |
      134 |     await page.waitForURL('/creator', { timeout: 5000 })
        at D:\.maguru\maguru\__tests__\playwright\course\creator\course-list.spe
                                                                               ec.ts:131:27

    attachment #1: screenshot (image/png) ──────────────────────────────────────
    services\test-results\course-creator-course-list-f8880-irects-to-creator-das
                                                                               shboard-chromium\test-failed-1.png
    ────────────────────────────────────────────────────────────────────────────

    attachment #2: video (video/webm) ──────────────────────────────────────────
    services\test-results\course-creator-course-list-f8880-irects-to-creator-das
                                                                               shboard-chromium\video.webm
    ────────────────────────────────────────────────────────────────────────────

    Error Context: services\test-results\course-creator-course-list-f8880-irects
                                                                               s-to-creator-dashboard-chromium\error-context.md


…List Page — Authenticated Creator › empty state shows "Buat Kursus Pertama" CTA
ℹ️ Creator has courses, skipping empty state test

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  suppress all logs with { quiet: true }

[8/8] …ge — Access Control › unauthenticated user cannot access /creator/courses
  1 failed
    [chromium] › __tests__\playwright\course\creator\course-list.spec.ts:125:7 ›
                                                                               › Creator Course List Page — Authenticated Creator › back button redirects to /cr
                                                                               reator dashboard
  7 passed (1.4m)

  Serving HTML report at http://localhost:9323. Press Ctrl+C to quit.
