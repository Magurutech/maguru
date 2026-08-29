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
      return NextResponse.json({ error: 'Assessment already completed' }, { status: 409 })
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
    }

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
