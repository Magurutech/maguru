# Maguru: Product Requirements Document (PRD) - MVP V1

**Disusun oleh:** Senior Product Manager, Product Owner, Startup Founder, UX Strategist, & Technical Product Lead
**Tanggal:** 21 Juni 2026

## Executive Summary

Dokumen ini adalah Product Requirements Document (PRD) untuk *Minimum Viable Product (MVP) V1* Maguru. MVP V1 ini berfokus pada validasi asumsi inti bahwa pembelajar teknologi bersedia menggunakan dan membayar platform pembelajaran yang mampu mempersonalisasi jalur belajar dan memberikan pendampingan AI berbasis *course knowledge* yang terpercaya. Target utama MVP ini adalah persona **"Budi, The Career Upskiller"**.

PRD ini akan menguraikan secara detail ruang lingkup MVP, alur pengguna, persyaratan fungsional dan non-fungsional, spesifikasi fitur kunci, persyaratan data, metrik keberhasilan, risiko, kriteria rilis, dan pertimbangan masa depan. Tujuannya adalah untuk memberikan panduan yang jelas bagi tim pengembangan, memastikan fokus pada fitur-fitur esensial yang akan memvalidasi *Problem-Solution Fit* dan *Value Proposition* Maguru dalam waktu 2-3 bulan.

---

## 1. Product Overview

### a. Ringkasan Produk
Maguru MVP V1 adalah platform pembelajaran *AI-Native* yang menyediakan satu atau dua kursus *project-based* untuk *digital skills* (misalnya, *Python for Data Analyst* atau *Basic Web Development*). Inti dari pengalaman ini adalah **AI Co-Teacher berbasis RAG Course Knowledge Base** yang memberikan bimbingan kontekstual dan personalisasi jalur belajar awal, serta *micro-learning* dan *project-based learning* untuk *competency mastery*.

### b. Problem Statement
Pembelajar teknologi pemula, khususnya *fresh graduate* dan mahasiswa yang ingin *upskill/reskill* (seperti Budi, The Career Upskiller), kesulitan menemukan platform pembelajaran yang: 
1. Menyediakan jalur belajar yang personal dan adaptif sesuai kemampuan awal dan tujuan karier mereka.
2. Memberikan bimbingan instan dan kontekstual dari AI yang memahami materi kursus secara mendalam, bukan AI generik yang sering halusinasi.
3. Fokus pada *competency mastery* melalui *project-based learning* yang relevan dengan industri, bukan hanya penyelesaian kursus.

### c. Target User
**Primary Persona:** Budi, The Career Upskiller (Mahasiswa tingkat akhir/Fresh Graduate dari jurusan non-IT yang ingin beralih karier ke bidang teknologi).

### d. Business Objective
Memvalidasi *Problem-Solution Fit* dan *Willingness to Pay* untuk pengalaman belajar *AI-Native* yang personal dan *project-based* di segmen *career upskiller*.

### e. Success Criteria MVP
*   **Activation**: Minimal 70% pengguna yang mendaftar menyelesaikan *Initial Assessment*.
*   **Engagement**: Minimal 60% pengguna berinteraksi dengan AI Co-Teacher setidaknya 3 kali per sesi belajar.
*   **Completion**: Minimal 40% pengguna menyelesaikan kursus pertama dan proyek akhirnya.
*   **Monetization**: Minimal 5% *conversion rate* dari *free trial* (jika ada) ke pembelian kursus, atau *willingness to pay* yang terbukti melalui *landing page test*.
*   **Satisfaction**: Minimal 7/10 skor kepuasan pengguna terhadap kualitas bimbingan AI Co-Teacher dan relevansi materi.

---

## 2. MVP Scope

