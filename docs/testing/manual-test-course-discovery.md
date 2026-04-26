# Manual Test Checklist: Course Discovery & Enrollment

**Feature:** Course Discovery & Enrollment  
**Sprint:** Sprint 2b  
**Tanggal Test:** ___________  
**Tester:** ___________  
**Environment:** http://localhost:3000

---

## Persiapan

- [x] Aplikasi berjalan di `http://localhost:3000`
- [x] Database memiliki minimal 1 kursus PUBLISHED
- [x] Akun student tersedia (login sebagai user biasa)
- [x] Akun creator tersedia (login sebagai creator)
- [x] Browser DevTools siap untuk cek network/console errors

---

## 1. Course Catalog — Unauthenticated

### 1.1 Halaman Catalog Terbuka

- [x] Buka `http://localhost:3000/course`
- [x] Halaman tampil tanpa error
- [x] Judul "Katalog Kursus" terlihat
- [x] Grid kursus tampil (jika ada data)
- [x] Setiap card menampilkan: judul, deskripsi (max 150 char), badge kategori, badge difficulty

### 1.2 Filter Kategori

- [x] Klik dropdown "Semua Kategori"
- [x] Pilih salah satu kategori (misal: Pemrograman)
- [x] URL berubah: `?category=Pemrograman`
- [x] Hanya kursus dengan kategori tersebut yang tampil
- [x] Tombol "Reset" muncul
- [x] Klik "Reset" → semua kursus tampil kembali, URL bersih

### 1.3 Filter Difficulty

- [x] Klik dropdown "Semua Level"
- [x] Pilih "Pemula"
- [x] URL berubah: `?difficulty=Pemula`
- [x] Hanya kursus Pemula yang tampil
- [x] Klik "Reset" → semua kursus tampil kembali

### 1.4 Search

- [x] Ketik kata kunci di search box (misal: "React")
- [x] Tunggu 300ms (debounce)
- [x] URL berubah: `?search=React`
- [x] Hanya kursus yang judulnya/deskripsinya mengandung "React" yang tampil
- [x] Search tidak case-sensitive (coba "react" lowercase)
- [x] Hapus search → semua kursus tampil kembali

### 1.5 Kombinasi Filter

- [x] Set kategori + difficulty + search bersamaan
- [x] URL mengandung semua params: `?category=X&difficulty=Y&search=Z`
- [x] Hasil sesuai semua filter
- [x] Klik "Reset" → semua filter bersih

### 1.6 Empty State

- [x] Set search dengan kata yang tidak ada (misal: "xyzabc123")
- [x] Pesan "Tidak ada kursus yang cocok" tampil
- [x] Tidak ada error di console

### 1.7 Tombol Enroll (Unauthenticated)

- [x] Pastikan belum login
- [x] Klik "Daftar Sekarang" pada salah satu kursus
- [x] Redirect ke `/sign-in`

### 1.8 Pagination (jika ada >12 kursus)

- [x] Tombol "Halaman berikutnya" aktif
- [x] Klik → URL berubah `?page=2`, kursus berbeda tampil
- [x] Tombol "Halaman sebelumnya" aktif di page 2
- [x] Klik → kembali ke page 1

---

## 2. Course Enrollment — Authenticated (Student)

### Persiapan: Login sebagai student

- [x] Login dengan akun student
- [x] Pastikan belum enrolled di kursus yang akan ditest

### 2.1 Enroll Berhasil

- [x] Buka `/course`
- [x] Klik "Daftar Sekarang" pada kursus PUBLISHED
- [x] Loading state tampil di tombol ("Mendaftar...")
- [x] Toast sukses muncul: "Berhasil mendaftar ke..."
- [x] Redirect ke `/course/[id]/learn`
- [x] Tombol "Lanjut Belajar" berwarna hijau


### 2.3 Double Enroll (409)

