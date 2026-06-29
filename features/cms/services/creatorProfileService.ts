/**
 * Creator Profile Service
 *
 * Handles creator profile CRUD operations and stats aggregation.
 * Per architecture.md: Backend logic separated from API routes.
 */

import prisma from '@/prisma/lib/client'
import { Prisma } from '@/prisma/generated/prisma'

interface CreatorStats {
  rating: number
  studentsCount: number
  coursesCount: number
}

interface CreatorProfile {
  userId: string
  name: string | null
  title: string | null
  bio: string | null
  experience: string | null
  avatarUrl: string | null
  socialLinks: Record<string, string> | null
  stats?: CreatorStats
}

interface ProfileInput {
  name?: string
  title?: string
  bio?: string
  experience?: string
  avatarUrl?: string
  socialLinks?: {
    linkedin?: string
    github?: string
    portfolio?: string
    twitter?: string
  }
}

interface ValidationResult {
  valid: boolean
  error?: string
  code?: string
}

/**
 * Validates profile input data
 */
export function validateProfileInput(data: ProfileInput): ValidationResult {
  // Name validation
  if (data.name !== undefined) {
    if (typeof data.name !== 'string') {
      return { valid: false, error: 'Name must be a string', code: 'VALIDATION_ERROR' }
    }
    if (data.name.length > 100) {
      return {
        valid: false,
        error: 'Name must be 100 characters or less',
        code: 'VALIDATION_ERROR',
      }
    }
  }

  // Title validation
  if (data.title !== undefined) {
    if (typeof data.title !== 'string') {
      return { valid: false, error: 'Title must be a string', code: 'VALIDATION_ERROR' }
    }
    if (data.title.length > 100) {
      return {
        valid: false,
        error: 'Title must be 100 characters or less',
        code: 'VALIDATION_ERROR',
      }
    }
  }

  // Bio validation
  if (data.bio !== undefined) {
    if (typeof data.bio !== 'string') {
      return { valid: false, error: 'Bio must be a string', code: 'VALIDATION_ERROR' }
    }
    if (data.bio.length > 500) {
      return { valid: false, error: 'Bio must be 500 characters or less', code: 'VALIDATION_ERROR' }
    }
  }

  // Experience validation
  if (data.experience !== undefined) {
    if (typeof data.experience !== 'string') {
      return { valid: false, error: 'Experience must be a string', code: 'VALIDATION_ERROR' }
    }
    if (data.experience.length > 1000) {
      return {
        valid: false,
        error: 'Experience must be 1000 characters or less',
        code: 'VALIDATION_ERROR',
      }
    }
  }

  // Avatar URL validation
  if (data.avatarUrl !== undefined) {
    if (typeof data.avatarUrl !== 'string') {
      return { valid: false, error: 'Avatar URL must be a string', code: 'VALIDATION_ERROR' }
    }
    // Use native URL.canParse() for robust validation
    if (!URL.canParse(data.avatarUrl)) {
      return {
        valid: false,
        error: 'Avatar URL must be a valid URL',
        code: 'VALIDATION_ERROR',
      }
    }
    // Ensure it's HTTP(S) protocol
    try {
      const url = new URL(data.avatarUrl)
      if (!['http:', 'https:'].includes(url.protocol)) {
        return {
          valid: false,
          error: 'Avatar URL must use HTTP or HTTPS protocol',
          code: 'VALIDATION_ERROR',
        }
      }
    } catch {
      return {
        valid: false,
        error: 'Avatar URL must be a valid URL',
        code: 'VALIDATION_ERROR',
      }
    }
  }

  // Social links validation
  if (data.socialLinks !== undefined) {
    const { linkedin, github, portfolio, twitter } = data.socialLinks

    // Helper function for URL validation
    const isValidUrl = (url: string): boolean => {
      if (!URL.canParse(url)) return false
      try {
        const parsed = new URL(url)
        return ['http:', 'https:'].includes(parsed.protocol)
      } catch {
        return false
      }
    }

    if (linkedin && !isValidUrl(linkedin)) {
      return {
        valid: false,
        error: 'LinkedIn URL must be a valid HTTP(S) URL',
        code: 'VALIDATION_ERROR',
      }
    }
    if (github && !isValidUrl(github)) {
      return {
        valid: false,
        error: 'GitHub URL must be a valid HTTP(S) URL',
        code: 'VALIDATION_ERROR',
      }
    }
    if (portfolio && !isValidUrl(portfolio)) {
      return {
        valid: false,
        error: 'Portfolio URL must be a valid HTTP(S) URL',
        code: 'VALIDATION_ERROR',
      }
    }
    if (twitter && !isValidUrl(twitter)) {
      return {
        valid: false,
        error: 'Twitter URL must be a valid HTTP(S) URL',
        code: 'VALIDATION_ERROR',
      }
    }
  }

  return { valid: true }
}

/**
 * Calculate live stats for a creator
 */
export async function calculateCreatorStats(creatorId: string): Promise<CreatorStats> {
  const [coursesData, enrollmentCount] = await Promise.all([
    prisma.courses.aggregate({
      where: {
        creatorId,
        status: 'PUBLISHED',
      },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    }),
    prisma.enrollments.count({
      where: {
        courses: {
          creatorId,
          status: 'PUBLISHED',
        },
      },
    }),
  ])

  return {
    rating: coursesData._avg.rating || 0,
    studentsCount: enrollmentCount,
    coursesCount: coursesData._count.id,
  }
}

/**
 * Get creator profile by course slug
 */
export async function getCreatorByCourseSlug(
  slug: string,
): Promise<{ profile: CreatorProfile | null; stats: CreatorStats }> {
  // Get course to find creatorId
  const course = await prisma.courses.findUnique({
    where: { slug },
    select: { creatorId: true },
  })

  if (!course) {
    throw new Error('Course not found')
  }

  // Get profile
  const profile = await prisma.creator_profiles.findUnique({
    where: { userId: course.creatorId },
  })

  // Get stats
  const stats = await calculateCreatorStats(course.creatorId)

  return {
    profile: profile as CreatorProfile | null,
    stats,
  }
}

/**
 * Get own creator profile with stats
 */
export async function getCreatorProfile(userId: string): Promise<CreatorProfile | null> {
  const profile = await prisma.creator_profiles.findUnique({
    where: { userId },
  })

  if (!profile) {
    return null
  }

  const stats = await calculateCreatorStats(userId)

  return {
    ...profile,
    stats,
  } as CreatorProfile
}

/**
 * Upsert creator profile
 */
export async function upsertCreatorProfile(
  userId: string,
  data: ProfileInput,
): Promise<CreatorProfile> {
  const profile = await prisma.creator_profiles.upsert({
    where: { userId },
    create: {
      userId,
      name: data.name || null,
      title: data.title || null,
      bio: data.bio || null,
      experience: data.experience || null,
      avatarUrl: data.avatarUrl || null,
      socialLinks: data.socialLinks ? data.socialLinks : Prisma.JsonNull,
    },
    update: {
      name: data.name,
      title: data.title,
      bio: data.bio,
      experience: data.experience,
      avatarUrl: data.avatarUrl,
      socialLinks: data.socialLinks || undefined,
      updatedAt: new Date(),
    },
  })

  const stats = await calculateCreatorStats(userId)

  return {
    ...profile,
    stats,
  } as CreatorProfile
}