### a. In Scope
*   **User Management**: Registrasi, login, profil dasar.
*   **Course Discovery & Purchase**: Halaman deskripsi kursus, alur pembelian satu kursus, integrasi *payment gateway*.
*   **Core Learning Experience**: Akses ke 1-2 kursus *project-based* (teks, video, kuis, *micro-learning modules*).
*   **Initial Assessment**: Tes awal untuk memetakan kemampuan dan merekomendasikan jalur belajar awal.
*   **AI Co-Teacher (RAG-based)**: Chatbot AI yang memberikan bimbingan kontekstual berdasarkan *Course Knowledge Base* kursus yang sedang diambil.
*   **Project Submission**: Mekanisme sederhana untuk mengunggah proyek akhir kursus.
*   **Basic Progress Tracking**: Visualisasi progres penyelesaian modul dan proyek.
*   **Admin Tools (Internal)**: CMS dasar untuk 1-2 kursus, manajemen *RAG Knowledge Base* dasar, manajemen pengguna dasar, *analytics dashboard* dasar.

### b. Out of Scope
*   Fitur komunitas (forum, peer-to-peer feedback).
*   Gamifikasi (badges, leaderboard, streaks).
*   Sertifikasi otomatis (bisa manual di awal).
*   Fully automated *Adaptive Learning Path Engine* (akan semi-otomatis/manual di MVP V1).
*   *Automated Code Review* yang canggih (hanya *basic checks* atau manual).
*   *AI-generated practice problems* atau *content summarization*.
*   Model langganan atau bundel kursus (fokus *pay-per-course*).
*   Integrasi dengan IDE eksternal atau *code sandbox* yang kompleks.

### c. Assumptions
*   Target persona "Budi, The Career Upskiller" memiliki *pain points* yang cukup kuat untuk mencari solusi berbayar.
*   Kualitas *RAG Course Knowledge Base* dan performa AI Co-Teacher akan cukup baik untuk memberikan nilai superior dan meminimalkan halusinasi.
*   Tim Maguru dapat membuat 1-2 kursus *project-based* berkualitas tinggi dalam waktu MVP.
*   Biaya operasional API LLM dapat dikelola dalam *unit economics* model *pay-per-course*.
*   Pengguna akan bersedia berinteraksi dengan AI Co-Teacher sebagai pengganti mentor manusia untuk bimbingan teknis.

### d. Constraints
*   **Waktu**: 2-3 bulan pengembangan.
*   **Sumber Daya**: Tim startup kecil (misalnya, 1-2 *backend*, 1-2 *frontend*, 1 *AI/ML engineer*, 1 *designer*, 1 *product manager*).
*   **Anggaran**: Terbatas, fokus pada solusi *cost-effective*.
*   **Teknologi**: Menggunakan *stack* yang efisien dan memungkinkan iterasi cepat.

---

## 3. User Personas

**Primary Persona untuk MVP V1:**

**Nama Persona:** Budi, The Career Upskiller

*   **Ringkasan Profil**: Mahasiswa tingkat akhir atau *fresh graduate* dari jurusan non-IT yang ingin beralih karier ke bidang teknologi. Ia merasa tertinggal dan membutuhkan pembelajaran yang praktis, relevan dengan industri, dan dapat dibuktikan melalui portofolio untuk meningkatkan daya saing di pasar kerja.
*   **Motivasi Belajar**: Mendapatkan pekerjaan yang lebih baik, gaji lebih tinggi, atau beralih ke industri teknologi. Mengisi *skill gap* untuk posisi yang diinginkan.
*   **Pain Points**: Kurikulum kampus tidak relevan, materi *online* terlalu teoritis/tidak praktis, kesulitan membangun portofolio, tidak ada *feedback* dari ahli industri, merasa tidak punya mentor.
*   **Tujuan Jangka Pendek**: Menguasai satu *digital skill* spesifik (misalnya Python untuk Data Analysis, dasar-dasar Web Development) dan memiliki proyek yang bisa dimasukkan ke portofolio.
*   **Willingness to Pay**: Sedang hingga tinggi. Bersedia membayar lebih jika ada jaminan kualitas, relevansi industri, dan hasil yang terukur (portofolio, peningkatan peluang kerja).

---

## 4. User Journey (End-to-End Flow for MVP V1)

