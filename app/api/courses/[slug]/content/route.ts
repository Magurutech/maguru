import { NextResponse } from 'next/server'
import { getCourseContent } from '@/features/course/lib/courseUtils'
import path from 'path'

// Security function to validate and sanitize content path
function validateContentPath(slug: string, contentPath: string): string {
  if (!slug || !contentPath) {
    throw new Error('Slug and content path are required')
  }

  // Get the allowed course directory
  const courseDir = path.join(process.cwd(), 'docs', 'course', slug)
  const resolvedCourseDir = path.resolve(courseDir)

  // If contentPath is already an absolute path, validate it directly
  let resolvedPath: string
  if (path.isAbsolute(contentPath)) {
    resolvedPath = path.resolve(contentPath)
  } else {
    // Handle relative paths
    const sanitizedPath = contentPath
      .replace(/\.\./g, '') // Remove parent directory references
      .replace(/\\/g, '/')  // Normalize path separators
      .replace(/^\//, '')    // Remove leading slashes

    const fullPath = path.join(courseDir, sanitizedPath)
    resolvedPath = path.resolve(fullPath)
  }

  // Ensure the resolved path is still within the course directory
  if (!resolvedPath.startsWith(resolvedCourseDir)) {
    throw new Error('Invalid path: Path traversal detected')
  }

  return resolvedPath
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { contentPath } = await request.json()

    if (!contentPath) {
      return NextResponse.json(
        { error: 'Content path is required' },
        { status: 400 }
      )
    }

    // Validate and sanitize the path to prevent traversal attacks
    const safePath = validateContentPath(slug, contentPath)

    // Load content using the validated path
    const content = await getCourseContent(safePath)

    return NextResponse.json({
      content
    })
  } catch (error) {
    console.error('Error loading course content:', error)

    // Don't expose sensitive error details to client
    const isSecurityError = error.message.includes('Invalid path') ||
                           error.message.includes('Path traversal')

    if (isSecurityError) {
      console.warn('Security alert:', error.message)
    }

    return NextResponse.json(
      {
        error: 'Failed to load content',
        content: '# Content Not Found\n\nThe requested content could not be loaded.'
      },
      { status: 200 } // Return 200 with fallback content
    )
  }
}