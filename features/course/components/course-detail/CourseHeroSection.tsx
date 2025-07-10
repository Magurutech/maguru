'use client'

import Image from 'next/image'
import { Star, Users, Clock, Award, ChevronRight } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'
import type { CourseDetailView } from '@/features/course/types'

interface CourseHeroSectionProps {
  course: CourseDetailView
}

export function CourseHeroSection({ course }: CourseHeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="relative h-[60vh] min-h-[500px]">
        <Image
          src={'/images/default-course-thumbnail.svg'}
          alt={course.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

        {/* Glass Panel Overlay */}
        <div className="absolute inset-0 backdrop-blur-sm bg-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center lg:items-center md:items-start">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl w-full">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-white/80 text-sm mb-4 pt-4 md:pt-0">
              <span>Courses</span>
              <ChevronRight className="h-4 w-4" />
              <span>{course.category}</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white">{course.title}</span>
            </nav>

            {/* Category Badge
            <Badge className="mb-4 bg-secondary hover:bg-secondary-500 text-white border-0">
              {course.category}
            </Badge> */}

            {/* Title with Gradient */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-secondary to-primary bg-clip-text text-transparent leading-tight">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-md md:text-lg lg:text-xl text-white/90 mb-4 leading-relaxed">
              {course.description}
            </p>

            {/* Course Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(course.rating)
                          ? 'text-secondary fill-current'
                          : 'text-white/40'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-semibold">{course.rating}</span>
                <span className="text-white/70">
                  ({course.totalRatings.toLocaleString()} ratings)
                </span>
              </div>

              {/* Students */}
              <div className="flex items-center gap-2 text-white/80">
                <Users className="h-5 w-5" />
                <span>{course.students.toLocaleString()} students</span>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="h-5 w-5" />
                <span>{course.totalHours} hours</span>
              </div>

              {/* Certificate */}
              {course.certificate && (
                <div className="flex items-center gap-2 text-white/80">
                  <Award className="h-5 w-5" />
                  <span>Certificate included</span>
                </div>
              )}
            </div>

            {/* Instructor Info */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 ">
              <Image
                src={course.instructor.avatar || '/images/default-course-thumbnail.svg'}
                alt={course.instructor.name}
                width={60}
                height={60}
                className="rounded-full border-2 border-white/30 mb-0 sm:mb-2"
              />
              <div>
                <p className="text-white font-semibold">{course.instructor.name}</p>
                <p className="text-white/70 text-sm">
                  {course.instructor.rating} ⭐ • {course.instructor.students.toLocaleString()}{' '}
                  students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
