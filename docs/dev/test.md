# 🧪 Panduan Pengujian Manual (Manual Testing Guide)
## Milestone 3: Auto-Ingestion & Knowledge Sync ke Vector Store (US 4.2)
### Lingkup Fitur: Must-Have & Should-Have (MoSCoW)

Dokumen ini menyediakan panduan langkah demi langkah (*step-by-step testing script*) untuk melakukan verifikasi manual terhadap fitur **Auto-Ingestion Materi Kursus ke Vector Store (PGVector)** beserta fitur pendukungnya pada platform Maguru.

---

## 📋 Prasyarat Pengujian (Pre-requisites)

Pastikan kedua layanan aktif di terminal sebelum pengujian dimulai:
1. **Frontend & Next.js App Router**:
   * URL: `http://localhost:3000` (atau port dev yang aktif).
   * Status: Berjalan normal (`yarn app:prod` atau `yarn app`).
2. **Backend AI FastAPI (`maguru-model`)**:
   * URL: `http://localhost:8000`.
   * Status: Berjalan normal (`python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`).
   * Database: Supabase PostgreSQL PGVector terkonfigurasi pada `DATABASE_URL`.

---

## 🎯 DAFTAR SKENARIO PENGUJIAN

| ID Skenario | Kategori | Fitur yang Diuji | Target Hasil |
| :--- | :--- | :--- | :--- |
| **TC-M3-01** | **Must-Have** | Auto-Ingestion saat Tambah Materi Baru (`POST`) | Data tersimpan instan (< 100ms) & vektor terindeks otomatis |
| **TC-M3-02** | **Must-Have** | Auto-Update & Deduplikasi saat Edit Materi (`PUT`) | Chunk lama terhapus, chunk baru masuk tanpa duplikasi |
| **TC-M3-03** | **Must-Have** | Cascade Deletion saat Hapus Materi (`DELETE`) | Vektor materi otomatis terhapus dari Vector Store |
| **TC-M3-04** | **Must-Have** | Non-Blocking & Fault Tolerance (AI Offline) | Simpan materi di CMS tetap sukses tanpa error 500 |
| **TC-M3-07** | **Must-Have** | Scoped PGVector Retrieval & Source Attribution | Soal menguji konsep mendalam & ada rujukan judul materi |
| **TC-M3-08** | **Must-Have** | Exact Question Count Guarantee & Dynamic Padding | Tepat 5 butir soal dihasilkan (bug 1 soal tuntas) |
| **TC-M3-09** | **Must-Have** | Anti-Leak Metadata, UUIDs, & Clean Topic Titles | Pertanyaan bersih dari penanda materi, UUID, & meta teks |
| **TC-M3-05** | **Should-Have** | One-Click Bulk Sync Seluruh Materi Kursus | Seluruh materi disinkronkan sekaligus via tombol Header |
| **TC-M3-06** | **Should-Have** | AI Knowledge Base Status Indicator Badge | Badge di header menampilkan jumlah chunk aktif real-time |
| **TC-M3-10** | **Should-Have** | Real-time RAG Status & In-Modal Quick Sync | Status vektor realtime & tombol sync di modal kuis |
| **TC-M3-11** | **Should-Have** | Proportional Sampling untuk Placement Pre-Test | Soal pre-test mengambil sampel merata dari seluruh bab |
| **TC-M3-12** | **Should-Have** | Lesson Editor UX, Live Status Badge, Word Counter, & Manual Re-sync | Status badge live inline, word counter aktif, & aksi manual re-sync |

---

## 🚀 SKENARIO MUST-HAVE

### 1. TC-M3-01: Auto-Ingestion saat Tambah Materi Baru (`POST Lesson`) [x]

