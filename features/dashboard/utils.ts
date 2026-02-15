/**
 * Dashboard Utility Functions
 *
 * Helper functions untuk dashboard components.
 * Mengikuti Ancient Fantasy Asia design system (beige, kuning, hijau, merah).
 */

import type { DashboardData,  RecentCourse,  Recommendation } from './types'
import {
  BookOpen,
  User,
  Star,
  Clock,
  Award,
  Activity,
  DollarSign,
  AlertOctagon,
  Settings,
} from 'lucide-react'

// ===== DASHBOARD TITLE =====

/**
 * Mendapatkan judul dashboard berdasarkan role
 */
export function getDashboardTitle(role: 'user' | 'creator' | 'admin'): string {
  const titles = {
    user: 'Dashboard Learner',
    creator: 'Dashboard Creator',
    admin: 'Dashboard Admin',
  }
  return titles[role] || titles.user
}

// ===== ROLE ICON COLOR =====

/**
 * Mendapatkan warna icon berdasarkan role
 */
export function getRoleIconColor(role: 'user' | 'creator' | 'admin'): 'hijau' | 'kuning' | 'merah' {
  const colors = {
    user: 'kuning' as const, // kuning (highlight/attention)
    creator: 'merah' as const, // merah (primary action)
    admin: 'hijau' as const, // hijau (nature/success)
  }
  return colors[role] || colors.user
}

// ===== COLOR MAPPING =====

/**
 * Mapping warna ke CSS class warna tematik
 */
export function getThemeColorClass(color: 'hijau' | 'kuning' | 'merah' | 'beige') {
  const colorMap = {
    hijau: {
      bg: 'bg-hijau-100',
      text: 'text-hijau-600',
      bg50: 'bg-hijau-50',
      iconBg: 'bg-hijau-100',
      iconText: 'text-hijau-600',
    },
    kuning: {
      bg: 'bg-kuning-100',
      text: 'text-kuning-600',
      bg50: 'bg-kuning-50',
      iconBg: 'bg-kuning-100',
      iconText: 'text-kuning-600',
    },
    merah: {
      bg: 'bg-merah-100',
      text: 'text-merah-600',
      bg50: 'bg-merah-50',
      iconBg: 'bg-merah-100',
      iconText: 'text-merah-600',
    },
    beige: {
      bg: 'bg-beige-100',
      text: 'text-beige-600',
      bg50: 'bg-beige-50',
      iconBg: 'bg-beige-100',
      iconText: 'text-beige-600',
    },
  }
  return colorMap[color]
}

// ===== DATE FORMATTING =====

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    // Format selisih waktu
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30))

    if (days === 0 && months === 0) {
      return 'Hari ini'
    }
    if (days === 0 && months === 1) {
      return 'Bulan lalu'
    }
    if (days === 1) {
      return 'Kemarin'
    }
    if (days < 7) {
      return `${days} hari yang lalu`
    }
    if (days < 30) {
      return `${Math.floor(days / 7)} minggu yang lalu`
    }
    return `${months} bulan yang lalu`
  } catch {
    return dateString // Fallback ke format asli
  }
}

// ===== RECOMMENDATION LOGIC =====

/**
 * Generate rekomendasi kursus berdasarkan riwayat belajar
 */
