# Course Library

Utility functions and data loading logic for the course management system.

## Overview

The course lib provides core utilities for course data management, content loading, and file system operations. This serves as the **Data Layer** in our simplified feature-first architecture.

## Core Functions

### Course Data Loading

#### loadCourse(slug: string)
Loads a single course from its directory, parsing metadata and content.

**Parameters:**
- `slug`: Course directory identifier

**Returns:**
```typescript
Promise<Course>
```

**Example:**
```typescript
// Load course data
const course = await loadCourse('web-development-basics')
console.log(course.metadata.title) // "Web Development Basics"
console.log(course.overviewContent) // Course overview markdown
```

**Process:**
1. Reads `course.md` file from course directory
2. Parses frontmatter metadata using `parseFrontmatter()`
3. Scans section directories for content files
4. Calculates total items and estimated duration
5. Returns structured Course object

#### scanCourseDirectory()
Scans the entire courses directory and loads all available courses.

**Returns:**
```typescript
Promise<Course[]>
```

**Example:**
```typescript
// Get all courses
const courses = await scanCourseDirectory()
console.log(`Found ${courses.length} courses`)
courses.forEach(course => {
  console.log(`- ${course.metadata.title} (${course.slug})`)
})
```

### Content Management

#### getCourseContent(slug: string, contentPath: string)
Loads specific course content from file system with security validation.

**Parameters:**
- `slug`: Course identifier
- `contentPath`: File path to content file

**Returns:**
```typescript
Promise<string>
```

**Security Features:**
- Path traversal prevention
- File system boundary validation
- Error handling with fallback content

**Example:**
```typescript
// Load lesson content
const content = await getCourseContent(
  'web-development-basics',
  'docs/course/web-development-basics/section-01/01-introduction.md'
)

// Renders markdown with enhanced parsing
const renderedContent = parseMarkdown(content)
```

#### parseFrontmatter(content: string)
Custom frontmatter parser for extracting metadata from markdown files.

**Parameters:**
- `content`: Raw markdown content with frontmatter

**Returns:**
```typescript
{
  data: any      // Parsed metadata object
  content: string  // Markdown content without frontmatter
}
```

**Features:**
- YAML-like frontmatter parsing
- Array value support
- Quote handling for strings
- Error-tolerant parsing

**Example:**
```typescript
const courseContent = `---
title: Web Development Basics
instructor: Tim Maguru
tags: [HTML, CSS, JavaScript]
level: beginner
---

# Course Overview
This is the course content...
`

const { data, content } = parseFrontmatter(courseContent)
console.log(data.title) // "Web Development Basics"
console.log(data.tags)  // ["HTML", "CSS", "JavaScript"]
console.log(content)      // "# Course Overview\nThis is the course content..."
```

### Navigation Utilities

#### findCourseItem(course: Course, contentPath: string)
Finds a specific course item by its content path.

**Parameters:**
- `course`: Course object
- `contentPath`: Content file path

**Returns:**
```typescript
{ section: CourseSection; item: CourseItem } | null
```

**Example:**
```typescript
const itemInfo = findCourseItem(course, 'path/to/content.md')
if (itemInfo) {
  console.log(`Found item: ${itemInfo.item.title} in ${itemInfo.section.title}`)
} else {
  console.log('Item not found')
}
```

#### getNextItem(course: Course, currentSectionId: string, currentItemId: string)
Finds the next item in the course sequence.

**Parameters:**
- `course`: Course object
- `currentSectionId`: Current section identifier
- `currentItemId`: Current item identifier

**Returns:**
```typescript
{ section: CourseSection; item: CourseItem } | null
```

**Logic:**
1. Try next item in current section
2. Try first item in next section
3. Return null if no next item exists

#### calculateReadingTime(content: string)
Estimates reading time for content based on word count.

**Parameters:**
- `content`: Text content to analyze

**Returns:**
```typescript
string  // Formatted time string
```

**Example:**
```typescript
const time = calculateReadingTime(longContent)
console.log(time) // "15 minutes" or "1 hour 30 minutes"
```

## File System Structure

### Course Directory Layout
```
docs/course/
├── web-development-basics/           # Course slug
│   ├── course.md                     # Metadata + overview
│   ├── section-01/                   # Section 1
│   │   ├── 01-introduction.md        # Lesson 1
│   │   ├── 02-html-basics.md          # Lesson 2
│   │   └── ...
│   ├── section-02/                   # Section 2
│   │   └── ...
│   └── section-03/                   # Section 3
│       └── ...
└── react-fundamentals/              # Another course
    ├── course.md
    └── sections/
        └── ...
```

### Content File Format
Each lesson file follows this structure:
```markdown
---
title: Lesson Title
description: Brief description
duration: 25 minutes
isOptional: false
---

# Lesson Content

Rich markdown content with:
- Headings and subheadings
- Code blocks with syntax highlighting
- Images and media
- Interactive elements
- Exercises and examples
```