### Scenario: Budi ingin belajar Python untuk Data Analysis agar bisa melamar posisi Data Analyst.

1.  **Awareness & Discovery**: Budi melihat iklan Maguru di media sosial (misalnya Instagram/LinkedIn) yang menyoroti "Belajar Python untuk Data Analyst dengan AI Co-Teacher & Proyek Nyata".
2.  **Landing Page & Course Exploration**: Budi mengklik iklan, mendarat di *landing page* Maguru yang menjelaskan UVP, fitur AI Co-Teacher, dan detail kursus "Python untuk Data Analyst". Ia melihat testimoni dan *curriculum outline*.
3.  **Registration & Purchase**: Budi tertarik, membuat akun Maguru, dan membeli kursus "Python untuk Data Analyst" melalui alur pembelian yang mudah dan *payment gateway* yang terintegrasi.
4.  **Onboarding & Initial Assessment**: Setelah pembelian, Budi diarahkan ke halaman *onboarding* singkat. Ia diminta untuk mengisi *Initial Assessment* untuk mengukur pemahaman dasar Python dan logika pemrograman.
5.  **Personalized Learning Path (Initial)**: Berdasarkan hasil *assessment*, Maguru merekomendasikan jalur belajar awal yang disesuaikan. Misalnya, jika Budi sudah tahu dasar Python, ia bisa melewati beberapa modul awal.
6.  **Core Learning Experience (Micro-Learning)**: Budi mulai belajar modul pertama. Materi disajikan dalam format *micro-learning* (video singkat, teks padat, kuis interaktif).
7.  **Interaction with AI Co-Teacher**: Budi *stuck* pada konsep *list comprehension* di Python. Ia membuka fitur AI Co-Teacher, mengetik pertanyaannya. AI Co-Teacher memberikan penjelasan kontekstual, contoh kode, dan referensi dari *Course Knowledge Base* Maguru.
8.  **Practice & Quiz**: Setelah modul, Budi mengerjakan soal latihan dan kuis untuk menguji pemahamannya. Progresnya tercatat.
9.  **Project Work**: Setelah beberapa modul, Budi mulai mengerjakan proyek akhir kursus (misalnya, "Analisis Data Penjualan dengan Python"). Ia menggunakan AI Co-Teacher untuk *debugging* atau mencari ide implementasi.
10. **Project Submission**: Budi menyelesaikan proyeknya dan mengunggah *file* kode/laporan melalui platform Maguru.
11. **Progress Tracking**: Budi melihat progresnya di dashboard, berapa persen kursus yang sudah diselesaikan dan status proyeknya.
12. **Completion**: Budi menyelesaikan semua modul dan proyek. Ia merasa telah menguasai skill yang dibutuhkan dan memiliki portofolio.

---

## 5. Functional Requirements

### 5.1. User Authentication & Profile
*   **Feature Name**: User Authentication
*   **Description**: Memungkinkan pengguna untuk mendaftar dan masuk ke platform Maguru.
*   **User Story**: 
    *   Sebagai pengguna baru, saya ingin bisa mendaftar akun Maguru menggunakan email/Google agar bisa mengakses platform.
    *   Sebagai pengguna terdaftar, saya ingin bisa login ke akun Maguru menggunakan email/Google agar bisa melanjutkan pembelajaran.
*   **Acceptance Criteria**: 
    *   Pengguna dapat mendaftar dengan email dan password.
    *   Pengguna dapat mendaftar/login dengan akun Google.
    *   Sistem memvalidasi format email dan kekuatan password.
    *   Pengguna menerima email verifikasi (opsional, bisa ditunda).
    *   Pengguna dapat mengatur ulang password.
*   **Business Rules**: 
    *   Email harus unik.
    *   Password minimal 8 karakter, kombinasi huruf besar, kecil, angka, simbol.
*   **Dependencies**: Backend user service, database.

