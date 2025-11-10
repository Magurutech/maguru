'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Clock, BookOpen, Play, CheckCircle } from 'lucide-react'
import { CourseCardProps } from '../types/course.types'

export function CourseCard({ course, progress, className = '' }: CourseCardProps) {
  const progressPercentage = progress?.completionPercentage || 0
  const isInProgress = progressPercentage > 0 && progressPercentage < 100
  const isCompleted = progressPercentage === 100

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <Badge className="bg-green-500 text-white border-green-600">
          <CheckCircle className="w-3 h-3 mr-1" />
          Selesai
        </Badge>
      )
    }
    if (isInProgress) {
      return (
        <Badge className="bg-blue-500 text-white border-blue-600">
          <Play className="w-3 h-3 mr-1" />
          Sedang Berjalan
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="bg-beige-50 text-beige-700 border-beige-200">
        <BookOpen className="w-3 h-3 mr-1" />
        Belum Dimulai
      </Badge>
    )
  }

  return (
    <Card className={`card-ancient hover-lift group ${className}`}>
      <Link href={`/course/${course.slug}`} className="block">
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-beige-50 to-beige-100 h-48">
          {/* Course Thumbnail or Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-beige-300" />
          </div>

          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            {getStatusBadge()}
          </div>

          {/* Level Badge */}
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
          </div>

          {/* Progress Bar Overlay (for in-progress courses) */}
          {isInProgress && (
            <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-2">
              <div className="flex items-center gap-2">
                <Progress value={progressPercentage} className="flex-1 h-2" />
                <span className="text-xs font-medium text-beige-700">
                  {progressPercentage}%
                </span>
              </div>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <CardContent className="p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-beige-900 mb-2 line-clamp-2 group-hover:text-gradient-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-beige-700 text-sm line-clamp-3 mb-3">
              {course.description}
            </p>
            <p className="text-beige-600 text-sm">
              oleh{' '}
              <span className="font-semibold text-secondary-600">{course.instructor}</span>
            </p>
          </div>

          {/* Course Meta */}
          <div className="flex items-center gap-4 mb-4 text-sm text-beige-700">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs">
                {course.level}
              </span>
            </div>
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {course.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-beige-100 text-beige-700 hover:bg-beige-200"
                >
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-beige-100 text-beige-700">
                  +{course.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Action Button */}
          <Button className="w-full btn-primary hover-glow">
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Review Course
              </>
            ) : isInProgress ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Lanjut Belajar
              </>
            ) : (
              <>
                <BookOpen className="w-4 h-4 mr-2" />
                Mulai Belajar
              </>
            )}
          </Button>
        </CardContent>
      </Link>
    </Card>
  )
}