## Data Models

### Course Structure
```typescript
interface Course {
  slug: string
  metadata: {
    title: string
    description: string
    instructor: string
    level: 'beginner' | 'intermediate' | 'advanced'
    duration: string
    tags: string[]
    thumbnail?: string
    lastUpdated: string
  }
  sections: CourseSection[]
  totalItems: number
  estimatedDuration: string
  overviewContent?: string
}

interface CourseSection {
  id: string
  title: string
  description?: string
  order: number
  items: CourseItem[]
}

interface CourseItem {
  id: string
  title: string
  description?: string
  contentPath: string
  contentType: 'markdown' | 'video' | 'quiz' | 'exercise'
  order: number
  duration?: string
  isOptional: boolean
}
```

## Error Handling

### File System Errors
```typescript
try {
  const course = await loadCourse(slug)
  return course
} catch (error) {
  if (error.code === 'ENOENT') {
    console.warn(`Course not found: ${slug}`)
    return null
  }
  throw new Error(`Failed to load course ${slug}: ${error.message}`)
}
```

### Content Loading Errors
```typescript
export async function getCourseContent(slug: string, contentPath: string): Promise<string> {
  try {
    const content = await fs.readFile(contentPath, 'utf-8')
    const { content: markdownContent } = parseFrontmatter(content)
    return markdownContent
  } catch (error) {
    console.error(`Error reading content from ${contentPath}:`, error)
    return '# Content Not Found\n\nThe requested content could not be loaded.'
  }
}
```

### Security Considerations
```typescript
function validateContentPath(courseDir: string, contentPath: string): string {
  // Convert to absolute path
  const resolvedPath = path.resolve(contentPath)

  // Ensure path is within course directory
  if (!resolvedPath.startsWith(path.resolve(courseDir))) {
    throw new Error('Invalid path: Path traversal detected')
  }

  return resolvedPath
}
```

## Performance Optimizations

### Content Caching
```typescript
// Simple in-memory cache
const contentCache = new Map<string, string>()

export async function getCourseContent(slug: string, contentPath: string): Promise<string> {
  const cacheKey = `${slug}:${contentPath}`

  if (contentCache.has(cacheKey)) {
    return contentCache.get(cacheKey)!
  }

  const content = await loadContentFromDisk(slug, contentPath)
  contentCache.set(cacheKey, content)

  return content
}
```

### Efficient Directory Scanning
```typescript
export async function scanCourseDirectory(): Promise<Course[]> {
  const coursesDir = path.join(process.cwd(), 'docs', 'course')

  try {
    const entries = await fs.readdir(coursesDir, { withFileTypes: true })

    // Parallel loading of courses
    const coursePromises = entries
      .filter(entry => entry.isDirectory())
      .map(folder => loadCourse(folder.name))
      .filter(Boolean) // Remove failed loads

    return await Promise.all(coursePromises)
  } catch (error) {
    console.error('Error scanning course directory:', error)
    return []
  }
}
```

## Development Guidelines

### Adding New Utilities
```typescript
// 1. Clear function signature
export function newUtility(params: ParamType): ReturnType {
  // Implementation
}

// 2. Comprehensive JSDoc
/**
 * Brief description of what the function does
 * @param params - Parameter description
 * @returns Return value description
 * @example
 * const result = newUtility({ param: 'value' })
 */

// 3. Error handling
export function robustUtility(param: string): string {
  try {
    // Main logic
    return processParam(param)
  } catch (error) {
    console.error('Utility failed:', error)
    return fallbackValue
  }
}
```

### Testing Utilities
```typescript
// Unit tests
import { loadCourse } from '../courseUtils'
import { mockCourseStructure } from '../__tests__/mocks'

describe('loadCourse', () => {
  beforeEach(() => {
    jest.mock('fs/promises')
  })

  test('should load course successfully', async () => {
    const mockFs = require('fs/promises')
    mockFs.readFile.mockResolvedValue(mockCourseContent)

    const course = await loadCourse('test-course')

    expect(course.slug).toBe('test-course')
    expect(course.metadata.title).toBe('Test Course')
  })

  test('should handle missing course', async () => {
    const mockFs = require('fs/promises')
    mockFs.readFile.mockRejectedValue(new Error('File not found'))

    await expect(loadCourse('missing-course'))
      .rejects.toThrow('Course missing-course is missing required metadata')
  })
})
```

## Migration Notes

### From External Libraries
- **gray-matter**: Replaced with custom `parseFrontmatter()` for better control
- **reading-time**: Replaced with custom `calculateReadingTime()` for simplicity
- **glob**: Used native Node.js `fs.readdir()` for directory scanning

### API Compatibility
The utilities maintain compatibility with the existing API structure while providing enhanced functionality for the v3.0 requirements.