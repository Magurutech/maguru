# Assessment Engine API Testing Guide

**Feature:** Assessment Engine (Initial Pre-Test & Section Quiz)  
**Sprint:** Sprint 3 / Wave 6  
**Requirements:** Assessment Engine Gating & Progress Skipping  

---

## Overview

Panduan ini mendokumentasikan pengujian API untuk fitur **Assessment Engine** pada Maguru, yang mencakup pengambilan daftar pertanyaan kuis, pengiriman (*submission*) jawaban kuis oleh siswa, dan riwayat hasil penilaian.

### API Endpoints

| Method | Endpoint                   | Auth     | Description                                                          |
|--------|----------------------------|----------|----------------------------------------------------------------------|
| `GET`  | `/api/assessment/questions` | Required | Mengambil daftar soal kuis (Pre-Test jika `sectionId` null, atau Section Quiz) |
| `POST` | `/api/assessment/submit`   | Required | Mengirim jawaban kuis siswa, menghitung skor, dan memproses placement |
| `GET`  | `/api/assessment/results`   | Required | Mengambil riwayat hasil kuis siswa untuk suatu course                |

---

## Analisis Masalah: Slug vs CUID Mismatch (Cek Gambar & Kasus Kosong)

### Gejala Masalah
Saat mengakses halaman belajar (`/course/[slug]/learn`), siswa melihat kotak dialog kuis bertuliskan:
> **"Tidak ada pertanyaan untuk kuis ini."**

### Analisis Akar Masalah
Setelah ditelusuri di level kode:
1. **Frontend**: Komponen `<AssessmentPage>` dikirim parameter `courseId={slug}` (misalnya `test-course-double-postman-dari-postman`), yang merupakan string slug/URL human-readable.
2. **Kueri API**: Frontend memanggil endpoint:
   `GET /api/assessment/questions?courseId=test-course-double-postman-dari-postman`
3. **Database & API Backend**: 
   * Di database, relasi kuis disimpan menggunakan format **CUID** (UUID acak, e.g., `a953070e-d025-4a94-a25f-e244bbae9877`).
   * Controller `questions/route.ts` memproses query `where: { courseId }` secara mentah (*raw*), sehingga membandingkan langsung CUID di database dengan string slug yang dikirimkan.
   * Akibatnya, kueri database menghasilkan `0` (kosong) karena tidak ada kecocokan data.

### Solusi Terbaik (Backend Resolution)
Memperbaiki route backend (`questions`, `submit`, dan `results`) agar secara dinamis menerjemahkan parameter `courseId` yang dikirimkan dari frontend (baik berupa **Slug** maupun **CUID**) ke **CUID** yang valid sebelum query ke tabel `assessment_questions` dijalankan.

---

## Prerequisites

### 1. Jalankan Development Server
Pastikan Next.js server sudah berjalan:
```bash
npm run app
```

### 2. Siapkan Test Data (Seeding)
Pastikan database sudah terisi data kuis contoh dengan menjalankan:
```bash
npx tsx scratch/seed-assessment.ts
```

### 3. Dapatkan Auth Token (Clerk Session Cookie)
1. Buka browser dan login ke Maguru.
2. Buka DevTools (F12) -> **Application** -> **Cookies** -> pilih `http://localhost:3000`.
3. Salin isi cookie bernama `__session` (ini adalah JWT Clerk session token Anda).

---

## Import Postman Collection

1. Buka Postman.
2. Klik tombol **Import**.
3. Pilih berkas `docs/api/assessment/assessment.postman_collection.json`.
4. Konfigurasikan variabel koleksi (*Collection Variables*) di bawah ini.

### Collection Variables

| Variable | Nilai Default | Keterangan |
|----------|---------------|------------|
| `baseUrl` | `http://localhost:3000` | URL endpoint lokal Next.js |
| `courseId` | `a953070e-d025-4a94-a25f-e244bbae9877` | CUID atau Slug course yang sedang dites (e.g. `test-course-double-postman-dari-postman`) |
| `sectionId` | `4b2637a9-1133-4612-a0a6-5863d37a840d` | CUID section untuk pengujian kuis akhir bab |
| `authToken` | *(tempel session token Clerk)* | Token yang diambil dari cookie `__session` |

---

## Test Scenarios & Assertion Checklist

### Scenario 1: Fetch Questions (GET /api/assessment/questions)

#### 1.1 Get Questions - Success (Pre-Test)
Mengambil soal penempatan awal.
*   **Request URL**: `GET /api/assessment/questions?courseId={{courseId}}`
*   **Assertion Checklist**:
    *   [x] Status code `200`
    *   [x] Response memiliki field `questions` berjenis array.
    *   [x] Tiap soal memiliki `id`, `question`, `options`, `topic`, `difficulty`.
    *   [x] Keamanan: Field `correct` (kunci jawaban) **tidak boleh bocor/ikut terkirim** ke client.

#### 1.2 Get Questions - Success (Section Quiz)
Mengambil kuis khusus bab.
*   **Request URL**: `GET /api/assessment/questions?courseId={{courseId}}&sectionId={{sectionId}}`
*   **Assertion Checklist**:
    *   [x] Status code `200`
    *   [x] Mengembalikan soal yang terasosiasi dengan `sectionId` tersebut saja.

#### 1.3 Get Questions - Failure (Unauthorized)
*   **Request URL**: Tanpa menyertakan cookie `__session`.
*   **Assertion Checklist**:
    *   [x] Status code `401`
    *   [x] Response mengandung error `"Unauthorized"`.

---

### Scenario 2: Submit Answers (POST /api/assessment/submit)

#### 2.1 Submit Pre-Test - Success
*   **Request Body**:
    ```json
    {
      "courseId": "{{courseId}}",
      "sectionId": null,
      "answers": {
        "pre-q1": "b",
        "pre-q2": "a",
        "pre-q3": "c",
        "pre-q4": "b"
      },
      "durationSeconds": 150
    }
    ```
*   **Assertion Checklist**:
    *   [x] Status code `200`
    *   [x] Response mengembalikan `overallScore` (skor keseluruhan 0-100).
    *   [x] Response mengembalikan performa per topik di `topicScores`.
    *   [x] Memverifikasi materi yang terlewati di `skippedLessonIds`.

#### 2.2 Submit Quiz - Failure (Bad Request)
*   **Request Body**: Objek kosong / field tidak lengkap.
*   **Assertion Checklist**:
    *   [x] Status code `400`
    *   [x] Validasi Zod menangkap payload yang tidak valid.

---

### Scenario 3: Get Attempt Results (GET /api/assessment/results)

*   **Request URL**: `GET /api/assessment/results?courseId={{courseId}}`
*   **Assertion Checklist**:
    *   [x] Status code `200`
    *   [x] Mengembalikan riwayat performa kuis yang sudah selesai dikerjakan siswa.
