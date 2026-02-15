/**
 * Dashboard API Client
 *
 * API client untuk dashboard data fetching dengan graceful error handling
 * dan fallback ke mock data untuk development.
 */

import type { DashboardData } from './types'
import { getMockDashboardData } from './utils'

/**
 * Fetch dashboard data berdasarkan role
 */
export async function getDashboardData(
  role: 'user' | 'creator' | 'admin'
): Promise<DashboardData> {
  try {
    const response = await fetch(`/api/dashboard/${role}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Dashboard data fetch failed:', error)

    // Fallback ke mock data
    return getMockDashboardData(role)
  }
}
