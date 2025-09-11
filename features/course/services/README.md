# Course Services - Function Registry

This directory contains business logic services for the course feature following the Maguru 4-layer architecture.

## Available Functions

### courseService.ts
- `createCourse(data: CourseCreateData, creatorId: string)` - Create new course with validation and data processing
- `updateCourse(id: string, data: CourseUpdateData)` - Update existing course with validation
- `getCourseById(id: string)` - Retrieve course by ID with complete data
- `getCourses(page: number, limit: number, filters?: CourseFilters)` - Get paginated course list with filtering
- `deleteCourse(id: string)` - Soft delete course and related data
- `publishCourse(id: string)` - Change course status to published
- `unpublishCourse(id: string)` - Change course status to draft

### enrollmentService.ts
- `enrollUserInCourse(userId: string, courseId: string)` - Enroll user in course with validation
- `unenrollUserFromCourse(userId: string, courseId: string)` - Remove user enrollment
- `getUserEnrollments(userId: string)` - Get all courses user is enrolled in
- `getCourseEnrollments(courseId: string)` - Get all users enrolled in course
- `getEnrollmentStatus(userId: string, courseId: string)` - Check if user is enrolled
- `updateEnrollmentProgress(userId: string, courseId: string, progress: number)` - Update course completion progress

## Usage Examples

### CourseService
```typescript
import { CourseService } from './courseService'

const courseService = new CourseService()

// Create new course
const course = await courseService.createCourse({
  title: "React Fundamentals",
  description: "Learn React basics",
  thumbnail: "course-thumb.jpg"
}, creatorId)

// Get courses with pagination
const result = await courseService.getCourses(1, 10, {
  status: 'PUBLISHED'
})
```

### EnrollmentService
```typescript
import { EnrollmentService } from './enrollmentService'

const enrollmentService = new EnrollmentService()

// Enroll user in course
await enrollmentService.enrollUserInCourse(userId, courseId)

// Check enrollment status
const isEnrolled = await enrollmentService.getEnrollmentStatus(userId, courseId)
```

## Architecture Notes

- **Service Layer**: Business logic and data processing
- **Database Access**: Via Prisma ORM models
- **Error Handling**: Standardized error responses
- **Validation**: Input validation using Zod schemas
- **Testing**: Unit tests included for all service functions

## Dependencies

- `@prisma/client` - Database ORM
- `zod` - Runtime type validation
- Custom types from `../types/index.ts`

## Testing

Run service tests:
```bash
yarn test features/course/services
```

Individual service tests:
```bash
yarn test courseService.test.ts
yarn test enrollmentService.test.ts
```