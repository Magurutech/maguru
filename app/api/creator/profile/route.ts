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
import { createClient } from '@/lib/supabase/server'
import {
  getCreatorProfile,
  upsertCreatorProfile,
  validateProfileInput,
} from '@/features/cms/services/creatorProfileService'

/**
 * GET own profile + stats
 */
export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const hasBearer = !!authHeader?.toLowerCase().startsWith('bearer ')
    const forwardedUserId = request.headers.get('x-user-id')
    console.log(`[API GET /api/creator/profile] Incoming request: hasBearer=${hasBearer}, forwardedUserId=${forwardedUserId || 'none'}`)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      console.warn(`[API GET /api/creator/profile] 401 Unauthorized: user is null. Auth error:`, authError?.message || 'none')
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
    const authHeader = request.headers.get('authorization')
    const hasBearer = !!authHeader?.toLowerCase().startsWith('bearer ')
    const forwardedUserId = request.headers.get('x-user-id')
    console.log(`[API PUT /api/creator/profile] Incoming request: hasBearer=${hasBearer}, forwardedUserId=${forwardedUserId || 'none'}`)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!user) {
      console.warn(`[API PUT /api/creator/profile] 401 Unauthorized: user is null. Auth error:`, authError?.message || 'none')
      return NextResponse.json(
        { error: 'Sesi login tidak valid atau kadaluarsa. Silakan refresh atau login kembali.' },
        { status: 401 }
      )
    }

    console.log(`[API PUT /api/creator/profile] Authenticated as user: ${user.id}`)

    const body = await request.json()

    // Validate input
    const validation = validateProfileInput(body)
    if (!validation.valid) {
      console.warn(`[API PUT /api/creator/profile] 400 Bad Request:`, validation.error)
      return NextResponse.json({ error: validation.error, code: validation.code }, { status: 400 })
    }

    // Upsert profile
    const profile = await upsertCreatorProfile(user.id, body)
    console.log(`[API PUT /api/creator/profile] Profile updated successfully for user: ${user.id}`)

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Error updating creator profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
