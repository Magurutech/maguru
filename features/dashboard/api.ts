/**
 * Dashboard API Client
 *
 * API client untuk dashboard data fetching dengan graceful error handling
 * dan fallback ke mock data untuk development.
 *
 * NOTE: Backend API belum diimplementasikan. Menggunakan mock data untuk sementara.
 * Untuk mengaktifkan real API, uncomment kode fetch di bawah dan tambahkan env check.
 */

import type { DashboardData } from './types'
import { getMockDashboardData } from './utils'

/**
 * Fetch dashboard data berdasarkan role
 *
 * TODO: Uncomment fetch block setelah backend API siap
 */
export async function getDashboardData(
  role: 'user' | 'creator' | 'admin'
): Promise<DashboardData> {
  // ===== MOCK DATA (Sementara) =====
  // Backend API belum siap, gunakan mock data dulu
  return getMockDashboardData(role)

  // ===== REAL API (Uncomment setelah backend siap) =====
  // try {
  //   const response = await fetch(`/api/dashboard/${role}`, {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     credentials: 'include',
  //   })
  //
  //   if (!response.ok) {
  //     throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  //   }
  //
  //   return await response.json()
  // } catch (error) {
  //   console.error('Dashboard data fetch failed:', error)
  //
  //   // Fallback ke mock data
  //   return getMockDashboardData(role)
  // }
}
