/**
 * GET /api/courses/[slug]/creator
 *
 * Returns creator profile + live stats for a course.
 * Public endpoint - no auth required.
 */

import { NextResponse } from 'next/server'
import { getCreatorByCourseSlug } from '@/features/cms/services/creatorProfileService'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const { profile, stats } = await getCreatorByCourseSlug(slug)

    // Return profile data (null if not set) with stats
    return NextResponse.json({
      name: profile?.name || null,
      title: profile?.title || null,
      bio: profile?.bio || null,
      avatarUrl: profile?.avatarUrl || null,
      socialLinks: profile?.socialLinks || null,
      stats,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage === 'Course not found') {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    console.error('Error fetching creator profile:', error)
    return NextResponse.json({ error: 'Failed to fetch creator profile' }, { status: 500 })
  }
}
