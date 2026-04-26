/**
 * Course API
 * Pure async functions for React Query composition.
 * No hooks, no useState, no useEffect — only fetch wrappers.
 */

import type {
  CourseCardCourse,
  CreatorCourse,
  EnrolledCourse,
  CourseFormData,
  Pagination,
  CourseCatalogParams,
} from '../types/course.types'

// ─── Response shapes ──────────────────────────────────────────────────────────

export interface CourseCatalogResponse {
  courses: (CourseCardCourse & { enrolled?: boolean })[]
  pagination: Pagination
}

export interface CreatorCoursesResponse {
  courses: CreatorCourse[]
  stats: {
    totalCourses: number
    publishedCourses: number
    draftCourses: number
  }
}

export interface MyCoursesResponse {
  enrollments: EnrolledCourse[]
}

// ─── Query functions (read) ───────────────────────────────────────────────────

export async function getCourses(params: CourseCatalogParams = {}): Promise<CourseCatalogResponse> {
  const query = new URLSearchParams()
  if (params.page)       query.set('page',       String(params.page))
  if (params.limit)      query.set('limit',      String(params.limit))
  if (params.category)   query.set('category',   params.category)
  if (params.difficulty) query.set('difficulty', params.difficulty)
  if (params.search)     query.set('search',     params.search)

  const res = await fetch(`/api/courses?${query.toString()}`)
  if (!res.ok) throw new Error('Gagal memuat katalog kursus')
  return res.json()
}

export async function getMyCourses(): Promise<MyCoursesResponse> {
  const res = await fetch('/api/courses/my-courses')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Gagal memuat kursus saya')
  return res.json()
}

export async function getCreatorCourses(): Promise<CreatorCoursesResponse> {
  const res = await fetch('/api/creator/courses')
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (!res.ok) throw new Error('Gagal memuat data creator')
  return res.json()
}

// ─── Mutation functions (write) ───────────────────────────────────────────────

export async function enrollCourse(courseId: string): Promise<{ enrolled: boolean }> {
  const res = await fetch(`/api/courses/${courseId}/enroll`, { method: 'POST' })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 403) throw new Error('DRAFT')
  if (res.status === 409) throw new Error('ALREADY_ENROLLED')
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? 'Gagal mendaftar ke kursus')
  }
  return { enrolled: true }
}

export async function togglePublish(courseId: string): Promise<{ status: string }> {
  const res = await fetch(`/api/creator/courses/${courseId}/publish`, { method: 'PUT' })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 403) throw new Error('FORBIDDEN')
  if (!res.ok) throw new Error('Gagal mengubah status kursus')
  const data = await res.json() as { course: { status: string } }
  return { status: data.course.status }
}

export async function createCourse(payload: CourseFormData): Promise<CreatorCourse> {
  const res = await fetch('/api/creator/courses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (res.status === 401) throw new Error('UNAUTHORIZED')
  if (res.status === 400) {
    const data = await res.json().catch(() => ({}))
    throw new Error((data as { error?: string }).error ?? 'Data tidak valid')
  }
  if (!res.ok) throw new Error('Gagal membuat kursus')
  const data = await res.json() as { course: CreatorCourse }
  return data.course
}
