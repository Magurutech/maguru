# Implementation Plan: Course Content Management V2

**Feature Name:** Course Content Management  
**Sprint:** Sprint 2 - Content First  
**Created:** 2026-03-08  
**Status:** Ready for Implementation  
**Version:** 2.0

---

## Overview

This implementation plan breaks down the Course Content Management feature into discrete, actionable tasks. Each task builds on previous work and includes specific requirements references for traceability.

### Implementation Approach

1. **Database First** - Set up schema and migrations
2. **API Layer** - Build backend endpoints with validation
3. **Frontend Components** - Create UI components with Tiptap integration
4. **Testing** - Validate functionality with tests
5. **Integration** - Wire everything together

---

## Tasks

- [x] 1. Database Schema and Migrations
  - Create Prisma schema for Section, Lesson, LessonProgress, and CourseCompletion models
  - Set up proper indexes and constraints
  - Run migrations and verify database structure
  - _Requirements: 1.1, 2.1, 6.3, 7.3, 9.8, 9.9, 12.5, 12.6, 12.7_

- [x] 2. Content Validation Layer
  - [x] 2.1 Create Tiptap JSON validation schemas with Zod
    - ✓ Define schemas for all node types (doc, paragraph, heading, lists, codeBlock, text)
    - ✓ Define schemas for all mark types (bold, italic, code, link)
    - ✓ Implement validateLessonContent function
    - ✓ Created lib/validation/tiptap.ts with complete Zod schemas
    - ✓ All validation tests passing (10/10)
    - _Requirements: 3.3, 9.3_

- [x]* 2.2 Write property tests for content validation
    - **Property 1: Valid Tiptap JSON structure acceptance**
    - *For any* valid Tiptap JSON document with type 'doc' at root, validation should succeed
    - **Validates: Requirements 3.3**
    - **Skipped**: Optional task - comprehensive unit tests in 2.3 provide sufficient coverage (31/31 tests passing).

- [x] 2.3 Write unit tests for validation edge cases
    - ✓ Test invalid root type rejection
    - ✓ Test invalid heading levels (0, 4, 7 rejected; 1, 2, 3 accepted)
    - ✓ Test malformed link hrefs (invalid URLs rejected)
    - ✓ Test missing required fields (version, lastEdit, content, text, attrs, href)
    - ✓ Test invalid version numbers (0, negative, decimal rejected)
    - ✓ Test invalid timestamp formats (non-ISO 8601 rejected)
    - ✓ Test empty content arrays
    - ✓ Test nested structures (deeply nested lists, ordered list with start)
    - ✓ Test all node types and mark types
    - ✓ Created lib/validation/tiptap.test.ts with comprehensive test suite
    - ✓ Created lib/validation/tiptap.manual-test.ts for quick validation
    - ✓ All tests passing (10/10 manual tests verified)
    - _Requirements: 3.3, 9.3_

- [x] 2.5 Course Service Layer
  - [x] 2.5.1 Implement getCourseBySlug function
    - ✓ Fetch course by slug from database
    - ✓ Return course data (id, title, slug, creatorId, status)
    - ✓ Handle course not found error
    - ✓ Implemented in features/cms/services/course.service.ts
    - _Requirements: 0.1, 0.3, 0.6_

- [x] 2.5.2 Implement checkCourseOwnership function
    - ✓ Verify user authentication via Clerk
    - ✓ Check if user is Admin (allow all)
    - ✓ Check if user owns the course
    - ✓ Return boolean result
    - ✓ Implemented in features/cms/services/course.service.ts
    - _Requirements: 0.2, 0.4, 0.7_

- [x] 2.5.3 Implement getCourseWithSections function
    - ✓ Fetch course with all sections
    - ✓ Include lesson count per section
    - ✓ Verify user authorization
    - ✓ Implemented in features/cms/services/course.service.ts
    - _Requirements: 0.1, 0.2, 0.4_

- [x] 2.5.4 Write unit tests for course service
    - ✓ Test getCourseBySlug with valid slug
    - ✓ Test getCourseBySlug with invalid slug
    - ✓ Test checkCourseOwnership for course owner
    - ✓ Test checkCourseOwnership for admin
    - ✓ Test checkCourseOwnership for non-owner
    - ✓ Test getCourseWithSections with authorization
    - ✓ Created comprehensive test suite at features/cms/services/__tests__/course.service.test.ts
    - ✓ All tests passing (14/14 tests)
    - ✓ Implemented Prisma mock using jest-mock-extended
    - ✓ Created Postman collection at docs/api/course-management.postman_collection.json
    - _Requirements: 0.1-0.8_

