import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'
import { calculateScores } from '@/features/assessment-engine/services/scoring.service'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id

    const { searchParams } = new URL(request.url)
    const courseIdParam = searchParams.get('courseId')
    const sectionId = searchParams.get('sectionId') || null

    // Resolve course CUID dynamically (accepts slug or CUID)
    let courseId = courseIdParam
    if (courseIdParam) {
      const course = await prisma.courses.findFirst({
        where: {
          OR: [
            { id: courseIdParam },
            { slug: courseIdParam },
          ],
        },
        select: { id: true },
      })
      if (course) {
        courseId = course.id
      }
    }

    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }

    const results = await prisma.user_assessments.findMany({
      where: {
        userId,
        courseId,
        ...(sectionId && { sectionId }),
      },
      orderBy: {
        completedAt: 'desc',
      },
    })

    // Fetch all questions for this course to calculate topic breakdowns
    const questions = await prisma.assessment_questions.findMany({
      where: {
        courseId,
      },
      select: {
        id: true,
        correct: true,
        topic: true,
        sectionId: true,
        question: true,
      },
    })

    // Fetch all lessons for this course to find skipped lessons
    const lessons = await prisma.lessons.findMany({
      where: {
        sections: {
          courseId,
        },
      },
      select: {
        id: true,
        title: true,
      },
    })

    const detailedResults = results.map((r) => {
      const answers = (r.answers || {}) as Record<string, string>
      
      // Filter questions matching this assessment
      const rQuestions = r.type === 'PRE_TEST'
        ? questions.filter((q) => Object.keys(answers).includes(q.id))
        : questions.filter((q) => q.sectionId === r.sectionId)
      
      // Calculate scores
      const { topicScores } = calculateScores(rQuestions, answers)

      // Calculate skipped lessons if PRE_TEST
      const skippedLessonIds: string[] = []
      if (r.type === 'PRE_TEST') {
        for (const [topic, score] of Object.entries(topicScores)) {
          if (score >= 70) {
            const matched = lessons.filter((l) =>
              l.title.toLowerCase().includes(topic.toLowerCase())
            )
            for (const m of matched) {
              if (!skippedLessonIds.includes(m.id)) {
                skippedLessonIds.push(m.id)
              }
            }
          }
        }
      }

      return {
        id: r.id,
        courseId: r.courseId,
        sectionId: r.sectionId,
        overallScore: r.score,
        type: r.type,
        durationSeconds: r.durationSeconds,
        completedAt: r.completedAt,
        topicScores,
        skippedLessonIds,
      }
    })

    return NextResponse.json({ results: detailedResults })
  } catch (error) {
    console.error('Error fetching assessment results:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
