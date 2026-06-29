/**
 * GET /api/creator/profile/[userId]
 *
 * Returns public creator profile for any user.
 * No authentication required.
 */

import { NextResponse } from 'next/server'
import { getCreatorProfile } from '@/features/cms/services/creatorProfileService'

export async function GET(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  try {
    const { userId } = await params

    const profile = await getCreatorProfile(userId)

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Return only public fields
    return NextResponse.json({
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      socialLinks: profile.socialLinks,
      stats: profile.stats,
    })
  } catch (error) {
    console.error('Error fetching public creator profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
