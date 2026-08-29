# 🧪 Panduan & Laporan Manual Testing: AI Chatbot Assistant (Milestone 1 Hardening)

**Target URL Frontend**: `http://localhost:3000/course/[slug]/learn` (atau `http://localhost:3001/course/[slug]/learn`)  
**Target Backend AI**: `http://localhost:8000` (FastAPI / LangServe)  
**Scope**: Verifikasi End-to-End Antarmuka AI Co-Teacher, Streaming SSE, LocalStorage Persistence, Konteks Pelajaran Dinamis, dan Ketahanan Error.

---

## 📋 Pra-Kondisi Pengujian (*Pre-requisites*)

1. **Server AI (`maguru-model`)**: Pastikan berjalan di `http://localhost:8000` (`python server.py`).
2. **Frontend Next.js (`maguru`)**: Pastikan berjalan di port aktif (`yarn app:prod` / `yarn dev`).
3. **Buka Browser**: Akses salah satu halaman ruang belajar siswa:
   👉 `http://localhost:3001/course/test-course-double-postman-dari-postman/learn` (atau slug kursus lain).

---

## 🔴 1. Must-Have Test Cases (Kritikal / P0)

### 📌 TC-01: Visibilitas & Toggle Floating Button (FAB)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Buka halaman belajar `/course/[slug]/learn`.
  2. Perhatikan pojok kanan bawah layar.
  3. Klik tombol **AI Co-Teacher**.
  4. Klik tombol **X** di header panel chat.
* **Hasil yang Diharapkan**:
  * Tombol FAB melayang di pojok kanan bawah dengan ikon bot dan indikator hijau *Online*.
  * Panel chat selebar 400px membuka dari kanan secara mulus (*smooth transition*).
  * Panel tertutup kembali saat tombol **X** diklik.
* **Catatan Hasil Uji**: 

---

### 📌 TC-02: Real-Time Token Streaming (Efek Mengetik Cepat 3–5 Detik)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Buka panel chat AI.
  2. Ketik: `Halo AI Co-Teacher, tolong jelaskan apa itu Python dalam 2 kalimat!`
  3. Tekan tombol **Enter** atau klik ikon **Send**.
* **Hasil yang Diharapkan**:
  * Pesan siswa langsung muncul di gelembung chat kanan.
  * Teks balasan AI mengalir kata demi kata secara instan (real-time streaming) dengan kecepatan 3–5 detik selesai.
* **Catatan Hasil Uji**: 

---

### 📌 TC-03: LocalStorage Session Persistence Saat Refresh Browser
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Kirim 2–3 pertanyaan dan tunggu balasan AI muncul.
  2. Lakukan **Refresh Browser (F5 / Ctrl+R)** pada halaman.
  3. Buka kembali panel chat AI Co-Teacher.
* **Hasil yang Diharapkan**:
  * Seluruh riwayat pesan percakapan sebelumnya langsung tampil utuh tanpa hilang.
  * `thread_id` percakapan tetap dipertahankan.
* **Catatan Hasil Uji**: 

---

### 📌 TC-04: Navigation Persistence Antar-Halaman & Antar-Lesson
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Kirim chat saat sedang berada di Lesson 1.
  2. Klik link navigasi ke halaman Katalog `/course` atau Dashboard.
  3. Beralih kembali ke halaman belajar `/course/[slug]/learn`.
  4. Buka panel chat AI.
* **Hasil yang Diharapkan**:
  * Riwayat percakapan tetap tersimpan dan dapat dilanjutkan.
* **Catatan Hasil Uji**: 

---

### 📌 TC-05: Dynamic Lesson Context Switching (Klik Materi Baru di Sidebar)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Buka panel chat saat berada di Lesson A (misal: "Pengenalan Python").
  2. Klik Lesson B (misal: "Variabel & Tipe Data") pada sidebar materi di kiri.
  3. Perhatikan panel chat AI.
  4. Kirim pertanyaan: `Tolong jelaskan materi saat ini.`
* **Hasil yang Diharapkan**:
  * Muncul penanda pembatas visual: `📍 Beralih ke materi: Variabel & Tipe Data`.
  * AI langsung menjawab materi Lesson B yang baru dibuka tanpa menghapus riwayat sebelumnya.
* **Catatan Hasil Uji**: 

---

