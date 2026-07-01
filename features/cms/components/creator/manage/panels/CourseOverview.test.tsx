// Mock ManageContext first using global jest (hoisted)
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
    lessonsMap: {}
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
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from '@jest/globals'
import { CourseOverview } from './CourseOverview'

describe('CourseOverview Panel', () => {
  it('renders the LearningOutcomesEditor component', () => {
    render(<CourseOverview />)
    expect(screen.getByTestId('mock-outcomes-editor')).toBeInTheDocument()
  })
})