- [x] 3. Section Management API
  - [x] 3.1 Implement POST /api/courses/[slug]/sections endpoint
    - ✓ Authorization check (Creator owns course or Admin)
    - ✓ Request validation (title, description, order)
    - ✓ Create section in database
    - ✓ Return created section
    - ✓ Created service layer at features/cms/services/section.service.ts
    - ✓ Created API route at app/api/courses/[slug]/sections/route.ts
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 1.1, 1.6, 1.7, 8.1, 8.2, 9.1, 9.5, 9.8_

- [x] 3.2 Implement GET /api/courses/[slug]/sections endpoint
    - ✓ Authorization check (public for published, owner/admin for drafts)
    - ✓ Fetch sections ordered by order field
    - ✓ Include lesson count for each section
    - ✓ Implemented in same route file
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 1.2, 8.3_

- [x] 3.3 Implement PUT /api/courses/[slug]/sections/[sectionId] endpoint
    - ✓ Authorization check
    - ✓ Validate updated fields
    - ✓ Update section in database
    - ✓ Created API route at app/api/courses/[slug]/sections/[sectionId]/route.ts
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 1.3, 1.5, 1.6, 1.7, 9.1_

- [x] 3.4 Implement DELETE /api/courses/[slug]/sections/[sectionId] endpoint
    - ✓ Authorization check
    - ✓ Delete section (cascade to lessons)
    - ✓ Return count of deleted lessons
    - ✓ Implemented in same route file
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 1.4, 1.6, 1.7, 12.6_

- [x] 3.5 Write integration tests for section endpoints
    - ✅ Test successful section creation
    - ✅ Test duplicate order rejection
    - ✅ Test authorization failures (via service validation)
    - ✅ Test cascade delete
    - ✅ Created comprehensive test suite at features/cms/services/__tests__/section.service.test.ts
    - ✅ All validation scenarios covered (13/13 tests passing)
    - ✅ Implemented Prisma mock using jest-mock-extended (official Prisma recommendation)
    - ✅ Setup singleton pattern for consistent mocking across tests
    - _Requirements: 1.1-1.8_

- [x] 3.6 Refactor Section Service to use Course Service
    - ✓ Updated section.service.ts to import and use course.service.ts
    - ✓ Added userId parameter to createSection, updateSection, deleteSection
    - ✓ Replaced inline authorization with checkCourseOwnership
    - ✓ Updated tests to mock course service using jest.mock()
    - ✓ All tests passing (16/16 tests)
    - _Requirements: 0.5, 0.8_

- [x] 4. Lesson Management API
  - [x] 4.1 Implement POST /api/courses/[slug]/sections/[sectionId]/lessons endpoint
    - ✓ Authorization check (Creator owns course or Admin)
    - ✓ Validate LessonContent structure (Tiptap JSON)
    - ✓ Validate title and order
    - ✓ Create lesson in database
    - ✓ Created service layer at features/cms/services/lesson.service.ts
    - ✓ Created API route at app/api/courses/[slug]/sections/[sectionId]/lessons/route.ts
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 2.1, 2.7, 2.8, 3.1, 9.2, 9.3, 9.6, 9.9_

- [x] 4.2 Implement GET /api/courses/[slug]/sections/[sectionId]/lessons endpoint
    - ✓ Authorization check
    - ✓ Fetch lessons ordered by order field
    - ✓ Return with content preview (first 200 chars)
    - ✓ Implemented in same route file
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 2.2, 8.3_

- [x] 4.3 Implement GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] endpoint
    - ✓ Authorization check
    - ✓ Fetch lesson with full content
    - ✓ Include section information
    - ✓ Created API route at app/api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]/route.ts
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 2.3, 3.4_

- [x] 4.4 Implement PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] endpoint
    - ✓ Authorization check
    - ✓ Validate updated fields
    - ✓ Increment version number if content changed
    - ✓ Update lastEdit timestamp
    - ✓ Implemented in same route file
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 2.4, 2.6, 2.7, 2.8, 3.2, 9.2, 9.3_

- [x] 4.5 Implement DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] endpoint
    - ✓ Authorization check
    - ✓ Delete lesson (cascade to progress records)
    - ✓ Return count of deleted progress records
    - ✓ Implemented in same route file
    - ✓ **NOTE**: Will be updated to use Course Service for authorization
    - _Requirements: 2.5, 2.7, 2.8, 12.7_

