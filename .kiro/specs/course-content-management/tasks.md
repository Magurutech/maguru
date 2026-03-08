# Implementation Plan: Course Content Management

**Feature Name:** Course Content Management  
**Sprint:** Sprint 2 - Content First  
**Created:** 2026-03-07  
**Status:** Ready for Implementation

---

## Overview

This implementation plan breaks down the Course Content Management feature into discrete, actionable tasks. Each task builds on previous work and includes specific requirements references for traceability.

**Implementation Approach:**
1. Database schema and migrations first (foundation)
2. API routes with business logic (backend)
3. Frontend components and integration (UI)
4. Testing and validation (quality assurance)

---

## Tasks

- [-] 1. Database Schema and Migrations
  - Create Prisma models for Section, Lesson, LessonProgress, and CourseCompletion
  - Run migrations to update database schema
  - Create seed script for testing data
  - _Requirements: 1.1, 2.1, 3.1, 6.1, 7.1_

- [x] 1.1 Create Section model in Prisma schema
  - Add Section model with fields: id, courseId, order, title, description, timestamps
  - Add relation to Course model (one-to-many)
  - Add unique constraint on (courseId, order)
  - Add indexes for performance
  - _Requirements: 1.1, 9.8_

- [x] 1.2 Create Lesson model in Prisma schema
  - Add Lesson model with fields: id, sectionId, order, title, content (Json), timestamps
  - Add relation to Section model (one-to-many)
  - Add unique constraint on (sectionId, order)
  - Add indexes for performance
  - _Requirements: 2.1, 3.1, 9.9_

- [x] 1.3 Create LessonProgress model in Prisma schema
  - Add LessonProgress model with fields: id, lessonId, userId, completed, completedAt, createdAt
  - Add relation to Lesson model (one-to-many)
  - Add unique constraint on (lessonId, userId)
  - Add indexes on userId and lessonId
  - _Requirements: 6.1, 6.3_

- [x] 1.4 Create CourseCompletion model in Prisma schema
  - Add CourseCompletion model with fields: id, courseId, userId, percentage, completed, completedAt, timestamps
  - Add unique constraint on (courseId, userId)
  - Add indexes on userId and courseId
  - _Requirements: 7.1, 7.2_

- [ ] 1.5 Run Prisma migration
  - Generate migration files with `prisma migrate dev`
  - Review migration SQL for correctness
  - Apply migration to development database
  - Verify all tables and constraints created
  - _Requirements: All database requirements_

- [ ] 1.6 Create seed script for testing data
  - Create `prisma/seed-content.ts` with sample course, sections, and lessons
  - Include at least 1 course, 3 sections, 10 lessons
  - Add sample progress data for testing
  - Run seed script and verify data
  - _Requirements: Testing requirements_

- [ ] 2. Section Management API Routes
  - Implement CRUD endpoints for sections
  - Add authorization checks
  - Add validation logic
  - _Requirements: 1.1-1.8, 8.1-8.7, 9.1-9.9_

- [ ] 2.1 Implement POST /api/courses/[slug]/sections
  - Extract courseId from slug
  - Validate request body (title, description, order)
  - Check user authorization (creator owns course or admin)
  - Create section in database
  - Return created section with 201 status
  - _Requirements: 1.1, 8.1, 8.2, 9.1, 9.4, 9.5_

- [ ] 2.2 Implement GET /api/courses/[slug]/sections
  - Extract courseId from slug
  - Fetch all sections for course ordered by order field
  - Return sections array with 200 status
  - _Requirements: 1.2_

- [ ] 2.3 Implement PUT /api/courses/[slug]/sections/[sectionId]
  - Validate request body (title, description, order)
  - Check user authorization
  - Update section in database
  - Return updated section with 200 status
  - _Requirements: 1.3, 1.5, 8.1, 8.2, 9.1_

- [ ] 2.4 Implement DELETE /api/courses/[slug]/sections/[sectionId]
  - Check user authorization
  - Delete section (cascade delete lessons)
  - Return success message with 200 status
  - _Requirements: 1.4, 12.6_

