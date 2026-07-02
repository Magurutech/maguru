# Maguru: Agile Sprint Planning & MVP V1 Roadmap

**Disusun oleh:** Agile Coach, Senior Scrum Master, Technical Project Manager, Product Manager, & Software Architect
**Tanggal:** 25 Juni 2026

## 1. Executive Summary

Dokumen ini menyajikan rencana eksekusi Agile Scrum untuk pengembangan *Minimum Viable Product (MVP) V1* Maguru. Berdasarkan PRD sebelumnya, target kita adalah meluncurkan platform pembelajaran *AI-Native* dengan fitur inti: *Course Content*, *Initial Assessment*, *AI Co-Teacher (RAG-based)*, dan *Project Submission* dalam waktu **10 minggu (5 Sprint)**.

Pendekatan ini dirancang khusus untuk tim startup tahap awal, menyeimbangkan kecepatan rilis dengan kualitas teknis, terutama dalam mengelola kompleksitas integrasi *Retrieval-Augmented Generation (RAG)*. Roadmap ini memprioritaskan fondasi teknis dan alur pengguna inti di awal, diikuti oleh integrasi AI, dan diakhiri dengan monetisasi serta polesan UX.

## 2. Product Backlog & Prioritization

Backlog disusun berdasarkan fitur MVP V1 dan diprioritaskan menggunakan kombinasi *Business Value*, *User Value*, *Technical Dependency*, dan *Validation Impact*.

| ID | Epic / Feature | Deskripsi Singkat | Priority | Dependency | Est. Effort (Story Points) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EPIC-1** | **User & Auth Foundation** | | | | |
| US-1.1 | User Registration & Login | Email/Password & Google Auth | P1 (High) | - | 5 |
| US-1.2 | User Profile Management | Edit nama, foto profil dasar | P3 (Low) | US-1.1 | 3 |
| **EPIC-2** | **Core Learning Engine** | | | | |
| US-2.1 | Course Data Model & CMS (Basic) | Skema DB kursus & admin input | P1 (High) | - | 8 |
| US-2.2 | Course Listing & Detail Page | Tampilan daftar dan detail kursus | P1 (High) | US-2.1 | 5 |
| US-2.3 | Micro-Learning Content Viewer | UI untuk teks, video embed, kuis | P1 (High) | US-2.1 | 8 |
| US-2.4 | Basic Progress Tracking | Lacak penyelesaian modul | P2 (Med) | US-2.3, US-1.1 | 5 |
| **EPIC-3** | **Assessment & Project** | | | | |
| US-3.1 | Initial Assessment Engine | Logic kuis awal & skor | P1 (High) | US-2.1 | 5 |
| US-3.2 | Basic Learning Path Rec. | Rekomendasi modul statis/rule-based | P2 (Med) | US-3.1, US-2.3 | 5 |
| US-3.3 | Project Submission Form | Upload file proyek akhir | P2 (Med) | US-2.3 | 5 |
| **EPIC-4** | **AI Co-Teacher (RAG)** | | | | |
| US-4.1 | RAG Infrastructure Setup | Setup Vector DB, Embedding Model | P1 (High) | - | 8 |
| US-4.2 | Knowledge Base Ingestion | Pipeline upload PDF/MD ke Vector DB | P1 (High) | US-4.1 | 8 |
| US-4.3 | AI Chat Interface (UI) | UI chat bubble, input bar | P2 (Med) | - | 5 |
| US-4.4 | LLM Integration & Prompting | Koneksi LLM API, context retrieval | P1 (High) | US-4.1, US-4.2 | 8 |
| US-4.5 | AI Chat History & Context | Simpan riwayat chat per user/kursus | P2 (Med) | US-4.4, US-1.1 | 5 |
| **EPIC-5** | **Monetization & Analytics** | | | | |
| US-5.1 | Course Purchase Flow | UI keranjang/checkout | P1 (High) | US-2.2, US-1.1 | 5 |
| US-5.2 | Payment Gateway Integration | Koneksi API (misal: Midtrans/Xendit) | P1 (High) | US-5.1 | 8 |
| US-5.3 | Basic Analytics Dashboard | Lacak user, pembelian, AI usage | P3 (Low) | All | 5 |

## 3. Feature Dependency Map & Critical Path

Memahami ketergantungan sangat penting untuk menghindari *bottleneck*.

