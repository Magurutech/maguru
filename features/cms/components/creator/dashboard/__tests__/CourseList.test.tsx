/**
 * Unit Tests: CourseList
 *
 * Test untuk komponen CourseList:
 * - Loading state
 * - Empty state
 * - Render daftar kursus (maxVisible)
 * - Indikator "+N kursus lainnya" jika lebih dari maxVisible
 * - Tombol Lihat Semua
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { CourseList } from '../CourseList'
import type { CreatorCourse } from '../CourseListItem'

jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
  BookOpen: () => <span data-testid="bookopen-icon" />,
  Plus: () => <span data-testid="plus-icon" />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

function makeCourse(overrides: Partial<CreatorCourse> = {}): CreatorCourse {
  return {
    id: `course-${Math.random().toString(36).slice(2)}`,
    title: 'Test Course',
    slug: 'test-course',
    description: null,
    status: 'DRAFT',
    category: 'Pemrograman',
    difficulty: 'Pemula',
    sectionCount: 0,
    enrollmentCount: 0,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-15T00:00:00.000Z',
    ...overrides,
  }
}

const defaultProps = {
  isLoading: false,
  onViewAll: jest.fn(),
}

describe('CourseList', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('Loading state', () => {
    it('harus tampil loading spinner saat isLoading=true', () => {
      render(<CourseList {...defaultProps} courses={[]} isLoading={true} />)
      expect(screen.getByTestId('course-list-loading')).toBeInTheDocument()
      expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument()
    })
  })

  describe('Empty state', () => {
    it('harus tampil empty state saat courses kosong dan tidak loading', () => {
      render(<CourseList {...defaultProps} courses={[]} />)
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      expect(screen.getByText('Belum ada kursus')).toBeInTheDocument()
      expect(screen.getByText('Buat Kursus Pertama')).toBeInTheDocument()
    })

    it('tombol "Buat Kursus Pertama" harus link ke /creator/courses/create', () => {
      render(<CourseList {...defaultProps} courses={[]} />)
      const link = screen.getByText('Buat Kursus Pertama').closest('a')
      expect(link).toHaveAttribute('href', '/creator/courses/create')
    })
  })

  describe('Course list rendering', () => {
    it('harus render semua kursus jika <= maxVisible', () => {
      const courses = [makeCourse({ id: '1' }), makeCourse({ id: '2' }), makeCourse({ id: '3' })]
      render(<CourseList {...defaultProps} courses={courses} maxVisible={3} />)
      expect(screen.getAllByTestId('creator-course-item')).toHaveLength(3)
    })

    it('harus render hanya maxVisible kursus jika lebih dari maxVisible', () => {
      const courses = Array.from({ length: 5 }, (_, i) => makeCourse({ id: `c-${i}` }))
      render(<CourseList {...defaultProps} courses={courses} maxVisible={3} />)
      expect(screen.getAllByTestId('creator-course-item')).toHaveLength(3)
    })

    it('harus tampil indikator "+N kursus lainnya" jika ada lebih dari maxVisible', () => {
      const courses = Array.from({ length: 5 }, (_, i) => makeCourse({ id: `c-${i}` }))
      render(<CourseList {...defaultProps} courses={courses} maxVisible={3} />)
      expect(screen.getByText(/\+2 kursus lainnya/)).toBeInTheDocument()
    })

    it('tidak boleh tampil indikator jika kursus <= maxVisible', () => {
      const courses = [makeCourse({ id: '1' }), makeCourse({ id: '2' })]
      render(<CourseList {...defaultProps} courses={courses} maxVisible={3} />)
      expect(screen.queryByText(/kursus lainnya/)).not.toBeInTheDocument()
    })

    it('harus menghormati prop maxVisible kustom', () => {
      const courses = Array.from({ length: 6 }, (_, i) => makeCourse({ id: `c-${i}` }))
      render(<CourseList {...defaultProps} courses={courses} maxVisible={5} />)
      expect(screen.getAllByTestId('creator-course-item')).toHaveLength(5)
      expect(screen.getByText(/\+1 kursus lainnya/)).toBeInTheDocument()
    })

    it('default maxVisible adalah 5', () => {
      const courses = Array.from({ length: 7 }, (_, i) => makeCourse({ id: `c-${i}` }))
      render(<CourseList {...defaultProps} courses={courses} />)
      expect(screen.getAllByTestId('creator-course-item')).toHaveLength(5)
    })
  })

  describe('Tombol Lihat Semua', () => {
    it('harus memanggil onViewAll saat diklik', () => {
      const onViewAll = jest.fn()
      render(<CourseList {...defaultProps} courses={[makeCourse()]} onViewAll={onViewAll} />)
      fireEvent.click(screen.getByText('Lihat Semua'))
      expect(onViewAll).toHaveBeenCalledTimes(1)
    })
  })
})