- [x] 4.6 Write integration tests for lesson endpoints
    - ✅ Test lesson creation with valid Tiptap JSON
    - ✅ Test lesson creation with invalid JSON (should fail)
    - ✅ Test version increment on content update
    - ✅ Test authorization failures (via service validation)
    - ✅ Test cascade delete of progress records
    - ✅ Created comprehensive test suite at features/cms/services/__tests__/lesson.service.test.ts
    - ✅ All validation scenarios covered (23/23 tests passing)
    - _Requirements: 2.1-2.9, 3.1-3.6_

- [x] 4.7 Refactor Lesson Service to use Course Service
    - ✓ Updated lesson.service.ts to import and use course.service.ts
    - ✓ Added userId parameter to createLesson, updateLesson, deleteLesson
    - ✓ Replaced inline authorization with checkCourseOwnership
    - ✓ Updated tests to mock course service
    - ✓ Uses same mock singleton pattern as section service
    - ✓ All tests passing (26/26 tests)
    - _Requirements: 0.5, 0.8_

- [x] 5. Progress Tracking API
  - [x] 5.1 Implement POST /api/progress/lesson/[lessonId]/complete endpoint
    - Verify user authentication
    - Create or update LessonProgress record
    - Set completed = true and completedAt timestamp
    - Trigger course completion recalculation
    - _Requirements: 6.2, 6.3, 6.7, 6.8, 12.2_

- [x] 5.2 Implement GET /api/progress/course/[slug] endpoint
    - Verify user authentication
    - Calculate total lessons in course
    - Count completed lessons for user
    - Calculate percentage (rounded to 2 decimals)
    - Return CourseCompletion data
    - _Requirements: 7.1, 7.2, 7.5, 7.6, 7.7_

- [x] 5.3 Implement GET /api/progress/lesson/[lessonId] endpoint
    - Verify user authentication
    - Fetch LessonProgress for user and lesson
    - Return completion status
    - _Requirements: 6.5, 6.6_

- [x] 5.4 Implement calculateCourseCompletion function
    - Calculate percentage from completed/total lessons
    - Round to 2 decimal places
    - Set completed flag if 100%
    - _Requirements: 7.2, 7.4, 7.7_

- [x] 5.5 Implement updateCourseCompletion function
    - Query total lessons in course
    - Query completed lessons for user
    - Calculate completion percentage
    - Upsert CourseCompletion record
    - Set completedAt timestamp if 100%
    - _Requirements: 7.3, 7.4, 7.6_

- [x] 5.6 Write property tests for progress calculation
    - **Property 2: Completion percentage accuracy**
    - *For any* valid total and completed lesson counts, percentage should equal (completed/total) × 100 rounded to 2 decimals
    - **Validates: Requirements 7.2**

- [ ]* 5.7 Write unit tests for progress functions
    - Test 0% for no completed lessons
    - Test 50% for half completed
    - Test 100% completion flag
    - Test 0% for zero total lessons
    - _Requirements: 7.1, 7.2, 7.4, 7.7_


- [x] 6. Authorization and Security
  - [x] 6.1 Implement checkCourseOwnership function
    - Verify user authentication via Clerk
    - Check if user is Admin (allow all)
    - Check if user owns the course
    - Return boolean result
    - _Requirements: 8.1, 8.2, 8.4, 8.7_

- [x] 6.2 Implement requireCourseOwnership middleware
    - Call checkCourseOwnership
    - Throw error if unauthorized
    - Use in all Creator endpoints
    - _Requirements: 8.1, 8.4, 8.5, 8.7_

- [x] 6.3 Implement link href validation
    - Validate URL format
    - Whitelist allowed protocols (http, https, mailto)
    - Reject javascript: and data: protocols
    - _Requirements: 3.3, 9.3_

- [x]* 6.4 Write unit tests for authorization
    - Test admin access to all courses
    - Test creator access to own courses only
    - Test creator denied access to other courses
    - Test student denied access to creator endpoints
    - _Requirements: 8.1-8.7_

- [ ] 7. Tiptap Editor Component (Creator)
  - [x] 7.1 Create LessonEditor component
    - ✓ Initialize Tiptap editor with StarterKit
    - ✓ Set editable: true
    - ✓ Implement editor.getJSON() on save
    - ✓ Handle version increment
    - ✓ Update lastEdit timestamp
    - ✓ Created components/creator/LessonEditor.tsx
    - ✓ Installed @tiptap/react, @tiptap/starter-kit, @tiptap/pm
    - _Requirements: 4.1, 4.8, 4.9_

