import { NextRequest, NextResponse } from 'next/server'
import { CourseService } from '@/features/course/services/courseService'
import { CourseStatus } from '@/features/course/types'
import { z } from 'zod'

const courseService = new CourseService()

// Schema untuk validasi update status
const UpdateStatusSchema = z.object({
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
})

/**
 * PATCH /api/courses/[id]/status
 *
 * Update status kursus (DRAFT, PUBLISHED, ARCHIVED)
 *
 * @description
 * Endpoint ini memungkinkan creator untuk mengupdate status kursus yang dimilikinya.
 * Status yang tersedia: DRAFT, PUBLISHED, ARCHIVED
 *
 * TODO: Integrasi Clerk Authentication (TSK-48)
 *
 * @param request - NextRequest object yang berisi data status dalam body
 * @param params - Object yang berisi parameter route (id)
 * @returns NextResponse dengan data kursus yang berhasil diupdate statusnya
 *
 * @example
 * ```typescript
 * // Mengupdate status kursus dengan ID tertentu
 * {
 *   "success": true,
 *   "data": {
 *     "id": "course_123",
 *     "title": "Belajar React dari Dasar",
 *     "status": "PUBLISHED",
 *     "updatedAt": "2024-01-01T12:00:00Z",
 *     ...
 *   }
 * }
 * ```
 *
 * @throws {400} Jika validasi input gagal atau ID tidak valid
 * @throws {401} Jika user tidak terautentikasi (akan diimplementasi di TSK-48)
 * @throws {403} Jika user tidak memiliki permission (akan diimplementasi di TSK-48)
 * @throws {404} Jika kursus tidak ditemukan atau user tidak memiliki akses
 * @throws {500} Jika terjadi error internal server
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Course ID is required',
        },
        { status: 400 },
      )
    }

    // Validasi input menggunakan Zod
    const validationResult = UpdateStatusSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      )
    }

    // TODO: Authentication dan authorization akan di-handle di TSK-48
    // Untuk sementara, gunakan placeholder creatorId
    // Di TSK-48 akan diimplementasi:
    // - Middleware auth untuk memverifikasi Clerk session
    // - Extract user ID dari session: const creatorId = auth.userId
    // - Validasi ownership: hanya pemilik kursus yang dapat mengupdate status
    // - Validasi role user (Creator/Admin only)
    const creatorId = 'placeholder-creator-id'

    const course = await courseService.updateCourseStatus(
      id,
      validationResult.data.status as CourseStatus,
      creatorId,
    )

    return NextResponse.json(
      {
        success: true,
        data: course,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating course status:', error)

    if (error instanceof Error) {
      if (error.message.includes('not found') || error.message.includes('access denied')) {
        return NextResponse.json(
          {
            success: false,
            error: error.message,
          },
          { status: 404 },
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update course status',
      },
      { status: 500 },
    )
  }
}
