/**
 * Course Management Hooks - Index
 *
 * @description
 * Centralized export untuk semua hooks course management.
 * Mengikuti arsitektur Maguru untuk organized exports.
 */

// Low-level hooks
export { useCourse } from './useCourse'
export { useEnrollment } from './useEnrollment'
export { useEnrollmentStatus, useEnrollmentList } from './useEnrollmentStatus'

// High-level hooks
export { useCourseManagement } from './useCourseManagement'
export { useCourseDialog } from './useCourseDialog'
