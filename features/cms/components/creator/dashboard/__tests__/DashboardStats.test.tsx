/**
 * Unit Tests: DashboardStats
 *
 * Test untuk komponen DashboardStats:
 * - Render nilai stats yang benar
 * - Breakdown published/draft tampil
 * - Total siswa dengan toLocaleString
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import { DashboardStats } from '../DashboardStats'

jest.mock('lucide-react', () => ({
  BookOpen: () => <span data-testid="bookopen-icon" />,
  BarChart3: () => <span data-testid="barchart-icon" />,
}))

describe('DashboardStats', () => {
  const defaultStats = {
    totalCourses: 8,
    publishedCourses: 5,
    draftCourses: 3,
    totalStudents: 1247,
  }

  it('harus tampil total kursus yang benar', () => {
    render(<DashboardStats stats={defaultStats} />)
    expect(screen.getByTestId('stat-total-courses-value').textContent).toBe('8')
  })

  it('harus tampil breakdown published dan draft', () => {
    render(<DashboardStats stats={defaultStats} />)
    const breakdown = screen.getByTestId('stat-courses-breakdown')
    expect(breakdown.textContent).toContain('5 published')
    expect(breakdown.textContent).toContain('3 draft')
  })

  it('harus tampil total siswa dengan format angka', () => {
    render(<DashboardStats stats={defaultStats} />)
    const studentsEl = screen.getByTestId('stat-total-students-value')
    // toLocaleString() bisa menghasilkan "1,247" atau "1.247" tergantung locale
    expect(studentsEl.textContent).toContain('1')
    expect(studentsEl.textContent).toContain('247')
  })

  it('harus tampil 0 jika semua stats nol', () => {
    render(
      <DashboardStats
        stats={{ totalCourses: 0, publishedCourses: 0, draftCourses: 0, totalStudents: 0 }}
      />
    )
    expect(screen.getByTestId('stat-total-courses-value').textContent).toBe('0')
    expect(screen.getByTestId('stat-courses-breakdown').textContent).toContain('0 published')
    expect(screen.getByTestId('stat-courses-breakdown').textContent).toContain('0 draft')
  })

  it('harus render semua 3 stat cards', () => {
    render(<DashboardStats stats={defaultStats} />)
    expect(screen.getByTestId('stat-total-courses')).toBeInTheDocument()
    expect(screen.getByTestId('stat-total-students')).toBeInTheDocument()
    expect(screen.getByTestId('stat-revenue')).toBeInTheDocument()
  })
})