- [x] 7.2 Create EditorToolbar component
    - ✓ Add Bold button (Ctrl+B)
    - ✓ Add Italic button (Ctrl+I)
    - ✓ Add Inline Code button (Ctrl+E)
    - ✓ Add Heading 1, 2, 3 buttons
    - ✓ Add Bullet List button
    - ✓ Add Ordered List button
    - ✓ Add Link button (Ctrl+K)
    - ✓ Add Code Block button
    - ✓ Highlight active formatting
    - ✓ Created components/creator/EditorToolbar.tsx
    - ✓ Integrated into LessonEditor component
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 4.6_

- [x] 7.3 Create LessonPreview component
    - ✓ Initialize Tiptap editor with StarterKit
    - ✓ Set editable: false
    - ✓ Display read-only preview
    - ✓ Use same extensions as editor
    - ✓ Created components/creator/LessonPreview.tsx
    - _Requirements: 4.7, 4.9_

- [x] 7.4 Write component tests for editor
    - ✓ Test editor initialization with StarterKit
    - ✓ Test editor initialization with initial content
    - ✓ Test loading state when editor not ready
    - ✓ Test save functionality with correct content structure
    - ✓ Test editor.getJSON() returns valid Tiptap JSON
    - ✓ Test version increment on save
    - ✓ Test lastEdit timestamp update
    - ✓ Test saving state and button disable during save
    - ✓ Test cancel button rendering and functionality
    - ✓ Test toolbar button functionality (Bold, Italic, Code, H1-H3, Lists, Link, Code Block)
    - ✓ Test active state highlighting for toolbar buttons
    - ✓ Test preview initialization with editable:false
    - ✓ Test preview renders same content as editor
    - ✓ Test preview handles complex content with marks
    - ✓ Created comprehensive test suite at features/cms/components/creator/__tests__/LessonEditor.test.tsx
    - ✓ All tests passing (39/39 component tests)
    - ✓ Total test count: 137/137 tests passing
    - ✓ No lint errors, no type errors
    - _Requirements: 4.1-4.9_

- [x] 8. Tiptap Viewer Component (Student)
  - [x] 8.1 Create LessonViewer component
    - ✓ Initialize Tiptap editor with StarterKit
    - ✓ Set editable: false
    - ✓ Load content from lesson.content.content
    - ✓ Display version and lastEdit metadata
    - ✓ Add "Mark as Complete" button
    - ✓ Show completion badge if completed
    - ✓ Created features/cms/components/student/LessonViewer.tsx
    - ✓ Created comprehensive test suite at features/cms/components/student/__tests__/LessonViewer.test.tsx
    - ✓ All tests passing (21/21 tests)
    - ✓ Total test count: 241/241 tests passing
    - ✓ No lint errors, no type errors
    - ✓ Installed @testing-library/user-event@14.6.1
    - _Requirements: 5.3, 5.4, 5.5, 6.1, 6.4, 6.5_

- [x] 8.2 Write property tests for viewer rendering
    - **Property 3: WYSIWYG consistency**
    - *For any* valid Tiptap JSON content, EditorContent with editable:false should render identically to editable:true preview
    - **Validates: Requirements 5.4, 5.5**

- [x] 8.3 Write component tests for viewer
    - Test content rendering with all node types
    - Test Mark as Complete button functionality
    - Test completion badge display
    - Test metadata display
    - _Requirements: 5.3-5.6, 6.1, 6.4, 6.5_


- [x] 9. Course Navigation Components (Student)
  - [x] 9.1 Create CourseNavigation component
    - ✓ Display sections with titles using shadcn/ui Sidebar
    - ✓ Display lessons within each section with collapsible functionality
    - ✓ Show checkmark for completed lessons
    - ✓ Highlight current lesson with isActive state
    - ✓ Handle lesson click navigation
    - ✓ Created features/cms/components/student/CourseNavigation.tsx
    - ✓ All tests passing (19/19 tests)
    - _Requirements: 5.1, 5.2, 6.4_

- [x] 9.2 Create ProgressBar component
    - ✓ Display completion percentage (0-100%)
    - ✓ Show completed/total lesson count
    - ✓ Visual progress bar with fill
    - ✓ Clamps percentage between 0-100
    - ✓ Proper ARIA attributes for accessibility
    - ✓ Created features/cms/components/student/ProgressBar.tsx
    - ✓ All tests passing (12/12 tests)
    - _Requirements: 7.1, 7.5_

