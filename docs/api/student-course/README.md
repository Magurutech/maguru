# Student Course API Testing Guide

**Feature:** Course Discovery & Enrollment  
**Sprint:** Sprint 2b  
**Requirements:** 1.x, 2.x, 3.x, 7.x

---

## Overview

Panduan testing untuk Student Course API — endpoint publik yang digunakan student untuk browse catalog, enroll ke kursus, dan melihat kursus yang sudah diikuti.

### API Endpoints

| Method | Endpoint                     | Auth     | Description                                      |
| --------| ------------------------------| ----------| --------------------------------------------------|
| GET    | `/api/courses`               | Optional | Public course catalog dengan filter & pagination |
| GET    | `/api/courses/[slug]`        | Optional | Course detail by ID                              |
| POST   | `/api/courses/[slug]/enroll` | Required | Enroll ke kursus                                 |
| GET    | `/api/courses/my-courses`    | Required | Daftar kursus yang diikuti student               |

---

## Prerequisites

### 1. Start Development Server

```bash
yarn dev
# Server berjalan di http://localhost:3000
```

### 2. Siapkan Test Data

```sql
-- Cek courses yang ada
SELECT id, slug, title, status, difficulty, category FROM courses LIMIT 10;

-- Catat:
-- courseSlug      = slug course dengan status PUBLISHED (e.g. belajar-typescript-dari-nol)
-- draftCourseSlug = slug course dengan status DRAFT
```

### 3. Dapatkan Auth Token (Clerk)

1. Buka aplikasi di browser: `http://localhost:3000`
2. Login sebagai user student
3. Buka DevTools → Application → Cookies
4. Copy nilai cookie `__session`

---

## Import Postman Collection

1. Buka Postman
2. Click **Import**
3. Pilih file `docs/api/student-course/student-course.postman_collection.json`
4. Click **Import**

---

## Configure Collection Variables

| Variable | Nilai | Keterangan |
|----------|-------|------------|
| `baseUrl` | `http://localhost:3000` | URL server lokal |
| `courseSlug` | _(isi dari database)_ | Slug course PUBLISHED — human-readable (e.g. `belajar-typescript-dari-nol`), bukan UUID |
| `draftCourseSlug` | _(isi dari database)_ | Slug course DRAFT — human-readable, bukan UUID |
| `authToken` | _(isi dari Clerk)_ | Session token student |

---

## Test Scenarios & Checklist

---

### Scenario 1: Browse Catalog (tanpa auth)

#### 1.1 Get Catalog — Success