* **Tujuan**: Memastikan materi baru yang dibuat kreator di Tiptap Editor langsung diekstrak secara semantik dan disinkronkan ke AI Vector Store tanpa memperlambat antarmuka CMS.
* **Langkah Pengujian**:
  1. Login sebagai Creator dan buka salah satu kursus di:
     `http://localhost:3000/creator/courses/[slug]/manage`
  2. Pada salah satu Section/Bab di sidebar, klik **"+ Tambah Pelajaran"**.
  3. Masukkan judul pelajaran:
     `Pengenalan Struktur Data Tuple di Python`
  4. Pada area editor Tiptap, masukkan konten kaya (Heading, Paragraf, dan Code Block):
     ```markdown
     # Pengantar Tuple
     Tuple adalah struktur data di Python yang bersifat ordered dan immutable (tidak dapat diubah setelah didefinisikan).

     Contoh deklarasi tuple:
     ```python
     koordinat = (10, 20)
     print(koordinat[0])
     ```
     Tuple sangat berguna untuk data konstan yang tidak boleh mengalami modifikasi tak terduga.
     ```
  5. Klik tombol **"Simpan Perubahan"** / tombol centang simpan.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] **Status Badge Real-Time**: Badge di samping tombol Simpan berubah menjadi `⏳ Menyimpan...` saat request berjalan, lalu berubah menjadi `🟢 Tersimpan` setelah selesai.
  * [x] **Word Count & Estimasi Baca**: Indikator di kanan bawah editor menampilkan jumlah kata dan estimasi waktu baca (misal `35 kata • ~1 mnt baca`).
  * [x] **Respons CMS Instan & Bebas Toast Spam**: Tidak ada popup toast yang mengganggu pengetikan setiap 5 detik.
  * [x] **Terminal AI Backend (`:8000`)**: Mencetak log keberhasilan:
    `[INFO] Ingested 1 lesson text chunks for course '...'`
  * [x] **Ekstraksi Penuh**: Seluruh teks (heading, kode Python, penjelasan) diekstraksi secara utuh tanpa terpotong batas 200 karakter.

---

### 2. TC-M3-02: Auto-Update & Deduplikasi saat Edit Materi (`PUT Lesson`)  [x]

* **Tujuan**: Memastikan saat materi diedit berulang kali, chunk lama dibersihkan dan digantikan dengan chunk baru tanpa menimbulkan data duplikat (*stale chunks*).
* **Langkah Pengujian**:
  1. Pada pelajaran yang dibuat di TC-M3-01, klik tombol edit (ikon pensil).
  2. Tambahkan paragraf baru di akhir materi:
     `Perbedaan utama tuple dan list: tuple menggunakan tanda kurung biasa () sedangkan list menggunakan tanda kurung siku [].`
  3. Klik **"Simpan Perubahan"**.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] **Status Badge Real-Time**: Saat pengguna mulai mengetik perubahan baru, badge berubah menjadi `🟡 Draf lokal`. Setelah klik "Simpan Perubahan", berubah menjadi `⏳ Menyimpan...` lalu `🟢 Tersimpan`.
  * [x] **Word Count Terbarui**: Jumlah kata bertambah sesuai penambahan teks secara dinamis.
  * [x] **Respons CMS Instan**: UI berhasil menyimpan materi baru.
  * [x] **Terminal AI Backend (`:8000`)**: Mencetak log penghapusan chunk lama diikuti penyimpanan chunk baru:
    ```
    [INFO] Deleted vector chunks for course='...', lesson='...'
    [INFO] Ingested 1 lesson text chunks for course='...', lesson='...'
    ```
  * [x] Tidak ada penggandaan vektor untuk pelajaran yang sama di tabel `langchain_pg_embedding`.

---

### 3. TC-M3-03: Cascade Deletion saat Hapus Materi (`DELETE Lesson`) [x]

* **Tujuan**: Memastikan saat kreator menghapus materi di CMS, vektor pembelajaran terkait ikut dibersihkan sehingga AI tidak akan mengutip materi yang sudah tidak ada.
* **Langkah Pengujian**:
  1. Buat satu materi uji coba bernama `Materi Uji Hapus Sementara`.
  2. Simpan materi tersebut.
  3. Buka menu opsi materi (ikon titik tiga atau tombol hapus), lalu klik **"Hapus Pelajaran"**.
  4. Konfirmasi dialog penghapusan.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] Pelajaran terhapus dari daftar bab di CMS.
  * [x] Log browser Next.js console mencetak:
    `[AI Ingest] 🗑️ Removed vector chunks for lesson ...`
  * [x] Log backend AI (`:8000`) mencetak:
    `[INFO] Deleted vector chunks for course='...', lesson='...'`

---

### 4. TC-M3-04: Non-Blocking & Fault Tolerance Resiliency (AI Backend Mati) [x]