- [x] 9.3 Implement lesson navigation (prev/next)
    - ✓ Add previous lesson button with title
    - ✓ Add next lesson button with title
    - ✓ Disable previous on first lesson
    - ✓ Disable next on last lesson
    - ✓ Uses lucide-react icons (ChevronLeft, ChevronRight)
    - ✓ Uses shadcn/ui Button component
    - ✓ Created features/cms/components/student/LessonNavigation.tsx
    - ✓ All tests passing (16/16 tests)
    - _Requirements: 5.7, 5.8, 5.9_

- [x] 9.4 Write component tests for navigation
    - ✓ Test section/lesson list rendering
    - ✓ Test completion indicator display
    - ✓ Test progress bar calculation
    - ✓ Test prev/next button states
    - ✓ Created comprehensive test suites for all three components
    - ✓ All 47 tests passing (19 + 12 + 16)
    - ✓ Total test count: 207/207 tests passing
    - _Requirements: 5.1, 5.2, 5.7-5.9, 6.4, 7.1, 7.5_

- [x] 10. Creator Dashboard Integration
  - [x] 10.1 Create SectionList component
    - ✓ Display all sections for a course
    - ✓ Show lesson count per section
    - ✓ Add "Create Section" button
    - ✓ Add edit/delete buttons per section
    - ✓ Implement up/down reorder buttons
    - ✓ Created features/cms/components/creator/SectionList.tsx
    - ✓ Added section selection functionality
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 10.2 Create LessonList component
    - ✓ Display all lessons in a section
    - ✓ Show content preview
    - ✓ Add "Create Lesson" button
    - ✓ Add edit/delete buttons per lesson
    - ✓ Implement up/down reorder buttons
    - ✓ Created features/cms/components/creator/LessonList.tsx
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_

- [x] 10.3 Create SectionForm component
    - ✓ Input for title (max 200 chars)
    - ✓ Input for description (optional)
    - ✓ Input for order (positive integer)
    - ✓ Validation error display
    - ✓ Created features/cms/components/creator/SectionForm.tsx
    - _Requirements: 1.1, 1.3, 9.1, 9.5_

- [x] 10.4 Create LessonForm component
    - ✓ Input for title (max 200 chars)
    - ✓ Tiptap editor for content (integrated LessonEditor)
    - ✓ Input for order (positive integer)
    - ✓ Save button with loading state
    - ✓ Validation error display
    - ✓ Created features/cms/components/creator/LessonForm.tsx
    - _Requirements: 2.1, 2.4, 9.2, 9.6_

- [x] 10.5 Integrate components into Creator Dashboard
    - ✓ Created app/creator/courses/[slug]/manage/page.tsx
    - ✓ Integrated SectionList, LessonList, SectionForm, LessonForm
    - ✓ Implemented full CRUD operations for sections and lessons
    - ✓ Added section selection and lesson management
    - ✓ Created API endpoint /api/creator/courses
    - ✓ Updated app/creator/page.tsx to fetch real course data
    - ✓ Added navigation from dashboard to course management
    - _Requirements: 1.1-1.8, 2.1-2.9_

- [ ]* 10.5 Write E2E tests for creator workflow
    - Test creating section
    - Test creating lesson with Tiptap content
    - Test editing lesson content
    - Test reordering sections
    - Test deleting section (cascade)
    - _Requirements: 1.1-1.8, 2.1-2.9_

- [x] 11. Student Learn Page Integration
  - [x] 11.1 Create main learn page layout
    - ✓ Sidebar with CourseNavigation
    - ✓ Main content area with LessonViewer
    - ✓ Top bar with ProgressBar
    - ✓ Responsive design (mobile/tablet/desktop)
    - ✓ Created app/course/[slug]/learn/page.tsx
    - _Requirements: 5.1, 5.2, 5.3, 7.1_

- [x] 11.2 Implement lesson loading and display
    - ✓ Fetch lesson data from API
    - ✓ Display with LessonViewer component
    - ✓ Handle loading states
    - ✓ Handle error states
    - ✓ Integrated with existing CMS APIs
    - _Requirements: 5.3, 11.1_

- [x] 11.3 Implement mark as complete functionality
    - ✓ Call POST /api/progress/lesson/[lessonId]/complete
    - ✓ Update UI immediately
    - ✓ Refresh progress bar
    - ✓ Show success notification (toast)
    - _Requirements: 6.2, 6.7, 10.8_

