# Requirements Document: Course Content Management

**Feature Name:** Course Content Management  
**Sprint:** Sprint 2 - Content First  
**Created:** 2026-03-08  
**Status:** Draft  
**Version:** 2.0

---

## Introduction

The Course Content Management feature enables creators to build structured learning content using a modern rich-text editor (Tiptap) and allows students to learn systematically with progress tracking. This feature establishes the foundation for the Maguru learning platform by implementing a hierarchical content structure (Course → Section → Lesson) with Tiptap JSON native format storage and persistent progress tracking.

### Key Changes from V1

- **Content Format**: Tiptap JSON native format (not markdown wrapper)
- **Storage Strategy**: Direct Tiptap JSON storage in database
- **Editor**: Tiptap rich-text editor with native JSON output
- **Rendering**: EditorContent component for student view (not HTML conversion)

---

## Glossary

- **System**: The Course Content Management system
- **Creator**: A user with creator role who can create and manage course content
- **Student**: A user who enrolls in courses and consumes learning content
- **Admin**: A user with admin role who can manage all courses
- **Course**: A complete learning program containing sections and lessons
- **Course Service**: Backend service layer that handles course-related operations and authorization
- **Section**: A chapter or module within a course that groups related lessons
- **Lesson**: An individual learning unit containing Tiptap JSON content
- **Tiptap_JSON**: Native JSON structure from Tiptap editor representing rich text content
- **LessonContent**: Wrapper object containing Tiptap JSON, version number, and lastEdit timestamp
- **Progress**: The tracking data for lesson completion status per student
- **Completion**: The overall course completion status and percentage per student
- **EditorContent**: Tiptap React component for rendering content (editable or read-only)

---

## Requirements

### Requirement 0: Course Service Layer

**User Story:** As a System, I want a centralized course service layer, so that course-related operations and authorization are handled consistently across all CMS features.

#### Acceptance Criteria

0.1. THE System SHALL provide a course service that handles course retrieval by slug

0.2. THE System SHALL provide a course service that validates course ownership for authorization

0.3. WHEN retrieving a course by slug, THE System SHALL return course data including id, title, slug, creatorId, and status

0.4. WHEN checking course ownership, THE System SHALL verify if the user is the course creator OR has Admin role

0.5. THE System SHALL use the course service in all section and lesson operations for authorization

0.6. IF a course does not exist, THE System SHALL return appropriate error response

0.7. THE System SHALL cache course ownership checks to optimize performance

0.8. THE course service SHALL be reusable across all CMS API endpoints

---

### Requirement 1: Section Management

**User Story:** As a Creator, I want to manage sections within my courses, so that I can organize learning content into logical chapters.

#### Acceptance Criteria

1.1. WHEN a Creator creates a new section, THE System SHALL store the section with title, description, order, and course association

1.2. WHEN a Creator requests sections for a course, THE System SHALL return all sections ordered by their order field in ascending sequence

1.3. WHEN a Creator updates a section, THE System SHALL modify the section title, description, or order while preserving the section identifier

1.4. WHEN a Creator deletes a section, THE System SHALL remove the section and all associated lessons from the database via cascade delete

1.5. WHEN a Creator changes section order, THE System SHALL update the order field and maintain unique ordering within the course

1.6. WHERE a Creator owns a course, THE System SHALL allow full CRUD operations on sections within that course

1.7. WHERE an Admin accesses any course, THE System SHALL allow full CRUD operations on sections within that course

1.8. IF a Student attempts to create or modify sections, THEN THE System SHALL reject the request with authorization error

---

### Requirement 2: Lesson Management

**User Story:** As a Creator, I want to manage lessons within sections, so that I can create individual learning units with Tiptap-formatted content.

#### Acceptance Criteria

2.1. WHEN a Creator creates a new lesson, THE System SHALL store the lesson with title, LessonContent object (containing Tiptap JSON), order, and section association

2.2. WHEN a Creator requests lessons for a section, THE System SHALL return all lessons ordered by their order field in ascending sequence

2.3. WHEN a Creator retrieves a specific lesson, THE System SHALL return the lesson with full LessonContent including Tiptap JSON structure, version, and lastEdit metadata

2.4. WHEN a Creator updates a lesson, THE System SHALL modify the lesson title, content, or order while incrementing the version number

2.5. WHEN a Creator deletes a lesson, THE System SHALL remove the lesson and all associated progress records from the database via cascade delete

2.6. WHEN a Creator changes lesson order, THE System SHALL update the order field and maintain unique ordering within the section