*   **Feature Name**: User Profile Management
*   **Description**: Memungkinkan pengguna melihat dan mengedit informasi profil dasar mereka.
*   **User Story**: Sebagai pengguna, saya ingin bisa melihat dan mengedit nama, email, dan foto profil saya agar informasi saya akurat.
*   **Acceptance Criteria**: 
    *   Pengguna dapat melihat nama, email, dan foto profil.
    *   Pengguna dapat mengedit nama dan foto profil.
*   **Business Rules**: 
    *   Nama tidak boleh kosong.
*   **Dependencies**: Backend user service, database, *image storage*.

### 5.2. Course Discovery & Purchase
*   **Feature Name**: Course Listing & Detail Page
*   **Description**: Menampilkan daftar kursus yang tersedia dan halaman detail untuk setiap kursus.
*   **User Story**: Sebagai calon pembeli, saya ingin bisa melihat daftar kursus dan detailnya (deskripsi, kurikulum, harga) agar bisa memutuskan kursus mana yang akan saya beli.
*   **Acceptance Criteria**: 
    *   Menampilkan daftar 1-2 kursus MVP V1.
    *   Setiap kursus memiliki halaman detail dengan deskripsi, kurikulum, harga, dan UVP Maguru.
    *   Terdapat tombol "Beli Sekarang" atau "Mulai Belajar".
*   **Business Rules**: 
    *   Hanya kursus yang aktif yang ditampilkan.
*   **Dependencies**: Backend course service, database.

*   **Feature Name**: Course Purchase Flow
*   **Description**: Memungkinkan pengguna untuk membeli kursus.
*   **User Story**: Sebagai calon pembeli, saya ingin bisa membeli kursus yang saya inginkan dengan mudah agar bisa segera memulai belajar.
*   **Acceptance Criteria**: 
    *   Pengguna dapat menambahkan kursus ke keranjang (opsional, bisa langsung beli).
    *   Pengguna dapat melihat ringkasan pesanan dan total harga.
    *   Pengguna dapat memilih metode pembayaran.
    *   Pengguna menerima konfirmasi pembelian.
*   **Business Rules**: 
    *   Harga kursus sesuai dengan yang tertera.
    *   Pembelian hanya bisa dilakukan oleh pengguna yang login.
*   **Dependencies**: Backend order service, database, Payment Gateway Integration.

*   **Feature Name**: Payment Gateway Integration
*   **Description**: Mengintegrasikan Maguru dengan penyedia layanan pembayaran untuk memproses transaksi.
*   **User Story**: Sebagai pembeli, saya ingin bisa membayar kursus menggunakan metode pembayaran yang umum (misalnya, transfer bank, e-wallet) agar transaksi saya berhasil.
*   **Acceptance Criteria**: 
    *   Mendukung minimal 2 metode pembayaran populer di Indonesia (misalnya, Virtual Account, E-wallet).
    *   Transaksi tercatat di sistem Maguru.
    *   Penanganan *error* pembayaran.
*   **Business Rules**: 
    *   Integrasi dengan satu *payment gateway* pihak ketiga.
*   **Dependencies**: Payment Gateway API, Backend order service.

### 5.3. Core Learning Experience
*   **Feature Name**: Course Content Access
*   **Description**: Menyediakan akses ke materi pembelajaran (teks, video, kuis) dalam format *micro-learning modules*.
*   **User Story**: Sebagai pembelajar, saya ingin bisa mengakses materi kursus yang sudah saya beli agar bisa memulai belajar.
*   **Acceptance Criteria**: 
    *   Materi kursus ditampilkan per modul/unit.
    *   Mendukung format teks, video (embed dari YouTube/Vimeo), dan kuis sederhana.
    *   Pengguna dapat menandai modul sebagai selesai.
*   **Business Rules**: 
    *   Hanya pengguna yang telah membeli kursus yang dapat mengakses konten.
*   **Dependencies**: Backend course service, content storage.

*   **Feature Name**: Project-Based Learning Display
*   **Description**: Menampilkan instruksi dan persyaratan untuk proyek akhir kursus.
*   **User Story**: Sebagai pembelajar, saya ingin bisa melihat instruksi proyek akhir agar saya tahu apa yang harus saya kerjakan.
*   **Acceptance Criteria**: 
    *   Halaman khusus untuk instruksi proyek, termasuk tujuan, *deliverables*, dan kriteria penilaian.
