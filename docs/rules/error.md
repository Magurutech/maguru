(base) PS D:\.maguru\maguru> yarn test:e2e __tests__/playwright/course/creator/version-tracking.spec.ts
yarn run v1.22.22
$ cross-env NODE_ENV=test  playwright test __tests__/playwright/course/creator __tests__/playwright/course/creator/version-tracking.spec.ts
[dotenv@17.3.1] injecting env (17) from .env.test -- tip: ⚙️  override existing env vars with { override: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  write to custom object with { processEnv: myObject }

Running 41 tests using 2 workers
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
Running 41 tests using 2 workers
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  load multiple .env files with { path: ['.env.local', '.env'] }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  enable debug logging with { debug: true }
[global setup] › __tests__\playwright\global.setup.ts:27:6 › global setup
🔐 Setting up Clerk testing token...
✅ Environment variables loaded successfully
[dotenv@17.2.2] injecting env (10) from .env.local,.env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
✅ Clerk testing token initialized successfully
Assertion failed: !(handle->flags & UV_HANDLE_CLOSING), file src\win\async
.c, line 76

[dotenv@17.3.1] injecting env (0) from .env.test -- tip: ⚙️  suppress all logs with { quiet: true }
[dotenv@17.3.1] injecting env (0) from .env.test -- tip: 🔐 prevent committing .env to code: https://dotenvx.com/precommit
[chromium] › __tests__\playwright\course\creator\course-list.spec.ts:103:7 › Creator Course List Page — Authenticated Creator › empty state shows "Buat Kursus Pertama" CTA
ℹ️ Creator has courses, skipping empty state test
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:79:7 › Creator Dashboard — Authenticated Creator › clicking course item redirects to manage page
ℹ️ No courses available, skipping redirect test
[chromium] › __tests__\playwright\course\creator\dashboard.spec.ts:122:7 › Creator Dashboard — Authenticated Creator › empty state shows "Buat Kursus Pertama" CTA
ℹ️ Creator has courses, skipping empty state test
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:63:7 › Task 14: Creator Content Management Workflow › 14.2 — akses halaman manage dengan auth creator
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:87:7 › Task 14: Creator Content Management Workflow › 14.3 — buat seksi baru muncul di sidebar
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:124:7 › Task 14: Creator Content Management Workflow › 14.4 — buat lesson baru dengan Tiptap content
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:185:7 › Task 14: Creator Content Management Workflow › 14.5 — edit lesson, konten berubah setelah save
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:245:7 › Task 14: Creator Content Management Workflow › 14.6 — reorder section via drag and drop
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\lesson-course.spec.ts:297:7 › Task 14: Creator Content Management Workflow › 14.7 — delete section cascade delete lessons
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:67:7 › Course Manage Page — Authenticated Creator › publish/unpublish toggle changes status without full reload
ℹ️ No courses available, skipping test
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:49:7 › Course Manage Page — Authenticated Creator › manage page header shows course info and publish button
ℹ️ No courses available, skipping test
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:97:7 › Course Manage Page — Authenticated Creator › sidebar overview button shows course overview panel
ℹ️ No courses available, skipping test
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:117:7 › Course Manage Page — Authenticated Creator › + Seksi button opens section creation dialog
ℹ️ No courses available, skipping test
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:134:7 › Course Manage Page — Authenticated Creator › back button redirects to /creator/courses
ℹ️ No courses available, skipping test
[chromium] › __tests__\playwright\course\creator\manage-course.spec.ts:151:7 › Course Manage Page — Authenticated Creator › section expand/collapse in sidebar
ℹ️ No courses available, skipping test
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:55:7 › Feature 1: Version Tracking Fix › 1.1 — CREATE lesson should have version = 1
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:167:7 › Feature 1: Version Tracking Fix › 1.3 — Multiple saves should increment version monotonically
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:112:7 › Feature 1: Version Tracking Fix › 1.2 — UPDATE lesson should increment version (1 → 2)
ℹ️ No courses available, skipping
[chromium] › __tests__\playwright\course\creator\version-tracking.spec.ts:234:7 › Feature 1: Version Tracking Fix › 1.4 — Version should persist after page reload
ℹ️ No courses available, skipping
  41 passed (6.3m)

To open last HTML report run:

  yarn playwright show-report services\playwright-report

Done in 385.77s.