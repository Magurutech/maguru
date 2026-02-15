export interface CourseMetadata {
  title: string
  description: string
  instructor: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: string // e.g., "2 hours 30 minutes"
  tags: string[]
  thumbnail?: string
  lastUpdated: string
}

export interface CourseSection {
  id: string
  title: string
  description?: string
  order: number
  items: CourseItem[]
}

export interface CourseItem {
  id: string
  title: string
  description?: string
  contentPath: string // path to markdown file
  contentType: 'markdown' | 'video' | 'quiz' | 'exercise'
  order: number
  duration?: string // e.g., "15 minutes"
  isOptional?: boolean
}

export interface Course {
  slug: string
  metadata: CourseMetadata
  sections: CourseSection[]
  totalItems: number
  estimatedDuration: string
  overviewContent?: string  // Course overview content dari course.md
}

export interface CourseProgress {
  courseId: string
  completedItems: string[] // array of item IDs
  currentSectionId?: string
  currentItemId?: string
  lastAccessedAt: string
  completionPercentage: number
  isCompleted: boolean
  completedAt?: string
}

export interface CourseListItem {
  slug: string
  title: string
  description: string
  instructor: string
  level: string
  duration: string
  tags: string[]
  progress?: CourseProgress
  thumbnail?: string
}

// UI Component Props Types
export interface CourseCardProps {
  course: CourseListItem
  progress?: CourseProgress
  className?: string
}

export interface TimelineNavProps {
  sections: CourseSection[]
  currentSectionId?: string
  currentItemId?: string
  completedItems: string[]
  onItemSelect: (sectionId: string, itemId: string) => void
  className?: string
}

export interface CourseHeaderProps {
  course: Course
  progress?: CourseProgress
  className?: string
  mode?: 'overview' | 'learning'
  showStartButton?: boolean
  startButtonHref?: string
  showBackButton?: boolean
  backButtonHref?: string
}

export interface ContentRendererProps {
  content: string
  contentType: 'markdown' | 'video' | 'quiz' | 'exercise'
  className?: string
}

// API Response Types
export interface CourseListResponse {
  courses: CourseListItem[]
  total: number
}

export interface CourseDetailResponse {
  course: Course
  progress?: CourseProgress
}

// Local Storage Keys
export const COURSE_PROGRESS_KEY = 'maguru_course_progress'

// Utility Types
export type CourseLevel = CourseMetadata['level']
export type ContentType = CourseItem['contentType']