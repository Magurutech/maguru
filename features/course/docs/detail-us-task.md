TSK-11 Sebagai siswa, saya ingin menelusuri dan mendaftar di kursus agar dapat mengakses materi pembelajaran.

Asumsi:

Aplikasi menggunakan Clerk untuk autentikasi.

Siswa sudah terautentikasi dengan role "user".

Database tersedia untuk menyimpan data pendaftaran kursus.

Detail:

Halaman katalog kursus menampilkan daftar kursus yang tersedia dengan informasi seperti judul, deskripsi, dan creator.

Tombol pendaftaran untuk setiap kursus, dengan konfirmasi setelah pendaftaran berhasil.

Kriteria Penerimaan:

Given saya adalah siswa,
When saya mengakses halaman katalog kursus,
Then saya dapat melihat daftar kursus yang tersedia.

Given saya adalah siswa,
When saya mengklik "Daftar" pada kursus,
Then saya dapat mendaftar dan melihat konfirmasi pendaftaran.

Given saya adalah siswa,
When saya mencoba mendaftar di kursus yang sudah saya ikuti,
Then saya diberitahu bahwa saya sudah terdaftar.

FlowChart:

(Start) -> [Login sebagai siswa] -> <Role valid?> ->
[Ya: Akses katalog kursus] -> [Pilih kursus] ->
[Daftar kursus] -> [Simpan pendaftaran] ->
[Tampilkan konfirmasi] ->
(End)
[Tidak: Tampilkan error] ->
(End)

Evaluasi INVEST:

Independent: Ya, dapat dikerjakan terpisah dari fitur lain.

Negotiable: Dapat didiskusikan (misalnya, desain katalog).

Valuable: Memberikan akses ke materi pembelajaran bagi siswa.

Estimable: Estimasi effort jelas (5 story points).

Small: Dapat diselesaikan dalam sprint.

Testable: Kriteria penerimaan dapat diuji.

<!-- ============================== -->

TSK-50 Desain UI untuk katalog kursus

Membuat wireframe atau mockup untuk halaman katalog kursus, termasuk daftar kursus dan tombol pendaftaran.

Checklist:

Desain tampilan daftar kursus.

Desain tombol pendaftaran.

Desain konfirmasi pendaftaran.

Estimasi Effort: 5 jam

Owner: Bob

Definisi Selesai: Wireframe atau mockup selesai dan disetujui oleh Product Owner.

Catatan Tambahan: Pastikan desain responsif dan sesuai dengan brand Maguru.

<!-- = -->

TSK-51 Implementasi backend untuk pendaftaran kursus dengan integrasi Clerk

Membuat API endpoint untuk pendaftaran kursus, termasuk penyimpanan data pendaftaran di database. Menambahkan middleware untuk memeriksa autentikasi di endpoint pendaftaran kursus.

Checklist:

Buat model pendaftaran di database.

Implementasi endpoint POST /enrollments untuk mendaftar kursus.

Implementasi endpoint GET /enrollments untuk mendapatkan daftar pendaftaran siswa.

Tambahkan pengecekan autentikasi di endpoint POST /enrollments.

Owner: Bob

Definisi Selesai: Endpoint berfungsi dengan benar, lulus unit test.Endpoint hanya dapat diakses oleh pengguna terautentikasi, lulus unit test.

Catatan Tambahan: Pastikan endpoint mencegah pendaftaran ganda.

<!-- = -->

TSK-52 Implementasi Front end untuk pendaftaran kursus

Menambahkanbusiness logic context dan hooks sesuai dengan Ui UX

Checklist:

Owner: Bob

Definisi Selesai:

Dependensi: T-006

Catatan Tambahan: Gunakan conetxt API React Query , dan jika pelru state yang complex gunakan Redux

TSK-53 Menulis unit test dan integration test untuk pendaftaran kursus

Membuat unit test untuk endpoint pendaftaran kursus, termasuk test untuk autentikasi.

Checklist:

Test untuk endpoint POST /enrollments.

Test untuk pengecekan autentikasi.

Test untuk skenario pendaftaran ganda.

Owner: Bob

Definisi Selesai: Semua unit test berhasil, coverage minimal 80%.

Catatan Tambahan: Pastikan test mencakup skenario positif dan negatif

TSk-67 Menulis test case e2e untuk pendaftaran kursus

Membuat test case e2e untuk skenario pendaftaran kursus, termasuk autentikasi.

Checklist:

Test case untuk siswa mendaftar kursus.

Test case untuk siswa mencoba mendaftar kursus yang sudah diikuti.

Test case untuk pengguna tidak terautentikasi (harus gagal).

Owner: Alice

Definisi Selesai: Test case ditulis dan dapat dijalankan dengan Playwright.

Estimasi Effort: 6 jam

Dependensi: Fitur pendaftaran kursus selesai

Catatan Tambahan: Pastikan test mencakup skenario autentikasi.
