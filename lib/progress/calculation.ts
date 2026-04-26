/**
 * Progress Calculation Functions
 * 
 * Handles course completion percentage calculations
 * Requirements: 7.2, 7.4, 7.7
 */

export interface CourseProgressData {
  totalLessons: number
  completedLessons: number
}

export interface CourseCompletionResult {
  percentage: number
  completed: boolean
}

/**
 * Calculate course completion percentage based on completed lessons
 * 
 * @param data - Object containing total and completed lesson counts
 * @returns Object with percentage (0-100, rounded to 2 decimals) and completed flag
 * 
 * Requirements:
 * - 7.2: Calculate completion percentage as (completed/total) × 100 rounded to 2 decimals
 * - 7.4: Set completed flag if 100%
 * - 7.7: Return 0% for courses with zero lessons
 */
export function calculateCourseCompletion(data: CourseProgressData): CourseCompletionResult {
  const { totalLessons, completedLessons } = data
  
  // Handle edge case: course with no lessons
  if (totalLessons === 0) {
    return { percentage: 0, completed: false }
  }
  
  // Calculate percentage
  const percentage = (completedLessons / totalLessons) * 100
  
  // Round to 2 decimal places
  const roundedPercentage = Math.round(percentage * 100) / 100
  
  // Set completed flag if 100%
  const completed = roundedPercentage === 100
  
  return {
    percentage: roundedPercentage,
    completed
  }
}
