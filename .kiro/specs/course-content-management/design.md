# Design Document: Course Content Management

**Feature Name:** Course Content Management  
**Sprint:** Sprint 2 - Content First  
**Created:** 2026-03-07  
**Status:** Draft

---

## Overview

The Course Content Management system provides a hierarchical content structure for online learning, enabling creators to organize educational material into courses, sections, and lessons, while allowing students to consume content systematically with progress tracking.

### Design Goals

1. **Simplicity**: Minimize complexity in data models and API design
2. **Performance**: Fast content loading and progress updates
3. **Reliability**: Ensure data consistency and prevent data loss
4. **Scalability**: Support growth to thousands of courses and millions of lessons
5. **Maintainability**: Clear separation of concerns and testable components

---

## Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Creator    │  │   Student    │  │    Admin     │ │
│  │  Dashboard   │  │  Learn Page  │  │   Console    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                     API Layer (Next.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Section    │  │    Lesson    │  │   Progress   │ │
│  │   Routes     │  │    Routes    │  │    Routes    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  Business Logic Layer                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Authorization│  │  Validation  │  │  Progress    │ │
│  │   Service    │  │   Service    │  │  Calculator  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Data Access Layer                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │    Prisma    │  │   Database   │  │    Cache     │ │
│  │    Client    │  │  Operations  │  │   (Future)   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Database (Supabase PostgreSQL)             │
│  Course → Section → Lesson → LessonProgress             │
│                  CourseCompletion                       │
└─────────────────────────────────────────────────────────┘
```

---

## Data Models

### Database Schema (Prisma)

```prisma
// Course model (existing, extended)
model Course {
  id          String   @id @default(uuid())
  title       String   @db.VarChar(100)
  description String   @db.Text
  thumbnail   String?  @db.VarChar(255)
  status      CourseStatus @default(DRAFT)
  students    Int      @default(0)
  lessons     Int      @default(0)
  duration    String   @default("0 jam")
  rating      Float    @default(0.0)
  category    String   @db.VarChar(50)
  creatorId   String   @db.VarChar(255)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  enrollments Enrollment[]
  sections    Section[]      // NEW: One-to-many with sections

  @@map("courses")
}

// Section model (NEW)
model Section {
  id          String   @id @default(uuid())
  courseId    String
  order       Int
  title       String   @db.VarChar(200)
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  course      Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons     Lesson[]

  @@unique([courseId, order])
  @@index([courseId, order])
  @@map("sections")
}

// Lesson model (NEW)
model Lesson {
  id          String   @id @default(uuid())
  sectionId   String
  order       Int
  title       String   @db.VarChar(200)
  content     Json     // { markdown: string, version: number, lastEdit: string }
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  section     Section   @relation(fields: [sectionId], references: [id], onDelete: Cascade)
  progress    LessonProgress[]

  @@unique([sectionId, order])
  @@index([sectionId, order])
  @@map("lessons")
}

// LessonProgress model (NEW)
model LessonProgress {
  id          String   @id @default(uuid())
  lessonId    String
  userId      String   @db.VarChar(255)
  completed   Boolean  @default(false)
  completedAt DateTime?
  createdAt   DateTime @default(now())

  lesson      Lesson   @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([lessonId, userId])
  @@index([userId])
  @@index([lessonId])
  @@map("lesson_progress")
}

// CourseCompletion model (NEW)
model CourseCompletion {
  id           String   @id @default(uuid())
  courseId     String
  userId       String   @db.VarChar(255)
  percentage   Float    @default(0)
  completed    Boolean  @default(false)
  completedAt  DateTime?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([courseId, userId])
  @@index([userId])
  @@index([courseId])
  @@map("course_completions")
}
```

### Content JSON Structure

```typescript
interface LessonContent {
  markdown: string    // Raw markdown text
  version: number     // Incremental version number
  lastEdit: string    // ISO 8601 timestamp
}

// Example
{
  "markdown": "# Introduction to HTML\n\nHTML stands for **HyperText Markup Language**...",
  "version": 3,
  "lastEdit": "2026-03-07T14:30:00Z"
}
```

---

## Components and Interfaces

### API Routes (Next.js App Router)

#### Section Management

```typescript
// app/api/courses/[slug]/sections/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
): Promise<Response>

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
): Promise<Response>

