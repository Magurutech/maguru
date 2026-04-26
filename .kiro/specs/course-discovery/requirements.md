# Requirements Document: Course Discovery & Enrollment

**Feature Name:** Course Discovery & Enrollment
**Sprint:** Sprint 2b - Student & Creator Experience
**Created:** 2026-03-16
**Status:** Draft
**Version:** 1.0
**Dependencies:** Course Content Management V2 (Tasks 1-11 Complete)

---

## Introduction

Course Discovery & Enrollment memungkinkan student untuk menemukan, menjelajahi, dan mendaftar ke kursus yang tersedia di platform Maguru. Fitur ini juga memungkinkan creator untuk membuat kursus baru dengan alur Quick Start (minimal fields) dan mengelola status publikasi kursus mereka.

Fitur ini merupakan jembatan antara Course Content Management (CMS) yang sudah ada dengan pengalaman belajar student yang sesungguhnya.

### Scope

- **Student:** Browse catalog kursus, enroll ke kursus, lihat daftar kursus yang diikuti
- **Creator:** Lihat daftar kursus sendiri, buat kursus baru (Quick Start), publish/unpublish kursus
- **Enrollment:** Direct enrollment tanpa approval
- **Course Creation:** Quick Start dengan minimal fields (title, description, category, difficulty, status)

---

## Glossary

- **System**: Course Discovery & Enrollment system
- **Student**: User yang browse dan enroll ke kursus
- **Creator**: User yang membuat dan mengelola kursus
- **Course Catalog**: Halaman daftar semua kursus yang dipublish
- **Enrollment**: Relasi antara student dan kursus yang diikuti
- **Direct Enrollment**: Proses enroll tanpa perlu approval dari creator
- **Quick Start**: Alur pembuatan kursus dengan field minimal
- **Slug**: Identifier URL-friendly untuk kursus (saat ini menggunakan course ID)
- **CourseStatus**: Enum DRAFT atau PUBLISHED yang mengontrol visibilitas kursus
- **My Courses**: Halaman daftar kursus yang sudah diikuti oleh student

---

## Requirements

### Requirement 1: Course Catalog (Student Browse)

**User Story:** As a Student, I want to browse all published courses with filters, so that I can discover courses that match my interests.

#### Acceptance Criteria

1.1. WHEN a Student visits the course catalog page, THE System SHALL display all courses with status PUBLISHED

1.2. WHEN a Student applies a category filter, THE System SHALL return only courses matching the selected category

1.3. WHEN a Student applies a difficulty filter, THE System SHALL return only courses matching the selected difficulty level

1.4. WHEN a Student enters a search query, THE System SHALL return courses where title or description contains the search term (case-insensitive)

1.5. WHEN displaying course cards, THE System SHALL show: title, description preview (max 150 chars), category, difficulty, and enrollment status

1.6. WHERE a Student is already enrolled in a course, THE System SHALL display "Lanjut Belajar" button instead of "Daftar Sekarang"

1.7. WHERE a Student is not enrolled in a course, THE System SHALL display "Daftar Sekarang" button

1.8. WHEN the catalog has more than 12 courses, THE System SHALL paginate results with 12 courses per page

1.9. WHERE no courses match the filter criteria, THE System SHALL display an empty state message

1.10. THE System SHALL support responsive layout for mobile, tablet, and desktop viewports

---

### Requirement 2: Course Enrollment (Direct Enrollment)

**User Story:** As a Student, I want to enroll in a course with one click, so that I can start learning immediately.

#### Acceptance Criteria

2.1. WHEN an authenticated Student clicks "Daftar Sekarang", THE System SHALL create an Enrollment record with userId, courseId, and enrolledAt timestamp

2.2. WHEN enrollment is successful, THE System SHALL redirect the Student to the course learn page

2.3. WHEN a Student attempts to enroll in a course they are already enrolled in, THE System SHALL return HTTP 409 Conflict

2.4. WHEN an unauthenticated user attempts to enroll, THE System SHALL return HTTP 401 Unauthorized

2.5. WHEN a Student attempts to enroll in a non-existent course, THE System SHALL return HTTP 404 Not Found

2.6. WHEN a Student attempts to enroll in a DRAFT course, THE System SHALL return HTTP 403 Forbidden

2.7. AFTER successful enrollment, THE System SHALL update the enrollment status indicator on the course card without full page reload

2.8. THE System SHALL enforce unique constraint on (userId, courseId) at database level

---