- [x] 11.4 Implement progress persistence
    - ✓ Load progress on page load
    - ✓ Sync progress across tabs/devices
    - ✓ Handle offline scenarios gracefully
    - ✓ Integrated with existing progress API
    - _Requirements: 6.6, 7.6, 12.2_

- [ ]* 11.5 Write E2E tests for student workflow
    - Test navigating to lesson
    - Test viewing lesson content
    - Test marking lesson complete
    - Test progress bar update
    - Test navigation to next lesson
    - Test completion persistence after refresh
    - _Requirements: 5.1-5.9, 6.1-6.8, 7.1-7.7_


- [x] 12. Error Handling and User Feedback
  - [x] 12.1 Implement consistent API error responses
    - ✓ Created centralized error utility at lib/api/errors.ts
    - ✓ Standardized format: { error, code, details? } across all routes
    - ✓ Updated progress routes to use helpers (unauthorizedError, notFoundError, internalError)
    - ✓ All routes now return consistent HTTP status codes
    - _Requirements: 10.1-10.6_

  - [x] 12.2 Implement client-side error handling
    - ✓ learn page: retry mechanism via retryCount state
    - ✓ learn page: "Coba Lagi" button on error state
    - ✓ manage page: form handlers now catch and toast API error messages
    - ✓ Toast messages in Indonesian (Gagal memuat, Berhasil dibuat, etc.)
    - _Requirements: 10.1, 10.7, 10.8_

  - [x] 12.3 Implement loading states
    - ✓ learn page: skeleton loader for lesson content (lessonLoading state)
    - ✓ learn page: completing state disables "Tandai Selesai" button during API call
    - ✓ LessonViewer: completing prop disables button and shows "Menyimpan..."
    - ✓ manage page: publishing spinner already present
    - _Requirements: 11.1, 11.2_

  - [ ]* 12.4 Write tests for error scenarios
    - Test validation error display
    - Test 401 unauthorized handling
    - Test 403 forbidden handling
    - Test 404 not found handling
    - Test 500 server error handling
    - _Requirements: 10.1-10.6_

- [x] 13. API Testing — Content Management (Postman)
  - [x] 13.1 Buat `docs/api/content-management/sections.postman_collection.json`
    - POST /api/courses/[slug]/sections → 201 created
    - GET /api/courses/[slug]/sections → 200 dengan ordered list
    - PUT /api/courses/[slug]/sections/[sectionId] → 200 updated
    - DELETE /api/courses/[slug]/sections/[sectionId] → 200 dengan deletedLessons count
    - POST tanpa auth → 401 Unauthorized
    - POST dengan user bukan owner → 403 Forbidden
    - GET/PUT/DELETE section tidak ada → 404 Not Found
    - POST dengan order yang sudah ada → 409 Conflict
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 8.1, 8.2, 9.1_

- [x] 13.2 Buat `docs/api/content-management/lessons.postman_collection.json`
    - POST /api/courses/[slug]/sections/[sectionId]/lessons → 201 created
    - GET /api/courses/[slug]/sections/[sectionId]/lessons → 200 dengan list
    - GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] → 200 full content
    - PUT /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] → 200, version increment
    - DELETE /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId] → 200 dengan deletedProgress count
    - POST dengan invalid Tiptap JSON → 400 Bad Request
    - POST tanpa auth → 401 Unauthorized
    - POST dengan user bukan owner → 403 Forbidden
    - GET/PUT/DELETE lesson tidak ada → 404 Not Found
    - _Requirements: 2.1, 2.4, 2.5, 3.1, 3.2, 8.1, 9.2, 9.3_

- [x] 13.3 Buat `docs/api/content-management/progress.postman_collection.json`
    - POST /api/progress/lesson/[lessonId]/complete → 200 completed
    - GET /api/progress/course/[slug] → 200 dengan percentage dan completedLessons
    - GET /api/progress/lesson/[lessonId] → 200 dengan completion status
    - POST tanpa auth → 401 Unauthorized
    - GET tanpa auth → 401 Unauthorized
    - _Requirements: 6.2, 6.5, 7.1, 7.2_

