# Sprint 2a: Content First - Course Structure & Delivery

**Status:** Draft | **Prioritas:** P1 | **Estimasi:** 2-3 minggu

---

## 📋 Ringkasan

Sprint ini berfokus pada **menyelesaikan struktur content** agar siswa dapat belajar dengan terstruktur. Saat ini content masih file-based (markdown di repo git), kita akan migrasi ke database agar persisten dan bisa diakses dinamis.

**Tujuan Utama:**
1. Database schema untuk Course → Sections → Lessons → Content
2. API routes untuk content management
3. Frontend integration untuk Creator dan Student
4. Progress tracking yang persisten di database

---

## 🎯 User Stories

### Epic 1: Course Structure Management

**US1.1 - Section Navigation**
> Sebagai Creator, saya ingin membuat section (bab) di course agar materi bisa dikelompok secara logis.

**US1.2 - Lesson Management**
> Sebagai Creator, saya ingin membuat lesson (materi) di setiap section agar saya bisa mengorganisir konten pelajaran dengan baik.

**US1.3 - Content Upload**
> Sebagai Creator, saya ingin mengupload konten (markdown, video, gambar) untuk setiap lesson.

---

### Epic 2: Content Delivery

**US2.1 - File-Based Content Viewer**
> Sebagai Student, saya ingin melihat konten lesson yang sedang saya pelajari dalam format yang rapi dan mudah dibaca.

**US2.2 - Content Type Support**
> Sebagai Creator, saya ingin tipe konten bisa beragam (markdown, video, quiz) untuk variasi metode pembelajaran.

---

### Epic 3: Progress Tracking

**US3.1 - Lesson Progress**
> Sebagai Student, saya ingin melihat kemajuan belajar saya (lesson mana yang sudah selesai) agar saya tahu posisi saya.

**US3.2 - Course Completion**
> Sebagai Student, saya ingin melihat status penyelesaian course saya (berapa persen yang sudah selesai) agar saya termotivasi.

---

## 📝 Tasks

### Phase 1: Database Schema (Hari 1-2)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 1.1 | Buat Section model di Prisma schema | 2 jam |
| 1.2 | Buat Lesson model di Prisma schema | 2 jam |
| 1.3 | Buat Progress model di Prisma schema | 1 jam |
| 1.4 | Buat CourseCompletion model di Prisma schema | 1 jam |
| 1.5 | Update Course model dengan Section relation | 1 jam |

### Phase 2: API Routes (Hari 2-3)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 2.1 | Buat API route untuk create section | 3 jam |
| 2.2 | Buat API route untuk list sections per course | 2 jam |
| 2.3 | Buat API route untuk create lesson | 3 jam |
| 2.4 | Buat API route untuk list lessons per section | 2 jam |
| 2.5 | Buat API route untuk get lesson content | 2 jam |
| 2.6 | Buat API route untuk save progress | 2 jam |
| 2.7 | Buat API route untuk get course progress | 3 jam |
| 2.8 | Buat API route untuk mark course completion | 2 jam |

### Phase 3: Frontend Integration (Hari 4-5)

| # | Task | Deskripsi | Estimasi |
|---|-------|-----------|------------|
| 3.1 | Update Creator Dashboard untuk section management | 4 jam |
| 3.2 | Update Learn Page untuk section navigation | 4 jam |
| 3.3 | Update Learn Page untuk lesson list per section | 4 jam |
| 3.4 | Update Learn Page untuk content viewer | 4 jam |
| 3.5 | Implement progress tracking di Learn Page | 4 jam |
| 3.6 | Implement course completion tracking | 2 jam |

---

## 🎯 Acceptance Criteria

| Story | Criteria |
|-------|----------|
| US1.1 | Creator bisa membuat section baru | POST /api/courses/[slug]/sections mengembalikan section |
| US1.2 | Creator bisa membuat lesson baru | POST /api/courses/[slug]/sections/[sectionId]/lessons mengembalikan lesson |
| US2.1 | Student bisa melihat konten lesson | GET /api/courses/[slug]/sections/[sectionId]/lessons/[lessonId]/content mengembalikan content file |
| US3.1 | Student bisa melihat progress lesson | GET /api/courses/[slug]/progress mengembalikan progress data |

---

## 📊 Timeline

| Minggu | Fokus |
|-------|--------|
| 1 | Database Schema |
| 2 | API Routes |
| 3 | Frontend Integration |

---

## 🔗 Dependencies

| Dependensi | Status |
|-----------|--------|
| Prisma migration | Perlu dijalankan setelah schema update |
| LangServe | Tidak dibutuhkan untuk sprint ini |

---

## 📝 Catatan

- Content saat ini masih file-based (markdown di repo)
- Setelah database siap, perlu migrasi konten ke database
- Untuk MVP, fokus pada markdown content saja (video nanti)
- Progress tracking perlu tetap ada meski user ganti browser
