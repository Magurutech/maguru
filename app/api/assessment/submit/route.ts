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

    // Check existing assessment record
    const existing = await prisma.user_assessments.findFirst({
      where: {
        userId,
        courseId,
        sectionId: targetSectionId,
        type: quizType,
      },
    })

    if (existing && quizType === 'PRE_TEST') {
      return NextResponse.json({ error: 'Already submitted' }, { status: 409 })
    }

    const COOLDOWN_DURATION_MS = 3600 * 1000 // 1 hour cooldown (3600s)
    let existingAttempts = 1
    let timeSinceLastAttempt = COOLDOWN_DURATION_MS + 1
    const existingAnswers = (existing?.answers as Record<string, unknown> | null) || {}
    const metadata = (existingAnswers._metadata || {}) as {
      attempts?: number
      lastAttemptAt?: string
      highestScore?: number
      previousScores?: number[]
    }

    if (existing) {
      existingAttempts = metadata.attempts ?? 1
      const lastAttemptTime = metadata.lastAttemptAt
        ? new Date(metadata.lastAttemptAt).getTime()
        : existing.completedAt.getTime()

      timeSinceLastAttempt = Date.now() - lastAttemptTime

      // If user failed (< 70%) and already hit 2 consecutive attempts within 1 hour:
      if (existing.score < 70 && existingAttempts >= 2 && timeSinceLastAttempt < COOLDOWN_DURATION_MS) {
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

    const { overallScore, topicScores, totalQuestions, correctCount, wrongCount, topicDetails } = calculateScores(questions, answers)

    let skippedLessonIds: string[] = []
    let unlockedNextSection = false

    const newAttempts = existing ? (timeSinceLastAttempt >= COOLDOWN_DURATION_MS ? 1 : existingAttempts + 1) : 1
    // Best Score Preservation (Should Have)
    const bestScore = existing ? Math.max(overallScore, existing.score) : overallScore

    const updatedAnswers = {
      ...(typeof answers === 'object' ? answers : {}),
      _metadata: {
        attempts: newAttempts,
        lastAttemptAt: new Date().toISOString(),
        highestScore: bestScore,
        previousScores: existing ? [...(metadata.previousScores || []), existing.score] : [],
      },
    }

    // Execute atomic transaction for DB persistence and progress updates
    await prisma.$transaction(async (tx) => {
      if (existing) {
        // Update existing record with best score preservation and attempt metadata
        await tx.user_assessments.update({
          where: { id: existing.id },
          data: {
            score: bestScore,
            answers: updatedAnswers,
            durationSeconds: durationSeconds || existing.durationSeconds,
            completedAt: new Date(),
          },
        })
      } else {
        // 1. Create the assessment record
        await tx.user_assessments.create({
          data: {
            userId,
            courseId,
            sectionId: targetSectionId,
            score: overallScore,
            type: quizType,
            answers: updatedAnswers,
            durationSeconds: durationSeconds || null,
          },
        })
      }

      // 2. Perform placement logic (PRE_TEST) or unlock verification (SECTION_QUIZ)
      if (quizType === 'PRE_TEST') {
        skippedLessonIds = await executeTopicPlacement(userId, courseId, topicScores, tx)
      } else {
        unlockedNextSection = bestScore >= 70
      }
    })

    return NextResponse.json({
      overallScore,
      bestScore,
      topicScores,
      totalQuestions,
      correctCount,
      wrongCount,
      topicDetails,
      skippedLessonIds,
      unlockedNextSection,
      attempt: newAttempts,
      maxAttempts: 2,
      isCooldownTriggered: bestScore < 70 && newAttempts >= 2,
    })
  } catch (error) {
    console.error('Error submitting assessment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