```
GET /api/courses
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `courses` (array) dan `pagination`
- [x] `pagination` punya: `page`, `limit`, `total`, `totalPages`
- [x] Semua course di array punya: `id`, `title`, `category`, `difficulty`, `status`, `sectionCount`, `lessonCount`, `enrolled`
- [x] Semua course `status === 'PUBLISHED'`
- [x] `description` tidak lebih dari 150 karakter

**Actual Response:**
```json
{
    "courses": [
        {
            "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
            "title": "Test Course dari Postman",
            "description": "Deskripsi kursus test yang dibuat via Postman collection",
            "category": "programming",
            "difficulty": "Pemula",
            "status": "PUBLISHED",
            "sectionCount": 0,
            "lessonCount": 0,
            "createdAt": "2026-03-17T03:06:06.825Z",
            "enrolled": false
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 12,
        "total": 1,
        "totalPages": 1
    }
}
```

---

#### 1.2 Get Catalog — Filter by Category

```
GET /api/courses?category=programming
```

**Checklist:**
- [x] Status code `200`
- [x] Semua course yang dikembalikan match category `programming`

**Actual Response:**
```json
{
    "courses": [
        {
            "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
            "title": "Test Course dari Postman",
            "description": "Deskripsi kursus test yang dibuat via Postman collection",
            "category": "programming",
            "difficulty": "Pemula",
            "status": "PUBLISHED",
            "sectionCount": 0,
            "lessonCount": 0,
            "createdAt": "2026-03-17T03:06:06.825Z",
            "enrolled": false
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 12,
        "total": 1,
        "totalPages": 1
    }
}
```

---

#### 1.3 Get Catalog — Filter by Difficulty

```
GET /api/courses?difficulty=Pemula
```

**Checklist:**
- [x] Status code `200`
- [x] Semua course `difficulty === 'Pemula'`

**Actual Response:**
```json
{
    "courses": [
        {
            "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
            "title": "Test Course dari Postman",
            "description": "Deskripsi kursus test yang dibuat via Postman collection",
            "category": "programming",
            "difficulty": "Pemula",
            "status": "PUBLISHED",
            "sectionCount": 0,
            "lessonCount": 0,
            "createdAt": "2026-03-17T03:06:06.825Z",
            "enrolled": false
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 12,
        "total": 1,
        "totalPages": 1
    }
}
```

---

#### 1.4 Get Catalog — Search by Keyword

```
GET /api/courses?search=web
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `courses`

**Actual Response:**
```json
{
    "courses": [
        {
            "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
            "title": "Test Course dari Postman",
            "description": "Deskripsi kursus test yang dibuat via Postman collection",
            "category": "programming",
            "difficulty": "Pemula",
            "status": "PUBLISHED",
            "sectionCount": 0,
            "lessonCount": 0,
            "createdAt": "2026-03-17T03:06:06.825Z",
            "enrolled": false
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 12,
        "total": 1,
        "totalPages": 1
    }
}
```

---

#### 1.5 Get Catalog — Pagination

```
GET /api/courses?page=1&limit=6
```

**Checklist:**
- [x] Status code `200`
- [x] `pagination.page === 1`
- [x] `pagination.limit === 6`
- [x] Jumlah courses di array ≤ 6

**Actual Response:**
```json
{
    "courses": [
        {
            "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
            "title": "Test Course dari Postman",
            "description": "Deskripsi kursus test yang dibuat via Postman collection",
            "category": "programming",
            "difficulty": "Pemula",
            "status": "PUBLISHED",
            "sectionCount": 0,
            "lessonCount": 0,
            "createdAt": "2026-03-17T03:06:06.825Z",
            "enrolled": false
        }
    ],
    "pagination": {
        "page": 1,
        "limit": 6,
        "total": 1,
        "totalPages": 1
    }
}
```

---

### Scenario 2: Course Detail

#### 2.1 Get Course Detail — Success

```
GET /api/courses/{{courseSlug}}
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya: `id`, `title`, `description`, `category`, `status`, `createdAt`

**Actual Response:**
```json
{
    "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
    "title": "Test Course dari Postman",
    "description": "Deskripsi kursus test yang dibuat via Postman collection",
    "category": "programming",
    "difficulty": "Pemula",
    "creatorId": "user_2zDLu13tvWu8kQaHUrmyMBrDmWB",
    "status": "PUBLISHED",
    "createdAt": "2026-03-17T03:06:06.825Z",
    "updatedAt": "2026-03-17T07:16:25.161Z",
    "slug": "78322b16-3758-4861-9e79-e647b36d9ab5"
}
```

---

#### 2.2 Get Course Detail — Not Found

```
GET /api/courses/non-existent-course-id-00000000
```

**Checklist:**
- [x] Status code `404`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Course not found"
}
```

---

### Scenario 3: Enrollment Flow

> Jalankan **berurutan** — urutan penting untuk test 409.

#### 3.1 Enroll — Unauthenticated

```
POST /api/courses/{{courseSlug}}/enroll
(tanpa Authorization header)
```

**Checklist:**
- [ ] Status code `401`
- [ ] `error` mengandung kata `login`

**Actual Response:**
```json
{
    "error": "Silakan login terlebih dahulu"
}
```

---

#### 3.2 Enroll — DRAFT Course

```
POST /api/courses/{{draftCourseSlug}}/enroll
Authorization: Bearer {{authToken}}
```

**Checklist:**
- [x] Status code `403`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Kursus ini belum dipublikasikan"
}
```

---

#### 3.3 Enroll — Success

```
POST /api/courses/{{courseSlug}}/enroll
Authorization: Bearer {{authToken}}
```

**Checklist:**
- [x] Status code `201`
- [x] Response punya field `enrollment`
- [x] `enrollment` punya: `id`, `userId`, `courseId`, `enrolledAt`

**Actual Response:**
```json
{
    "enrollment": {
        "id": "8af79cb5-be5e-48c3-8b86-fa2695b5f500",
        "userId": "user_2zENLKAiz32PGUtK7I5S3zaSPXr",
        "courseId": "78322b16-3758-4861-9e79-e647b36d9ab5",
        "enrolledAt": "2026-03-17T08:33:02.350Z"
    }
}
```

---

#### 3.4 Enroll — Already Enrolled

```
POST /api/courses/{{courseSlug}}/enroll
Authorization: Bearer {{authToken}}
(jalankan ulang request yang sama setelah 3.3 berhasil)
```

**Checklist:**
- [x] Status code `409`
- [x] `error === 'Anda sudah terdaftar di kursus ini'`

**Actual Response:**
```json
{
    "error": "Anda sudah terdaftar di kursus ini"
}
```

---

### Scenario 4: My Courses

#### 4.1 My Courses — Unauthenticated

```
GET /api/courses/my-courses
(tanpa Authorization header)
```

**Checklist:**
- [x] Status code `401`
- [x] Response punya field `error`

**Actual Response:**
```json
{
    "error": "Silakan login terlebih dahulu"
}
```

---

#### 4.2 My Courses — Success

```
GET /api/courses/my-courses
Authorization: Bearer {{authToken}}
```

**Checklist:**
- [x] Status code `200`
- [x] Response punya field `enrollments` (array)
- [x] Setiap enrollment punya: `id`, `course`, `enrolledAt`, `progress`

**Actual Response:**
```json
{
    "enrollments": [
        {
            "id": "8af79cb5-be5e-48c3-8b86-fa2695b5f500",
            "enrolledAt": "2026-03-17T08:33:02.350Z",
            "completed": false,
            "completedAt": null,
            "progress": 0,
            "course": {
                "id": "78322b16-3758-4861-9e79-e647b36d9ab5",
                "title": "Test Course dari Postman",
                "description": "Deskripsi kursus test yang dibuat via Postman collection",
                "category": "programming",
                "difficulty": "Pemula",
                "status": "PUBLISHED",
                "thumbnail": null
            }
        }
    ]
}
```

---

## Running All Tests (Newman CLI)

```bash
# Install Newman
npm install -g newman

# Run semua tests
newman run docs/api/student-course/student-course.postman_collection.json \
  --env-var "baseUrl=http://localhost:3000" \
  --env-var "authToken=YOUR_TOKEN" \
  --env-var "courseSlug=YOUR_COURSE_SLUG" \
  --env-var "draftCourseSlug=YOUR_DRAFT_SLUG"
```

---

## Troubleshooting

| Error | Penyebab | Solusi |
|-------|----------|--------|
| 401 pada enroll | Token tidak valid / expired | Re-login dan copy token baru |
| 403 pada enroll | Course masih DRAFT | Gunakan `courseSlug` yang PUBLISHED |
| 404 pada detail | Course slug tidak ada | Cek database, update variable `courseSlug` |
| 409 pada enroll | Sudah pernah enroll | Normal — ini yang ditest di 3.4 |
| Connection refused | Server tidak running | Jalankan `yarn dev` |

---

## References

- **Postman Collection:** `docs/api/student-course/student-course.postman_collection.json`
- **Requirements:** `.kiro/specs/course-discovery/requirements.md`
- **Design:** `.kiro/specs/course-discovery/design.md`
- **Tasks:** `.kiro/specs/course-discovery/tasks.md`

---

**Last Updated:** 2026-03-17  
**Status:** Ready for Testing
