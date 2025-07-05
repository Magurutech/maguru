# Task TSK-47: Implementasi Backend untuk CRUD Kursus

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Batasan dan Penyederhanaan](#batasan-dan-penyederhanaan)
3. [Spesifikasi Teknis](#spesifikasi-teknis)
4. [Implementasi Teknis](#implementasi-teknis)
5. [Test Plan](#test-plan)
6. [Pertanyaan untuk Diklarifikasi](#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

Task ini berfokus pada implementasi backend API untuk operasi CRUD (Create, Read, Update, Delete) metadata kursus. Backend akan menyediakan endpoints RESTful yang akan digunakan oleh frontend untuk mengelola kursus creator menggunakan Next.js API Routes dan Prisma ORM.

**Nilai Bisnis**: Backend yang robust dan scalable menjadi foundation untuk fitur manajemen kursus, memungkinkan creator untuk dengan mudah mengelola konten mereka.

**Konteks dalam Sprint**: Task ini bergantung pada desain UI (TSK-46) dan menjadi prasyarat untuk integrasi autentikasi (TSK-48) dan testing (TSK-49, TSK-66).

## Batasan dan Penyederhanaan

1. **Scope Data**:
   - Hanya metadata kursus: judul, deskripsi, struktur modul/pelajaran
     dengan metadata {
     id: '1',
     title: 'Petualangan Matematika Nusantara',
     description: 'Belajar matematika dengan cerita petualangan di kepulauan Indonesia',
     thumbnail: '/globe.svg ',
     status: 'published',
     students: 1250,
     lessons: 24,
     duration: '8 jam',
     rating: 4.8,
     category: 'Matematika',
     createdAt: '2024-01-15',
     },
   - Tidak ada versioning atau history tracking
   - fokus pada layer Database -> Service -> layer API -> layer Adapter

2. **Business Logic**:
   - Tidak ada workflow approval atau publishing
   - Tidak ada sharing atau collaboration features
   - Soft delete tidak diperlukan untuk v1

3. **Performance**:
   - Pagination sederhana (offset-based)
   - Tidak ada advanced search atau filtering
   - No caching layer untuk v1

4. **Validasi**:
   - Basic validation menggunakan Zod
   - Tidak ada advanced business rules
   - Simple error handling

## Spesifikasi Teknis

### Database Schema

metadata {
id: '1',
title: 'Petualangan Matematika Nusantara',
description: 'Belajar matematika dengan cerita petualangan di kepulauan Indonesia',
thumbnail: '/globe.svg ',
status: 'published',
students: 1250,
lessons: 24,
duration: '8 jam',
rating: 4.8,
category: 'Matematika',
createdAt: '2024-01-15',
},

```prisma
model Course {
  id          String   @id @default(uuid())
  title       String   @db.VarChar(100)
  description String   @db.Text
  thumbnail   String?  @db.VarChar(255)
  statusCourse         enum ['draft', 'published', 'archived']
  students    Int      @db.Int
  creatorId   String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relasi
  creator     User     @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  modules     Module[]

  @@map("courses")
}

```

### TypeScript Interfaces

```typescript
// Course types
interface Course {
  id: string
  title: string
  description: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
  modules: Module[]
}

// Request/Response types
interface CreateCourseRequest {
  title: string
  description: string
  modules: {
    title: string
    lessons: { title: string }[]
  }[]
}

interface UpdateCourseRequest extends CreateCourseRequest {
  id: string
}

interface CourseResponse {
  success: boolean
  data?: Course
  error?: string
}
```

### Flow Pengguna

#### Membuat Kursus Baru:

```
1. Client POST /api/courses dengan metadata
2. Validasi input menggunakan Zod schema
3. Verifikasi user adalah creator/admin (middleware)
4. Create course dengan modules dan lessons dalam transaction
5. Return course data lengkap dengan relasi
```

#### Mengambil Daftar Kursus:

```
1. Client GET /api/courses?page=1&limit=10
2. Verifikasi user ownership (hanya kursus milik creator)
3. Fetch courses dengan modules dan lessons count
4. Return paginated response
```

#### Update Kursus:

```
1. Client PUT /api/courses/[id] dengan data baru
2. Validasi ownership (hanya creator yang bisa edit)
3. Update course dan rebuild modules/lessons struktur
4. Return updated course data
```

#### Hapus Kursus:

```
1. Client DELETE /api/courses/[id]
2. Validasi ownership
3. Hard delete course (cascade akan hapus modules/lessons)
4. Return success confirmation
```

## Implementasi Teknis

### API Endpoints

#### 1. `POST /api/courses` - Membuat Kursus Baru

**Request Body**:

```typescript
{
  title: string // required, 1-100 chars
  description: string // required, 1-500 chars
  modules: Array<{
    title: string // required, 1-100 chars
    lessons: Array<{
      title: string // required, 1-100 chars
    }>
  }>
}
```

**Response**:

```typescript
{
  success: boolean;
  data?: {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    modules: Module[];
  };
  error?: string;
}
```

**Status Codes**:

- 201 Created - Kursus berhasil dibuat
- 400 Bad Request - Validasi gagal
- 401 Unauthorized - User tidak terautentikasi
- 403 Forbidden - User bukan creator/admin

#### 2. `GET /api/courses` - Mendapatkan Daftar Kursus

**Query Parameters**:

- `page` (optional): number, default 1
- `limit` (optional): number, default 10, max 50

**Response**:

```typescript
{
  success: boolean;
  data?: {
    courses: Course[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}
```

#### 3. `GET /api/courses/[id]` - Mendapatkan Detail Kursus

**Response**: Same as POST response structure

#### 4. `PUT /api/courses/[id]` - Update Kursus

**Request Body**: Same as POST
**Response**: Same as POST response structure

#### 5. `DELETE /api/courses/[id]` - Hapus Kursus

**Response**:

```typescript
{
  success: boolean;
  message?: string;
  error?: string;
}
```

### Validasi Data

```typescript
import { z } from 'zod'

const LessonSchema = z.object({
  title: z.string().min(1, 'Judul pelajaran harus diisi').max(100, 'Judul terlalu panjang'),
})

const ModuleSchema = z.object({
  title: z.string().min(1, 'Judul modul harus diisi').max(100, 'Judul terlalu panjang'),
  lessons: z.array(LessonSchema).min(1, 'Minimal 1 pelajaran per modul'),
})

const CourseSchema = z.object({
  title: z.string().min(1, 'Judul kursus harus diisi').max(100, 'Judul terlalu panjang'),
  description: z.string().min(1, 'Deskripsi harus diisi').max(500, 'Deskripsi terlalu panjang'),
  modules: z.array(ModuleSchema).min(1, 'Minimal 1 modul per kursus'),
})
```

### Error Handling

**Error Response Format**:

```typescript
{
  success: false;
  error: string;
  details?: {
    field: string;
    message: string;
  }[];
}
```

**Error Categories**:

- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Server errors (500)

### Database Operations

**Course Service Implementation**:

```typescript
class CourseService {
  async createCourse(data: CreateCourseRequest, creatorId: string): Promise<Course> {
    // Menggunakan Prisma transaction untuk atomicity
    // Create course, modules, dan lessons sekaligus
  }

  async getCoursesByCreator(creatorId: string, page: number, limit: number): Promise<Course[]> {
    // Fetch courses dengan pagination
    // Include modules dan lessons count
  }

  async updateCourse(id: string, data: UpdateCourseRequest, creatorId: string): Promise<Course> {
    // Verifikasi ownership
    // Update course dan rebuild struktur modules/lessons
  }

  async deleteCourse(id: string, creatorId: string): Promise<void> {
    // Verifikasi ownership
    // Hard delete dengan cascade
  }
}
```

## Test Plan

### Unit Tests

**Target Coverage**: Minimal 80%

**Test Categories**:

1. **Validation Tests**:
   - Valid input scenarios
   - Invalid input scenarios (empty, too long, etc.)
   - Edge cases (special characters, unicode)

2. **Service Tests**:
   - CRUD operations success scenarios
   - Error handling scenarios
   - Database transaction scenarios

3. **API Endpoint Tests**:
   - Request/Response format
   - Status codes
   - Error handling

**Test Tools**: Jest + Prisma Test Environment

### Integration Tests

**Scope**:

1. **Database Integration**:
   - Full CRUD flow dengan real database
   - Transaction rollback scenarios
   - Constraint validation

2. **API Integration**:
   - End-to-end request flow
   - Authentication middleware integration
   - Error propagation

**Test Tools**: Jest + Test Database + MSW (untuk mocking external services)

## Pertanyaan untuk Diklarifikasi

1. **Database Relations**: Apakah perlu foreign key constraints yang strict atau bisa menggunakan soft references?

2. **Pagination Strategy**: Offset-based pagination sudah cukup atau perlu cursor-based untuk performa yang lebih baik?

3. **Concurrent Editing**: Bagaimana menangani jika multiple users mengedit kursus yang sama secara bersamaan?

4. **Data Validation**: Apakah ada business rules khusus untuk judul kursus (unique per creator, blacklist kata, etc.)?

5. **Module/Lesson Ordering**: Apakah order modules dan lessons perlu diatur secara manual atau otomatis berdasarkan sequence input?

6. **Error Logging**: Apakah perlu integrasi dengan external logging service atau console.log sudah cukup?

7. **Rate Limiting**: Apakah perlu implementasi rate limiting untuk prevent abuse?

8. **Backup Strategy**: Apakah perlu soft delete untuk recovery purposes atau hard delete sudah cukup?

## Referensi

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Prisma ORM Documentation](https://www.prisma.io/docs/)
- [Zod Validation Library](https://zod.dev/)
- Existing authentication patterns di codebase Maguru