- [ ] 2.5 Write property test for section ordering uniqueness
  - **Property 1: Section Ordering Uniqueness**
  - **Validates: Requirements 1.5, 9.8**
  - Generate random sections with various orders
  - Verify no two sections have same order in a course
  - Run 100 iterations

- [ ] 2.6 Write unit tests for section validation
  - Test title validation (empty, too long, valid)
  - Test order validation (negative, zero, positive)
  - Test description validation (optional field)
  - _Requirements: 9.1, 9.4_

- [ ] 3. Lesson Management API Routes
  - Implement CRUD endpoints for lessons
  - Add content versioning logic
  - Add authorization checks
  - _Requirements: 2.1-2.9, 3.1-3.5, 8.1-8.7, 9.1-9.9_

- [ ] 3.1 Implement POST /api/courses/[slug]/sections/[sectionId]/lessons
  - Validate request body (title, content, order)
  - Validate content JSON structure (markdown, version, lastEdit)
  - Check user authorization
  - Create lesson in database with version 1
  - Return created lesson with 201 status
  - _Requirements: 2.1, 3.1, 8.1, 8.2, 9.2, 9.3, 9.6_

- [ ] 3.2 Implement GET /api/courses/[slug]/sections/[sectionId]/lessons
  - Fetch all lessons for section ordered by order field
  - Return lessons array with 200 status
  - _Requirements: 2.2_

- [ ] 3.3 Implement GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
  - Fetch lesson with full content
  - Return lesson object with 200 status
  - _Requirements: 2.3, 3.4_

- [ ] 3.4 Implement PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
  - Validate request body (title, content, order)
  - Check user authorization
  - Increment version number if content changed
  - Update lastEdit timestamp
  - Update lesson in database
  - Return updated lesson with 200 status
  - _Requirements: 2.4, 3.2, 8.1, 8.2_

- [ ] 3.5 Implement DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]
  - Check user authorization
  - Delete lesson (cascade delete progress records)
  - Return success message with 200 status
  - _Requirements: 2.5, 12.7_

- [ ]* 3.6 Write property test for lesson ordering uniqueness
  - **Property 2: Lesson Ordering Uniqueness**
  - **Validates: Requirements 2.6, 9.9**
  - Generate random lessons with various orders
  - Verify no two lessons have same order in a section
  - Run 100 iterations

- [ ]* 3.7 Write property test for content version monotonicity
  - **Property 6: Content Version Monotonicity**
  - **Validates: Requirements 3.2**
  - Update lesson content multiple times
  - Verify version always increases
  - Run 100 iterations

- [ ]* 3.8 Write unit tests for content JSON validation
  - Test valid content structure
  - Test missing markdown field
  - Test missing version field
  - Test missing lastEdit field
  - Test invalid JSON structure
  - _Requirements: 3.3, 9.3_

- [ ] 4. Progress Tracking API Routes
  - Implement progress marking endpoint
  - Implement progress retrieval endpoints
  - Add completion calculation logic
  - _Requirements: 6.1-6.8, 7.1-7.7_

- [ ] 4.1 Implement POST /api/progress/lesson/[lessonId]/complete
  - Extract userId from authentication
  - Validate lesson exists
  - Create or update progress record (completed=true, completedAt=now)
  - Recalculate course completion percentage
  - Return updated progress with 200 status
  - _Requirements: 6.2, 6.3, 6.7, 7.3_

- [ ] 4.2 Implement GET /api/progress/lesson/[lessonId]
  - Extract userId from authentication
  - Fetch progress record for lesson and user
  - Return progress status with 200 status
  - _Requirements: 6.5_

- [ ] 4.3 Implement GET /api/progress/course/[slug]
  - Extract userId from authentication
  - Extract courseId from slug
  - Calculate completion percentage
  - Fetch or create course completion record
  - Return completion data with 200 status
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 4.4 Implement progress calculation logic
  - Create `calculateCourseCompletion` function
  - Count total lessons in course
  - Count completed lessons for user
  - Calculate percentage: (completed / total) * 100
  - Determine completed status: percentage === 100
  - _Requirements: 7.2, 7.3, 7.4_

