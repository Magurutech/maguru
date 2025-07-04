import type { Course } from '../types'

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-accent-500 text-white'
    case 'draft':
      return 'bg-secondary-400 text-beige-900'
    case 'archived':
      return 'bg-beige-500 text-white'
    default:
      return 'bg-beige-200 text-beige-900'
  }
}

export const getStatusText = (status: string) => {
  switch (status) {
    case 'published':
      return 'Diterbitkan'
    case 'draft':
      return 'Draft'
    case 'archived':
      return 'Diarsipkan'
    default:
      return status
  }
}

export const filterCourses = (courses: Course[], searchQuery: string, selectedStatus: string) => {
  return courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus
    return matchesSearch && matchesStatus
  })
}