* **Tujuan**: Memastikan jika server AI (`:8000`) sedang *down*, mati, atau bermasalah jaringan, aktivitas kreator di CMS **tidak boleh terganggu atau mengalami error 500**.
* **Langkah Pengujian**:
  1. Hentikan terminal backend AI (`Ctrl + C` pada terminal `maguru-model`).
  2. Di browser CMS Creator, coba buat atau edit satu materi pelajaran baru.
  3. Klik tombol **"Simpan Perubahan"**.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] **Materi TETAP Berhasil Tersimpan**: Database Prisma di Next.js berhasil menyimpan materi, dan toast sukses hijau tetap muncul di layar kreator.
  * [x] **Tidak Ada Error 500**: Halaman tidak crash / freeze.
  * [x] Log browser console hanya mencatat silent warning:
    `[AI Ingest] ⚠️ Background sync skipped for lesson ...: fetch failed`
  * *(Catatan: Nyalakan kembali terminal AI model setelah skenario ini selesai).*

---

### 5. TC-M3-07: Scoped PGVector Retrieval & Source Lesson Attribution di AI Quiz Generator (Must-Have) [x]

* **Tujuan**: Memastikan AI Quiz Generator memanfaatkan data vektor dari Supabase PGVector secara terfokus pada cakupan materi spesifik (`lesson_id` / `section_id`), serta menyertakan rujukan materi asal pada kolom pembahasan (`explanation`).
* **Langkah Pengujian**:
  1. Pada halaman kelola kursus, pilih salah satu bab yang telah memiliki materi lengkap (misal Bab 1).
  2. Masuk ke tab **"Kuis Bab"** atau klik **"Kelola Kuis"**.
  3. Klik tombol **"Buat Kuis AI"** (berwarna oranye-emas).
  4. Pada dropdown **Cakupan Materi Pembelajaran**, pilih 1 materi spesifik (misal *"Materi #1: Pengenalan Struktur Data Tuple"*).
  5. Pilih Jumlah Soal: **5 Butir Soal** dan Gaya Soal: **Analisis Kode & Output**.
  6. Biarkan kotak *Instruksi Tambahan* kosong agar AI memanfaatkan RAG PGVector.
  7. Klik tombol **"Mulai Generate Kuis"**.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] **Jumlah Soal Tepat**: Tepat 5 butir soal pilihan ganda berhasil dirancang tanpa terpotong.
  * [x] **Kualitas Semantik Tinggi**: Soal menguji konsep mendalam yang tertulis di materi (bukan lagi pertanyaan dangkal dari preview 200 karakter).
  * [x] **Source Attribution di Pembahasan**: Kolom pembahasan (`explanation`) mencantumkan rujukan nama materi terkait, misalnya:
    *"Konsep ini dibahas pada materi: Pengenalan Struktur Data Tuple..."*
  * [x] **Terminal Backend AI (`:8000`)**: Mencetak log retrieval berlingkup lesson:
    `[INFO] [QUIZ_GEN][DISPATCH] Generating 5 questions with style 'code_analysis' for topic '...'`

---

### 6. TC-M3-08: Exact Question Count Guarantee & Dynamic Smart Padding (Must-Have) [x]

* **Tujuan**: Memastikan sistem menjamin jumlah soal yang diminta (misal 5 butir soal) selalu terpenuhi 100%, sehingga masalah lama di mana sistem hanya menghasilkan 1 soal akibat JSON terpotong kini teratasi sepenuhnya.
* **Langkah Pengujian**:
  1. Pada modal **"Automated AI Quiz Generator"**, pilih jumlah soal: **5 Butir Soal**.
  2. Pilih gaya soal: **Kombinasi Seimbang**.
  3. Klik tombol **"Mulai Generate Kuis"**.
  4. Amati daftar hasil preview soal setelah *spinner* selesai.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] Tepat muncul **5 butir kartu soal** (#1 sampai #5) pada layar preview kuis.
  * [x] Tidak pernah lagi hanya menghasilkan 1 soal.
  * [x] Jika LLM mengembalikan kurang dari 5 soal karena batasan token, terminal AI mencetak log padding cerdas:
    `[QUIZ_GEN][PADDING] Supplementing N questions to fulfill requested 5 questions`
  * [x] Seluruh opsi (A, B, C, D) dan kunci jawaban terisi lengkap.

---

### 7. TC-M3-09: Anti-Leak Metadata, UUIDs, & Clean Topic Titles (Must-Have)

* **Tujuan**: Memastikan seluruh pertanyaan kuis bersifat *self-contained* tanpa kebocoran kode/penanda internal database seperti CUID, UUID, `=== Materi 1 ===`, atau frasa meta "Berdasarkan materi di atas".
* **Langkah Pengujian**:
  1. Periksa teks pertanyaan pada seluruh 5 butir soal yang dirancang AI di TC-M3-08.
  2. Periksa badge topik dan mikro-skill pada setiap soal.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] **Tidak Ada Header Bocor**: Tidak ada teks pembuka seperti `=== Materi 1 ===` atau `--- Header ---`.
  * [x] **Tidak Ada UUID/CUID**: Topik dan pertanyaan bersih dari ID acak (misal `clx...` atau `a1b2c3d4-...`).
  * [x] **Pertanyaan Mandiri**: Pertanyaan langsung menguji konsep komputasi/kode (misal: *"Perhatikan cuplikan fungsi Python berikut..."*) sehingga siswa dapat menjawab tanpa harus membuka dokumen materi di sampingnya.

