# Maguru: Sprint 1 Backlog & Execution Plan

**Disusun oleh:** Senior Scrum Master, Technical Project Manager
**Tanggal:** 25 Juni 2026
**Durasi Sprint:** 2 Minggu (Minggu 3-4 dari total 10 minggu MVP V1)

## 1. Executive Summary

Dokumen ini merinci rencana eksekusi untuk Sprint 1 pengembangan MVP V1 Maguru. Sprint ini berfokus pada pembangunan fondasi inti platform: **sistem autentikasi pengguna** dan **struktur dasar untuk manajemen serta tampilan kursus**. Tujuannya adalah agar pengguna dapat mendaftar, masuk, dan melihat daftar serta detail kursus statis. Sprint ini sangat krusial karena meletakkan dasar bagi semua fitur pembelajaran dan AI yang akan dibangun di sprint-sprint berikutnya.

## 2. Sprint Goal

**Pengguna dapat mendaftar, login, dan melihat daftar serta detail kursus yang datanya diambil dari database.**

## 3. Sprint Backlog & Task Breakdown

Berikut adalah User Stories yang akan dikerjakan di Sprint 1, beserta rincian tugas teknis (Frontend, Backend, Database) dan estimasi *story points* (SP). Asumsi tim: 2 Fullstack/Backend, 1 Frontend.

### User Story 1.1: User Registration & Login
**Deskripsi:** Sebagai pengguna baru, saya ingin dapat mendaftar akun dan masuk ke platform agar saya bisa mengakses fitur pembelajaran.
**Prioritas:** Must Have (P1)
**Alasan Penempatan:** Fondasi utama untuk interaksi pengguna dan personalisasi.
**Estimasi Effort:** 5 SP

#### Tasks:
*   **Backend (Authentication Service)**:
    *   Setup `Auth Service` (Node.js/Python) dengan Express/FastAPI.
    *   Implementasi endpoint `/register` (email, password hashing).
    *   Implementasi endpoint `/login` (email, password verification, JWT generation).
    *   Implementasi endpoint `/auth/google` (OAuth2 flow dengan Google).
    *   Setup `JWT` token generation dan validation (access & refresh tokens).
    *   Integrasi dengan database untuk menyimpan user data.
    *   Unit & Integration Tests untuk Auth Service.
*   **Frontend (Auth UI)**:
    *   Desain dan implementasi halaman `Register` (form input email, password, konfirmasi password).
    *   Desain dan implementasi halaman `Login` (form input email, password).
    *   Implementasi tombol `Login with Google`.
    *   Integrasi dengan Auth Service API untuk proses register dan login.
    *   Penyimpanan `JWT` di `localStorage` atau `httpOnly cookies`.
    *   Implementasi `Protected Routes` (redirect jika belum login).
*   **Database (User Schema)**:
    *   Buat tabel `users` dengan kolom: `id (PK)`, `email (UNIQUE)`, `password_hash`, `google_id (NULLABLE)`, `created_at`, `updated_at`.
    *   Buat tabel `refresh_tokens` untuk manajemen sesi.

#### Acceptance Criteria:
*   Pengguna dapat mendaftar dengan email dan password yang valid.
*   Pengguna dapat login dengan kredensial yang terdaftar.
*   Pengguna dapat login menggunakan akun Google.
*   Setelah login, pengguna diarahkan ke halaman *dashboard* atau daftar kursus.
*   Pengguna yang belum login tidak dapat mengakses halaman yang dilindungi.
*   Password disimpan dalam bentuk *hash* yang aman di database.

### User Story 2.1: Course Data Model & CMS (Basic)
**Deskripsi:** Sebagai admin, saya ingin dapat memasukkan dan mengelola data kursus dasar agar pengguna dapat melihat daftar kursus yang tersedia.
**Prioritas:** Must Have (P1)
**Alasan Penempatan:** Memungkinkan adanya konten kursus yang akan ditampilkan kepada pengguna.
**Estimasi Effort:** 8 SP

#### Tasks:
*   **Backend (Course Service)**:
    *   Setup `Course Service` (Node.js/Python) dengan Express/FastAPI.
    *   Implementasi endpoint `/courses` (GET all courses, GET course by ID).
    *   Implementasi endpoint `/admin/courses` (POST, PUT, DELETE course - *basic auth*).
    *   Integrasi dengan database untuk menyimpan data kursus.
    *   Unit & Integration Tests untuk Course Service.
*   **Frontend (Admin UI - Basic)**:
    *   Buat halaman admin sederhana untuk `Tambah/Edit Kursus` (form input judul, deskripsi, harga, gambar, status).
    *   Integrasi dengan Course Service API untuk CRUD kursus.
*   **Database (Course Schema)**:
    *   Buat tabel `courses` dengan kolom: `id (PK)`, `title`, `description`, `price`, `image_url`, `status (DRAFT/PUBLISHED)`, `created_at`, `updated_at`.
    *   Buat tabel `modules` dengan kolom: `id (PK)`, `course_id (FK)`, `title`, `order`, `created_at`, `updated_at`.
    *   Buat tabel `lessons` dengan kolom: `id (PK)`, `module_id (FK)`, `title`, `content_type (TEXT/VIDEO/QUIZ)`, `content_url`, `order`, `created_at`, `updated_at`.