*   **Business Rules**: 
    *   Proyek hanya bisa diakses setelah modul prasyarat selesai.
*   **Dependencies**: Backend course service, content storage.

### 5.4. Initial Assessment & Learning Path
*   **Feature Name**: Initial Assessment
*   **Description**: Tes singkat untuk mengukur tingkat pemahaman awal pengguna terhadap topik kursus.
*   **User Story**: Sebagai pembelajar, saya ingin mengerjakan tes awal agar Maguru bisa memahami kemampuan saya dan merekomendasikan jalur belajar yang sesuai.
*   **Acceptance Criteria**: 
    *   Tes terdiri dari 5-10 pertanyaan pilihan ganda atau isian singkat.
    *   Sistem mencatat jawaban dan skor pengguna.
    *   Hasil *assessment* digunakan sebagai input untuk rekomendasi jalur belajar awal.
*   **Business Rules**: 
    *   *Assessment* wajib diselesaikan sebelum memulai kursus utama.
*   **Dependencies**: Backend assessment service, database.

*   **Feature Name**: Basic Learning Path Recommendation
*   **Description**: Memberikan rekomendasi jalur belajar awal berdasarkan hasil *Initial Assessment*.
*   **User Story**: Sebagai pembelajar, saya ingin mendapatkan rekomendasi jalur belajar yang dipersonalisasi agar saya bisa belajar lebih efisien.
*   **Acceptance Criteria**: 
    *   Menampilkan urutan modul yang direkomendasikan.
    *   Memungkinkan pengguna untuk melewati modul yang sudah dikuasai (berdasarkan *assessment*).
*   **Business Rules**: 
    *   Rekomendasi bersifat statis atau semi-otomatis (algoritma sederhana atau *rule-based*).
*   **Dependencies**: Backend learning path service, assessment service.

### 5.5. AI Co-Teacher
*   **Feature Name**: AI Co-Teacher Chat Interface
*   **Description**: Antarmuka *chat* yang memungkinkan pengguna berinteraksi dengan AI Co-Teacher.
*   **User Story**: Sebagai pembelajar, saya ingin bisa bertanya kepada AI Co-Teacher tentang materi kursus agar saya mendapatkan bimbingan instan dan kontekstual.
*   **Acceptance Criteria**: 
    *   Antarmuka *chat* yang intuitif (input teks, riwayat *chat*).
    *   AI Co-Teacher merespons pertanyaan pengguna.
    *   Respons AI relevan dengan materi kursus yang sedang diambil pengguna.
    *   AI Co-Teacher dapat memberikan penjelasan, contoh kode, atau referensi dari *Course Knowledge Base*.
*   **Business Rules**: 
    *   AI Co-Teacher hanya menjawab pertanyaan terkait *Course Knowledge Base* yang relevan dengan kursus aktif pengguna.
    *   Respons AI harus bebas halusinasi dan akurat.
    *   Batasan jumlah pertanyaan per hari/kursus (opsional untuk MVP).
*   **Dependencies**: AI service (LLM, RAG engine), Backend chat service, Course Knowledge Base.

### 5.6. Progress Tracking & Project Submission
*   **Feature Name**: Basic Progress Tracking
*   **Description**: Menampilkan progres penyelesaian modul dan status proyek pengguna.
*   **User Story**: Sebagai pembelajar, saya ingin bisa melihat progres belajar saya agar saya tetap termotivasi.
*   **Acceptance Criteria**: 
    *   Menampilkan persentase penyelesaian kursus.
    *   Menampilkan modul mana yang sudah selesai dan yang belum.
    *   Menampilkan status proyek (belum dikerjakan, sedang dikerjakan, selesai).
*   **Business Rules**: 
    *   Progres dihitung berdasarkan modul yang ditandai selesai.
*   **Dependencies**: Backend progress service, database.

