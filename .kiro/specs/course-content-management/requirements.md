# Requirements Document: Course Content Management

**Feature Name:** Course Content Management  
**Sprint:** Sprint 2 - Content First  
**Created:** 2026-03-07  
**Status:** Draft

---

## Introduction

The Course Content Management feature enables creators to build structured learning content and allows students to learn systematically with progress tracking. This feature establishes the foundation for the Maguru learning platform by implementing a hierarchical content structure (Course → Section → Lesson) with persistent progress tracking.

### Scope

This requirements document covers:
- Section and Lesson management for creators
- Content creation and editing with markdown support
- Student learning interface with content navigation
- Progress tracking system for lesson completion
- Course completion calculation

Out of scope for this sprint:
- Quiz creation and assessment (Sprint 3)
- Video content support (Sprint 3+)
- GitHub integration (Sprint 4+)
- Drag-drop reordering (Sprint 4+)
- Image upload in editor (Sprint 4+)

---

## Glossary

- **System**: The Course Content Management system
- **Creator**: A user with creator role who can create and manage course content
- **Student**: A user who enrolls in courses and consumes learning content
- **Admin**: A user with admin role who can manage all courses
- **Course**: A complete learning program containing sections and lessons
- **Section**: A chapter or module within a course that groups related lessons
- **Lesson**: An individual learning unit containing markdown content
- **Content**: The markdown text and metadata stored for each lesson
- **Progress**: The tracking data for lesson completion status per student
- **Completion**: The overall course completion status and percentage per student
- **Markdown**: A lightweight markup language for formatting text
- **Editor**: The Tiptap-based rich text editor for creating lesson content

---

## Requirements

### Requirement 1: Section Management

**User Story:** As a Creator, I want to manage sections within my courses, so that I can organize learning content into logical chapters.

#### Acceptance Criteria

1.1. WHEN a Creator creates a new section, THE System SHALL store the section with title, description, order, and course association

1.2. WHEN a Creator requests sections for a course, THE System SHALL return all sections ordered by their order field in ascending sequence

1.3. WHEN a Creator updates a section, THE System SHALL modify the section title, description, or order while preserving the section identifier

1.4. WHEN a Creator deletes a section, THE System SHALL remove the section and all associated lessons from the database

1.5. WHEN a Creator changes section order, THE System SHALL update the order field and maintain unique ordering within the course

1.6. WHERE a Creator owns a course, THE System SHALL allow full CRUD operations on sections within that course

1.7. WHERE an Admin accesses any course, THE System SHALL allow full CRUD operations on sections within that course

1.8. IF a Student attempts to create or modify sections, THEN THE System SHALL reject the request with authorization error

---

### Requirement 2: Lesson Management

**User Story:** As a Creator, I want to manage lessons within sections, so that I can create individual learning units with specific content.

#### Acceptance Criteria

2.1. WHEN a Creator creates a new lesson, THE System SHALL store the lesson with title, content JSON, order, and section association

2.2. WHEN a Creator requests lessons for a section, THE System SHALL return all lessons ordered by their order field in ascending sequence

2.3. WHEN a Creator retrieves a specific lesson, THE System SHALL return the lesson with full content including markdown, version, and lastEdit metadata

2.4. WHEN a Creator updates a lesson, THE System SHALL modify the lesson title, content, or order while incrementing the version number

2.5. WHEN a Creator deletes a lesson, THE System SHALL remove the lesson and all associated progress records from the database

2.6. WHEN a Creator changes lesson order, THE System SHALL update the order field and maintain unique ordering within the section

2.7. WHERE a Creator owns the parent course, THE System SHALL allow full CRUD operations on lessons within that course

2.8. WHERE an Admin accesses any course, THE System SHALL allow full CRUD operations on lessons within that course

2.9. IF a Student attempts to create or modify lessons, THEN THE System SHALL reject the request with authorization error

---

### Requirement 3: Content Storage and Versioning

**User Story:** As a Creator, I want my lesson content to be stored with metadata, so that I can track versions and maintain content history.

