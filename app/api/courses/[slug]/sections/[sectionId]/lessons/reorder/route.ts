/**
 * PATCH /api/courses/[slug]/sections/[sectionId]/lessons/reorder
 * Reorder lessons within a section
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authorizationService } from '@/features/cms/services/authorization.service'
import { sectionService } from '@/features/cms/services/section.service'
import prisma from '@/prisma/lib/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; sectionId: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    const userId = user.id

    const { sectionId } = await params
    const section = await sectionService.getSectionById(sectionId)
    if (!section) {
      return NextResponse.json({ error: 'Section not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const hasOwnership = await authorizationService.checkCourseOwnershipByUserId(userId, section.courseId)
    if (!hasOwnership) {
      return NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 })
    }

    const body = await request.json()
    const items: { id: string; order: number }[] = body.items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    const TEMP_OFFSET = 10000
    await prisma.$transaction(async (tx) => {
      for (const { id, order } of items) {
        await tx.lessons.update({ where: { id }, data: { order: order + TEMP_OFFSET } })
      }
      for (const { id, order } of items) {
        await tx.lessons.update({ where: { id }, data: { order } })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering lessons:', error)
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
