'use client'

import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseHeaderProps } from '../types/course.types'
import {
  Clock,
  BookOpen,
  User,
  Calendar,
  PlayCircle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Award,
  Target
} from 'lucide-react'
import Link from 'next/link'

export function CourseHeader({
  course,
  progress,
  className = '',
  mode = 'overview',
  showStartButton = false,
  startButtonHref = '',
  showBackButton = false,
  backButtonHref = ''
}: CourseHeaderProps) {
  const progressPercentage = progress?.completionPercentage || 0
  const isCompleted = progressPercentage === 100
  const isInProgress = progressPercentage > 0 && progressPercentage < 100
  const hasStarted = progressPercentage > 0

  const getLevelBadgeColor = (level: string) => {
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

  const getLevelLabel = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return 'Pemula'
      case 'intermediate':
        return 'Menengah'
      case 'advanced':
        return 'Lanjutan'
      default:
        return level
    }
  }

  return (
    <div className={`bg-gradient-to-br from-beige-50 to-white rounded-lg shadow-sm p-8 mb-8 ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Info - Left Side */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className={getLevelBadgeColor(course.metadata.level)}>
                  {getLevelLabel(course.metadata.level)}
                </Badge>
                {isCompleted && (
                  <Badge className="bg-green-500 text-white border-green-600">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Selesai
                  </Badge>
                )}
                {isInProgress && (
                  <Badge className="bg-blue-500 text-white border-blue-600">
                    <PlayCircle className="w-3 h-3 mr-1" />
                    Sedang Berjalan
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-beige-900 mb-4 leading-tight">
                {course.metadata.title}
              </h1>

              <p className="text-lg text-beige-700 mb-6 leading-relaxed">
                {course.metadata.description}
              </p>
            </div>
          </div>

          {/* Course Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-beige-600" />
              <span className="text-beige-700">
                <span className="font-semibold">{course.metadata.instructor}</span>
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-beige-600" />
              <span className="text-beige-700">{course.metadata.duration}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-beige-600" />
              <span className="text-beige-700">{course.totalItems} materi</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-beige-600" />
              <span className="text-beige-700">
                {new Date(course.metadata.lastUpdated).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Tags */}
          {course.metadata.tags && course.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {course.metadata.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-beige-100 text-beige-700 hover:bg-beige-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Progress Section */}
          {hasStarted && (
            <div className="bg-white rounded-lg p-6 border border-beige-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-secondary-600" />
                  <h3 className="font-semibold text-beige-900">Progress Pembelajaran</h3>
                </div>
                <span className="text-2xl font-bold text-secondary-600">
                  {progressPercentage}%
                </span>
              </div>

              <Progress value={progressPercentage} className="mb-4 h-3" />

              <div className="text-sm text-beige-600">
                {isCompleted ? (
                  <div className="flex items-center gap-2 text-green-700">
                    <Award className="w-4 h-4" />
                    <span>Selamat! Anda telah menyelesaikan course ini.</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>
                      {progress?.completedItems.length || 0} dari {course.totalItems} materi telah selesai
                    </span>
                    <span>
                      Terakhir dipelajari: {progress?.lastAccessedAt ?
                        new Date(progress.lastAccessedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'
                      }
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons - Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 border border-beige-200 sticky top-4">
            <h3 className="font-semibold text-beige-900 mb-4">Aksi Cepat</h3>

            <div className="space-y-3">
              {/* Back Button for Learning Mode */}
              {showBackButton && backButtonHref && (
                <Link href={backButtonHref}>
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Overview
                  </Button>
                </Link>
              )}

              {/* Start Learning Button for Overview Mode */}
              {showStartButton && startButtonHref && (
                <Link href={startButtonHref}>
                  <Button className="w-full btn-primary hover-glow">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {hasStarted ? 'Lanjut Belajar' : 'Mulai Belajar'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              )}

              {/* Legacy Buttons (when in learning mode or no custom config) */}
              {!showStartButton && mode === 'learning' && (
                <>
                  {isCompleted ? (
                    <Button className="w-full btn-secondary hover-glow">
                      <Award className="w-4 h-4 mr-2" />
                      Review Course
                    </Button>
                  ) : isInProgress ? (
                    <Button className="w-full btn-primary hover-glow">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Lanjut Belajar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button className="w-full btn-primary hover-glow">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Mulai Belajar
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </>
              )}

              {/* Preview Button (only show when in overview mode without custom start button) */}
              {mode === 'overview' && !showStartButton && (
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Lihat Preview
                </Button>
              )}

              {/* Schedule Button */}
              <Button variant="ghost" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Tambah ke Jadwal
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-beige-200">
              <h4 className="text-sm font-medium text-beige-900 mb-3">Info Singkat</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-beige-600">Total Durasi</span>
                  <span className="font-medium text-beige-900">{course.estimatedDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-beige-600">Jumlah Section</span>
                  <span className="font-medium text-beige-900">{course.sections.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-beige-600">Level</span>
                  <span className="font-medium text-beige-900">{getLevelLabel(course.metadata.level)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}