*   **Critical Path 1 (Core Platform)**: `US-1.1 (Auth)` -> `US-2.1 (Course DB)` -> `US-2.3 (Content Viewer)` -> `US-5.1 & 5.2 (Payment)`. Tanpa ini, pengguna tidak bisa mendaftar, melihat konten, atau membayar.
*   **Critical Path 2 (AI Value Prop)**: `US-4.1 (RAG Setup)` -> `US-4.2 (Data Ingestion)` -> `US-4.4 (LLM Integration)` -> `US-4.3 (Chat UI)`. Tanpa ini, UVP utama Maguru tidak ada.

**Strategi Paralel**: Tim Backend/AI dapat mulai mengerjakan `EPIC-4 (RAG)` secara paralel dengan tim Frontend/Fullstack yang mengerjakan `EPIC-1` dan `EPIC-2`.

## 4. Sprint Roadmap (10 Minggu / 5 Sprint)

*Asumsi: 1 Sprint = 2 Minggu. Tim terdiri dari 2 Fullstack/Backend, 1 Frontend, 1 AI/Data Engineer.*

*   **Sprint 0 (Setup & Architecture)**: Persiapan infrastruktur, CI/CD, desain DB, dan *design system setup*.
*   **Sprint 1 (Foundation & Core Learning)**: Autentikasi, struktur kursus, dan penampil konten dasar.
*   **Sprint 2 (AI Infrastructure & Assessment)**: Setup RAG *backend*, *Initial Assessment*, dan UI Chat.
*   **Sprint 3 (AI Integration & Project)**: Menghubungkan LLM dengan UI, *Project Submission*, dan *Progress Tracking*.
*   **Sprint 4 (Monetization & Polish)**: Integrasi pembayaran, *analytics* dasar, dan *bug fixing*.
*   **Sprint 5 (Hardening & Launch)**: Uji coba *end-to-end*, UAT, perbaikan UI/UX, dan rilis produksi.

---

## 5. Sprint Breakdown Detail

### Sprint 0: Architecture & Environment Setup (Minggu 1-2)
*   **Sprint Goal**: Menyiapkan fondasi teknis, repositori, CI/CD *pipeline*, dan *design system tokens* di *frontend*.
*   **Fitur**:
    *   Setup *repository* (Frontend & Backend).
    *   Setup *database* (PostgreSQL/MongoDB) dan Vector DB (Pinecone/Weaviate).
    *   Implementasi *Design Tokens* (Warna, Tipografi) ke CSS/Tailwind.
    *   Desain skema *database* awal.
*   **Deliverables**: Lingkungan *development* dan *staging* siap digunakan. *Hello World* app *deployed*.

### Sprint 1: Foundation & Core Learning (Minggu 3-4)
*   **Sprint Goal**: Pengguna dapat mendaftar, login, dan melihat daftar serta detail kursus statis.
*   **Fitur**:
    *   `US-1.1`: User Registration & Login (JWT/OAuth).
    *   `US-2.1`: Course Data Model & CMS (API & UI Admin sederhana).
    *   `US-2.2`: Course Listing & Detail Page (UI Frontend).
*   **Prioritas**: P1. Ini adalah pintu masuk pengguna.
*   **Definition of Done (DoD)**: Pengguna bisa buat akun, login, dan melihat halaman kursus yang datanya diambil dari *database*.

### Sprint 2: AI Infrastructure & Assessment (Minggu 5-6)
*   **Sprint Goal**: Membangun mesin *assessment* awal dan menyiapkan *backend* RAG untuk menelan dokumen kursus.
*   **Fitur**:
    *   `US-3.1`: Initial Assessment Engine (API & UI Kuis).
    *   `US-4.1`: RAG Infrastructure Setup (Koneksi Vector DB).
    *   `US-4.2`: Knowledge Base Ingestion (Script untuk *chunking* & *embedding* PDF/MD).
    *   `US-4.3`: AI Chat Interface (UI Frontend statis).
*   **Prioritas**: P1. Memulai pekerjaan AI sedini mungkin untuk mitigasi risiko.
*   **DoD**: Kuis *assessment* bisa diselesaikan dan skor tersimpan. Dokumen kursus berhasil di-*embed* ke Vector DB. UI Chat muncul di layar.

### Sprint 3: AI Integration & Project (Minggu 7-8)
*   **Sprint Goal**: Menghidupkan AI Co-Teacher agar bisa menjawab berdasarkan konteks kursus, dan pengguna bisa mengunggah proyek.
*   **Fitur**:
    *   `US-4.4`: LLM Integration & Prompting (Menghubungkan UI Chat -> Backend -> Vector DB -> LLM -> UI).
    *   `US-2.3`: Micro-Learning Content Viewer (Menampilkan materi kursus sebenarnya).
    *   `US-3.3`: Project Submission Form (Upload ke S3/Cloud Storage).