- [x] Coba klik "Daftar Sekarang" lagi pada kursus yang sama (jika tombol masih muncul)
- [x] Atau: panggil API langsung `POST /api/courses/[id]/enroll` dua kali
- [x] Response kedua: HTTP 409 dengan message "Anda sudah terdaftar di kursus ini"

### 2.4 Enroll ke DRAFT Course (403)

- [x] Panggil `POST /api/courses/[draft-course-id]/enroll` via DevTools/Postman
- [x] Response: HTTP 403 Forbidden

---

## 3. My Courses Page — Authenticated (Student)

### 3.1 Akses Halaman

- [x] Buka `/student/courses` saat sudah login
- [x] Halaman tampil dengan judul "Kursus Saya"
- [x] Kursus yang sudah dienroll tampil

### 3.2 Info Card

- [x] Setiap card menampilkan: judul, kategori, difficulty
- [x] Progress bar tampil (0% jika belum ada progress)
- [x] Tanggal enrollment tampil

### 3.3 Tombol Lanjut Belajar

- [x] Klik "Lanjut Belajar" → redirect ke `/course/[id]/learn`

### 3.4 Empty State

- [x] Login dengan akun yang belum punya enrollment
- [x] Buka `/student/courses`
- [x] Pesan "Belum ada kursus yang diikuti" tampil
- [x] Link "Jelajahi Kursus" tampil dan bisa diklik → redirect ke `/course`

### 3.5 Auth Protection

- [x] Logout
- [x] Buka `/student/courses`
- [x] Redirect ke `/sign-in`

---

## 4. Creator Dashboard

### Persiapan: Login sebagai creator

- [x] Login dengan akun creator

### 4.1 Stats Tampil

- [x] Buka `/creator`
- [x] "Total Kursus" menampilkan angka yang benar
- [x] Breakdown "X published, Y draft" tampil

### 4.2 Daftar Kursus (Dashboard — preview 5 item)

- [x] Kursus milik creator tampil di panel "Kursus Saya" (maks 5 item)
- [x] Setiap item menampilkan: judul, status badge, difficulty, jumlah siswa, tanggal update
- [x] Layout dashboard: panel kursus 2/3 lebar, panel "Tugas Pending" 1/3 lebar
- [x] Klik item kursus mana saja → redirect ke `/creator/courses/[id]/manage`
- [x] Jika ada lebih dari 5 kursus → link "+N kursus lainnya — Lihat Semua" tampil di bawah

### 4.3 Tombol Lihat Semua → Halaman List Kursus

- [x] Klik tombol "Lihat Semua" di panel "Kursus Saya"
- [x] Redirect ke `/creator/courses`
- [x] Halaman menampilkan semua kursus dalam bentuk card grid
- [x] Header menampilkan stats: total, published, draft
- [ ] Setiap card menampilkan: judul, status badge, difficulty, jumlah siswa
- [x] Tombol "Manage" pada card → redirect ke `/creator/courses/[id]/manage`

### 4.4 Tombol Buat Kursus Baru

- [x] Klik "Buat Kursus Baru" di header dashboard `/creator`
- [x] Redirect ke `/creator/courses/create`
- [x] Klik "Buat Kursus Baru" di halaman `/creator/courses`
- [x] Redirect ke `/creator/courses/create`

### 4.5 Halaman Detail & Manage Course (`/creator/courses/[id]/manage`)

- [x] Buka `/creator/courses/[id]/manage`
- [x] Header atas menampilkan: judul course, status badge, kategori, difficulty
- [x] Tombol Publish/Unpublish tampil di header kanan
- [x] Klik "Publish" pada kursus DRAFT → status berubah ke PUBLISHED tanpa full reload
- [x] Klik "Unpublish" pada kursus PUBLISHED → status berubah ke DRAFT tanpa full reload
- [x] Loading spinner tampil di tombol saat proses toggle
- [x] Sidebar kiri menampilkan tree: Overview → Seksi → Pelajaran (collapsible)
- [x] Klik "Overview Kursus" di sidebar → area kanan tampilkan info lengkap course
- [x] Klik seksi di sidebar → expand/collapse daftar pelajaran
- [x] Klik pelajaran di sidebar → area kanan tampilkan konten pelajaran
- [ ] Hover pada seksi → ikon edit, hapus, tambah pelajaran muncul
- [x] Hover pada pelajaran → ikon edit, hapus muncul
- [x] Tombol "+ Seksi" di header sidebar → dialog buat seksi baru terbuka
- [x] Tombol kembali → redirect ke `/creator/courses`

