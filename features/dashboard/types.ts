/**
 * Dashboard Types
 *
 * TypeScript interfaces untuk dashboard components dan data structures.
 * Mengikuti Ancient Fantasy Asia design system (beige, kuning, hijau, merah).
 */

import { type LucideIcon } from 'lucide-react'

// ===== STATS CARD =====

/**
 * Kartu statistik dashboard
 */
export interface StatCard {
  icon: LucideIcon
  title: string
  value: string | number
  subtitle?: string
  iconColor: 'hijau' | 'kuning' | 'merah' | 'beige'
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
  }
}

// ===== RECENT COURSES =====

/**
 * Kursus yang sedang diikuti atau terakhir diakses user
 */
export interface RecentCourse {
  id: string
  title: string
  progress: number
  lastAccessed: string
  thumbnail?: string
  instructor?: string
  status?: 'completed' | 'in-progress' | 'not-started' | 'published' | 'draft' | 'healthy' | 'warning'
  rating?: number
  students?: number
}

// ===== QUICK ACTIONS =====

/**
 * Aksi cepat untuk navigasi dashboard
 */
export interface QuickAction {
  icon: LucideIcon
  label: string
  href: string
  colorScheme?: 'merah' | 'kuning' | 'hijau' | 'beige'
}

// ===== RECOMMENDATIONS =====

/**
 * Rekomendasi kursus untuk user
 */
export interface Recommendation {
  id: string
  title: string
  description: string
  reason: string
  thumbnail?: string
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'critical' | 'high'
  duration?: string
}

// ===== DASHBOARD DATA =====

/**
 * Data utama dashboard
 */
export interface DashboardData {
  stats: StatCard[]
  recentCourses: RecentCourse[]
  quickActions: QuickAction[]
  recommendations: Recommendation[]
}

// ===== ROLE-SPECIFIC STATS =====

/**
 * Statistik dashboard untuk role User (Learner)
 */
export interface UserDashboardStats {
  coursesEnrolled: number
  coursesCompleted: number
  totalLearningHours: number
  certificatesEarned: number
}

/**
 * Statistik dashboard untuk role Creator
 */
export interface CreatorDashboardStats {
  totalCourses: number
  publishedCourses: number
  totalStudents: number
  monthlyEarnings: number
}

/**
 * Statistik dashboard untuk role Admin
 */
export interface AdminDashboardStats {
  systemHealth: number
  activeUsers: number
  totalRevenue: number
  platformIssues: number
}