export function generateRecommendations(recentCourses: RecentCourse[]): Recommendation[] {
  const recommendations: Recommendation[] = []

  // Rule 1: Jika user mengambil kursus React, rekomendasikan Advanced React Patterns
  const hasReactCourse = recentCourses.some(course =>
    course.title.toLowerCase().includes('react')
  )

  if (hasReactCourse) {
    recommendations.push({
      id: 'rec-1',
      title: 'Advanced React Patterns',
      description: 'Master advanced React concepts and patterns',
      reason: 'Berdasarkan progress React Anda',
      difficulty: 'intermediate',
    })
  }

  // Rule 2: Jika user menyelesaikan kursus frontend (JavaScript, CSS), rekomendasikan backend
  const hasCompletedFrontend = recentCourses.some(course =>
    course.status === 'completed' &&
    (course.title.toLowerCase().includes('javascript') ||
    course.title.toLowerCase().includes('css'))
  )

  if (hasCompletedFrontend) {
    recommendations.push({
      id: 'rec-2',
      title: 'Node.js Backend Development',
      description: 'Build scalable backend applications',
      reason: 'Melengkapi skill frontend Anda',
      difficulty: 'intermediate',
    })
  }

  // Rule 3: Default rekomendasi jika tidak ada match
  if (recommendations.length === 0) {
    recommendations.push({
      id: 'rec-default',
      title: 'JavaScript Fundamentals',
      description: 'Master dasar-dasar JavaScript',
      reason: 'Rekomendasi populer untuk pemula',
      difficulty: 'beginner',
    })
  }

  return recommendations
}

// ===== STAGGER ANIMATION DELAYS =====

/**
 * Mendapatkan delay animasi untuk stagger effect
 */
export function getStaggerDelay(index: number): string {
  const delays = ['0ms', '100ms', '200ms', '300ms']
  return delays[index] || '0ms'
}

// ===== MOCK DATA GENERATION =====

/**
 * Generate mock data untuk dashboard berdasarkan role
 */
export function getUserMockData(): DashboardData {
  return {
    stats: [
      {
        icon: BookOpen,
        title: 'Kursus Diikuti',
        value: 5,
        iconColor: 'kuning',
      },
      {
        icon: Award,
        title: 'Kursus Selesai',
        value: 2,
        iconColor: 'hijau',
      },
      {
        icon: Clock,
        title: 'Jam Belajar',
        value: 24,
        iconColor: 'merah',
      },
      {
        icon: Star,
        title: 'Sertifikat',
        value: 1,
        iconColor: 'beige',
      },
    ],
    recentCourses: [
      {
        id: '1',
        title: 'Introduction to React',
        progress: 75,
        lastAccessed: '2024-01-15',
        instructor: 'John Doe',
        status: 'in-progress',
      },
      {
        id: '2',
        title: 'JavaScript Fundamentals',
        progress: 100,
        lastAccessed: '2024-01-14',
        instructor: 'Jane Smith',
        status: 'completed',
      },
      {
        id: '3',
        title: 'CSS Grid & Flexbox',
        progress: 45,
        lastAccessed: '2024-01-13',
        instructor: 'Bob Johnson',
        status: 'not-started',
      },
    ],
    quickActions: [
      {
        icon: BookOpen,
        label: 'Jelajahi Kursus Baru',
        href: '/course',
        colorScheme: 'merah',
      },
      {
        icon: User,
        label: 'Edit Profile',
        href: '/profile',
        colorScheme: 'kuning',
      },
      {
        icon: Star,
        label: 'Lihat Sertifikat',
        href: '/profile/certificates',
        colorScheme: 'beige',
      },
    ],
    recommendations: generateRecommendations([
      {
        id: '1',
        title: 'Introduction to React',
        progress: 75,
        lastAccessed: '2024-01-15',
        instructor: 'John Doe',
        status: 'in-progress',
      },
      {
        id: '2',
        title: 'JavaScript Fundamentals',
        progress: 100,
        lastAccessed: '2024-01-14',
        instructor: 'Jane Smith',
        status: 'completed',
      },
      {
        id: '3',
        title: 'CSS Grid & Flexbox',
        progress: 45,
        lastAccessed: '2024-01-13',
        instructor: 'Bob Johnson',
        status: 'not-started',
      },
    ]),
  }
}