// app/api/courses/[slug]/sections/[sectionId]/route.ts
export async function PUT(
  request: Request,
  { params }: { params: { slug: string; sectionId: string } }
): Promise<Response>

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; sectionId: string } }
): Promise<Response>
```

#### Lesson Management

```typescript
// app/api/courses/[slug]/sections/[sectionId]/lessons/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string; sectionId: string } }
): Promise<Response>

export async function POST(
  request: Request,
  { params }: { params: { slug: string; sectionId: string } }
): Promise<Response>

// app/api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string; sectionId: string; lessonId: string } }
): Promise<Response>

export async function PUT(
  request: Request,
  { params }: { params: { slug: string; sectionId: string; lessonId: string } }
): Promise<Response>

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string; sectionId: string; lessonId: string } }
): Promise<Response>
```

#### Progress Tracking

```typescript
// app/api/progress/lesson/[lessonId]/complete/route.ts
export async function POST(
  request: Request,
  { params }: { params: { lessonId: string } }
): Promise<Response>

// app/api/progress/course/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
): Promise<Response>

// app/api/progress/lesson/[lessonId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
): Promise<Response>
```

### Request/Response Schemas

#### Create Section Request
```typescript
{
  title: string          // Required, max 200 chars
  description?: string   // Optional
  order: number          // Required, positive integer
}
```

#### Create Lesson Request
```typescript
{
  title: string          // Required, max 200 chars
  content: {
    markdown: string     // Required
    version: number      // Required, starts at 1
    lastEdit: string     // Required, ISO 8601
  }
  order: number          // Required, positive integer
}
```

#### Mark Lesson Complete Request
```typescript
{
  userId: string         // From authentication
}
```

#### Course Progress Response
```typescript
{
  courseId: string
  userId: string
  percentage: number     // 0-100
  completed: boolean
  completedLessons: number
  totalLessons: number
  completedAt?: string   // ISO 8601, if completed
}
```

---

## Business Logic

### Authorization Service

```typescript
interface AuthorizationService {
  // Check if user can modify course content
  canModifyCourse(userId: string, courseId: string): Promise<boolean>
  
  // Check if user can view course content
  canViewCourse(userId: string, courseId: string): Promise<boolean>
  
  // Get user role
  getUserRole(userId: string): Promise<'creator' | 'admin' | 'student'>
}

// Implementation logic:
// - Creator: can modify own courses only
// - Admin: can modify all courses
// - Student: can view published courses only
```

### Progress Calculator

```typescript
interface ProgressCalculator {
  // Calculate course completion percentage
  calculateCourseCompletion(
    courseId: string,
    userId: string
  ): Promise<number>
  
  // Get completed lesson count
  getCompletedLessonCount(
    courseId: string,
    userId: string
  ): Promise<number>
  
  // Get total lesson count
  getTotalLessonCount(courseId: string): Promise<number>
  
  // Check if course is fully completed
  isCourseCompleted(
    courseId: string,
    userId: string
  ): Promise<boolean>
}

// Calculation formula:
// percentage = (completedLessons / totalLessons) * 100
// completed = percentage === 100
```

### Validation Service

```typescript
interface ValidationService {
  // Validate section data
  validateSection(data: {
    title: string
    description?: string
    order: number
  }): ValidationResult
  
  // Validate lesson data
  validateLesson(data: {
    title: string
    content: LessonContent
    order: number
  }): ValidationResult
  
