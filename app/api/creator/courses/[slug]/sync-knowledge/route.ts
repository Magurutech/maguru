import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'
import { lessonService } from '@/features/cms/services/lesson.service'
import {
  bulkSyncCourseLessonsToAI,
  getKnowledgeBaseStatus,
  type BulkSyncLessonItem,
} from '@/lib/ai/ingest-client'

/**
 * GET /api/creator/courses/[slug]/sync-knowledge
 * Check knowledge base indexing status for this course.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    const course = await prisma.courses.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      select: { id: true, creatorId: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.creatorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const status = await getKnowledgeBaseStatus(course.id)
    return NextResponse.json(status)
  } catch (error: any) {
    console.error('Error fetching knowledge status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch knowledge status', detail: error?.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/creator/courses/[slug]/sync-knowledge
 * One-click Bulk Sync: Extract all lesson text from Prisma and ingest into AI Vector Store.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slug } = await params

    const course = await prisma.courses.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      select: {
        id: true,
        slug: true,
        title: true,
        creatorId: true,
        sections: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                content: true,
                sectionId: true,
              },
            },
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.creatorId !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Extract rich text from all lessons in this course
    const bulkItems: BulkSyncLessonItem[] = []
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        const fullText = lessonService.extractFullTextContent(lesson.content)
        if (fullText && fullText.trim()) {
          bulkItems.push({
            lesson_id: lesson.id,
            section_id: section.id,
            title: lesson.title,
            content: fullText,
          })
        }
      }
    }

    if (bulkItems.length === 0) {
      return NextResponse.json({
        status: 'success',
        course_id: course.id,
        total_lessons: 0,
        total_chunks: 0,
        message: 'Belum ada konten materi teks untuk disinkronkan.',
      })
    }

    const result = await bulkSyncCourseLessonsToAI(course.id, bulkItems, course.slug)

    return NextResponse.json({
      status: 'success',
      course_id: course.id,
      total_lessons: result.total_lessons,
      total_chunks: result.total_chunks,
      message: `${result.total_lessons} materi pelajaran (${result.total_chunks} vector chunks) berhasil disinkronkan ke AI Knowledge Base!`,
    })
  } catch (error: any) {
    console.error('Error during bulk knowledge sync:', error)
    return NextResponse.json(
      { error: 'Failed to sync course knowledge to AI', detail: error?.message },
      { status: 500 }
    )
  }
}