#### Acceptance Criteria

3.1. WHEN a Creator saves lesson content, THE System SHALL store the content as JSON with markdown, version, and lastEdit fields

3.2. WHEN a Creator updates lesson content, THE System SHALL increment the version number and update the lastEdit timestamp

3.3. WHEN the System stores content, THE System SHALL validate that the JSON structure contains required fields: markdown, version, lastEdit

3.4. WHEN a Creator retrieves lesson content, THE System SHALL return the complete JSON object with all metadata fields

3.5. THE System SHALL store markdown content as plain text within the JSON structure without modification

---

### Requirement 4: Markdown Editor Interface

**User Story:** As a Creator, I want to use a rich markdown editor, so that I can format lesson content with headings, lists, links, and code blocks.

#### Acceptance Criteria

4.1. WHEN a Creator opens the lesson editor, THE System SHALL display a Tiptap editor with toolbar for formatting options

4.2. THE Editor SHALL support bold, italic, and inline code formatting

4.3. THE Editor SHALL support heading levels 1, 2, and 3

4.4. THE Editor SHALL support ordered lists and unordered lists

4.5. THE Editor SHALL support link insertion and editing

4.6. THE Editor SHALL support code block insertion with syntax preservation

4.7. WHEN a Creator types in the editor, THE System SHALL display a live preview of the rendered markdown

4.8. WHEN a Creator saves content, THE System SHALL convert the editor state to markdown format for storage

---

### Requirement 5: Student Content Navigation

**User Story:** As a Student, I want to navigate through course sections and lessons, so that I can access learning content in a structured way.

#### Acceptance Criteria

5.1. WHEN a Student opens a course learn page, THE System SHALL display all sections with their titles in order

5.2. WHEN a Student clicks on a section, THE System SHALL display all lessons within that section in order

5.3. WHEN a Student clicks on a lesson, THE System SHALL display the lesson content rendered from markdown

5.4. THE System SHALL render markdown content with proper formatting including headings, lists, links, and code blocks

5.5. THE System SHALL apply syntax highlighting to code blocks in the rendered content

5.6. WHEN a Student views a lesson, THE System SHALL display navigation to previous and next lessons

5.7. WHERE a lesson is the first in a section, THE System SHALL disable or hide the previous lesson navigation

5.8. WHERE a lesson is the last in a course, THE System SHALL disable or hide the next lesson navigation

---

### Requirement 6: Lesson Progress Tracking

**User Story:** As a Student, I want to mark lessons as complete, so that I can track my learning progress through the course.

#### Acceptance Criteria

6.1. WHEN a Student views a lesson, THE System SHALL display a "Mark as Complete" button

6.2. WHEN a Student clicks "Mark as Complete", THE System SHALL record the lesson as completed with the current timestamp

6.3. WHEN a Student marks a lesson complete, THE System SHALL update the lesson progress record for that student and lesson combination

6.4. WHEN a Student views the lesson list, THE System SHALL display a visual indicator for completed lessons

6.5. WHEN a Student has already completed a lesson, THE System SHALL display the completion status and timestamp

6.6. THE System SHALL persist lesson progress across user sessions and devices

6.7. WHEN a Student marks a lesson complete, THE System SHALL recalculate the course completion percentage

6.8. IF a Student attempts to mark a lesson complete without authentication, THEN THE System SHALL reject the request with authentication error

---

### Requirement 7: Course Completion Calculation

**User Story:** As a Student, I want to see my overall course completion percentage, so that I know how much of the course I have finished.

#### Acceptance Criteria

7.1. WHEN a Student views a course, THE System SHALL display the completion percentage calculated from completed lessons

7.2. THE System SHALL calculate completion percentage as (completed lessons / total lessons) × 100

7.3. WHEN a Student completes a lesson, THE System SHALL update the course completion percentage immediately

7.4. WHEN a Student completes all lessons in a course, THE System SHALL mark the course as completed with completion timestamp