  // Validate content structure
  validateContent(content: unknown): content is LessonContent
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Section Ordering Uniqueness

*For any* course, all sections within that course must have unique order values, and no two sections can share the same order number.

**Validates: Requirements 1.5, 9.8**

### Property 2: Lesson Ordering Uniqueness

*For any* section, all lessons within that section must have unique order values, and no two lessons can share the same order number.

**Validates: Requirements 2.6, 9.9**

### Property 3: Section Ordering Sequence

*For any* course with N sections, when sections are sorted by order field, the order values must form a sequence from 1 to N without gaps.

**Validates: Requirements 1.2, 1.5**

### Property 4: Lesson Ordering Sequence

*For any* section with N lessons, when lessons are sorted by order field, the order values must form a sequence from 1 to N without gaps.

**Validates: Requirements 2.2, 2.6**

### Property 5: Content JSON Structure Validity

*For any* lesson content, the JSON structure must contain exactly three fields: markdown (string), version (positive integer), and lastEdit (ISO 8601 string).

**Validates: Requirements 3.1, 3.3, 9.3**

### Property 6: Content Version Monotonicity

*For any* lesson, when content is updated, the new version number must be strictly greater than the previous version number.

**Validates: Requirements 3.2**

### Property 7: Progress Uniqueness

*For any* combination of lesson and user, there must exist at most one progress record in the database.

**Validates: Requirements 6.3, 6.6**

### Property 8: Completion Percentage Bounds

*For any* course completion record, the percentage value must be between 0 and 100 inclusive.

**Validates: Requirements 7.1, 7.2**

### Property 9: Completion Percentage Accuracy

*For any* course and user, the completion percentage must equal (completed lessons / total lessons) × 100, rounded to two decimal places.

**Validates: Requirements 7.2, 7.3**

### Property 10: Completion Status Consistency

*For any* course completion record, if percentage equals 100, then completed must be true, and if percentage is less than 100, then completed must be false.

**Validates: Requirements 7.4**

### Property 11: Cascade Delete Integrity (Sections)

*For any* section that is deleted, all lessons associated with that section must also be deleted from the database.

**Validates: Requirements 1.4, 12.6**

### Property 12: Cascade Delete Integrity (Lessons)

*For any* lesson that is deleted, all progress records associated with that lesson must also be deleted from the database.

**Validates: Requirements 2.5, 12.7**

### Property 13: Authorization Consistency (Creator)

*For any* creator user and course, if the course creatorId matches the user's ID, then the user must be authorized for all CRUD operations on that course's sections and lessons.

**Validates: Requirements 8.1**

### Property 14: Authorization Consistency (Admin)

*For any* admin user and any course, the user must be authorized for all CRUD operations on that course's sections and lessons regardless of course ownership.

**Validates: Requirements 8.2**

### Property 15: Authorization Denial (Student)

*For any* student user and any course, the user must be denied authorization for all create, update, and delete operations on that course's sections and lessons.

**Validates: Requirements 8.3, 8.6**

### Property 16: Progress Persistence

*For any* lesson marked as complete by a user, if the user logs out and logs back in, the lesson must still be marked as complete.

**Validates: Requirements 6.6, 12.1**

### Property 17: Completion Recalculation Trigger

*For any* lesson progress update (mark complete or mark incomplete), the course completion percentage for that user must be recalculated immediately.

**Validates: Requirements 6.7, 7.3**

### Property 18: Title Length Validation

*For any* section or lesson, the title length must be greater than 0 and less than or equal to 200 characters.

**Validates: Requirements 9.1, 9.2**

### Property 19: Order Value Positivity

*For any* section or lesson, the order value must be a positive integer greater than 0.

**Validates: Requirements 9.4**

### Property 20: Referential Integrity (Section to Course)

*For any* section, the referenced courseId must exist in the courses table.

**Validates: Requirements 9.5, 12.5**

### Property 21: Referential Integrity (Lesson to Section)

*For any* lesson, the referenced sectionId must exist in the sections table.

**Validates: Requirements 9.6, 12.5**

---

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, any>
  }
}
```

### Error Codes

| HTTP Status | Error Code | Description |
|-------------|------------|-------------|
| 400 | VALIDATION_ERROR | Request data failed validation |
| 401 | AUTHENTICATION_REQUIRED | User not authenticated |
| 403 | AUTHORIZATION_DENIED | User lacks permission |
| 404 | RESOURCE_NOT_FOUND | Requested resource doesn't exist |
| 409 | CONFLICT | Operation conflicts with current state |
| 500 | INTERNAL_SERVER_ERROR | Unexpected server error |

### Error Handling Strategy

1. **Validation Errors**: Return 400 with specific field errors
2. **Authentication Errors**: Return 401 and redirect to login
3. **Authorization Errors**: Return 403 with permission message
4. **Not Found Errors**: Return 404 with resource type
5. **Database Errors**: Log details, return 500 with generic message
6. **Transaction Failures**: Rollback and return appropriate error

---

## Testing Strategy

### Unit Tests

**Coverage:**
- Progress calculation functions
- Authorization logic
- Validation functions
- Content JSON parsing
- Order management utilities

**Example Test Cases:**
```typescript
describe('ProgressCalculator', () => {
  test('calculates 0% for no completed lessons', async () => {
    const percentage = await calculator.calculateCourseCompletion(courseId, userId)
    expect(percentage).toBe(0)
  })
  
  test('calculates 50% for half completed lessons', async () => {
    // Setup: 10 lessons, 5 completed
    const percentage = await calculator.calculateCourseCompletion(courseId, userId)
    expect(percentage).toBe(50)
  })
  
  test('calculates 100% for all completed lessons', async () => {
    // Setup: 10 lessons, 10 completed
    const percentage = await calculator.calculateCourseCompletion(courseId, userId)
    expect(percentage).toBe(100)
  })
})
```

### Property-Based Tests

Each correctness property must be implemented as a property-based test with minimum 100 iterations.

**Example:**
```typescript
import { fc } from 'fast-check'

