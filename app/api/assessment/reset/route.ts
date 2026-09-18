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
