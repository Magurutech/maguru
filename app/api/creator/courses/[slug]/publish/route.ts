import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { togglePublishStatus } from '@/features/cms/services/creator-course.service'

/**
 * PUT /api/creator/courses/[slug]/publish
 *
 * Toggle course status between DRAFT and PUBLISHED.
 * Only the course owner can perform this action.
 *
 * Returns:
 *   200 - { course: { id, title, status } }
 *   401 - not authenticated
 *   403 - not the course owner
 *   404 - course not found
 */
export async function PUT(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    console.log('[Publish Route] User verification result:', user ? `OK (User: ${user.id})` : 'FAILED (null)')

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized: Sesi tidak ditemukan atau kedaluwarsa. Silakan refresh sesi atau login ulang.' },
        { status: 401 }
      )
    }

    const { slug } = await params
    console.log(`[Publish Route] Executing togglePublishStatus for slug: "${slug}" by user: "${user.id}"`)
    const updated = await togglePublishStatus(slug, user.id)

    console.log(`[Publish Route] Successfully updated status to: "${updated.status}"`)
    return NextResponse.json({ course: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish course'
    console.error('[Publish Route] Error caught in route handler:', message)

    if (message === 'Course not found') {
      return NextResponse.json({ error: message }, { status: 404 })
    }
    if (message === 'Forbidden' || message.includes('Forbidden')) {
      return NextResponse.json({ error: message }, { status: 403 })
    }

    console.error('Error toggling publish status:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
