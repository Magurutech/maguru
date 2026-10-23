import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'
import { fetchAIGeneratedQuiz } from '@/lib/ai/quiz-generator'

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
    if (!courseIdParam) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }

    // Resolve course CUID dynamically (accepts slug or CUID)
    const course = await prisma.courses.findFirst({
      where: {
        OR: [
          { id: courseIdParam },
          { slug: courseIdParam },
        ],
      },
      select: { id: true, title: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }
    const courseId = course.id

    const sectionId = searchParams.get('sectionId') || null
    const quizType = sectionId ? 'SECTION_QUIZ' : 'PRE_TEST'

    let attemptNumber = 1
    const allowRetake = searchParams.get('allowRetake') === 'true'

    // Check if the assessment of this type was already completed
    const existing = await prisma.user_assessments.findFirst({
      where: {
        userId,
        courseId,
        sectionId,
        type: quizType,
      },
    })

    if (existing) {
      if (quizType === 'PRE_TEST') {
        return NextResponse.json({
          error: 'Assessment already completed',
          passed: true,
          score: existing.score,
        }, { status: 409 })
      }

      // SECTION_QUIZ evaluation
      const existingAnswers = existing.answers as Record<string, unknown> | null
      const metadata = (existingAnswers?._metadata || {}) as {
        attempts?: number
        lastAttemptAt?: string
        highestScore?: number
      }

      const recordedAttempts = metadata.attempts ?? 1
      const lastAttemptTime = metadata.lastAttemptAt
        ? new Date(metadata.lastAttemptAt).getTime()
        : existing.completedAt.getTime()

      const timeSinceLastAttempt = Date.now() - lastAttemptTime
      const COOLDOWN_DURATION_MS = 3600 * 1000 // 1 hour cooldown (3600s)

      // If failed (< 70%) and reached 2 consecutive attempts within 1 hour:
      if (existing.score < 70 && recordedAttempts >= 2 && timeSinceLastAttempt < COOLDOWN_DURATION_MS) {
        const remainingSeconds = Math.ceil((COOLDOWN_DURATION_MS - timeSinceLastAttempt) / 1000)
        return NextResponse.json(
          {
            error: 'COOLDOWN_ACTIVE',
            message: 'Batas 2x percobaan tercapai. Silakan pelajari materi kembali sebelum mencoba lagi.',
            cooldownRemainingSeconds: remainingSeconds,
            attempts: recordedAttempts,
            maxAttempts: 2,
            score: existing.score,
          },
          { status: 429 },
        )
      }

      // If 1 hour cooldown has passed, reset attempt counter to 1 for this new study round
      if (timeSinceLastAttempt >= COOLDOWN_DURATION_MS) {
        attemptNumber = 1
      } else {
        attemptNumber = recordedAttempts + 1
      }

      // If user already passed (score >= 70) and did not explicitly request allowRetake:
      if (existing.score >= 70 && !allowRetake) {
        return NextResponse.json(
          {
            error: 'ALREADY_COMPLETED',
            passed: true,
            score: existing.score,
            message: 'Kuis seksi ini sudah lulus. Anda dapat mengulang untuk meningkatkan nilai.',
          },
          { status: 409 },
        )
      }
    }

    // Retrieve existing questions dynamically based on assessment type
    let questions = await prisma.assessment_questions.findMany({
      where: {
        courseId,
        ...(sectionId ? { sectionId } : {}),
      },
      select: {
        id: true,
        question: true,
        options: true,
        topic: true,
        difficulty: true,
      },
    })

    // Automatic AI Quiz Generation if no questions exist in DB
    if (questions.length === 0) {
      // Gather lesson content text from Prisma
      const lessons = await prisma.lessons.findMany({
        where: {
          sections: {
            courseId,
            ...(sectionId ? { id: sectionId } : {}),
          },
        },
        select: {
          title: true,
          content: true,
        },
      })

      const combinedContent = lessons
        .map((l) => `${l.title}\n${l.content || ''}`)
        .join('\n\n')

      const generatedQuestions = await fetchAIGeneratedQuiz({
        courseId,
        sectionId,
        numQuestions: quizType === 'PRE_TEST' ? 5 : 4,
        difficulty: 'medium',
        lessonContent: combinedContent || `Kursus ${course.title}`,
      })

      if (generatedQuestions.length > 0) {
        // Insert generated questions into Supabase DB
        await prisma.assessment_questions.createMany({
          data: generatedQuestions.map((q) => ({
            courseId,
            sectionId,
            question: q.question,
            options: q.options,
            correct: q.correct,
            topic: q.topic || course.title,
            difficulty: q.difficulty || 'medium',
          })),
        })

        // Fetch back newly created questions
        questions = await prisma.assessment_questions.findMany({
          where: {
            courseId,
            ...(sectionId ? { sectionId } : {}),
          },
          select: {
            id: true,
            question: true,
            options: true,
            topic: true,
            difficulty: true,
          },
        })
      }
    }

    if (quizType === 'PRE_TEST') {
      questions = questions.sort(() => 0.5 - Math.random()).slice(0, 40)
    } else if (attemptNumber > 1) {
      // Shuffled Question order for retake attempt (Should Have)
      questions = questions.sort(() => 0.5 - Math.random())
    }

    return NextResponse.json({
      questions,
      attempt: attemptNumber,
      maxAttempts: 2,
      previousScore: existing?.score,
    })
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
