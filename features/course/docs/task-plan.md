Tentu, saya paham dengan tugas yang Anda berikan. Berikut penjelasan ulang tugas dan rencana implementasi (task plan) untuk integrasi **Supabase Storage** sebagai media penyimpanan thumbnail image pada fitur manajemen kursus Maguru.

---

## **Penjelasan Tugas**

**Tugas Anda:**  
Membuat _task plan_ (perencanaan teknis) untuk implementasi **Supabase Storage** sebagai solusi upload dan serving thumbnail image pada fitur dashboard/course management. Task plan ini akan didokumentasikan di `@task-plan.md` dan harus mengacu pada arsitektur serta hasil implementasi sebelumnya (`@result-tsk-47.md`, `@result-tsk-48.md`).  
Referensi utama:

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Standard Uploads](https://supabase.com/docs/guides/storage/uploads/standard-uploads)

**Ruang lingkup tugas:**

- Menjelaskan langkah-langkah setup dan integrasi Supabase Storage.
- Menentukan perubahan pada backend (API/service), frontend (adapter/hook/component), dan environment.
- Menyusun task breakdown yang jelas, terukur, dan sesuai best practice Maguru.

---

## **Task Plan: Perbaikan CreateCourse - Thumbnail Default & Status Wajib**

## **Pendahuluan**

Setelah evaluasi menyeluruh terhadap fitur CreateCourse, ditemukan beberapa inkonsistensi dan masalah yang perlu diperbaiki:

### **Masalah yang Ditemukan:**

1. **Thumbnail Opsional vs Wajib:**
   - Interface mendefinisikan thumbnail sebagai opsional
   - Tapi tidak ada default thumbnail jika creator tidak upload
   - Tidak ada fallback mechanism di frontend

2. **Status Opsional vs Wajib:**
   - Interface mendefinisikan status sebagai opsional
   - Tapi service hardcode status ke DRAFT
   - Inconsistent antara interface dan implementasi

3. **Missing Default Thumbnail:**
   - Tidak ada default thumbnail di Supabase Storage
   - Frontend tidak menangani kasus thumbnail kosong

## **Solusi yang Direncanakan:**

### **A. Thumbnail Management**

- **Thumbnail tetap opsional** di interface (creator bisa pilih upload atau tidak)
- **Default thumbnail wajib** di backend (jika tidak upload, gunakan default)
- **Upload default thumbnail** ke Supabase Storage
- **Fallback mechanism** di frontend untuk menampilkan default

### **B. Status Management**

- **Status wajib** di interface dan validation
- **Default status DRAFT** jika tidak dispecify
- **Consistent validation** di semua layer

## **Task Breakdown**

### **Phase 1: Setup Default Thumbnail di Supabase Storage**

#### **Task 1.1: Upload Default Thumbnail**

- **File**: `public/images/default-course-thumbnail.png`
- **Action**: Upload ke Supabase Storage bucket `course-thumbnails`
- **Path**: `default/course-thumbnail-default.png`
- **URL**: `https://[project].supabase.co/storage/v1/object/public/course-thumbnails/default/course-thumbnail-default.png`

#### **Task 1.2: Environment Configuration**

- **File**: `.env.local`
- **Action**: Tambahkan variable untuk default thumbnail URL

```env
NEXT_PUBLIC_DEFAULT_COURSE_THUMBNAIL_URL=https://[project].supabase.co/storage/v1/object/public/course-thumbnails/default/course-thumbnail-default.png
```

### **Phase 2: Backend Layer Updates**

#### **Task 2.1: Update Types & Validation**

- **File**: `features/course/types/index.ts`
- **Action**:
  - Buat constant untuk default thumbnail URL
  - Update CourseSchema untuk status wajib dengan default
  - Tambahkan utility function untuk thumbnail handling

#### **Task 2.2: Update Service Layer**

- **File**: `features/course/services/courseService.ts`
- **Action**:
  - Tambahkan logic untuk default thumbnail
  - Update createCourse untuk handle thumbnail fallback
  - Tambahkan method untuk get default thumbnail URL

#### **Task 2.3: Update API Route**

- **File**: `app/api/courses/route.ts`
- **Action**:
  - Update thumbnail handling logic
  - Tambahkan fallback ke default thumbnail
  - Update validation untuk status wajib

### **Phase 3: Frontend Layer Updates**

#### **Task 3.1: Update Adapter Layer**

- **File**: `features/course/adapters/courseAdapter.ts`
- **Action**:
  - Update createCourse untuk handle thumbnail fallback
  - Tambahkan utility untuk default thumbnail URL
  - Update error handling untuk thumbnail upload

#### **Task 3.2: Update Hooks Layer**

- **File**: `features/course/hooks/useCourse.ts`
- **Action**:
  - Update createCourse untuk handle thumbnail fallback
  - Tambahkan logic untuk default thumbnail

#### **Task 3.3: Update Components Layer**

- **File**: `features/course/components/course-manage/CreateCourseDialog.tsx`
- **Action**:
  - Update form validation untuk status wajib
  - Tambahkan preview default thumbnail
  - Update UI untuk menunjukkan thumbnail opsional

- **File**: `features/course/components/course-manage/EditCourseDialog.tsx`
- **Action**:
  - Update form validation untuk status wajib
  - Tambahkan fallback ke default thumbnail
  - Update UI untuk thumbnail handling

### **Phase 4: Testing & Documentation**

#### **Task 4.1: Update Tests**

- **Files**: Semua test files terkait course
- **Action**:
  - Update unit tests untuk default thumbnail
  - Update integration tests untuk status wajib
  - Update E2E tests untuk thumbnail flow

#### **Task 4.2: Update Documentation**

- **Files**: API documentation, README
- **Action**:
  - Update API docs untuk thumbnail behavior
  - Update README untuk default thumbnail setup
  - Update Postman collection jika perlu

## **Spesifikasi Teknis Detail**

### **Default Thumbnail Specification**

```typescript
// Default thumbnail constants
export const DEFAULT_COURSE_THUMBNAIL = {
  URL:
    process.env.NEXT_PUBLIC_DEFAULT_COURSE_THUMBNAIL_URL || '/images/default-course-thumbnail.png',
  WIDTH: 640,
  HEIGHT: 360,
  FORMAT: 'png',
}
```

### **Updated Types**

```typescript
// Updated CreateCourseRequest
export interface CreateCourseRequest {
  title: string
  description: string
  category: string
  thumbnail?: string | File // Tetap opsional di interface
  status: PrismaCourseStatus // Wajib dengan default DRAFT
}

// Updated CourseSchema
export const CourseSchema = z.object({
  title: z.string().min(1, 'Judul kursus harus diisi').max(100, 'Judul terlalu panjang'),
  description: z.string().min(1, 'Deskripsi harus diisi').max(500, 'Deskripsi terlalu panjang'),
  category: z.string().min(1, 'Kategori harus diisi').max(50, 'Kategori terlalu panjang'),
  thumbnail: z.string().optional(),
  status: z.nativeEnum(PrismaCourseStatus).default(PrismaCourseStatus.DRAFT),
})
```

### **Thumbnail Handling Logic**

```typescript
// Service layer logic
const thumbnailUrl = files.thumbnail
  ? await uploadThumbnail(files.thumbnail)
  : DEFAULT_COURSE_THUMBNAIL.URL

// Frontend fallback logic
const displayThumbnail = course.thumbnail || DEFAULT_COURSE_THUMBNAIL.URL
```

## **Acceptance Criteria**

| Kriteria                                       | Status | Keterangan                           |
| ---------------------------------------------- | ------ | ------------------------------------ |
| Default thumbnail tersedia di Supabase Storage | ⏳     | URL publik yang dapat diakses        |
| Thumbnail tetap opsional di form               | ⏳     | Creator bisa pilih upload atau tidak |
| Default thumbnail digunakan jika tidak upload  | ⏳     | Fallback mechanism di backend        |
| Status wajib dengan default DRAFT              | ⏳     | Validation di semua layer            |
| Frontend menampilkan default thumbnail         | ⏳     | Fallback di UI components            |
| API tests berjalan dengan baik                 | ⏳     | Postman collection updated           |
| Error handling untuk upload gagal              | ⏳     | Graceful degradation                 |

## **Dependencies & Prerequisites**

1. **Supabase Storage Setup**: Bucket `course-thumbnails` sudah dibuat
2. **Default Image**: File `default-course-thumbnail.png` tersedia
3. **Environment Variables**: `NEXT_PUBLIC_DEFAULT_COURSE_THUMBNAIL_URL` dikonfigurasi

## **Risk Assessment**

| Risk                               | Impact | Mitigation                                |
| ---------------------------------- | ------ | ----------------------------------------- |
| Default thumbnail tidak accessible | High   | Test URL accessibility, backup local file |
| Upload thumbnail gagal             | Medium | Graceful fallback ke default              |
| Status validation error            | Medium | Comprehensive testing di semua layer      |
| Frontend tidak handle fallback     | Medium | UI testing dengan berbagai scenarios      |

## **Timeline Estimate**

- **Phase 1**: 1-2 hours (Setup & Configuration)
- **Phase 2**: 3-4 hours (Backend Updates)
- **Phase 3**: 2-3 hours (Frontend Updates)
- **Phase 4**: 1-2 hours (Testing & Documentation)

**Total Estimate**: 7-11 hours

## **Next Steps**

1. **Setup default thumbnail di Supabase Storage**
2. **Update environment configuration**
3. **Implement backend changes**
4. **Update frontend components**
5. **Comprehensive testing**
6. **Update documentation**

**Apakah Anda ingin task plan ini langsung dituliskan ke file `features/course/docs/task-plan.md`?**  
Atau ada detail tambahan yang ingin Anda tambahkan sebelum saya lanjutkan?
