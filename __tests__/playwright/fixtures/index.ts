/**
 * Fixtures Index
 * 
 * Central export for all test fixtures.
 */

export { authenticatedTest } from './authenticated.fixture'
export { courseTest } from './course.fixture'
export { sectionTest } from './section.fixture'
export { lessonTest } from './lesson.fixture'

export type { AuthenticatedFixtures } from './authenticated.fixture'
export type { CourseFixtures } from './course.fixture'
export type { SectionFixtures } from './section.fixture'
export type { LessonFixtures } from './lesson.fixture'

// Re-export API helpers for convenience
export * from '../utils/api-helpers'
