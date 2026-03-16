import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { getMyEnrollments } from '@/features/cms/services/enrollment.service'

/**
 * GET /api/courses/my-courses
 *
 * Returns all enrolled courses for the authenticated student,
 * including course data and completion percentage.
 *
 * Returns:
 *   200 - { enrollments: EnrolledCourse[] }
 *   401 - not authenticated
 */
export async function GET() {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Silakan login terlebih dahulu' },
        { status: 401 }
      )
    }

    const result = await getMyEnrollments(user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching my courses:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil daftar kursus' },
      { status: 500 }
    )
  }
}
