import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Star, Users, Clock, BookOpen, Heart, Eye } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'
import type { CourseCatalogItem } from '../../types'
import { useEnrollmentStatus } from '../../hooks/useEnrollmentStatus'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { useCourseContext } from '../../contexts/courseContext'

interface CourseCardProps {
  course: CourseCatalogItem
  // ❌ No more props drilling
}

function QuickViewModal({ course }: CourseCardProps) {
  // Real enrollment integration
  const { data: enrollmentStatus, isLoading: statusLoading } = useEnrollmentStatus(course.id)
  const { enrollCourseWithValidation, isEnrolling } = useCourseManagement()
  const { setEnrollmentLoading } = useCourseContext()

  const handleEnroll = async () => {
    if (enrollmentStatus?.isEnrolled) return

    try {
      setEnrollmentLoading(true)
      const success = await enrollCourseWithValidation(course.id)

      if (success) {
        toast.success(`You've successfully enrolled in "${course.title}". Start learning now!`)
      } else {
        toast.error('Failed to enroll in course. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Enrollment error:', error)
    } finally {
      setEnrollmentLoading(false)
    }
  }

  const handleWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.info('Wishlist functionality coming soon!')
  }

  const isEnrolled = enrollmentStatus?.isEnrolled || false
  const isLoading = isEnrolling || statusLoading

  return (
    <DialogContent className="max-w-2xl glass-panel">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-beige-900">{course.title}</DialogTitle>
      </DialogHeader>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="aspect-video relative overflow-hidden rounded-xl">
            <Image
              src={course.thumbnail || '/images/default-course-thumbnail.svg'}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-beige-700">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-secondary text-secondary" />
              <span className="font-medium">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-beige-700 mb-2">by {course.creator}</p>
            <Badge variant="secondary" className="mb-4">
              {course.category}
            </Badge>
            <p className="text-beige-800 leading-relaxed">{course.longDescription}</p>
          </div>
          <div>
            <h4 className="font-semibold text-beige-900 mb-2">What you&apos;ll learn:</h4>
            <ul className="space-y-1">
              {course.curriculum.map((item, index) => (
                <li key={index} className="text-sm text-beige-700 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-beige-200">
            <span className="text-2xl font-bold text-beige-900">${course.price}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleWishlist}
                className={`${course.wishlist ? 'bg-primary/10 border-primary/20 text-primary' : ''}`}
              >
                <Heart className={`w-4 h-4 ${course.wishlist ? 'fill-current' : ''}`} />
              </Button>
              <Button
                onClick={handleEnroll}
                disabled={isLoading || isEnrolled}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isEnrolled
                    ? 'bg-accent hover:bg-accent-600 text-white'
                    : 'bg-primary hover:bg-primary-700 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </div>
                ) : isEnrolled ? (
                  'Enrolled'
                ) : (
                  'Enroll Now'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}

export function CourseCard({ course }: CourseCardProps) {
  // Real enrollment integration
  const { data: enrollmentStatus, isLoading: statusLoading } = useEnrollmentStatus(course.id)
  const { enrollCourseWithValidation, isEnrolling } = useCourseManagement()
  const { setEnrollmentLoading } = useCourseContext()

  const handleEnroll = async () => {
    if (enrollmentStatus?.isEnrolled) return

    try {
      setEnrollmentLoading(true)
      const success = await enrollCourseWithValidation(course.id)

      if (success) {
        toast.success(`You've successfully enrolled in "${course.title}". Start learning now!`)
      } else {
        toast.error('Failed to enroll in course. Please try again.')
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
      console.error('Enrollment error:', error)
    } finally {
      setEnrollmentLoading(false)
    }
  }

  const handleWishlist = () => {
    // TODO: Implement wishlist functionality
    toast.info('Wishlist functionality coming soon!')
  }

  const isEnrolled = enrollmentStatus?.isEnrolled || false
  const isLoading = isEnrolling || statusLoading

  return (
    <div className="group relative overflow-hidden rounded-2xl glass-panel card-ancient hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/25">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleWishlist}
        className={`absolute top-3 right-3 z-10 w-8 h-8 p-0 rounded-full backdrop-blur-sm ${
          course.wishlist
            ? 'bg-primary/90 hover:bg-primary-600/90 text-white'
            : 'bg-white/90 hover:bg-white text-beige-700'
        }`}
        aria-label={course.wishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart className={`w-4 h-4 ${course.wishlist ? 'fill-current' : ''}`} />
      </Button>

      <div className="aspect-video relative overflow-hidden rounded-t-2xl">
        <Image
          src={course.thumbnail || '/images/default-course-thumbnail.svg'}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-beige-900 font-medium">
            {course.category}
          </Badge>
        </div>

        {/* Quick View Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-3 right-3 w-8 h-8 p-0 rounded-full backdrop-blur-sm bg-white/90 hover:bg-white text-beige-700 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Quick view ${course.title}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <QuickViewModal course={course} />
        </Dialog>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-beige-900 line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-beige-700 mt-1">by {course.creator}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-beige-700">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span className="font-medium">{course.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-beige-900">${course.price}</span>
          <Button
            onClick={handleEnroll}
            disabled={isLoading || isEnrolled}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              isEnrolled
                ? 'bg-accent hover:bg-accent-600 text-white'
                : 'bg-primary hover:bg-primary-700 text-white hover:shadow-lg'
            }`}
            aria-label={isEnrolled ? 'Already enrolled' : `Enroll in ${course.title}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </div>
            ) : isEnrolled ? (
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Enrolled
              </div>
            ) : (
              'Enroll Now'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
