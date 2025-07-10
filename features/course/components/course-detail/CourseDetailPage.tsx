'use client'

import { useState } from 'react'
import { CourseHeroSection } from './CourseHeroSection'
import { EnrollmentCTA } from './EnrollmentCta'
import { CourseTabs } from './CourseTabs'
import { CourseSidebar } from './CourseSidebar'
import { EnrollmentDialog } from './Enrollment-dialog'

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  instructor: {
    name: string
    avatar: string
    bio: string
    credentials: string[]
    rating: number
    students: number
  }
  rating: number
  totalRatings: number
  students: number
  duration: string
  level: string
  language: string
  price: number
  originalPrice: number
  category: string
  lastUpdated: string
  certificate: boolean
  downloadableResources: number
  articlesCount: number
  videosCount: number
  totalHours: number
  enrolled: boolean
  inWishlist: boolean
  learningOutcomes: string[]
  requirements: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  curriculum: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews: any[]
}

interface CourseDetailPageProps {
  course: Course
}

export function CourseDetailPage({ course }: CourseDetailPageProps) {
  const [enrollmentDialogOpen, setEnrollmentDialogOpen] = useState(false)
  const [enrollmentStatus, setEnrollmentStatus] = useState<'available' | 'enrolled' | 'loading'>(
    'available',
  )

  const handleEnrollment = () => {
    setEnrollmentDialogOpen(true)
  }

  const confirmEnrollment = async () => {
    setEnrollmentStatus('loading')
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setEnrollmentStatus('enrolled')
    setEnrollmentDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-beige-50 via-beige-100 to-beige-200">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=100&width=100')] bg-repeat opacity-20"></div>
      </div>

      <div className="relative">
        {/* Hero Section */}
        <CourseHeroSection course={course} />

        {/* Enrollment CTA */}
        <div className="container mx-auto px-4 -mt-8 relative z-10">
          <EnrollmentCTA course={course} status={enrollmentStatus} onEnroll={handleEnrollment} />
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <CourseTabs course={course} />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <CourseSidebar course={course} />
            </div>
          </div>
        </div>

        {/* Enrollment Dialog */}
        <EnrollmentDialog
          open={enrollmentDialogOpen}
          onOpenChange={setEnrollmentDialogOpen}
          course={course}
          onConfirm={confirmEnrollment}
        />
      </div>
    </div>
  )
}
