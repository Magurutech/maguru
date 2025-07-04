export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  status: 'draft' | 'published' | 'archived'
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  createdAt: string
}
