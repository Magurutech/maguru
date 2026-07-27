import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/prisma/lib/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; questionId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id

    const { slug, questionId } = await params
    const body = await request.json()
    const { question, options, correct, topic, difficulty, sectionId } = body

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

    // Verify the question belongs to this course
    const existingQuestion = await prisma.assessment_questions.findFirst({
      where: { id: questionId, courseId: course.id },
    })

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Update the question
    const updatedQuestion = await prisma.assessment_questions.update({
      where: { id: questionId },
      data: {
        sectionId: sectionId === undefined ? existingQuestion.sectionId : (sectionId || null),
        question: question !== undefined ? question : existingQuestion.question,
        options: options !== undefined ? options : existingQuestion.options,
        correct: correct !== undefined ? correct : existingQuestion.correct,
        topic: topic !== undefined ? topic : existingQuestion.topic,
        difficulty: difficulty !== undefined ? difficulty : existingQuestion.difficulty,
      },
    })

    return NextResponse.json(updatedQuestion)
  } catch (error) {
    console.error('Error updating assessment question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; questionId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = user.id

    const { slug, questionId } = await params

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

    // Verify ownership of the question
    const existingQuestion = await prisma.assessment_questions.findFirst({
      where: { id: questionId, courseId: course.id },
    })

    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    // Delete the question
    await prisma.assessment_questions.delete({
      where: { id: questionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting assessment question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
