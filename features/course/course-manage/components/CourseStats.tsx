import { Card, CardContent } from '@/components/ui/card'
import type { Course } from '../types'

interface CourseStatsProps {
  courses: Course[]
}

export function CourseStats({ courses }: CourseStatsProps) {
  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.status === 'published').length
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const averageRating =
    courses.length > 0
      ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
      : '0.0'

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="card-ancient bg-gradient-to-br from-primary-100 to-primary-50 border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Total Kursus</p>
              <p className="text-3xl font-bold text-beige-900">{totalCourses}</p>
            </div>
            <div className="text-2xl">📚</div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-ancient bg-gradient-to-br from-accent-100 to-accent-50 border-accent-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Diterbitkan</p>
              <p className="text-3xl font-bold text-beige-900">{publishedCourses}</p>
            </div>
            <div className="text-2xl">✨</div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-ancient bg-gradient-to-br from-secondary-100 to-secondary-50 border-secondary-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Total Siswa</p>
              <p className="text-3xl font-bold text-beige-900">{totalStudents}</p>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-ancient bg-gradient-to-br from-beige-200 to-beige-100 border-beige-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Rating Rata-rata</p>
              <p className="text-3xl font-bold text-beige-900">{averageRating}</p>
            </div>
            <div className="text-2xl">⭐</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
