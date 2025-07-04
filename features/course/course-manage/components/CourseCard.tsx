import { Edit, Trash2, Eye, Users, Clock, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Course } from '../types'
import { getStatusColor, getStatusText } from '../lib/courseUtils'
import Image from 'next/image'
interface CourseCardProps {
  course: Course
  index: number
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
}

export function CourseCard({ course, index, onEdit, onDelete }: CourseCardProps) {
  return (
    <Card
      className="card-ancient hover-lift animate-fade-in max-w-md flex flex-col h-full"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="relative">
        <Image
          src="/globe.svg"
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
          width={100}
          height={200}
        />
        <div className="absolute top-4 right-4">
          <Badge className={`${getStatusColor(course.status)}`}>
            {getStatusText(course.status)}
          </Badge>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg"></div>
      </div>

      <CardContent className="px-4 flex-grow mx-auto flex flex-col h-full justify-between">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-beige-900 line-clamp-2 hover:text-gradient-primary transition-colors">
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(course)}
            className="flex-1 btn-secondary hover-glow"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(course.id)}
            className="bg-primary-100 border-primary-400 text-primary-600 hover:bg-primary-500 hover:text-white neu-button"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
