import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseIdParam = searchParams.get('courseId')
    const sectionId = searchParams.get('sectionId') || null

    if (!courseIdParam) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }

    // Resolve course (accepts slug or CUID)
    const course = await prisma.courses.findFirst({
      where: {
        OR: [{ id: courseIdParam }, { slug: courseIdParam }],
      },
      select: { id: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Check existing assessment record for cooldown protection
    const existing = await prisma.user_assessments.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
        ...(sectionId ? { sectionId } : { type: 'PRE_TEST' }),
      },
    })

    if (existing && sectionId) {
      const existingAnswers = existing.answers as Record<string, unknown> | null
      const metadata = (existingAnswers?._metadata || {}) as {
        attempts?: number
        lastAttemptAt?: string
      }
      const recordedAttempts = metadata.attempts ?? 1
      const lastAttemptTime = metadata.lastAttemptAt
        ? new Date(metadata.lastAttemptAt).getTime()
        : existing.completedAt.getTime()
      const timeSinceLastAttempt = Date.now() - lastAttemptTime
      const COOLDOWN_DURATION_MS = 3600 * 1000

      if (existing.score < 70 && recordedAttempts >= 2 && timeSinceLastAttempt < COOLDOWN_DURATION_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_DURATION_MS - timeSinceLastAttempt) / 1000)
        return NextResponse.json(
          {
            error: 'COOLDOWN_ACTIVE',
            message: 'Batas 2x percobaan tercapai. Silakan pelajari materi kembali sebelum mencoba lagi.',
            cooldownRemainingSeconds: remainingSeconds,
          },
          { status: 429 },
        )
      }
    }

    // Delete assessment record to allow retaking the test
    const deleted = await prisma.user_assessments.deleteMany({
      where: {
        userId: user.id,
        courseId: course.id,
        ...(sectionId ? { sectionId } : { type: 'PRE_TEST' }),
      },
    })

    console.log(`[Assessment Reset API] 🔄 Cleared ${deleted.count} assessment records for user ${user.id}`)

    return NextResponse.json({ success: true, count: deleted.count })
  } catch (error) {
    console.error('Error resetting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