7.5. WHEN a Student views course progress, THE System SHALL display the count of completed lessons and total lessons

7.6. THE System SHALL persist course completion data across user sessions and devices

7.7. WHERE a course has zero lessons, THE System SHALL display completion as 0%

---

### Requirement 8: Authorization and Access Control

**User Story:** As a System Administrator, I want to enforce role-based access control, so that users can only perform actions appropriate to their role.

#### Acceptance Criteria

8.1. WHERE a user has Creator role, THE System SHALL allow CRUD operations only on courses owned by that creator

8.2. WHERE a user has Admin role, THE System SHALL allow CRUD operations on all courses regardless of ownership

8.3. WHERE a user has Student role, THE System SHALL allow read-only access to published course content

8.4. WHEN a Creator attempts to modify another creator's course, THE System SHALL reject the request with authorization error

8.5. WHEN an unauthenticated user attempts to access creator endpoints, THE System SHALL reject the request with authentication error

8.6. WHEN a Student attempts to access creator or admin endpoints, THE System SHALL reject the request with authorization error

8.7. THE System SHALL verify user authentication and authorization on every API request

---

### Requirement 9: Data Integrity and Validation

**User Story:** As a System, I want to validate all data inputs, so that the database maintains consistency and prevents invalid data.

#### Acceptance Criteria

9.1. WHEN creating or updating a section, THE System SHALL validate that title is not empty and does not exceed 200 characters

9.2. WHEN creating or updating a lesson, THE System SHALL validate that title is not empty and does not exceed 200 characters

9.3. WHEN creating or updating content, THE System SHALL validate that markdown field exists in the JSON structure

9.4. WHEN setting order values, THE System SHALL validate that order is a positive integer

9.5. WHEN creating a section, THE System SHALL validate that the course exists and is accessible to the user

9.6. WHEN creating a lesson, THE System SHALL validate that the section exists and is accessible to the user

9.7. IF validation fails, THEN THE System SHALL return a descriptive error message indicating which field failed validation

9.8. THE System SHALL prevent duplicate order values within the same course for sections

9.9. THE System SHALL prevent duplicate order values within the same section for lessons

---

### Requirement 10: Error Handling and User Feedback

**User Story:** As a User, I want to receive clear error messages when operations fail, so that I understand what went wrong and how to fix it.

#### Acceptance Criteria

10.1. WHEN an API request fails due to validation error, THE System SHALL return HTTP 400 with descriptive error message

10.2. WHEN an API request fails due to authentication error, THE System SHALL return HTTP 401 with authentication required message

10.3. WHEN an API request fails due to authorization error, THE System SHALL return HTTP 403 with permission denied message

10.4. WHEN an API request fails due to resource not found, THE System SHALL return HTTP 404 with resource not found message

10.5. WHEN an API request fails due to server error, THE System SHALL return HTTP 500 with generic error message

10.6. WHEN a database operation fails, THE System SHALL log the error details and return a user-friendly error message

10.7. WHEN a Creator saves content successfully, THE System SHALL display a success notification

10.8. WHEN a Student marks a lesson complete successfully, THE System SHALL display a success notification and update the UI

---

### Requirement 11: Performance and Scalability

**User Story:** As a User, I want the system to respond quickly, so that I have a smooth learning and content creation experience.

#### Acceptance Criteria

11.1. WHEN a Student requests a lesson, THE System SHALL return the content within 500 milliseconds at the 95th percentile

11.2. WHEN a Creator saves lesson content, THE System SHALL complete the save operation within 1 second at the 95th percentile

11.3. WHEN a Student requests course progress, THE System SHALL calculate and return the data within 300 milliseconds at the 95th percentile

11.4. THE System SHALL support at least 100 concurrent users without performance degradation

11.5. THE System SHALL support courses with up to 50 sections and 500 lessons without performance degradation

11.6. WHEN rendering markdown content, THE System SHALL complete rendering within 200 milliseconds for content up to 10,000 characters

---