---

## 🌟 SKENARIO SHOULD-HAVE

### 8. TC-M3-05: One-Click Bulk Sync Seluruh Materi Kursus

* **Tujuan**: Memungkinkan kreator menyinkronkan seluruh materi pelajaran dalam satu kursus ke AI Knowledge Base dalam satu kali klik (misal untuk kursus lama atau rekonsiliasi data).
* **Langkah Pengujian**:
  1. Pastikan server AI (`:8000`) sudah aktif kembali.
  2. Buka halaman kelola kursus:
     `http://localhost:3000/creator/courses/[slug]/manage`
  3. Perhatikan header atas di sebelah tombol *Publish/Unpublish*.
  4. Klik tombol **`🔄 Sync AI`** (data-testid: `sync-ai-knowledge-btn`).
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] Ikon tombol `🔄` berputar (*animated spin*) dan teks berubah menjadi *"Menyinkronkan..."*.
  * [x] Tombol berstatus disabled sementara untuk mencegah klik ganda (*debounce*).
  * [x] Muncul notifikasi toast hijau:
    *"{N} materi pelajaran ({M} vector chunks) berhasil disinkronkan ke AI Knowledge Base!"*
  * [x] Log backend AI mencetak:
    `[INFO] Bulk ingested M chunks for N lessons in course '...'`

---

### 9. TC-M3-06: AI Knowledge Base Status Indicator Badge

* **Tujuan**: Menampilkan transparansi status ketersediaan AI Knowledge Base langsung pada header antarmuka kreator.
* **Langkah Pengujian**:
  1. Setelah menjalankan *Bulk Sync* di TC-M3-05, periksa badge status di samping kategori kursus pada header.
  2. Lakukan reload browser (`F5`).
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] Muncul badge hijau dengan ikon otak (`Brain`):
    `🧠 {N} Chunks AI`
  * [x] Saat kursor diarahkan (*hover*), muncul tooltip informatif:
    *"AI Vector Store Knowledge: N chunk tersimpan"*
  * [x] Jika kursus belum memiliki materi teks sama sekali, badge menampilkan label abu-abu `AI Inactive`.

---

### 10. TC-M3-10: Real-time RAG Knowledge Status & In-Modal Quick Sync (Should-Have)

* **Tujuan**: Memastikan kreator dapat melihat status kesiapan vektor dan melakukan sinkronisasi materi langsung dari dalam modal kuis tanpa perlu keluar halaman.
* **Langkah Pengujian**:
  1. Buka kembali modal **"Automated AI Quiz Generator"**.
  2. Perhatikan kartu status di bagian atas form modal.
  3. Klik tombol **"Sync Materi"** yang ada di pojok kanan kartu status di dalam modal.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] **Indikator Real-time**: Jika materi sudah ter-vektorisasi, kartu berwarna hijau:
    `🧠 RAG Vector Knowledge Base Aktif ({N} Chunks di Supabase)`
  * [x] **In-Modal Quick Sync**: Ikon `RefreshCw` berputar dan status bertransisi menjadi *"Sinkronisasi..."*.
  * [x] Setelah selesai, toast notifikasi sukses muncul dan jumlah *chunks* langsung diperbarui secara realtime.

---

### 11. TC-M3-11: Proportional Multi-Chapter Sampling untuk Placement Pre-Test (Should-Have)

