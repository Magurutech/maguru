# CMS (Content Management System) Feature

This feature provides content management capabilities for the Maguru platform, including section and lesson management with Tiptap rich-text editor integration.

## Structure

```
features/cms/
├── services/           # Business logic layer
│   ├── section.service.ts
│   ├── authorization.service.ts
│   └── __tests__/
├── validation/         # Content validation
│   ├── tiptap.ts
│   └── tiptap.test.ts
└── types/             # TypeScript type definitions
    └── section.types.ts
```

## Services

### SectionService

Handles all section-related operations:

- `createSection(courseId, input)` - Create a new section
- `getSectionsByCourse(courseId)` - Get all sections for a course
- `getSectionById(sectionId)` - Get a single section
- `updateSection(sectionId, input)` - Update a section
- `deleteSection(sectionId)` - Delete a section (cascade to lessons)

### AuthorizationService

Handles authorization checks:

- `checkCourseOwnership(courseId)` - Check if user owns course
- `requireCourseOwnership(courseId)` - Require ownership or throw error
- `requireAuthentication()` - Require authentication or throw error

## API Endpoints

### Section Management

#### POST /api/courses/[slug]/sections

Create a new section within a course.

**Authorization:** Creator (owns course) or Admin

**Request Body:**
```json
{
  "title": "Introduction to HTML",
  "description": "Learn the basics of HTML",
  "order": 1
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "order": 1,
  "title": "Introduction to HTML",
  "description": "Learn the basics of HTML",
  "createdAt": "2026-03-08T10:00:00Z",
  "updatedAt": "2026-03-08T10:00:00Z"
}
```

**Error Responses:**
- `400 VALIDATION_ERROR` - Invalid input data
- `401 UNAUTHORIZED` - Not authenticated
- `403 FORBIDDEN` - Not course owner or admin
- `404 NOT_FOUND` - Course not found
- `409 CONFLICT` - Duplicate order value

---

#### GET /api/courses/[slug]/sections

List all sections in a course, ordered by order field.

**Authorization:** Public (for published courses), Creator/Admin (for drafts)

**Response (200 OK):**
```json
{
  "sections": [
    {
      "id": "uuid",
      "courseId": "uuid",
      "order": 1,
      "title": "Introduction to HTML",
      "description": "Learn the basics of HTML",
      "lessonCount": 5,
      "createdAt": "2026-03-08T10:00:00Z",
      "updatedAt": "2026-03-08T10:00:00Z"
    }
  ]
}
```

---

#### PUT /api/courses/[slug]/sections/[sectionId]

Update an existing section.

**Authorization:** Creator (owns course) or Admin

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "order": 2
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "courseId": "uuid",
  "order": 2,
  "title": "Updated Title",
  "description": "Updated description",
  "createdAt": "2026-03-08T10:00:00Z",
  "updatedAt": "2026-03-08T10:30:00Z"
}
```

---

#### DELETE /api/courses/[slug]/sections/[sectionId]

Delete a section and all its lessons (cascade).

**Authorization:** Creator (owns course) or Admin

**Response (200 OK):**
```json
{
  "message": "Section deleted successfully",
  "deletedLessons": 5
}
```

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "fieldName",
    "message": "Detailed error message"
  }
}
```

### Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Request validation failed |
| 401 | UNAUTHORIZED | User not authenticated |
| 403 | FORBIDDEN | User lacks permission |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate order value |
| 500 | INTERNAL_ERROR | Server error |

## Validation Rules

### Section

- **title**: Required, max 200 characters, cannot be empty
- **description**: Optional, any length
- **order**: Required, positive integer, unique within course

## Testing

Run tests with:

```bash
# Unit tests
yarn test features/cms/services/__tests__/section.service.test.ts

# All CMS tests
yarn test features/cms
```

## Requirements Traceability

This implementation satisfies the following requirements:

- **1.1-1.8**: Section Management
- **8.1-8.7**: Authorization and Access Control
- **9.1, 9.5, 9.8**: Data Validation
- **10.1-10.6**: Error Handling
- **12.5, 12.6**: Data Persistence and Integrity

## Usage Example

```typescript
import { sectionService } from '@/features/cms/services/section.service'

// Create a section
const section = await sectionService.createSection('course-id', {
  title: 'Introduction',
  description: 'Getting started',
  order: 1,
})

// Get all sections
const sections = await sectionService.getSectionsByCourse('course-id')

// Update a section
const updated = await sectionService.updateSection('section-id', {
  title: 'Updated Title',
})

// Delete a section
const result = await sectionService.deleteSection('section-id')
```
