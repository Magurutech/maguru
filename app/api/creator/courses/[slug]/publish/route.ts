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

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { slug } = await params
    const updated = await togglePublishStatus(slug, user.id)

    return NextResponse.json({ course: updated })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to publish course'

    if (message === 'Course not found') {
      return NextResponse.json({ error: message }, { status: 404 })
    }
    if (message === 'Forbidden') {
      return NextResponse.json({ error: message }, { status: 403 })
    }

    console.error('Error toggling publish status:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