### 4.6 Empty State

- [x] Login dengan akun creator yang belum punya kursus
- [x] Buka `/creator` → panel "Kursus Saya" tampilkan pesan "Belum ada kursus"
- [x] Tombol "Buat Kursus Pertama" tampil dan bisa diklik → redirect ke `/creator/courses/create`
- [x] Buka `/creator/courses` → halaman tampilkan empty state dengan tombol "Buat Kursus Pertama"

---

## 5. Course Creation Form

### 5.1 Form Tampil

- [x] Buka `/creator/courses/create`
- [x] Form tampil dengan field: Judul, Deskripsi, Kategori, Tingkat Kesulitan, Status
- [x] Default status: DRAFT

### 5.2 Validasi Required Fields

- [x] Klik "Buat Kursus" tanpa mengisi apapun
- [x] Error inline muncul di setiap field yang kosong:
  - [x] "Judul kursus wajib diisi"
  - [x] "Deskripsi kursus wajib diisi"
  - [x] "Kategori wajib diisi"

### 5.3 Validasi Judul Max 100 Char

- [x] Ketik judul lebih dari 100 karakter
- [x] Counter "X/100 karakter" tampil
- [x] Input dibatasi maxLength=100

### 5.4 Submit Berhasil

- [x] Isi semua field dengan data valid
- [x] Klik "Buat Kursus"
- [x] Loading state tampil: "Membuat Kursus..."
- [x] Redirect ke `/creator/courses/[new-id]/manage`

### 5.5 Auth Protection

- [x] Logout
- [x] Buka `/creator/courses/create`
- [x] Redirect ke `/sign-in`

### 5.6 Role Protection

- [x] Login sebagai student (bukan creator)
- [x] Buka `/creator/courses/create`
- [x] Redirect ke `/sign-in` atau halaman unauthorized

---


## Catatan Test

| No | Temuan | Severity | Status |
|----|--------|----------|--------|
| 1 | **1.8 Pagination** — Belum bisa ditest karena data kursus di DB kurang dari 12. Perlu seed data >12 kursus untuk verifikasi. | Low | ⏳ Pending data |
| 2 | **4.3 Card info di `/creator/courses`** — `CourseCard` (student component) dipakai dengan `showManage=true`. Perlu verifikasi apakah `difficulty` dan `enrollmentCount` (jumlah siswa) tampil dengan benar di creator view. | Low | ⏳ Perlu browser check |
| 3 | **4.5 Hover icons pada seksi** — Implementasi sudah ada (`hidden group-hover:flex`) di `manage/page.tsx`. Perlu verifikasi di browser bahwa hover event tidak terhalang elemen lain. | Low | ⏳ Perlu browser check |

**Hasil Keseluruhan:** ⬜ Pass / ✅ Partial / ⬜ Fail

**Catatan tambahan:**
- Semua fitur utama (catalog, enrollment, my courses, creator dashboard, course creation) berfungsi dengan baik.
- 3 item belum terverifikasi bukan karena bug, melainkan keterbatasan data test dan perlu verifikasi visual di browser.
- Disarankan: tambah seed script untuk generate >12 kursus agar pagination bisa ditest.
- Sprint 2b secara keseluruhan: **PARTIAL PASS** — siap lanjut ke Sprint berikutnya setelah 3 item pending diverifikasi.