2.7. WHERE a Creator owns the parent course, THE System SHALL allow full CRUD operations on lessons within that course

2.8. WHERE an Admin accesses any course, THE System SHALL allow full CRUD operations on lessons within that course

2.9. IF a Student attempts to create or modify lessons, THEN THE System SHALL reject the request with authorization error

---

### Requirement 3: Tiptap JSON Content Storage

**User Story:** As a Creator, I want my lesson content stored in Tiptap JSON format, so that content renders consistently between editor and student view without conversion.

#### Acceptance Criteria

3.1. WHEN a Creator saves lesson content, THE System SHALL store the content as LessonContent object with three fields: content (Tiptap JSON document), version (positive integer), and lastEdit (ISO 8601 timestamp)

3.2. WHEN a Creator updates lesson content, THE System SHALL increment the version number and update the lastEdit timestamp

3.3. WHEN the System stores content, THE System SHALL validate that the Tiptap JSON structure has type 'doc' at root level with content array

3.4. WHEN a Creator retrieves lesson content, THE System SHALL return the complete LessonContent object without any format conversion

3.5. THE System SHALL store Tiptap JSON in the database Json field as the native editor structure

3.6. THE System SHALL NOT convert Tiptap JSON to markdown or HTML for storage

---

### Requirement 4: Tiptap Rich Text Editor

**User Story:** As a Creator, I want to use a Tiptap rich text editor, so that I can format lesson content with headings, lists, links, and code blocks using a modern WYSIWYG interface.

#### Acceptance Criteria

4.1. WHEN a Creator opens the lesson editor, THE System SHALL display a Tiptap EditorContent component with editable set to true

4.2. THE Editor SHALL support bold, italic, and inline code marks via toolbar buttons

4.3. THE Editor SHALL support heading levels 1, 2, and 3 via toolbar buttons

4.4. THE Editor SHALL support ordered lists and unordered lists via toolbar buttons

4.5. THE Editor SHALL support link insertion and editing via toolbar button

4.6. THE Editor SHALL support code block insertion via toolbar button

4.7. WHEN a Creator types in the editor, THE System SHALL display a live preview using EditorContent component with editable set to false

4.8. WHEN a Creator saves content, THE System SHALL call editor.getJSON() to retrieve native Tiptap JSON structure

4.9. THE System SHALL use StarterKit extension for all Tiptap editor instances

---

### Requirement 5: Student Content Viewing with Tiptap Renderer

**User Story:** As a Student, I want to view lesson content rendered by Tiptap engine, so that I see exactly what the creator sees in their preview.

#### Acceptance Criteria

5.1. WHEN a Student opens a course learn page, THE System SHALL display all sections with their titles in order

5.2. WHEN a Student clicks on a section, THE System SHALL display all lessons within that section in order

5.3. WHEN a Student clicks on a lesson, THE System SHALL fetch the LessonContent and render it using EditorContent component with editable set to false

5.4. THE System SHALL use the same StarterKit extension for student view as used in creator editor

5.5. THE System SHALL render Tiptap JSON content with proper formatting including headings, bold, italic, lists, links, and code blocks

5.6. THE System SHALL NOT use generateHTML() or manual HTML parsing for student lesson view

5.7. WHEN a Student views a lesson, THE System SHALL display navigation to previous and next lessons

5.8. WHERE a lesson is the first in a section, THE System SHALL disable or hide the previous lesson navigation

5.9. WHERE a lesson is the last in a course, THE System SHALL disable or hide the next lesson navigation

---

### Requirement 6: Lesson Progress Tracking

**User Story:** As a Student, I want to mark lessons as complete, so that I can track my learning progress through the course.

#### Acceptance Criteria

6.1. WHEN a Student views a lesson, THE System SHALL display a "Mark as Complete" button

6.2. WHEN a Student clicks "Mark as Complete", THE System SHALL record the lesson as completed with the current timestamp

6.3. WHEN a Student marks a lesson complete, THE System SHALL create or update the LessonProgress record for that student and lesson combination

6.4. WHEN a Student views the lesson list, THE System SHALL display a visual indicator (checkmark) for completed lessons

6.5. WHEN a Student has already completed a lesson, THE System SHALL display the completion status and timestamp

6.6. THE System SHALL persist lesson progress across user sessions and devices

6.7. WHEN a Student marks a lesson complete, THE System SHALL trigger course completion percentage recalculation