* **Tujuan**: Memastikan kuis tipe `PRE_TEST` (Placement Test kurikulum kursus lengkap) menarik materi pembelajaran secara berimbang dari semua bab kursus, bukan hanya bab pertama saja.
* **Langkah Pengujian**:
  1. Buka tab **"Pre-test"** pada sidebar kursus.
  2. Klik tombol **"Buat Kuis AI"**.
  3. Perhatikan cakupan materi otomatis terpilih: *"Semua Materi Kurikulum Kursus"*.
  4. Pilih Jumlah Soal: **5 Butir Soal** dan klik **"Mulai Generate Kuis"**.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] RAG backend memanggil fungsi `get_proportional_course_context` untuk mengambil sampel materi dari Bab 1, Bab 2, dst.
  * [x] Soal yang dihasilkan mencakup topik-topik berbeda yang mewakili keseluruhan kurikulum.
  * [x] Hasil kuis dapat disimpan langsung ke bank soal Pre-test siswa.

---

### 12. TC-M3-12: Lesson Editor UX, Live Status Badge, Word Counter, & Manual Re-sync Action (Should-Have)

* **Tujuan**: Memastikan antarmuka Lesson Editor di CMS menyediakan umpan balik visual (*inline status badge*) yang jelas, indikator jumlah kata & waktu baca (*word count & reading time*), serta menu dropdown untuk aksi manual re-sync vektor AI dan pembersihan draf lokal tanpa mengganggu kenyamanan menulis kreator.
* **Langkah Pengujian**:
  1. Buka materi pelajaran apapun di CMS Creator:
     `http://localhost:3000/creator/courses/[slug]/manage`
  2. Perhatikan bagian header Lesson Editor (sebelah tombol "Simpan Perubahan"):
     - Terdapat badge status: `🟢 Tersimpan` (jika materi sinkron dengan server).
  3. Ketikkan kalimat baru di editor:
     - Perhatikan badge status berubah secara *live* menjadi `🟡 Draf lokal`.
  4. Perhatikan bagian kanan bawah editor (atau dekat toolbar):
     - Terdapat teks metrik: `X kata • ~Y mnt baca`.
  5. Klik tombol titik tiga / dropdown aksi tambahan di dekat tombol Simpan:
     - Terdapat opsi **"Sinkronkan Vektor AI"** (manual re-sync untuk materi ini).
     - Terdapat opsi **"Hapus Draf Lokal"** (membersihkan autosave draft di browser).
  6. Klik opsi **"Sinkronkan Vektor AI"**:
     - Sistem memanggil endpoint sinkronisasi tanpa perlu mengubah teks.
     - Muncul notifikasi toast: `✅ Vektor materi berhasil disinkronkan ke AI knowledge base`.
* **Kriteria Keberhasilan (Expected Results)**:
  * [x] **Inline Status Badge**: Status perpindahan `🟢 Tersimpan` -> `🟡 Draf lokal` -> `⏳ Menyimpan...` -> `🟢 Tersimpan` bekerja presisi dan ramah a11y (`aria-live="polite"`).
  * [x] **Word Count & Reading Time**: Angka kata dan estimasi menit baca bertambah/berkurang secara real-time saat mengetik atau menghapus teks.
  * [x] **Manual Re-sync Action**: Dapat memicu re-ingestion PGVector secara on-demand untuk lesson terkait.
  * [x] **Hapus Draf Lokal**: Menghapus cache draf `localStorage` secara aman dengan konfirmasi toast.

---

## 💻 Pengujian Mandiri Cepat via Terminal (Direct API Verification)

Untuk memeriksa fungsi backend tanpa membuka UI browser, jalankan skrip PowerShell berikut:

```powershell
# 1. Cek Status Knowledge Base Kursus
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/ingest/status?course_id=test-course-demo" -Method Get | ConvertTo-Json

# 2. Uji Coba Ingest Satu Materi Pelajaran
$payload = @{
    course_id = "test-course-demo"
    lesson_id = "lesson-01"
    title     = "Variabel dan Memory Python"
    content   = "Python mengalokasikan memori secara dinamis untuk setiap variabel objek."
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/ingest" -Method Post -Body $payload -ContentType "application/json" | ConvertTo-Json

# 3. Uji Coba Generate Quiz via RAG PGVector dengan filter lesson_id
$quizPayload = @{
    course_id      = "test-course-demo"
    course_title   = "Dasar Pemrograman Python"
    lesson_id      = "lesson-01"
    num_questions  = 3
    difficulty     = "medium"
    question_style = "code_analysis"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/v1/generate-quiz" -Method Post -Body $quizPayload -ContentType "application/json" | ConvertTo-Json
```

---

## ✅ KESIMPULAN PENILAIAN
Jika seluruh poin di atas bertanda centang [x], maka **Milestone 3 (Auto-Ingestion, RAG Synchronization, & Side Features)** dinyatakan **LULUS & SIAP PRODUKSI**.