*   **Feature Name**: Project Submission
*   **Description**: Memungkinkan pengguna mengunggah *file* proyek akhir mereka.
*   **User Story**: Sebagai pembelajar, saya ingin bisa mengunggah proyek akhir saya agar bisa dinilai dan menjadi bagian dari portofolio saya.
*   **Acceptance Criteria**: 
    *   Pengguna dapat mengunggah satu atau lebih *file* (misalnya, kode, laporan, *screenshot*).
    *   Sistem mencatat waktu pengunggahan.
    *   Pengguna menerima konfirmasi pengunggahan.
*   **Business Rules**: 
    *   Hanya *file* dengan ekstensi tertentu yang diizinkan (misalnya, .zip, .py, .pdf, .md).
    *   Ukuran *file* maksimal 10MB.
*   **Dependencies**: Backend project service, file storage.

---

## 6. Feature Specification (Internal Tools)

### 6.1. Course Management System (CMS) - Basic
*   **Description**: Antarmuka internal untuk tim Maguru mengelola konten kursus MVP V1.
*   **Functionality**: 
    *   Membuat, mengedit, menghapus 1-2 kursus.
    *   Mengelola modul, pelajaran (teks, video embed URL, kuis).
    *   Mengelola instruksi proyek.
*   **User**: Internal Content Creator/Admin.

### 6.2. RAG Knowledge Base Management - Basic
*   **Description**: Antarmuka internal untuk tim Maguru mengelola *Course Knowledge Base* yang digunakan oleh AI Co-Teacher.
*   **Functionality**: 
    *   Mengunggah dokumen (PDF, Markdown) sebagai sumber *knowledge base*.
    *   Melihat daftar dokumen yang sudah ada.
    *   Memicu proses *indexing* ulang *knowledge base*.
*   **User**: Internal AI/ML Engineer, Content Creator.

### 6.3. User Management - Basic
*   **Description**: Antarmuka internal untuk tim Maguru melihat dan mengelola data pengguna dasar.
*   **Functionality**: 
    *   Melihat daftar pengguna terdaftar.
    *   Melihat detail profil pengguna (nama, email).
*   **User**: Internal Admin.

### 6.4. Analytics Dashboard - Basic
*   **Description**: Dashboard internal untuk memantau metrik keberhasilan MVP V1.
*   **Functionality**: 
    *   Menampilkan jumlah registrasi pengguna.
    *   Menampilkan jumlah pembelian kursus.
    *   Menampilkan *Initial Assessment Completion Rate*.
    *   Menampilkan *AI Co-Teacher Engagement Rate* (jumlah interaksi per pengguna).
    *   Menampilkan *Course Completion Rate*.
*   **User**: Internal Product Manager, Business Analyst.

---

## 7. Non-Functional Requirements

*   **Performance**: 
    *   Waktu *load* halaman utama dan kursus < 3 detik.
    *   Respons AI Co-Teacher < 5 detik.
    *   Skalabilitas untuk 1.000 pengguna bersamaan.
*   **Scalability**: 
    *   Arsitektur harus mendukung penambahan kursus dan pengguna di masa depan tanpa *re-architecture* besar.
    *   Infrastruktur AI harus dapat diskalakan sesuai peningkatan penggunaan.
*   **Security**: 
    *   Autentikasi pengguna yang aman (OAuth2/JWT).
    *   Enkripsi data sensitif (password, informasi pembayaran).
    *   Perlindungan terhadap serangan umum (XSS, SQL Injection).
    *   Kepatuhan terhadap regulasi privasi data (misalnya, GDPR/UU PDP jika relevan).
*   **Availability**: 
    *   Uptime minimal 99.5%.
    *   Sistem *backup* dan *recovery* data.
*   **Accessibility**: 
    *   Antarmuka pengguna harus dapat diakses oleh pengguna dengan disabilitas dasar (misalnya, *screen reader friendly* untuk teks).

---

## 8. Data Requirements