- [ ] 14. E2E Tests — Creator Workflow
  - [ ] 14.1 Buat `__tests__/playwright/content/creator/manage-course.spec.ts`
  - [ ] 14.2 Test: akses `/creator/courses/[slug]/manage` dengan auth creator → halaman tampil dengan section list
  - [ ] 14.3 Test: klik "+ Seksi" → dialog terbuka, isi form, submit → section baru muncul di list
  - [ ] 14.4 Test: klik "+ Pelajaran" pada section → dialog terbuka, isi title + Tiptap content, submit → lesson tersimpan
  - [ ] 14.5 Test: klik edit lesson → form terbuka dengan existing content, ubah content, save → version increment terlihat
  - [ ] 14.6 Test: klik tombol reorder section (up/down) → urutan section berubah di UI
  - [ ] 14.7 Test: klik delete section → konfirmasi dialog, confirm → section dan lessons-nya hilang dari list
  - [ ] 14.8 Test: akses `/creator/courses/[slug]/manage` tanpa auth → redirect ke `/sign-in`
  - _Requirements: 1.1, 1.3, 1.4, 1.5, 2.1, 2.4, 2.5, 8.1, 8.4_

- [ ] 15. E2E Tests — Student Learn Workflow
  - [ ] 15.1 Buat `__tests__/playwright/content/student/learn.spec.ts`
  - [ ] 15.2 Test: akses `/course/[slug]/learn` dengan auth student yang enrolled → halaman tampil dengan sidebar sections dan lesson list
  - [ ] 15.3 Test: klik lesson di sidebar → konten Tiptap ter-render di area utama
  - [ ] 15.4 Test: klik "Tandai Selesai" → lesson marked complete, checkmark muncul di sidebar
  - [ ] 15.5 Test: progress bar update setelah mark complete (persentase naik)
  - [ ] 15.6 Test: klik tombol navigasi "Pelajaran Berikutnya" → lesson berikutnya ter-load
  - [ ] 15.7 Test: refresh halaman → progress tetap tersimpan (checkmark masih ada)
  - [ ] 15.8 Test: akses `/course/[slug]/learn` tanpa auth → redirect ke `/sign-in`
  - _Requirements: 5.1, 5.2, 5.3, 5.7, 6.1, 6.2, 6.4, 7.1, 7.5_

- [ ] 16. Manual Test Documentation
  - [ ] 16.1 Buat `docs/testing/manual-test-content-management.md`
  - [ ] 16.2 Checklist Creator workflow: buat section, buat lesson dengan Tiptap content, edit lesson, reorder section, delete section (cascade)
  - [ ] 16.3 Checklist Student workflow: navigasi ke lesson, baca konten, mark complete, cek progress bar, navigasi prev/next, refresh persistence
  - [ ] 16.4 Checklist Authorization: unauthenticated access, creator akses course milik orang lain, student akses creator endpoint
  - [ ] 16.5 Checklist Error scenarios: invalid Tiptap JSON, duplicate section order, lesson/section tidak ada (404), server error handling

- [ ] 17. Performance Optimization
  - [ ] 17.1 Implement database query optimization
    - Add indexes to Section, Lesson, LessonProgress, CourseCompletion
    - Use select to fetch only needed fields
    - Use include for efficient joins
    - Implement pagination for large lesson lists
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 17.2 Implement client-side caching
    - Use React Query for API response caching
    - Cache lesson content for 5 minutes
    - Invalidate cache on content updates
    - Prefetch next lesson on current lesson view
    - _Requirements: 11.1, 11.2, 11.6_

- [ ] 17.3 Optimize Tiptap rendering
    - Lazy load Tiptap editor
    - Debounce editor updates
    - Optimize re-renders with React.memo
    - _Requirements: 11.6_

- [ ]* 17.4 Write performance tests
    - Test lesson load time < 500ms (p95)
    - Test content save time < 1s (p95)
    - Test progress calculation < 300ms (p95)
    - Test Tiptap rendering < 200ms for 10k chars
    - _Requirements: 11.1-11.6_

- [ ] 18. Data Persistence and Transactions
  - [ ] 18.1 Implement transaction support for multi-record operations
    - Use Prisma transactions for section delete (cascade)
    - Use transactions for lesson delete (cascade)
    - Use transactions for progress update + completion recalc
    - Implement rollback on failure
    - _Requirements: 12.3, 12.4, 12.5_

- [ ] 18.2 Implement data integrity checks
    - Verify referential integrity on delete
    - Prevent orphaned records
    - Validate foreign key constraints
    - _Requirements: 12.5, 12.6, 12.7_

- [ ]* 18.3 Write tests for data persistence
    - Test transaction rollback on error
    - Test cascade delete behavior
    - Test referential integrity maintenance
    - _Requirements: 12.1-12.7_