describe('Property 1: Section Ordering Uniqueness', () => {
  test('no two sections in a course have the same order', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.record({
          title: fc.string({ minLength: 1, maxLength: 200 }),
          order: fc.integer({ min: 1, max: 100 })
        })),
        async (sections) => {
          // Create course and sections
          const course = await createTestCourse()
          await Promise.all(sections.map(s => 
            createSection(course.id, s.title, s.order)
          ))
          
          // Verify uniqueness
          const dbSections = await getSections(course.id)
          const orders = dbSections.map(s => s.order)
          const uniqueOrders = new Set(orders)
          
          expect(uniqueOrders.size).toBe(orders.length)
        }
      ),
      { numRuns: 100 }
    )
  })
})
```

**Tag Format:** `Feature: course-content-management, Property 1: Section Ordering Uniqueness`

### Integration Tests

**Scenarios:**
- Create section → verify in database
- Update lesson → verify version increment
- Delete section → verify cascade delete
- Mark lesson complete → verify progress recalculation
- Reorder sections → verify order integrity

### E2E Tests (Playwright)

**Creator Workflow:**
```typescript
test('creator can create and manage course content', async ({ page }) => {
  await page.goto('/creator')
  await page.click('text=Edit Course')
  
  // Create section
  await page.click('text=Add Section')
  await page.fill('[name="title"]', 'Introduction')
  await page.click('text=Save')
  await expect(page.locator('text=Introduction')).toBeVisible()
  
  // Create lesson
  await page.click('text=Add Lesson')
  await page.fill('[name="title"]', 'What is HTML?')
  await page.fill('.tiptap-editor', '# What is HTML?\n\nHTML is...')
  await page.click('text=Save')
  await expect(page.locator('text=What is HTML?')).toBeVisible()
})
```

**Student Workflow:**
```typescript
test('student can learn and track progress', async ({ page }) => {
  await page.goto('/course/html-basics/learn')
  
  // View section
  await page.click('text=Introduction')
  await expect(page.locator('text=What is HTML?')).toBeVisible()
  
  // Read lesson
  await page.click('text=What is HTML?')
  await expect(page.locator('h1:has-text("What is HTML?")')).toBeVisible()
  
  // Mark complete
  await page.click('text=Mark as Complete')
  await expect(page.locator('text=✓')).toBeVisible()
  
  // Verify progress
  await expect(page.locator('text=10%')).toBeVisible()
})
```

---

## Performance Considerations

### Database Indexing

```sql
-- Section indexes
CREATE INDEX idx_sections_course_order ON sections(course_id, order);