*   **Prioritas**: P1. Ini adalah *core value proposition* Maguru.
*   **DoD**: Pengguna bisa *chat* dengan AI dan mendapat jawaban relevan dari materi. Pengguna bisa membaca materi dan *upload file* proyek.

### Sprint 4: Monetization & Polish (Minggu 9-10)
*   **Sprint Goal**: Mengunci alur pendapatan dan melengkapi fitur pelacakan progres.
*   **Fitur**:
    *   `US-5.1`: Course Purchase Flow (UI Checkout).
    *   `US-5.2`: Payment Gateway Integration (Midtrans/Xendit API).
    *   `US-2.4`: Basic Progress Tracking.
    *   `US-4.5`: AI Chat History (Simpan riwayat percakapan).
*   **Prioritas**: P1 & P2. Esensial untuk validasi bisnis (WTP).
*   **DoD**: Pengguna bisa melakukan simulasi pembayaran sukses. Progres belajar tersimpan. Riwayat *chat* AI tidak hilang saat *refresh*.

### Sprint 5: Hardening, UAT & Launch (Minggu 11-12)
*   **Sprint Goal**: Memastikan platform stabil, aman, dan siap digunakan oleh pengguna nyata.
*   **Fitur**:
    *   *Bug fixing* dari hasil QA internal.
    *   *User Acceptance Testing* (UAT) internal.
    *   Optimasi *prompt* AI Co-Teacher (mengurangi halusinasi).
    *   Persiapan data produksi (1-2 kursus final diunggah).
*   **Deliverables**: MVP V1 Live di *production environment*.

---

## 6. Risk Analysis & Mitigation

### a. Technical Risks
*   **Risiko**: Kualitas respons RAG buruk (halusinasi atau tidak relevan).
    *   **Mitigasi**: Alokasikan waktu ekstra di Sprint 3 & 5 untuk *Prompt Engineering* dan *Chunking Strategy* dokumen. Gunakan model LLM yang andal (misal: GPT-4o-mini atau Claude 3.5 Haiku untuk kecepatan dan biaya).
*   **Risiko**: Integrasi Payment Gateway tertunda karena proses verifikasi bisnis.
    *   **Mitigasi**: Mulai proses pendaftaran akun *payment gateway* (legalitas bisnis) di Sprint 0, jangan tunggu sampai Sprint 4. Gunakan *sandbox environment* untuk *development*.

### b. Scope Creep Risks
*   **Risiko**: Tim tergoda menambahkan fitur "keren" pada AI (misal: *voice chat*, *auto-grading* kompleks).
    *   **Mitigasi**: Scrum Master harus ketat menjaga *Sprint Backlog*. Fitur di luar PRD MVP V1 otomatis masuk ke *Icebox* untuk MVP V2.

### c. Bottleneck Risks
*   **Risiko**: Tim Frontend menunggu API dari Backend selesai.
    *   **Mitigasi**: Gunakan *API Mocking* (misal: Postman/Swagger) di awal Sprint. Sepakati *API Contract* (JSON *response format*) sebelum *coding* dimulai.

## 7. Final Recommendation

Untuk memastikan MVP V1 Maguru rilis tepat waktu dalam 2-3 bulan, **disiplin eksekusi adalah kunci**. 

1.  **Fokus pada "Happy Path"**: Pastikan alur utama (Daftar -> Beli -> Belajar -> Tanya AI -> Lulus) berjalan mulus tanpa *error*. Kasus *edge-case* (misal: lupa password yang rumit, *refund*) bisa ditangani secara manual di fase awal.
2.  **RAG is the Kingmaker**: Alokasikan *resource* terbaik Anda untuk memastikan AI Co-Teacher benar-benar memberikan jawaban kontekstual. Jika AI ini gagal, *value proposition* Maguru gagal.
3.  **Daily Standups & Blockers**: Lakukan *daily standup* maksimal 15 menit. Fokus pada identifikasi *blocker*, terutama yang berkaitan dengan integrasi AI dan *Payment*.

Dengan *roadmap* ini, tim pengembang memiliki panduan yang jelas, terukur, dan terprioritas untuk mewujudkan visi Maguru menjadi produk nyata yang siap divalidasi ke pasar.
