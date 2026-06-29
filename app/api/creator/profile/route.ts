/**
 * GET /api/creator/profile
 * Returns own creator profile with stats.
 *
 * PUT /api/creator/profile
 * Upsert own creator profile.
 *
 * Both require authentication.
 */

import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import {
  getCreatorProfile,
  upsertCreatorProfile,
  validateProfileInput,
} from '@/features/cms/services/creatorProfileService'

/**
 * GET own profile + stats
 */
export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await getCreatorProfile(user.id)

    if (!profile) {
      return NextResponse.json({ profile: null })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error fetching creator profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

/**
 * PUT (upsert) own profile
 */
export async function PUT(request: Request) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validate input
    const validation = validateProfileInput(body)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error, code: validation.code }, { status: 400 })
    }

    // Upsert profile
    const profile = await upsertCreatorProfile(user.id, body)

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating creator profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