### 📌 TC-06: Rendering Markdown & Blok Kode (Syntax Highlighting)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Ketik pertanyaan: `Berikan contoh kode Python untuk membuat list dan mengakses elemen pertama.`
  2. Kirim pesan ke AI.
* **Hasil yang Diharapkan**:
  * Cuplikan kode Python di-render dalam kotak gelap khusus dengan font monospaced yang rapi.
  * Format teks Markdown (tebal, miring, list poin) tampil terstruktur dengan rapi.
* **Catatan Hasil Uji**: 

---

## 🟡 2. Should-Have Test Cases (Penting / P1)

### 📌 TC-07: Multi-Turn Conversation Memory (Ingatan Sesi)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Kirim Pesan 1: `Buat variabel nama_siswa = 'Budi'`
  2. Tunggu balasan AI.
  3. Kirim Pesan 2: `Siapa nama siswa yang tadi kamu simpan di variabel tersebut?`
* **Hasil yang Diharapkan**:
  * AI mengingat percakapan sebelumnya dan menjawab dengan tepat (*"Nama siswa tersebut adalah Budi"*).
* **Catatan Hasil Uji**: 

---

### 📌 TC-08: Quick Prompt Suggestions Chips
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Buka panel chat saat belum ada pesan.
  2. Klik salah satu tombol saran cepat (misal: `💡 Jelaskan dengan analogi sederhana`).
* **Hasil yang Diharapkan**:
  * Pertanyaan otomatis terkirim dan AI langsung menjawab materi terkait dengan analogi.
* **Catatan Hasil Uji**: 

---

### 📌 TC-09: 1-Click Copy Code Snippet
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Pada balasan AI yang mengandung blok kode Python, arahkan kursor ke blok kode.
  2. Klik tombol **Salin / Copy** di pojok kanan atas blok kode.
  3. Paste (Ctrl+V) ke notepad atau editor.
* **Hasil yang Diharapkan**:
  * Tombol berubah menjadi ikon ceklis *"Tersalin! ✔️"*.
  * Teks kode tersalin sempurna ke clipboard.
* **Catatan Hasil Uji**: 

---

### 📌 TC-10: Tombol Stop Streaming (Abort Stream)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Kirim pertanyaan yang memicu jawaban panjang.
  2. Saat AI sedang mengetik, klik tombol **Stop** (merah/oranye).
* **Hasil yang Diharapkan**:
  * Aliran token langsung berhenti seketika.
  * Tombol kembali menjadi tombol kirim normal dan state `isStreaming` menjadi `false`.
* **Catatan Hasil Uji**: 

---

### 📌 TC-11: One-Click Retry Button Saat Terjadi Kendala Jaringan
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Matikan sementara server AI Python di port 8000 (Ctrl+C).
  2. Kirim pesan di chat.
  3. Nyalakan kembali server Python (`python server.py`).
  4. Klik tombol **Coba Lagi (Retry)** pada gelembung error.
* **Hasil yang Diharapkan**:
  * Pertanyaan otomatis dikirim ulang dan balasan AI mengalir lancar.
* **Catatan Hasil Uji**: 

---

### 📌 TC-12: Hapus Riwayat Chat & Reset Sesi LocalStorage
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Setelah ada percakapan, klik ikon **Trash (Tempat Sampah)** di header panel chat.
  2. Refresh browser.
* **Hasil yang Diharapkan**:
  * Seluruh pesan terhapus dan tampilan kembali ke layar sambutan (*welcome screen*).
  * Data di `localStorage` terhapus bersih dan dibuatkan `thread_id` baru.
* **Catatan Hasil Uji**: 

---

### 📌 TC-13: Keyboard Shortcuts (Enter, Shift+Enter, Escape)
* **Status**: `[ ] PASS` / `[ ] FAIL`
* **Langkah Pengujian**:
  1. Tekan `Shift + Enter` di input chat (membuat baris baru).
  2. Tekan `Enter` (mengirim pesan).
  3. Tekan tombol `Escape (Esc)` pada keyboard.
* **Hasil yang Diharapkan**:
  * Panel chat tertutup secara otomatis saat tombol `Esc` ditekan.
* **Catatan Hasil Uji**: 

---

## 📝 Evaluasi Akhir Pengujian

* **Tanggal Pengujian**: 
* **Tester**: 
* **Kesimpulan Umum**: 
