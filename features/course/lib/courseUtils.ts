import { Course, CourseMetadata, CourseSection, CourseItem } from '../types/course.types'
import path from 'path'
import fs from 'fs/promises'

// Simple frontmatter parser (replacement for gray-matter)
function parseFrontmatter(content: string): { data: any; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return { data: {}, content }
  }

  const frontmatter = match[1]
  const markdownContent = match[2]

  // Parse YAML-like frontmatter
  const data: any = {}
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim()
      let value = line.slice(colonIndex + 1).trim()

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      // Handle arrays
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''))
      }

      data[key] = value
    }
  })

  return { data, content: markdownContent }
}

// Calculate reading time (replacement for reading-time library)
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)

  if (minutes < 60) {
    return `${minutes} minutes`
  } else {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minutes` : ''}`
  }
}

// Scan course directory and extract course information
export async function scanCourseDirectory(): Promise<Course[]> {
  const coursesDir = path.join(process.cwd(), 'docs', 'course')

  try {
    const courseFolders = await fs.readdir(coursesDir, { withFileTypes: true })
    const courses: Course[] = []

    for (const folder of courseFolders) {
      if (folder.isDirectory()) {
        try {
          const course = await loadCourse(folder.name)
          courses.push(course)
        } catch (error) {
          console.error(`Error loading course ${folder.name}:`, error)
        }
      }
    }

    return courses
  } catch (error) {
    console.error('Error scanning course directory:', error)
    return []
  }
}

// Load a single course from its directory
export async function loadCourse(slug: string): Promise<Course> {
  const courseDir = path.join(process.cwd(), 'docs', 'course', slug)
  const courseFile = path.join(courseDir, 'course.md')

  // Read course metadata
  const courseContent = await fs.readFile(courseFile, 'utf-8')
  const { data: metadata, content } = parseFrontmatter(courseContent)

  // Validate required metadata
  if (!metadata.title || !metadata.description || !metadata.instructor) {
    throw new Error(`Course ${slug} is missing required metadata`)
  }

  // Scan sections
  const sections = await loadSections(courseDir)
  const totalItems = sections.reduce((total, section) => total + section.items.length, 0)
  const estimatedDuration = calculateTotalDuration(sections)

  return {
    slug,
    metadata: {
      title: metadata.title,
      description: metadata.description,
      instructor: metadata.instructor,
      level: metadata.level || 'beginner',
      duration: metadata.duration || estimatedDuration,
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      thumbnail: metadata.thumbnail,
      lastUpdated: metadata.lastUpdated || new Date().toISOString()
    },
    sections,
    totalItems,
    estimatedDuration
  }
}

// Load sections for a course
async function loadSections(courseDir: string): Promise<CourseSection[]> {
  const sectionsDir = courseDir
  const items = await fs.readdir(sectionsDir, { withFileTypes: true })

  const sectionFolders = items
    .filter(item => item.isDirectory() && item.name.startsWith('section-'))
    .sort((a, b) => {
      const aNum = parseInt(a.name.replace('section-', ''))
      const bNum = parseInt(b.name.replace('section-', ''))
      return aNum - bNum
    })

  const sections: CourseSection[] = []

  for (const sectionFolder of sectionFolders) {
    const section = await loadSection(sectionsDir, sectionFolder.name)
    sections.push(section)
  }

  return sections
}

// Load a single section
async function loadSection(courseDir: string, sectionFolderName: string): Promise<CourseSection> {
  const sectionDir = path.join(courseDir, sectionFolderName)
  const items = await fs.readdir(sectionDir)

  const sectionOrder = parseInt(sectionFolderName.replace('section-', ''))
  const sectionTitle = `Section ${sectionOrder}`

  // Load markdown files in this section
  const markdownFiles = items.filter(file => file.endsWith('.md')).sort()
  const courseItems: CourseItem[] = []

  for (let i = 0; i < markdownFiles.length; i++) {
    const file = markdownFiles[i]
    const filePath = path.join(sectionDir, file)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data: itemData } = parseFrontmatter(fileContent)

    courseItems.push({
      id: file.replace('.md', ''),
      title: itemData.title || file.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: itemData.description,
      contentPath: path.join(sectionDir, file),
      contentType: 'markdown',
      order: i + 1,
      duration: itemData.duration,
      isOptional: itemData.isOptional === 'true' || itemData.isOptional === true
    })
  }

  return {
    id: sectionFolderName,
    title: sectionTitle,
    description: courseItems[0]?.description,
    order: sectionOrder,
    items: courseItems
  }
}

// Calculate total duration for all sections
function calculateTotalDuration(sections: CourseSection[]): string {
  // For now, return a placeholder
  // In a real implementation, you'd sum up all item durations
  const totalMinutes = sections.reduce((total, section) => {
    return total + (section.items.length * 15) // Assume 15 minutes per item
  }, 0)

  if (totalMinutes < 60) {
    return `${totalMinutes} minutes`
  } else {
    const hours = Math.floor(totalMinutes / 60)
    const remainingMinutes = totalMinutes % 60
    return `${hours} hour${hours > 1 ? 's' : ''} ${remainingMinutes > 0 ? `${remainingMinutes} minutes` : ''}`
  }
}

// Get course content (markdown content for a specific item)
export async function getCourseContent(contentPath: string): Promise<string> {
  try {
    const content = await fs.readFile(contentPath, 'utf-8')
    const { content: markdownContent } = parseFrontmatter(content)
    return markdownContent
  } catch (error) {
    console.error('Error reading course content:', error)
    return '# Content Not Found\n\nThe requested content could not be loaded.'
  }
}

// Find course item by content path
export function findCourseItem(course: Course, contentPath: string): { section: CourseSection; item: CourseItem } | null {
  for (const section of course.sections) {
    for (const item of section.items) {
      if (item.contentPath === contentPath) {
        return { section, item }
      }
    }
  }
  return null
}

// Get next item in course
export function getNextItem(course: Course, currentSectionId: string, currentItemId: string): { section: CourseSection; item: CourseItem } | null {
  const currentSectionIndex = course.sections.findIndex(s => s.id === currentSectionId)
  const currentItemIndex = course.sections[currentSectionIndex]?.items.findIndex(i => i.id === currentItemId)

  if (currentSectionIndex === -1 || currentItemIndex === -1) return null

  // Check if there's a next item in the current section
  if (currentItemIndex < course.sections[currentSectionIndex].items.length - 1) {
    return {
      section: course.sections[currentSectionIndex],
      item: course.sections[currentSectionIndex].items[currentItemIndex + 1]
    }
  }

  // Check if there's a next section
  if (currentSectionIndex < course.sections.length - 1) {
    const nextSection = course.sections[currentSectionIndex + 1]
    if (nextSection.items.length > 0) {
      return {
        section: nextSection,
        item: nextSection.items[0]
      }
    }
  }

  return null
}