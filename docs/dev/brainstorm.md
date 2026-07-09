# Task Plan Evaluation: Initial Assessment Engine

Berikut adalah hasil tinjauan rencana implementasi pada berkas `.kiro\specs\assessment-engine\tasks.md` menggunakan kacamata **Senior Developer / Ponytail (YAGNI & Simplicity)**.

---

## 1. Temuan Over-Engineering & Pemangkasan Boilerplate (YAGNI)

### ⚠️ Temuan 1: Penggunaan Property-Based Testing (`fast-check`)
*   **Rujukan**: Task 1.B.S.1 (L70–76) & L89–90:
    > *"Write property-based tests first (fast-check)..."*
*   **Analisis Ponytail**:
    - **Masalah**: Menggunakan pustaka pihak ketiga `fast-check` untuk menulis tes berbasis properti (*property-based tests*) pada rumus matematika sederhana (menghitung persentase skor kuis) adalah bentuk **over-engineering**. Hal ini menambah dependensi tidak perlu dan meningkatkan kurva pembelajaran pengujian.
    - **Rekomendasi**: Hapus seluruh spesifikasi dan dependensi `fast-check`. Pengujian unit biasa (*standard unit tests*) menggunakan Jest dengan skenario skor 0%, 50%, 70%, dan 100% sudah lebih dari cukup untuk menjamin kebenaran logika penilaian.

### ⚠️ Temuan 2: Mocking Prisma Interactive Transactions (Unit Testing)
*   **Rujukan**: Task 1.B.S.2 (L96–104) & L116–118:
    > *"Mocked transaction tests (no real DB)..."*
*   **Analisis Ponytail**:
    - **Masalah**: Melakukan *mocking* terhadap Prisma interactive transaction client (`prisma.$transaction`) di dalam unit test Jest sangatlah rumit, memicu banyak boilerplate, dan seringkali tidak mencerminkan perilaku asli database.
    - **Rekomendasi**: Hindari menulis unit test yang mem-mock transaksi database secara manual. Logika transaksional dan integritas rollback data jauh lebih efisien diuji secara nyata melalui pengujian integrasi database (*database-backed integration tests*) pada **Task 1.B.Q.1** menggunakan test DB lokal. Ini menghemat waktu penulisan kode testing hingga 50%.

### ⚠️ Temuan 3: Kompleksitas State Management TanStack Query (F.H.1)
*   **Rujukan**: Task 1.F.H.1 (L292–306):
    > *"Create useAssessment Hook with TanStack Query..."*
*   **Analisis Ponytail**:
    - **Masalah**: Kuis kuesioner ini bersifat *single-action* (siswa hanya memuat sekali di awal, mengisi, lalu mensubmit). Tidak ada kebutuhan untuk sinkronisasi state real-time, polling, atau caching yang kompleks.
    - **Rekomendasi**: Jika TanStack Query sudah menjadi standar wajib di proyek, silakan gunakan. Namun jika tidak, disarankan untuk menggunakan standard React `useState` + `useEffect` fetch biasa untuk meminimalkan *boilerplate*.

---

## Ringkasan Rekomendasi Pemotongan Kode:
1.  **Coret** semua *tasks* yang menggunakan `fast-check`.
2.  **Coret** unit test *mock transaction* pada `placement.service.test.ts`, delegasikan validasi rollback sepenuhnya ke *integration test* di `routes.test.ts`.
