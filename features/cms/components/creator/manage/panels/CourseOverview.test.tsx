// Mock ManageContext first using global jest (hoisted)
const mockSetCourseDeleteDialogOpen = jest.fn()
jest.mock('../../../../Context/creator/ManageContext', () => ({
  useManageContext: () => ({
    course: {
      id: 'course-123',
      title: 'React Fundamentals',
      slug: 'react-fundamentals',
      description: 'Belajar React dari nol',
      status: 'DRAFT',
      category: 'Web Development',
      difficulty: 'BEGINNER',
      outcomes: ['Outcome 1 dari React', 'Outcome 2 dari React', 'Outcome 3 dari React']
    },
    setCourse: jest.fn(),
    sections: [],
    lessonsMap: {},
    setCourseDeleteDialogOpen: mockSetCourseDeleteDialogOpen,
  })
}))

// Mock LearningOutcomesEditor
jest.mock('./LearningOutcomesEditor', () => ({
  LearningOutcomesEditor: () => <div data-testid="mock-outcomes-editor">Outcomes Editor Mock</div>
}))

// Mock DescriptionEditor
jest.mock('./DescriptionEditor', () => ({
  DescriptionEditor: () => <div data-testid="mock-description-editor">Description Editor Mock</div>
}))

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from '@jest/globals'
import { CourseOverview } from './CourseOverview'

describe('CourseOverview Panel', () => {
  beforeEach(() => {
    mockSetCourseDeleteDialogOpen.mockClear()
  })

  it('renders the LearningOutcomesEditor component', () => {
    render(<CourseOverview />)
    expect(screen.getByTestId('mock-outcomes-editor')).toBeInTheDocument()
  })

  it('renders Hapus Kelas button and triggers dialog when clicked', () => {
    render(<CourseOverview />)
    const deleteBtn = screen.getByRole('button', { name: /Hapus Kelas/i })
    expect(deleteBtn).toBeInTheDocument()
    fireEvent.click(deleteBtn)
    expect(mockSetCourseDeleteDialogOpen).toHaveBeenCalledWith(true)
  })
})

