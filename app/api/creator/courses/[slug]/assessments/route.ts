import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id

    const { slug } = await params

    // Resolve course and verify ownership
    const course = await prisma.courses.findFirst({
      where: { slug },
      select: { id: true, creatorId: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.creatorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Fetch all questions for this course
    const questions = await prisma.assessment_questions.findMany({
      where: {
        courseId: course.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error fetching creator assessment questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id

    const { slug } = await params
    const body = await request.json()
    const { question, options, correct, topic, difficulty, sectionId } = body

    if (!question || !options || !correct || !topic) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Resolve course and verify ownership
    const course = await prisma.courses.findFirst({
      where: { slug },
      select: { id: true, creatorId: true },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.creatorId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Create the question in the database
    const newQuestion = await prisma.assessment_questions.create({
      data: {
        courseId: course.id,
        sectionId: sectionId || null,
        question,
        options,
        correct,
        topic,
        difficulty: difficulty || 'medium',
      },
    })

    return NextResponse.json(newQuestion)
  } catch (error) {
    console.error('Error creating assessment question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
