# Course Feature - Maguru E-Learning Platform

## Overview

Course feature merupakan modul utama untuk manajemen kursus di platform Maguru. Implementasi mengikuti arsitektur 4-layer Maguru: Database → Service → API → Adapter.

## Arsitektur

```
Database Layer (Prisma Schema)
    ↓
Service Layer (Business Logic)
    ↓
API Layer (Next.js Routes)
    ↓
Adapter Layer (Client Interface)
```

## Struktur Folder

```
/features/course/
├── types/
│   └── index.ts                    # TypeScript interfaces & Zod schemas
├── services/
│   └── courseService.ts            # Business logic layer
├── adapters/
│   └── courseAdapter.ts            # Data access layer (client-side)
├── course-manage/
│   ├── components/                 # UI components
│   ├── lib/
│   │   └── courseUtils.ts          # Utility functions
│   └── adapter/                    # Course-specific adapters
└── docs/
    └── story-5/                    # Documentation
        ├── task-docs/              # Task specifications
        └── result-docs/            # Implementation results
```

## Database Schema

### Models

- **Course**: Metadata kursus (title, description, thumbnail, status, etc.)
- **Module**: Struktur modul dalam kursus
- **Lesson**: Pelajaran dalam modul
- **User**: Relasi dengan creator

### Relationships

```
User (1) ←→ (N) Course
Course (1) ←→ (N) Module
Module (1) ←→ (N) Lesson
```

## API Endpoints

### Public Endpoints (No Authentication Required)

- `GET /api/courses` - List semua kursus dengan pagination
- `GET /api/courses/[id]` - Detail kursus berdasarkan ID

### Protected Endpoints (Authentication Required - TSK-48)

- `POST /api/courses` - Membuat kursus baru
- `PUT /api/courses/[id]` - Update kursus
- `DELETE /api/courses/[id]` - Hapus kursus

## Usage Examples

### Service Layer

```typescript
import { CourseService } from '@/features/course/services/courseService'

const courseService = new CourseService()

// Create course
const course = await courseService.createCourse(courseData, creatorId)

// Get courses with pagination
const result = await courseService.getCourses(1, 10)
```

### Adapter Layer

```typescript
import { CourseAdapter } from '@/features/course/adapters/courseAdapter'

// Get courses
const response = await CourseAdapter.getCourses(1, 10)

// Create course
const response = await CourseAdapter.createCourse(courseData)
```

### Utility Functions

```typescript
import {
  getStatusColor,
  getStatusText,
  formatDuration,
} from '@/features/course/course-manage/lib/courseUtils'

const statusColor = getStatusColor(CourseStatus.DRAFT)
const statusText = getStatusText(CourseStatus.PUBLISHED)
const duration = formatDuration(120) // "2 jam"
```

## Data Types

### Course Metadata

```typescript
interface CourseMetadata {
  id: string
  title: string
  description: string
  thumbnail: string
  status: CourseStatus
  students: number
  lessons: number
  duration: string
  rating: number
  category: string
  createdAt: string
}
```

### Course Status

```typescript
enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
}
```

## Validation

Menggunakan Zod schemas untuk validasi:

- `CourseSchema` - Validasi data kursus
- `ModuleSchema` - Validasi data modul
- `LessonSchema` - Validasi data pelajaran

## Error Handling

### Error Categories

- **400 Bad Request** - Validation errors
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Authorization failed
- **404 Not Found** - Resource not found
- **500 Internal Server Error** - Server errors

### Error Response Format

```typescript
{
  success: false,
  error: string,
  details?: Array<{
    field: string,
    message: string
  }>
}
```

## Supabase Integration

### Thumbnail Storage

Menggunakan Supabase Storage untuk thumbnail images:

```typescript
import { getThumbnailUrl } from '@/features/course/course-manage/lib/courseUtils'

const thumbnailUrl = getThumbnailUrl('course-1/thumbnail.jpg')
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

## Testing

### Unit Tests

- Service layer tests
- Utility function tests
- Validation tests

### Integration Tests

- API endpoint tests
- Database integration tests
- Adapter tests

### E2E Tests

- Complete user flow tests
- Authentication integration tests

## Related Tasks

- **TSK-46**: UI Design untuk Course Management
- **TSK-47**: Backend CRUD Implementation ✅
- **TSK-48**: Authentication & Authorization Integration
- **TSK-49**: Testing Implementation
- **TSK-66**: Performance & E2E Testing

## Documentation

- [Task TSK-47](docs/story-5/task-tsk-47.md) - Original task specification
- [Result TSK-47](docs/story-5/result-docs/result-tsk-47.md) - Implementation results
- [Task TSK-48](docs/story-5/task-tsk-48.md) - Authentication integration
- [Task TSK-49](docs/story-5/task-tsk-49.md) - Testing implementation

## Development Notes

### Prerequisites

1. Database migration: `npx prisma migrate dev`
2. Environment variables setup
3. Supabase project configuration

### Next Steps

1. Implement authentication middleware (TSK-48)
2. Add comprehensive testing (TSK-49, TSK-66)
3. Implement file upload functionality
4. Add performance optimizations

### Known Issues

- Authentication placeholder perlu di-replace dengan real implementation
- File upload belum di-implement
- Rate limiting belum di-apply
- Caching layer belum di-implement

## Contributing

1. Follow arsitektur 4-layer Maguru
2. Use TypeScript untuk type safety
3. Implement proper error handling
4. Add tests untuk new features
5. Update documentation

## License

Part of Maguru E-Learning Platform