### Requirement 3: My Courses Dashboard (Student)

**User Story:** As a Student, I want to see all my enrolled courses in one place, so that I can track my learning and resume where I left off.

#### Acceptance Criteria

3.1. WHEN an authenticated Student visits My Courses page, THE System SHALL display all courses the Student is enrolled in

3.2. WHEN displaying enrolled course cards, THE System SHALL show: title, category, difficulty, enrollment date, and completion percentage

3.3. WHEN a Student has no enrolled courses, THE System SHALL display an empty state with a link to the course catalog

3.4. WHEN a Student clicks "Lanjut Belajar" on an enrolled course, THE System SHALL redirect to the course learn page

3.5. IF a Student is not authenticated, THE System SHALL redirect to the login page

3.6. THE System SHALL calculate completion percentage from lesson_progress records relative to total lessons in the course

---

### Requirement 4: Creator Course List

**User Story:** As a Creator, I want to see all my courses in the dashboard, so that I can quickly access and manage my content.

#### Acceptance Criteria

4.1. WHEN an authenticated Creator visits the creator dashboard, THE System SHALL display all courses owned by that Creator

4.2. WHEN displaying creator course cards, THE System SHALL show: title, description, status (DRAFT/PUBLISHED), section count, and last updated date

4.3. THE System SHALL display aggregate stats: total courses, published count, draft count

4.4. WHEN a Creator clicks "Manage" on a course card, THE System SHALL redirect to the course management page

4.5. WHERE a Creator has no courses, THE System SHALL display an empty state with a "Buat Kursus Pertama" call-to-action

4.6. THE System SHALL only return courses where creatorId matches the authenticated user's Clerk ID

4.7. IF a non-Creator user attempts to access creator endpoints, THE System SHALL return HTTP 403 Forbidden

---

### Requirement 5: Course Creation (Quick Start)

**User Story:** As a Creator, I want to create a new course with minimal fields, so that I can quickly start building content.

#### Acceptance Criteria

5.1. WHEN a Creator clicks "Buat Kursus Baru", THE System SHALL display a course creation form

5.2. THE Course Creation Form SHALL contain the following fields: title (required), description (required), category (required), difficulty (required), status (required, default: DRAFT)

5.3. WHEN a Creator submits the form with valid data, THE System SHALL create a new course record in the database

5.4. WHEN creating a course, THE System SHALL set creatorId to the authenticated user's Clerk ID

5.5. WHEN course creation is successful, THE System SHALL redirect the Creator to the course management page for the new course

5.6. WHEN a Creator submits the form with missing required fields, THE System SHALL display inline validation errors

5.7. THE difficulty field SHALL accept only: "Pemula", "Menengah", "Mahir"

5.8. THE status field SHALL accept only: "DRAFT" or "PUBLISHED"

5.9. THE title field SHALL not exceed 100 characters

5.10. THE System SHALL display a loading state on the submit button during form submission

---

### Requirement 6: Publish / Unpublish Course

**User Story:** As a Creator, I want to toggle my course status between Draft and Published, so that I can control when students can see my course.

#### Acceptance Criteria

6.1. WHEN a Creator clicks "Publish" on a DRAFT course, THE System SHALL update the course status to PUBLISHED

6.2. WHEN a Creator clicks "Unpublish" on a PUBLISHED course, THE System SHALL update the course status to DRAFT

6.3. WHEN a course is unpublished, THE System SHALL hide it from the student course catalog immediately

6.4. WHEN a course is published, THE System SHALL make it visible in the student course catalog immediately

6.5. THE System SHALL only allow the course owner or Admin to change course status

6.6. WHEN status is toggled successfully, THE System SHALL update the UI without full page reload

---

### Requirement 7: Public Course API

**User Story:** As a System, I want public API endpoints for course discovery, so that the frontend can fetch published courses with filters and pagination.

#### Acceptance Criteria

7.1. THE System SHALL provide GET /api/courses endpoint that returns paginated list of PUBLISHED courses

7.2. THE GET /api/courses endpoint SHALL support query parameters: page, limit (max 50), category, difficulty, search

7.3. THE System SHALL provide GET /api/courses/[slug] endpoint that returns course detail by ID

7.4. THE GET /api/courses/[slug] endpoint SHALL return: id, title, description, category, difficulty, status, section count, lesson count, createdAt

7.5. WHEN an authenticated user calls GET /api/courses or GET /api/courses/[slug], THE System SHALL include enrollment status in the response