### Requirement 12: Data Persistence and Reliability

**User Story:** As a User, I want my data to be saved reliably, so that I don't lose my work or progress.

#### Acceptance Criteria

12.1. WHEN a Creator saves lesson content, THE System SHALL persist the data to the database before returning success

12.2. WHEN a Student marks a lesson complete, THE System SHALL persist the progress data to the database before returning success

12.3. THE System SHALL use database transactions for operations that modify multiple records

12.4. IF a database write operation fails, THEN THE System SHALL rollback any partial changes and return an error

12.5. THE System SHALL maintain referential integrity between courses, sections, lessons, and progress records

12.6. WHEN a section is deleted, THE System SHALL cascade delete all associated lessons

12.7. WHEN a lesson is deleted, THE System SHALL cascade delete all associated progress records

---

## Requirement 13: Testing and Quality Assurance

**User Story:** As a Development Team, we want comprehensive testing coverage, so that we can ensure system reliability and catch bugs before production.

#### Acceptance Criteria

13.1. THE System SHALL have API endpoint tests covering all CRUD operations for sections and lessons

13.2. THE System SHALL have integration tests validating database operations with API layer synchronization

13.3. THE System SHALL have E2E tests covering the complete Creator workflow from section creation to lesson publishing

13.4. THE System SHALL have E2E tests covering the complete Student workflow from course enrollment to lesson completion

13.5. THE System SHALL have unit tests for progress calculation logic with edge cases (zero lessons, all completed, partial completion)

13.6. THE System SHALL have unit tests for authorization logic covering all role combinations (Creator, Admin, Student)

13.7. THE System SHALL maintain a Postman collection documenting all API endpoints with example requests and responses

13.8. THE System SHALL have Playwright test scenarios for critical user journeys on desktop and mobile viewports

13.9. WHEN running the test suite, THE System SHALL achieve minimum 80% code coverage for business logic

13.10. WHEN API tests run, THE System SHALL validate response schemas match the documented API contracts

---

## Non-Functional Requirements

### Usability

- The editor interface shall be intuitive and require no training for creators familiar with basic text editors
- The student learning interface shall be accessible on desktop, tablet, and mobile devices
- All text shall be readable with minimum font size of 14px on mobile devices

### Security

- All API endpoints shall require authentication via Clerk
- All sensitive operations shall require authorization based on user role
- Content data shall be sanitized to prevent XSS attacks when rendering

### Maintainability

- Code shall follow Next.js App Router conventions
- Database schema shall use Prisma ORM for type safety
- API routes shall follow RESTful naming conventions
- All API endpoints shall be documented in Postman collection
- All critical user flows shall have E2E test coverage

### Testability

- All business logic shall be unit testable with clear inputs and outputs
- API endpoints shall return consistent response formats for automated testing
- Database operations shall be testable with seed data and test fixtures
- E2E tests shall be runnable in CI/CD pipeline without manual intervention

---

## Testing Strategy

### API Testing (Postman)

**Coverage:**
- All section CRUD endpoints (POST, GET, PUT, DELETE)
- All lesson CRUD endpoints (POST, GET, PUT, DELETE)
- All progress tracking endpoints (POST, GET)
- Authorization scenarios (Creator, Admin, Student, Unauthenticated)
- Error scenarios (validation errors, not found, unauthorized)

**Deliverables:**
- Postman collection with organized folders per feature
- Environment variables for local, staging, production
- Example requests with sample payloads
- Expected response schemas and status codes

### Integration Testing (Jest/Vitest)

**Coverage:**
- Database + API layer synchronization
- Prisma model operations with actual database
- Transaction rollback scenarios
- Cascade delete operations (section → lessons, lesson → progress)
- Progress calculation with various lesson completion states

**Test Scenarios:**
- Create section → verify database record
- Delete section → verify cascade delete of lessons
- Mark lesson complete → verify progress recalculation
- Update lesson order → verify ordering integrity

### E2E Testing (Playwright)

**Critical User Journeys:**

