import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
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
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      )
    }

    const { slug } = await params

    const course = await togglePublishStatus(slug, user.id)

    return NextResponse.json({ course })
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Course not found') {
        return NextResponse.json({ error: 'Kursus tidak ditemukan' }, { status: 404 })
      }
      if (error.message.startsWith('Forbidden')) {
        return NextResponse.json(
          { error: 'Anda tidak memiliki akses ke kursus ini' },
          { status: 403 }
        )
      }
    }
    console.error('Error toggling publish status:', error)
    return NextResponse.json(
      { error: 'Gagal mengubah status kursus' },
      { status: 500 }
    )
  }
}
