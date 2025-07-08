'use client'

import { useState, useCallback, memo } from 'react'
import { Edit, Trash2, Eye, Users, Clock, Star, AlertCircle, Play, Pause } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Course, CourseStatus } from '../../types'
import { getStatusColor, getStatusText } from '../../lib/courseUtils'
import { useCourseManagement } from '../../hooks/useCourseManagement'
import { useCourseContext } from '../../contexts/courseContext'
import Image from 'next/image'

interface CourseCardProps {
  course: Course
  index: number
}

export const CourseCard = memo(function CourseCard({ course, index }: CourseCardProps) {
  // Component state untuk UI interactions
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Feature state dari hooks dan context
  const { updateCourseStatusWithValidation, error: managementError } = useCourseManagement()
  const { openEditDialog, openDeleteDialog } = useCourseContext()

  // Memoized event handlers untuk performance
  const handleEdit = useCallback(async () => {
    setIsActionLoading(true)
    try {
      openEditDialog(course)
    } catch (error) {
      console.error('Failed to open edit dialog:', error)
    } finally {
      setIsActionLoading(false)
    }
  }, [openEditDialog, course])

  const handleDelete = useCallback(async () => {
    setIsActionLoading(true)
    try {
      openDeleteDialog(course)
    } catch (error) {
      console.error('Failed to open delete dialog:', error)
    } finally {
      setIsActionLoading(false)
    }
  }, [openDeleteDialog, course])

  // Quick status update actions
  const handleQuickPublish = useCallback(async () => {
    setIsActionLoading(true)
    try {
      await updateCourseStatusWithValidation(course.id, 'PUBLISHED' as CourseStatus)
    } catch (error) {
      console.error('Failed to publish course:', error)
    } finally {
      setIsActionLoading(false)
    }
  }, [updateCourseStatusWithValidation, course.id])

  const handleQuickDraft = useCallback(async () => {
    setIsActionLoading(true)
    try {
      await updateCourseStatusWithValidation(course.id, 'DRAFT' as CourseStatus)
    } catch (error) {
      console.error('Failed to set course to draft:', error)
    } finally {
      setIsActionLoading(false)
    }
  }, [updateCourseStatusWithValidation, course.id])

  const handleImageLoad = useCallback(() => {
    setIsImageLoaded(true)
    setImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsImageLoaded(true)
    setImageError(true)
  }, [])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  // Memoized computed values
  const statusColor = getStatusColor(course.status)
  const statusText = getStatusText(course.status)
  const imageSrc = imageError ? '/globe.svg' : course.thumbnail || '/globe.svg'

  // Quick action button based on current status
  const getQuickActionButton = () => {
    switch (course.status) {
      case 'DRAFT':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickPublish}
            disabled={isActionLoading}
            className="bg-green-100 border-green-400 text-green-600 hover:bg-green-500 hover:text-white transition-all duration-300"
          >
            <Play className="h-3 w-3 mr-1" />
            Publish
          </Button>
        )
      case 'PUBLISHED':
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={handleQuickDraft}
            disabled={isActionLoading}
            className="bg-yellow-100 border-yellow-400 text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all duration-300"
          >
            <Pause className="h-3 w-3 mr-1" />
            Set to Draft
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <Card
      className={`card-ancient transition-all duration-300 max-w-md flex flex-col h-full p-1 pb-2 ${
        isHovered ? 'hover-lift scale-[1.02] shadow-xl' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative">
        <Image
          src={imageSrc}
          alt={course.title}
          className={`w-full h-48 object-cover rounded-t-lg transition-all duration-300 ${
            isImageLoaded ? 'opacity-100' : 'opacity-0'
          } ${isHovered ? 'scale-105' : 'scale-100'}`}
          width={100}
          height={200}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-beige-200 animate-pulse rounded-t-lg flex items-center justify-center">
            <div className="text-beige-600">Loading...</div>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <Badge
            className={`${statusColor} transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}
          >
            {statusText}
          </Badge>
        </div>
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 rounded-t-lg ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        ></div>
      </div>

      <CardContent className="px-4 flex-grow mx-auto w-full flex flex-col h-full justify-between">
        {/* Error Display */}
        {managementError && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-2">
            <div className="flex items-center gap-1 text-red-800 text-xs">
              <AlertCircle className="h-3 w-3" />
              <span>Error: {managementError}</span>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <h3
            className={`font-bold text-lg text-beige-900 line-clamp-2 transition-colors duration-300 ${
              isHovered ? 'text-gradient-primary' : ''
            }`}
          >
            {course.title}
          </h3>
        </div>

        <p className="text-beige-700 text-sm mb-4 line-clamp-2">{course.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2 text-beige-700">
            <Users className="h-4 w-4" />
            <span>{course.students} siswa</span>
          </div>
          <div className="flex items-center gap-2 text-beige-700">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-beige-700">
            <Eye className="h-4 w-4" />
            <span>{course.lessons} pelajaran</span>
          </div>
          {course.rating > 0 && (
            <div className="flex items-center gap-2 text-beige-700">
              <Star className="h-4 w-4 fill-secondary-400 text-secondary-400" />
              <span>{course.rating}</span>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="mb-3">{getQuickActionButton()}</div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            disabled={isActionLoading}
            className="flex-1 btn-secondary hover-glow transition-all duration-300"
          >
            <Edit className="h-4 w-4 mr-1" />
            {isActionLoading ? 'Loading...' : 'Edit'}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isActionLoading}
                className="bg-primary-100 border-primary-400 text-primary-600 hover:bg-primary-500 hover:text-white neu-button transition-all duration-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus Kursus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
})
