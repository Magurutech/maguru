/**
 * Dashboard Test Helpers
 *
 * Reusable selectors and utility functions for dashboard E2E testing.
 * These helpers provide consistent element selection and reduce duplication.
 */

import { Page, expect } from '@playwright/test'

/**
 * Dashboard element selectors
 * Centralized selector definitions for maintainability
 */
export const DASHBOARD_SELECTORS = {
  // Stats cards
  statsCard: (label: string) => `[data-testid="stat-${label.toLowerCase()}"], .stat-card:has-text("${label}")`,
  statValue: (label: string) => `[data-testid="stat-${label.toLowerCase()}"] .stat-value, .stat-card:has-text("${label}") .stat-value`,

  // Header
  dashboardTitle: '[data-testid="dashboard-title"], h1:has-text("Dashboard")',
  greeting: '[data-testid="user-greeting"], .greeting',
  roleBadge: '[data-testid="user-role"], .role-badge',

  // Quick action buttons
  quickActionButton: (label: string) => `button:has-text("${label}"), [data-testid="action-${label.toLowerCase()}"]`,

  // Course cards
  courseCard: '.course-card, [data-testid="course-card"]',
  courseTitle: '.course-card .course-title, [data-testid="course-title"]',
  courseProgress: '.course-card .progress-bar, [data-testid="course-progress"]',
  continueButton: 'button:has-text("Lanjut"), [data-testid="continue-course"]',
  reviewButton: 'button:has-text("Review"), [data-testid="review-course"]',

  // Recommendations section
  recommendationsSection: '[data-testid="recommendations"], .recommendations-section',
  recommendationCard: '.recommendation-card, [data-testid="recommendation-card"]',

  // Common elements
  mainContent: 'main, [role="main"], .main-content',
  loadingSkeleton: '.skeleton, [data-testid="skeleton"]',
} as const

/**
 * Expected dashboard content by role
 */
export const DASHBOARD_CONTENT_BY_ROLE = {
  user: {
    title: 'Dashboard Learner',
    role: 'Learner',
    stats: ['Kursus Diikuti', 'Kursus Selesai', 'Jam Belajar', 'Sertifikat'],
    quickActions: ['Jelajahi Kursus Baru', 'Edit Profil', 'Lihat Sertifikat'],
  },
  creator: {
    title: 'Dashboard Creator',
    role: 'Creator',
    stats: ['Total Kursus', 'Kursus Terbit', 'Total Siswa', 'Pendapatan Bulan Ini'],
    quickActions: ['Creator Studio', 'Jelajahi Kursus Baru', 'Edit Profil'],
  },
  admin: {
    title: 'Dashboard Admin',
    role: 'Admin',
    stats: ['Kesehatan Sistem', 'Pengguna Aktif', 'Total Pendapatan', 'Isu Platform'],
    quickActions: ['Admin Panel', 'Jelajahi Kursus Baru'],
  },
} as const

/**
 * Navigate to dashboard and wait for load
 */
export async function gotoDashboard(page: Page) {
  await page.goto('/dashboard')
  await waitForDashboardLoad(page)
}

/**
 * Wait for dashboard to fully load
 * Checks that skeleton is gone and main content is visible
 */
export async function waitForDashboardLoad(page: Page) {
  // Wait for any loading skeleton to disappear
  const skeleton = page.locator(DASHBOARD_SELECTORS.loadingSkeleton)
  if (await skeleton.count() > 0) {
    await skeleton.waitFor({ state: 'detached', timeout: 5000 }).catch(() => {
      console.log('ℹ️ Skeleton not detected or already removed')
    })
  }

  // Wait for main content to be visible
  await expect(page.locator(DASHBOARD_SELECTORS.mainContent)).toBeVisible({ timeout: 10000 })
}

/**
 * Verify dashboard stats are displayed
 */
export async function verifyDashboardStats(page: Page, expectedStats: string[]) {
  for (const stat of expectedStats) {
    const statSelector = DASHBOARD_SELECTORS.statsCard(stat)
    const statElement = page.locator(statSelector).first()

    // Check if stat card exists
    const isVisible = await statElement.isVisible().catch(() => false)

    if (!isVisible) {
      // Try alternative selector - look for text content
      const hasTextContent = await page
        .locator('body')
        .textContent()
        .then((text) => text?.includes(stat))

      expect(hasTextContent).toBeTruthy()
      console.log(`✅ Found stat "${stat}" via text content`)
    } else {
      console.log(`✅ Found stat card "${stat}"`)
    }
  }
}

/**
 * Verify quick action buttons are displayed
 */
export async function verifyQuickActions(page: Page, expectedActions: string[]) {
  for (const action of expectedActions) {
    const buttonSelector = DASHBOARD_SELECTORS.quickActionButton(action)
    const button = page.locator(buttonSelector)

    const isVisible = await button.isVisible().catch(() => false)

    if (!isVisible) {
      // Try text-based search
      const hasButtonText = await page
        .locator(`button:has-text("${action}")`)
        .count()
        .then((count) => count > 0)

      expect(hasButtonText).toBeTruthy()
      console.log(`✅ Found action button "${action}" via text search`)
    } else {
      console.log(`✅ Found action button "${action}"`)
    }
  }
}

/**
 * Verify dashboard header content
 */
export async function verifyDashboardHeader(page: Page, expectedTitle: string, expectedRole: string) {
  // Check title
  const hasTitle = await page.locator(`h1:has-text("${expectedTitle}")`).count() > 0
  expect(hasTitle).toBeTruthy()

  // Check role badge
  const hasRoleBadge = await page.locator(`:has-text("${expectedRole}")`).count() > 0
  expect(hasRoleBadge).toBeTruthy()

  console.log(`✅ Dashboard header verified: ${expectedTitle} (${expectedRole})`)
}

/**
 * Get all course cards on dashboard
 */
export async function getCourseCards(page: Page) {
  return await page.locator(DASHBOARD_SELECTORS.courseCard).all()
}

/**
 * Get progress value from a course card
 */
export async function getCourseProgress(page: Page, cardIndex: number = 0) {
  const cards = await getCourseCards(page)
  if (cards.length === 0) return null

  const card = cards[cardIndex]
  const progressText = await card.locator('.progress-text, [data-testid="progress-text"]').textContent()

  // Extract percentage from text like "75%" or "75 %"
  const match = progressText?.match(/(\d+)\s*%/)
  return match ? parseInt(match[1]) : null
}
