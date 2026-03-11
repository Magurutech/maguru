import { render, screen } from '@testing-library/react'
import { ProgressBar } from '../ProgressBar'

/**
 * Test Suite: ProgressBar Component
 * 
 * Tests the visual progress indicator for course completion.
 * 
 * Requirements: 7.1, 7.5
 * Task: 9.2, 9.4
 */

describe('ProgressBar', () => {
  describe('Display and Rendering', () => {
    it('should render progress bar with correct percentage', () => {
      render(
        <ProgressBar 
          percentage={50} 
          completedLessons={5} 
          totalLessons={10} 
        />
      )
      
      expect(screen.getByText('50%')).toBeInTheDocument()
      expect(screen.getByText('5 / 10 lessons completed')).toBeInTheDocument()
    })

    it('should render progress bar with 0% completion', () => {
      render(
        <ProgressBar 
          percentage={0} 
          completedLessons={0} 
          totalLessons={10} 
        />
      )
      
      expect(screen.getByText('0%')).toBeInTheDocument()
      expect(screen.getByText('0 / 10 lessons completed')).toBeInTheDocument()
    })

    it('should render progress bar with 100% completion', () => {
      render(
        <ProgressBar 
          percentage={100} 
          completedLessons={10} 
          totalLessons={10} 
        />
      )
      
      expect(screen.getByText('100%')).toBeInTheDocument()
      expect(screen.getByText('10 / 10 lessons completed')).toBeInTheDocument()
    })

    it('should render progress bar with decimal percentage', () => {
      render(
        <ProgressBar 
          percentage={33.33} 
          completedLessons={1} 
          totalLessons={3} 
        />
      )
      
      // Should round to nearest integer
      expect(screen.getByText('33%')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should clamp percentage above 100 to 100', () => {
      render(
        <ProgressBar 
          percentage={150} 
          completedLessons={15} 
          totalLessons={10} 
        />
      )
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '100')
      
      const progressFill = progressBar.querySelector('.progress-fill')
      expect(progressFill).toHaveStyle({ width: '100%' })
    })

    it('should clamp negative percentage to 0', () => {
      render(
        <ProgressBar 
          percentage={-10} 
          completedLessons={0} 
          totalLessons={10} 
        />
      )
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '0')
      
      const progressFill = progressBar.querySelector('.progress-fill')
      expect(progressFill).toHaveStyle({ width: '0%' })
    })

    it('should handle zero total lessons', () => {
      render(
        <ProgressBar 
          percentage={0} 
          completedLessons={0} 
          totalLessons={0} 
        />
      )
      
      expect(screen.getByText('0 / 0 lessons completed')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(
        <ProgressBar 
          percentage={75} 
          completedLessons={3} 
          totalLessons={4} 
        />
      )
      
      const progressBar = screen.getByRole('progressbar')
      expect(progressBar).toHaveAttribute('aria-valuenow', '75')
      expect(progressBar).toHaveAttribute('aria-valuemin', '0')
      expect(progressBar).toHaveAttribute('aria-valuemax', '100')
      expect(progressBar).toHaveAttribute('aria-label', 'Course completion: 75%')
    })

    it('should have region role for container', () => {
      render(
        <ProgressBar 
          percentage={50} 
          completedLessons={5} 
          totalLessons={10} 
        />
      )
      
      const container = screen.getByRole('region', { name: 'Course progress' })
      expect(container).toBeInTheDocument()
    })

    it('should have aria-live for percentage updates', () => {
      render(
        <ProgressBar 
          percentage={50} 
          completedLessons={5} 
          totalLessons={10} 
        />
      )
      
      const percentage = screen.getByText('50%')
      expect(percentage).toHaveAttribute('aria-live', 'polite')
    })
  })

  describe('Visual Progress Fill', () => {
    it('should set correct width for progress fill', () => {
      render(
        <ProgressBar 
          percentage={60} 
          completedLessons={6} 
          totalLessons={10} 
        />
      )
      
      const progressBar = screen.getByRole('progressbar')
      const progressFill = progressBar.querySelector('.progress-fill')
      
      expect(progressFill).toHaveStyle({ width: '60%' })
    })

    it('should hide progress fill from screen readers', () => {
      render(
        <ProgressBar 
          percentage={50} 
          completedLessons={5} 
          totalLessons={10} 
        />
      )
      
      const progressBar = screen.getByRole('progressbar')
      const progressFill = progressBar.querySelector('.progress-fill')
      
      expect(progressFill).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