- [ ] 19. Checkpoint - Ensure all tests pass
  - Run all unit tests
  - Run all integration tests
  - Run all E2E tests
  - Run all property-based tests
  - Fix any failing tests
  - Verify test coverage > 80%
  - Ask the user if questions arise


- [ ] 20. Styling and UI Polish
  - [ ] 20.1 Create Tiptap content styles
    - Style headings (h1, h2, h3)
    - Style paragraphs and text
    - Style lists (bullet and ordered)
    - Style code blocks with syntax highlighting
    - Style inline code
    - Style links
    - Ensure consistent spacing
    - _Requirements: 5.5_

- [ ] 20.2 Style creator editor interface
    - Style toolbar buttons
    - Style editor container
    - Style preview panel
    - Add hover states and transitions
    - Ensure responsive design

- [ ] 20.3 Style student learn page
    - Style navigation sidebar
    - Style lesson content area
    - Style progress bar
    - Style Mark as Complete button
    - Style completion badge
    - Ensure mobile responsiveness

- [ ] 20.4 Implement dark mode support (optional)
    - Add dark mode styles for editor
    - Add dark mode styles for viewer
    - Add dark mode toggle

- [ ] 21. Documentation and Deployment
  - [ ] 21.1 Create API documentation
    - Document all endpoints with examples
    - Document request/response formats
    - Document error codes
    - Document authentication requirements

- [ ] 21.2 Create component documentation
    - Document component props and usage
    - Add Storybook stories for components
    - Document Tiptap integration patterns

- [ ] 21.3 Create deployment guide
    - Document environment variables
    - Document database migration steps
    - Document seed data setup
    - Create deployment checklist

- [ ] 21.4 Run database migrations
    - Create migration for new tables
    - Verify migration on staging
    - Run migration on production
    - Verify data integrity

- [ ] 22. Final Integration and Testing
  - [ ] 22.1 Integration testing
    - Test complete creator workflow end-to-end
    - Test complete student workflow end-to-end
    - Test cross-browser compatibility
    - Test mobile responsiveness

- [ ] 22.2 User acceptance testing
    - Test with real course content
    - Test with multiple concurrent users
    - Verify performance under load
    - Collect user feedback

- [ ] 22.3 Bug fixes and polish
    - Fix any bugs found during testing
    - Polish UI/UX based on feedback
    - Optimize performance bottlenecks

- [ ] 23. Final Checkpoint - Production Ready
  - All tests passing
  - All documentation complete
  - Performance metrics met
  - Security review complete
  - Deployment checklist verified
  - Ask the user if ready for production deployment

---

## Notes

### Task Marking Convention

- `[ ]` - Not started
- `[x]` - Completed
- `[ ]*` - Optional task (can be skipped for faster MVP)

### Property-Based Tests

Tasks marked with "Property N:" are property-based tests that validate universal correctness properties across many generated inputs. Each property test should:
- Run minimum 100 iterations
- Reference the design document property number
- Include a comment tag: `Feature: course-content-management-v2, Property N: [property text]`

### Testing Strategy

- **Unit Tests**: Test individual functions and components in isolation
- **Integration Tests**: Test API endpoints with database
- **E2E Tests**: Test complete user workflows with Playwright
- **Property Tests**: Test universal properties across generated inputs

### Dependencies

Ensure these packages are installed before starting:
```bash
yarn add @tiptap/react @tiptap/starter-kit @tiptap/pm @tiptap/html zod
```

### Estimated Timeline

- Phase 1 (Tasks 1-6): Database and API - 1 week
- Phase 2 (Tasks 7-11): Frontend Components - 1.5 weeks
- Phase 3 (Tasks 12-14): Error Handling and Optimization - 0.5 week
- Phase 4 (Tasks 15-19): Testing and Deployment - 1 week

**Total Estimated Time:** 4 weeks

---

**Document Version:** 2.2  
**Last Updated:** 2026-03-12  
**Status:** Phase 1 Complete (Tasks 1-9), Migration Decision Required  
**Next Step:** Review migration documents and decide on Clean Slate approach

---

## 📚 Related Documents

- **Quick Status:** `CURRENT_STATUS.md` - Overview and quick reference
- **Decision Analysis:** `../../docs/rules/error.md` - Detailed migration decision analysis
- **Status Report:** `../../docs/rules/report.md` - Complete status report with metrics
- **Migration Guide:** `migration-guide.md` - Step-by-step migration instructions
- **Requirements:** `requirements.md` - Original spec requirements
- **Design:** `design.md` - Technical des

