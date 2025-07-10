# Task TSK-51: Implementasi Backend untuk Pendaftaran Kursus dengan Integrasi Clerk

## Daftar Isi

1. [Pendahuluan](mdc:#pendahuluan)
2. [Perbandingan dengan Referensi](mdc:#perbandingan-dengan-referensi)
3. [Batasan dan Penyederhanaan](mdc:#batasan-dan-penyederhanaan)
4. [Spesifikasi Teknis](mdc:#spesifikasi-teknis)
5. [Implementasi Teknis](mdc:#implementasi-teknis)
6. [Peningkatan UX](mdc:#peningkatan-ux)
7. [Test Plan](mdc:#test-plan)
8. [Pertanyaan untuk Diklarifikasi](mdc:#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

Task TSK-51 fokus pada implementasi backend untuk sistem pendaftaran kursus yang memungkinkan siswa (role "user") mendaftar ke kursus yang tersedia. Implementasi ini akan membangun di atas arsitektur course management yang sudah ada dengan menambahkan model Enrollment dan API endpoints untuk enrollment operations.

Backend ini akan terintegrasi dengan Clerk untuk authentication dan authorization, memastikan hanya user yang terautentikasi yang dapat mendaftar ke kursus, serta mencegah pendaftaran ganda melalui database constraints.

## Perbandingan dengan Referensi

| Aspek                | Referensi (Coursera, Udemy) | Project Maguru                                  |
| -------------------- | --------------------------- | ----------------------------------------------- |
| Authentication       | OAuth, JWT tokens           | Clerk authentication                            |
| Enrollment Model     | User-Course many-to-many    | User-Course many-to-many dengan timestamp       |
| Duplicate Prevention | Database unique constraints | Database unique constraints + application logic |
| Course Access        | Role-based access control   | Simple enrollment-based access                  |
| Data Validation      | Server-side validation      | Zod schema validation                           |

## Batasan dan Penyederhanaan Implementasi

### 1. **Enrollment Scope**:

- Hanya mendaftar ke kursus, tidak ada pembatalan enrollment
- Tidak ada trial period atau expiration date
- Tidak ada course prerequisites atau dependencies

### 2. **Database Design**:

- Model Enrollment sederhana dengan minimal fields
- Tidak ada tracking progress atau completion status
- Tidak ada enrollment metadata tambahan

### 3. **API Design**:

- RESTful endpoints dengan standard HTTP methods
- Simple request/response format
- Basic error handling tanpa complex business rules

### 4. **Authentication**:

- Menggunakan existing Clerk integration
- Role validation untuk user (siswa) saja
- Tidak ada course-specific access control

## Spesifikasi Teknis

### Database Schema

```prisma
model Enrollment {
  id        String   @id @default(uuid())
  userId    String   @db.VarChar(255) // Clerk User ID
  courseId  String   @db.VarChar(255)
  enrolledAt DateTime @default(now())

  // Relasi
  course    Course   @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([userId, courseId]) // Mencegah pendaftaran ganda
  @@map("enrollments")
}

// Update model Course existing
model Course {
  // ... existing fields ...
  enrollments Enrollment[]
}
```

### API Endpoints

#### 1. POST /api/enrollments

- **Purpose**: Mendaftar user ke kursus
- **Authentication**: Required (Clerk)
- **Authorization**: Role "user" only
- **Request Body**: `{ courseId: string }`
- **Response**: `{ success: boolean, data?: Enrollment, error?: string }`

#### 2. GET /api/enrollments

- **Purpose**: Mendapatkan daftar enrollment user
- **Authentication**: Required (Clerk)
- **Authorization**: Role "user" only
- **Query Params**: `page`, `limit`, `status`
- **Response**: `{ success: boolean, data: Enrollment[], pagination: PaginationInfo }`

#### 3. GET /api/courses/[id]/enrollment-status

- **Purpose**: Cek status enrollment user untuk kursus tertentu
- **Authentication**: Required (Clerk)
- **Authorization**: Role "user" only
- **Response**: `{ success: boolean, isEnrolled: boolean, enrollmentDate?: Date }`

### TypeScript Interfaces

```typescript
// Database Model (untuk CRUD operations)
interface Enrollment {
  id: string
  userId: string
  courseId: string
  enrolledAt: Date
  course?: Course // Database model untuk internal operations
}

// Display Model (untuk UI components)
interface EnrollmentDisplay {
  id: string
  userId: string
  courseId: string
  enrolledAt: Date
  course: CourseCatalogItem // Display model untuk UI
}

// Request/Response Types
interface CreateEnrollmentRequest {
  courseId: string
}

interface EnrollmentResponse {
  success: boolean
  data?: EnrollmentDisplay // Display model untuk response
  error?: string
}

interface EnrollmentListResponse {
  success: boolean
  data: EnrollmentDisplay[] // Display models untuk response
  pagination: PaginationInfo
  error?: string
}

interface EnrollmentStatusResponse {
  success: boolean
  isEnrolled: boolean
  enrollmentDate?: Date
  error?: string
}

// Utility Types
interface UserEnrollmentContext {
  userId: string
  enrolledCourses: string[]
  enrollmentDates: Record<string, Date>
}
```

## Implementasi Teknis

### 1. **Database Migration**

- Buat migration untuk model Enrollment
- Update model Course dengan relasi enrollments
- Tambahkan database indexes untuk performance

### 2. **Service Layer**

- `EnrollmentService` untuk business logic dan database operations
- `EnrollmentDisplayService` untuk transformation ke display model
- Validasi duplicate enrollment
- Update course.students count
- Error handling dan logging
- **Integration dengan courseTransformers untuk display data**
- **User context management untuk enrollment status**

### 3. **API Routes**

- `app/api/enrollments/route.ts` - POST dan GET
- `app/api/courses/[id]/enrollment-status/route.ts` - GET
- Authentication middleware integration
- Zod validation untuk request data
- **Response transformation menggunakan courseTransformers**
- **Display model integration untuk UI consistency**

### 4. **Adapter Layer**

- `EnrollmentAdapter` untuk client-side API communication
- Error handling dan response formatting
- Request/response transformation utilities
- **Integration dengan courseTransformers untuk display data**
- **Retry logic dan timeout handling**
- **Graceful fallback untuk failed operations**

### 5. **Error Handling**

- Duplicate enrollment error (409 Conflict)
- Course not found error (404 Not Found)
- Authentication error (401 Unauthorized)
- Authorization error (403 Forbidden)

### 6. **Business Logic**

- Validasi course exists dan status PUBLISHED
- Validasi user tidak sudah terdaftar
- Atomic transaction untuk enrollment + update course.students
- Logging untuk audit trail
- **Integration dengan courseTransformers untuk display data**

### 7. **Designing for Failure Patterns**

#### **Retry Pattern**

- Exponential backoff untuk enrollment operations
- Circuit breaker pattern untuk API calls
- Retry logic dengan maximum attempts (3x)
- Graceful degradation untuk temporary failures

#### **Timeout Handling**

- AbortController untuk enrollment requests
- Request timeout configuration (30s default)
- Graceful timeout handling dengan user feedback
- Connection pooling untuk database operations

#### **Graceful Fallback**

- Fallback UI untuk enrollment failures
- Skeleton loading states untuk enrollment list
- Error boundaries untuk enrollment components
- Safe default state untuk partial failures

#### **Safe Default State**

- Default enrollment status handling
- Safe fallback values untuk failed operations
- Graceful degradation untuk partial failures
- Local caching untuk enrollment status

## Peningkatan UX

### Performance Optimization

- Database indexes untuk query optimization
- Connection pooling untuk database operations
- Caching untuk enrollment status checks
- Pagination untuk enrollment list
- **Display model caching untuk UI performance**

### Security Enhancement

- Input validation dengan Zod schemas
- SQL injection prevention dengan Prisma ORM
- Rate limiting untuk enrollment endpoints
- Audit logging untuk security monitoring

### Monitoring & Logging

- Structured logging untuk enrollment operations
- Error tracking dan alerting
- Performance metrics collection
- Business analytics data

## Test Plan

### Unit Tests

- EnrollmentService business logic
- EnrollmentDisplayService transformation logic
- Database operations dan constraints
- Validation logic
- Error handling scenarios
- **Course transformation integration tests**

### Integration Tests

- API endpoint functionality
- Authentication flow
- Database integration
- Error response handling
- **Display model transformation flow**

## Pertanyaan untuk Diklarifikasi

1. Apakah perlu soft delete untuk enrollment atau hard delete?
2. Apakah perlu enrollment expiration atau lifetime access?
3. Apakah perlu batch enrollment untuk multiple courses?
4. Apakah perlu enrollment analytics dan reporting?
5. Apakah perlu webhook notifications untuk enrollment events?

## Acceptance Criteria

- [ ] Model Enrollment berhasil dibuat dengan database migration
- [ ] API endpoint POST /api/enrollments berfungsi dengan authentication
- [ ] API endpoint GET /api/enrollments berfungsi dengan pagination
- [ ] API endpoint GET /api/courses/[id]/enrollment-status berfungsi
- [ ] **EnrollmentAdapter berhasil diimplementasi dengan retry logic**
- [ ] Duplicate enrollment prevention berfungsi dengan baik
- [ ] Course.students count terupdate otomatis saat enrollment
- [ ] Error handling mencakup semua skenario (404, 409, 401, 403)
- [ ] **Display model transformation berfungsi dengan courseTransformers**
- [ ] **UI components menggunakan CourseCatalogItem interface**
- [ ] **Designing for failure patterns diimplementasi (retry, timeout, fallback)**
- [ ] **Graceful degradation untuk partial failures**
- [ ] Unit tests dan integration tests berhasil dengan coverage ≥80%
- [ ] Performance optimization diimplementasikan
- [ ] Security measures diterapkan

## Estimasi Effort

**Total: 12 jam** _(Updated untuk include adapter layer dan designing for failure)_

- Database schema design dan migration: 2 jam
- Service layer implementation: 3 jam _(+1 jam untuk display service)_
- API endpoints development: 2 jam
- **Adapter layer implementation: 1 jam**
- **Display model integration: 1 jam**
- **Designing for failure patterns: 2 jam**
- Testing dan debugging: 1 jam

## Dependencies

- TSK-47: Backend CRUD Course (✅ Complete)
- **TSK-50: Course Catalog UI dengan Layered Interface Pattern (✅ Complete)**
- Clerk authentication setup (✅ Complete)
- Prisma ORM configuration (✅ Complete)
- Existing error handling patterns
- Existing logging infrastructure
- **Course transformation utilities (courseTransformers)**
- **CourseCatalogItem dan CourseDetailView interfaces**