#### Acceptance Criteria:
*   Admin dapat menambahkan, mengedit, dan menghapus data kursus melalui UI admin.
*   Data kursus (judul, deskripsi, harga, gambar) tersimpan dengan benar di database.
*   API `/courses` dapat mengembalikan daftar kursus yang berstatus `PUBLISHED`.
*   API `/courses/{id}` dapat mengembalikan detail kursus tertentu.

### User Story 2.2: Course Listing & Detail Page
**Deskripsi:** Sebagai pengguna, saya ingin dapat melihat daftar semua kursus yang tersedia dan detail dari setiap kursus agar saya bisa memilih kursus yang ingin saya ikuti.
**Prioritas:** Must Have (P1)
**Alasan Penempatan:** Menampilkan value proposition inti Maguru kepada pengguna.
**Estimasi Effort:** 5 SP

#### Tasks:
*   **Frontend (Course UI)**:
    *   Desain dan implementasi halaman `Course Listing` (menampilkan daftar `Course Card`).
    *   Desain dan implementasi halaman `Course Detail` (menampilkan judul, deskripsi, gambar, harga, tombol "Beli Kursus").
    *   Integrasi dengan Course Service API untuk mengambil data kursus.
    *   Implementasi *routing* untuk navigasi antar halaman daftar dan detail kursus.

#### Acceptance Criteria:
*   Pengguna dapat melihat daftar kursus yang tersedia di halaman utama/dashboard.
*   Setiap kursus di daftar menampilkan informasi dasar (judul, gambar).
*   Pengguna dapat mengklik kursus untuk melihat halaman detailnya.
*   Halaman detail kursus menampilkan semua informasi relevan (judul, deskripsi, harga, gambar).
*   Tombol "Beli Kursus" terlihat jelas di halaman detail kursus.

## 4. Technical Considerations & Notes

*   **API Contract**: Sebelum implementasi, tim Frontend dan Backend harus menyepakati *API Contract* (struktur JSON request/response) untuk semua endpoint di Sprint 1. Gunakan OpenAPI/Swagger untuk dokumentasi.
*   **Error Handling**: Implementasi *basic error handling* untuk API (misal: 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Server Error) dan tampilkan pesan error yang *user-friendly* di Frontend.
*   **Design System Integration**: Pastikan komponen UI yang dibangun (Button, Input, Card) menggunakan *design tokens* dan *component guidelines* dari `Maguru Design System Handbook`.
*   **Database Migrations**: Gunakan *database migration tool* (misal: Knex.js, Alembic) untuk mengelola perubahan skema database secara terstruktur.
*   **Version Control**: Semua kode harus di-*commit* ke Git repository dengan *branching strategy* yang jelas (misal: Git Flow atau Trunk-Based Development).

## 5. Definition of Done (DoD) for Sprint 1

Sebuah User Story dianggap selesai (Done) di Sprint 1 jika:
*   Semua *tasks* terkait telah diselesaikan.
*   Semua *Acceptance Criteria* terpenuhi.
*   Kode telah di-*review* oleh setidaknya satu rekan tim (Peer Review).
*   Unit dan Integration Tests telah ditulis dan lolos (minimal 80% *code coverage* untuk *critical paths*).
*   Fitur telah di-*deploy* ke lingkungan *staging*.
*   Tidak ada *bug* kritis yang ditemukan selama pengujian internal.
*   Dokumentasi teknis (API, DB Schema) telah diperbarui.

## 6. Potential Risks & Mitigation for Sprint 1

*   **Risiko**: Keterlambatan dalam setup lingkungan development/deployment.
    *   **Mitigasi**: Pastikan Sprint 0 benar-benar selesai dan semua *tooling* dasar berfungsi sebelum Sprint 1 dimulai. Alokasikan waktu untuk *troubleshooting* di awal sprint.
*   **Risiko**: Ketidaksesuaian antara ekspektasi Frontend dan implementasi Backend API.
    *   **Mitigasi**: Adakan sesi *API Contract Alignment* di awal sprint. Gunakan *mock API* di Frontend jika Backend belum siap.
*   **Risiko**: Kompleksitas integrasi OAuth2 Google lebih tinggi dari perkiraan.
    *   **Mitigasi**: Prioritaskan email/password auth terlebih dahulu. Jika waktu mepet, OAuth2 bisa disederhanakan atau ditunda ke Sprint berikutnya jika tidak menghambat *core user flow*.

## 7. Deliverables for Sprint 1

*   Fungsionalitas pendaftaran dan login pengguna (email/password, Google).
*   API untuk manajemen kursus (CRUD oleh admin).
*   API untuk menampilkan daftar dan detail kursus kepada pengguna.
*   Halaman pendaftaran/login di Frontend.
*   Halaman daftar kursus di Frontend.
*   Halaman detail kursus di Frontend.
*   Database schema untuk user dan kursus.
*   Kode yang teruji dan terdokumentasi.
*   Fitur ter-deploy di lingkungan *staging*.
