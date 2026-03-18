/**
 * Unit Tests: CourseListItem
 *
 * Komponen telah disederhanakan: tidak ada lagi tombol Publish/Unpublish/Manage.
 * Seluruh item adalah <Link> yang mengarah ke /creator/courses/[id]/manage.
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { CourseListItem, type CreatorCourse } from '../CourseListItem'

jest.mock('lucide-react', () => ({
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className, ...rest }: { children: React.ReactNode; href: string; className?: string; [key: string]: unknown }) => (
    <a href={href} className={className} {...rest}>{children}</a>
  ),
}))

const baseCourse: CreatorCourse = {
  id: 'course-123',
  title: 'React Fundamentals',
  slug: 'course-123',
  description: 'Belajar React dari dasar',
  status: 'DRAFT',
  category: 'Pemrograman',
  difficulty: 'Pemula',
  sectionCount: 5,
  enrollmentCount: 42,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-15T00:00:00.000Z',
}

describe('CourseListItem', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('Link navigasi', () => {
    it('harus render sebagai link ke /creator/courses/[id]/manage', () => {
      render(<CourseListItem course={baseCourse} />)
      const link = screen.getByTestId('creator-course-item')
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', '/creator/courses/course-123/manage')
    })

    it('harus menggunakan course.id (bukan slug) untuk URL', () => {
      const course = { ...baseCourse, id: 'uuid-abc-123', slug: 'react-fundamentals' }
      render(<CourseListItem course={course} />)
      const link = screen.getByTestId('creator-course-item')
      expect(link).toHaveAttribute('href', '/creator/courses/uuid-abc-123/manage')
    })
  })

  describe('enrollmentCount', () => {
    it('harus tampil "0 siswa" jika enrollmentCount adalah undefined', () => {
      const course = { ...baseCourse, enrollmentCount: undefined as unknown as number }
      render(<CourseListItem course={course} />)
      expect(screen.getByTestId('course-enrollment-count').textContent).toBe('0 siswa')
      expect(screen.getByTestId('course-enrollment-count').textContent).not.toContain('undefined')
    })

    it('harus tampil "0 siswa" jika enrollmentCount adalah null', () => {
      const course = { ...baseCourse, enrollmentCount: null as unknown as number }
      render(<CourseListItem course={course} />)
      expect(screen.getByTestId('course-enrollment-count').textContent).toBe('0 siswa')
    })

    it('harus tampil angka yang benar jika enrollmentCount valid', () => {
      render(<CourseListItem course={baseCourse} />)
      expect(screen.getByTestId('course-enrollment-count').textContent).toBe('42 siswa')
    })
  })

  describe('difficulty badge', () => {
    it('tidak boleh render difficulty badge jika difficulty adalah null', () => {
      const course = { ...baseCourse, difficulty: null }
      render(<CourseListItem course={course} />)
      expect(screen.queryByTestId('course-difficulty-badge')).not.toBeInTheDocument()
    })

    it('harus render difficulty badge jika difficulty ada', () => {
      render(<CourseListItem course={baseCourse} />)
      const badge = screen.getByTestId('course-difficulty-badge')
      expect(badge).toBeInTheDocument()
      expect(badge.textContent).toBe('Pemula')
    })
  })

  describe('status badge warna', () => {
    it('PUBLISHED harus tampil badge dengan class hijau', () => {
      const course = { ...baseCourse, status: 'PUBLISHED' }
      render(<CourseListItem course={course} />)
      const badge = screen.getByTestId('course-status-badge')
      expect(badge.className).toContain('bg-hijau-100')
      expect(badge.className).toContain('text-hijau-800')
    })

    it('DRAFT harus tampil badge dengan class kuning', () => {
      render(<CourseListItem course={baseCourse} />)
      const badge = screen.getByTestId('course-status-badge')
      expect(badge.className).toContain('bg-kuning-100')
      expect(badge.className).toContain('text-kuning-800')
    })
  })

  describe('Tanggal update', () => {
    it('harus tampil tanggal updatedAt dalam format Indonesia', () => {
      render(<CourseListItem course={baseCourse} />)
      const dateEl = screen.getByTestId('course-updated-at')
      expect(dateEl.textContent).toContain('Diupdate:')
      expect(dateEl.textContent?.replace('Diupdate:', '').trim()).not.toBe('')
    })
  })
})
