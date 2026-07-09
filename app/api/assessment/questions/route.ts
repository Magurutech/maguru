import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import prisma from '@/prisma/lib/client'

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')
    if (!courseId) {
      return NextResponse.json({ error: 'courseId required' }, { status: 400 })
    }

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

    // Retrieve the questions, sorting by topic then difficulty
    const questions = await prisma.assessment_questions.findMany({
      where: {
        courseId,
        sectionId,
      },
      select: {
        id: true,
        question: true,
        options: true,
        topic: true,
        difficulty: true,
      },
      orderBy: [
        { topic: 'asc' },
        { difficulty: 'asc' },
      ],
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching assessment questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
