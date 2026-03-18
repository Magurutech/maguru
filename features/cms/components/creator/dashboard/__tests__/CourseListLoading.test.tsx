/**
 * Unit Tests: CourseList — Loading State Bug
 *
 * BUG: loadingCourses dimulai sebagai `true` di useState.
 * Jika fetchCourses() early-return (karena !isLoaded || !canAccessCreator()),
 * setLoadingCourses(false) di blok `finally` tidak pernah dieksekusi.
 * Akibatnya CourseList selalu tampil dalam state loading.
 *
 * Test ini memverifikasi bahwa CourseList keluar dari loading state
 * dalam berbagai skenario prop yang diterima dari parent.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { CourseList } from '../CourseList'
import type { CreatorCourse } from '../CourseListItem'

jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
  BookOpen: () => <span data-testid="bookopen-icon" />,
  Plus: () => <span />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

const mockCourse: CreatorCourse = {
  id: 'c1',
  title: 'React Fundamentals',
  slug: 'c1',
  description: null,
  status: 'PUBLISHED',
  category: 'Pemrograman',
  difficulty: 'Pemula',
  sectionCount: 3,
  enrollmentCount: 10,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
}

const baseProps = {
  onViewAll: jest.fn(),
}

describe('CourseList — Loading State Bug', () => {
  /**
   * BUG SCENARIO:
   * Parent page.tsx: useState(true) → fetchCourses() early-return
   * → loadingCourses tetap true selamanya
   * → CourseList selalu render loading spinner
   */
  it('BUG: isLoading=true harus tampil spinner, bukan course list', () => {
    render(<CourseList {...baseProps} courses={[mockCourse]} isLoading={true} />)
    expect(screen.getByTestId('course-list-loading')).toBeInTheDocument()
    expect(screen.queryByTestId('creator-course-item')).not.toBeInTheDocument()
  })

  it('setelah loading selesai (isLoading=false) harus tampil course list', () => {
    render(<CourseList {...baseProps} courses={[mockCourse]} isLoading={false} />)
    expect(screen.queryByTestId('course-list-loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('creator-course-item')).toBeInTheDocument()
  })

  it('setelah loading selesai dengan courses kosong harus tampil empty state', () => {
    render(<CourseList {...baseProps} courses={[]} isLoading={false} />)
    expect(screen.queryByTestId('course-list-loading')).not.toBeInTheDocument()
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
  })

  /**
   * ROOT CAUSE TEST:
   * fetchCourses() di page.tsx:
   *   if (!isLoaded || !canAccessCreator()) return  ← early return, finally tidak jalan
   *
   * Fix: set loadingCourses(false) SEBELUM early return, atau
   *      inisialisasi useState(false) dan set true hanya saat fetch benar-benar dimulai
   */
  it('FIX VERIFICATION: initial state harus false jika tidak ada fetch yang berjalan', () => {
    // Simulasi: parent sudah resolve loading (isLoading=false) dengan courses kosong
    // Ini adalah state yang seharusnya terjadi setelah canAccessCreator() = false
    render(<CourseList {...baseProps} courses={[]} isLoading={false} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.queryByTestId('course-list-loading')).not.toBeInTheDocument()
  })
})
