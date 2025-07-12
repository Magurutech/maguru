# User Story 5: Pengelolaan Metadata Kursus

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Acceptance Criteria](#acceptance-criteria)
3. [Batasan dan Penyederhanaan](#batasan-dan-penyederhanaan)
4. [Flow Pengguna](#flow-pengguna)
5. [Task Breakdown](#task-breakdown)
6. [Definition of Done](#definition-of-done)
7. [Pertanyaan untuk Diklarifikasi](#pertanyaan-untuk-diklarifikasi)

## Pendahuluan

**User Story**: Sebagai creator, saya ingin membuat dan mengelola metadata kursus (tambah, edit, hapus) agar dapat menyusun struktur konten pendidikan.

**Nilai Bisnis**: Fitur ini menjadi fondasi bagi creator untuk menyusun dan mengorganisir konten pendidikan mereka di platform Maguru. Dengan metadata kursus yang terstruktur, creator dapat membangun hierarki pembelajaran yang jelas (kursus → modul → pelajaran).

**Konteks Sprint**: User Story ini merupakan prioritas utama Sprint #2, membangun fondasi sistem manajemen kursus sebelum fitur konten editing dikembangkan di sprint selanjutnya.

## Acceptance Criteria

| ID   | Kriteria                                                                                                   | Prioritas   |
| ---- | ---------------------------------------------------------------------------------------------------------- | ----------- |
| AC-1 | Creator dapat mengakses halaman pembuatan kursus melalui `app/creator/course-manage`                       | Must Have   |
| AC-2 | Creator dapat mengisi form metadata (judul, deskripsi, struktur modul/pelajaran) dan menyimpan kursus baru | Must Have   |
| AC-3 | Creator dapat melihat daftar semua kursus yang telah mereka buat dengan metadata lengkap                   | Must Have   |
| AC-4 | Creator dapat mengedit metadata kursus yang sudah ada                                                      | Must Have   |
| AC-5 | Creator dapat menghapus kursus (dengan konfirmasi)                                                         | Must Have   |
| AC-6 | Hanya user dengan role "creator" atau "admin" yang dapat mengakses fitur ini                               | Must Have   |
| AC-7 | Sistem menampilkan pesan error yang jelas untuk input yang tidak valid                                     | Should Have |
| AC-8 | Interface responsif dan user-friendly di desktop dan mobile                                                | Should Have |

## Batasan dan Penyederhanaan

1. **Ruang Lingkup Metadata**:
   - Hanya mencakup metadata kursus: judul, deskripsi, dan struktur (modul & pelajaran)
   - Tidak termasuk konten aktual (teks, video, quiz)
   - Tidak ada upload file atau media dalam sprint ini

2. **Editor Konten**:
   - Integrasi Tiptap atau rich text editor ditunda ke sprint berikutnya
   - Deskripsi menggunakan textarea sederhana sementara

3. **Struktur Kursus**:
   - Struktur modul dan pelajaran hanya berupa nama/judul
   - Tidak ada pengaturan urutan atau hierarki kompleks
   - Tidak ada preview atau konten placeholder

4. **Fitur Lanjutan**:
   - Tidak ada fitur publish/unpublish
   - Tidak ada kategori atau tags kursus
   - Tidak ada sharing atau collaboration

## Flow Pengguna

### Flow Utama: Membuat Kursus Baru

1. Creator login dan mengakses `/creator/course-manage`
2. Sistem memverifikasi role creator/admin
3. Creator mengklik tombol "Buat Kursus Baru"
4. Sistem menampilkan form pembuatan kursus
5. Creator mengisi metadata kursus (judul, deskripsi, struktur)
6. Creator menyimpan kursus
7. Sistem memvalidasi dan menyimpan ke database
8. Creator dialihkan ke daftar kursus dengan notifikasi sukses

**Happy Path**: Semua data valid, kursus berhasil disimpan

**Error Paths**:

- Judul kosong atau terlalu pendek → Error validation
- Tidak ada koneksi database → Error server
- Session expired → Redirect ke login

### Flow Alternatif: Mengedit/Menghapus Kursus

1. Creator melihat daftar kursus di `/creator/course-manage`
2. Creator memilih aksi edit/hapus pada kursus tertentu
3. **Edit**: Form pre-filled dengan data existing → Update → Konfirmasi
4. **Hapus**: Modal konfirmasi → Hapus → Refresh daftar

## Task Breakdown

| Task ID | Nama Task                              | Estimasi | Dependensi     |
| ------- | -------------------------------------- | -------- | -------------- |
| TSK-46  | Desain UI untuk pembuatan kursus       | 2 SP     | -              |
| TSK-47  | Implementasi Backend untuk CRUD kursus | 3 SP     | TSK-46         |
| TSK-48  | Integrasi dengan Clerk untuk otorisasi | 2 SP     | TSK-47         |
| TSK-49  | Unit test dan integration test         | 2 SP     | TSK-47, TSK-48 |
| TSK-66  | E2E test untuk pembuatan kursus        | 1 SP     | TSK-49         |

**Total Estimasi**: 10 Story Points

## Definition of Done

- [ ] Semua acceptance criteria terpenuhi
- [ ] UI design approved dan responsif
- [ ] Backend API endpoints berfungsi dengan benar
- [ ] Integrasi Clerk untuk role-based access berhasil
- [ ] Unit test coverage minimal 80%
- [ ] Integration test untuk semua flow utama
- [ ] E2E test menggunakan Playwright
- [ ] Code review selesai dan approved
- [ ] Documentation lengkap (task docs + result docs)
- [ ] Manual testing oleh Product Owner

## Pertanyaan untuk Diklarifikasi

1. **Struktur Kursus**: Apakah struktur modul/pelajaran perlu mendukung nested hierarchy (submodul) atau cukup 2 level (modul → pelajaran)?
Jawab: Kita akan meggunakan pendekatan 2 level  (modul -> page) untuk setiap course learning

2. **Validasi Data**: Apakah ada batasan minimum/maksimum untuk judul dan deskripsi kursus?
Jawba: mungkin 30 huruf untuk judul telah cukup, deksripsi sesuaikan saja 

3. **Soft Delete**: Apakah kursus yang dihapus perlu soft delete (tersimpan di database) atau hard delete?
Jawab: menurut rekomendasimu lebih baik emnggunakan pendekatan yang mana? jika dilihat dari kelemahan dan kelebihannya, maka soft delete lebih baik.

4. **Creator Ownership**: Apakah admin dapat melihat dan mengedit kursus dari creator lain?
Jawab: tidak, hanya creator yang dapat melihat dan mengedit kursus, jadi course nya hanya dapat di edit oleh yang membuatnya, admin sendiri juga punya akses ke semua course yang dibuat oleh creator lain. tapi hanya crator yang bisa mengedit course nya.

5. **Archived vs Draft vs Published**: Apakah kursus otomatis dalam status "draft" atau langsung "published" saat dibuat?
Jawab: kursus otomatis dalam status "draft" saat dibuat, untuk di publish atau dijadikan live, creator harus melakukan proses publish manual. tetapi pada saat proses pengeditan course di page editor nantinya maka course akan mode "draft" tetapi data course yang di tampilkan di User course adalah data yang sudah di publish.

6. **Media Upload**: Untuk sprint ini, apakah perlu placeholder untuk thumbnail kursus atau bisa diabaikan?
Jawab: kita pelru menambahkn thumbnail awal untuk course nya, untuk tampilan course nya.

7. **Pagination**: Jika creator memiliki banyak kursus, apakah perlu pagination di daftar kursus?
Jawab : tidak perlu pagination di daftar kursus, karena creator bisa melihat semua kursus yang dibuat oleh mereka. mungkin dapat membuat 2 versi course ang ditampilkan dalam list dan course yang di tampilkan dalam bentuk card 

8. **Search/Filter**: Apakah perlu fitur pencarian atau filter di daftar kursus creator?
Jawab: perlu, agar lebih memudahkan