### a. Data yang Perlu Disimpan
*   **User Data**: ID, nama, email, password (hashed), foto profil, tanggal registrasi.
*   **Course Data**: ID, nama kursus, deskripsi, harga, kurikulum (struktur modul/pelajaran), instruksi proyek, status (aktif/tidak aktif).
*   **Learning Content Data**: ID, tipe (teks, video, kuis), konten (teks, URL video, pertanyaan kuis), ID modul terkait.
*   **Assessment Data**: ID, ID pengguna, ID kursus, pertanyaan, jawaban pengguna, skor, tanggal.
*   **AI Interaction Data**: ID, ID pengguna, ID kursus, *timestamp*, *prompt* pengguna, respons AI.
*   **Progress Data**: ID, ID pengguna, ID kursus, ID modul, status selesai, tanggal selesai.
*   **Project Submission Data**: ID, ID pengguna, ID kursus, *file* proyek (URL penyimpanan), tanggal *submit*, status penilaian.
*   **Order/Transaction Data**: ID, ID pengguna, ID kursus, jumlah, status pembayaran, *payment gateway transaction ID*, tanggal transaksi.
*   **RAG Knowledge Base Data**: Dokumen sumber (teks, metadata, *embeddings*), indeks pencarian.

### b. Data Model Tingkat Tinggi (Contoh Entitas Utama)
*   User
*   Course
*   Module
*   Lesson
*   Quiz
*   Project
*   AssessmentResult
*   AIInteraction
*   UserProgress
*   Order
*   RAGDocument

### c. Relasi Data Utama
*   `User` 1:N `Order`
*   `Course` 1:N `Module`
*   `Module` 1:N `Lesson`
*   `Lesson` 1:N `Quiz`
*   `Course` 1:N `Project`
*   `User` 1:N `AssessmentResult`
*   `User` 1:N `AIInteraction`
*   `User` 1:N `UserProgress`
*   `User` 1:N `ProjectSubmission`
*   `Course` 1:N `RAGDocument`

---

## 9. Analytics & Success Metrics

### a. Key Performance Indicators (KPIs) MVP V1
*   **Activation Rate**: Persentase pengguna yang menyelesaikan *Initial Assessment* dari total registrasi.
*   **Course Start Rate**: Persentase pengguna yang memulai kursus setelah pembelian.
*   **AI Engagement Rate**: Rata-rata jumlah interaksi (pertanyaan) dengan AI Co-Teacher per pengguna per sesi belajar atau per kursus.
*   **Learning Path Completion Rate**: Persentase modul yang diselesaikan pengguna dari jalur belajar yang direkomendasikan.
*   **Project Submission Rate**: Persentase pengguna yang mengunggah proyek akhir kursus.
*   **Course Completion Rate**: Persentase pengguna yang menyelesaikan semua modul dan proyek dalam kursus.
*   **User Satisfaction (CSAT/NPS)**: Diukur melalui survei singkat setelah menyelesaikan kursus atau interaksi AI.
*   **Conversion Rate to Purchase**: Persentase pengunjung *landing page* yang melakukan pembelian kursus.
*   **Average Revenue Per User (ARPU)**: Total pendapatan dibagi jumlah pengguna.

### b. Metrik Tambahan
*   *Time Spent* per modul/kursus.
*   *Drop-off points* dalam *learning path*.
*   Jenis pertanyaan yang paling sering diajukan ke AI Co-Teacher.
*   Tingkat akurasi respons AI (diukur secara manual oleh tim).

---

## 10. Risks & Open Questions

### a. Product Risks
*   **AI Co-Teacher Halusinasi/Tidak Akurat**: Meskipun menggunakan RAG, risiko AI memberikan jawaban yang salah atau tidak relevan tetap ada, yang dapat merusak kepercayaan pengguna.
*   **Kurikulum Tidak Relevan**: Kursus yang dibuat tidak sesuai dengan kebutuhan industri atau terlalu sulit/mudah untuk target persona.
*   **User Experience yang Buruk**: Antarmuka yang tidak intuitif atau alur belajar yang membingungkan dapat menyebabkan *churn*.