-- Lesson indexes
CREATE INDEX idx_lessons_section_order ON lessons(section_id, order);

-- Progress indexes
CREATE INDEX idx_progress_user ON lesson_progress(user_id);
CREATE INDEX idx_progress_lesson ON lesson_progress(lesson_id);

-- Completion indexes
CREATE INDEX idx_completion_user ON course_completions(user_id);
CREATE INDEX idx_completion_course ON course_completions(course_id);
```

### Query Optimization

1. **Eager Loading**: Use Prisma `include` to fetch related data in single query
2. **Pagination**: Implement cursor-based pagination for large lesson lists
3. **Caching**: Cache course structure (sections + lessons) for 5 minutes
4. **Batch Operations**: Use Prisma transactions for multiple updates

### Performance Targets

- Lesson content load: < 500ms (p95)
- Progress update: < 300ms (p95)
- Section list load: < 200ms (p95)
- Course completion calculation: < 300ms (p95)

---

## Security Considerations

### Input Sanitization

- Sanitize markdown content to prevent XSS attacks
- Validate all user inputs against schema
- Use parameterized queries (Prisma handles this)

### Authentication

- All API routes require Clerk authentication
- Extract userId from Clerk session
- Validate session on every request

### Authorization

- Check user role before allowing operations
- Verify course ownership for creators
- Allow admin access to all resources

### Data Protection

- Store content in database with encryption at rest (Supabase default)
- Use HTTPS for all API communication
- Implement rate limiting on API endpoints (future)

---

## Future Enhancements

### Sprint 3+

1. **Quiz Integration**: Attach quizzes to lessons
2. **Video Content**: Support video URLs and embeds
3. **Image Upload**: Allow images in lesson content
4. **Drag-Drop Reordering**: Replace up/down buttons
5. **Auto-Save**: Save content every 30 seconds
6. **Version History**: View and restore previous versions
7. **Collaborative Editing**: Multiple creators editing simultaneously
8. **GitHub Sync**: Backup content to GitHub repository

---

## Design Decisions

### Why JSON for Content Storage?

**Decision**: Store lesson content as JSON with metadata

**Rationale**:
- Enables versioning without additional tables
- Flexible for future content types
- Single query to fetch content with metadata
- Easy to extend with new fields

**Trade-offs**:
- Cannot query markdown text directly
- Slightly larger storage size
- Requires JSON parsing in application

### Why Integer Order Instead of Float?

**Decision**: Use integer order field with up/down buttons

**Rationale**:
- Simpler to understand and implement
- No floating-point precision issues
- Sufficient for Sprint 2 MVP
- Can migrate to float later if needed

**Trade-offs**:
- Reordering requires updating multiple records
- Less flexible than fractional indexing
- More database writes for reorder operations

### Why Manual Progress Tracking?

**Decision**: Require students to click "Mark as Complete"

**Rationale**:
- More reliable than automatic tracking
- Clear user intent
- No false positives
- Simpler implementation

**Trade-offs**:
- Requires user action
- May forget to mark complete
- No automatic progress detection

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-07  
**Next Review:** After requirements approval