**Creator Workflow:**
1. Login as creator
2. Navigate to course editor
3. Create new section
4. Create new lesson in section
5. Write content in Tiptap editor
6. Save lesson
7. Verify lesson appears in section list
8. Reorder lessons (up/down buttons)
9. Delete lesson
10. Verify lesson removed from list

**Student Workflow:**
1. Login as student
2. Enroll in course
3. Navigate to learn page
4. View section list
5. Click section to expand lessons
6. Click lesson to view content
7. Read lesson content
8. Click "Mark as Complete"
9. Verify progress bar updates
10. Navigate to next lesson
11. Complete all lessons
12. Verify 100% completion

**Test Environments:**
- Desktop (1920x1080)
- Tablet (768x1024)
- Mobile (375x667)

### Unit Testing (Jest/Vitest)

**Coverage:**
- Progress calculation functions
- Authorization helper functions
- Content validation functions
- Order management functions
- Error handling utilities

**Test Cases:**
- Calculate completion: 0/10 lessons → 0%
- Calculate completion: 5/10 lessons → 50%
- Calculate completion: 10/10 lessons → 100%
- Calculate completion: 0/0 lessons → 0%
- Authorize creator: own course → allow
- Authorize creator: other's course → deny
- Authorize admin: any course → allow
- Authorize student: any course → read-only

---

## Test Deliverables

| Deliverable | Format | Location |
|-------------|--------|----------|
| Postman Collection | JSON | `tests/postman/course-content-management.json` |
| API Test Documentation | Markdown | `tests/postman/README.md` |
| Integration Tests | TypeScript | `tests/integration/content-management.test.ts` |
| E2E Tests | TypeScript | `tests/e2e/creator-workflow.spec.ts`, `tests/e2e/student-workflow.spec.ts` |
| Unit Tests | TypeScript | `__tests__/unit/` (co-located with source) |
| Test Coverage Report | HTML | `coverage/index.html` |

---

## Maintainability

### Compatibility

- The system shall work on modern browsers (Chrome, Firefox, Safari, Edge) released within the last 2 years
- The system shall be responsive and work on screen sizes from 320px to 4K resolution

---

## Assumptions and Dependencies

### Assumptions

- Users have stable internet connection for content loading
- Creators are familiar with basic markdown syntax
- Students will manually mark lessons as complete (no automatic tracking)

### Dependencies

- Clerk authentication system for user management
- Prisma ORM for database operations
- Supabase PostgreSQL for data storage
- Tiptap editor library for rich text editing
- Next.js 14+ App Router for routing and API

---

## Acceptance Criteria Summary

| Requirement | Total Criteria | Priority |
|-------------|----------------|----------|
| Section Management | 8 | High |
| Lesson Management | 9 | High |
| Content Storage | 5 | High |
| Markdown Editor | 8 | High |
| Student Navigation | 8 | High |
| Progress Tracking | 8 | High |
| Course Completion | 7 | High |
| Authorization | 7 | High |
| Data Validation | 9 | High |
| Error Handling | 8 | Medium |
| Performance | 6 | Medium |
| Data Persistence | 7 | High |
| Testing & QA | 10 | High |

**Total Acceptance Criteria:** 100

---

## Traceability Matrix

| User Story | Requirements | Acceptance Criteria |
|------------|--------------|---------------------|
| US1.1 - Section Navigation | Req 1 | 1.1-1.8 |
| US1.2 - Lesson Management | Req 2 | 2.1-2.9 |
| US1.3 - Content Upload | Req 3, 4 | 3.1-3.5, 4.1-4.8 |
| US2.1 - Content Viewer | Req 5 | 5.1-5.8 |
| US2.2 - Content Type Support | Req 3, 4 | 3.1-3.5, 4.1-4.8 |
| US3.1 - Lesson Progress | Req 6 | 6.1-6.8 |
| US3.2 - Course Completion | Req 7 | 7.1-7.7 |

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-07  
**Next Review:** After Sprint 2 completion
