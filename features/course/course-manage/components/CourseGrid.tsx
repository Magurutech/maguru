import type { Course } from '../types'
import { CourseCard } from './CourseCard'

interface CourseGridProps {
  courses: Course[]
  onEdit: (course: Course) => void
  onDelete: (courseId: string) => void
}

export function CourseGrid({ courses, onEdit, onDelete }: CourseGridProps) {
  return (
    <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(340px,1fr))] auto-rows-max">
      {courses.map((course, index) => (
        <CourseCard
          key={course.id}
          course={course}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
