'use client'

import { Button } from '@/components/ui/button'
import { Heart, Share2, Download, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Course } from './CourseDetailPage'

interface EnrollmentCTAProps {
  course: Course
  status: 'available' | 'enrolled' | 'loading'
  onEnroll: () => void
}

export function EnrollmentCTA({ course, status, onEnroll }: EnrollmentCTAProps) {
  const getButtonContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Enrolling...
          </>
        )
      case 'enrolled':
        return 'Continue Learning'
      default:
        return 'Enroll Now'
    }
  }

  const getButtonStyles = () => {
    switch (status) {
      case 'enrolled':
        return 'bg-accent hover:bg-accent-600 shadow-lg shadow-accent/25 hover:shadow-accent/40'
      case 'loading':
        return 'bg-gray-400 cursor-not-allowed'
      default:
        return 'bg-primary hover:bg-primary-600 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105'
    }
  }

  return (
    <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Price and Course Info */}
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-beige-900">${course.price}</span>
              {course.originalPrice > course.price && (
                <span className="text-lg text-gray-500 line-through">${course.originalPrice}</span>
              )}
              {course.originalPrice > course.price && (
                <Badge className="bg-primary text-white">
                  Save ${course.originalPrice - course.price}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-beige-800">
            <span>📚 {course.level} Level</span>
            <span>🌐 {course.language}</span>
            <span>⏱️ {course.duration}</span>
            <span>📜 Certificate Included</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button
            onClick={onEnroll}
            disabled={status === 'loading'}
            className={`${getButtonStyles()} text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 text-lg min-w-[200px]`}
          >
            {getButtonContent()}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="bg-white/30 border-white/40 hover:bg-white/50 backdrop-blur-sm rounded-xl"
            >
              <Heart className="h-5 w-5 text-beige-900" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/30 border-white/40 hover:bg-white/50 backdrop-blur-sm rounded-xl"
            >
              <Share2 className="h-5 w-5 text-beige-900" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white/30 border-white/40 hover:bg-white/50 backdrop-blur-sm rounded-xl"
            >
              <Download className="h-5 w-5 text-beige-900" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
