# 🧪 Panduan & Laporan Manual Testing: AI Feature Milestones

**Target URL Frontend**: `http://localhost:3000` atau `http://localhost:3001`  
**Target Backend AI**: `http://localhost:8000` (FastAPI / LangServe)  
**Scope**: Verifikasi End-to-End AI Co-Teacher Streaming (Milestone 1) & Automated AI Quiz Assessment Generator dengan Auto-DB Context (Milestone 2).

---

## 📋 Pra-Kondisi Pengujian (*Pre-requisites*)

1. **Server AI (`maguru-model`)**: Pastikan berjalan di `http://localhost:8000` (`python server.py`).
2. **Frontend Next.js (`maguru`)**: Pastikan berjalan di port aktif (`yarn app:prod` / `yarn dev`).
3. **Akses Browser**:
   * Siswa (Milestone 1): `http://localhost:3001/course/[slug]/learn`
   * Creator (Milestone 2): `http://localhost:3001/creator/courses/[slug]/manage`

---

## 🔴 1. Milestone 1 Test Cases: AI Chatbot Co-Teacher

### 📌 TC-01: Visibilitas & Toggle Floating Button (FAB)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**: Buka halaman belajar `/course/[slug]/learn` -> Klik tombol AI Co-Teacher -> Klik X.
* **Hasil yang Diharapkan**: FAB melayang di pojok kanan bawah, panel chat meluncur mulus 400px, tombol close menutup panel.

### 📌 TC-02: Real-Time Token Streaming (Efek Mengetik Cepat 3–5 Detik)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**: Kirim pertanyaan `Jelaskan apa itu fungsi di Python secara ringkas`.
* **Hasil yang Diharapkan**: Balasan AI mengalir kata demi kata secara real-time dan selesai dalam 3–5 detik.

### 📌 TC-03: LocalStorage Session Persistence Saat Refresh Browser
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**: Kirim 2–3 chat -> Refresh Browser (F5) -> Buka panel chat AI.
* **Hasil yang Diharapkan**: Seluruh riwayat chat dan threadId tetap tampil utuh tanpa hilang.

---

## 🟡 2. Milestone 2 Test Cases: Automated AI Quiz Generator (MoSCoW Enhanced)

### 📌 TC-04: Auto-Fetch Konteks Materi Langsung dari Database
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Target URL**: `http://localhost:3001/creator/courses/[slug]/manage`
* **Langkah Pengujian**:
  1. Masuk ke halaman kelola kursus sebagai Creator.
  2. Buka salah satu bab (misal: *Bab 1*).
  3. Klik tombol **"✨ Buat Kuis AI"**.
* **Hasil yang Diharapkan**:
  * Tampil badge hijau: *"Konteks Otomatis Database Aktif (N Materi Terhubung)"*.
  * Pengajar tidak perlu mengetik isi materi secara manual.

---

### 📌 TC-05: Eksekusi Generasi Kuis oleh AI (< 2 Detik)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Pilih jumlah soal: `5 Butir Soal`.
  2. Pilih tingkat kesulitan: `Sedang`.
  3. Klik tombol **"Mulai Generate Kuis"**.
* **Hasil yang Diharapkan**:
  * AI menghasilkan 5 soal pilihan ganda lengkap dalam waktu 1–2 detik.

---

### 📌 TC-06: Preview Soal & Pembahasan Edukatif (*Explanation*)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Tinjau kartu-kartu soal di preview.
  2. Perhatikan opsi A-D, kunci jawaban hijau, dan kotak kuning bertanda lampu bohlam (*Pembahasan*).
* **Hasil yang Diharapkan**:
  * Setiap soal memiliki teks pertanyaan, 4 opsi jawaban, kunci jawaban yang ditandai hijau, serta pembahasan singkat mengapa jawaban tersebut benar.

---

### 📌 TC-07: Fleksibilitas Edit Inline & Single Question Regenerate
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Coba klik dan edit teks pertanyaan langsung pada salah satu kartu preview.
  2. Klik tombol putar (*RefreshCw*) di pojok kanan kartu soal #2.
  3. Klik tombol hapus (*Trash2*) pada kartu soal #3.
* **Hasil yang Diharapkan**:
  * Teks pertanyaan dapat diedit langsung.
  * Soal #2 berhasil dirancang ulang oleh AI secara mandiri tanpa mengubah soal lainnya.
  * Soal #3 terhapus dari daftar preview.

---

### 📌 TC-08: Batch Save ke Database & Pembaruan Daftar Soal
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Klik tombol **"Simpan Semua Soal ke Kursus"**.
* **Hasil yang Diharapkan**:
  * Muncul toast notifikasi hijau: *"N Soal Kuis berhasil disimpan ke kurikulum!"*.
  * Modal tertutup dan seluruh soal langsung muncul di kurikulum kuis kursus.

---

## 📝 Evaluasi Akhir Pengujian

* **Tanggal Pengujian**: 
* **Tester**: 
* **Kesimpulan Umum**: 