- [ ]* 4.5 Write property test for completion percentage accuracy
  - **Property 9: Completion Percentage Accuracy**
  - **Validates: Requirements 7.2, 7.3**
  - Generate random lesson counts and completion states
  - Verify percentage = (completed / total) * 100
  - Run 100 iterations

- [ ]* 4.6 Write property test for completion status consistency
  - **Property 10: Completion Status Consistency**
  - **Validates: Requirements 7.4**
  - Generate various completion percentages
  - Verify completed=true only when percentage=100
  - Run 100 iterations

- [ ]* 4.7 Write unit tests for progress calculation
  - Test 0% completion (0/10 lessons)
  - Test 50% completion (5/10 lessons)
  - Test 100% completion (10/10 lessons)
  - Test edge case (0/0 lessons = 0%)
  - _Requirements: 7.2, 7.7_

- [ ] 5. Authorization Service
  - Implement role-based access control
  - Add authorization helper functions
  - Integrate with Clerk authentication
  - _Requirements: 8.1-8.7_

- [ ] 5.1 Create authorization service module
  - Create `lib/authorization.ts`
  - Define `canModifyCourse` function
  - Define `canViewCourse` function
  - Define `getUserRole` function
  - _Requirements: 8.1-8.7_

- [ ] 5.2 Implement creator authorization logic
  - Check if user is creator of course
  - Allow CRUD operations only on own courses
  - _Requirements: 8.1_

- [ ] 5.3 Implement admin authorization logic
  - Check if user has admin role
  - Allow CRUD operations on all courses
  - _Requirements: 8.2_

- [ ] 5.4 Implement student authorization logic
  - Check if user has student role
  - Allow read-only access to published courses
  - Deny all write operations
  - _Requirements: 8.3, 8.6_

- [ ]* 5.5 Write property test for authorization consistency
  - **Property 13: Authorization Consistency (Creator)**
  - **Property 14: Authorization Consistency (Admin)**
  - **Property 15: Authorization Denial (Student)**
  - **Validates: Requirements 8.1, 8.2, 8.3**
  - Generate random users with different roles
  - Verify authorization rules for each role
  - Run 100 iterations

- [ ]* 5.6 Write unit tests for authorization functions
  - Test creator can access own course
  - Test creator cannot access other's course
  - Test admin can access any course
  - Test student cannot modify any course
  - _Requirements: 8.1-8.6_

- [ ] 6. Checkpoint - Backend Complete
  - Ensure all API routes are implemented
  - Ensure all tests pass
  - Ask the user if questions arise

- [ ] 7. Creator Dashboard Updates
  - Update existing creator dashboard with section/lesson management
  - Integrate Tiptap editor
  - Add preview panel
  - _Requirements: 1.1-1.8, 2.1-2.9, 4.1-4.8_

- [ ] 7.1 Create Section List component
  - Display sections ordered by order field
  - Show section title and description
  - Add "Add Section" button
  - Add edit/delete buttons per section
  - Add up/down reorder buttons
  - _Requirements: 1.2_

- [ ] 7.2 Create Section Form component
  - Input fields for title and description
  - Validation for title (required, max 200 chars)
  - Save button to create/update section
  - Cancel button to close form
  - _Requirements: 1.1, 1.3, 9.1_

- [ ] 7.3 Create Lesson List component
  - Display lessons within selected section
  - Show lesson title
  - Add "Add Lesson" button
  - Add edit/delete buttons per lesson
  - Add up/down reorder buttons
  - _Requirements: 2.2_

- [ ] 7.4 Create Lesson Form component
  - Input field for title
  - Tiptap editor for content
  - Validation for title (required, max 200 chars)
  - Save button to create/update lesson
  - Cancel button to close form
  - _Requirements: 2.1, 2.4, 9.2_

- [ ] 7.5 Integrate Tiptap editor
  - Install Tiptap packages: `@tiptap/react @tiptap/starter-kit`
  - Create TiptapEditor component
  - Add toolbar with formatting buttons (Bold, Italic, Headings, Lists, Links, Code)
  - Configure editor with minimal extensions
  - Handle content save to JSON format
  - _Requirements: 4.1-4.8_