### b. Technical Risks
*   **Integrasi AI Kompleks**: Mengintegrasikan LLM dan RAG engine secara stabil dan efisien membutuhkan keahlian teknis tinggi.
*   **Skalabilitas Infrastruktur**: Memastikan infrastruktur dapat menangani lonjakan pengguna dan permintaan API LLM tanpa *downtime* atau biaya berlebihan.
*   **Data Security**: Melindungi data pengguna dan *Course Knowledge Base* dari kebocoran atau serangan siber.

### c. Business Risks
*   **Low Willingness to Pay**: Pengguna tidak bersedia membayar harga yang ditetapkan untuk kursus, atau LTV terlalu rendah.
*   **High Customer Acquisition Cost (CAC)**: Biaya untuk mendapatkan pelanggan baru terlalu tinggi, membuat model bisnis tidak berkelanjutan.
*   **Kompetisi**: Kompetitor besar meluncurkan fitur AI serupa atau lebih baik, mengurangi diferensiasi Maguru.

### d. Open Questions
*   Berapa harga optimal untuk kursus MVP V1 agar menarik bagi "Budi" dan tetap menguntungkan?
*   Seberapa sering "Budi" akan berinteraksi dengan AI Co-Teacher? Apakah ada batasan penggunaan yang perlu diterapkan?
*   Metode *project evaluation* apa yang paling efisien dan memberikan nilai maksimal bagi "Budi" di MVP V1 (manual, semi-otomatis, atau peer-review)?
*   Apakah perlu ada *free trial* untuk AI Co-Teacher atau hanya untuk akses materi?

---

## 11. Release Criteria

MVP V1 Maguru dianggap siap untuk dirilis jika semua kriteria berikut terpenuhi:

*   **Fungsionalitas Inti**: Semua fitur "Must Have" (seperti yang didefinisikan dalam MoSCoW dan PRD ini) telah diimplementasikan dan berfungsi dengan baik.
*   **Kualitas AI**: AI Co-Teacher menunjukkan tingkat akurasi respons minimal 85% dan tingkat halusinasi di bawah 5% dalam pengujian internal.
*   **Uji Coba Internal**: Tim Maguru telah melakukan pengujian menyeluruh dan tidak menemukan *bug* kritis yang menghambat alur pengguna utama.
*   **Uji Coba Beta (Opsional)**: Jika waktu memungkinkan, uji coba beta dengan 10-20 pengguna target untuk mengumpulkan *feedback* awal dan memperbaiki *bug*.
*   **Performa**: Memenuhi *Non-Functional Requirements* dasar terkait kecepatan dan stabilitas.
*   **Keamanan**: Audit keamanan dasar telah dilakukan dan kerentanan kritis telah diperbaiki.
*   **Konten**: 1-2 kursus *project-based* telah selesai dibuat dan diunggah ke platform dengan *Course Knowledge Base* yang relevan.

---

## 12. Future Considerations

Fitur-fitur berikut sengaja ditunda dan akan dipertimbangkan untuk pengembangan di fase selanjutnya:

### a. MVP V2
*   Fully automated *Adaptive Learning Path Engine*.
*   *Automated Code Review/Feedback* yang lebih canggih.
*   *Competency Mastery Tracking* yang detail.
*   *Personalized Dashboard* yang lebih kaya informasi.
*   *Code Editor/Sandbox* yang lebih canggih.
*   *AI-Generated Practice Problems*.
*   Sertifikasi otomatis.
*   Manajemen langganan (jika model bisnis berubah).

### b. Post-MVP
*   Fitur komunitas (forum diskusi, *peer-to-peer feedback*, Mentor/Expert Q&A).
*   Gamifikasi (badges, points, leaderboard, streaks).
*   *AI-Powered Content Summarization*.
*   *Resource Library* yang komprehensif.
*   *Learning Goal Setting* & *Customizable Learning Pace* yang lebih *advanced*.
*   Ekspansi ke kursus dan *digital skills* lainnya.
*   Integrasi dengan *talent marketplace* atau *job portal*.
