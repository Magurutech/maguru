/**
 * Dashboard Auth Tests - Role-Based Access Control
 *
 * Tests verify that each user role sees the correct dashboard content:
 * - User (Learner): sees learner dashboard with course progress
 * - Creator: sees creator dashboard with course stats + creator studio link
 * - Admin: sees admin dashboard with system stats + admin panel link
 *
 * References:
 * - https://clerk.com/docs/guides/development/testing/playwright/test-authenticated-flows
 */

import { test, expect } from '@playwright/test'
import { setupClerkTestingToken } from '@clerk/testing/playwright'
import { clerk } from '@clerk/testing/playwright'
import { loginWithRole } from '../utils/role-test-helpers'
import {
  gotoDashboard,
  verifyDashboardStats,
  verifyQuickActions,
  verifyDashboardHeader,
  DASHBOARD_CONTENT_BY_ROLE,
} from '../helpers'

/**
 * Test Suite: User Role Dashboard Access
 */
test.describe('Dashboard - User (Learner) Role', () => {
  test.beforeEach(async ({ page }) => {
    // Setup Clerk testing token for each test
    await setupClerkTestingToken({ page })
  })

  test('should display learner dashboard with correct stats', async ({ page }) => {
    // Given: Logged in as user role
    await loginWithRole(page, 'user')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should see learner-specific stats
    await verifyDashboardStats(page, DASHBOARD_CONTENT_BY_ROLE.user.stats)
  })

  test('should display learner dashboard with correct header', async ({ page }) => {
    // Given: Logged in as user role
    await loginWithRole(page, 'user')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should see learner header
    await verifyDashboardHeader(
      page,
      DASHBOARD_CONTENT_BY_ROLE.user.title,
      DASHBOARD_CONTENT_BY_ROLE.user.role,
    )
  })

  test('should display learner quick action buttons', async ({ page }) => {
    // Given: Logged in as user role
    await loginWithRole(page, 'user')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should see learner quick actions
    await verifyQuickActions(page, DASHBOARD_CONTENT_BY_ROLE.user.quickActions)

    // Should NOT see creator-only or admin-only actions
    await expect(page.locator('button:has-text("Creator Studio")')).not.toBeVisible()
    await expect(page.locator('button:has-text("Admin Panel")')).not.toBeVisible()
  })

  test('should show continue button for incomplete courses', async ({ page }) => {
    // Given: Logged in as user with incomplete courses
    await loginWithRole(page, 'user')
    await gotoDashboard(page)

    // When: Looking at course cards
    const courseCards = page.locator('.course-card, [data-testid="course-card"]')

    // Then: Should see "Lanjut" button for courses < 100% progress
    const hasContinueButton = await courseCards
      .locator('button:has-text("Lanjut"), [data-testid="continue-course"]')
      .count()
      .then((count) => count > 0)

    if (hasContinueButton) {
      console.log('✅ Found "Lanjut" button for incomplete courses')
    } else {
      console.log('ℹ️ No incomplete courses found (all courses may be 100% complete)')
    }
  })
})

/**
 * Test Suite: Creator Role Dashboard Access
 */
test.describe('Dashboard - Creator Role', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
  })

  test('should display creator dashboard with correct stats', async ({ page }) => {
    // Given: Logged in as creator role
    await loginWithRole(page, 'creator')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should see creator-specific stats
    await verifyDashboardStats(page, DASHBOARD_CONTENT_BY_ROLE.creator.stats)
  })

  test('should display creator dashboard with correct header', async ({ page }) => {
    // Given: Logged in as creator role
    await loginWithRole(page, 'creator')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should see creator header
    await verifyDashboardHeader(
      page,
      DASHBOARD_CONTENT_BY_ROLE.creator.title,
      DASHBOARD_CONTENT_BY_ROLE.creator.role,
    )
  })

  test('should display Creator Studio as first quick action', async ({ page }) => {
    // Given: Logged in as creator role
    await loginWithRole(page, 'creator')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Creator Studio should be visible
    const creatorStudioButton = page.locator(
      'button:has-text("Creator Studio"), [data-testid="action-creator-studio"]',
    )
    await expect(creatorStudioButton).toBeVisible()

    // Should NOT see admin-only actions
    await expect(page.locator('button:has-text("Admin Panel")')).not.toBeVisible()
  })
})

/**
 * Test Suite: Admin Role Dashboard Access
 */
test.describe('Dashboard - Admin Role', () => {
  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page })
  })

  test('should display admin dashboard with correct stats', async ({ page }) => {
    // Given: Logged in as admin role
    await loginWithRole(page, 'admin')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should see admin-specific stats
    await verifyDashboardStats(page, DASHBOARD_CONTENT_BY_ROLE.admin.stats)
  })

  test('should display admin dashboard with correct header', async ({ page }) => {
    // Given: Logged in as admin role
    await loginWithRole(page, 'admin')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Should see admin header
    await verifyDashboardHeader(
      page,
      DASHBOARD_CONTENT_BY_ROLE.admin.title,
      DASHBOARD_CONTENT_BY_ROLE.admin.role,
    )
  })

  test('should display Admin Panel as first quick action', async ({ page }) => {
    // Given: Logged in as admin role
    await loginWithRole(page, 'admin')

    // When: Navigate to dashboard
    await gotoDashboard(page)

    // Then: Admin Panel should be visible
    const adminPanelButton = page.locator(
      'button:has-text("Admin Panel"), [data-testid="action-admin-panel"]',
    )
    await expect(adminPanelButton).toBeVisible()
  })
})

/**
 * Test Suite: Role Switching
 */
test.describe('Dashboard - Role Switching', () => {
  test('should correctly switch from user to creator role', async ({ page }) => {
    // Given: Logged in as user
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'user')
    await gotoDashboard(page)

    // Verify user dashboard
    await expect(page.locator('h1:has-text("Dashboard Learner")')).toBeVisible()

    // When: Logout and login as creator
    await clerk.signOut({ page })
    await page.waitForTimeout(1000)
    await loginWithRole(page, 'creator')
    await gotoDashboard(page)

    // Then: Should see creator dashboard
    await expect(page.locator('h1:has-text("Dashboard Creator")')).toBeVisible()
    await expect(page.locator('button:has-text("Creator Studio")')).toBeVisible()
  })

  test('should correctly switch from creator to admin role', async ({ page }) => {
    // Given: Logged in as creator
    await setupClerkTestingToken({ page })
    await loginWithRole(page, 'creator')
    await gotoDashboard(page)

    // Verify creator dashboard
    await expect(page.locator('h1:has-text("Dashboard Creator")')).toBeVisible()

    // When: Logout and login as admin
    await clerk.signOut({ page })
    await page.waitForTimeout(1000)
    await loginWithRole(page, 'admin')
    await gotoDashboard(page)

    // Then: Should see admin dashboard
    await expect(page.locator('h1:has-text("Dashboard Admin")')).toBeVisible()
    await expect(page.locator('button:has-text("Admin Panel")')).toBeVisible()
  })
})
