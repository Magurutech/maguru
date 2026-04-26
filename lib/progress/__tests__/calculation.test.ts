/**
 * Unit Tests for calculateCourseCompletion
 * Requirements: 7.2, 7.4, 7.7
 */

import { calculateCourseCompletion } from '../calculation'

describe('calculateCourseCompletion', () => {
  describe('normal cases', () => {
    it('should return 50% when half lessons completed', () => {
      const result = calculateCourseCompletion({ totalLessons: 10, completedLessons: 5 })
      expect(result).toEqual({ percentage: 50, completed: false })
    })

    it('should return 100% and completed=true when all lessons done', () => {
      const result = calculateCourseCompletion({ totalLessons: 4, completedLessons: 4 })
      expect(result).toEqual({ percentage: 100, completed: true })
    })

    it('should return 0% and completed=false when no lessons completed', () => {
      const result = calculateCourseCompletion({ totalLessons: 10, completedLessons: 0 })
      expect(result).toEqual({ percentage: 0, completed: false })
    })

    it('should round to 2 decimal places', () => {
      // 1/3 = 33.333... -> 33.33
      const result = calculateCourseCompletion({ totalLessons: 3, completedLessons: 1 })
      expect(result.percentage).toBe(33.33)
      expect(result.completed).toBe(false)
    })

    it('should return 25% for 1 of 4 lessons', () => {
      const result = calculateCourseCompletion({ totalLessons: 4, completedLessons: 1 })
      expect(result).toEqual({ percentage: 25, completed: false })
    })
  })

  describe('edge cases', () => {
    it('should return 0% and completed=false for course with zero lessons (Req 7.7)', () => {
      const result = calculateCourseCompletion({ totalLessons: 0, completedLessons: 0 })
      expect(result).toEqual({ percentage: 0, completed: false })
    })

    it('should return 100% for single lesson course when completed', () => {
      const result = calculateCourseCompletion({ totalLessons: 1, completedLessons: 1 })
      expect(result).toEqual({ percentage: 100, completed: true })
    })

    it('should not set completed=true for 99.99%', () => {
      // 99/100 = 99%
      const result = calculateCourseCompletion({ totalLessons: 100, completedLessons: 99 })
      expect(result.percentage).toBe(99)
      expect(result.completed).toBe(false)
    })
  })
})