- [ ] 7.6 Create Preview Panel component
  - Render markdown content from editor
  - Apply syntax highlighting to code blocks
  - Update preview in real-time as user types
  - _Requirements: 4.7_

- [ ] 7.7 Implement section reordering
  - Add up/down buttons to section list
  - Call API to update section order
  - Refresh section list after reorder
  - _Requirements: 1.5_

- [ ] 7.8 Implement lesson reordering
  - Add up/down buttons to lesson list
  - Call API to update lesson order
  - Refresh lesson list after reorder
  - _Requirements: 2.6_

- [ ]* 7.9 Write E2E test for creator workflow
  - Login as creator
  - Navigate to course editor
  - Create section
  - Create lesson
  - Edit lesson content
  - Save lesson
  - Verify lesson appears in list
  - _Requirements: 1.1-2.9_

- [ ] 8. Student Learn Page
  - Create new learn page at /course/[slug]/learn
  - Add section navigation
  - Add lesson content viewer
  - Add progress tracking UI
  - _Requirements: 5.1-5.8, 6.1-6.8, 7.1-7.7_

- [ ] 8.1 Create Learn Page layout
  - Create `app/course/[slug]/learn/page.tsx`
  - Implement 3-column layout: Sidebar | Content | Progress
  - Make responsive for mobile (stack vertically)
  - _Requirements: 5.1_

- [ ] 8.2 Create Section Navigation Sidebar
  - Display all sections for course
  - Show section titles
  - Make sections expandable/collapsible
  - Display lessons within expanded section
  - Highlight current lesson
  - Show completion checkmarks for completed lessons
  - _Requirements: 5.1, 5.2, 6.4_

- [ ] 8.3 Create Lesson Content Viewer
  - Fetch and display lesson content
  - Render markdown with proper formatting
  - Apply syntax highlighting to code blocks
  - Show lesson title as heading
  - _Requirements: 5.3, 5.4, 5.5_

- [ ] 8.4 Create Lesson Navigation component
  - Add "Previous Lesson" button
  - Add "Next Lesson" button
  - Disable previous on first lesson
  - Disable next on last lesson
  - _Requirements: 5.6, 5.7, 5.8_

- [ ] 8.5 Create "Mark as Complete" button
  - Display button below lesson content
  - Call progress API on click
  - Show success notification
  - Update UI to show completion checkmark
  - _Requirements: 6.1, 6.2, 6.8_

- [ ] 8.6 Create Progress Bar component
  - Display course completion percentage
  - Show completed/total lesson count
  - Update in real-time when lesson marked complete
  - _Requirements: 7.1, 7.5_

- [ ] 8.7 Implement progress persistence
  - Fetch progress data on page load
  - Display completion status for all lessons
  - Persist progress across sessions
  - _Requirements: 6.6, 12.1_

- [ ]* 8.8 Write E2E test for student workflow
  - Login as student
  - Navigate to learn page
  - Click section to expand
  - Click lesson to view content
  - Read lesson content
  - Click "Mark as Complete"
  - Verify progress bar updates
  - Navigate to next lesson
  - _Requirements: 5.1-7.7_

- [ ] 9. Checkpoint - Frontend Complete
  - Ensure all UI components are implemented
  - Ensure all E2E tests pass
  - Ask the user if questions arise

- [ ] 10. Error Handling and Validation
  - Implement comprehensive error handling
  - Add user-friendly error messages
  - Add loading states
  - _Requirements: 9.1-9.9, 10.1-10.8_

- [ ] 10.1 Implement API error handling middleware
  - Catch validation errors (400)
  - Catch authentication errors (401)
  - Catch authorization errors (403)
  - Catch not found errors (404)
  - Catch server errors (500)
  - Return consistent error response format
  - _Requirements: 10.1-10.6_

- [ ] 10.2 Add client-side validation
  - Validate section title before submit
  - Validate lesson title before submit
  - Validate content structure before submit
  - Show validation errors in UI
  - _Requirements: 9.1, 9.2, 9.3_

