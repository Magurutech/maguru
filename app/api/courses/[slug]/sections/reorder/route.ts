/**
 * PATCH /api/courses/[slug]/sections/reorder
 * Reorder sections within a course
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { authorizationService } from '@/features/cms/services/authorization.service'
import { sectionService } from '@/features/cms/services/section.service'
import prisma from '@/prisma/lib/client'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    const userId = user.id

    const { slug } = await params
    const courseId = await sectionService.getCourseIdBySlug(slug)
    if (!courseId) {
      return NextResponse.json({ error: 'Course not found', code: 'NOT_FOUND' }, { status: 404 })
    }

    const hasOwnership = await authorizationService.checkCourseOwnershipByUserId(userId, courseId)
    if (!hasOwnership) {
      return NextResponse.json({ error: 'Forbidden', code: 'FORBIDDEN' }, { status: 403 })
    }

    const body = await request.json()
    const items: { id: string; order: number }[] = body.items
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array required', code: 'VALIDATION_ERROR' }, { status: 400 })
    }

    // Two-phase update to avoid unique constraint violation on (courseId, order):
    // Phase 1: shift all orders to a high temp range (offset by 10000)
    // Phase 2: set the final orders
    // This prevents intermediate states where two rows share the same order value.
    const TEMP_OFFSET = 10000
    await prisma.$transaction(async (tx) => {
      // Phase 1: move to temp range
      for (const { id, order } of items) {
        await tx.sections.update({ where: { id }, data: { order: order + TEMP_OFFSET } })
      }
      // Phase 2: set final orders
      for (const { id, order } of items) {
        await tx.sections.update({ where: { id }, data: { order } })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering sections:', error)
    return NextResponse.json({ error: 'Internal server error', code: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
