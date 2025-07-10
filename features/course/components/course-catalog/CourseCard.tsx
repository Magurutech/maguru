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
import React, { useState } from 'react'

interface Course {
  id: number
  title: string
  creator: string
  thumbnail: string
  rating: number
  students: number
  duration: string
  category: string
  price: number
  enrolled: boolean
  createdAt: string
  description: string
  longDescription: string
  curriculum: string[]
  wishlist: boolean
}

interface CourseCardProps {
  course: Course
  onEnroll: (courseId: number) => void
  onWishlist: (courseId: number) => void
}

function QuickViewModal({ course, onEnroll, onWishlist }: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEnroll = async () => {
    if (course.enrolled) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onEnroll(course.id)
    setIsLoading(false)
  }

  return (
    <DialogContent className="max-w-2xl glass-panel">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-800">{course.title}</DialogTitle>
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
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
            <p className="text-sm text-gray-600 mb-2">by {course.creator}</p>
            <Badge variant="secondary" className="mb-4">
              {course.category}
            </Badge>
            <p className="text-gray-700 leading-relaxed">{course.longDescription}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">What you&apos;ll learn:</h4>
            <ul className="space-y-1">
              {course.curriculum.map((item, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-2xl font-bold text-gray-800">${course.price}</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onWishlist(course.id)}
                className={`${course.wishlist ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
              >
                <Heart className={`w-4 h-4 ${course.wishlist ? 'fill-current' : ''}`} />
              </Button>
              <Button
                onClick={handleEnroll}
                disabled={isLoading}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  course.enrolled
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </div>
                ) : course.enrolled ? (
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

export function CourseCard({ course, onEnroll, onWishlist }: CourseCardProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleEnroll = async () => {
    if (course.enrolled) return
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    onEnroll(course.id)
    setIsLoading(false)
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl glass-panel card-ancient hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/25">
      {/* Wishlist Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onWishlist(course.id)}
        className={`absolute top-3 right-3 z-10 w-8 h-8 p-0 rounded-full backdrop-blur-sm ${
          course.wishlist
            ? 'bg-red-500/90 hover:bg-red-600/90 text-white'
            : 'bg-white/90 hover:bg-white text-gray-600'
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
          <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium">
            {course.category}
          </Badge>
        </div>

        {/* Quick View Trigger */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-3 right-3 w-8 h-8 p-0 rounded-full backdrop-blur-sm bg-white/90 hover:bg-white text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label={`Quick view ${course.title}`}
            >
              <Eye className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <QuickViewModal course={course} onEnroll={onEnroll} onWishlist={onWishlist} />
        </Dialog>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-red-700 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">by {course.creator}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
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
          <span className="text-2xl font-bold text-gray-800">${course.price}</span>
          <Button
            onClick={handleEnroll}
            disabled={isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              course.enrolled
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-lg'
            }`}
            aria-label={course.enrolled ? 'Already enrolled' : `Enroll in ${course.title}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </div>
            ) : course.enrolled ? (
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
