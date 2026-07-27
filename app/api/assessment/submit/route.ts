import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'
import { SubmitAssessmentSchema } from '@/features/assessment-engine/schemas'
import { calculateScores } from '@/features/assessment-engine/services/scoring.service'
import { executeTopicPlacement } from '@/features/assessment-engine/services/placement.service'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id

    const body = await request.json()
    const parsed = SubmitAssessmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { courseId: courseIdParam, sectionId, answers, durationSeconds } = parsed.data

    // Resolve course CUID dynamically (accepts slug or CUID)
    const course = await prisma.courses.findFirst({
      where: {
        OR: [
          { id: courseIdParam },
          { slug: courseIdParam },
        ],
      },
      select: { id: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    const courseId = course.id

    const targetSectionId = sectionId || null
    const quizType = targetSectionId ? 'SECTION_QUIZ' : 'PRE_TEST'

    // Prevent duplicate submission
    const existing = await prisma.user_assessments.findFirst({
      where: {
        userId,
        courseId,
        sectionId: targetSectionId,
        type: quizType,
      },
    })

    if (existing) {
      return NextResponse.json({ error: 'Already submitted' }, { status: 409 })
    }

    // Retrieve questions matching the submitted answer keys to check correct answers
    const submittedQuestionIds = Object.keys(answers)
    const questions = await prisma.assessment_questions.findMany({
      where: {
        id: { in: submittedQuestionIds },
        courseId,
        ...(quizType === 'SECTION_QUIZ' ? { sectionId: targetSectionId } : {}),
      },
      select: {
        id: true,
        correct: true,
        topic: true,
      },
    })

    // If no questions match, or some are missing
    if (questions.length === 0 && submittedQuestionIds.length > 0) {
      return NextResponse.json({ error: 'No valid questions found for this assessment' }, { status: 400 })
    }

    // Validate that all answered question IDs exist
    const foundQuestionIds = new Set(questions.map((q) => q.id))
    for (const qId of submittedQuestionIds) {
      if (!foundQuestionIds.has(qId)) {
        return NextResponse.json({ error: `Invalid question ID: ${qId}` }, { status: 400 })
      }
    }

    const { overallScore, topicScores } = calculateScores(questions, answers)

    let skippedLessonIds: string[] = []
    let unlockedNextSection = false

    // Execute atomic transaction for DB persistence and progress updates
    await prisma.$transaction(async (tx) => {
      // 1. Create the assessment record
      await tx.user_assessments.create({
        data: {
          userId,
          courseId,
          sectionId: targetSectionId,
          score: overallScore,
          type: quizType,
          answers,
          durationSeconds: durationSeconds || null,
        },
      })

      // 2. Perform placement logic (PRE_TEST) or unlock verification (SECTION_QUIZ)
      if (quizType === 'PRE_TEST') {
        skippedLessonIds = await executeTopicPlacement(userId, courseId, topicScores, tx)
      } else {
        unlockedNextSection = overallScore >= 70
      }
    })

    return NextResponse.json({
      overallScore,
      topicScores,
      skippedLessonIds,
      unlockedNextSection,
    })
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
