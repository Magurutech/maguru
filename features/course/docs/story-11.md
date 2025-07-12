# User Story TSK-11: Pendaftaran Kursus untuk Siswa

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

User Story TSK-11 merupakan fitur utama untuk siswa yang ingin mendaftar dan mengakses kursus di platform Maguru. Fitur ini memungkinkan siswa yang sudah terautentikasi untuk menelusuri katalog kursus yang tersedia dan mendaftar ke kursus yang diminati. Implementasi ini akan membangun di atas arsitektur course management yang sudah ada (TSK-47, TSK-48) dengan menambahkan layer enrollment/registration.

Fitur ini memberikan nilai bisnis yang signifikan karena merupakan pintu masuk utama bagi siswa untuk mengakses konten pembelajaran, sehingga menjadi kunci untuk engagement dan retention pengguna di platform Maguru.

## Perbandingan dengan Referensi

| Fitur                | Referensi (Coursera, Udemy)            | Project Maguru                                            |
| -------------------- | -------------------------------------- | --------------------------------------------------------- |
| Katalog Kursus       | Grid layout dengan filter dan search   | Grid layout dengan filter berdasarkan status dan kategori |
| Pendaftaran          | One-click enrollment dengan konfirmasi | One-click enrollment dengan konfirmasi dialog             |
| Status Pendaftaran   | "Enrolled", "In Progress", "Completed" | "Enrolled" dengan timestamp                               |
| Duplicate Prevention | Server-side validation                 | Server-side validation dengan unique constraint           |
| User Dashboard       | "My Courses" section                   | "My Enrollments" section (future enhancement)             |

## Batasan dan Penyederhanaan Implementasi

### 1. **Scope Pendaftaran**:

- Fokus hanya pada pendaftaran course, tidak mengimplementasikan fitur pembelian atau subscription
- Tidak ada payment gateway integration
- Tidak ada trial period atau free tier management

### 2. **Database Complexity**:

- Model Enrollment sederhana dengan relasi many-to-many
- Tidak ada tracking progress pembelajaran dalam scope ini
- Tidak ada certificate atau completion tracking

### 3. **UI/UX Simplification**:

- Katalog kursus menggunakan komponen existing dari course management
- Tombol pendaftaran sederhana tanpa preview course content
- Konfirmasi dialog basic tanpa detail tambahan

### 4. **Authentication Scope**:

- Menggunakan existing Clerk integration
- Role validation untuk user (siswa) saja
- Tidak ada role-based course access control

## Spesifikasi Teknis

### Struktur Data

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

### Flow Pengguna

#### Pendaftaran Kursus:

1. Siswa login ke aplikasi dengan role "user"
2. Siswa mengakses halaman katalog kursus
3. Sistem menampilkan daftar kursus yang tersedia (status PUBLISHED)
4. Siswa memilih kursus yang diminati
5. Siswa mengklik tombol "Daftar" pada course card
6. Sistem menampilkan dialog konfirmasi pendaftaran
7. Siswa mengkonfirmasi pendaftaran
8. Sistem menyimpan data enrollment ke database
9. Sistem menampilkan notifikasi sukses
10. Tombol "Daftar" berubah menjadi "Sudah Terdaftar"

#### Skenario Pendaftaran Ganda:

1. Siswa mencoba mendaftar ke kursus yang sudah diikuti
2. Sistem mendeteksi enrollment existing
3. Sistem menampilkan pesan "Anda sudah terdaftar di kursus ini"
4. Tombol tetap menampilkan "Sudah Terdaftar"

## Implementasi Teknis

### Database Layer

- Migration untuk model Enrollment
- Update model Course dengan relasi enrollments
- Index untuk optimasi query enrollment

### Service Layer

- EnrollmentService untuk business logic enrollment
- Validasi duplicate enrollment
- Update course.students count

### API Layer

- POST /api/enrollments - Mendaftar ke kursus
- GET /api/enrollments - Daftar enrollment user
- GET /api/courses/[id]/enrollment-status - Cek status enrollment

### Adapter Layer

- EnrollmentAdapter untuk client-side API calls
- Error handling dan response transformation

### Frontend Layer

- useEnrollment hook untuk enrollment operations
- EnrollmentDialog component untuk konfirmasi
- Update CourseCard untuk menampilkan status enrollment

## Peningkatan UX

### Visual Feedback

- Loading state saat proses pendaftaran
- Success/error notifications dengan toast
- Disabled state untuk tombol setelah pendaftaran

### Accessibility

- ARIA labels untuk tombol pendaftaran
- Keyboard navigation support
- Screen reader friendly notifications

### Responsive Design

- Mobile-friendly enrollment dialog
- Touch-optimized button sizes
- Responsive grid layout untuk katalog

## Test Plan

### Unit Tests

- EnrollmentService business logic
- API endpoint validation
- Adapter error handling
- Hook state management

### Integration Tests

- Database enrollment operations
- API authentication flow
- Frontend-backend integration

### E2E Tests

- Complete enrollment flow
- Duplicate enrollment prevention
- Authentication scenarios

## Pertanyaan untuk Diklarifikasi

1. Apakah perlu menampilkan jumlah siswa yang sudah terdaftar di course card?
Jawab : perlu menampilkan jumlah siswa yang sudah terdaftar di course card.
2. Apakah perlu fitur "un-enroll" atau pembatalan pendaftaran?
jawab : tidak perlu fitur un-enroll atau pembatalan pendaftaran.

3. Apakah perlu notifikasi email setelah pendaftaran berhasil?
Jawab : tidak perlu notifikasi email setelah pendaftaran berhasil.

4. Apakah perlu tracking enrollment date untuk analytics?
Jawab : tidak perlu tracking enrollment date untuk analytics.

5. Apakah perlu role-based access control untuk course enrollment (misal: course premium)?
Jawab : tidak perlu role-based access control untuk course enrollment.

## Task Breakdown

- **TSK-50**: Desain UI untuk katalog kursus
- **TSK-51**: Implementasi backend untuk pendaftaran kursus dengan integrasi Clerk
- **TSK-52**: Implementasi Front end untuk pendaftaran kursus
- **TSK-53**: Menulis unit test dan integration test untuk pendaftaran kursus
- **TSK-67**: Menulis test case e2e untuk pendaftaran kursus