7.6. THE System SHALL provide POST /api/courses/[slug]/enroll endpoint for direct enrollment

7.7. THE System SHALL provide GET /api/courses/my-courses endpoint that returns all enrollments for the authenticated user

7.8. THE GET /api/courses/my-courses endpoint SHALL require authentication and return HTTP 401 if not authenticated

---

### Requirement 8: Creator Course API

**User Story:** As a System, I want creator-specific API endpoints, so that creators can manage their courses programmatically.

#### Acceptance Criteria

8.1. THE System SHALL provide GET /api/creator/courses endpoint that returns all courses owned by the authenticated creator

8.2. THE GET /api/creator/courses response SHALL include stats: totalCourses, publishedCourses, draftCourses

8.3. THE System SHALL provide POST /api/creator/courses endpoint for creating new courses

8.4. THE POST /api/creator/courses endpoint SHALL validate required fields and return HTTP 400 for invalid data

8.5. THE System SHALL provide PUT /api/creator/courses/[slug]/publish endpoint for toggling course status

8.6. THE PUT /api/creator/courses/[slug]/publish endpoint SHALL return HTTP 403 if the authenticated user does not own the course

8.7. ALL creator API endpoints SHALL require authentication and return HTTP 401 if not authenticated

8.8. ALL creator API endpoints SHALL verify the user has Creator or Admin role and return HTTP 403 otherwise

---

### Requirement 9: Database Schema

**User Story:** As a System, I want the database schema to support course discovery and enrollment, so that all data is stored correctly and efficiently.

#### Acceptance Criteria

9.1. THE enrollments table SHALL have fields: id, userId, courseId, enrolledAt, completed, completedAt

9.2. THE enrollments table SHALL enforce unique constraint on (userId, courseId)

9.3. THE enrollments table SHALL have indexes on userId and courseId for query performance

9.4. THE courses table SHALL have a difficulty field (VARCHAR 50, nullable)

9.5. THE courses table SHALL have indexes on status, category, and difficulty for filter performance

9.6. WHEN a course is deleted, THE System SHALL cascade delete all associated enrollments

9.7. THE System SHALL use Prisma ORM for all database operations

---

### Requirement 10: Error Handling

**User Story:** As a User, I want clear error messages when operations fail, so that I understand what went wrong.

#### Acceptance Criteria

10.1. WHEN enrollment fails due to duplicate, THE System SHALL return HTTP 409 with message "Anda sudah terdaftar di kursus ini"

10.2. WHEN enrollment fails due to unauthenticated user, THE System SHALL return HTTP 401 with message "Silakan login terlebih dahulu"

10.3. WHEN a resource is not found, THE System SHALL return HTTP 404 with descriptive message

10.4. WHEN form validation fails, THE System SHALL display inline error messages next to the relevant field

10.5. WHEN an API call fails, THE System SHALL display a toast notification with the error message

10.6. WHEN a server error occurs, THE System SHALL log the error and return HTTP 500 with generic message

---

## Non-Functional Requirements

### Performance
- Course catalog page SHALL load within 1 second at 95th percentile
- Enrollment API SHALL respond within 500ms at 95th percentile
- Course list filtering SHALL be instant (client-side or debounced 300ms)

### Security
- All enrollment endpoints SHALL require Clerk authentication
- Creator endpoints SHALL verify user role before processing
- Course ownership SHALL be verified before any mutation operation

### Usability
- All forms SHALL have loading states during submission
- All async operations SHALL have appropriate loading indicators
- Empty states SHALL have clear call-to-action messages

---

## Assumptions

- Course slug saat ini menggunakan course ID (tidak ada field slug terpisah di schema)
- Enrollment bersifat direct tanpa approval dari creator
- Progress tracking menggunakan lesson_progress yang sudah ada dari CMS V2
- Difficulty menggunakan string bebas (bukan enum) sesuai schema yang ada
- creatorId di courses menggunakan Clerk user ID langsung

---

## Dependencies

- Course Content Management V2 (Tasks 1-11 complete, 207/207 tests passing)
- Clerk authentication (`@clerk/nextjs`)
- Prisma ORM dengan schema yang sudah ada
- Supabase PostgreSQL
- Next.js 14 App Router
- Existing `enrollments` model di schema (sudah ada, perlu tambah field `completed` dan `completedAt`)
- Existing `courses` model (perlu tambah field `difficulty`)

---

**Document Version:** 1.0
**Last Updated:** 2026-03-16
**Status:** Ready for Review