- [ ] 10.3 Add loading states
  - Show loading spinner while fetching data
  - Disable buttons during API calls
  - Show skeleton loaders for content
  - _Requirements: User experience_

- [ ] 10.4 Add success notifications
  - Show success message after section created
  - Show success message after lesson saved
  - Show success message after lesson marked complete
  - _Requirements: 10.7, 10.8_

- [ ]* 10.5 Write unit tests for error handling
  - Test validation error responses
  - Test authentication error responses
  - Test authorization error responses
  - Test not found error responses
  - _Requirements: 10.1-10.6_

- [ ] 11. Integration Testing
  - Write integration tests for database + API layer
  - Test cascade delete operations
  - Test transaction rollbacks
  - _Requirements: 12.1-12.7_

- [ ]* 11.1 Write integration test for section cascade delete
  - **Property 11: Cascade Delete Integrity (Sections)**
  - **Validates: Requirements 1.4, 12.6**
  - Create section with lessons
  - Delete section
  - Verify all lessons deleted
  - Run 100 iterations

- [ ]* 11.2 Write integration test for lesson cascade delete
  - **Property 12: Cascade Delete Integrity (Lessons)**
  - **Validates: Requirements 2.5, 12.7**
  - Create lesson with progress records
  - Delete lesson
  - Verify all progress records deleted
  - Run 100 iterations

- [ ]* 11.3 Write integration test for progress recalculation
  - **Property 17: Completion Recalculation Trigger**
  - **Validates: Requirements 6.7, 7.3**
  - Mark lesson complete
  - Verify course completion percentage updated
  - Run 100 iterations

- [ ]* 11.4 Write integration test for transaction rollback
  - Simulate database error during multi-record operation
  - Verify all changes rolled back
  - Verify database consistency maintained
  - _Requirements: 12.3, 12.4_

- [ ] 12. Performance Optimization
  - Add database indexes
  - Implement query optimization
  - Add caching (future)
  - _Requirements: 11.1-11.6_

- [ ] 12.1 Verify database indexes
  - Check indexes on sections (courseId, order)
  - Check indexes on lessons (sectionId, order)
  - Check indexes on progress (userId, lessonId)
  - Check indexes on completions (userId, courseId)
  - _Requirements: 11.1-11.6_

- [ ] 12.2 Optimize API queries
  - Use Prisma `include` for eager loading
  - Fetch sections with lessons in single query
  - Fetch progress data with lessons in single query
  - _Requirements: 11.1-11.3_

- [ ]* 12.3 Write performance tests
  - Test lesson load time < 500ms
  - Test progress update time < 300ms
  - Test section list load time < 200ms
  - Run tests with realistic data volumes
  - _Requirements: 11.1-11.6_

- [ ] 13. Documentation and Cleanup
  - Update API documentation
  - Create Postman collection
  - Write developer guide
  - Clean up code and comments

- [ ] 13.1 Create Postman collection
  - Document all section endpoints
  - Document all lesson endpoints
  - Document all progress endpoints
  - Add example requests and responses
  - Export collection to `tests/postman/course-content-management.json`
  - _Requirements: Testing requirements_

- [ ] 13.2 Write API documentation
  - Document request/response schemas
  - Document error codes
  - Document authentication requirements
  - Create `docs/api/content-management.md`
  - _Requirements: Documentation requirements_

- [ ] 13.3 Write developer guide
  - Document local setup steps
  - Document database migration process
  - Document testing procedures
  - Create `docs/dev/content-management-guide.md`
  - _Requirements: Documentation requirements_

- [ ] 13.4 Code cleanup
  - Remove console.log statements
  - Add JSDoc comments to functions
  - Format code with Prettier
  - Run ESLint and fix warnings
  - _Requirements: Code quality_

- [ ] 14. Final Checkpoint - Sprint 2 Complete
  - Ensure all tasks completed
  - Ensure all tests passing
  - Ensure documentation complete
  - Demo to stakeholders

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-07  
**Ready for:** Implementation
