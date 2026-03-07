# Dashboard E2E Tests

End-to-end tests for the dashboard feature using Playwright and Clerk authentication.

## 📁 File Structure

```
dashboard/
├── helpers.ts           # Reusable selectors and utility functions
├── auth.spec.ts         # Role-based access control tests (9 tests)
├── actions.spec.ts      # Button navigation and interaction tests (5 tests)
└── edge-cases.spec.ts   # Error handling and edge case tests (7 tests)
```

---

## 📄 File Descriptions

### `helpers.ts`
**Purpose**: Shared utilities and selectors for all dashboard tests.

**Exports**:
- `DASHBOARD_SELECTORS` - Centralized element selectors (stats, buttons, cards)
- `DASHBOARD_CONTENT_BY_ROLE` - Expected content per role (user/creator/admin)
- `gotoDashboard()` - Navigate to dashboard and wait for load
- `waitForDashboardLoad()` - Wait for skeleton to disappear
- `verifyDashboardStats()` - Check if stats are displayed
- `verifyQuickActions()` - Check if action buttons exist
- `verifyDashboardHeader()` - Verify title and role badge
- `getCourseCards()` - Get all course card elements
- `getCourseProgress()` - Extract progress percentage from card

**Usage Example**:
```ts
import { gotoDashboard, verifyDashboardStats } from './helpers'

await gotoDashboard(page)
await verifyDashboardStats(page, ['Kursus Diikuti', 'Kursus Selesai'])
```

---

### `auth.spec.ts`
**Purpose**: Tests for role-based access control (RBAC) on the dashboard.

**Test Groups**:

| Group | Tests | What It Verifies |
|-------|-------|------------------|
| User Role | 4 tests | Learner sees learner-specific stats, header, actions, continue buttons |
| Creator Role | 3 tests | Creator sees creator stats, header, Creator Studio button |
| Admin Role | 3 tests | Admin sees admin stats, header, Admin Panel button |
| Role Switching | 2 tests | Logout/login correctly switches dashboard content |

**Key Tests**:
- ✅ User sees "Kursus Diikuti" stats
- ✅ Creator sees "Creator Studio" button (NOT visible to user)
- ✅ Admin sees "Admin Panel" button (NOT visible to user/creator)
- ✅ Switching from user → creator updates dashboard correctly

**Dependencies**: `@clerk/testing/playwright`, `role-test-helpers.ts`

---

### `actions.spec.ts`
**Purpose**: Tests for quick action buttons and navigation.

**Test Groups**:

| Group | Tests | What It Verifies |
|-------|-------|------------------|
| User Actions | 3 tests | "Jelajahi", "Edit Profil", "Lihat Sertifikat" navigate correctly |
| Creator Actions | 2 tests | "Creator Studio" navigates, is first action |
| Admin Actions | 2 tests | "Admin Panel" navigates, is first action |
| Course Actions | 2 tests | "Lanjut" and "Review" buttons work |

**Key Tests**:
- ✅ "Jelajahi Kursus Baru" → navigates to `/courses` or `/catalog`
- ✅ "Creator Studio" → navigates to `/creator` or `/studio`
- ✅ "Admin Panel" → navigates to `/admin`
- ✅ "Lanjut" button → navigates to course learning page
- ✅ "Review" button → shows for 100% completed courses

**What's NOT Tested**: Visual effects (hover glow, animations), button colors/styles

---

### `edge-cases.spec.ts`
**Purpose**: Tests for error handling, empty states, and boundary conditions.

**Test Groups**:

| Group | Tests | What It Verifies |
|-------|-------|------------------|
| API Errors | 2 tests | Dashboard renders despite 500/503 errors |
| Empty States | 2 tests | No courses → empty state, no recommendations → hidden |
| Role Persistence | 3 tests | Role maintained across navigation, refresh, switch |
| Loading States | 2 tests | Skeleton shown while loading, slow network handled |
| Accessibility | 2 tests | Keyboard navigation works, ARIA labels present |

**Key Tests**:
- ✅ API 500 error → dashboard still renders (with fallback data)
- ✅ No courses → dashboard shows empty state gracefully
- ✅ Page refresh → user stays logged in, role preserved
- ✅ Tab key navigation → focuses buttons/links correctly
- ✅ Slow network → dashboard loads eventually (no timeout)

---

## 🎯 Testing Philosophy

### What We Test (Behavior)
- ✅ User can login and see dashboard
- ✅ Each role sees correct content
- ✅ Buttons click and navigate
- ✅ Errors are handled gracefully
- ✅ Empty states work correctly

### What We DON'T Test (Visual)
- ❌ Colors, shadows, borders
- ❌ Animation timing
- ❌ Hover effects (glow, lift)
- ❌ Design consistency
- ❌ Subjective appearance

**Rationale**: Visual tests are better suited for manual QA or Storybook. Playwright excels at **behavioral testing**.

---

## 🚀 Quick Start

```bash
# Run all dashboard tests
yarn test:e2e __tests__/playwright/dashboard/

# Run specific suite
yarn test:e2e __tests__/playwright/dashboard/auth.spec.ts

# Debug mode (watch browser)
yarn test:e2e:debug __tests__/playwright/dashboard/actions.spec.ts
```

---

## 🔧 Setup Requirements

1. **Test Users**: Create in Clerk Dashboard with credentials matching `role-test-users.ts`
2. **Environment**: Set `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. **Browsers**: Run `yarn playwright install --with-deps` once

---

## 📚 Related Documentation

- [Clerk Playwright Guide](https://clerk.com/docs/guides/development/testing/playwright/overview)
- [Main Testing Manual](../../../../docs/task.md)
- [Playwright Config](../../playwright.config.ts)
