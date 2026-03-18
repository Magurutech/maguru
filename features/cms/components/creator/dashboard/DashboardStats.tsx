import React from 'react'
import { BookOpen, BarChart3 } from 'lucide-react'

export interface CreatorStats {
  totalCourses: number
  publishedCourses: number
  draftCourses: number
  totalStudents: number
}

interface DashboardStatsProps {
  stats: CreatorStats
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Courses */}
      <div
        className="bg-white rounded-lg shadow-neu border border-beige-200 p-6"
        data-testid="stat-total-courses"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-hijau-100 rounded-lg">
            <BookOpen className="w-5 h-5 text-hijau-600" />
          </div>
          <div>
            <p className="text-sm text-beige-600">Total Kursus</p>
            <p
              className="text-2xl font-bold text-beige-900"
              data-testid="stat-total-courses-value"
            >
              {stats.totalCourses}
            </p>
            <p className="text-xs text-beige-500" data-testid="stat-courses-breakdown">
              {stats.publishedCourses} published, {stats.draftCourses} draft
            </p>
          </div>
        </div>
      </div>

      {/* Total Students */}
      <div
        className="bg-white rounded-lg shadow-neu border border-beige-200 p-6"
        data-testid="stat-total-students"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-kuning-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-kuning-600" />
          </div>
          <div>
            <p className="text-sm text-beige-600">Total Siswa</p>
            <p
              className="text-2xl font-bold text-beige-900"
              data-testid="stat-total-students-value"
            >
              {stats.totalStudents.toLocaleString()}
            </p>
            <p className="text-xs text-hijau-600">dari semua kursus</p>
          </div>
        </div>
      </div>

      {/* Revenue (placeholder) */}
      <div
        className="bg-white rounded-lg shadow-neu border border-beige-200 p-6"
        data-testid="stat-revenue"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 bg-merah-100 rounded-lg">
            <span className="text-merah-600 font-bold text-lg">Rp</span>
          </div>
          <div>
            <p className="text-sm text-beige-600">Pendapatan Bulan Ini</p>
            <p className="text-2xl font-bold text-beige-900">Rp 0</p>
            <p className="text-xs text-kuning-600">Segera hadir</p>
          </div>
        </div>
      </div>
    </div>
  )
}