6.8. IF a Student attempts to mark a lesson complete without authentication, THEN THE System SHALL reject the request with authentication error

---

### Requirement 7: Course Completion Calculation

**User Story:** As a Student, I want to see my overall course completion percentage, so that I know how much of the course I have finished.

#### Acceptance Criteria

7.1. WHEN a Student views a course, THE System SHALL display the completion percentage calculated from completed lessons

7.2. THE System SHALL calculate completion percentage as (completed lessons / total lessons) × 100 rounded to two decimal places

7.3. WHEN a Student completes a lesson, THE System SHALL update the CourseCompletion record immediately

7.4. WHEN a Student completes all lessons in a course, THE System SHALL set completed field to true and record completedAt timestamp

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

9.3. WHEN creating or updating content, THE System SHALL validate that LessonContent has content field with Tiptap JSON structure (type: 'doc'), version field (positive integer), and lastEdit field (ISO 8601 string)

9.4. WHEN setting order values, THE System SHALL validate that order is a positive integer

9.5. WHEN creating a section, THE System SHALL validate that the course exists and is accessible to the user

9.6. WHEN creating a lesson, THE System SHALL validate that the section exists and is accessible to the user

9.7. IF validation fails, THEN THE System SHALL return HTTP 400 with descriptive error message indicating which field failed validation

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

10.5. WHEN an API request fails due to server error, THE System SHALL return HTTP 500 with generic error message and log detailed error

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

11.6. WHEN rendering Tiptap content, THE System SHALL complete rendering within 200 milliseconds for content up to 10,000 characters

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

## Non-Functional Requirements

### Usability

- The Tiptap editor interface shall be intuitive and require no training for creators familiar with basic text editors
- The student learning interface shall be accessible on desktop, tablet, and mobile devices
- All text shall be readable with minimum font size of 14px on mobile devices
- The editor and student view shall use the same Tiptap rendering engine for WYSIWYG consistency

### Security

- All API endpoints shall require authentication via Clerk
- All sensitive operations shall require authorization based on user role
- Content data shall be sanitized to prevent XSS attacks when rendering
- Tiptap JSON structure shall be validated before storage

### Maintainability

- Code shall follow Next.js App Router conventions
- Database schema shall use Prisma ORM for type safety
- API routes shall follow RESTful naming conventions
- All Tiptap editor instances shall use StarterKit extension for consistency
- Frontend components shall use EditorContent for all content rendering

### Testability

- All business logic shall be unit testable with clear inputs and outputs
- API endpoints shall return consistent response formats for automated testing
- Database operations shall be testable with seed data and test fixtures
- Tiptap content rendering shall be testable with sample JSON structures

---

## Assumptions and Dependencies

### Assumptions

- Users have stable internet connection for content loading
- Creators are familiar with basic rich-text editing
- Students will manually mark lessons as complete (no automatic tracking)
- Tiptap JSON format is stable and will not require migration

### Dependencies

- Clerk authentication system for user management
- Prisma ORM for database operations
- Supabase PostgreSQL for data storage
- Tiptap editor library (@tiptap/react, @tiptap/starter-kit, @tiptap/pm)
- Next.js 14+ App Router for routing and API

---

## Acceptance Criteria Summary

| Requirement | Total Criteria | Priority |
|-------------|----------------|----------|
| Course Service Layer | 8 | High |
| Section Management | 8 | High |
| Lesson Management | 9 | High |
| Tiptap JSON Storage | 6 | High |
| Tiptap Editor | 9 | High |
| Student Viewing | 9 | High |
| Progress Tracking | 8 | High |
| Course Completion | 7 | High |
| Authorization | 7 | High |
| Data Validation | 9 | High |
| Error Handling | 8 | Medium |
| Performance | 6 | Medium |
| Data Persistence | 7 | High |

**Total Acceptance Criteria:** 101

---

**Document Version:** 2.2  
**Last Updated:** 2026-03-12  
**Status:** Phase 1 Complete (Tasks 1-9) - Migration Decision Required

---

## 📊 Implementation Status

**Phase 1: Foundation & Components (Tasks 1-9)** ✅ COMPLETE
- All backend services and APIs implemented
- All creator and student components built
- Comprehensive test coverage: 207/207 tests passing
- No lint errors, no type errors

**Phase 2: Integration (Tasks 10-11)** ⏸️ BLOCKED
- Migration decision required before proceeding
- See: `.kiro/specs/course-content-management-v2/CURRENT_STATUS.md`
- Review: `../../docs/rules/error.md` for decision analysis