export function getCreatorMockData(): DashboardData {
  return {
    stats: [
      {
        icon: BookOpen,
        title: 'Total Kursus',
        value: 8,
        iconColor: 'hijau',
      },
      {
        icon: Award,
        title: 'Kursus Terbit',
        value: 6,
        iconColor: 'kuning',
      },
      {
        icon: User,
        title: 'Total Siswa',
        value: 1247,
        iconColor: 'merah',
      },
      {
        icon: Clock,
        title: 'Pendapatan Bulanan',
        value: 4200000,
        iconColor: 'beige',
      },
    ],
    recentCourses: [
      {
        id: '1',
        title: 'Advanced React Patterns',
        progress: 80,
        lastAccessed: '2024-01-15',
        instructor: 'Jane Smith',
        status: 'published',
        students: 324,
        rating: 4.9,
      },
      {
        id: '2',
        title: 'Next.js Full Stack Development',
        progress: 100,
        lastAccessed: '2024-01-12',
        instructor: 'Jane Smith',
        status: 'published',
        students: 456,
        rating: 4.7,
      },
      {
        id: '3',
        title: 'TypeScript Best Practices',
        progress: 60,
        lastAccessed: '2024-01-10',
        instructor: 'John Doe',
        status: 'draft',
        students: 0,
        rating: 0,
      },
    ],
    quickActions: [
      {
        icon: BookOpen,
        label: 'Creator Studio',
        href: '/creator/dashboard',
        colorScheme: 'merah',
      },
      {
        icon: User,
        label: 'Kelola Siswa',
        href: '/creator/students',
        colorScheme: 'kuning',
      },
      {
        icon: Clock,
        label: 'Pengaturan Kursus',
        href: '/creator/courses',
        colorScheme: 'hijau',
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Performance Optimization',
        description: 'Tingkatkan performa kursus Anda',
        reason: 'Berdasarkan analisis pembelajaran',
        difficulty: 'intermediate',
      },
      {
        id: 'rec-2',
        title: 'Student Engagement Tips',
        description: 'Meningkatkan interaksi dengan siswa',
        reason: 'Berdasarkan feedback siswa',
        difficulty: 'advanced',
      },
    ],
  }
}

export function getAdminMockData(): DashboardData {
  return {
    stats: [
      {
        icon: Activity,
        title: 'Kesehatan Sistem',
        value: 99,
        iconColor: 'hijau',
      },
      {
        icon: User,
        title: 'Pengguna Aktif',
        value: 2486,
        iconColor: 'kuning',
      },
      {
        icon: DollarSign,
        title: 'Total Pendapatan',
        value: 4506000,
        iconColor: 'merah',
      },
      {
        icon: AlertOctagon,
        title: 'Isu Platform',
        value: 3,
        iconColor: 'beige',
      },
    ],
    recentCourses: [
      {
        id: '1',
        title: 'System Performance Monitoring',
        progress: 100,
        lastAccessed: '2024-01-15',
        status: 'healthy',
      },
      {
        id: '2',
        title: 'Database Health Check',
        progress: 100,
        lastAccessed: '2024-01-14',
        status: 'warning',
      },
    ],
    quickActions: [
      {
        icon: BookOpen,
        label: 'Admin Panel',
        href: '/admin',
        colorScheme: 'merah',
      },
      {
        icon: User,
        label: 'Manajemen Pengguna',
        href: '/admin/users',
        colorScheme: 'kuning',
      },
      {
        icon: Settings,
        label: 'Pengaturan Sistem',
        href: '/admin/settings',
        colorScheme: 'hijau',
      },
    ],
    recommendations: [
      {
        id: 'rec-1',
        title: 'Security Alerts',
        description: 'Periksa log keamanan',
        reason: 'Laporan aktivitas mencurigakan',
        difficulty: 'critical',
      },
      {
        id: 'rec-2',
        title: 'Maintenance Mode',
        description: 'Jadwalkan sistem untuk pemeliharaan',
        reason: 'Rekomendasi rutin',
        difficulty: 'high',
      },
    ],
  }
}

/**
 * Mendapatkan data dashboard mock berdasarkan role
 */
export function getMockDashboardData(role: 'user' | 'creator' | 'admin'): DashboardData {
  switch (role) {
    case 'user':
      return getUserMockData()
    case 'creator':
      return getCreatorMockData()
    case 'admin':
      return getAdminMockData()
    default:
      return getUserMockData()
  }
}
