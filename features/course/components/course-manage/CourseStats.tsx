'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useCourseManagement } from '../../hooks/useCourseManagement'

export function CourseStats() {
  // Component state untuk UI interactions
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  // Feature state dari hook
  const { courses, isLoading } = useCourseManagement()

  const totalCourses = courses.length
  const publishedCourses = courses.filter((c) => c.status === 'PUBLISHED').length
  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0)
  const averageRating =
    courses.length > 0
      ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
      : '0.0'

  const handleCardHover = (cardType: string) => {
    setHoveredCard(cardType)
  }

  const handleCardLeave = () => {
    setHoveredCard(null)
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="card-ancient animate-pulse">
            <CardContent className="p-6">
              <div className="h-8 bg-beige-200 rounded mb-2"></div>
              <div className="h-6 bg-beige-100 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card
        className={`card-ancient bg-gradient-to-br from-primary-100 to-primary-50 border-primary-200 transition-all duration-300 ${
          hoveredCard === 'total' ? 'scale-105 shadow-lg' : ''
        }`}
        onMouseEnter={() => handleCardHover('total')}
        onMouseLeave={handleCardLeave}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Total Kursus</p>
              <p className="text-3xl font-bold text-beige-900">{totalCourses}</p>
            </div>
            <div
              className={`text-2xl transition-transform duration-300 ${
                hoveredCard === 'total' ? 'scale-110' : ''
              }`}
            >
              📚
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`card-ancient bg-gradient-to-br from-accent-100 to-accent-50 border-accent-200 transition-all duration-300 ${
          hoveredCard === 'published' ? 'scale-105 shadow-lg' : ''
        }`}
        onMouseEnter={() => handleCardHover('published')}
        onMouseLeave={handleCardLeave}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Diterbitkan</p>
              <p className="text-3xl font-bold text-beige-900">{publishedCourses}</p>
            </div>
            <div
              className={`text-2xl transition-transform duration-300 ${
                hoveredCard === 'published' ? 'scale-110' : ''
              }`}
            >
              ✨
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`card-ancient bg-gradient-to-br from-secondary-100 to-secondary-50 border-secondary-200 transition-all duration-300 ${
          hoveredCard === 'students' ? 'scale-105 shadow-lg' : ''
        }`}
        onMouseEnter={() => handleCardHover('students')}
        onMouseLeave={handleCardLeave}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Total Siswa</p>
              <p className="text-3xl font-bold text-beige-900">{totalStudents}</p>
            </div>
            <div
              className={`text-2xl transition-transform duration-300 ${
                hoveredCard === 'students' ? 'scale-110' : ''
              }`}
            >
              👥
            </div>
          </div>
        </CardContent>
      </Card>

      <Card
        className={`card-ancient bg-gradient-to-br from-beige-200 to-beige-100 border-beige-300 transition-all duration-300 ${
          hoveredCard === 'rating' ? 'scale-105 shadow-lg' : ''
        }`}
        onMouseEnter={() => handleCardHover('rating')}
        onMouseLeave={handleCardLeave}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-beige-700 text-sm font-medium">Rating Rata-rata</p>
              <p className="text-3xl font-bold text-beige-900">{averageRating}</p>
            </div>
            <div
              className={`text-2xl transition-transform duration-300 ${
                hoveredCard === 'rating' ? 'scale-110' : ''
              }`}
            >
              ⭐
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
